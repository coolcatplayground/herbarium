// NO. 0951 — green chillies on the stem, and where the heat is made.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the chillies. A short stem with a few glossy leaves and,
//      hanging from it, a cluster of young green chillies — fat at the
//      shoulder, curving to a point, each capped by its star-shaped green
//      calyx — and one pale little flower still open. The plump green pepper
//      the specimen is.
//   2. The field note's record is exactly right: the more sunlight it bathes
//      in, the more heat its body makes — capsaicin in a pepper rises with
//      sun and stress.
//   3. The note's point is where the heat is made. Not in the seeds, as
//      kitchens say, but in the pale ribs inside — the placenta the seeds are
//      attached to — whose surface glands fill with capsaicin. Fig. 2: a chilli
//      cut across, the ribs, the seeds on them, and the glands.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "capsakid";
export const no = 951;
const SIZE = 800;
const LEAF = { light: "#bfe4a0", base: "#4e9a4a", deep: "#2e7036", shade: "#1a4a22", edge: "#1a4a22" };

function chilli(out, defs, id, x, y, L, W, bend, col) {
  const tip = [x + bend, y + L];
  const d = `M${x - W},${y + 8} C${x - W * 1.1},${y + L * 0.4} ${tip[0] - W * 0.6},${tip[1] - L * 0.2} ${tip[0]},${tip[1]} C${tip[0] + W * 0.3},${tip[1] - L * 0.3} ${x + W * 1.1},${y + L * 0.4} ${x + W},${y + 8} Z`;
  defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${col[0]}"/><stop offset="0.45" stop-color="${col[1]}"/><stop offset="1" stop-color="${col[2]}"/></linearGradient>`);
  out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  out.push(`<path d="M${x - W * 0.5},${y + 16} C${x - W * 0.6},${y + L * 0.4} ${tip[0] - W * 0.4},${tip[1] - L * 0.3} ${tip[0] - 4},${tip[1] - 12}" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.45" stroke-linecap="round"/>`);
  // the calyx, a green star over the shoulder
  for (let k = 0; k < 5; k++) { const a = Math.PI + (k / 4) * Math.PI; out.push(`<path d="M${x},${y} l${r1(Math.cos(a) * W * 1.2)},${r1(-Math.sin(a) * 10 + 6)} l${r1(-Math.cos(a) * 6)},4 Z" fill="#3e8a3e" stroke="${INK}" stroke-width="0.9"/>`); }
  out.push(`<path d="M${x},${y} l0,-18" stroke="${INK}" stroke-width="5"/><path d="M${x},${y} l0,-18" stroke="#6a9a4a" stroke-width="3"/>`);
}

export function draw() {
  const rand = mulberry32(951);
  const defs = standardDefs(951);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the stem, and a few glossy leaves
  out.push(`<path d="M300,760 C302,660 310,560 330,470" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M300,760 C302,660 310,560 330,470" fill="none" stroke="#5e9a4a" stroke-width="8" stroke-linecap="round"/>`);
  for (const [x, y, a, L] of [[310, 560, Math.PI + 0.4, 150], [322, 500, -0.3, 160], [330, 474, -1.9, 120]]) {
    const b = blade([[x, y], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 - 8], [x + Math.cos(a) * L, y + Math.sin(a) * L]], { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.85), 0.68), sideVeins: 5, rand });
    paintBlade(b, { id: `l${r1(a * 10)}`, palette: LEAF, defs, out, margin: 5 });
  }
  // the chillies hanging from the upper nodes, fat and green
  const G = ["#b8e080", "#5eaa44", "#2e7a2e"];
  chilli(out, defs, "c1", 360, 500, 180, 36, -30, G);
  chilli(out, defs, "c2", 262, 540, 150, 30, 26, G);
  chilli(out, defs, "c3", 420, 540, 120, 26, 16, G);
  // one small white flower still open
  for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; out.push(`<ellipse cx="${r1(200 + Math.cos(a) * 9)}" cy="${r1(600 + Math.sin(a) * 9)}" rx="8" ry="5" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(200 + Math.cos(a) * 9)} ${r1(600 + Math.sin(a) * 9)})" fill="#fbfaf2" stroke="${INK}" stroke-width="0.8"/>`); }
  out.push(`<circle cx="200" cy="600" r="3.6" fill="#e8d44a"/><path d="M200,600 Q220,590 262,560" fill="none" stroke="#5e9a4a" stroke-width="2.4"/>`);

  // ── fig. 2: a chilli cut across — the ribs, the seeds, the glands ─────────
  const fx = 690, fy = 690, R = 70;
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#4e9a3e" stroke="${INK}" stroke-width="1.6"/><circle cx="${fx}" cy="${fy}" r="${R - 8}" fill="#e2f0c0"/>`);
  for (let k = 0; k < 3; k++) {
    const a = -Math.PI / 2 + (k / 3) * Math.PI * 2;
    out.push(`<path d="M${fx},${fy} L${r1(fx + Math.cos(a) * (R - 8))},${r1(fy + Math.sin(a) * (R - 8))}" stroke="#f4f0d0" stroke-width="12" stroke-linecap="round"/>`);
    for (let q = 0; q < 3; q++) { const d = 16 + q * 14; out.push(`<ellipse cx="${r1(fx + Math.cos(a) * d + Math.cos(a + 1.57) * 10)}" cy="${r1(fy + Math.sin(a) * d + Math.sin(a + 1.57) * 10)}" rx="6" ry="4" fill="#f2e8b0" stroke="${INK}" stroke-width="0.7"/>`); }
    for (let q = 0; q < 4; q++) { const d = 10 + q * 12; out.push(`<circle cx="${r1(fx + Math.cos(a) * d)}" cy="${r1(fy + Math.sin(a) * d)}" r="2.6" fill="#e8843a"/>`); }
  }
  out.push(`<circle cx="${fx}" cy="${fy}" r="12" fill="#f4f0d0" stroke="#c8c0a0" stroke-width="1"/>`);
  contact(out, fx, fy + R + 6, 70, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
