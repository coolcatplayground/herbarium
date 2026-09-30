// NO. 0841 — a pair of keys, and the vortex that holds one up.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the keys. A double samara — two winged seeds joined at the
//      base, as a maple's are — the seeds swollen and red, the wings broad,
//      thin and veined, flushed apple-red at their roots and pale tan toward
//      their rounded, notched tips. The red-and-tan wings the specimen
//      spreads, which the field note likens to apple skin.
//   2. The note's record is a sour apple and an acid held in the cheeks —
//      and malic acid is what makes an apple tart.
//   3. The note's point is that a maple key does not fall so much as fly,
//      and the way an insect does. Spinning, the wing makes a leading-edge
//      vortex — a tube of swirling air riding on its upper surface that keeps
//      the flow attached and roughly doubles the lift — the same trick hovering
//      insects and bats use. Fig. 2: one key spinning down, its path a
//      helix, the vortex drawn along the wing's front edge.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "flapple";
export const no = 841;
const SIZE = 800;

// one winged seed: a swollen seed at the base and a broad wing beyond it
function key(out, defs, id, x, y, a, L, W) {
  const ca = Math.cos(a), sa = Math.sin(a), T = (u, v) => [x + ca * u - sa * v, y + sa * u + ca * v];
  const P = (pts) => pts.map(([u, v]) => T(u, v)).map(([px, py], i) => `${i ? "L" : "M"}${r1(px)},${r1(py)}`).join(" ");
  // the wing: straight along its front edge, bellied behind, notched at its tip
  const wing = [];
  for (let j = 0; j <= 20; j++) { const u = j / 20; wing.push([L * (0.2 + 0.8 * u), -W * 0.12 - 2 * u]); }
  for (let j = 20; j >= 0; j--) { const u = j / 20; wing.push([L * (0.2 + 0.8 * u) - (j === 20 ? 8 : 0), W * Math.sin(Math.PI * Math.min(1, 0.15 + u * 0.8)) ** 0.8 * (1 - 0.1 * (j === 18 ? 1 : 0))]); }
  const [g0x, g0y] = T(0, 0), [g1x, g1y] = T(L, 0);
  defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r1(g0x)}" y1="${r1(g0y)}" x2="${r1(g1x)}" y2="${r1(g1y)}"><stop offset="0.15" stop-color="#c8343e"/><stop offset="0.5" stop-color="#e8a888"/><stop offset="1" stop-color="#f2dcb0"/></linearGradient>`);
  out.push(`<path d="${P(wing)} Z" fill="url(#${id})" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" filter="url(#pen)"/>`);
  // veins fanning back from the front edge
  const v = [];
  for (let k = 1; k < 9; k++) { const u = 0.2 + k * 0.09; v.push(P([[L * u, -W * 0.1], [L * (u + 0.08), W * 0.7 * Math.sin(Math.PI * Math.min(1, u))]])); }
  out.push(`<path d="${v.join(" ")}" fill="none" stroke="#8a4a3a" stroke-width="1" stroke-opacity="0.45"/>`);
  // the seed, swollen and red
  // (Round and highlighted, the two seeds side by side read as eyes; they
  // are drawn long, ridged and matte.)
  out.push(`<path d="${P([[0, 0], [L * 0.1, -W * 0.2], [L * 0.26, -W * 0.12], [L * 0.28, W * 0.14], [L * 0.1, W * 0.26]])} Z" fill="#8a2a2a" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`);
  out.push(`<path d="${P([[L * 0.04, 0], [L * 0.24, 0]])} ${P([[L * 0.06, W * 0.12], [L * 0.22, W * 0.06]])}" fill="none" stroke="#5a1a1a" stroke-width="1.2"/>`);
}

export function draw() {
  const rand = mulberry32(841);
  const defs = standardDefs(841);
  const out = [];
  contact(out, 320, 758, 230, 14);
  // the pair, joined at the base, lying with the wings raised in a V
  const base = [320, 700];
  // lying on the ground, the two keys spread wide and uneven as a fallen
  // pair lies — one reaching back along the ground, one lifted
  key(out, defs, "k1", base[0], base[1] + 30, Math.PI - 0.12, 240, 78);
  key(out, defs, "k2", base[0] + 4, base[1] + 26, -0.62, 250, 80);
  out.push(`<path d="M${base[0] + 2},${base[1] + 28} l10,-40" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${base[0] + 2},${base[1] + 28} l10,-40" stroke="#7a5a3a" stroke-width="3" stroke-linecap="round"/>`);
  void rand;

  // ── fig. 2: one key spinning down, its vortex ─────────────────────────────
  const fx = 690;
  const helix = [];
  for (let k = 0; k <= 60; k++) { const t = k / 60; helix.push(`${k ? "L" : "M"}${r1(fx + Math.sin(t * Math.PI * 6) * 30)},${r1(580 + t * 150)}`); }
  out.push(`<path d="${helix.join(" ")}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3"/>`);
  key(out, defs, "k3", fx - 10, 740, -0.2, 90, 30);
  // the leading-edge vortex, a tube of swirl along the wing's front
  for (let k = 0; k < 4; k++) { const x = fx + 6 + k * 18, y = 736 - k * 4; out.push(`<path d="M${x - 6},${y} a6,6 0 1,1 6,6" fill="none" stroke="#5a8ed4" stroke-width="1.6"/>`); }
  contact(out, fx + 30, 768, 80, 5, 0.18);

  return { size: SIZE, view: [0, 470, SIZE, 320], defs: defs.join("\n"), body: out.join("\n") };
}
