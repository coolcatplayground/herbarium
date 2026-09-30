// NO. 0708 — a stump that sprouts, and the trees that keep it alive.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the stump. A short cut stump of old wood, weathered brown,
//      its cut face grey and split with drying cracks, its bark peeling —
//      and from the rim of its cut, new shoots coming away from the old wood
//      as a coppiced stump's do, uneven, rising, each carrying a few small
//      fresh leaves.
//   2. The field note's record is a spirit settling into a rotten stump.
//   3. The note's point is that a cut stump does not always die, and
//      sometimes it is not living on its own account. Roots of neighbouring
//      trees of the same species meet underground and fuse — real grafts,
//      wood continuous across the join — so a stump with no leaves can be
//      kept alive for decades by the trees around it. Fig. 2: two roots in a
//      slice of soil, crossing and grown into one where they touch.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "phantump";
export const no = 708;
const SIZE = 800;
const LEAF = { light: "#c4e8a8", base: "#5ab05a", deep: "#347e3a", shade: "#1e5024", edge: "#1e5024" };

export function draw() {
  const rand = mulberry32(708);
  const defs = standardDefs(708);
  const out = [];
  contact(out, 320, 758, 200, 16);

  // the stump: flared at the foot, cut flat at the top
  const stump = `M200,760 C216,720 226,680 228,600 L412,600 C414,680 424,720 440,760 Z`;
  defs.push(`<linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8845a"/><stop offset="0.55" stop-color="#7a5a3a"/><stop offset="1" stop-color="#4e3a24"/></linearGradient>`);
  out.push(`<path d="${stump}" fill="url(#bk)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // the bark: long furrows, and a strip peeling at one side
  for (let k = 0; k < 9; k++) { const x = 236 + k * 20; out.push(`<path d="M${x},606 C${x - 4},650 ${x + 4},700 ${x - 6 - (k < 3 ? 14 : 0) + (k > 6 ? 14 : 0)},756" fill="none" stroke="#3e2c1a" stroke-width="1.4" stroke-opacity="0.7"/>`); }
  out.push(`<path d="M404,620 C430,640 438,680 426,700 C418,680 410,650 400,640 Z" fill="#b8966a" stroke="${INK}" stroke-width="1.2"/>`);
  // the cut face, grey, with its rings and drying cracks
  out.push(`<ellipse cx="320" cy="600" rx="92" ry="26" fill="#c8c0b0" stroke="${INK}" stroke-width="1.8"/>`);
  for (let k = 1; k <= 4; k++) out.push(`<ellipse cx="320" cy="600" rx="${92 - k * 18}" ry="${26 - k * 5}" fill="none" stroke="#9a9282" stroke-width="1"/>`);
  out.push(`<path d="M320,600 L372,590 M320,600 L262,612 M320,600 L300,582" stroke="#6e6656" stroke-width="1.6"/>`);

  // sprouts coming away from the rim of the cut, uneven, mostly upward, as
  // a coppiced stump's do. (Two shoots from its sides, one each way, read as
  // a pair of raised arms.)
  const SPROUTS = [[250, 596, -1.9, 90], [300, 588, -1.6, 150], [338, 590, -1.35, 120], [386, 598, -1.1, 70]];
  SPROUTS.forEach(([x0, y0, a, L], i) => {
    const x1 = x0 + Math.cos(a) * L, y1 = y0 + Math.sin(a) * L;
    const d = `M${x0},${y0} Q${r1(x0 + Math.cos(a) * L * 0.5 - 6)},${r1(y0 + Math.sin(a) * L * 0.5)} ${r1(x1)},${r1(y1)}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#8a7a44" stroke-width="3.6" stroke-linecap="round"/>`);
    const leaves = L > 100 ? [0.5, 0.75, 1] : [0.7, 1];
    leaves.forEach((u, j) => {
      const px = x0 + (x1 - x0) * u, py = y0 + (y1 - y0) * u;
      const la = a + (j % 2 ? 0.9 : -0.9) * (u < 1 ? 1 : 0.2);
      const bl = blade([[px, py], [px + Math.cos(la) * 22, py + Math.sin(la) * 22], [px + Math.cos(la) * 46, py + Math.sin(la) * 46]], { width: (v) => 14 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + v * 0.95) ** 0.85), 0.7), sideVeins: 3, rand });
      paintBlade(bl, { id: `s${i}${j}`, palette: LEAF, defs, out, margin: 3, ink: 1.2 });
    });
  });

  // ── fig. 2: two roots grown into one where they cross ─────────────────────
  const fx = 690, fy = 690;
  out.push(`<rect x="${fx - 96}" y="${fy - 70}" width="192" height="140" rx="3" fill="#b8966a" fill-opacity="0.55" stroke="${INK}" stroke-width="1.2"/>`);
  for (const [x0, y0, x1, y1] of [[fx - 96, fy - 40, fx + 96, fy + 40], [fx - 96, fy + 40, fx + 96, fy - 40]]) {
    out.push(`<path d="M${x0},${y0} C${fx - 30},${(y0 + fy) / 2} ${fx + 30},${(y1 + fy) / 2} ${x1},${y1}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="butt"/><path d="M${x0},${y0} C${fx - 30},${(y0 + fy) / 2} ${fx + 30},${(y1 + fy) / 2} ${x1},${y1}" fill="none" stroke="#e8d4b0" stroke-width="12" stroke-linecap="butt"/>`);
  }
  // the graft: one swelling where they have grown together
  out.push(`<ellipse cx="${fx}" cy="${fy}" rx="26" ry="18" fill="#e8d4b0" stroke="${INK}" stroke-width="1.4"/><path d="M${fx - 18},${fy} C${fx - 8},${fy - 8} ${fx + 8},${fy + 8} ${fx + 18},${fy}" fill="none" stroke="#a8845a" stroke-width="1.2"/>`);
  contact(out, fx, fy + 72, 100, 5, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
