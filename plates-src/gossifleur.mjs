// NO. 0829 — a flower on a pincushion of bracts, and two seeds from one head.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the flower. A broad yellow bloom of five rounded petals,
//      seen from a little above — and under it, a ruff of long curved bracts
//      in orange-red, sweeping out and down like the spokes of a pincushion
//      flower — set on a short teal-green stem with one leaf. The yellow
//      flower over the red ruff the specimen is.
//   2. The field note's record is a plant that anchors to bask, then whirls
//      away on the wind — anchored first, airborne second.
//   3. The note's point is that some plants hedge by making two different
//      seeds on the same head. In many daisies the outer seeds come out
//      heavy, hooked, dormant, and stay near the parent, while the inner ones
//      are light and plumed and go. Fig. 2: a head cut through, a heavy
//      hooked seed from its rim and a plumed one from its middle.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "gossifleur";
export const no = 829;
const SIZE = 800;
const BRACT = { light: "#f8a878", base: "#e0583a", deep: "#b0382a", shade: "#6e2018", edge: "#6e2018" };
const LEAF = { light: "#b8e0cc", base: "#5aa68a", deep: "#347a62", shade: "#1e4e3e", edge: "#1e4e3e" };

export function draw() {
  const rand = mulberry32(829);
  const defs = standardDefs(829);
  const out = [];
  contact(out, 320, 758, 200, 14);

  out.push(`<path d="M320,760 L320,640" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M320,760 L320,640" stroke="#5a9a7a" stroke-width="9" stroke-linecap="round"/>`);
  const lf = blade([[320, 730], [370, 710], [420, 716], [450, 736]], { width: (u) => 26 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), sideVeins: 4, rand });
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, margin: 4 });
  // the ruff of bracts, sweeping out and down, back ones first
  const hub = [320, 560];
  const bracts = [];
  for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2 + 0.1; bracts.push({ a, z: Math.sin(a) }); }
  bracts.sort((p, q) => p.z - q.z).forEach(({ a }, i) => {
    const L = 170, dx = Math.cos(a), dz = Math.sin(a);
    const pts = [[hub[0] + dx * 30, hub[1] + dz * 10], [hub[0] + dx * L * 0.55, hub[1] + dz * 22 - 10], [hub[0] + dx * L * 0.9, hub[1] + dz * 34 + 40], [hub[0] + dx * L, hub[1] + dz * 40 + 90]];
    const b = blade(pts, { width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 1.1), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id: `b${i}`, palette: BRACT, defs, out, shade: dz < 0 ? 0.3 : 0, margin: 3, veinOpacity: 0.3 });
  });
  // the flower on top: five broad rounded petals, yellow
  defs.push(`<radialGradient id="pt" cx="320" cy="530" r="120" gradientUnits="userSpaceOnUse"><stop offset="0.1" stop-color="#e8b02a"/><stop offset="0.6" stop-color="#f6d84a"/><stop offset="1" stop-color="#fcf0a0"/></radialGradient>`);
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2 + 0.2;
    const px = 320 + Math.cos(a) * 60, py = 530 + Math.sin(a) * 38;
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="66" ry="44" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="url(#pt)" stroke="${INK}" stroke-width="1.8"/>`);
    out.push(`<path d="M${r1(320 + Math.cos(a) * 16)},${r1(530 + Math.sin(a) * 10)} L${r1(320 + Math.cos(a) * 100)},${r1(530 + Math.sin(a) * 64)}" stroke="#c89a1c" stroke-width="1.2" stroke-opacity="0.5"/>`);
  }
  out.push(`<circle cx="320" cy="530" r="16" fill="#c8841c" stroke="${INK}" stroke-width="1.2"/>`);

  // ── fig. 2: a head cut through, and its two seeds ─────────────────────────
  const fx = 680, fy = 700;
  const figFrom = out.length;
  out.push(`<path d="M${fx - 70},${fy} C${fx - 60},${fy - 50} ${fx + 60},${fy - 50} ${fx + 70},${fy} Z" fill="#f2e2a0" stroke="${INK}" stroke-width="1.4"/>`);
  for (let k = 0; k < 13; k++) { const x = fx - 60 + k * 10; out.push(`<path d="M${x},${fy - 30 + Math.abs(x - fx) * 0.4} l0,-16" stroke="${k === 0 || k === 12 ? "#6e4a2a" : "#b8a46a"}" stroke-width="${k === 0 || k === 12 ? 5 : 2}"/>`); }
  // the heavy hooked outer seed, and the light plumed inner one
  out.push(`<ellipse cx="${fx - 36}" cy="750" rx="12" ry="8" fill="#6e4a2a" stroke="${INK}" stroke-width="1"/><path d="M${fx - 46},744 q-6,-8 0,-12 M${fx - 26},744 q6,-8 0,-12" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<ellipse cx="${fx + 40}" cy="756" rx="4" ry="7" fill="#b8a46a" stroke="${INK}" stroke-width="0.8"/><path d="M${fx + 40},749 L${fx + 40},722" stroke="${INK}" stroke-width="0.8"/>`);
  for (let k = 0; k < 9; k++) { const a = -Math.PI + (k / 8) * Math.PI; out.push(`<path d="M${fx + 40},722 l${r1(Math.cos(a) * 18)},${r1(Math.sin(a) * 14)}" stroke="#c8bc98" stroke-width="0.9"/>`); }
  out.push(`<g transform="translate(${fx} 762) scale(1.45) translate(${-fx} -762)">${out.splice(figFrom).join("")}</g>`);
  contact(out, fx, 764, 120, 5, 0.18);

  return { size: SIZE, view: [0, 420, SIZE, 370], defs: defs.join("\n"), body: out.join("\n") };
}
