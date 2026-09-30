// The introduction at the top of the Gallery: its script, and its clock.
//
// Every word the film says is here, and every word of it is a claim the field
// notes already make — the test beside this file checks that each sheet's
// "cf." genus appears in that specimen's own note, so the film cannot start
// saying things the collection doesn't.
//
// Times are in seconds from the start. The film is one clock: every moving
// part is an animation of the full DURATION, and its keyframes are placed at
// these times as fractions of it. That is what lets the whole thing pause,
// skip to the end, replay and be seeked to any frame for a screenshot by
// treating every animation identically.

export const DURATION = 33;

// The opening shot pans across the map in the Exhibition Hall; the title is
// set in the Specimen Room, in front of the crest on its back wall. Both are
// the rooms' existing web copies, so a visitor who has been in either room
// already has the picture.
export const SHOTS = {
  wild: "rooms/exhibition-hall.jpg",
  title: "rooms/specimen-room.jpg",
};

export const CAPTIONS = [
  { id: "wild", text: "Out in the wild grow plants nobody planted.", in: 1.0, out: 4.4 },
  { id: "drawn", text: "Somebody drew them — from real ones.", in: 4.8, out: 7.9 },
  { id: "notice", text: "Once you notice it, you can’t stop noticing.", in: 27.9, out: 31.2 },
];

// One sheet per plate. `slug` is the specimen the part belongs to, used only
// by the test that keeps the film honest to the field notes — the film itself
// never names the creature. The number is the Gallery's own, in its own format,
// so anyone who knows the games can close the loop themselves.
export const SHEETS = [
  {
    id: "corm",
    slug: "bulbasaur",
    no: 1,
    line: "Carries a bulb. It isn’t one.",
    organ: "corm · solid stem, no rings",
    cf: "cf. Crocus",
    genus: "Crocus",
    at: 8.0,
  },
  {
    id: "pitcher",
    slug: "victreebel",
    no: 71,
    line: "Keeps its promise — and eats the customers.",
    organ: "pitcher · a crop of edible hairs",
    cf: "cf. Nepenthes albomarginata",
    genus: "Nepenthes albomarginata",
    at: 14.4,
  },
  {
    id: "tumbleweed",
    slug: "bramblin",
    no: 946,
    line: "A plant carrying out its last instruction.",
    organ: "tumbleweed · dies, snaps, rolls, sows",
    cf: "cf. Salsola, the Russian thistle",
    genus: "Salsola",
    at: 20.8,
  },
];

export const TITLE = {
  at: 27.2,
  // Not "Welcome to": the Gallery's own placard says that directly underneath,
  // and two welcomes in a row read as a stammer. This is the README's phrase.
  eyebrow: "Open daily",
  name: "CC Herbarium",
  sub: "Every Grass-type on record, pressed and filed beside the plant it echoes.",
  stamp: "Please don’t tap on the glass",
  placardAt: 31.2,
  stampAt: 32.2,
};

export const formatNo = (n) => `NO. ${String(n).padStart(4, "0")}`;

// The whole story as prose, for anyone who cannot or would rather not watch
// it. Screen readers get this instead of the film; the film itself is hidden
// from them, since reading out thirty seconds of staggered fragments would be
// worse than useless.
export const TRANSCRIPT = [
  CAPTIONS[0].text,
  CAPTIONS[1].text,
  ...SHEETS.map((s) => `${formatNo(s.no)}: ${s.line} ${s.organ.replace(" · ", " — ")}, ${s.cf}.`),
  CAPTIONS[2].text,
  `${TITLE.name}, ${TITLE.eyebrow.toLowerCase()}. ${TITLE.sub} ${TITLE.stamp}.`,
].join(" ");

