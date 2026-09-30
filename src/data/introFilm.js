// The introduction at the top of the Gallery: its script, and its clock.
//
// Every word the film says is here, and every word of it is a claim the
// collection already makes — the test beside this file checks that each
// sheet's "cf." rests on a word in that specimen's own field note, and that
// each room it names is a room the Gallery really has, so the film cannot
// start saying things the collection doesn't.
//
// Times are in seconds from the start. The film is one clock: every moving
// part is an animation of the full DURATION, and its keyframes are placed at
// these times as fractions of it. That is what lets the whole thing pause,
// skip to the end, replay and be seeked to any frame for a screenshot by
// treating every animation identically.

import habitatMap from "./habitatMap";

// The opening shot pans across the map in the Exhibition Hall; the title is
// set in the Specimen Room, in front of the crest on its back wall. Both are
// the rooms' existing web copies, so a visitor who has been in either room
// already has the picture.
export const SHOTS = {
  wild: "rooms/exhibition-hall.jpg",
  title: "rooms/specimen-room.jpg",
};

// One sheet for every room in the Gallery, each carrying one specimen filed
// there, shown by its own plate. Ordered by number rather than by room, so the
// NO. on the labels climbs through the whole collection as the rooms go by.
//
// Which room a specimen stands in is the Gallery's call, not the film's: the
// secondary type from PokéAPI, or the curator's override (Cacnea is filed in
// Nocturnal-Function Flora by hand). Each pick below was checked against that
// when it was made; the room itself is looked up from habitatMap, so a room
// renamed there is renamed here.
//
// `genus` is the word in the specimen's field note that the "cf." rests on.
// `slug` names the plate and the note — the film itself never names the
// creature, only the part and the number, so anyone who knows the games can
// close the loop themselves.
const PICKS = [
  // slug               no   room        the part            cf.                                genus
  ["bulbasaur",          1, "poison",   "corm",              "cf. Crocus",                      "Crocus"],
  ["paras",             46, "bug",      "fruiting bodies",   "cf. Cordyceps",                   "Cordyceps"],
  ["voltorb-hisui",    100, "electric", "cone",              "cf. the pinecone",                "Pinecone"],
  ["exeggcute",        102, "psychic",  "seed clutch",       "cf. a many-seeded citrus pip",    "citrus"],
  ["jumpluff",         189, "flying",   "seed heads",        "cf. the dandelion clock",         "dandelion"],
  ["sunflora",         192, "none",     "flower head",       "cf. Helianthus annuus",           "Helianthus annuus"],
  ["lotad",            270, "water",    "floating leaf",     "cf. Nymphaea",                    "Nymphaea"],
  ["cacnea",           331, "dark",     "barrel stem",       "cf. the barrel cactus",           "Barrel"],
  ["lileep",           345, "rock",     "crown and stalk",   "cf. a sea lily — a crinoid",      "crinoid"],
  ["torterra",         389, "ground",   "sheltering tree",   "cf. an ecosystem-supporting tree", "ecosystem-supporting tree"],
  ["snover",           459, "ice",      "shoot under snow",  "cf. a frost-tolerant conifer",    "Frost-tolerant conifer"],
  ["whimsicott",       547, "fairy",    "seed fluff",        "cf. cotton, on the wind",         "cotton"],
  ["sawsbuck",         586, "normal",   "flowering branch",  "cf. a deciduous tree in spring",  "deciduous tree"],
  ["ferroseed",        597, "steel",    "burr",              "cf. Xanthium, the cocklebur",     "Xanthium"],
  ["chesnaught",       652, "fighting", "husk and nut",      "cf. a fully lignified seed",      "lignified seed"],
  ["pumpkaboo-average", 710, "ghost",   "fruit",             "cf. Cucurbita",                   "Cucurbita"],
  ["applin",           840, "dragon",   "fruit",             "cf. Malus domestica",             "Malus domestica"],
  ["scovillain",       952, "fire",     "pods",              "cf. Capsicum",                    "Capsicum"],
];

// The sheets come quickly — this is the breadth of the collection going past,
// not a lecture on each — so the label is built to be read at a glance: the
// room's name is the line the eye lands on, and it is the one line the test
// holds to a full reading rate.
export const SHEET_START = 8.0;
export const SHEET_GAP = 1.65;
// How long a sheet takes to slide over the one before it.
export const SHEET_SLIDE = 0.55;

export const SHEETS = PICKS.map(([slug, no, habitat, part, cf, genus], i) => ({
  id: slug,
  slug,
  no,
  habitat,
  room: habitatMap[habitat].name,
  part,
  cf,
  genus,
  at: +(SHEET_START + i * SHEET_GAP).toFixed(2),
}));

const TITLE_AT = +(SHEETS.at(-1).at + 1.75).toFixed(2);

export const CAPTIONS = [
  { id: "wild", text: "Out in the wild grow plants nobody planted.", in: 1.0, out: 4.4 },
  { id: "drawn", text: "Somebody drew them — from real ones.", in: 4.8, out: 7.9 },
  { id: "notice", text: "Once you notice it, you can’t stop noticing.", in: TITLE_AT + 0.7, out: TITLE_AT + 4.0 },
];

export const TITLE = {
  at: TITLE_AT,
  // Not "Welcome to": the Gallery's own placard says that directly underneath,
  // and two welcomes in a row read as a stammer. This is the README's phrase.
  eyebrow: "Open daily",
  name: "CC Herbarium",
  sub: "Every Grass-type on record, pressed and filed beside the plant it echoes.",
  stamp: "Please don’t tap on the glass",
  placardAt: TITLE_AT + 4.0,
  stampAt: TITLE_AT + 5.0,
};

export const DURATION = +(TITLE.stampAt + 0.8).toFixed(2);

export const formatNo = (n) => `NO. ${String(n).padStart(4, "0")}`;
export const formatRoom = (i) => `Room ${String(i + 1).padStart(2, "0")} of ${SHEETS.length}`;

// The whole story as prose, for anyone who cannot or would rather not watch
// it. Screen readers get this instead of the film; the film itself is hidden
// from them, since reading out forty seconds of staggered fragments would be
// worse than useless.
export const TRANSCRIPT = [
  CAPTIONS[0].text,
  CAPTIONS[1].text,
  `One specimen from each of the Gallery’s ${SHEETS.length} rooms:`,
  ...SHEETS.map((s) => `${s.room}, ${formatNo(s.no)} — the ${s.part}, ${s.cf}.`),
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
export function appear(a, b, rise = 10, fade = 0.55) {
  const stops = [
    [a, { opacity: 0, transform: `translateY(${rise}px)` }],
    [a + fade, { opacity: 1, transform: "translateY(0px)" }, "ease-out"],
  ];
  if (b != null) {
    stops.push([b - 0.35, { opacity: 1, transform: "translateY(0px)" }]);
    stops.push([b, { opacity: 0, transform: `translateY(${-rise / 2}px)` }]);
  }
  return track(stops);
}
