// NO. 0540 — a leaf with a bite out of it, and rooms a plant builds for guards.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the leaf. One large leaf, bright green and paler at the
//      edge, bent over into a hood the way a caterpillar folds and silks a
//      leaf to hide in — and a round bite taken out of its margin, where
//      whatever lives inside has been eating its own shelter. A few strands
//      of silk still hold the fold.
//   2. The field note's record is a creature that chews leaves and sews them
//      with thread.
//   3. The note's point is that plenty of plants build shelters for insects
//      too. Domatia are small permanent chambers — pits, pockets or tufts of
//      hair in the vein angles under a leaf — found on hundreds of woody
//      species, and what lives in them is predatory mites, which eat the
//      plant's pests. Fig. 2: the underside of a leaf, and one vein angle
//      close up, its tuft of hairs and a mite inside.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "sewaddle";
export const no = 540;
const SIZE = 800;
const LEAF = { light: "#d4ecac", base: "#8cc466", deep: "#5a9644", shade: "#305a26", edge: "#305a26" };
const UNDER = { light: "#e8f4d0", base: "#b8dc98", deep: "#86b06a", shade: "#4e7a3a", edge: "#4e7a3a" };

export function draw() {
  const rand = mulberry32(540);
  const defs = standardDefs(540);
  const out = [];
  contact(out, 320, 758, 220, 16);

  // the leaf, from its stalk at the right, arching up and folding over to
  // the left: the underside of the fold shows paler
  const lf = blade([[520, 750], [520, 620], [440, 470], [300, 420], [180, 470], [140, 580]], {
    width: (u) => 110 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.02 + u * 0.98) ** 0.9), 0.62), sideVeins: 9, rand,
  });
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, margin: 9 });
  // the part folded over and down, its paler underside toward us
  const fold = blade([[190, 470], [150, 540], [150, 640], [200, 720]], {
    width: (u) => 70 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.7), sideVeins: 5, rand,
  });
  const foldFrom = out.length;
  paintBlade(fold, { id: "fd", palette: UNDER, defs, out, margin: 5 });
  // the bite out of the fold's edge
  const n = fold.right.length - 1;
  const [bx, by] = fold.right[Math.round(0.55 * n)];
  defs.push(`<mask id="bite" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#fff"/><circle cx="${r1(bx + 6)}" cy="${r1(by)}" r="32" fill="#000"/></mask>`);
  out.push(`<g mask="url(#bite)">${out.splice(foldFrom).join("")}</g>`);
  defs.push(`<clipPath id="fc"><path d="${fold.d}"/></clipPath>`);
  out.push(`<circle cx="${r1(bx + 6)}" cy="${r1(by)}" r="32" fill="none" stroke="${INK}" stroke-width="1.6" clip-path="url(#fc)"/>`);
  // strands of silk across the fold
  const silk = [];
  for (let k = 0; k < 6; k++) {
    const [x0, y0] = fold.left[Math.round((0.2 + k * 0.1) * n)];
    silk.push(`M${r1(x0)},${r1(y0)} L${r1(x0 + 60 + rand() * 30)},${r1(y0 + (rand() - 0.5) * 20)}`);
  }
  out.push(`<path d="${silk.join(" ")}" stroke="#fbfaf2" stroke-width="1.6"/><path d="${silk.join(" ")}" stroke="${INK}" stroke-width="0.4"/>`);

  // ── fig. 2: a domatium in a vein angle, and its tenant ────────────────────
  const fx = 690, fy = 690;
  out.push(`<circle cx="${fx}" cy="${fy}" r="72" fill="${UNDER.base}" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M${fx - 60},${fy + 40} L${fx + 10},${fy - 8} M${fx + 10},${fy - 8} L${fx + 60},${fy - 50} M${fx + 10},${fy - 8} L${fx + 52},${fy + 46}" stroke="#86b06a" stroke-width="7" stroke-linecap="round"/>`);
  // the tuft of hairs in the angle
  const hairs = [];
  for (let k = 0; k < 26; k++) { const a = -0.8 + (k / 25) * 1.6; hairs.push(`M${fx + 12},${fy - 6} q${r1(Math.cos(a) * 14)},${r1(Math.sin(a) * 6 - 8)} ${r1(Math.cos(a) * 26)},${r1(Math.sin(a) * 18)}`); }
  out.push(`<path d="${hairs.join(" ")}" fill="none" stroke="#f4f0dc" stroke-width="1.2"/>`);
  // the mite
  out.push(`<ellipse cx="${fx + 26}" cy="${fy - 4}" rx="7" ry="5" fill="#b8402e" stroke="${INK}" stroke-width="0.8"/>`);
  for (const s of [-1, 1]) out.push(`<path d="M${fx + 22},${fy - 4} l-4,${s * 7} M${fx + 26},${fy - 4} l0,${s * 8} M${fx + 30},${fy - 4} l4,${s * 7}" stroke="${INK}" stroke-width="0.8"/>`);
  contact(out, fx, fy + 76, 70, 5, 0.18);

  return { size: SIZE, view: [0, 240, SIZE, 550], defs: defs.join("\n"), body: out.join("\n") };
}
