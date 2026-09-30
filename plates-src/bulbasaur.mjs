// NO. 0001 — the bulb.
//
// Drawn from the morphology, not from any artwork. What makes this organ its
// own thing, and what each observation became in the drawing:
//
//   1. Carried, never planted. It sits on the back from birth, so it has no
//      roots — the specimen shows the broad, pale attachment plate it was
//      lifted from instead.
//   2. Green, and in the sun. Real bulbs and corms live underground, pale or
//      brown. This one photosynthesises, so it is green, lightest across its
//      sunlit crown.
//   3. Squat, and bent over. Broader than it is tall, sitting low, its broad
//      fleshy scales closing in a spiral — and above the middle the whole
//      organ bends over to one side and runs out into a point. The squat mass
//      and the bend are the silhouette anyone who knows it knows.
//   4. A store that will one day open. The line blooms, so the flower must be
//      in there already — as it is in real geophytes: cut a tulip bulb and
//      there is a finished miniature flower inside. Fig. 2 is the organ cut
//      in half: thin green sheaths round a solid core (the field note's point
//      — a corm, not a bulb; no rings), and at its heart, the folded bud.
//
// The bulb is modelled, not sketched: a tube of varying radius round a spine
// that runs straight up and then bends, every cross-section turning with it.
// Outlines, which scale hides which, what is visible from where we stand and
// where the light falls are all worked out from that surface's own normals.
//
// Three earlier versions are worth recording, because each failed in a way
// that taught the shape. Stood tall with the tip only leaning, it read as an
// onion. With the axis sheared to fake a bend, the top flattened. With the
// curl drawn as a separate blade on a round body, it read as a fig on a
// stalk, or a garlic in a cap. The bend has to be the body's own.
import { mulberry32, r1, smooth, watercolour, blur, handInk, INK } from "./lib.mjs";
import { makeOrgan, makeScales, paintScales, attachmentPlate } from "./organ.mjs";

export const slug = "bulbasaur";
export const no = 1;
const SIZE = 800;

// ── the model ────────────────────────────────────────────────────────────────
// A tube round a spine that runs straight up and then bends over (organ.mjs),
// broad-based, plump low down, drawn in to a long point the bend carries over.
const B = { x: 272, base: 744, H: 500, R: 268, tilt: 0.22, bendFrom: 0.46, bendMax: 1.5 };
const ORGAN = makeOrgan({
  ...B,
  knots: [
    [0, 0.62], [0.06, 0.84], [0.18, 0.98], [0.3, 1], [0.44, 0.9],
    [0.58, 0.66], [0.7, 0.44], [0.82, 0.24], [0.92, 0.1], [1, 0],
  ],
});
// Five scales in a spiral. The one facing us is the outermost and overlaps
// both neighbours; outer scales stop short of the point, the innermost run on
// into it.
const SCALES = makeScales(ORGAN, {
  n: 5, phi0: -0.3, w0: 0.9,
  tEnd: (theta, k, back) => (back ? 1 : k === 0 ? 0.9 : theta < -1.3 ? 0.97 : 0.94),
});

// ── colour ───────────────────────────────────────────────────────────────────
const GREEN = { light: "#d4eba6", base: "#93c779", deep: "#4f8b58", shade: "#2c5a3c", edge: "#35684a", cast: "#173222" };

