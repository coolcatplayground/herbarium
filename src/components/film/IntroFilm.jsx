import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Plate from "./Plate";
import { TUMBLE } from "./drawings";
import {
  CAPTIONS,
  DURATION,
  SHEETS,
  SHOTS,
  TITLE,
  TRANSCRIPT,
  appear,
  formatNo,
  rollStops,
  rollTimeAt,
  track,
} from "../../data/introFilm";

// Where the seed lands, in the plate's units, and how far behind the plant's
// centre it falls.
const SEEDS = [380, 322, 272];
const SEED_LAG = 40;

// The introduction at the top of the Gallery.
//
// Built as a live animation rather than a video file, and the reasons are
// practical: text that stays text (sharp at every size, readable by a screen
// reader, searchable), a few kilobytes of code instead of megabytes of
// footage, pictures the rooms already serve, and something that can honour
// reduced-motion and pause itself when nobody is looking at it.
//
// It plays once per visit. After that — and always, for anyone who has asked
// their system for reduced motion — it rests on its last frame, the title in
// front of the crest, with a button to play it again.
//
// Every moving part is a Web Animation of the film's full length, with its
// keyframes placed on the one clock in introFilm.js. So pausing is pausing
// every animation, skipping is finishing them, replaying is rewinding them,
// and there is no second timer anywhere that could drift out of step.

const SEEN_KEY = "cc-herbarium-intro-seen";

function alreadySeen() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* a film that replays is a smaller problem than a page that breaks */
  }
}

