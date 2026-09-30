// NO. 0952 — two peppers from one plant, and the sweet one is the broken one.
//
// What the morphology says, and what each observation became:
//
//   1. The part: two peppers on one forked stem — one ripened red, one still
//      green — each wrinkled and lumpy at the shoulder as the superhot
//      cultivars are, hanging head-down from a green calyx, and at the fork a
//      cluster of dark leaves. The red and the green the specimen carries on
//      its two heads.
//   2. The field note's record is two heads driven by spicy chemicals.
//   3. The note's point is that the sweet pepper is the mutant. Pungency in
//      Capsicum turns largely on one gene, and a bell pepper carries a
//      deletion in it that stops the last step of making capsaicin — so the
//      mild vegetable in every shop is a broken hot one, not a lineage that
//      never had heat. Fig. 2: a chilli and a bell pepper, and the one gene
//      drawn under each — whole, and with a piece cut out.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "scovillain";
export const no = 952;
const SIZE = 800;
const LEAF = { light: "#a8d88c", base: "#2e7a3a", deep: "#1a5428", shade: "#0e3418", edge: "#0e3418" };

function pepper(out, defs, id, x, y, L, W, col, rand) {
  // lumpy, wrinkled, broad at the shoulder, drawn to a blunt point
  const pts = [];
  for (let j = 0; j <= 24; j++) {
    const t = j / 24, w = W * Math.sin(Math.PI * Math.min(1, 0.2 + t * 0.85)) * (1 + 0.08 * Math.sin(t * 22 + 1)) * (1 - t * 0.35);
    pts.push([x - w, y + t * L]);
  }
  const d = `M${pts.map(([px, py]) => `${r1(px)},${r1(py)}`).join(" L")} ` + [...pts].reverse().map(([px, py]) => `L${r1(2 * x - px + (rand() - 0.5) * 2)},${r1(py)}`).join(" ") + " Z";
  defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${col[0]}"/><stop offset="0.45" stop-color="${col[1]}"/><stop offset="1" stop-color="${col[2]}"/></linearGradient>`);
  out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" filter="url(#pen)"/>`);
  for (let k = 0; k < 5; k++) out.push(`<path d="M${x - W * 0.6 + k * W * 0.3},${y + 20} q${r1((rand() - 0.5) * 12)},${r1(L * 0.2)} ${r1((rand() - 0.5) * 8)},${r1(L * 0.4)}" fill="none" stroke="${col[2]}" stroke-width="1.4" stroke-opacity="0.6"/>`);
  out.push(`<path d="M${x - W * 0.4},${y + 24} C${x - W * 0.5},${y + L * 0.4} ${x - W * 0.3},${y + L * 0.6} ${x - W * 0.2},${y + L * 0.72}" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.4" stroke-linecap="round"/>`);
  for (let k = 0; k < 6; k++) { const a = Math.PI + (k / 5) * Math.PI; out.push(`<path d="M${x},${y + 4} l${r1(Math.cos(a) * W * 0.8)},${r1(-Math.sin(a) * 8 + 4)} l${r1(-Math.cos(a) * 5)},4 Z" fill="#3e8a3e" stroke="${INK}" stroke-width="0.9"/>`); }
}

export function draw() {
  const rand = mulberry32(952);
  const defs = standardDefs(952);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the stem forking into two, arching over
  out.push(`<path d="M320,760 C318,680 322,620 320,580 C290,540 240,500 210,500 M320,580 C350,540 400,500 430,500" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M320,760 C318,680 322,620 320,580 C290,540 240,500 210,500 M320,580 C350,540 400,500 430,500" fill="none" stroke="#3e8a3e" stroke-width="9" stroke-linecap="round"/>`);
  // the dark leaves at the fork
  for (const [a, L] of [[Math.PI + 0.3, 130], [-0.3, 130], [-1.3, 110], [-1.84, 110], [Math.PI - 0.5, 100], [0.5, 100]]) {
    const b = blade([[320, 590], [320 + Math.cos(a) * L * 0.5, 590 + Math.sin(a) * L * 0.5 - 8], [320 + Math.cos(a) * L, 590 + Math.sin(a) * L]], { width: (u) => 30 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.85), 0.68), sideVeins: 4, rand });
    paintBlade(b, { id: `l${r1(a * 10)}`, palette: LEAF, defs, out, margin: 4 });
  }
  pepper(out, defs, "red", 210, 506, 200, 44, ["#f28a7a", "#d8342e", "#8e1a1a"], rand);
  pepper(out, defs, "grn", 430, 506, 190, 42, ["#b8e080", "#4e9a3e", "#1e5a24"], rand);

  // ── fig. 2: a chilli and a bell, and the one gene under each ──────────────
  out.push(`<path d="M620,640 C612,680 624,720 640,738 C652,720 660,680 650,640 Z" fill="#d8342e" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<path d="M716,650 C700,650 698,700 712,716 C724,726 752,726 764,716 C778,700 776,650 760,650 C750,640 726,640 716,650 Z" fill="#e8842e" stroke="${INK}" stroke-width="1.3"/>`);
  for (const [x, cut] of [[636, false], [738, true]]) {
    out.push(`<rect x="${x - 40}" y="756" width="80" height="10" rx="3" fill="#8ab8e0" stroke="${INK}" stroke-width="1"/>`);
    if (cut) out.push(`<rect x="${x - 6}" y="754" width="18" height="14" fill="#f2ede0"/><path d="M${x - 6},752 l0,18 M${x + 12},752 l0,18" stroke="#c8402e" stroke-width="1.6"/>`);
  }
  contact(out, 690, 770, 100, 5, 0.18);

  return { size: SIZE, view: [0, 430, SIZE, 360], defs: defs.join("\n"), body: out.join("\n") };
}
