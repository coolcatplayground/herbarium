// NO. 0346 — a kelp's anchor, and the tubes inside it.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the anchor. A kelp does not root; it grips. Its holdfast is
//      a clutch of branching finger-like haptera clamped over a rock, and from
//      it rises the stipe, and up the stipe the blades, each on a small round
//      float of gas that holds it up toward the light. The record is that its
//      body serves as an anchor so it is not washed away in rough seas; this
//      is the organ that does it. Green, the floats ringed pale yellow.
//   2. The field note's point is that the convergence goes further in than
//      the outline. Giant kelp moves sugar from its lit blades down to its
//      dim base through long tubes with perforated end walls — built on the
//      pattern of a land plant's phloem, arrived at entirely separately.
//      Fig. 2: two of those cells end to end, the sieve plate between them.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "cradily";
export const no = 346;
const SIZE = 800;
const KELP = { light: "#c8dc98", base: "#7ea458", deep: "#50763a", shade: "#2e4a22", edge: "#2e4a22" };
const HOLD = "#8e7a4a";

const bez = (p0, p1, p2, p3, t) => [0, 1].map((i) => (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t * t * p2[i] + t ** 3 * p3[i]);

export function draw() {
  const rand = mulberry32(346);
  const defs = standardDefs(346);
  const out = [];
  contact(out, 320, 758, 210, 16);

  // the rock
  const rock = `M170,760 C176,700 230,650 320,646 C410,642 470,690 478,760 Z`;
  defs.push(`<linearGradient id="rk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d2ccbe"/><stop offset="1" stop-color="#8e887a"/></linearGradient>`);
  out.push(`<path d="${rock}" fill="url(#rk)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);

  // the holdfast: haptera branching out from the stipe's foot and down over
  // the rock, gripping
  const foot = [322, 640];
  const hap = [];
  for (let k = 0; k < 13; k++) {
    const a = Math.PI * (0.02 + (k / 12) * 0.96);
    const L = 70 + rand() * 60;
    const ex = foot[0] - Math.cos(a) * L * 1.4, ey = foot[1] + 20 + Math.sin(a) * L * 0.5;
    hap.push({ d: `M${foot[0] + (rand() - 0.5) * 20},${foot[1] + 4} C${r1(foot[0] - Math.cos(a) * L * 0.5)},${r1(foot[1] - 6)} ${r1(ex + Math.cos(a) * 10)},${r1(ey - 30)} ${r1(ex)},${r1(ey)}`, ex, ey });
  }
  for (const { d, ex, ey } of hap) {
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${HOLD}" stroke-width="7" stroke-linecap="round"/>`);
    // each finger forks at its tip and clamps
    out.push(`<path d="M${r1(ex)},${r1(ey)} l-8,6 M${r1(ex)},${r1(ey)} l8,6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${r1(ex)},${r1(ey)} l-8,6 M${r1(ex)},${r1(ey)} l8,6" stroke="${HOLD}" stroke-width="2.2" stroke-linecap="round"/>`);
  }
  out.push(`<ellipse cx="${foot[0]}" cy="${foot[1] + 4}" rx="30" ry="14" fill="${HOLD}" stroke="${INK}" stroke-width="1.6"/>`);

  // the stipe, rising and leaning, blades on floats along it
  const S = [[foot[0], foot[1]], [330, 540], [380, 440], [470, 360]];
  const sd = smooth(Array.from({ length: 21 }, (_, k) => bez(...S, k / 20)));
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${sd}" fill="none" stroke="${KELP.deep}" stroke-width="10" stroke-linecap="round"/><path d="${sd}" fill="none" stroke="${KELP.base}" stroke-width="3" transform="translate(-2 0)"/>`);
  const BLADES = [[0.34, -1, 0.6], [0.56, 1, -0.2], [0.76, -1, 0.3], [0.94, 1, -0.4]];
  BLADES.forEach(([t, side, tilt], i) => {
    const [x, y] = bez(...S, t);
    const fx = x + side * 18, fy = y - 6;
    const a = (side < 0 ? Math.PI : 0) - 0.5 * side + tilt * 0.2;
    const L = 230 - i * 22;
    const pts = [[fx, fy], [fx + Math.cos(a) * L * 0.3, fy + Math.sin(a) * L * 0.3 - 14], [fx + Math.cos(a) * L * 0.6, fy + Math.sin(a) * L * 0.6 + 8], [fx + Math.cos(a) * L * 0.85, fy + Math.sin(a) * L * 0.85 + 30], [fx + Math.cos(a) * L, fy + Math.sin(a) * L + 56]];
    const b = blade(pts, { width: (u) => 19 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.5), 0.5), lobes: 22, depth: 0.16, start: 0.08, teeth: "round", sideVeins: 0, rand });
    paintBlade(b, { id: `bl${i}`, palette: KELP, defs, out, margin: 4, midrib: false, veinOpacity: 0 });
    // the blade's crinkles, running across it
    const cr = [];
    for (let j = 2; j < 14; j++) {
      const f = b.frames[Math.round((j / 14) * (b.frames.length - 1))];
      cr.push(`M${r1(f.p[0] - f.n[0] * 14)},${r1(f.p[1] - f.n[1] * 14)} L${r1(f.p[0] + f.n[0] * 14)},${r1(f.p[1] + f.n[1] * 14)}`);
    }
    out.push(`<path d="${cr.join(" ")}" stroke="${KELP.shade}" stroke-width="0.9" stroke-opacity="0.35"/>`);
    // the float at its base
    out.push(`<circle cx="${r1(fx)}" cy="${r1(fy)}" r="12" fill="${KELP.base}" stroke="${INK}" stroke-width="1.5"/><circle cx="${r1(fx)}" cy="${r1(fy)}" r="7.5" fill="none" stroke="#ecd57a" stroke-width="2.4"/><circle cx="${r1(fx - 3)}" cy="${r1(fy - 4)}" r="2.6" fill="#f4f8e0"/>`);
  });

  // ── fig. 2: two sieve cells end to end, the plate between ──────────────────
  const fx = 690, top = 590, bot = 764;
  const mid = (top + bot) / 2;
  for (const [y0, y1] of [[top, mid - 3], [mid + 3, bot]]) out.push(`<rect x="${fx - 30}" y="${y0}" width="60" height="${y1 - y0}" rx="10" fill="#e8f0d4" stroke="${INK}" stroke-width="1.5"/>`);
  // the sieve plate: a wall shot through with holes
  out.push(`<rect x="${fx - 30}" y="${mid - 5}" width="60" height="10" fill="#b8c890" stroke="${INK}" stroke-width="1.2"/>`);
  for (let k = 0; k < 6; k++) out.push(`<circle cx="${fx - 22 + k * 8.8}" cy="${mid}" r="2.6" fill="#f8fbee" stroke="${INK}" stroke-width="0.6"/>`);
  // sugar moving down through it
  const sugar = [];
  for (let k = 0; k < 26; k++) sugar.push(`<circle cx="${r1(fx - 20 + rand() * 40)}" cy="${r1(top + 12 + rand() * (bot - top - 24))}" r="2.2" fill="#d8a83a"/>`);
  out.push(sugar.join(""));
  out.push(`<path d="M${fx + 46},${top + 20} L${fx + 46},${bot - 20}" stroke="${INK}" stroke-width="1.4"/><path d="M${fx + 40},${bot - 28} L${fx + 46},${bot - 20} L${fx + 52},${bot - 28}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  contact(out, fx, bot + 2, 50, 5, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.join("\n"), body: out.join("\n") };
}