// Every keyframe track the film uses, keyed by the element's data-track.
function buildTracks(reduce) {
  const T = {};
  const still = reduce;

  // Opening shot: a slow pan across the map, left to right. The fade is on
  // the shot's frame and the movement on the picture inside it, so the
  // vignette on the frame stays put while the painting drifts under it.
  T["shot-wild"] = track([
    [0, { opacity: 0 }, "ease-out"],
    [1.6, { opacity: 1 }],
    [8.6, { opacity: 1 }],
    [9.2, { opacity: 0 }],
  ]);
  T["shot-wild-move"] = track([
    [0, { transform: still ? "scale(1.06)" : "scale(1.12) translate(4%, 1%)" }, "cubic-bezier(.35,0,.65,1)"],
    [9.2, { transform: still ? "scale(1.06)" : "scale(1.12) translate(-4%, -0.8%)" }],
  ]);

  for (const c of CAPTIONS) T[`cap-${c.id}`] = appear(c.in, c.out);

  SHEETS.forEach((s, i) => {
    const from = i === 0 ? "translateY(102%)" : "translateX(102%)";
    T[`sheet-${s.id}`] = track([
      [s.at, { transform: from, opacity: 1 }, "cubic-bezier(.2,.75,.25,1)"],
      [s.at + 0.85, { transform: "translate(0, 0)" }],
    ]);
    T[`label-${s.id}`] = appear(s.at + 1.5, null, 12);
    T[`line-${s.id}`] = appear(s.at + 1.85, null, 6);
    const typed = Math.max(0.9, s.organ.length * 0.035);
    T[`organ-${s.id}`] = track([
      [s.at + 2.5, { clipPath: "inset(0 100% 0 0)" }, `steps(${s.organ.length}, end)`],
      [s.at + 2.5 + typed, { clipPath: "inset(0 0% 0 0)" }],
    ]);
    T[`cf-${s.id}`] = appear(s.at + 2.7 + typed, null, 4);
    T[`wash-${s.id}`] = track([
      [s.at + 2.8, { opacity: 0 }, "ease-in-out"],
      [s.at + 3.9, { opacity: 1 }],
    ]);
    T[`fine-${s.id}`] = track([
      [s.at + 2.3, { opacity: 0 }, "ease-in-out"],
      [s.at + 3.3, { opacity: 1 }],
    ]);
  });

  // The tumbleweed rolls in finished, rather than being drawn: it is the one
  // specimen whose whole point is that it moves.
  const tw = SHEETS.find((s) => s.id === "tumbleweed");
  const rollAt = tw.at + 1.0;
  // The ground is down before anything lands on it.
  T["tw-ground"] = track([
    [tw.at + 0.35, { strokeDashoffset: "1" }, "ease-out"],
    [tw.at + 0.95, { strokeDashoffset: "0" }],
  ]);
  if (still) {
    T["tw-roll"] = track([
      [rollAt, { opacity: 0, transform: "translate(0%, 0%) rotate(0deg)" }],
      [rollAt + 1.2, { opacity: 1 }],
    ]);
    T["tw-shadow"] = track([
      [rollAt, { opacity: 0, transform: "translate(0%, 0%)" }],
      [rollAt + 1.2, { opacity: 1 }],
    ]);
  } else {
    const roll = rollStops(rollAt, TUMBLE.r);
    T["tw-roll"] = track(roll.map(([t, p, e]) => [t, { ...p, opacity: 1 }, e]));
    T["tw-shadow"] = track(
      // the shadow keeps to the ground: same x, no hop, no spin
      roll.map(([t, p, e]) => [t, { transform: p.transform.replace(/,\s*-?[\d.]+%\)/, ", 0%)").replace(/ rotate\([^)]*\)/, ""), opacity: 1 }, e]),
    );
  }
  // Seed, dropped just behind it as it passes — a tumbleweed is a seed drill.
  // Timed from the roll itself: each seed falls as the plant's centre passes
  // SEED_LAG units beyond it.
  SEEDS.forEach((sx, k) => {
    const t = rollAt + rollTimeAt(sx + SEED_LAG - TUMBLE.cx);
    T[`seed-${k}`] = track([
      [t, { opacity: 0, transform: "translateY(-10px) scale(.4)" }, "ease-in"],
      [t + 0.3, { opacity: 1, transform: "translateY(0px) scale(1)" }],
    ]);
  });

  // The title, in front of the crest.
  T["shot-title"] = track([
    [TITLE.at, { opacity: 0 }, "ease-in-out"],
    [TITLE.at + 1.3, { opacity: 1 }],
  ]);
  T["shot-title-move"] = track([
    [TITLE.at, { transform: "scale(1)" }, "cubic-bezier(.3,0,.6,1)"],
    [DURATION, { transform: still ? "scale(1)" : "scale(1.06)" }],
  ]);
  T["title"] = appear(TITLE.placardAt, null, 14);
  T["stamp"] = track([
    [TITLE.stampAt, { opacity: 0, transform: "scale(1.7) rotate(-14deg)" }, "cubic-bezier(.55,0,.8,.4)"],
    [TITLE.stampAt + 0.24, { opacity: 1, transform: "scale(.94) rotate(-7deg)" }, "ease-out"],
    [TITLE.stampAt + 0.45, { transform: "scale(1) rotate(-7deg)" }],
  ]);

  T["progress"] = track([
    [0, { transform: "scaleX(0)" }, "linear"],
    [DURATION, { transform: "scaleX(1)" }],
  ]);
  return T;
}

// Each contour line of a drawn plate draws itself on in turn.
function inkTracks(root) {
  const out = [];
  for (const s of SHEETS) {
    const lines = root.querySelectorAll(`[data-sheet="${s.id}"] [data-ink]`);
    const n = lines.length;
    lines.forEach((el, i) => {
      const start = s.at + 0.8 + (i / Math.max(1, n)) * 1.7;
      out.push([
        el,
        track([
          [start, { strokeDashoffset: "1", opacity: 0 }, "linear"],
          [start + 0.02, { opacity: 1 }, "ease-in-out"],
          [start + 0.9, { strokeDashoffset: "0" }],
        ]),
      ]);
    });
  }
  return out;
}

