// NO. 0585 — a spring spray, and the leaves some trees keep all winter.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a spray in spring. A slender twig carrying new leaves just
//      opened — soft, pale, flushed pink as young leaves often are before
//      they green — and at its tip one yellow five-petalled flower. The pink
//      and cream of the spring form, and the yellow flower it wears.
//   2. The field note's record is that its colouring turns with the seasons
//      and people read the season from it.
//   3. The note's point is that some trees take the season by halves: young
//      oaks and beeches hold their dead leaves through the winter — brown,
//      curled, quite dead, still attached — because the layer that would
//      drop them never forms, and they fall only when the spring buds push
//      them off. Marcescence. Fig. 2: a young beech twig in winter, its dead
//      leaves still on it, the long pointed buds between them.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "deerling";
export const no = 585;
const SIZE = 800;
const PINK = { light: "#fbe4e4", base: "#f0b4b8", deep: "#c8848a", shade: "#8a4e54", edge: "#8a4e54" };
const CREAM = { light: "#fffbe8", base: "#f4ecc8", deep: "#d4c898", shade: "#8a7e54", edge: "#8a7e54" };
const DEAD = { light: "#e8c890", base: "#b88a4a", deep: "#8a5e2a", shade: "#5a3a18", edge: "#5a3a18" };

export function draw() {
  const rand = mulberry32(585);
  const defs = standardDefs(585);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the twig, rising and arching over
  const T = `M200,760 C220,680 260,600 330,530 C380,480 430,460 470,440`;
  out.push(`<path d="${T}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${T}" fill="none" stroke="#8a5e44" stroke-width="6" stroke-linecap="round"/>`);
  // new leaves along it, pink and cream by turns
  const LEAVES = [[226, 680, -2.6, 110], [252, 624, -0.3, 120], [290, 574, -2.4, 116], [338, 526, -0.2, 110], [390, 484, -2.0, 100], [432, 460, 0.1, 90]];
  LEAVES.forEach(([x, y, a, L], i) => {
    const pts = [[x, y], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 - 8], [x + Math.cos(a) * L, y + Math.sin(a) * L + 6]];
    const b = blade(pts, { width: (u) => 30 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.85), 0.7), lobes: 8, depth: 0.08, start: 0.3, sideVeins: 5, rand });
    paintBlade(b, { id: `lv${i}`, palette: i % 2 ? CREAM : PINK, defs, out, margin: 4 });
  });
  // the yellow flower at the tip
  const fx0 = 480, fy0 = 432;
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
    const px = fx0 + Math.cos(a) * 24, py = fy0 + Math.sin(a) * 24;
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="24" ry="17" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="#f6d84a" stroke="${INK}" stroke-width="1.4"/>`);
    out.push(`<path d="M${r1(fx0 + Math.cos(a) * 8)},${r1(fy0 + Math.sin(a) * 8)} L${r1(fx0 + Math.cos(a) * 36)},${r1(fy0 + Math.sin(a) * 36)}" stroke="#c89a1c" stroke-width="1.2" stroke-opacity="0.6"/>`);
  }
  out.push(`<circle cx="${fx0}" cy="${fy0}" r="9" fill="#e8a02a" stroke="${INK}" stroke-width="1.1"/>`);

  // ── fig. 2: a young beech twig in winter, its dead leaves held ────────────
  const gx = 690;
  const tw = `M${gx - 40},766 C${gx - 30},700 ${gx},640 ${gx + 20},580`;
  out.push(`<path d="${tw}" fill="none" stroke="${INK}" stroke-width="5"/><path d="${tw}" fill="none" stroke="#6a5a4a" stroke-width="3"/>`);
  for (const [x, y, a, i] of [[gx - 30, 710, -2.6, 0], [gx - 12, 670, -0.4, 1], [gx + 4, 630, -2.5, 2], [gx + 16, 596, -0.6, 3]]) {
    const pts = [[x, y], [x + Math.cos(a) * 30, y + Math.sin(a) * 30 + 12], [x + Math.cos(a) * 60, y + Math.sin(a) * 50 + 34]];
    const b = blade(pts, { width: (u) => 14 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), lobes: 5, depth: 0.2, start: 0.2, sideVeins: 3, rand });
    paintBlade(b, { id: `d${i}`, palette: DEAD, defs, out, margin: 2, ink: 1.1 });
    // the long pointed bud in the axil
    out.push(`<path d="M${x},${y} l${r1(Math.cos(a + (a < -1.5 ? 0.9 : -0.9)) * 18)},${r1(Math.sin(a + (a < -1.5 ? 0.9 : -0.9)) * 18)}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M${x},${y} l${r1(Math.cos(a + (a < -1.5 ? 0.9 : -0.9)) * 18)},${r1(Math.sin(a + (a < -1.5 ? 0.9 : -0.9)) * 18)}" stroke="#a8784a" stroke-width="1.8" stroke-linecap="round"/>`);
  }
  // a little snow on the ground
  out.push(`<path d="M${gx - 90},766 C${gx - 50},756 ${gx + 50},756 ${gx + 90},766 Z" fill="#eef4f6" stroke="${INK}" stroke-width="1"/>`);
  contact(out, gx, 768, 90, 5, 0.18);

  return { size: SIZE, view: [0, 370, SIZE, 420], defs: defs.join("\n"), body: out.join("\n") };
}
