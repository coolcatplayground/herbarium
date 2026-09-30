// NO. 0812 — a hollow stump, sprouting, and the grass that makes drums.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the stump. A short, broad section of trunk, hollowed out,
//      its rim worn smooth — a drum, the kind the specimen beats — the bark
//      dark and ridged, and from round its rim and its foot new shoots coming
//      up in green tufts of leaf, as a cut stump's do. The stump and its ring
//      of leaves.
//   2. The field note's record is a stump it draws power from, with roots
//      that follow its lead.
//   3. The note's point is that the plant supplying most of the world's
//      percussion is barely a tree at all: bamboo, a grass, hollow between
//      its nodes and stiff with silica, grows a full-height culm in a single
//      season and never thickens after. Fig. 2: a length of bamboo, one node,
//      split to show the hollow and the wall across it.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "rillaboom";
export const no = 812;
const SIZE = 800;
const LEAF = { light: "#b8e4a0", base: "#3e9a48", deep: "#23703a", shade: "#154a26", edge: "#154a26" };

function tuft(out, defs, x, y, dir, rand, id) {
  for (const [da, L] of [[-0.5, 60], [0, 76], [0.5, 60]]) {
    const a = -Math.PI / 2 + dir * 0.5 + da;
    const b = blade([[x, y], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5], [x + Math.cos(a) * L, y + Math.sin(a) * L]], { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), lobes: 4, depth: 0.3, start: 0.3, sideVeins: 2, rand });
    paintBlade(b, { id: `${id}${r1(da * 10)}`, palette: LEAF, defs, out, margin: 2, ink: 1.2 });
  }
}

export function draw() {
  const rand = mulberry32(812);
  const defs = standardDefs(812);
  const out = [];
  contact(out, 320, 758, 230, 16);

  const cx = 320, top = 560, g = 756, RX = 170, RY = 44;
  // tufts at the back of the rim first
  for (const a of [-2.6, -2.0, -1.4, -0.8]) tuft(out, defs, cx + Math.cos(a) * RX * 0.9, top + Math.sin(a) * RY * 0.9, Math.cos(a), rand, `b${r1(a * 10)}`);
  // the drum body: dark ridged bark, a little wider at its foot
  const body = `M${cx - RX},${top} L${cx - RX - 14},${g} L${cx + RX + 14},${g} L${cx + RX},${top} Z`;
  defs.push(`<linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a6e50"/><stop offset="0.45" stop-color="#5a4430"/><stop offset="1" stop-color="#3a2a1c"/></linearGradient>`);
  defs.push(`<clipPath id="bc"><path d="${body}"/></clipPath>`);
  out.push(`<path d="${body}" fill="url(#bk)"/>`);
  const ridges = [];
  for (let k = 0; k < 18; k++) { const x = cx - RX + 10 + k * 19 + (rand() - 0.5) * 6; ridges.push(`M${r1(x)},${top} C${r1(x + 6)},${top + 60} ${r1(x - 6)},${top + 130} ${r1(x + (x - cx) * 0.08)},${g}`); }
  out.push(`<path d="${ridges.join(" ")}" fill="none" stroke="#2a1e14" stroke-width="2" stroke-opacity="0.7" clip-path="url(#bc)"/>`);
  out.push(`<path d="${body}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // the rim, worn smooth and pale, and the dark hollow inside it
  out.push(`<ellipse cx="${cx}" cy="${top}" rx="${RX}" ry="${RY}" fill="#d8b88a" stroke="${INK}" stroke-width="1.8"/>`);
  out.push(`<ellipse cx="${cx}" cy="${top + 4}" rx="${RX - 24}" ry="${RY - 10}" fill="#2a1e14"/>`);
  out.push(`<path d="M${cx - RX + 14},${top - 6} C${cx - RX / 2},${top - RY + 4} ${cx + RX / 2},${top - RY + 4} ${cx + RX - 14},${top - 6}" fill="none" stroke="#f2dcb0" stroke-width="3" stroke-opacity="0.8"/>`);
  // tufts at the front of the rim and round the foot
  for (const a of [0.5, 1.2, 2.2, 2.7]) tuft(out, defs, cx + Math.cos(a) * RX * 0.96, top + Math.sin(a) * RY * 0.9, Math.cos(a), rand, `f${r1(a * 10)}`);
  for (const x of [cx - RX - 10, cx + RX + 10]) tuft(out, defs, x, g - 4, x < cx ? -1 : 1, rand, `g${x}`);

  // ── fig. 2: a length of bamboo split at a node ────────────────────────────
  const fx = 690;
  defs.push(`<linearGradient id="bb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d8e8a0"/><stop offset="0.5" stop-color="#9ac45a"/><stop offset="1" stop-color="#5e8a34"/></linearGradient>`);
  out.push(`<rect x="${fx - 40}" y="580" width="80" height="186" rx="6" fill="url(#bb)" stroke="${INK}" stroke-width="1.6"/>`);
  // the split face: the hollow, and the wall across it at the node
  out.push(`<rect x="${fx - 30}" y="592" width="60" height="164" rx="4" fill="#f4ecd0" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<rect x="${fx - 30}" y="668" width="60" height="12" fill="#c8b478" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx - 44},674 L${fx + 44},674" stroke="#5e8a34" stroke-width="5"/>`);
  contact(out, fx, 768, 70, 5, 0.18);

  return { size: SIZE, view: [0, 440, SIZE, 350], defs: defs.join("\n"), body: out.join("\n") };
}