// The tumbleweed's sheet. The ground, the grass and the seed are one static
// SVG; the plant and its shadow are HTML layers on top of it.
//
// That split is for smoothness. Rolled inside the SVG, as it first was, every
// frame repainted the whole drawing — some two hundred and fifty twigs — on
// the main thread, which is exactly where a frame gets dropped. As its own
// layer, the plant is painted once and the compositor moves and turns the
// finished picture, which is the one kind of animation a browser can promise
// to keep at the screen's own frame rate.
function TumbleScene() {
  const { cx, cy, ground } = TUMBLE;
  return (
    <div className="film__tumble" aria-hidden="true">
      <svg className="plate__layer" viewBox="0 0 400 400" focusable="false">
        <path
          className="plate__ink film__ground"
          data-track="tw-ground"
          pathLength="1"
          // Out to 960, past where a desktop sheet ends (~827): the tumbleweed
          // arrives from the right and must never touch down on bare paper.
          d={`M-60,${ground + 1} C180,${ground - 1} 560,${ground + 2} 960,${ground}`}
          style={{ strokeWidth: 1.2 }}
        />
        {[-10, 26, 58, 330, 360, 540, 620, 700, 790].map((x, i) => (
          <path key={i} className="plate__fine" d={`M${x},${ground} l2,-6 M${x + 5},${ground} l-1,-8 M${x + 9},${ground} l3,-5`} />
        ))}
        {SEEDS.map((x, k) => (
          // The group takes the animation; the seed inside keeps its own tilt.
          // A CSS transform on the ellipse itself would replace that rotate().
          <g key={k} className="film__seed" data-track={`seed-${k}`}>
            <ellipse cx={x} cy={ground - 1.5} rx={2.6} ry={1.6} transform={`rotate(${k * 40 - 30} ${x} ${ground - 1.5})`} />
          </g>
        ))}
      </svg>
      <div
        className="film__tw-shadow"
        data-track="tw-shadow"
        style={{
          background: `radial-gradient(ellipse 20% 2.4% at ${cx / 4}% ${(ground + 2) / 4}%, rgba(58, 46, 34, 0.34), rgba(58, 46, 34, 0.12) 55%, rgba(58, 46, 34, 0) 100%)`,
        }}
      />
      <div className="film__tw-roll" data-track="tw-roll" style={{ transformOrigin: `${cx / 4}% ${cy / 4}%` }}>
        <Plate id="tumbleweed" />
      </div>
    </div>
  );
}

