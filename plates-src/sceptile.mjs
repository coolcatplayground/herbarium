// NO. 0254 — six seeds on a cycad's leaf, and the wood behind them.
//
// What the morphology says, and what each observation became:
//
//   1. The part: six yellow seeds in a row. A female cycad does not make a
//      cone of scales so much as a crown of seed-leaves — felted, brown, each
//      ending in a comb of teeth — and it carries its big seeds along the
//      stalk of each, bare, three to a side. One seed-leaf, then, standing,
//      its six seeds ripe and golden.
//   2. Behind it, the second part: one of the plant's own fronds, stiff and
//      dark, long narrow leaflets set close along it like the teeth of a
//      saw and sharp at the tips.
//   3. The field note's point is lignin — the compound that let plants stand
//      up, a tangled mesh laid through the cell wall that almost nothing can
//      digest. Fig. 2: wood through a lens, each cell a thick brown wall
//      round an empty centre.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "sceptile";
export const no = 254;
const SIZE = 800;
const FROND = { light: "#8fc88a", base: "#357a42", deep: "#23592f", shade: "#153a1e" };
const FELT = { light: "#d8b88a", base: "#b08a5c", deep: "#7a5a36", shade: "#4e3820", edge: "#4e3820" };
const SEED = { light: "#fdeea0", base: "#f0c23c", deep: "#c88a1c" };

// a stiff frond: rachis on a quadratic, needle leaflets set close and straight
function frond(out, defs, p0, p1, p2) {
  const at = (u) => [0, 1].map((k) => (1 - u) ** 2 * p0[k] + 2 * u * (1 - u) * p1[k] + u * u * p2[k]);
  const L = { "-1": [], "1": [] };
  for (let i = 4; i <= 60; i++) {
    const u = i / 60;
    const [bx, by] = at(u), [nx, ny] = at(Math.min(1, u + 0.01));
    const tl = Math.hypot(nx - bx, ny - by) || 1, tx = (nx - bx) / tl, ty = (ny - by) / tl;
    const len = 104 * (1 - 0.55 * u) * Math.min(1, u * 6);
    for (const side of [-1, 1]) {
      const ang = side * 1.05;
      const ox = tx * Math.cos(ang) - ty * Math.sin(ang), oy = tx * Math.sin(ang) + ty * Math.cos(ang);
      const tip = [bx + ox * len, by + oy * len];
      const px = -oy * 3.2, py = ox * 3.2, mx = (bx + tip[0]) / 2, my = (by + tip[1]) / 2;
      L[side].push(`M${r1(bx)},${r1(by)} Q${r1(mx + px)},${r1(my + py)} ${r1(tip[0])},${r1(tip[1])} Q${r1(mx - px)},${r1(my - py)} ${r1(bx)},${r1(by)} Z`);
    }
  }
  for (const [side, dark] of [["1", true], ["-1", false]]) {
    const d = L[side].join(" ");
    out.push(`<path d="${d}" fill="${dark ? FROND.deep : FROND.base}"/><path d="${d}" fill="${FROND.light}" fill-opacity="${dark ? 0.1 : 0.25}" filter="url(#wc)"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" stroke-opacity="0.75"/>`);
  }
  const rach = [];
  for (let i = 0; i <= 24; i++) rach.push(at(i / 24));
  const rd = smooth(rach);
  out.push(`<g filter="url(#pen)"><path d="${rd}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${rd}" fill="none" stroke="#6e7a3e" stroke-width="4.4" stroke-linecap="round"/></g>`);
}

