// NO. 1017 (cornerstone mask) — the ivy circlet on serpentine rock, and ground that should poison it.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the crown of NO. 1017, the same woven ivy circlet, grown
//      hard and grey-green — the dusty, leathery look plants take on over
//      serpentine — laid on a block of green-grey serpentine rock, its surface
//      waxy and veined. The grey stone of the cornerstone mask.
//   2. The record is the room's thesis: the type changes with the mask.
//   3. The note's point is that ground which ought to be hostile can be
//      borrowed against. Serpentine soils carry nickel and chromium at levels
//      that poison most plants, and much of the tolerance in the flora living
//      on them is not the plant's own but its fungal partner's, which binds
//      the metals before they reach the root. Fig. 2: a root on serpentine,
//      its fungal sheath catching the metal before it gets in.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "ogerpon-cornerstone-mask";
export const no = 1017;
const SIZE = 800;
const LEAVES = ["#4e6a5a","#5e7a68","#3e5a4a"];
const STEMS = ["#5a5a54","#6a6a60","#4a4a44"];

function ivy(out, x, y, a, s, col) {
  const d = "M0,0 C-10,-6 -22,-10 -26,-26 C-16,-26 -10,-30 -8,-40 C-4,-34 4,-34 8,-40 C10,-30 16,-26 26,-26 C22,-10 10,-6 0,0 Z";
  out.push(`<path d="${d}" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" fill="${col}" stroke="${INK}" stroke-width="${r1(1.4 / s)}"/>`);
  out.push(`<path d="M0,0 L0,-34 M0,-8 L-18,-24 M0,-8 L18,-24" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" stroke="#e8f0e0" stroke-opacity="0.6" stroke-width="${r1(1 / s)}" fill="none"/>`);
}

const base = (out, INK) => {
      out.push(`<path d="M100,760 L120,700 L520,696 L540,760 Z" fill="#6e8a78" stroke="${INK}" stroke-width="1.8"/>`);
      out.push(`<path d="M120,700 L140,684 L500,680 L520,696 Z" fill="#8aa894" stroke="${INK}" stroke-width="1.4"/>`);
      for (const d of ["M150,730 C220,712 300,740 380,720", "M200,752 C260,734 360,760 480,736"]) out.push(`<path d="${d}" fill="none" stroke="#3e5a48" stroke-width="1.4" stroke-opacity="0.7"/>`);
    };
const extra = () => {};
const fig = (out, INK, rand, r1) => {
      const fx = 690;
      out.push(`<rect x="${fx - 90}" y="620" width="180" height="146" rx="3" fill="#6e8a78" fill-opacity="0.55" stroke="${INK}" stroke-width="1.2"/>`);
      out.push(`<path d="M${fx - 12},620 L${fx - 12},720 C${fx - 12},740 ${fx + 12},740 ${fx + 12},720 L${fx + 12},620 Z" fill="#fbfaf2" stroke="#b8b0a0" stroke-width="5"/>`);
      out.push(`<path d="M${fx - 8},620 L${fx - 8},720 C${fx - 8},734 ${fx + 8},734 ${fx + 8},720 L${fx + 8},620 Z" fill="#f2ead2" stroke="${INK}" stroke-width="1.2"/>`);
      for (let k = 0; k < 16; k++) { const s = k % 2 ? 1 : -1; out.push(`<circle cx="${fx + s * (16 + rand() * 30)}" cy="${r1(630 + rand() * 110)}" r="2.4" fill="#4e8a6a"/>`); }
    };

export function draw() {
  const rand = mulberry32(10173);
  const defs = standardDefs(10173);
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
  for (const [dx, a] of [[-14, -2.1], [0, -1.57], [14, -1.0]]) ivy(out, cx + dx, cy + RY - 4, a, 1.1, "#9ab0a4");
  extra(out, INK, rand, r1);
  fig(out, INK, rand, r1);
  contact(out, 690, 768, 100, 5, 0.18);
  return { size: SIZE, view: [0, 520, SIZE, 270], defs: defs.join("\n"), body: out.join("\n") };
}