export function draw() {
  const rand = mulberry32(1);
  const defs = [
    watercolour("wc", 11, { warp: 6 }),
    watercolour("wc2", 23, { warp: 4, grain: 0.4 }),
    blur("soft", 3.2), blur("wide", 11), blur("sheen", 9),
    handInk("pen", 5),
  ];
  const out = [];
  const { surface, range } = ORGAN;

  // the silhouette, for the inner layer and for clipping cast shadows
  const silhouette = ORGAN.silhouette();
  defs.push(`<clipPath id="sil"><path d="${silhouette}"/></clipPath>`);
  const [tipX, tipY] = surface(0, 1);
  defs.push(
    `<linearGradient id="sun" gradientUnits="userSpaceOnUse" x1="${B.x - 230}" y1="${B.base - 480}" x2="${B.x + 240}" y2="${B.base + 10}">` +
      `<stop offset="0" stop-color="#fbffe8" stop-opacity="0.5"/><stop offset="0.45" stop-color="#fbffe8" stop-opacity="0"/></linearGradient>`,
  );

  // contact shadow on the case floor
  out.push(`<ellipse cx="${B.x + 20}" cy="${B.base + 30}" rx="${B.R * 1.05}" ry="26" fill="#1c140c" fill-opacity="0.28" filter="url(#wide)"/>`);

  // the attachment plate: torn where it came away from its bearer
  attachmentPlate(ORGAN, { rand, defs, out });

  // The inner scales, under everything: where the outer ones taper apart,
  // what shows is the next layer in, darker and tucked in shadow.
  defs.push(
    `<linearGradient id="inner" gradientUnits="userSpaceOnUse" x1="${B.x - 200}" y1="${B.base - 520}" x2="${B.x + 220}" y2="${B.base - 180}">` +
      `<stop offset="0" stop-color="#6fa865"/><stop offset="1" stop-color="${GREEN.shade}"/></linearGradient>`,
  );
  out.push(`<path d="${silhouette}" fill="url(#inner)"/>`);
  out.push(`<path d="${silhouette}" fill="url(#inner)" filter="url(#wc)"/>`);

  paintScales(ORGAN, SCALES, { id: "", palette: GREEN, rand, defs, out });

  // the sun across the crown
  out.push(`<path d="${silhouette}" fill="url(#sun)"/>`);
  // Contour hatching on the shadowed side: short strokes running with the
  // form, parallel to the edge, thinning out toward the light. Lines of
  // latitude were tried first, and turned the bulb into a globe.
  for (let k = 0; k < 7; k++) {
    const inset = 0.05 + k * 0.075;
    const t0 = 0.1 + k * 0.035 + rand() * 0.04;
    const t1 = 0.62 - k * 0.06 - rand() * 0.05;
    const pts = [];
    for (let j = 0; j <= 14; j++) {
      const t = t0 + ((t1 - t0) * j) / 14;
      pts.push(surface(range(t)[1] - inset, t));
    }
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${INK}" stroke-opacity="${r1(0.34 - k * 0.04)}" stroke-width="1.05" stroke-linecap="round"/>`);
  }
  out.push(`<g filter="url(#pen)"><path d="${silhouette}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="${silhouette}" fill="none" stroke="${INK}" stroke-opacity="0.5" stroke-width="2.2" transform="translate(1.6 1.4)"/></g>`);
  // the point itself, finished with a single stroke
  out.push(`<circle cx="${r1(tipX)}" cy="${r1(tipY)}" r="1.6" fill="${INK}"/>`);

  out.push(...section(defs, rand));
  // cropped to the subject: the bulb is squat, and the board above it empty
  return { size: SIZE, view: [0, 262, SIZE, 536], defs: defs.join("\n"), body: out.join("\n") };
}