export function draw() {
  const rand = mulberry32(254);
  const defs = standardDefs(254);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the frond, rising behind from the right and arching over to the left
  frond(out, defs, [470, 756], [400, 330], [110, 380]);

  // the seed-leaf: a felted stalk, the comb of teeth at its tip
  const S = [[300, 758], [306, 660], [318, 560], [340, 470]];
  const stalk = blade(S, { width: (u) => 13 - u * 4, sideVeins: 0, rand, start: 0 });
  paintBlade(stalk, { id: "st", palette: FELT, defs, out, margin: 3, midrib: false, veinOpacity: 0 });
  const tip = blade([[340, 474], [352, 420], [362, 360], [368, 312]], {
    width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.8),
    lobes: 9, depth: 0.82, start: 0.08, sideVeins: 0, rand,
  });
  paintBlade(tip, { id: "tp", palette: FELT, defs, out, margin: 3, veinOpacity: 0 });
  // the felt: short fine hairs along the stalk
  const hairs = [];
  for (let k = 0; k < 60; k++) {
    const f = stalk.frames[Math.round(rand() * (stalk.frames.length - 1))];
    const side = rand() < 0.5 ? -1 : 1, w = 11;
    const [x, y] = [f.p[0] + f.n[0] * w * side * 0.9, f.p[1] + f.n[1] * w * side * 0.9];
    hairs.push(`M${r1(x)},${r1(y)} l${r1(f.n[0] * side * 3)},${r1(f.n[1] * side * 3 - 1)}`);
  }
  out.push(`<path d="${hairs.join(" ")}" stroke="${FELT.shade}" stroke-width="0.8" stroke-opacity="0.6"/>`);

  // the six seeds, three to a side, bare along the stalk
  defs.push(`<radialGradient id="sd" cx="0.36" cy="0.32" r="0.75"><stop offset="0" stop-color="${SEED.light}"/><stop offset="0.5" stop-color="${SEED.base}"/><stop offset="1" stop-color="${SEED.deep}"/></radialGradient>`);
  [0.2, 0.42, 0.64].forEach((u, k) => {
    const f = stalk.frames[Math.round(u * (stalk.frames.length - 1))];
    for (const side of [-1, 1]) {
      const r = 24 - k * 1.5;
      const x = f.p[0] + f.n[0] * (r + 8) * side, y = f.p[1] + f.n[1] * (r + 8) * side - 4;
      out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r)}" ry="${r1(r * 1.08)}" fill="url(#sd)" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
      out.push(`<ellipse cx="${r1(x - r * 0.32)}" cy="${r1(y - r * 0.38)}" rx="${r1(r * 0.3)}" ry="${r1(r * 0.18)}" fill="#fffbe0" fill-opacity="0.8"/>`);
    }
  });

  // ── fig. 2: wood through a lens ───────────────────────────────────────────
  const fx = 684, fy = 668, R = 92;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${R}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#8a5a2e"/>`);
  const cells = [];
  // cells in radial files, as wood is cut across: each a lumen inside a
  // thick wall, the walls of neighbours pressed into one
  const s = 16;
  for (let row = -7; row <= 7; row++) {
    for (let col = -8; col <= 8; col++) {
      const x = fx + col * s * 1.02 + (row % 2 ? s * 0.5 : 0), y = fy + row * s * 0.9;
      const w = s * (0.34 + rand() * 0.06), h = s * (0.28 + rand() * 0.06);
      const pts = [[x - w, y - h * 0.6], [x - w * 0.5, y - h], [x + w * 0.5, y - h], [x + w, y - h * 0.6], [x + w, y + h * 0.6], [x + w * 0.5, y + h], [x - w * 0.5, y + h], [x - w, y + h * 0.6]];
      cells.push(`<path d="${pts.map(([px, py], i) => `${i ? "L" : "M"}${r1(px)},${r1(py)}`).join(" ")} Z"/>`);
    }
  }
  out.push(`<g clip-path="url(#lens)" fill="#f4e8cc" stroke="#5a3a1c" stroke-width="0.8">${cells.join("")}</g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  contact(out, fx, fy + R + 8, 74, 6, 0.18);

  return { size: SIZE, view: [0, 250, SIZE, 540], defs: defs.join("\n"), body: out.join("\n") };
}
