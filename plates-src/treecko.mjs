// NO. 0252 — a curled leaf, and a climber's grip.
//
// What the morphology says, and what each observation became:
//
//   1. One part: one big leaf, broad and dark, standing on its short stalk,
//      its lower edge curled under so the paler underside shows along it —
//      the curled dark green the specimen is known by.
//   2. The field note's record turns on feet that climb walls, and climbing
//      plants have solved that without a hook. The Boston ivy's tendrils
//      branch like fingers, and where each tip touches a surface it swells
//      into a round sticky pad and cements itself on. Fig. 2 is that: a
//      tendril on a stone, its five tips pressed flat as pads. (English ivy's
//      way, rootlets that set in their own glue, is the other answer the note
//      gives.)
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "treecko";
export const no = 252;
const SIZE = 800;
const LEAF = { light: "#a8d88c", base: "#3e8a3e", deep: "#27602c", shade: "#173c1c", edge: "#173c1c" };
const UNDER = "#b9e08e";
const STONE = { light: "#e2dccd", base: "#c4bca8", deep: "#9a917c" };
const PADS = { base: "#cfe07a", rim: "#8aa040" };

function stem(out, d, w, colour = "#7a8a4a") {
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(w + 3)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${colour}" stroke-width="${r1(w)}" stroke-linecap="round"/>`);
}

export function draw() {
  const rand = mulberry32(252);
  const defs = standardDefs(252);
  const out = [];
  contact(out, 300, 760, 190, 16);

  // the leaf, on its short stalk from the ground, curled under along its
  // lower edge
  const ln = [296, 760];
  stem(out, `M${ln[0]},${ln[1]} C${ln[0] - 4},${ln[1] - 40} ${ln[0] - 6},${ln[1] - 70} ${ln[0] - 14},${ln[1] - 96}`, 6);
  const leaf = blade([[ln[0] - 14, ln[1] - 96], [ln[0] - 40, ln[1] - 190], [ln[0] - 50, ln[1] - 300], [ln[0] - 20, ln[1] - 400], [ln[0] + 30, ln[1] - 446]], {
    width: (u) => 120 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.02 + u * 0.98) ** 0.85), 0.62), sideVeins: 10, rand,
  });
  paintBlade(leaf, { id: "lf", palette: LEAF, defs, out, margin: 8, veinOpacity: 0.3 });
  // the curl: the right-hand margin rolled under, showing the pale side
  const n = leaf.right.length - 1;
  const outer = [], inner = [];
  for (let j = 0; j <= 30; j++) {
    const u = 0.06 + (j / 30) * 0.72;
    const [x, y] = leaf.right[Math.round(u * n)];
    const [px, py] = leaf.spine[Math.round(u * (leaf.spine.length - 1))];
    const w = 0.22 * Math.sin(Math.PI * (j / 30));
    outer.push([x, y]);
    inner.push([x + (px - x) * w, y + (py - y) * w]);
  }
  const curl = smooth(outer) + " " + smooth([...inner].reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
  out.push(`<path d="${curl}" fill="${UNDER}" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="${smooth(inner.slice(3, -3))}" fill="none" stroke="${LEAF.deep}" stroke-width="1" stroke-opacity="0.6" transform="translate(-2 0)"/>`);

  // ── fig. 2: a Boston ivy tendril, its tips pressed to a stone as pads ──────
  const fx = 668;
  const stone = `M${fx - 96},764 C${fx - 100},720 ${fx - 96},660 ${fx - 82},620 C${fx - 40},608 ${fx + 50},606 ${fx + 90},618 C${fx + 100},670 ${fx + 102},724 ${fx + 98},764 Z`;
  defs.push(`<linearGradient id="st" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${STONE.light}"/><stop offset="0.6" stop-color="${STONE.base}"/><stop offset="1" stop-color="${STONE.deep}"/></linearGradient>`);
  defs.push(`<clipPath id="stc"><path d="${stone}"/></clipPath>`);
  out.push(`<path d="${stone}" fill="url(#st)"/><path d="${stone}" fill="${STONE.base}" fill-opacity="0.4" filter="url(#wc)"/>`);
  const speck = [];
  for (let k = 0; k < 40; k++) speck.push(`<circle cx="${r1(fx - 96 + rand() * 196)}" cy="${r1(610 + rand() * 150)}" r="${r1(0.8 + rand() * 1.4)}" fill="${STONE.deep}" fill-opacity="0.5"/>`);
  out.push(`<g clip-path="url(#stc)">${speck.join("")}</g>`);
  out.push(`<path d="${stone}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  // the stem crossing the stone, a tendril off it, branching like fingers
  stem(out, `M${fx - 110},700 C${fx - 60},670 ${fx},646 ${fx + 110},628`, 5);
  const node = [fx - 10, 652], fork = [fx - 4, 680];
  stem(out, `M${node[0]},${node[1]} Q${node[0] + 2},${fork[1] - 10} ${fork[0]},${fork[1]}`, 2.6, "#9aaa5a");
  const TIPS = [[fx - 58, 714], [fx - 30, 736], [fx + 4, 742], [fx + 38, 730], [fx + 60, 704]];
  for (const [tx, ty] of TIPS) stem(out, `M${fork[0]},${fork[1]} Q${r1((fork[0] + tx) / 2)},${r1((fork[1] + ty) / 2 - 5)} ${tx},${ty}`, 2, "#9aaa5a");
  for (const [tx, ty] of TIPS) out.push(`<ellipse cx="${tx}" cy="${ty + 2}" rx="9" ry="7.4" fill="${PADS.base}" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${tx - 2.4}" cy="${ty}" rx="3.2" ry="2" fill="#f1f6c8" fill-opacity="0.8"/>`);
  contact(out, fx, 766, 110, 6, 0.2);

  return { size: SIZE, view: [0, 290, SIZE, 500], defs: defs.join("\n"), body: out.join("\n") };
}
