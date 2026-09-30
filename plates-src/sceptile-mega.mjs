// NO. 0254 (Mega) — the seed-leaf ripened red, and why tall trees get struck.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the cycad's seed-leaf of NO. 0254 at full ripeness. The same
//      felted stalk, and along it more seeds than before, eight, their colour
//      turned from gold to orange and red as cycad seeds do when ripe; and
//      behind it the frond, its long leaflets flushed red at their tips. The
//      string of orange-red seeds and the red-tipped frond of the Mega form.
//   2. The record is the ordinary form's: blade-sharp leaves and seeds full of
//      nutrients.
//   3. The note's point is the form's ability, and a real hazard of height.
//      Tall isolated trees are lightning rods: the shortest path to ground,
//      struck again and again, and the current running down the wet wood under
//      the bark can blow a strip of it clean off, spiralling with the grain.
//      Fig. 2: a tall tree, and the scar spiralling down its trunk.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "sceptile-mega";
export const no = 254;
const SIZE = 800;
const FELT = { light: "#d8b88a", base: "#b08a5c", deep: "#7a5a36", shade: "#4e3820", edge: "#4e3820" };

export function draw() {
  const rand = mulberry32(2540);
  const defs = standardDefs(2540);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the frond behind, its leaflets flushed red at the tips
  const at = (u) => [0, 1].map((k) => (1 - u) ** 2 * [470, 756][k] + 2 * u * (1 - u) * [400, 330][k] + u * u * [110, 380][k]);
  const leaflets = [];
  for (let i = 4; i <= 60; i++) {
    const u = i / 60, [bx, by] = at(u), [nx, ny] = at(Math.min(1, u + 0.01));
    const tl = Math.hypot(nx - bx, ny - by) || 1, tx = (nx - bx) / tl, ty = (ny - by) / tl;
    const len = 104 * (1 - 0.55 * u) * Math.min(1, u * 6);
    for (const side of [-1, 1]) {
      const ang = side * 1.05, ox = tx * Math.cos(ang) - ty * Math.sin(ang), oy = tx * Math.sin(ang) + ty * Math.cos(ang);
      const tip = [bx + ox * len, by + oy * len], mid = [bx + ox * len * 0.7, by + oy * len * 0.7];
      leaflets.push(`<path d="M${r1(bx)},${r1(by)} L${r1(mid[0] - oy * 3)},${r1(mid[1] + ox * 3)} L${r1(tip[0])},${r1(tip[1])} L${r1(mid[0] + oy * 3)},${r1(mid[1] - ox * 3)} Z" fill="${side > 0 ? "#23592f" : "#357a42"}" stroke="${INK}" stroke-width="0.7"/><path d="M${r1(mid[0])},${r1(mid[1])} L${r1(tip[0])},${r1(tip[1])}" stroke="#c83a2a" stroke-width="3" stroke-linecap="round"/>`);
    }
  }
  out.push(leaflets.join(""));
  const rach = [];
  for (let i = 0; i <= 24; i++) rach.push(at(i / 24));
  out.push(`<path d="M${rach.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${rach.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")}" fill="none" stroke="#6e7a3e" stroke-width="4.4" stroke-linecap="round"/>`);
  // the seed-leaf: felted stalk, eight seeds ripened orange to red
  const S = [[300, 758], [306, 660], [318, 560], [340, 440]];
  const stalk = blade(S, { width: (u) => 13 - u * 4, sideVeins: 0, rand, start: 0 });
  paintBlade(stalk, { id: "st", palette: FELT, defs, out, margin: 3, midrib: false, veinOpacity: 0 });
  const tip = blade([[340, 444], [352, 390], [362, 330], [368, 282]], { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.8), lobes: 9, depth: 0.82, start: 0.08, sideVeins: 0, rand });
  paintBlade(tip, { id: "tp", palette: FELT, defs, out, margin: 3, veinOpacity: 0 });
  const COLS = [["#fbd08a", "#e8842e", "#b8541e"], ["#f8a88a", "#d8442e", "#8e1e14"]];
  [0.14, 0.3, 0.46, 0.62].forEach((u, k) => {
    const f = stalk.frames[Math.round(u * (stalk.frames.length - 1))];
    for (const side of [-1, 1]) {
      const r = 22 - k * 1.2, x = f.p[0] + f.n[0] * (r + 8) * side, y = f.p[1] + f.n[1] * (r + 8) * side - 4;
      const c = COLS[k > 1 ? 1 : 0], id = `s${k}${side}`;
      defs.push(`<radialGradient id="${id}" cx="0.36" cy="0.32" r="0.75"><stop offset="0" stop-color="${c[0]}"/><stop offset="0.5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient>`);
      out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r)}" ry="${r1(r * 1.08)}" fill="url(#${id})" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
    }
  });

  // ── fig. 2: a tall tree, its lightning scar spiralling down ───────────────
  const fx = 700;
  out.push(`<path d="M${fx - 14},766 L${fx - 8},560 L${fx + 8},560 L${fx + 14},766 Z" fill="#8a6a4a" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<ellipse cx="${fx}" cy="560" rx="44" ry="40" fill="#3e7a44" stroke="${INK}" stroke-width="1.3"/>`);
  const sc = [];
  for (let k = 0; k <= 20; k++) { const t = k / 20; sc.push(`${k ? "L" : "M"}${r1(fx + Math.sin(t * Math.PI * 3) * (8 + t * 5))},${r1(590 + t * 170)}`); }
  out.push(`<path d="${sc.join(" ")}" fill="none" stroke="#f2e2b8" stroke-width="4"/>`);
  out.push(`<path d="M${fx - 40},470 L${fx - 20},500 L${fx - 30},504 L${fx - 4},530" fill="none" stroke="#e8c84a" stroke-width="3" stroke-linejoin="round"/>`);
  contact(out, fx, 768, 60, 5, 0.18);

  return { size: SIZE, view: [0, 240, SIZE, 550], defs: defs.join("\n"), body: out.join("\n") };
}
