import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { plateUrl } from "../../data/plates";
import {
  CAPTIONS,
  DURATION,
  SHEETS,
  SHEET_SLIDE,
  SHOTS,
  TITLE,
  TRANSCRIPT,
  appear,
  formatNo,
  formatRoom,
  track,
} from "../../data/introFilm";

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

  // One sheet per room, each sliding over the last. A sheet is only shown
  // from the moment it starts to move until the next has covered it. Waiting
  // off the edge of the frame they were still casting their shadows onto it,
  // seventeen deep, which laid a dark band down the right-hand side; and
  // eighteen stacked sheets of paper, each with a plate and a shadow, are
  // eighteen layers for the compositor to keep when only the top one is seen.
  SHEETS.forEach((s, i) => {
    const first = i === 0;
    const from = first ? "translateY(102%)" : "translateX(102%)";
    const slide = first ? 0.85 : SHEET_SLIDE;
    const coveredAt = i < SHEETS.length - 1 ? SHEETS[i + 1].at + SHEET_SLIDE + 0.05 : TITLE.at + 1.4;
    T[`sheet-${s.id}`] = track([
      [s.at - 0.02, { transform: from, opacity: 0 }, "step-end"],
      [s.at, { opacity: 1 }, "cubic-bezier(.2,.75,.25,1)"],
      [s.at + slide, { transform: "translate(0, 0)" }],
      [coveredAt, { opacity: 1 }, "step-end"],
      [coveredAt + 0.01, { opacity: 0 }],
    ]);
    // The plate grows up from its ground line, the way the plant would: a
    // window rises from the ground while the plate inside it moves down by
    // exactly as much, so the plate stays put and is uncovered from the
    // bottom up. It is two opposed slides rather than an animated clip-path
    // because a browser can only hand transforms and opacity to the GPU. A
    // clip-path animation is redrawn on the main thread every frame, and
    // eighteen of them running the length of the film held it to nine frames
    // a second.
    const lead = first ? 0.45 : 0.2;
    const ease = "cubic-bezier(.3,.6,.35,1)";
    T[`grow-${s.id}`] = track([
      [s.at + lead, { transform: "translateY(100%)" }, ease],
      [s.at + lead + 0.75, { transform: "translateY(0%)" }],
    ]);
    T[`plate-${s.id}`] = track([
      [s.at + lead, { transform: "translateY(-100%)" }, ease],
      [s.at + lead + 0.75, { transform: "translateY(0%)" }],
    ]);
    const t = s.at + (first ? 0.6 : 0.3);
    T[`label-${s.id}`] = appear(t, null, 8, 0.35);
    T[`line-${s.id}`] = appear(t + 0.12, null, 5, 0.35);
    T[`organ-${s.id}`] = appear(t + 0.3, null, 4, 0.35);
    T[`cf-${s.id}`] = appear(t + 0.42, null, 4, 0.35);
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
    [TITLE.stampAt, { opacity: 0, transform: "scale(1.7) rotate(14deg)" }, "cubic-bezier(.55,0,.8,.4)"],
    [TITLE.stampAt + 0.24, { opacity: 1, transform: "scale(.94) rotate(6deg)" }, "ease-out"],
    [TITLE.stampAt + 0.45, { transform: "scale(1) rotate(6deg)" }],
  ]);

  T["progress"] = track([
    [0, { transform: "scaleX(0)" }, "linear"],
    [DURATION, { transform: "scaleX(1)" }],
  ]);
  return T;
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
    // Everything else is asked for now and not waited on: the eighteen plates
    // and the title shot have seconds to get ready before they are needed,
    // and a picture decoded ahead of its entrance does not cost a dropped
    // frame on the way in.
    rootRef.current?.querySelectorAll("img").forEach((i) => i !== img && i.decode?.().catch(() => {}));
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

          {SHEETS.map((s, i) => (
            <div key={s.id} className="film__sheet" data-track={`sheet-${s.id}`}>
              <div className="film__figure">
                <div className="film__grow" data-track={`grow-${s.id}`}>
                  <img
                    className="film__plate"
                    data-track={`plate-${s.id}`}
                    src={plateUrl(s.slug)}
                    alt=""
                    decoding="async"
                  />
                </div>
              </div>
              <div className="film__label" data-track={`label-${s.id}`}>
                <p className="film__label-head">
                  <span>{formatRoom(i)}</span>
                  <span>{formatNo(s.no)}</span>
                </p>
                <p className="film__label-line" data-track={`line-${s.id}`}>
                  {s.room}
                </p>
                <p className="film__label-organ" data-track={`organ-${s.id}`}>
                  the {s.part}
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
