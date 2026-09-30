// NO. 0357 — one flower spike, and the seeds bred out of it.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the bunch. A bunch of bananas is a single flower spike —
//      one stalk carrying hand after hand of fruit, and at its end the heart,
//      the maroon bud of bracts still covering the male flowers. Cut and laid
//      down, the stalk running along the ground, the hands of fruit curving
//      up off it: bananas bend upward as they grow, toward the light.
//   2. Behind it, one leaf, long and broad and torn by wind into strips from
//      its edge to its midrib, as every banana leaf ends up.
//   3. The field note's point is that every Cavendish banana is a sterile
//      triploid clone, its seeds bred down to specks — which is why a single
//      disease can threaten the whole crop. Fig. 2: two bananas cut across,
//      the shop one with its specks and a wild one full of hard black seed.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "tropius";
export const no = 357;
const SIZE = 800;
const LEAF = { light: "#b8dc8c", base: "#5aa04a", deep: "#347a36", shade: "#1e4e22", edge: "#1e4e22" };
const FRUIT = { light: "#fff4b0", base: "#f2d64e", deep: "#c8a02a" };
const HEART = { light: "#c4708a", base: "#8e3456", deep: "#5a1a34" };

export function draw() {
  const rand = mulberry32(357);
  const defs = standardDefs(357);
  const out = [];
  contact(out, 330, 758, 250, 16);

  // the leaf behind: long, broad, torn into strips from the edge
  const lf = blade([[90, 700], [220, 560], [390, 470], [560, 430]], {
    width: (u) => 92 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.8), 0.55), sideVeins: 0, rand,
  });
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, margin: 6, veinOpacity: 0 });
  // the tears: gaps cut from the margin in toward the midrib
  const tears = [];
  for (let k = 1; k < 14; k++) {
    const u = 0.1 + k * 0.062;
    const f = lf.frames[Math.round(u * (lf.frames.length - 1))];
    for (const s of [-1, 1]) {
      if (rand() < 0.3) continue;
      const w = 92 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.8), 0.55);
      const [ox, oy] = [f.p[0] + f.n[0] * w * s * 1.05, f.p[1] + f.n[1] * w * s * 1.05];
      const [ix, iy] = [f.p[0] + f.n[0] * 8 * s, f.p[1] + f.n[1] * 8 * s];
      tears.push(`M${r1(ox)},${r1(oy)} L${r1(ix)},${r1(iy)}`);
    }
  }
  out.push(`<path d="${tears.join(" ")}" stroke="#f2ede0" stroke-width="3.2" stroke-linecap="round"/><path d="${tears.join(" ")}" stroke="${INK}" stroke-width="0.7" stroke-opacity="0.6"/>`);
  // the heavy midrib
  out.push(`<path d="${smooth(lf.spine.filter((_, j) => j % 10 === 0))}" fill="none" stroke="#dfe8b8" stroke-width="4"/>`);

  // the bunch: the stalk along the ground, cut at the left, the heart at the right
  const stalk = `M150,724 C260,712 380,716 490,708`;
  out.push(`<path d="${stalk}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="butt"/><path d="${stalk}" fill="none" stroke="#7a8a44" stroke-width="13" stroke-linecap="butt"/>`);
  out.push(`<ellipse cx="150" cy="724" rx="5" ry="8" fill="#e8e2b8" stroke="${INK}" stroke-width="1.2"/>`);
  // the hands, each a row of fingers curving up off the stalk; back row first
  defs.push(`<linearGradient id="fr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${FRUIT.light}"/><stop offset="0.6" stop-color="${FRUIT.base}"/><stop offset="1" stop-color="${FRUIT.deep}"/></linearGradient>`);
  // a finger: a thick curved fruit, stalk end at the hand, bent up toward
  // the light, blunt at the tip. (Drawn as tapering spikes they read as
  // flames.)
  const finger = (x, y, a, L) => {
    const tip = [x + Math.cos(a) * L, y + Math.sin(a) * L];
    const ctrl = [x + Math.cos(a) * L * 0.55 - 12, y + Math.sin(a) * L * 0.55 + 4];
    const d = `M${x},${y} Q${r1(ctrl[0])},${r1(ctrl[1])} ${r1(tip[0])},${r1(tip[1])}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="25" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${FRUIT.base}" stroke-width="22" stroke-linecap="round"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${FRUIT.light}" stroke-width="7" stroke-linecap="round" transform="translate(-4 0)"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${FRUIT.deep}" stroke-width="5" stroke-opacity="0.5" transform="translate(6 1)"/>`);
    out.push(`<circle cx="${r1(tip[0])}" cy="${r1(tip[1] - 4)}" r="5" fill="#4a3a24"/>`);
  };
  for (const [hx, n, L] of [[210, 4, 110], [320, 4, 106], [420, 3, 96]]) {
    for (let k = 0; k < n; k++) finger(hx - 24 + k * 17, 708, -1.72 + k * 0.1, L - Math.abs(k - 1.5) * 6);
    // the crown of the hand, where its fingers join the stalk
    out.push(`<ellipse cx="${hx}" cy="716" rx="42" ry="10" fill="#9aa45a" stroke="${INK}" stroke-width="1.3"/>`);
  }
  // the heart at the end: a maroon bud of bracts, one bract lifting
  const hx = 524, hy = 704;
  const heart = `M${hx - 40},${hy} C${hx - 30},${hy - 34} ${hx + 30},${hy - 40} ${hx + 70},${hy + 4} C${hx + 30},${hy + 40} ${hx - 30},${hy + 34} ${hx - 40},${hy} Z`;
  defs.push(`<radialGradient id="ht" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${HEART.light}"/><stop offset="0.6" stop-color="${HEART.base}"/><stop offset="1" stop-color="${HEART.deep}"/></radialGradient>`);
  out.push(`<path d="${heart}" fill="url(#ht)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (const k of [0, 1, 2]) out.push(`<path d="M${hx - 30 + k * 26},${hy - 20 + k * 4} C${hx - 16 + k * 26},${hy - 6} ${hx - 16 + k * 26},${hy + 10} ${hx - 30 + k * 26},${hy + 22 - k * 4}" fill="none" stroke="${HEART.deep}" stroke-width="1.2" stroke-opacity="0.7"/>`);
  out.push(`<path d="M${hx - 36},${hy - 6} C${hx - 20},${hy - 50} ${hx + 16},${hy - 58} ${hx + 20},${hy - 40} C${hx},${hy - 34} ${hx - 20},${hy - 22} ${hx - 36},${hy - 6} Z" fill="${HEART.base}" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="M${hx - 26},${hy - 14} l6,-12 m4,12 l4,-12 m4,12 l3,-11" stroke="${FRUIT.base}" stroke-width="3" stroke-linecap="round"/>`);

  // ── fig. 2: two bananas cut across ────────────────────────────────────────
  const slice = (x, y, wild) => {
    out.push(`<circle cx="${x}" cy="${y}" r="38" fill="${FRUIT.base}" stroke="${INK}" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="32" fill="#fbf2d0" stroke="${FRUIT.deep}" stroke-width="1"/>`);
    for (let k = 0; k < 3; k++) {
      const a = -Math.PI / 2 + (k / 3) * Math.PI * 2;
      const sx = x + Math.cos(a) * 11, sy = y + Math.sin(a) * 11;
      if (wild) out.push(`<ellipse cx="${r1(sx)}" cy="${r1(sy)}" rx="7" ry="9" transform="rotate(${r1((a * 180) / Math.PI + 90)} ${r1(sx)} ${r1(sy)})" fill="#2a221c" stroke="${INK}" stroke-width="0.8"/>`);
      else out.push(`<circle cx="${r1(sx)}" cy="${r1(sy)}" r="1.8" fill="#6a5a44"/>`);
    }
    out.push(`<path d="M${x},${y} L${x},${y - 12} M${x},${y} L${r1(x + 10)},${y + 6} M${x},${y} L${r1(x - 10)},${y + 6}" stroke="${FRUIT.deep}" stroke-width="0.8" stroke-opacity="0.6"/>`);
  };
  slice(660, 716, false);
  slice(752, 716, true);
  contact(out, 706, 758, 96, 6, 0.2);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
