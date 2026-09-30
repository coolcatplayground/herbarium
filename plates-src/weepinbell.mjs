// NO. 0070 — the trap, working.
//
// What the morphology says, and what each observation became:
//
//   1. The bell has become a pitcher: a hanging, pear-shaped trap, yellow,
//      freckled brown, with a wide mouth open on its face and a thick pink
//      lip round it — the peristome, slippery when wet, which is how the prey
//      goes in.
//   2. It hangs from a woody hook at its crown: a pitcher is a leaf's tip,
//      and the hook is the tendril it hangs by.
//   3. Two broad leaves spread from its shoulders like wings.
//   4. Fig. 2 cuts it open: the smooth waxy wall above that nothing can grip,
//      the gland-dotted digestive zone below, and the pool at the bottom with
//      the catch in it.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid, spotsOn } from "./kit.mjs";

export const slug = "weepinbell";
export const no = 70;
const SIZE = 800;

const YELLOW = { light: "#f7f3bb", base: "#ece870", deep: "#c8c24c", shade: "#8e892e", edge: "#8a842c" };
const LEAF = { light: "#d2ebb8", base: "#a4d48e", deep: "#6aa25e", shade: "#43723f", edge: "#467443" };
const BODY_KNOTS = [[0, 0.3], [0.1, 0.72], [0.28, 0.96], [0.44, 1], [0.6, 0.91], [0.78, 0.68], [0.92, 0.38], [1, 0]];