// ── keyframe helpers ────────────────────────────────────────────────────────
//
// `track(stops)` turns a list of [seconds, props, easing?] into Web Animations
// keyframes on the film's one clock. Every property is carried in every
// keyframe, and the first and last stops are pinned to the ends of the clock,
// so nothing depends on the browser inventing an implicit keyframe from the
// element's resting style — which is exactly the sort of thing that differs
// between browsers and between a first play and a replay.
export function track(stops) {
  const sorted = [...stops].sort((a, b) => a[0] - b[0]);
  const keys = Object.keys(Object.assign({}, ...sorted.map((s) => s[1])));
  const filled = [];
  let last = {};
  for (const [t, props, easing] of sorted) {
    last = { ...last, ...props };
    filled.push([t, last, easing]);
  }
  // back-fill the earliest value of each property into stops before it
  for (const k of keys) {
    const first = filled.find(([, p]) => k in p);
    for (const f of filled) {
      if (k in f[1]) break;
      f[1] = { ...f[1], [k]: first[1][k] };
    }
  }
  const frames = filled.map(([t, props, easing]) => ({
    offset: Math.min(1, Math.max(0, t / DURATION)),
    easing: easing || "ease",
    ...props,
  }));
  if (frames[0].offset > 0) frames.unshift({ ...frames[0], offset: 0, easing: "linear" });
  if (frames[frames.length - 1].offset < 1) frames.push({ ...frames[frames.length - 1], offset: 1 });
  return frames;
}

// A thing that fades and rises in at `a` and away at `b`.
export function appear(a, b, rise = 10) {
  const stops = [
    [a, { opacity: 0, transform: `translateY(${rise}px)` }],
    [a + 0.55, { opacity: 1, transform: "translateY(0px)" }, "ease-out"],
  ];
  if (b != null) {
    stops.push([b - 0.35, { opacity: 1, transform: "translateY(0px)" }]);
    stops.push([b, { opacity: 0, transform: `translateY(${-rise / 2}px)` }]);
  }
  return track(stops);
}

// The tumbleweed's roll, in the plate's own units. Rotation follows distance
// — a ball of radius r turns x/r radians rolling x — so it rolls rather than
// skids, and the bounces shrink as it runs out of momentum.
//
// It starts far enough right to be off the sheet altogether, so it rolls in
// rather than appearing: starting at 480 it was already on the paper in its
// first frame, and popped into existence at the right-hand edge. On a desktop
// frame the sheet ends about 827 units from the plate's origin, so the start
// has to clear that with the ball's radius and its stragglers to spare.
export const ROLL_HOPS = [
  // [seconds after the roll begins, x, y] — y negative is up
  [0.0, 800, 0],
  [0.5, 640, -16],
  [0.95, 500, 0],
  [1.4, 370, -12],
  [1.8, 260, 0],
  [2.2, 170, -7],
  [2.55, 100, 0],
  [2.9, 48, -3],
  [3.2, 12, 0],
  [3.5, -3, 0],
  [3.75, 0, 0],
];

// When, after the roll begins, the tumbleweed passes offset x. Seed is dropped
// by asking this, so the seed lands behind the plant because it is computed
// from where the plant is — change the roll and the seed follows it.
export function rollTimeAt(x) {
  for (let i = 0; i < ROLL_HOPS.length - 1; i++) {
    const [t0, x0] = ROLL_HOPS[i];
    const [t1, x1] = ROLL_HOPS[i + 1];
    if ((x0 - x) * (x1 - x) <= 0 && x0 !== x1) return t0 + ((x0 - x) / (x0 - x1)) * (t1 - t0);
  }
  return ROLL_HOPS.at(-1)[0];
}

export function rollStops(at, r) {
  const hops = ROLL_HOPS;
  // Emitted in percent of the plate's own box (400 units, so 1% = 4 units),
  // because the tumbleweed now rolls as an HTML layer rather than inside the
  // SVG — see TumbleScene — and a percentage of its own box is the same
  // distance on a phone as on a desktop.
  return hops.map(([dt, x, y], i) => [
    at + dt,
    { transform: `translate(${x / 4}%, ${y / 4}%) rotate(${Math.round(((x / r) * 180) / Math.PI)}deg)` },
    i % 2 ? "ease-in" : "ease-out",
  ]);
}
