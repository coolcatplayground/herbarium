// NO. 1017 (hearthflame mask) — the ivy circlet turned to flame, and a grass that lives on hot ground.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the crown of NO. 1017, the same woven ivy circlet, in its
//      autumn colours — the leaves gone scarlet and orange as Boston ivy does
//      in the cold, a sprig of amber new growth at the front. The red of the
//      hearthflame mask.
//   2. The record is the room's thesis: the type changes with the mask.
//   3. The note's point is one of the strangest results in plant biology. A
//      panic grass growing in Yellowstone's hot geothermal soil survives root
//      temperatures near 50°C, but only with a particular fungus living in
//      it — and only when that fungus is itself infected by a virus. Take any
//      one of the three away and the grass cooks. Fig. 2: the grass in a tuft
//      on steaming ground.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "ogerpon-hearthflame-mask";
export const no = 1017;
const SIZE = 800;
const LEAVES = ["#b8341e","#d8582a","#8a2414"];
const STEMS = ["#6e3a24","#8a4a2a","#5a2e1a"];

function ivy(out, x, y, a, s, col) {
  const d = "M0,0 C-10,-6 -22,-10 -26,-26 C-16,-26 -10,-30 -8,-40 C-4,-34 4,-34 8,-40 C10,-30 16,-26 26,-26 C22,-10 10,-6 0,0 Z";
  out.push(`<path d="${d}" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" fill="${col}" stroke="${INK}" stroke-width="${r1(1.4 / s)}"/>`);
  out.push(`<path d="M0,0 L0,-34 M0,-8 L-18,-24 M0,-8 L18,-24" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" stroke="#e8f0e0" stroke-opacity="0.6" stroke-width="${r1(1 / s)}" fill="none"/>`);
}

const base = (out, INK) => { out.push(`<ellipse cx="320" cy="724" rx="230" ry="30" fill="#8a6a4a" stroke="${INK}" stroke-width="1.6"/>`); };
const extra = () => {};
const fig = (out, INK, rand, r1) => {
      const fx = 690;
      out.push(`<path d="M${fx - 96},766 C${fx - 80},740 ${fx + 80},740 ${fx + 96},766 Z" fill="#b8946a" stroke="${INK}" stroke-width="1.2"/>`);
      for (const x of [fx - 50, fx + 40]) out.push(`<path d="M${x},744 q-10,-20 0,-40 q10,-20 0,-40" fill="none" stroke="#c8c0b0" stroke-width="2" stroke-dasharray="4 4"/>`);
      const g = [];
      for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 + (k / 15 - 0.5) * 1.8, L = 50 + rand() * 30; g.push(`M${fx},748 q${r1(Math.cos(a) * L * 0.5)},${r1(Math.sin(a) * L * 0.5)} ${r1(Math.cos(a) * L)},${r1(Math.sin(a) * L)}`); }
      out.push(`<path d="${g.join(" ")}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="${g.join(" ")}" fill="none" stroke="#8ab85a" stroke-width="2" stroke-linecap="round"/>`);
    };

export function draw() {
  const rand = mulberry32(10172);
  const defs = standardDefs(10172);
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
  for (const [dx, a] of [[-14, -2.1], [0, -1.57], [14, -1.0]]) ivy(out, cx + dx, cy + RY - 4, a, 1.1, "#f2a02a");
  extra(out, INK, rand, r1);
  fig(out, INK, rand, r1);
  contact(out, 690, 768, 100, 5, 0.18);
  return { size: SIZE, view: [0, 520, SIZE, 270], defs: defs.join("\n"), body: out.join("\n") };
}
