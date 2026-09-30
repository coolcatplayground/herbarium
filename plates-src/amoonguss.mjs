// NO. 0591 — a great cap with two young ones, and the death cap.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a cluster of mushrooms. One large one, its broad cap pink
//      at the crown and grey-blue below, divided by a dark band, over grey-
//      blue gills and a stout pale stalk — and at its foot, two young caps
//      coming up, the same two colours, still round. The big cap and the two
//      small ones the specimen carries.
//   2. The field note's record is that the spores, if not washed off, grow
//      into mushrooms wherever they land.
//   3. The note's point is that a warning only works if the victim survives
//      to learn from it, and the deadliest mushrooms fail that test.
//      Amatoxins take days to kill, so nothing that eats a death cap links
//      the meal to the illness. Fig. 2: a death cap — pale olive cap, white
//      gills, a skirt on its stalk, and at its foot the cup it grew out of,
//      the part left in the ground when it is picked.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "amoonguss";
export const no = 591;
const SIZE = 800;

function mushroom(out, defs, id, x, g, W, H, stalkW) {
  const top = g - H;
  const capY = top + W * 0.55;
  const stalk = `M${x - stalkW * 1.15},${g} C${x - stalkW * 1.2},${g - 30} ${x - stalkW},${capY + 40} ${x - stalkW * 0.9},${capY} L${x + stalkW * 0.9},${capY} C${x + stalkW},${capY + 40} ${x + stalkW * 1.2},${g - 30} ${x + stalkW * 1.15},${g} Z`;
  out.push(`<path d="${stalk}" fill="#e8e4d8" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<ellipse cx="${x}" cy="${capY}" rx="${W}" ry="${W * 0.16}" fill="#8a9ab8" stroke="${INK}" stroke-width="1.3"/>`);
  const cap = `M${x - W},${capY} C${x - W},${top + W * 0.1} ${x - W * 0.5},${top} ${x},${top} C${x + W * 0.5},${top} ${x + W},${top + W * 0.1} ${x + W},${capY} C${x + W * 0.5},${capY - W * 0.08} ${x - W * 0.5},${capY - W * 0.08} ${x - W},${capY} Z`;
  defs.push(`<clipPath id="${id}"><path d="${cap}"/></clipPath>`);
  out.push(`<path d="${cap}" fill="#9aa4b4"/>`);
  out.push(`<g clip-path="url(#${id})"><path d="M${x - W - 10},${top + W * 0.3} C${x - W * 0.4},${top + W * 0.22} ${x + W * 0.4},${top + W * 0.22} ${x + W + 10},${top + W * 0.3} L${x + W + 10},${top - 10} L${x - W - 10},${top - 10} Z" fill="#d86a88"/><path d="M${x - W - 10},${top + W * 0.3} C${x - W * 0.4},${top + W * 0.22} ${x + W * 0.4},${top + W * 0.22} ${x + W + 10},${top + W * 0.3}" fill="none" stroke="#3a2e30" stroke-width="${r1(W * 0.08)}"/></g>`);
  out.push(`<ellipse cx="${r1(x - W * 0.4)}" cy="${r1(top + W * 0.14)}" rx="${r1(W * 0.2)}" ry="${r1(W * 0.08)}" fill="#ffffff" fill-opacity="0.5"/>`);
  out.push(`<path d="${cap}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
}

export function draw() {
  const rand = mulberry32(591);
  const defs = standardDefs(591);
  const out = [];
  contact(out, 320, 758, 230, 16);
  // the two young caps at the foot first, then the big one between them
  mushroom(out, defs, "y1", 170, 758, 56, 96, 14);
  mushroom(out, defs, "y2", 476, 758, 52, 88, 13);
  mushroom(out, defs, "big", 320, 758, 150, 330, 38);
  void rand;

  // ── fig. 2: a death cap, and the cup it grew from ─────────────────────────
  const fx = 690, g = 766;
  out.push(`<path d="M${fx - 30},${g} C${fx - 36},${g - 30} ${fx - 24},${g - 40} ${fx},${g - 42} C${fx + 24},${g - 40} ${fx + 36},${g - 30} ${fx + 30},${g} Z" fill="#fbfaf0" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="M${fx - 12},${g - 30} L${fx - 10},${g - 150} L${fx + 10},${g - 150} L${fx + 12},${g - 30} Z" fill="#f4f2e6" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<path d="M${fx - 12},${g - 120} C${fx - 24},${g - 112} ${fx - 20},${g - 100} ${fx - 16},${g - 96} L${fx + 16},${g - 96} C${fx + 20},${g - 100} ${fx + 24},${g - 112} ${fx + 12},${g - 120} Z" fill="#fbfaf0" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<path d="M${fx - 70},${g - 150} C${fx - 70},${g - 210} ${fx + 70},${g - 210} ${fx + 70},${g - 150} Z" fill="#b8bc88" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M${fx - 70},${g - 150} L${fx + 70},${g - 150}" stroke="#fbfaf0" stroke-width="5"/>`);
  contact(out, fx, g + 2, 60, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
