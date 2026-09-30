// NO. 1010 — a sheaf of sword-leaves, and a machine a plant builds from the dead.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the blades. A sheaf of stiff sword-shaped leaves, like an
//      iris fan — flat, straight-edged, glossy green with a faint metallic
//      sheen, each tipped in magenta where the new tissue flushes — set
//      edge-on to one another in a fan from one base. The field note files it
//      as a mechanical hybrid, and what it has of a plant is its shining
//      blades: that is what is drawn.
//   2. The record hedges everything: future-Virizion, julienning trees.
//   3. The note's point is that the most reliable machine a plant builds has
//      no living parts. A pine cone opens and shuts with the humidity for years
//      after the tree that made it has died, because each scale is two layers
//      whose fibres run different ways and swell by different amounts — wet,
//      the scale bends shut; dry, it bends open. Fig. 2: one cone wet and
//      closed, and dry and open.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "iron-leaves";
export const no = 1010;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(1010);
  const defs = standardDefs(1010);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the sheaf: sword-leaves edge-on in a fan, outer ones first
  const base = [320, 752];
  const BL = [[-2.35, 250, 34], [-0.79, 250, 34], [-2.0, 320, 38], [-1.14, 320, 38], [-1.72, 380, 40], [-1.42, 380, 40], [-1.57, 420, 42]];
  BL.forEach(([a, L, W], i) => {
    const ca = Math.cos(a), sa = Math.sin(a), nx = -sa, ny = ca;
    const p = (u, v) => [base[0] + ca * L * u + nx * v, base[1] + sa * L * u + ny * v];
    // an iris leaf: parallel-sided for most of its length, then drawn in a long
    // curve to a fine point. (Cut off with a flat pink cone, it read as a
    // coloured pencil.)
    const half = (u) => (W * 0.5) * (u < 0.62 ? 1 : Math.cos(((u - 0.62) / 0.38) * Math.PI / 2) ** 0.8);
    const left = [], right = [];
    for (let j = 0; j <= 30; j++) { const u = j / 30; left.push(p(u, -half(u))); right.push(p(u, half(u))); }
    const d = `M${[...left, ...right.reverse()].map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} Z`;
    const [g0x, g0y] = p(0, 0), [g1x, g1y] = p(1, 0);
    defs.push(`<linearGradient id="g${i}" gradientUnits="userSpaceOnUse" x1="${r1(g0x)}" y1="${r1(g0y)}" x2="${r1(g1x)}" y2="${r1(g1y)}"><stop offset="0" stop-color="#1e5a34"/><stop offset="0.4" stop-color="#2e8a4a"/><stop offset="0.72" stop-color="#4ab45e"/><stop offset="0.86" stop-color="#c85a8a"/><stop offset="1" stop-color="#e04e8a"/></linearGradient>`);
    out.push(`<path d="${d}" fill="url(#g${i})" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" filter="url(#pen)"/>`);
    // the metallic sheen along one side, and the crease down its middle
    out.push(`<path d="M${r1(p(0.05, -W * 0.28)[0])},${r1(p(0.05, -W * 0.28)[1])} L${r1(p(0.7, -W * 0.22)[0])},${r1(p(0.7, -W * 0.22)[1])}" stroke="#d8f4d8" stroke-width="3" stroke-opacity="0.55" stroke-linecap="round"/>`);
    out.push(`<path d="M${r1(p(0.02, 0)[0])},${r1(p(0.02, 0)[1])} L${r1(p(0.96, 0)[0])},${r1(p(0.96, 0)[1])}" stroke="#123a22" stroke-width="1" stroke-opacity="0.6"/>`);
  });
  // the sheath at the base
  out.push(`<path d="M296,760 L300,700 L340,700 L344,760 Z" fill="#8ab870" stroke="${INK}" stroke-width="1.4"/>`);
  void rand;

  // ── fig. 2: a pine cone, wet and shut, dry and open ───────────────────────
  const cone = (x, open) => {
    const g = 766;
    out.push(`<path d="M${x},${g - 110} l0,-14" stroke="${INK}" stroke-width="3"/>`);
    for (let row = 0; row < 7; row++) {
      const y = g - 100 + row * 14, w = 26 * Math.sin(Math.PI * Math.min(1, (row + 1) / 7.5)) + 4;
      for (const s of [-1, 0, 1]) {
        const sx = x + s * w * 0.6;
        const spread = open ? s * 12 + (s === 0 ? 0 : 0) : 0;
        out.push(`<path d="M${sx - 7},${y} L${sx + spread},${y + (open ? 14 : 12)} L${sx + 7},${y} Z" fill="#9a6a3e" stroke="${INK}" stroke-width="0.9" transform="rotate(${open ? s * 30 : 0} ${sx} ${y})"/>`);
      }
    }
  };
  cone(640, false);
  cone(740, true);
  for (const [x, y] of [[616, 640], [630, 628], [652, 636]]) out.push(`<path d="M${x},${y} q-3,6 0,9 q3,-3 0,-9 Z" fill="#8ab8e0" stroke="${INK}" stroke-width="0.6"/>`);
  out.push(`<circle cx="760" cy="626" r="10" fill="#f2cf3e" stroke="${INK}" stroke-width="1"/>`);
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 310, SIZE, 480], defs: defs.join("\n"), body: out.join("\n") };
}
