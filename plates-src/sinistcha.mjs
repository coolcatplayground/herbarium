// NO. 1013 — tea leaves, oxidised and rolled, and four teas from one leaf.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the leaf, made into tea. A small heap of rolled black tea —
//      tight twisted leaves, dark coppery brown — and lying out of it, two
//      leaves brewed and unfurled again, soft, their serrated edges showing,
//      the deep olive-bronze a fully oxidised leaf turns. The dark green and
//      bronze the specimen is made of.
//   2. The field note's record is a con: it pretends to be tea so someone
//      will drink it.
//   3. The note's point is that green, black, white and oolong are one plant.
//      Every one is Camellia sinensis; what separates them is what happens to
//      the leaf after picking — how hard it is bruised, how long its enzymes
//      are left to work, and when heat stops them. Fig. 2: the same leaf four
//      ways: white, green, oolong, black.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "sinistcha";
export const no = 1013;
const SIZE = 800;
const BREWED = { light: "#a8a870", base: "#6e6a3a", deep: "#4a4624", shade: "#2a2814", edge: "#2a2814" };

export function draw() {
  const rand = mulberry32(1013);
  const defs = standardDefs(1013);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the heap of rolled leaves: tight twists, dark, glinting copper
  out.push(`<path d="M120,760 C130,690 220,640 320,636 C420,640 510,690 520,760 Z" fill="#2e2016" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  const tw = [];
  for (let k = 0; k < 180; k++) {
    const u = rand() * 2 - 1, top = 760 - 120 * Math.sqrt(Math.max(0, 1 - u * u));
    const x = 320 + u * 190, y = top + rand() * (760 - top) * 0.9;
    const a = rand() * Math.PI, L = 12 + rand() * 12;
    tw.push(`<path d="M${r1(x - Math.cos(a) * L / 2)},${r1(y - Math.sin(a) * L / 2)} q${r1(Math.cos(a) * L * 0.5 - Math.sin(a) * 3)},${r1(Math.sin(a) * L * 0.5 + Math.cos(a) * 3)} ${r1(Math.cos(a) * L)},${r1(Math.sin(a) * L)}" stroke="${["#4a2e1a", "#6e4424", "#3a2414", "#8a5a30"][k % 4]}" stroke-width="${r1(3 + rand() * 2)}" stroke-linecap="round"/>`);
  }
  out.push(tw.join(""));
  // two brewed leaves lying out of it, unfurled
  for (const [pts, id] of [[[[440, 740], [500, 716], [560, 720], [610, 744]], "b1"], [[[200, 744], [150, 722], [100, 730], [70, 752]], "b2"]]) {
    const b = blade(pts, { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.66), lobes: 18, depth: 0.08, start: 0.15, sideVeins: 5, rand });
    paintBlade(b, { id, palette: BREWED, defs, out, margin: 4 });
  }

  // ── fig. 2: one leaf four ways ────────────────────────────────────────────
  const COLS = [
    { light: "#f4f4e0", base: "#d8dcb8", deep: "#a8ac88", shade: "#6a6e52", edge: "#6a6e52" },
    { light: "#c8e8a0", base: "#5aaa4a", deep: "#347a36", shade: "#1e5024", edge: "#1e5024" },
    { light: "#c8b87a", base: "#8a7a3a", deep: "#5e5224", shade: "#3a3414", edge: "#3a3414" },
    { light: "#8a6a4a", base: "#4a3020", deep: "#2e1c12", shade: "#1a0e08", edge: "#1a0e08" },
  ];
  COLS.forEach((pal, i) => {
    const x = 612 + i * 50;
    const b = blade([[x, 766], [x - 2, 710], [x + 2, 650]], { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), lobes: 8, depth: 0.1, start: 0.2, sideVeins: 3, rand });
    paintBlade(b, { id: `f${i}`, palette: pal, defs, out, margin: 2, ink: 1.1 });
  });
  contact(out, 688, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 540, SIZE, 250], defs: defs.join("\n"), body: out.join("\n") };
}
