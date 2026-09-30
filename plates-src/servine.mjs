// NO. 0496 — a waxed sprig, and the bloom that keeps it clean.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a sprig. A slender stem arching up and over, set along its
//      back with small pointed leaves in a row, each angled forward, and
//      ending in one larger leaf — the row of leaves the specimen carries
//      down its back and tail. At its foot a yellow-green stipule curls.
//   2. The leaves are dusted pale with bloom: the field note files them as
//      waxy-cuticled, and the wax shows as a faint grey-blue film over the
//      green.
//   3. The note's record is a creature that keeps itself scrupulously clean
//      because dirty leaves cannot photosynthesise. Waxed leaves clean
//      themselves: the wax is a lattice of tubes and plates so fine that
//      water cannot wet it, and it rolls off as beads, carrying the dust
//      with it. Fig. 2: a leaf's edge, a drop beading on it, and the dust
//      the drop has already picked up along its track.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "servine";
export const no = 496;
const SIZE = 800;
const LEAF = { light: "#bcdcb8", base: "#4a9a56", deep: "#2c7040", shade: "#194a28", edge: "#194a28" };
const COLLAR = { light: "#f2f0a0", base: "#d8d860", deep: "#a8a838", shade: "#6a6a20", edge: "#6a6a20" };

const bez = (p0, p1, p2, p3, t) => [0, 1].map((i) => (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t * t * p2[i] + t ** 3 * p3[i]);

export function draw() {
  const rand = mulberry32(496);
  const defs = standardDefs(496);
  const out = [];
  contact(out, 320, 758, 230, 14);

  // the stem: up from the ground and arching over to the right
  const S = [[180, 758], [170, 600], [320, 440], [520, 470]];
  const pts = Array.from({ length: 25 }, (_, k) => bez(...S, k / 24));
  const sd = `M${pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")}`;
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${sd}" fill="none" stroke="#7aa65a" stroke-width="7" stroke-linecap="round"/>`);
  // the row of small leaves along its back, angled forward
  for (let k = 0; k < 7; k++) {
    const t = 0.18 + k * 0.1;
    const [x, y] = bez(...S, t), [x2, y2] = bez(...S, t + 0.02);
    const a = Math.atan2(y2 - y, x2 - x) - 0.9;
    const L = 70 + k * 4;
    const b = blade([[x, y], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5], [x + Math.cos(a + 0.3) * L, y + Math.sin(a + 0.3) * L]], {
      width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), sideVeins: 2, rand,
    });
    paintBlade(b, { id: `r${k}`, palette: LEAF, defs, out, margin: 3, ink: 1.3, veinOpacity: 0.3 });
  }
  // the larger leaf at the end
  const [ex, ey] = S[3];
  const end = blade([[ex - 6, ey - 4], [ex + 60, ey - 20], [ex + 130, ey - 10], [ex + 190, ey + 20]], {
    width: (u) => 46 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.9), 0.66), sideVeins: 6, rand,
  });
  paintBlade(end, { id: "end", palette: LEAF, defs, out, margin: 6 });
  // the bloom: a faint grey-blue film over the leaves
  out.push(`<path d="${end.d}" fill="#dce8ec" fill-opacity="0.28"/>`);
  // the stipule at its foot
  const b = blade([[186, 700], [216, 690], [236, 706], [226, 726], [210, 720]], { width: (u) => 12 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 1, rand });
  paintBlade(b, { id: "st", palette: COLLAR, defs, out, margin: 3, ink: 1.2 });

  // ── fig. 2: a drop on a waxed leaf, picking up the dust ───────────────────
  const fx = 690, fy = 720;
  out.push(`<path d="M${fx - 100},${fy + 20} C${fx - 40},${fy} ${fx + 40},${fy} ${fx + 100},${fy + 20} L${fx + 100},${fy + 36} C${fx + 40},${fy + 16} ${fx - 40},${fy + 16} ${fx - 100},${fy + 36} Z" fill="${LEAF.base}" stroke="${INK}" stroke-width="1.4"/>`);
  // the wax film, and dust ahead of the drop, cleared behind it
  const dust = [];
  for (let k = 0; k < 28; k++) { const x = fx - 10 + rand() * 100; dust.push(`<circle cx="${r1(x)}" cy="${r1(fy + 8 - (x - fx) * 0.02 + rand() * 4)}" r="1.4" fill="#8a7a5a"/>`); }
  out.push(dust.join(""));
  out.push(`<path d="M${fx - 90},${fy + 14} L${fx - 30},${fy + 6}" stroke="#eef4f6" stroke-width="3" stroke-dasharray="4 3"/>`);
  // the drop: nearly round, sitting on the surface
  out.push(`<circle cx="${fx - 20}" cy="${fy - 14}" r="20" fill="#d8ecf4" fill-opacity="0.8" stroke="${INK}" stroke-width="1.3"/><ellipse cx="${fx - 26}" cy="${fy - 22}" rx="6" ry="4" fill="#ffffff"/>`);
  for (let k = 0; k < 6; k++) out.push(`<circle cx="${r1(fx - 28 + rand() * 16)}" cy="${r1(fy - 6 + rand() * 8)}" r="1.4" fill="#8a7a5a"/>`);
  out.push(`<path d="M${fx + 6},${fy - 30} l24,-4" stroke="${INK}" stroke-width="1.2"/><path d="M${fx + 24},${fy - 38} l6,4 l-6,4" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  contact(out, fx, fy + 40, 104, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