export function draw() {
  const rand = mulberry32(70);
  const defs = standardDefs(70);
  const out = [];
  const P = makeOrgan({ x: 330, base: 720, H: 320, R: 132, tilt: 0.1, knots: BODY_KNOTS });
  contact(out, 330, 748, 150, 16);

  // the hook it hangs by, rising out of its crown and curling back over
  const [cx, cy] = P.surface(0, 1);
  const hook = `M${cx - 9},${cy + 10} C${cx - 12},${cy - 40} ${cx + 10},${cy - 92} ${cx + 58},${cy - 96} C${cx + 94},${cy - 98} ${cx + 104},${cy - 64} ${cx + 88},${cy - 44} ` +
    `C${cx + 84},${cy - 52} ${cx + 80},${cy - 74} ${cx + 58},${cy - 80} C${cx + 22},${cy - 80} ${cx + 8},${cy - 40} ${cx + 9},${cy + 10} Z`;
  defs.push(`<linearGradient id="hk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b09366"/><stop offset="1" stop-color="#6e5634"/></linearGradient>`);
  out.push(`<path d="${hook}" fill="url(#hk)"/><path d="${hook}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);

  // the two leaves from its shoulders
  for (const side of [-1, 1]) {
    const [sx, sy] = P.surface(side * 1.15, 0.7);
    const pts = [];
    for (let i = 0; i <= 4; i++) {
      const u = i / 4;
      pts.push([sx + side * 190 * u, sy - 60 * u - 30 * Math.sin(Math.PI * u)]);
    }
    const b = blade(pts, { width: (u) => 58 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.8), 0.72), sideVeins: 7, rand });
    paintBlade(b, { id: `l${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.25 : 0, margin: 6 });
  }

  const d = paintSolid(P, { id: "p", outline: hull(P), palette: YELLOW, defs, out, hatch: 6 });
  // brown freckles
  const freck = spotsOn(P, { rand, count: 26, t: [0.08, 0.9], theta: [-1.4, 1.4], size: [3, 7] })
    .filter(() => true);
  out.push(`<g clip-path="url(#pc)" fill="#a08a3e" fill-opacity="0.85">${freck.map((q) => `<path d="${q}"/>`).join("")}</g>`);
  // the mouth: a wide oval on its face, dark inside, with a thick pink lip
  const mouth = [];
  for (let i = 0; i < 40; i++) {
    const ph = (i / 40) * Math.PI * 2;
    mouth.push(P.surface(0.62 * Math.cos(ph), 0.46 + 0.17 * Math.sin(ph), 1.004));
  }
  const md = smooth(mouth, true);
  defs.push(`<radialGradient id="throat" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#2a0e10"/><stop offset="1" stop-color="#7a3036"/></radialGradient>`);
  out.push(`<path d="${md}" fill="url(#throat)"/>`);
  out.push(`<path d="${md}" fill="none" stroke="#e79aa2" stroke-width="13"/>`);
  out.push(`<path d="${md}" fill="none" stroke="#f6c8cd" stroke-width="4" transform="translate(-2 -2)"/>`);
  // the lip's ribs
  const ribs = [];
  for (let i = 0; i < 40; i += 1) {
    const ph = (i / 40) * Math.PI * 2;
    const [ax, ay] = P.surface(0.56 * Math.cos(ph), 0.46 + 0.145 * Math.sin(ph), 1.006), [bx, by] = P.surface(0.69 * Math.cos(ph), 0.46 + 0.195 * Math.sin(ph), 1.006);
    ribs.push(`M${r1(ax)},${r1(ay)} L${r1(bx)},${r1(by)}`);
  }
  out.push(`<path d="${ribs.join(" ")}" stroke="#b86470" stroke-width="1" stroke-opacity="0.7"/>`);
  out.push(`<path d="${md}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);

  // ── fig. 2: the trap in section ───────────────────────────────────────────
  const fx = 690, fb = 770, fs = 0.46;
  const right = [], left = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, w = 132 * fs * P.shape(t), y = fb - t * 320 * fs;
    right.push([fx + w, y]);
    left.push([fx - w, y]);
  }
  const outline = smooth(right) + smooth([...left].reverse(), false, { move: false }) + " Z";
  const inner = smooth(right.map(([x, y]) => [fx + (x - fx) * 0.84, y - 4])) + smooth([...left].reverse().map(([x, y]) => [fx + (x - fx) * 0.84, y - 4]), false, { move: false }) + " Z";
  out.push(`<path d="${outline}" fill="${YELLOW.base}"/>`);
  defs.push(`<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfbe6"/><stop offset="0.5" stop-color="#f2edc4"/><stop offset="1" stop-color="#e6d7a0"/></linearGradient>`);
  out.push(`<path d="${inner}" fill="url(#wall)"/>`);
  defs.push(`<clipPath id="innerc"><path d="${inner}"/></clipPath>`);
  // glands in the lower wall
  for (let k = 0; k < 40; k++) out.push(`<circle cx="${r1(fx - 48 + rand() * 96)}" cy="${r1(fb - 20 - rand() * 60)}" r="1.2" fill="#b89a4a" clip-path="url(#innerc)"/>`);
  // the pool, and the catch drowned in it
  out.push(`<rect x="${fx - 60}" y="${fb - 38}" width="120" height="40" fill="#a9c7b8" fill-opacity="0.8" clip-path="url(#innerc)"/>`);
  out.push(`<path d="M${fx - 50},${fb - 38} L${fx + 50},${fb - 38}" stroke="#6f9486" stroke-width="1.2" clip-path="url(#innerc)"/>`);
  const bx = fx + 4, by = fb - 20;
  out.push(`<g stroke="${INK}" stroke-width="0.9" fill="none">` +
    `<path d="M${bx - 6},${by - 3} l-6,-5 M${bx - 6},${by + 3} l-7,4 M${bx},${by - 4} l0,-7 M${bx},${by + 4} l1,7 M${bx + 6},${by - 3} l6,-5 M${bx + 6},${by + 3} l7,4"/></g>`);
  out.push(`<ellipse cx="${bx}" cy="${by}" rx="10" ry="6" fill="#4a3a2a" stroke="${INK}" stroke-width="0.8"/><circle cx="${bx - 12}" cy="${by}" r="3.4" fill="#3a2a1e"/>`);
  // downward-pointing hairs under the rim
  const hairs = [];
  for (let k = 0; k < 7; k++) {
    const y = fb - 320 * fs * 0.62 + k * 7;
    for (const sgn of [-1, 1]) {
      const w = 132 * fs * P.shape((fb - y) / (320 * fs)) * 0.84;
      hairs.push(`M${r1(fx + sgn * w)},${r1(y)} l${r1(-sgn * 7)},6`);
    }
  }
  out.push(`<path d="${hairs.join(" ")}" stroke="${INK}" stroke-width="0.8" stroke-opacity="0.7"/>`);
  out.push(`<path d="${inner}" fill="none" stroke="${INK}" stroke-opacity="0.5" stroke-width="0.9"/>`);
  out.push(`<path d="${outline}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  contact(out, fx, fb + 4, 56, 6, 0.24);

  return { size: SIZE, view: [0, 250, SIZE, 540], defs: defs.join("\n"), body: out.join("\n") };
}
