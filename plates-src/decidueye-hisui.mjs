// NO. 0724 (Hisui) — a shoot bronzed by the cold, and two clocks in one species.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a shoot in its cold-country form. The same arrow-straight
//      stem as NO. 0724, fletched at its end with long narrow leaves swept
//      back — but these gone the colours cold brings on: deep red at their
//      tips, bronze and brown behind, one pale leaf standing up at the top like
//      a white plume. The browns, reds and white the specimen wears in Hisui.
//   2. The record is the ordinary form's: speed and precision.
//   3. The note's point is that almost nothing measurable separates this form
//      from the standard one — what changed is behaviour, and that is a real
//      and often missed kind of difference. Populations of one species from
//      different climates keep their own timetables: grown side by side in one
//      garden, northern trees set their winter buds and stop growing weeks
//      before southern ones of the same kind. Fig. 2: two seedlings of one
//      species in one garden on the same day — the northern one already
//      budded and bronze, the southern still green and growing.
import { mulberry32, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "decidueye-hisui";
export const no = 724;
const SIZE = 800;
const RED = { light: "#f2a07a", base: "#c83a2a", deep: "#8a2418", shade: "#4e140e", edge: "#4e140e" };
const BRONZE = { light: "#e0b888", base: "#a8744a", deep: "#7a4e2a", shade: "#4e3018", edge: "#4e3018" };
const PALE = { light: "#ffffff", base: "#f2ede0", deep: "#d8d0bc", shade: "#8a8474", edge: "#8a8474" };

export function draw() {
  const rand = mulberry32(7240);
  const defs = standardDefs(7240);
  const out = [];
  contact(out, 330, 758, 250, 14);

  const x0 = 110, y0 = 750, x1 = 520, y1 = 610;
  out.push(`<path d="M${x0},${y0} L${x1},${y1}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x0},${y0} L${x1},${y1}" stroke="#6e4a2e" stroke-width="6" stroke-linecap="round"/>`);
  const ang = Math.atan2(y1 - y0, x1 - x0);
  for (let k = 0; k < 5; k++) {
    const u = 0.56 + k * 0.1;
    const bx = x0 + (x1 - x0) * u, by = y0 + (y1 - y0) * u;
    for (const s of [-1, 1]) {
      const a = ang + Math.PI - s * 0.95, L = 130 - k * 8;
      const pts = [[bx, by], [bx + Math.cos(a) * L * 0.5, by + Math.sin(a) * L * 0.5], [bx + Math.cos(a) * L, by + Math.sin(a) * L + 6]];
      const b = blade(pts, { width: (v) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + v * 0.96) ** 0.85), 0.7), sideVeins: 0, rand });
      paintBlade(b, { id: `f${k}${s}`, palette: k > 2 ? RED : BRONZE, defs, out, shade: s > 0 ? 0.2 : 0, margin: 3, veinOpacity: 0.4 });
    }
  }
  // the pale leaf standing up at the top like a plume
  const b = blade([[x1, y1], [x1 + 10, y1 - 50], [x1 + 30, y1 - 110]], { width: (v) => 20 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + v * 0.96) ** 0.85), 0.7), sideVeins: 3, rand });
  paintBlade(b, { id: "plume", palette: PALE, defs, out, margin: 3 });

  // ── fig. 2: two seedlings, one garden, one day ────────────────────────────
  const sapling = (x, north) => {
    const g = 766;
    out.push(`<path d="M${x},${g} L${x},${g - 110}" stroke="${INK}" stroke-width="4"/><path d="M${x},${g} L${x},${g - 110}" stroke="#7a6040" stroke-width="2.4"/>`);
    for (let k = 0; k < 4; k++) {
      const y = g - 30 - k * 24, s = k % 2 ? 1 : -1;
      out.push(`<ellipse cx="${x + s * 16}" cy="${y}" rx="16" ry="6" transform="rotate(${s * -18} ${x + s * 16} ${y})" fill="${north ? ["#a8744a", "#c83a2a"][k % 2] : "#4e9a4a"}" stroke="${INK}" stroke-width="0.9"/>`);
    }
    if (north) out.push(`<ellipse cx="${x}" cy="${g - 118}" rx="6" ry="10" fill="#6e4a2e" stroke="${INK}" stroke-width="1"/>`);
    else out.push(`<path d="M${x},${g - 110} q-8,-16 -2,-30 q10,8 2,30 Z" fill="#8ac86a" stroke="${INK}" stroke-width="0.9"/>`);
  };
  sapling(640, true);
  sapling(740, false);
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 470, SIZE, 320], defs: defs.join("\n"), body: out.join("\n") };
}
