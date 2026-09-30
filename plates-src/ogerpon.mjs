// NO. 1017 — a circlet woven from ivy, and one genome worn two ways.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the crown. A circlet woven from living ivy — two or three
//      supple stems twisted round one another into a ring, and their leaves,
//      dark green, glossy, three-lobed, standing up round it like points —
//      with one sprig of teal new growth tucked in front. The field note files
//      it with vine-draped ceremonial masks; the woven green is what it wears.
//   2. The record is the room's thesis: its type changes with the mask.
//   3. The note's point is that one genome can be worn more than one way.
//      Toadflax normally makes a two-lipped flower with one spur, but a
//      radially symmetric form with five spurs turned up often enough that
//      Linnaeus named it a separate species — and it carries the same gene
//      sequence as the ordinary plant, only marked differently, switched off
//      by methylation. Fig. 2: the two flowers, the ordinary and the peloric.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "ogerpon";
export const no = 1017;
const SIZE = 800;

// an ivy leaf, three-lobed, pointed up at angle a
function ivy(out, x, y, a, s, col) {
  const d = `M0,0 C-10,-6 -22,-10 -26,-26 C-16,-26 -10,-30 -8,-40 C-4,-34 4,-34 8,-40 C10,-30 16,-26 26,-26 C22,-10 10,-6 0,0 Z`;
  out.push(`<path d="${d}" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" fill="${col}" stroke="${INK}" stroke-width="${r1(1.4 / s)}"/>`);
  out.push(`<path d="M0,0 L0,-34 M0,-8 L-18,-24 M0,-8 L18,-24" transform="translate(${r1(x)} ${r1(y)}) rotate(${r1((a * 180) / Math.PI + 90)}) scale(${s})" stroke="#b8d8b0" stroke-width="${r1(1 / s)}" fill="none"/>`);
}

export function draw() {
  const rand = mulberry32(1017);
  const defs = standardDefs(1017);
  const out = [];
  contact(out, 320, 758, 220, 16);

  // the ring, an ellipse seen from a little above; leaves on the back half
  // first, then the stems, then the leaves on the front half
  const cx = 320, cy = 680, RX = 190, RY = 64;
  const LEAVES = [];
  for (let k = 0; k < 18; k++) LEAVES.push({ a: (k / 18) * Math.PI * 2 + 0.1, z: Math.sin((k / 18) * Math.PI * 2 + 0.1) });
  const leaf = ({ a }, i) => ivy(out, cx + Math.cos(a) * RX, cy + Math.sin(a) * RY, -Math.PI / 2 + Math.cos(a) * 0.5, 1.5 + (i % 3) * 0.2, ["#1e5a34", "#2e6e40", "#16482a"][i % 3]);
  LEAVES.filter((l) => l.z < 0).forEach(leaf);
  for (let s = 0; s < 3; s++) {
    const pts = [];
    for (let k = 0; k <= 72; k++) { const a = (k / 72) * Math.PI * 2; pts.push([cx + Math.cos(a) * RX + Math.sin(a * 5 + s * 2) * 6, cy + Math.sin(a) * RY + Math.cos(a * 5 + s * 2) * 6]); }
    const d = smooth(pts, true);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="10"/><path d="${d}" fill="none" stroke="${["#6e5a3a", "#5a7a3a", "#4e6a34"][s]}" stroke-width="7"/>`);
  }
  LEAVES.filter((l) => l.z >= 0).forEach((l, i) => leaf(l, i + 1));
  // the sprig of teal new growth in front
  for (const [dx, a] of [[-14, -2.1], [0, -1.57], [14, -1.0]]) ivy(out, cx + dx, cy + RY - 4, a, 1.1, "#3ab0a0");
  void rand;

  // ── fig. 2: toadflax, ordinary and peloric ────────────────────────────────
  // ordinary: two-lipped, one spur
  const ox = 630, oy = 700;
  out.push(`<path d="M${ox},${oy + 60} L${ox},${oy + 20}" stroke="#6a8a4a" stroke-width="3"/>`);
  out.push(`<path d="M${ox - 24},${oy} C${ox - 26},${oy - 30} ${ox + 20},${oy - 34} ${ox + 22},${oy - 4} Z" fill="#f2d84a" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="M${ox - 24},${oy} C${ox - 10},${oy + 20} ${ox + 14},${oy + 20} ${ox + 22},${oy - 4} Z" fill="#f2d84a" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${ox}" cy="${oy + 4}" rx="8" ry="5" fill="#e8843a"/>`);
  out.push(`<path d="M${ox + 20},${oy} C${ox + 40},${oy + 10} ${ox + 44},${oy + 30} ${ox + 40},${oy + 40}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${ox + 20},${oy} C${ox + 40},${oy + 10} ${ox + 44},${oy + 30} ${ox + 40},${oy + 40}" fill="none" stroke="#f2d84a" stroke-width="3" stroke-linecap="round"/>`);
  // peloric: radial, five spurs
  const px = 740, py = 700;
  out.push(`<path d="M${px},${py + 60} L${px},${py + 20}" stroke="#6a8a4a" stroke-width="3"/>`);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    out.push(`<path d="M${px},${py} l${r1(Math.cos(a) * 34)},${r1(Math.sin(a) * 34)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${px},${py} l${r1(Math.cos(a) * 34)},${r1(Math.sin(a) * 34)}" stroke="#f2d84a" stroke-width="3" stroke-linecap="round"/>`);
  }
  out.push(`<circle cx="${px}" cy="${py}" r="18" fill="#f2d84a" stroke="${INK}" stroke-width="1.2"/><circle cx="${px}" cy="${py}" r="7" fill="#e8843a"/>`);
  contact(out, 686, 764, 100, 5, 0.18);

  return { size: SIZE, view: [0, 520, SIZE, 270], defs: defs.join("\n"), body: out.join("\n") };
}
