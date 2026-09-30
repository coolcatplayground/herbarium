// NO. 0673 — a ridge of leafy growth on a rock, and a meadow that is one plant.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the mane. A long low ridge of dense broad-leaved growth —
//      lobed leaves, deep green, heaped and overlapping, one leafy crest
//      standing taller than the rest — grown along the back of a weathered
//      boulder, with brown dead stems showing under it where the old growth
//      has died back. The leafy ridge along the specimen's back.
//   2. The field note files it with established, long-lasting vegetation —
//      the kind of cover that stays put for a very long time.
//   3. The note's point is that longevity here makes "individual" an
//      awkward word. A grass or seagrass spreads by shoots rooting where they
//      land, so one genetic individual can hold a hillside without any part
//      of it being old — and one Mediterranean seagrass meadow has been put at
//      tens of thousands of years. Fig. 2: a seagrass rhizome running along
//      the sea floor, a shoot of ribbon leaves at every few nodes.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "gogoat";
export const no = 673;
const SIZE = 800;
const LEAF = { light: "#b8e0a0", base: "#3e9a48", deep: "#23703a", shade: "#154a26", edge: "#154a26" };

export function draw() {
  const rand = mulberry32(673);
  const defs = standardDefs(673);
  const out = [];
  contact(out, 320, 758, 250, 16);

  // the boulder
  const rock = `M70,760 C80,690 150,640 260,630 C380,620 500,640 560,690 C580,720 580,750 570,760 Z`;
  defs.push(`<linearGradient id="rk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8d0bc"/><stop offset="1" stop-color="#8a8272"/></linearGradient>`);
  out.push(`<path d="${rock}" fill="url(#rk)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // dead brown stems under the growth
  for (let k = 0; k < 18; k++) { const x = 110 + k * 26 + rand() * 10; out.push(`<path d="M${r1(x)},${r1(650 - Math.sin(k / 3) * 6)} l${r1((rand() - 0.5) * 10)},-${r1(24 + rand() * 14)}" stroke="#8a6a44" stroke-width="2.4" stroke-linecap="round"/>`); }
  // the ridge of leafy growth along its back, heaped, lower leaves first
  const leaves = [];
  for (let k = 0; k < 70; k++) {
    const u = k / 69;
    const x = 110 + u * 440 + (rand() - 0.5) * 20;
    const crest = u > 0.2 && u < 0.4 ? 90 : 0;
    const top = 620 - 60 * Math.sin(Math.PI * u) - crest * Math.sin(Math.PI * ((u - 0.2) / 0.2));
    const a = -Math.PI / 2 + (rand() - 0.5) * 1.8;
    const L = 60 + rand() * 40;
    leaves.push({ x, y: top + rand() * 40, a, L, z: rand() });
  }
  leaves.sort((p, q) => q.y - p.y).forEach(({ x, y, a, L }, i) => {
    const pts = [[x, y + 20], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 + 20], [x + Math.cos(a) * L, y + Math.sin(a) * L + 20]];
    const b = blade(pts, { width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.7), lobes: 4, depth: 0.35, start: 0.3, teeth: "round", sideVeins: 2, rand });
    paintBlade(b, { id: `g${i}`, palette: LEAF, defs, out, shade: rand() * 0.3, margin: 2, ink: 1, veinOpacity: 0.3 });
  });

  // ── fig. 2: a seagrass rhizome, a shoot at every few nodes ────────────────
  const fx = 690, g = 766;
  out.push(`<rect x="${fx - 100}" y="${g - 22}" width="200" height="22" fill="#e2d4a8" fill-opacity="0.8" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx - 96},${g - 12} L${fx + 96},${g - 12}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${fx - 96},${g - 12} L${fx + 96},${g - 12}" stroke="#8a6a44" stroke-width="5" stroke-linecap="round"/>`);
  for (let k = 0; k < 9; k++) out.push(`<path d="M${fx - 90 + k * 22},${g - 16} l0,8" stroke="${INK}" stroke-width="1"/>`);
  for (const x of [fx - 70, fx - 4, fx + 62]) {
    for (const [a, L] of [[-1.8, 120], [-1.5, 140], [-1.3, 110]]) {
      const pts = [[x, g - 14], [x + Math.cos(a) * L * 0.5, g - 14 + Math.sin(a) * L * 0.5], [x + Math.cos(a) * L + 10, g - 14 + Math.sin(a) * L]];
      const b = blade(pts, { width: () => 5, rand });
      paintBlade(b, { id: `sg${x}${r1(a * 10)}`, palette: { light: "#a8d098", base: "#4e8a54", deep: "#2e6036", shade: "#1a3e22", edge: "#1a3e22" }, defs, out, margin: 1, midrib: false, ink: 0.9 });
    }
  }
  contact(out, fx, g + 2, 100, 5, 0.18);

  return { size: SIZE, view: [0, 440, SIZE, 350], defs: defs.join("\n"), body: out.join("\n") };
}
