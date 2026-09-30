// NO. 0420 — a pair of cherries, and the gas that ripens them.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the pair. Two cherries on one forked stalk — one large and
//      pink-red, one smaller and deeper red, the small one already drawn down
//      and shrivelling a little at the shoulder — with two broad leaves where
//      the stalks join.
//   2. The field note's record is a transfer: the small fruit holds what the
//      large one needs, and when it is drained it shrivels.
//   3. The note's point is ethylene, the gas that ripens fruit, and how it
//      was found: through the nineteenth century trees near leaking gas
//      street-lamps were seen to drop their leaves and grow twisted, and in
//      1901 the active part of the illuminating gas was identified as
//      ethylene — the first sign that a plant answers to a gas. Fig. 2: a
//      gas lamp, and the tree beside it dropping its leaves.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "cherubi";
export const no = 420;
const SIZE = 800;
const LEAF = { light: "#b8e0a0", base: "#4ea45a", deep: "#2e7a3c", shade: "#1c4e26", edge: "#1c4e26" };

function cherry(out, defs, id, x, y, r, light, base, deep, shrivel) {
  defs.push(`<radialGradient id="${id}" cx="0.36" cy="0.32" r="0.8"><stop offset="0" stop-color="${light}"/><stop offset="0.55" stop-color="${base}"/><stop offset="1" stop-color="${deep}"/></radialGradient>`);
  // a cherry: round, with the shallow groove down one side and a dimple at the stalk
  const d = `M${x},${y - r * 0.82} C${x + r * 0.5},${y - r * 1.06} ${x + r * 1.04},${y - r * 0.6} ${x + r},${y} C${x + r * 0.96},${y + r * 0.7} ${x + r * 0.5},${y + r} ${x},${y + r} C${x - r * 0.5},${y + r} ${x - r * 0.96},${y + r * 0.7} ${x - r},${y} C${x - r * 1.04},${y - r * 0.6} ${x - r * 0.5},${y - r * 1.06} ${x},${y - r * 0.82} Z`;
  out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<path d="M${x + r * 0.08},${y - r * 0.78} C${x - r * 0.12},${y - r * 0.2} ${x - r * 0.1},${y + r * 0.4} ${x + r * 0.1},${y + r * 0.9}" fill="none" stroke="${deep}" stroke-width="3" stroke-opacity="0.5"/>`);
  out.push(`<ellipse cx="${r1(x - r * 0.42)}" cy="${r1(y - r * 0.38)}" rx="${r1(r * 0.22)}" ry="${r1(r * 0.14)}" transform="rotate(-30 ${r1(x - r * 0.42)} ${r1(y - r * 0.38)})" fill="#ffffff" fill-opacity="0.65"/>`);
  if (shrivel) out.push(`<path d="M${x + r * 0.3},${y - r * 0.6} q${r * 0.2},${r * 0.1} ${r * 0.5},${r * 0.05} M${x + r * 0.4},${y - r * 0.38} q${r * 0.2},${r * 0.08} ${r * 0.45},0" fill="none" stroke="${deep}" stroke-width="1.4" stroke-opacity="0.7"/>`);
}

export function draw() {
  const rand = mulberry32(420);
  const defs = standardDefs(420);
  const out = [];
  contact(out, 330, 758, 200, 16);

  // the forked stalk, from a knot where the leaves come off
  const knot = [300, 370];
  for (const [x, y] of [[250, 580], [430, 610]]) {
    const d = `M${knot[0]},${knot[1]} C${knot[0] + (x - knot[0]) * 0.2},${knot[1] + 60} ${x - (x - knot[0]) * 0.1},${y - 160} ${x},${y - 6}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#6a7a3e" stroke-width="5" stroke-linecap="round"/>`);
  }
  // the two leaves at the knot
  for (const side of [-1, 1]) {
    const pts = [knot, [knot[0] + side * 60, knot[1] - 70], [knot[0] + side * 130, knot[1] - 96], [knot[0] + side * 190, knot[1] - 86]];
    const b = blade(pts, { width: (u) => 50 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.85), 0.65), lobes: 11, depth: 0.08, start: 0.25, sideVeins: 7, rand });
    paintBlade(b, { id: `l${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.15 : 0, margin: 7 });
  }
  out.push(`<circle cx="${knot[0]}" cy="${knot[1]}" r="8" fill="#6a5a38" stroke="${INK}" stroke-width="1.2"/>`);

  // the pair: the large one, and the small one drawn down and shrivelling
  cherry(out, defs, "c1", 250, 660, 96, "#fbc6cc", "#ec6c80", "#b8384e", false);
  cherry(out, defs, "c2", 430, 668, 64, "#f49aa0", "#d23c50", "#8e1c30", true);

  // ── fig. 2: a gas street-lamp, and the tree beside it ─────────────────────
  const lx = 650;
  out.push(`<path d="M${lx - 3},766 L${lx - 2},560 L${lx + 2},560 L${lx + 3},766 Z" fill="#3a3a36" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${lx - 14},560 L${lx + 14},560 L${lx + 10},528 L${lx - 10},528 Z" fill="#f4e7b4" stroke="${INK}" stroke-width="1.4"/><path d="M${lx - 16},528 L${lx + 16},528 L${lx},514 Z" fill="#3a3a36" stroke="${INK}" stroke-width="1"/>`);
  // the leaking gas
  out.push(`<path d="M${lx + 6},740 q10,-10 4,-20 q-6,-10 6,-22" fill="none" stroke="#9a9a8a" stroke-width="1.4" stroke-dasharray="3 3"/>`);
  // the tree: bare, bent away, its leaves on the ground
  const tx = 740;
  out.push(`<path d="M${tx},766 C${tx + 4},720 ${tx + 16},680 ${tx + 26},640 M${tx + 12},690 l20,-16 M${tx + 20},660 l-18,-20" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${tx},766 C${tx + 4},720 ${tx + 16},680 ${tx + 26},640 M${tx + 12},690 l20,-16 M${tx + 20},660 l-18,-20" fill="none" stroke="#7a6040" stroke-width="3" stroke-linecap="round"/>`);
  for (const [x, y, a] of [[702, 760, 20], [724, 764, -30], [770, 762, 50], [752, 700, 10], [716, 726, -60]]) out.push(`<ellipse cx="${x}" cy="${y}" rx="7" ry="4" transform="rotate(${a} ${x} ${y})" fill="#b8a04a" stroke="${INK}" stroke-width="0.8"/>`);
  contact(out, 696, 768, 90, 6, 0.2);

  return { size: SIZE, view: [0, 214, SIZE, 576], defs: defs.join("\n"), body: out.join("\n") };
}
