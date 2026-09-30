// NO. 0722 — a pair of leaves, and light that comes in flashes.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the pair. Two broad leaves, deep teal-green, opposite on a
//      short twig and spread flat either side of the node like the two wings
//      of a bow — rounded, a little cupped, their tips turned down — the leaf
//      bow the specimen wears at its throat. Laid on the ground.
//   2. The field note files it with photosynthesis under low light, and its
//      record is a day spent gathering power to fund the night.
//   3. The note's point is that most of what a forest-floor plant earns
//      arrives in flashes. Sun reaches the understorey as sunflecks — gaps in
//      the canopy that light a leaf for a second or a few minutes — and they
//      can supply most of a shade plant's daily carbon; using them means
//      switching on fast. Fig. 2: a gap in the canopy overhead, the fleck of
//      light it throws, and a small leaf caught in it.
import { mulberry32, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "rowlet";
export const no = 722;
const SIZE = 800;
const LEAF = { light: "#9cdcc0", base: "#2e9a78", deep: "#1c6e56", shade: "#0e4434", edge: "#0e4434" };

export function draw() {
  const rand = mulberry32(722);
  const defs = standardDefs(722);
  const out = [];
  contact(out, 320, 758, 240, 14);

  // the twig, short, running back from the node
  out.push(`<path d="M320,700 C330,720 340,740 350,758" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M320,700 C330,720 340,740 350,758" fill="none" stroke="#7a5a3a" stroke-width="7" stroke-linecap="round"/>`);
  // the two leaves, spread flat from the node like the wings of a bow
  for (const s of [-1, 1]) {
    const pts = [[320, 700], [320 + s * 70, 660], [320 + s * 160, 650], [320 + s * 230, 690], [320 + s * 244, 730]];
    const b = blade(pts, { width: (u) => 70 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.75), 0.6), sideVeins: 7, rand });
    paintBlade(b, { id: `w${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 7 });
  }
  // the node, where they are joined
  out.push(`<ellipse cx="320" cy="700" rx="18" ry="14" fill="${LEAF.deep}" stroke="${INK}" stroke-width="1.5"/>`);

  // ── fig. 2: a canopy gap, its fleck of light, a leaf caught in it ─────────
  const fx = 690;
  out.push(`<path d="M${fx - 100},560 C${fx - 60},540 ${fx - 30},556 ${fx - 16},570 L${fx + 16},570 C${fx + 30},556 ${fx + 60},540 ${fx + 100},560 L${fx + 100},600 L${fx - 100},600 Z" fill="#2e6a44" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<path d="M${fx - 16},600 L${fx - 40},764 L${fx + 40},764 L${fx + 16},600 Z" fill="#fbeaa0" fill-opacity="0.55"/>`);
  out.push(`<ellipse cx="${fx}" cy="764" rx="48" ry="8" fill="#fbe07a" fill-opacity="0.8"/>`);
  const lf = blade([[fx - 60, 766], [fx - 20, 736], [fx + 30, 730], [fx + 60, 744]], { width: (u) => 18 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), sideVeins: 3, rand });
  paintBlade(lf, { id: "fl", palette: LEAF, defs, out, margin: 2, ink: 1.1 });
  contact(out, fx, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 520, SIZE, 270], defs: defs.join("\n"), body: out.join("\n") };
}
