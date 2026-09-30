// NO. 0548 — a bulb and its leaves, and the bitterness bred out of a gourd.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a bulb in growth. Round, pale green-white, smooth, sitting
//      on its basal plate, and from its top three broad leaves standing up
//      and parting — long, pointed, bright green; and round its foot a frill
//      of short pale leaf-bases, the old scales opening back as the bulb
//      swells. The field note files it plainly as a bulb, and it is the
//      shape the specimen is: a round pale body with a sheaf of leaves.
//   2. The note's record is that the leaves are bitter, dried and drunk for
//      fatigue.
//   3. The note's point is that breeding the bitterness out takes the
//      defence with it, and that it can come back. Wild cucumbers and
//      squashes are loaded with cucurbitacins, among the bitterest compounds
//      known; domestication switched them off at a single locus, and a plant
//      that reverts can make a garden squash toxic. Fig. 2: a small, hard,
//      striped wild gourd beside a cucumber from the garden.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "petilil";
export const no = 548;
const SIZE = 800;
const BULB = { light: "#fbfdf0", base: "#dcecc4", deep: "#b4d09a", shade: "#6e8a58", edge: "#6e8a58" };
const LEAF = { light: "#c8ecb0", base: "#5cb05a", deep: "#347e3a", shade: "#1e5024", edge: "#1e5024" };
const FRILL = { light: "#f0f8d8", base: "#c8e0a0", deep: "#94b870", shade: "#5a7a40", edge: "#5a7a40" };

export function draw() {
  const rand = mulberry32(548);
  const defs = standardDefs(548);
  const out = [];
  contact(out, 320, 758, 170, 16);

  // the three leaves, rising and parting from the top
  const B = makeOrgan({ x: 320, base: 744, H: 200, R: 118, tilt: 0.2, knots: [[0, 0.5], [0.12, 0.86], [0.35, 1], [0.6, 0.9], [0.82, 0.6], [0.94, 0.3], [1, 0.1]] });
  const [tx, ty] = B.surface(0, 0.96);
  for (const [a, L, W] of [[-2.2, 220, 46], [-0.94, 220, 46], [-1.57, 260, 52]]) {
    const pts = [[tx, ty + 10], [tx + Math.cos(a) * L * 0.35, ty + Math.sin(a) * L * 0.35], [tx + Math.cos(a) * L * 0.7, ty + Math.sin(a) * L * 0.7], [tx + Math.cos(a) * L, ty + Math.sin(a) * L]];
    const b = blade(pts, { width: (u) => W * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 1.1), 0.7), sideVeins: 5, rand });
    paintBlade(b, { id: `l${r1(a * 10)}`, palette: LEAF, defs, out, shade: L < 240 ? 0.2 : 0, margin: 6 });
  }
  // the bulb
  paintSolid(B, { id: "b", outline: hull(B), palette: BULB, defs, out, hatch: 3 });
  for (const th of [-0.9, -0.3, 0.3, 0.9]) {
    const pts = [];
    for (let j = 0; j <= 12; j++) pts.push(B.surface(th, 0.08 + (j / 12) * 0.84, 1.004));
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${BULB.shade}" stroke-width="1" stroke-opacity="0.3" clip-path="url(#bc)"/>`);
  }
  // the frill of old scales opening back round its foot
  // smooth rounded scales, each lapping the next, round the front
  defs.push(`<linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${FRILL.light}"/><stop offset="1" stop-color="${FRILL.deep}"/></linearGradient>`);
  for (let k = 0; k < 6; k++) {
    const x = 214 + k * 42, y = 734 + Math.abs(k - 2.5) * 3;
    out.push(`<path d="M${x - 26},${y + 12} C${x - 30},${y - 14} ${x + 30},${y - 14} ${x + 26},${y + 12} Q${x},${y + 18} ${x - 26},${y + 12} Z" fill="url(#fr)" stroke="${INK}" stroke-width="1.3"/>`);
    out.push(`<path d="M${x - 14},${y - 2} Q${x},${y - 8} ${x + 14},${y - 2}" fill="none" stroke="${FRILL.shade}" stroke-width="0.9" stroke-opacity="0.5"/>`);
  }
  out.push(`<ellipse cx="322" cy="748" rx="44" ry="8" fill="#b8a27a" stroke="${INK}" stroke-width="1.3"/>`);

  // ── fig. 2: a wild gourd, and a garden cucumber ───────────────────────────
  const figFrom = out.length;
  defs.push(`<radialGradient id="wg" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#e8f0b8"/><stop offset="0.6" stop-color="#9ab85a"/><stop offset="1" stop-color="#5e7a34"/></radialGradient>`);
  out.push(`<ellipse cx="636" cy="724" rx="34" ry="30" fill="url(#wg)" stroke="${INK}" stroke-width="1.5"/>`);
  for (const dx of [-20, -8, 4, 16]) out.push(`<path d="M${636 + dx * 0.6},696 C${636 + dx * 1.3},716 ${636 + dx * 1.3},734 ${636 + dx * 0.6},752" fill="none" stroke="#f2f4d0" stroke-width="3" stroke-opacity="0.8"/>`);
  defs.push(`<linearGradient id="cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ab85a"/><stop offset="1" stop-color="#3a6a2e"/></linearGradient>`);
  out.push(`<path d="M690,738 C690,712 720,700 770,704 C790,706 796,724 792,736 C786,752 720,758 700,752 C692,750 690,744 690,738 Z" fill="url(#cu)" stroke="${INK}" stroke-width="1.5"/>`);
  for (let k = 0; k < 12; k++) out.push(`<circle cx="${r1(704 + rand() * 80)}" cy="${r1(712 + rand() * 36)}" r="1.4" fill="#dcecb0"/>`);
  out.push(`<g transform="translate(660 760) scale(1.3) translate(-712 -760)">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, 660, 762, 130, 5, 0.18);

  return { size: SIZE, view: [0, 286, SIZE, 504], defs: defs.join("\n"), body: out.join("\n") };
}
