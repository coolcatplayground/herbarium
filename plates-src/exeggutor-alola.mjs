// NO. 0103 (Alola) — a very tall palm, and water pulled up a column.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the height. The coconut palm of NO. 0103, but in its island
//      form grown enormously tall — a long, slender, gently curving trunk ringed
//      with the scars of old fronds, far taller than the plate is wide — and at
//      the top the same crown of strap leaves over a cluster of nuts. At its
//      foot a fallen nut has sprouted a single young frond. The towering trunk
//      is the specimen.
//   2. The record is that sun makes the heads grow larger and more numerous.
//   3. The note's point is that height turns a tree into a plumbing problem.
//      Water is not pushed up a trunk; it is pulled, hanging in unbroken
//      threads under tension from the leaves' evaporation, and the taller the
//      column the nearer that tension comes to snapping the thread. Fig. 2:
//      one vessel, the water column in it, and the pull from the leaf at its
//      top.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "exeggutor-alola";
export const no = 103;
const SIZE = 800;
const FROND = { light: "#a6d68a", base: "#5aa85a", deep: "#347a44", shade: "#22502e", edge: "#22502e" };

export function draw() {
  const rand = mulberry32(1030);
  const defs = standardDefs(1030);
  const out = [];
  contact(out, 300, 758, 120, 14);

  // the trunk: long, slender, gently curving, ringed with scars
  const T = (t) => [300 + Math.sin(t * 2.4) * 40 * t, 758 - t * 560];
  const L = [], R = [];
  for (let k = 0; k <= 40; k++) { const t = k / 40, [x, y] = T(t), w = 22 - t * 8; L.push([x - w, y]); R.push([x + w, y]); }
  const td = `M${[...L, ...R.reverse()].map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} Z`;
  defs.push(`<linearGradient id="tr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ddd5c8"/><stop offset="0.5" stop-color="#bfb4a3"/><stop offset="1" stop-color="#8a7f6e"/></linearGradient>`);
  out.push(`<path d="${td}" fill="url(#tr)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (let k = 1; k < 40; k++) { const t = k / 40, [x, y] = T(t), w = 22 - t * 8; out.push(`<path d="M${r1(x - w)},${r1(y)} Q${r1(x)},${r1(y + 4)} ${r1(x + w)},${r1(y - 1)}" fill="none" stroke="#6e6452" stroke-width="1.1" stroke-opacity="0.6"/>`); }
  // the crown: strap leaves arching out, the nuts clustered below them
  const [cx, cy] = T(1);
  for (let k = 0; k < 11; k++) {
    const a = -Math.PI / 2 + (k / 10 - 0.5) * 2.8, o = Math.abs(k / 10 - 0.5);
    const Lf = 160 - o * 40, droop = 0.25 + o * 1.6;
    const pts = [];
    for (let j = 0; j <= 6; j++) { const u = j / 6; pts.push([cx + Math.cos(a) * Lf * u, cy + Math.sin(a) * Lf * u + droop * Lf * 0.6 * u ** 2.2]); }
    const b = blade(pts, { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.5), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id: `f${k}`, palette: FROND, defs, out, shade: o > 0.3 ? 0.25 : 0, margin: 3, veinOpacity: 0.3 });
  }
  defs.push(`<radialGradient id="nut" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="#fbf6d2"/><stop offset="0.55" stop-color="#e2d9a2"/><stop offset="1" stop-color="#9a8e54"/></radialGradient>`);
  for (const [dx, dy] of [[-22, 24], [18, 30], [-2, 42]]) out.push(`<ellipse cx="${r1(cx + dx)}" cy="${r1(cy + dy)}" rx="18" ry="16" fill="url(#nut)" stroke="${INK}" stroke-width="1.3"/>`);
  // the sprouted nut at its foot
  out.push(`<ellipse cx="400" cy="748" rx="22" ry="16" fill="url(#nut)" stroke="${INK}" stroke-width="1.3"/>`);
  const sp = blade([[404, 734], [410, 700], [430, 670]], { width: (u) => 10 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 0.6, rand });
  paintBlade(sp, { id: "sp", palette: FROND, defs, out, margin: 2, ink: 1.1 });

  // ── fig. 2: a vessel, its water column, the pull from the leaf ────────────
  const fx = 690;
  out.push(`<rect x="${fx - 10}" y="560" width="20" height="206" rx="4" fill="#dcecf4" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<rect x="${fx - 5}" y="566" width="10" height="196" fill="#6a9ad8" fill-opacity="0.6"/>`);
  for (let k = 0; k < 6; k++) out.push(`<path d="M${fx + 22},${750 - k * 32} L${fx + 22},${734 - k * 32}" stroke="${INK}" stroke-width="1.2"/><path d="M${fx + 18},${740 - k * 32} L${fx + 22},${734 - k * 32} L${fx + 26},${740 - k * 32}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  const lf = blade([[fx, 562], [fx + 30, 530], [fx + 70, 520]], { width: (u) => 14 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 0.6, rand });
  paintBlade(lf, { id: "lf", palette: FROND, defs, out, margin: 2, ink: 1.1 });
  for (const dx of [30, 50, 66]) out.push(`<path d="M${fx + dx},512 q-4,-10 0,-20" fill="none" stroke="#8ab8e0" stroke-width="1.4" stroke-dasharray="3 3"/>`);
  contact(out, fx, 768, 50, 5, 0.18);

  return { size: SIZE, view: [0, 20, SIZE, 770], defs: defs.join("\n"), body: out.join("\n") };
}