export default function IntroFilm() {
  const rootRef = useRef(null);
  const wildRef = useRef(null);
  const animsRef = useRef([]);
  const masterRef = useRef(null);
  const autoPausedRef = useRef(false);
  // loading · playing · paused · ended
  const [mode, setMode] = useState("loading");

  const play = useCallback(async ({ rewind } = {}) => {
    const anims = animsRef.current;
    if (rewind) anims.forEach((a) => (a.currentTime = 0));
    // Never start the story in the dark: wait for the opening shot, but not
    // for ever — a slow picture is better late than a film that never begins.
    const img = wildRef.current;
    if (img && !img.complete) {
      setMode("loading");
      await Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 3000))]);
    }
    markSeen();
    autoPausedRef.current = false;
    anims.forEach((a) => a.play());
    setMode("playing");
  }, []);

  const pause = useCallback(() => {
    // A visitor pause outranks a page pause: scrolling back must not undo it.
    autoPausedRef.current = false;
    animsRef.current.forEach((a) => a.pause());
    setMode("paused");
  }, []);

  const skip = useCallback(() => {
    markSeen();
    animsRef.current.forEach((a) => a.finish());
    setMode("ended");
  }, []);

  // Build every animation once, paused, before the first paint — so a visitor
  // who is not going to see it play never sees a first frame flash past on the
  // way to the last one.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const T = buildTracks(reduce);
    const opts = { duration: DURATION * 1000, fill: "both" };
    const anims = [];

    root.querySelectorAll("[data-track]").forEach((el) => {
      const kf = T[el.dataset.track];
      if (!kf) return;
      const a = el.animate(kf, opts);
      a.pause();
      anims.push(a);
      if (el.dataset.track === "progress") masterRef.current = a;
    });
    for (const [el, kf] of inkTracks(root)) {
      const a = el.animate(kf, opts);
      a.pause();
      anims.push(a);
    }
    animsRef.current = anims;

    masterRef.current.onfinish = () => setMode("ended");

    if (reduce || alreadySeen()) {
      anims.forEach((a) => a.finish());
      setMode("ended");
    } else {
      play();
    }

    return () => anims.forEach((a) => a.cancel());
  }, [play]);

  // Pause while it is scrolled out of sight or the tab is hidden, and pick up
  // again on return — but only if it was the page that paused it, never
  // overriding a visitor who pressed Pause themselves.
  useEffect(() => {
    const root = rootRef.current;
    const hold = () => {
      if (masterRef.current?.playState === "running") {
        autoPausedRef.current = true;
        animsRef.current.forEach((a) => a.pause());
      }
    };
    const resume = () => {
      if (autoPausedRef.current && !document.hidden) {
        autoPausedRef.current = false;
        animsRef.current.forEach((a) => a.play());
      }
    };
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio < 0.3 ? hold() : resume()), {
      threshold: [0, 0.3, 0.6],
    });
    io.observe(root);
    const onVis = () => (document.hidden ? hold() : resume());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const base = import.meta.env.BASE_URL;
  const running = mode === "playing" || mode === "paused";

  return (
    <section className="film-wrap" aria-labelledby="film-heading">
      <h2 id="film-heading" className="sr-only">
        An introduction to the herbarium
      </h2>
      <p className="sr-only">{TRANSCRIPT}</p>

      <div className="film" ref={rootRef} data-mode={mode}>
        <div className="film__stage" aria-hidden="true">
          <div className="film__shot film__shot--wild" data-track="shot-wild">
            <img ref={wildRef} data-track="shot-wild-move" src={`${base}${SHOTS.wild}`} alt="" decoding="async" />
          </div>
          {CAPTIONS.slice(0, 2).map((c) => (
            <p key={c.id} className="film__caption" data-track={`cap-${c.id}`}>
              {c.text}
            </p>
          ))}

          {SHEETS.map((s) => (
            <div key={s.id} className={`film__sheet film__sheet--${s.id}`} data-track={`sheet-${s.id}`} data-sheet={s.id}>
              <div className="film__figure">
                {s.id === "tumbleweed" ? <TumbleScene /> : <Plate id={s.id} drawn />}
              </div>
              <div className="film__label" data-track={`label-${s.id}`}>
                <p className="film__label-head">
                  <span>CC Herbarium</span>
                  <span>{formatNo(s.no)}</span>
                </p>
                <p className="film__label-line" data-track={`line-${s.id}`}>
                  {s.line}
                </p>
                <p className="film__label-organ" data-track={`organ-${s.id}`}>
                  {s.organ}
                </p>
                <p className="film__label-cf" data-track={`cf-${s.id}`}>
                  {s.cf}
                </p>
              </div>
            </div>
          ))}

          <div className="film__shot film__shot--title" data-track="shot-title">
            <img data-track="shot-title-move" src={`${base}${SHOTS.title}`} alt="" decoding="async" />
          </div>
          <p className="film__caption" data-track="cap-notice">
            {CAPTIONS[2].text}
          </p>
          <div className="film__title" data-track="title">
            <p className="eyebrow">{TITLE.eyebrow}</p>
            <p className="film__title-name">{TITLE.name}</p>
            <p className="film__title-sub">{TITLE.sub}</p>
            <span className="film__stamp" data-track="stamp">
              {TITLE.stamp}
            </span>
          </div>

          <div className="film__progress" data-track="progress" />
        </div>

        <div className="film__controls">
          {running ? (
            <>
              <button type="button" className="film__btn" onClick={mode === "paused" ? () => play() : pause}>
                {mode === "paused" ? "Play" : "Pause"}
              </button>
              <button type="button" className="film__btn" onClick={skip}>
                Skip
              </button>
            </>
          ) : mode === "ended" ? (
            <button type="button" className="film__btn" onClick={() => play({ rewind: true })}>
              <span aria-hidden="true">&#9656; </span>Play the introduction
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
