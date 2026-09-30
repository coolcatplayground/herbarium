// NO. 0586 — a branching bough in blossom, and a year written in wood.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a bough. A dark bare branch forking and forking again, each
//      fork rising and curving like an antler tine, and along the tines,
//      clusters of pink blossom — five-petalled, cherry-like, opening straight
//      from the bare wood before the leaves. The blossoming antlers of the
//      spring form.
//   2. The field note's record is people reading the season from it.
//   3. The note's point is that a tree writes the year into its wood,
//      readable down to the season: spring growth makes wide thin-walled
//      vessels to move water fast, later growth narrow thick-walled cells,
//      and the sharp change between them is the line seen as a ring. Fig. 2:
//      a slice of the bough, the rings, and one ring close up — the pale
//      open earlywood and the dark dense latewood.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "sawsbuck";
export const no = 586;
const SIZE = 800;
const BARK = "#4e3a2a";
const PINK = { light: "#fde4ea", base: "#f4b4c4", deep: "#d4788e" };

export function draw() {
  const rand = mulberry32(586);
  const defs = standardDefs(586);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the bough: forks rising and curving like tines, drawn as tapering strokes
  const limbs = [
    [320, 760, 300, 600, 12],
    [300, 610, 220, 470, 8], [300, 610, 380, 450, 9],
    [240, 500, 170, 420, 5], [250, 520, 280, 400, 5],
    [360, 480, 330, 360, 6], [370, 470, 450, 380, 6],
    [440, 390, 470, 320, 4], [338, 380, 310, 320, 4],
  ];
  const tips = [];
  for (const [x0, y0, x1, y1, w] of limbs) {
    const cx = (x0 + x1) / 2 + (x1 - x0) * 0.1, cy = (y0 + y1) / 2 + 20;
    const d = `M${x0},${y0} Q${r1(cx)},${r1(cy)} ${x1},${y1}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 3}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${BARK}" stroke-width="${w}" stroke-linecap="round"/>`);
    tips.push([x0, y0, x1, y1]);
  }
  // blossom clusters along the tines
  const blossom = (x, y, r) => {
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
      out.push(`<circle cx="${r1(x + Math.cos(a) * r * 0.6)}" cy="${r1(y + Math.sin(a) * r * 0.6)}" r="${r1(r * 0.55)}" fill="${PINK.base}" stroke="${INK}" stroke-width="0.9"/>`);
    }
    out.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r * 0.3)}" fill="${PINK.deep}"/>`);
    for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; out.push(`<path d="M${r1(x)},${r1(y)} l${r1(Math.cos(a) * r * 0.5)},${r1(Math.sin(a) * r * 0.5)}" stroke="#e8c84a" stroke-width="1"/>`); }
  };
  for (const [x0, y0, x1, y1] of tips.slice(1)) {
    for (const u of [0.45, 0.75, 1]) {
      const x = x0 + (x1 - x0) * u + (rand() - 0.5) * 8, y = y0 + (y1 - y0) * u + (rand() - 0.5) * 8;
      blossom(x, y, 14 + rand() * 4);
      if (rand() < 0.5) blossom(x + 14, y + 6, 11);
    }
  }

  // ── fig. 2: a slice of the bough, and one ring close up ───────────────────
  const fx = 640, fy = 700;
  out.push(`<ellipse cx="${fx}" cy="${fy}" rx="56" ry="50" fill="#e8d0a8" stroke="${INK}" stroke-width="1.6"/>`);
  for (let k = 1; k <= 7; k++) out.push(`<ellipse cx="${fx + k * 0.6}" cy="${fy + k * 0.3}" rx="${56 - k * 7}" ry="${50 - k * 6.3}" fill="none" stroke="#a8784a" stroke-width="${k % 2 ? 1.6 : 1}"/>`);
  out.push(`<ellipse cx="${fx}" cy="${fy}" rx="56" ry="50" fill="none" stroke="${BARK}" stroke-width="4"/>`);
  // the close-up: wide open earlywood cells, then narrow dense latewood
  const zx = 740, zy = 700;
  out.push(`<rect x="${zx - 30}" y="${zy - 56}" width="60" height="112" fill="#f4e8cc" stroke="${INK}" stroke-width="1.4"/>`);
  for (let row = 0; row < 7; row++) {
    const y = zy - 50 + row * 16;
    const late = row >= 5;
    for (let c = 0; c < 4; c++) out.push(`<rect x="${zx - 26 + c * 13.5}" y="${y}" width="11" height="${late ? 7 : 13}" rx="1.5" fill="${late ? "#8a5a2e" : "#fffaf0"}" stroke="#8a6a44" stroke-width="${late ? 1.6 : 0.7}"/>`);
  }
  out.push(`<path d="M${fx + 40},${fy - 12} L${zx - 30},${zy - 30}" stroke="${INK}" stroke-width="0.8" stroke-dasharray="3 3"/>`);
  contact(out, 690, 760, 110, 5, 0.18);

  return { size: SIZE, view: [0, 290, SIZE, 500], defs: defs.join("\n"), body: out.join("\n") };
}
