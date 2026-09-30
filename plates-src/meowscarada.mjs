// NO. 0908 — a flower on a hidden stem, and one that hits back.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the flower. A single deep-pink bloom, rose-like, its petals
//      in a cup, held high on a stem so fine and pale it almost vanishes — so
//      the bloom seems to float — and below it a sweep of long dark-green
//      leaves, pointed, curving out like a cape, their undersides pale. The
//      floating pink flower and the dark green the specimen is.
//   2. The field note's record is reflective fur that hides the stem, and
//      pollen-packed flower bombs.
//   3. The note's point is that some flowers hit back. An alfalfa bloom is
//      spring-loaded: the stamens are held under tension inside the keel, and
//      a bee working it properly trips the catch, which snaps up and strikes
//      it under the head — hard enough that honeybees learn to avoid it and
//      rob the nectar from the side. Fig. 2: an alfalfa flower before and
//      after it trips, the column sprung up out of the keel.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "meowscarada";
export const no = 908;
const SIZE = 800;
const LEAF = { light: "#b8e0c0", base: "#1e6a3a", deep: "#0e4424", shade: "#062a16", edge: "#062a16" };
const PINK = { light: "#fcd0dc", base: "#e24a7a", deep: "#a82450" };

export function draw() {
  const rand = mulberry32(908);
  const defs = standardDefs(908);
  const out = [];
  contact(out, 320, 758, 220, 14);

  // the cape of long dark leaves sweeping out low
  for (const [a, L] of [[Math.PI + 0.1, 230], [-0.1, 230], [Math.PI + 0.45, 200], [-0.45, 200], [Math.PI + 0.8, 150], [-0.8, 150]]) {
    const pts = [[320, 740], [320 + Math.cos(a) * L * 0.4, 740 + Math.sin(a) * L * 0.3 - 30], [320 + Math.cos(a) * L * 0.8, 740 + Math.sin(a) * L * 0.2 - 20], [320 + Math.cos(a) * L, 752]];
    const b = blade(pts, { width: (u) => 30 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.7), sideVeins: 4, rand });
    paintBlade(b, { id: `c${r1(a * 10)}`, palette: LEAF, defs, out, shade: 0.1, margin: 4 });
  }
  // the fine pale stem, almost invisible
  out.push(`<path d="M320,740 C322,640 318,560 322,470" fill="none" stroke="#c8d8c8" stroke-width="2" stroke-opacity="0.8"/>`);
  // the flower: a cup of pink petals, seen from a little below its side
  const cx = 322, cy = 430;
  defs.push(`<linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PINK.light}"/><stop offset="0.5" stop-color="${PINK.base}"/><stop offset="1" stop-color="${PINK.deep}"/></linearGradient>`);
  for (const [dx, top, w] of [[-40, -30, 44], [40, -30, 44], [0, -44, 46]]) out.push(`<path d="M${cx + dx - w},${cy} C${cx + dx - w},${cy + top - 30} ${cx + dx + w},${cy + top - 30} ${cx + dx + w},${cy} Z" fill="${PINK.deep}" stroke="${INK}" stroke-width="1.3"/>`);
  // the cup's mouth, filled with inner petals still wound together
  out.push(`<ellipse cx="${cx}" cy="${cy - 6}" rx="56" ry="16" fill="${PINK.deep}"/>`);
  for (let k = 0; k < 4; k++) { const w = 46 - k * 11; out.push(`<path d="M${cx - w},${cy - 4} C${cx - w},${cy - 22 + k * 3} ${cx + w},${cy - 22 + k * 3} ${cx + w * 0.8},${cy - 2}" fill="${k % 2 ? PINK.base : PINK.deep}" stroke="${PINK.light}" stroke-width="1.4"/>`); }
  for (const [dx, w] of [[-44, 50], [44, 50], [0, 56]]) out.push(`<path d="M${cx + dx - w},${cy - 4} C${cx + dx - w},${cy + 50} ${cx + dx + w},${cy + 50} ${cx + dx + w},${cy - 4} Q${cx + dx},${cy + 10} ${cx + dx - w},${cy - 4} Z" fill="url(#pk)" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/><path d="M${cx + dx - w},${cy - 4} Q${cx + dx},${cy + 10} ${cx + dx + w},${cy - 4}" fill="none" stroke="${PINK.light}" stroke-width="3" stroke-opacity="0.8"/>`);
  // the green sepals under the bloom
  for (const a of [2.4, 1.57, 0.74]) out.push(`<path d="M${cx},${cy + 40} l${r1(Math.cos(a) * 30)},${r1(Math.sin(a) * 24)} l${r1(-Math.cos(a) * 14 + 6)},${r1(-Math.sin(a) * 6)} Z" fill="#2e7a4a" stroke="${INK}" stroke-width="1"/>`);

  // ── fig. 2: an alfalfa flower before and after it trips ───────────────────
  const flower = (x, tripped) => {
    const y = 730;
    out.push(`<path d="M${x - 20},${y - 50} C${x - 26},${y - 80} ${x + 26},${y - 80} ${x + 20},${y - 50} Z" fill="#b8a0d8" stroke="${INK}" stroke-width="1.2"/>`);
    out.push(`<path d="M${x - 24},${y - 30} C${x - 10},${y - 20} ${x + 14},${y - 24} ${x + 30},${y - 40} C${x + 18},${y - 16} ${x - 10},${y - 10} ${x - 24},${y - 30} Z" fill="#8a70c0" stroke="${INK}" stroke-width="1.2"/>`);
    if (tripped) out.push(`<path d="M${x + 4},${y - 26} C${x + 6},${y - 50} ${x + 12},${y - 66} ${x + 18},${y - 76}" fill="none" stroke="#f2cf3e" stroke-width="3.4" stroke-linecap="round"/><path d="M${x + 22},${y - 82} a6,6 0 1,1 -1,-1" fill="none" stroke="${INK}" stroke-width="1"/>`);
    else out.push(`<path d="M${x - 10},${y - 26} L${x + 20},${y - 34}" stroke="#f2cf3e" stroke-width="3" stroke-linecap="round"/>`);
    out.push(`<path d="M${x - 10},${y - 22} L${x - 14},${y + 30}" stroke="#6a8a4a" stroke-width="3"/>`);
  };
  flower(636, false);
  flower(740, true);
  contact(out, 690, 764, 100, 5, 0.18);

  return { size: SIZE, view: [0, 330, SIZE, 460], defs: defs.join("\n"), body: out.join("\n") };
}
