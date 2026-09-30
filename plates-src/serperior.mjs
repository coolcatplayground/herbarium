// NO. 0497 — a sprig with golden tendrils, and a very old tree.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the end of a long shoot, laid down — a smooth green stem
//      ending in a spray of three leaves, and from the last node two golden
//      tendrils coiling back on themselves in tight scrolls. The three-leaf
//      tip and the gold curls are what the specimen carries at the end of
//      its tail and round its neck.
//   2. The field note files it with the ancient, long-lived trees.
//   3. The note's point is that the oldest trees stand on the worst ground.
//      Bristlecone pines pass four thousand years on high dolomite where
//      almost nothing competes, laying down wood so dense and resinous that
//      rot can barely work it — and a very old one is mostly dead, kept alive
//      by a single strip of bark running up to a few living branches.
//      Fig. 2: such a tree, silver dead wood twisting, one brown strip of
//      life up its side, and a tuft of needles at the top.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "serperior";
export const no = 497;
const SIZE = 800;
const LEAF = { light: "#bfe0b0", base: "#4a9a5a", deep: "#2c7040", shade: "#194a28", edge: "#194a28" };
const GOLD = { light: "#fbeaa0", base: "#e2c24a", deep: "#b08e24" };

// a tendril coiled into a scroll
function scroll(out, x, y, a, L, turns, dir) {
  const pts = [];
  for (let k = 0; k <= 50; k++) {
    const u = k / 50;
    const r = L * (1 - u) ** 1.4 * 0.35 + 4;
    const ang = a + dir * u * turns * Math.PI * 2;
    const reach = L * Math.min(1, u * 3) * 0.7;
    pts.push([x + Math.cos(a) * reach + Math.cos(ang) * r * Math.min(1, u * 3), y + Math.sin(a) * reach + Math.sin(ang) * r * Math.min(1, u * 3)]);
  }
  const d = smooth(pts);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${GOLD.base}" stroke-width="4.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${GOLD.light}" stroke-width="1.4" transform="translate(-1 -1)"/>`);
}

export function draw() {
  const rand = mulberry32(497);
  const defs = standardDefs(497);
  const out = [];
  contact(out, 320, 758, 230, 14);

  // the shoot, lying along the ground and lifting at its tip
  const sd = `M100,748 C220,746 320,730 390,660`;
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="butt"/><path d="${sd}" fill="none" stroke="#5aa060" stroke-width="13" stroke-linecap="butt"/><path d="${sd}" fill="none" stroke="#e8f0c8" stroke-width="4" transform="translate(0 4)"/>`);
  out.push(`<ellipse cx="100" cy="748" rx="5" ry="8" fill="#dcecc0" stroke="${INK}" stroke-width="1.2"/>`);
  // the golden tendrils at the last node, coiling back
  scroll(out, 330, 724, -2.2, 130, 1.6, -1);
  scroll(out, 350, 716, -0.4, 110, 1.5, 1);
  // the three-leaf spray at the tip
  const tip = [390, 660];
  for (const [a, L, W] of [[-2.1, 180, 44], [-0.6, 180, 44], [-1.35, 240, 54]]) {
    const pts = [tip, [tip[0] + Math.cos(a) * L * 0.4, tip[1] + Math.sin(a) * L * 0.4], [tip[0] + Math.cos(a) * L * 0.75, tip[1] + Math.sin(a) * L * 0.75], [tip[0] + Math.cos(a) * L, tip[1] + Math.sin(a) * L]];
    const b = blade(pts, { width: (u) => W * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.9), 0.66), sideVeins: 6, rand });
    paintBlade(b, { id: `l${r1(a * 10)}`, palette: LEAF, defs, out, shade: L < 200 ? 0.2 : 0, margin: 6 });
  }

  // ── fig. 2: a bristlecone pine, mostly dead, one strip alive ──────────────
  const fx = 690;
  const trunk = `M${fx - 40},766 C${fx - 50},700 ${fx - 10},660 ${fx - 30},600 C${fx - 44},560 ${fx - 10},520 ${fx + 6},500 L${fx + 20},508 C${fx + 4},540 ${fx - 14},570 ${fx},610 C${fx + 14},660 ${fx - 4},710 ${fx + 30},766 Z`;
  out.push(`<path d="${trunk}" fill="#d8d4c8" stroke="${INK}" stroke-width="1.6"/>`);
  for (const d of [`M${fx - 30},760 C${fx - 36},700 ${fx},660 ${fx - 18},600`, `M${fx - 10},760 C${fx - 16},700 ${fx + 12},660 ${fx - 4},610`]) out.push(`<path d="${d}" fill="none" stroke="#9a968a" stroke-width="1.2"/>`);
  // the one living strip, bark brown, running up to the living branch
  out.push(`<path d="M${fx + 12},766 C${fx - 6},712 ${fx + 12},664 ${fx - 2},614 C${fx - 12},580 ${fx + 4},540 ${fx + 16},512" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${fx + 12},766 C${fx - 6},712 ${fx + 12},664 ${fx - 2},614 C${fx - 12},580 ${fx + 4},540 ${fx + 16},512" fill="none" stroke="#8a5a34" stroke-width="6" stroke-linecap="round"/>`);
  // the tuft of needles at the top: a bottlebrush
  const tuft = [];
  for (let k = 0; k < 40; k++) { const u = k / 40, x = fx + 16 + u * 50, y = 508 - u * 16; for (const s of [-1, 1]) tuft.push(`M${r1(x)},${r1(y)} l${r1(4 + rand() * 3)},${r1(s * (9 + rand() * 3))}`); }
  out.push(`<path d="${tuft.join(" ")}" stroke="#2e5a44" stroke-width="2.2" stroke-linecap="round"/>`);
  contact(out, fx, 768, 70, 5, 0.2);

  return { size: SIZE, view: [0, 370, SIZE, 420], defs: defs.join("\n"), body: out.join("\n") };
}
