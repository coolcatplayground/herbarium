// NO. 1017 (wellspring mask) — the ivy circlet wet from the spring, and a partner that fetches water.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the crown of NO. 1017, the same woven ivy circlet, but
//      wet — its leaves gone the deep blue-green of ivy growing at a spring,
//      beaded with water, laid on a flat stone in a shallow pool. The blue of
//      the wellspring mask.
//   2. The record is the room's thesis: the type changes with the mask.
//   3. The note's point is that a plant can take on a tolerance it does not
//      carry itself, by partnership. Mycorrhizal fungi thread out from the
//      root far past where roots can reach, into pores too fine for a root
//      hair, and bring water back; a plant with the partner stands drought a
//      plant without it cannot. Fig. 2: a root tip, and the fungal threads
//      running out from it into the wet soil.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "ogerpon-wellspring-mask";
export const no = 1017;
const SIZE = 800;
const LEAVES = ["#1e5a6a","#2e7a8a","#164a58"];
const STEMS = ["#4e6a7a","#5a7a8a","#3e5a6a"];

function ivy(out, x, y, a, s, col) {
  const d = "M0,0 C-10,-6 -22,-10 -26,-26 C-16,-26 -10,-30 -8,-40 C-4,-34 4,-34 8,-40 C10,-30 16,-26 26,-26 C22,-10 10,-6 0,0 Z";
  out.push(`<path d="${d}" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" fill="${col}" stroke="${INK}" stroke-width="${r1(1.4 / s)}"/>`);
  out.push(`<path d="M0,0 L0,-34 M0,-8 L-18,-24 M0,-8 L18,-24" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" stroke="#e8f0e0" stroke-opacity="0.6" stroke-width="${r1(1 / s)}" fill="none"/>`);
}

const base = (out, INK) => {
      out.push(`<ellipse cx="320" cy="728" rx="260" ry="40" fill="#c8e0e8" stroke="#6a9aaa" stroke-width="1.4"/>`);
      out.push(`<ellipse cx="320" cy="724" rx="220" ry="30" fill="#a8b4b8" stroke="${INK}" stroke-width="1.6"/>`);
    };
const extra = (out, INK, rand, r1) => {
      for (let k = 0; k < 18; k++) { const a = rand() * Math.PI * 2; out.push(`<ellipse cx="${r1(320 + Math.cos(a) * 190)}" cy="${r1(680 + Math.sin(a) * 60)}" rx="3.4" ry="4.4" fill="#e8f8ff" stroke="#4e8aa0" stroke-width="0.8"/>`); }
    };
const fig = (out, INK, rand, r1) => {
      const fx = 690;
      out.push(`<rect x="${fx - 90}" y="620" width="180" height="146" rx="3" fill="#8a7a5a" fill-opacity="0.5" stroke="${INK}" stroke-width="1.2"/>`);
      for (let k = 0; k < 20; k++) out.push(`<circle cx="${r1(fx - 84 + rand() * 168)}" cy="${r1(626 + rand() * 134)}" r="${r1(2 + rand() * 3)}" fill="#8ac8e0" fill-opacity="0.8"/>`);
      out.push(`<path d="M${fx - 8},620 L${fx - 8},720 C${fx - 8},736 ${fx + 8},736 ${fx + 8},720 L${fx + 8},620 Z" fill="#f2ead2" stroke="${INK}" stroke-width="1.3"/>`);
      const h = [];
      for (let k = 0; k < 14; k++) { const s = k % 2 ? 1 : -1, y = 640 + k * 7; h.push(`M${fx + s * 8},${y} q${s * 30},${r1((rand() - 0.5) * 30)} ${s * (50 + rand() * 30)},${r1((rand() - 0.5) * 40)}`); }
      out.push(`<path d="${h.join(" ")}" fill="none" stroke="#fbfaf2" stroke-width="1.2"/>`);
    };

export function draw() {
  const rand = mulberry32(10171);
  const defs = standardDefs(10171);
  const out = [];
  contact(out, 320, 758, 240, 16);
  base(out, INK);
  const cx = 320, cy = 668, RX = 190, RY = 60;
  const ring = [];
  for (let k = 0; k < 18; k++) ring.push({ a: (k / 18) * Math.PI * 2 + 0.1, z: Math.sin((k / 18) * Math.PI * 2 + 0.1) });
  const leaf = ({ a }, i) => ivy(out, cx + Math.cos(a) * RX, cy + Math.sin(a) * RY, -Math.PI / 2 + Math.cos(a) * 0.5, 1.5 + (i % 3) * 0.2, LEAVES[i % 3]);
  ring.filter((l) => l.z < 0).forEach(leaf);
  for (let s = 0; s < 3; s++) {
    const pts = [];
    for (let k = 0; k <= 72; k++) { const a = (k / 72) * Math.PI * 2; pts.push([cx + Math.cos(a) * RX + Math.sin(a * 5 + s * 2) * 6, cy + Math.sin(a) * RY + Math.cos(a * 5 + s * 2) * 6]); }
    const d = smooth(pts, true);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="10"/><path d="${d}" fill="none" stroke="${STEMS[s]}" stroke-width="7"/>`);
  }
  ring.filter((l) => l.z >= 0).forEach((l, i) => leaf(l, i + 1));
  for (const [dx, a] of [[-14, -2.1], [0, -1.57], [14, -1.0]]) ivy(out, cx + dx, cy + RY - 4, a, 1.1, "#5ac8e0");
  extra(out, INK, rand, r1);
  fig(out, INK, rand, r1);
  contact(out, 690, 768, 100, 5, 0.18);
  return { size: SIZE, view: [0, 520, SIZE, 270], defs: defs.join("\n"), body: out.join("\n") };
}
