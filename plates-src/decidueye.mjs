// NO. 0724 — a shoot fletched with leaves, and the fruit a tree lets fall.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a shoot like an arrow. A straight, slender brown shoot, and
//      at its end a spray of long narrow leaves set close and swept back —
//      dark green, the lowest turning brown — like the fletching on a shaft;
//      one leaf already come away and falling, clean at its base where the
//      abscission layer let it go. The green-hooded leaves and the arrow-quill
//      the specimen carries.
//   2. The field note's record is speed and precision: a quill nocked and
//      fired in a tenth of a second.
//   3. The note's point is that leaves are not the only thing a tree cuts
//      loose on schedule. An apple sets far more fruit than it can finish,
//      then sheds most of it in early summer — the June drop — casting off the
//      smallest and least-pollinated in a fortnight. Fig. 2: an apple spur
//      after the drop, one fruit left, the shed ones on the ground below.
import { mulberry32, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "decidueye";
export const no = 724;
const SIZE = 800;
const LEAF = { light: "#9cd4a8", base: "#2e8a5a", deep: "#1c6440", shade: "#0e3e26", edge: "#0e3e26" };
const BROWN = { light: "#e0b888", base: "#b0784a", deep: "#7a4e2a", shade: "#4e3018", edge: "#4e3018" };

export function draw() {
  const rand = mulberry32(724);
  const defs = standardDefs(724);
  const out = [];
  contact(out, 330, 758, 250, 14);

  // the shaft: straight, lying low and rising to the right
  const x0 = 110, y0 = 750, x1 = 520, y1 = 600;
  out.push(`<path d="M${x0},${y0} L${x1},${y1}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x0},${y0} L${x1},${y1}" stroke="#8a5e3a" stroke-width="6" stroke-linecap="round"/>`);
  // the fletching: long narrow leaves swept back along the shaft near its end
  const ang = Math.atan2(y1 - y0, x1 - x0);
  for (let k = 0; k < 5; k++) {
    const u = 0.56 + k * 0.1;
    const bx = x0 + (x1 - x0) * u, by = y0 + (y1 - y0) * u;
    for (const s of [-1, 1]) {
      const a = ang + Math.PI - s * 0.95;
      const L = 130 - k * 8;
      const pts = [[bx, by], [bx + Math.cos(a) * L * 0.5, by + Math.sin(a) * L * 0.5], [bx + Math.cos(a) * L, by + Math.sin(a) * L + 6]];
      const b = blade(pts, { width: (v) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + v * 0.96) ** 0.85), 0.7), sideVeins: 0, rand });
      paintBlade(b, { id: `f${k}${s}`, palette: k < 1 ? BROWN : LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 3, veinOpacity: 0.4 });
    }
  }
  // the leaf that has come away, falling, clean at its base
  const fall = blade([[240, 560], [270, 520], [310, 500]], { width: (v) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + v * 0.96) ** 0.85), 0.7), rand });
  paintBlade(fall, { id: "fall", palette: BROWN, defs, out, margin: 3 });
  out.push(`<circle cx="240" cy="560" r="3" fill="#e8d4a8" stroke="${INK}" stroke-width="0.8"/>`);
  out.push(`<path d="M250,580 q-10,20 4,36 q12,14 0,30" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 4"/>`);

  // ── fig. 2: an apple spur after the June drop ─────────────────────────────
  const fx = 690;
  out.push(`<path d="M${fx - 80},600 L${fx + 60},590" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${fx - 80},600 L${fx + 60},590" stroke="#6e5438" stroke-width="3.6" stroke-linecap="round"/>`);
  out.push(`<path d="M${fx},596 L${fx},620" stroke="${INK}" stroke-width="2"/>`);
  defs.push(`<radialGradient id="ap" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#e8f0a0"/><stop offset="0.6" stop-color="#9ac45a"/><stop offset="1" stop-color="#5e8a34"/></radialGradient>`);
  out.push(`<circle cx="${fx}" cy="642" r="24" fill="url(#ap)" stroke="${INK}" stroke-width="1.4"/>`);
  for (const [x, y, r] of [[fx - 50, 758, 8], [fx - 24, 762, 7], [fx + 30, 760, 9], [fx + 56, 762, 6], [fx + 6, 764, 7]]) out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#ap)" stroke="${INK}" stroke-width="1"/>`);
  contact(out, fx, 768, 90, 5, 0.18);

  return { size: SIZE, view: [0, 470, SIZE, 320], defs: defs.join("\n"), body: out.join("\n") };
}
