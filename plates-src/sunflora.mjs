// NO. 0192 — a thousand flowers, placed at 137.5 degrees.
//
// What the morphology says, and what each observation became:
//
//   1. A sunflower head: a ring of long yellow rays round a broad disc.
//   2. The disc is the point. The field note: what reads as one flower is a
//      thousand, a packed disc of florets opening in rings from the rim in,
//      each placed about 137.5° round from the one before — the golden
//      angle, the worst possible approximation to any fraction, so no two
//      florets ever line up and the disc packs without gaps. Drawn by that
//      rule, floret by floret: the spirals that appear are not drawn in, they
//      come out of the angle, exactly as they do in the plant.
//   3. A green stem with two broad leaves.
//   4. Fig. 2 is the rule itself: a small disc by the same angle, with one
//      spiral of each family picked out — 13 wind one way, 21 the other, both
//      Fibonacci numbers, and neither drawn in.
import { mulberry32, r1, smooth, mix, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "sunflora";
export const no = 192;
const SIZE = 800;
const RAY = { light: "#fcf2ba", base: "#f7d97e", deep: "#d7ac44", shade: "#9a7424", edge: "#8e6a22" };
const LEAF = { light: "#bfe0ae", base: "#7dc177", deep: "#4c8a4a", shade: "#2e5a2e", edge: "#2e5a2e" };
const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // 137.508°

// Every floret by the one rule. `arms` picks out whole spirals: [every, colour]
// lights florets n, n+every, n+2·every… which is one parastichy.
function disc(out, cx, cy, R, ky, n, arms = []) {
  const c = R / Math.sqrt(n);
  const fl = [];
  for (let i = 1; i <= n; i++) {
    const r = c * Math.sqrt(i), a = i * GOLDEN;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * ky;
    // young florets at the centre are greener; the opened ones at the rim brown
    const t = r / R;
    const arm = arms.find(([every]) => i % every === 0);
    const col = arm ? arm[1] : mix("#c9c05a", "#8a5428", Math.min(1, t * 1.3));
    fl.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(c * 0.74)}" ry="${r1(c * 0.74 * ky)}" fill="${col}"/>`);
  }
  out.push(`<g stroke="#2a1608" stroke-width="0.5">${fl.join("")}</g>`);
}

export function draw() {
  const rand = mulberry32(192);
  const defs = standardDefs(192);
  const out = [];
  const cx = 322, cy = 396, ky = 0.9;
  contact(out, cx, 758, 130, 14);

  // the stem, and two broad leaves
  out.push(`<path d="M${cx - 12},${cy + 110} C${cx - 14},560 ${cx - 16},680 ${cx - 18},756 L${cx + 18},756 C${cx + 16},680 ${cx + 14},560 ${cx + 12},${cy + 110} Z" fill="#7db462" stroke="${INK}" stroke-width="1.8"/>`);
  for (const side of [-1, 1]) {
    const b = blade([[cx, 600], [cx + side * 80, 574], [cx + side * 160, 590], [cx + side * 210, 630]], {
      width: (u) => 50 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.7), 0.65), sideVeins: 7, rand,
    });
    paintBlade(b, { id: `lf${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.25 : 0, margin: 6 });
  }

  // the rays, two rings of them, the back ring first
  for (const [n, R0, R1, off, dark] of [[14, 110, 234, 0.11, 0.25], [14, 110, 218, 0.34, 0]]) {
    const rays = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + off;
      const w = 0.12;
      const P = (ang, r) => [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * ky];
      const pts = [P(a - w, R0), P(a - w * 0.8, (R0 + R1) * 0.55), P(a - w * 0.35, R1 * 0.96), P(a, R1), P(a + w * 0.35, R1 * 0.96), P(a + w * 0.8, (R0 + R1) * 0.55), P(a + w, R0)];
      rays.push(smooth(pts, true));
    }
    const all = rays.join(" ");
    defs.push(`<radialGradient id="rg${off}" cx="${cx}" cy="${cy}" r="${R1}" gradientUnits="userSpaceOnUse"><stop offset="0.45" stop-color="${RAY.deep}"/><stop offset="0.75" stop-color="${RAY.base}"/><stop offset="1" stop-color="${RAY.light}"/></radialGradient>`);
    out.push(`<path d="${all}" fill="${mix(RAY.base, RAY.deep, dark)}"/><path d="${all}" fill="url(#rg${off})" filter="url(#wc)" fill-opacity="${dark ? 0.7 : 0.95}"/>`);
    const veins = rays.map((_, k) => { const a = (k / n) * Math.PI * 2 + off; return `M${r1(cx + Math.cos(a) * (R0 + 10))},${r1(cy + Math.sin(a) * (R0 + 10) * ky)} L${r1(cx + Math.cos(a) * (R1 - 14))},${r1(cy + Math.sin(a) * (R1 - 14) * ky)}`; }).join(" ");
    out.push(`<path d="${veins}" stroke="${RAY.edge}" stroke-width="0.9" stroke-opacity="0.35"/>`);
    out.push(`<g filter="url(#pen)"><path d="${all}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/></g>`);
  }
  // the disc, by the golden angle
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="118" ry="${r1(118 * ky)}" fill="#4a2c14" stroke="${INK}" stroke-width="2"/>`);
  disc(out, cx, cy, 114, ky, 620);

  // ── fig. 2: the rule ──────────────────────────────────────────────────────
  // a small disc by the same angle, with one spiral of each family picked out:
  // every 13th floret winds one way, every 21st the other
  const fx = 690, fy = 684;
  out.push(`<circle cx="${fx}" cy="${fy}" r="76" fill="#4a2c14" stroke="${INK}" stroke-width="1.6"/>`);
  disc(out, fx, fy, 72, 1, 240, [[13, "#f6d23c"], [21, "#fbf3dc"]]);
  contact(out, fx, 768, 80, 6, 0.2);

  return { size: SIZE, view: [0, 140, SIZE, 640], defs: defs.join("\n"), body: out.join("\n") };
}