// ── fig. 2: the organ cut in half ────────────────────────────────────────────
// Cut along the plane it bends in, so the section follows the same spine.
function section(defs, rand) {
  const S = { x: 676, base: 772, s: 0.36 };
  const Rs = B.R * S.s, Hs = B.H * S.s;
  const out = [];
  const outline = (inset) => {
    const right = [], left = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const w = B.R * ORGAN.shape(t) * S.s - inset;
      if (w <= 0) break;
      const [ax, ay, phi] = ORGAN.spineAt(t);
      const cx = S.x + ax * S.s, cy = S.base - ay * S.s - inset * 0.9;
      right.push([cx + w * Math.cos(phi), cy + w * Math.sin(phi)]);
      left.push([cx - w * Math.cos(phi), cy - w * Math.sin(phi)]);
    }
    return smooth(right) + smooth([...left].reverse(), false, { move: false }) + " Z";
  };

  out.push(`<ellipse cx="${S.x + 6}" cy="${S.base + 12}" rx="${Rs * 1.2}" ry="12" fill="#1c140c" fill-opacity="0.3" filter="url(#wide)"/>`);
  // the rounded back half, seen past the cut face
  out.push(`<g transform="translate(9 -5)"><path d="${outline(0)}" fill="${GREEN.deep}"/><path d="${outline(0)}" fill="none" stroke="${INK}" stroke-width="1.8"/></g>`);
  // the sheaths: thin, and only at the rim — not rings through the whole
  out.push(`<path d="${outline(0)}" fill="${GREEN.base}"/>`);
  out.push(`<path d="${outline(4.5)}" fill="#d5e8b2"/>`);
  out.push(`<path d="${outline(7.5)}" fill="#9fcc84"/>`);
  defs.push(`<linearGradient id="core" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#f7f3e0"/><stop offset="1" stop-color="#e9e4c3"/></linearGradient>`);
  out.push(`<path d="${outline(10)}" fill="url(#core)" filter="url(#wc2)"/>`);
  defs.push(`<clipPath id="coreclip"><path d="${outline(11)}"/></clipPath>`);

  const [bax, bay] = ORGAN.spineAt(0.6);
  const bx = r1(S.x + bax * S.s), by = r1(S.base - bay * S.s);

  // the store itself: solid, starchy, stippled — denser toward the base
  const dots = [];
  for (let i = 0; dots.length < 420 && i < 8000; i++) {
    const x = S.x - Rs + rand() * Rs * 2.6, y = S.base - rand() * Hs * 0.9;
    if (Math.hypot((x - bx) / 20, (y - by) / 34) < 1.25) continue;
    if (rand() > 0.35 + 0.65 * ((y - (S.base - Hs)) / Hs)) continue;
    dots.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(0.55 + rand() * 0.7)}"/>`);
  }
  out.push(`<g clip-path="url(#coreclip)" fill="#8a7a4e" fill-opacity="0.55">${dots.join("")}</g>`);

  // vascular strands, from the plate up to the bud
  for (const dx of [-44, -24, 0, 22, 42]) {
    out.push(`<path d="M${S.x + dx},${S.base - 8} C${S.x + dx * 0.8},${S.base - 40} ${bx + dx * 0.35},${by + 50} ${bx + dx * 0.12},${by + 26}" fill="none" stroke="#7faa66" stroke-opacity="0.55" stroke-width="1.1" clip-path="url(#coreclip)"/>`);
  }
  // the attachment plate, in section
  out.push(`<path d="M${S.x - Rs * 0.62},${S.base - 9} C${S.x - 20},${S.base - 13} ${S.x + 20},${S.base - 13} ${S.x + Rs * 0.62},${S.base - 9} L${S.x + Rs * 0.62},${S.base} L${S.x - Rs * 0.62},${S.base} Z" fill="#dccb98" stroke="${INK}" stroke-width="1" stroke-opacity="0.6"/>`);

  // the flower, already made, folded and waiting
  out.push(`<path d="M${S.x + 2},${S.base - 12} C${S.x},${by + 60} ${bx + 3},${by + 40} ${bx},${by + 18}" fill="none" stroke="#6c9b58" stroke-width="2.2"/>`);
  out.push(`<path d="M${bx - 16},${by + 30} C${bx - 30},${by + 6} ${bx - 22},${by - 20} ${bx - 8},${by - 34}" fill="none" stroke="#6c9b58" stroke-width="1.6" stroke-linecap="round"/>`);
  out.push(`<path d="M${bx + 16},${by + 30} C${bx + 30},${by + 6} ${bx + 22},${by - 20} ${bx + 9},${by - 32}" fill="none" stroke="#6c9b58" stroke-width="1.6" stroke-linecap="round"/>`);
  defs.push(`<linearGradient id="petal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2b7c6"/><stop offset="1" stop-color="#cf7f98"/></linearGradient>`);
  out.push(`<path d="M${bx},${by - 30} C${bx + 13},${by - 14} ${bx + 13},${by + 8} ${bx},${by + 20} C${bx - 13},${by + 8} ${bx - 13},${by - 14} ${bx},${by - 30} Z" fill="url(#petal)" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="M${bx},${by - 26} C${bx + 3},${by - 8} ${bx + 2},${by + 6} ${bx},${by + 16}" fill="none" stroke="#a45a74" stroke-width="0.9" stroke-opacity="0.8"/>`);
  // two sepals closing over it
  out.push(`<path d="M${bx - 1},${by + 20} C${bx - 16},${by + 10} ${bx - 15},${by - 8} ${bx - 6},${by - 20} C${bx - 8},${by - 4} ${bx - 6},${by + 8} ${bx - 1},${by + 20} Z" fill="#8fbf74" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${bx + 1},${by + 20} C${bx + 16},${by + 10} ${bx + 15},${by - 8} ${bx + 7},${by - 19} C${bx + 8},${by - 4} ${bx + 6},${by + 8} ${bx + 1},${by + 20} Z" fill="#8fbf74" stroke="${INK}" stroke-width="1"/>`);

  // the cut edge, heavier, as a section is drawn
  out.push(`<path d="${outline(10)}" fill="none" stroke="${INK}" stroke-opacity="0.5" stroke-width="0.9"/>`);
  out.push(`<path d="${outline(4.5)}" fill="none" stroke="${INK}" stroke-opacity="0.35" stroke-width="0.8"/>`);
  out.push(`<path d="${outline(0)}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`);
  return out;
}
