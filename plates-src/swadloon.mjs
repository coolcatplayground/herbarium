// NO. 0541 — a wrapped leaf, and what litter does to soil.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the wrap. Leaves rolled and wound round and round into a
//      snug bundle, the way a leaf-rolling caterpillar winds itself in to
//      wait — lying on its side, the edge of each turn spiralling round it,
//      the leaves' tips flaring loose from both ends, the innermost paler.
//      (Stood upright as a hooded dome with two leaf points on top, it read
//      as a creature with ears.)
//   2. The field note's record is that forests where it lives have superb
//      foliage, because it makes nutrients from fallen leaves.
//   3. The note's point is that adding litter can make soil poorer before it
//      makes it richer. The microbes breaking it down need nitrogen to build
//      themselves, and if what they are eating has too little of it — above
//      about twenty-five parts carbon to one of nitrogen — they take the
//      nitrogen from the soil instead. Fig. 2: that ratio, as two heaps on a
//      balance: straw and dry leaves heavy with carbon on one side, a little
//      green nitrogen on the other.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "swadloon";
export const no = 541;
const SIZE = 800;
const LEAF = { light: "#cce8a0", base: "#86ba58", deep: "#588a3e", shade: "#2e5a24", edge: "#2e5a24" };
const INNER = { light: "#e8f4c8", base: "#b8d890", deep: "#88ac62", shade: "#4e7a3a", edge: "#4e7a3a" };

export function draw() {
  const rand = mulberry32(541);
  const defs = standardDefs(541);
  const out = [];
  contact(out, 320, 758, 250, 16);

  // the roll: a fat cylinder lying on its side, the turns of leaf wound
  // round it as a spiral seam
  const x0 = 140, x1 = 440, cy = 680, R = 76;
  const roll = `M${x0},${cy - R} L${x1},${cy - R + 6} C${x1 + 30},${cy - R + 10} ${x1 + 30},${cy + R - 4} ${x1},${cy + R} L${x0},${cy + R} C${x0 - 30},${cy + R - 6} ${x0 - 30},${cy - R + 6} ${x0},${cy - R} Z`;
  defs.push(`<linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${LEAF.light}"/><stop offset="0.45" stop-color="${LEAF.base}"/><stop offset="1" stop-color="${LEAF.deep}"/></linearGradient>`);
  defs.push(`<clipPath id="bc"><path d="${roll}"/></clipPath>`);
  // leaf tips flaring from both ends, behind the roll
  for (const [x, dir, a0] of [[x0, -1, -0.4], [x0, -1, 0.3], [x1, 1, -0.5], [x1, 1, 0.2], [x1, 1, 0.7]]) {
    const pts = [[x, cy + a0 * 50], [x + dir * 50, cy + a0 * 70 - 10], [x + dir * 110, cy + a0 * 110 - 20]];
    const bl = blade(pts, { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 1.1), 0.7), sideVeins: 3, rand });
    paintBlade(bl, { id: `t${x}${r1(a0 * 10)}`, palette: LEAF, defs, out, shade: 0.15, margin: 4 });
  }
  out.push(`<path d="${roll}" fill="url(#bd)"/><path d="${roll}" fill="${LEAF.base}" fill-opacity="0.3" filter="url(#wc)"/>`);
  // the spiral seam: each turn's edge crossing the roll on a slant
  for (let k = 0; k < 6; k++) {
    const x = x0 + 20 + k * 66;
    out.push(`<path d="M${x},${cy - R} C${x + 24},${cy - 30} ${x + 30},${cy + 30} ${x + 50},${cy + R}" fill="none" stroke="${LEAF.shade}" stroke-width="1.6" stroke-opacity="0.65" clip-path="url(#bc)"/>`);
    out.push(`<path d="M${x + 3},${cy - R} C${x + 27},${cy - 30} ${x + 33},${cy + 30} ${x + 53},${cy + R}" fill="none" stroke="${LEAF.light}" stroke-width="2" stroke-opacity="0.5" clip-path="url(#bc)"/>`);
  }
  out.push(`<path d="${roll}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // the near end: the turns seen end-on, a spiral, the inner leaf paler
  const sp = [];
  for (let j = 0; j <= 60; j++) { const a = j * 0.34, r = R * (1 - j / 64); sp.push([x0 + Math.cos(a) * r * 0.32, cy + Math.sin(a) * r]); }
  out.push(`<ellipse cx="${x0}" cy="${cy}" rx="${r1(R * 0.34)}" ry="${R}" fill="${INNER.base}" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="${sp.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ")}" fill="none" stroke="${INNER.shade}" stroke-width="1.4"/>`);

  // ── fig. 2: carbon against nitrogen, on a balance ─────────────────────────
  const fx = 668, by = 660;
  out.push(`<path d="M${fx},768 L${fx},${by}" stroke="${INK}" stroke-width="3"/><path d="M${fx - 14},768 L${fx + 14},768" stroke="${INK}" stroke-width="3"/>`);
  // the beam, tipped down under the carbon
  out.push(`<path d="M${fx - 80},${by + 18} L${fx + 80},${by - 18}" stroke="${INK}" stroke-width="3"/>`);
  out.push(`<path d="M${fx - 110},${by + 30} L${fx - 50},${by + 30} L${fx - 60},${by + 44} L${fx - 100},${by + 44} Z" fill="#b8a888" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="M${fx + 50},${by - 6} L${fx + 110},${by - 6} L${fx + 100},${by + 8} L${fx + 60},${by + 8} Z" fill="#b8a888" stroke="${INK}" stroke-width="1.2"/>`);
  // straw and brown leaves heaped on one pan; a pinch of green on the other
  const heap = [];
  for (let k = 0; k < 24; k++) { const x = fx - 104 + rand() * 50, y = by + 28 - rand() * 26; heap.push(`<path d="M${r1(x)},${r1(y)} l${r1(10 + rand() * 8)},${r1(-3 + rand() * 6)}" stroke="${rand() < 0.5 ? "#c8a45a" : "#8a6a3e"}" stroke-width="3" stroke-linecap="round"/>`); }
  out.push(heap.join(""));
  out.push(`<path d="M${fx + 66},${by - 8} q14,-16 28,0 Z" fill="#5aa650" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx - 80},${by + 18} L${fx - 80},${by + 30} M${fx + 80},${by - 18} L${fx + 80},${by - 6}" stroke="${INK}" stroke-width="1.4"/>`);
  contact(out, fx, 770, 100, 5, 0.18);

  return { size: SIZE, view: [0, 520, SIZE, 270], defs: defs.join("\n"), body: out.join("\n") };
}
