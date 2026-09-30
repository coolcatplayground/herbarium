// NO. 0495 — a three-pointed leaf, and an orchid that has no leaves.
//
// What the morphology says, and what each observation became:
//
//   1. The part: one leaf, dark green, three-pointed — a broad blade drawn
//      out to a long middle point with a shorter point to either side, the
//      leaf the specimen carries as a tail — on a pale stalk, and where the
//      stalk leaves the stem a stipule curled into a yellow-green collar.
//   2. The field note's record is that it photosynthesises by bathing its
//      tail in sun, and when unwell the tail droops: wilting is a hydraulic
//      reading, not a vague sign.
//   3. The note's point is how far a body can photosynthesise without
//      leaves. The ghost orchid has none: what it has is a mat of flat green
//      roots clamped to bark, and they do the photosynthesis as well as the
//      gripping and the drinking. Fig. 2: a piece of bark with the roots on
//      it, and the white flower hanging off it on its thread of a stalk.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "snivy";
export const no = 495;
const SIZE = 800;
const LEAF = { light: "#9ed68a", base: "#3e9a4e", deep: "#23703a", shade: "#154a26", edge: "#154a26" };
const COLLAR = { light: "#f2f0a0", base: "#d8d860", deep: "#a8a838", shade: "#6a6a20", edge: "#6a6a20" };

export function draw() {
  const rand = mulberry32(495);
  const defs = standardDefs(495);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the stalk, pale, rising from the ground
  out.push(`<path d="M300,760 C300,700 310,640 330,590" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M300,760 C300,700 310,640 330,590" fill="none" stroke="#c8dc98" stroke-width="8" stroke-linecap="round"/>`);
  // the three points of the leaf: the side two first, the long middle last
  const base = [332, 590];
  for (const [a, L, W] of [[-2.35, 170, 50], [-0.5, 170, 50], [-1.35, 280, 70]]) {
    const pts = [base, [base[0] + Math.cos(a) * L * 0.4, base[1] + Math.sin(a) * L * 0.4], [base[0] + Math.cos(a) * L * 0.75, base[1] + Math.sin(a) * L * 0.75 - 6], [base[0] + Math.cos(a) * L, base[1] + Math.sin(a) * L]];
    const b = blade(pts, { width: (u) => W * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 1.1), 0.7), sideVeins: 5, rand });
    paintBlade(b, { id: `p${r1(a * 10)}`, palette: LEAF, defs, out, shade: L < 200 ? 0.2 : 0, margin: 6 });
  }
  // the stipule: a leafy collar curled round the foot of the leaf
  for (const s of [-1, 1]) {
    const pts = [[322, 600], [322 + s * 30, 594], [322 + s * 54, 614], [322 + s * 44, 640], [322 + s * 26, 632]];
    const b = blade(pts, { width: (u) => 13 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 1, rand });
    paintBlade(b, { id: `c${s}`, palette: COLLAR, defs, out, margin: 3, ink: 1.3 });
  }

  // ── fig. 2: a ghost orchid on bark ─────────────────────────────────────────
  const fx = 690;
  out.push(`<path d="M${fx - 70},766 L${fx - 60},560 L${fx + 50},556 L${fx + 64},766 Z" fill="#8a6e4a" stroke="${INK}" stroke-width="1.6"/>`);
  for (const dx of [-40, -10, 20, 44]) out.push(`<path d="M${fx + dx},566 C${fx + dx + 4},640 ${fx + dx - 4},700 ${fx + dx + 2},760" fill="none" stroke="#5e4a30" stroke-width="1.4"/>`);
  // the flat green roots, clamped and spreading
  const roots = [];
  for (let k = 0; k < 9; k++) {
    const a = -Math.PI / 2 + (k / 8 - 0.5) * 2.6;
    const x1 = fx + Math.cos(a) * 60, y1 = 650 + Math.sin(a) * 70 + 60;
    roots.push(`M${fx - 4},650 Q${r1(fx + Math.cos(a) * 30)},${r1(650 + Math.sin(a) * 20 + 20)} ${r1(x1)},${r1(y1)}`);
  }
  out.push(`<path d="${roots.join(" ")}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${roots.join(" ")}" fill="none" stroke="#7aaa6a" stroke-width="5" stroke-linecap="round"/>`);
  // the white flower on its thread of a stalk, with its two long tails
  out.push(`<path d="M${fx - 4},650 C${fx - 30},620 ${fx - 60},600 ${fx - 80},590" fill="none" stroke="#7aaa6a" stroke-width="1.4"/>`);
  const w = [fx - 80, 590];
  out.push(`<path d="M${w[0]},${w[1]} c-14,-6 -24,-2 -26,6 c8,2 18,0 26,-6 Z M${w[0]},${w[1]} c14,-6 24,-2 26,6 c-8,2 -18,0 -26,-6 Z" fill="#fbfaf2" stroke="${INK}" stroke-width="0.9"/>`);
  out.push(`<path d="M${w[0]},${w[1]} c-6,20 -18,40 -26,64 M${w[0]},${w[1]} c6,20 16,42 20,66" fill="none" stroke="#fbfaf2" stroke-width="4" stroke-linecap="round"/><path d="M${w[0]},${w[1]} c-6,20 -18,40 -26,64 M${w[0]},${w[1]} c6,20 16,42 20,66" fill="none" stroke="${INK}" stroke-width="0.6"/>`);
  out.push(`<ellipse cx="${w[0]}" cy="${w[1] + 4}" rx="8" ry="6" fill="#fbfaf2" stroke="${INK}" stroke-width="0.9"/>`);
  contact(out, fx, 768, 80, 6, 0.2);

  return { size: SIZE, view: [0, 290, SIZE, 500], defs: defs.join("\n"), body: out.join("\n") };
}
