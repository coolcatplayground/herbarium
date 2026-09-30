// NO. 0455 — a trap, and a faster one under water.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the trap of a Venus flytrap. Each is a leaf's tip grown into
//      two hinged lobes, green outside and flushed red within, their margins
//      fringed with long stiff cilia that interlock when the trap shuts, and
//      on the inner face of each lobe three fine trigger hairs. Three traps
//      on their broad flat stalks from one rosette, one open wide, one half
//      shut, one shut with its cilia crossed.
//   2. The field note's record is prey drawn in by sweet secretions and a
//      whole day taken to eat.
//   3. The note's point is that the flytrap is not the fastest plant. The
//      bladderwort, a rootless aquatic, carries hundreds of hollow bladders a
//      millimetre or two across, each pumped out until its walls are drawn
//      in under real negative pressure; a trigger hair at the door releases
//      it, and the bladder takes in water and prey in under a millisecond.
//      Fig. 2: one bladder, its trap door and the hairs at its mouth.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "carnivine";
export const no = 455;
const SIZE = 800;
const LEAF = { light: "#c4e4a0", base: "#76b458", deep: "#4a8a3e", shade: "#2a5a26", edge: "#2a5a26" };
const RED = "#c83e4a";

// a trap: two lobes hinged along a midrib, opened by `gape` (0 shut, 1 flat)
function trap(out, x, y, a, s, gape) {
  const L = 70 * s, W = 34 * s;
  const ax = Math.cos(a), ay = Math.sin(a), nx = -ay, ny = ax;
  const at = (u, v) => [x + ax * L * u + nx * v, y + ay * L * u + ny * v];
  for (const side of [-1, 1]) {
    const open = side * W * (0.25 + 0.75 * gape);
    const edge = [];
    for (let j = 0; j <= 16; j++) {
      const u = j / 16, w = Math.sin(Math.PI * u) ** 0.8;
      edge.push(at(u, open * w - (1 - gape) * side * 6 * w));
    }
    const d = `M${r1(x)},${r1(y)} ` + edge.map(([ex, ey]) => `L${r1(ex)},${r1(ey)}`).join(" ") + ` L${r1(at(1, 0)[0])},${r1(at(1, 0)[1])} Z`;
    // the inner face, flushed red, and the outer rim green
    out.push(`<path d="${d}" fill="${gape > 0.3 ? RED : LEAF.base}" stroke="${INK}" stroke-width="1.4"/>`);
    if (gape > 0.3) {
      out.push(`<path d="${d}" fill="none" stroke="${LEAF.base}" stroke-width="7" stroke-opacity="0.9" stroke-linejoin="round"/>`);
      // the three trigger hairs
      for (const u of [0.3, 0.5, 0.7]) { const [hx, hy] = at(u, open * 0.4); out.push(`<path d="M${r1(hx)},${r1(hy)} l${r1(-nx * side * 5)},${r1(-ny * side * 5)}" stroke="#f4e0d0" stroke-width="1.4"/>`); }
    }
    // the cilia along the margin
    const cil = [];
    for (let j = 2; j < 15; j++) {
      const [ex, ey] = edge[j];
      const len = 12 * s;
      const dirx = nx * side * (0.3 + gape) + ax * 0.2, diry = ny * side * (0.3 + gape) + ay * 0.2;
      const dl = Math.hypot(dirx, diry) || 1;
      cil.push(`M${r1(ex)},${r1(ey)} l${r1((dirx / dl) * len)},${r1((diry / dl) * len)}`);
    }
    out.push(`<path d="${cil.join(" ")}" stroke="${LEAF.deep}" stroke-width="1.6" stroke-linecap="round"/>`);
  }
  out.push(`<path d="M${r1(x)},${r1(y)} L${r1(at(1, 0)[0])},${r1(at(1, 0)[1])}" stroke="${LEAF.shade}" stroke-width="1.6"/>`);
}

export function draw() {
  const rand = mulberry32(455);
  const defs = standardDefs(455);
  const out = [];
  contact(out, 320, 758, 220, 16);

  // three broad flat leaf-stalks from one rosette at the foot
  const foot = [320, 748];
  const STALKS = [[-2.3, 190, 0.45], [-1.55, 230, 1], [-0.8, 200, 0.05]];
  for (const [a, L] of STALKS) {
    const tip = [foot[0] + Math.cos(a) * L, foot[1] + Math.sin(a) * L];
    const b = blade([foot, [foot[0] + Math.cos(a) * L * 0.5, foot[1] + Math.sin(a) * L * 0.5 - 6], tip], {
      width: (u) => 6 + 18 * Math.pow(Math.min(1, u * 1.2), 1.2) * (u > 0.92 ? (1 - u) * 12 : 1), sideVeins: 3, rand,
    });
    paintBlade(b, { id: `st${r1(a * 10)}`, palette: LEAF, defs, out, margin: 3 });
  }
  // the traps at their tips
  for (const [a, L, gape] of STALKS) {
    const tip = [foot[0] + Math.cos(a) * L, foot[1] + Math.sin(a) * L];
    trap(out, tip[0], tip[1], a + (a < -1.6 ? -0.2 : 0.2), 1.3, gape);
  }

  // ── fig. 2: a bladderwort bladder, its door and trigger hairs ─────────────
  const fx = 660, fy = 690;
  out.push(`<path d="M${fx - 60},${fy + 40} C${fx - 80},${fy - 20} ${fx - 30},${fy - 60} ${fx + 20},${fy - 50} C${fx + 70},${fy - 40} ${fx + 80},${fy + 20} ${fx + 40},${fy + 50} C${fx},${fy + 70} ${fx - 40},${fy + 64} ${fx - 60},${fy + 40} Z" fill="#dcecc8" fill-opacity="0.8" stroke="${INK}" stroke-width="1.6"/>`);
  // the walls drawn in, and the door at its mouth
  out.push(`<path d="M${fx - 40},${fy + 30} C${fx - 50},${fy - 10} ${fx - 20},${fy - 34} ${fx + 14},${fy - 30}" fill="none" stroke="#8aac6a" stroke-width="1.2" stroke-dasharray="4 3"/>`);
  out.push(`<path d="M${fx + 52},${fy - 6} L${fx + 60},${fy + 22}" stroke="${INK}" stroke-width="3"/>`);
  for (const [dx, dy, a] of [[62, -10, -0.6], [66, 4, 0], [64, 24, 0.6]]) out.push(`<path d="M${fx + dx},${fy + dy} l${r1(Math.cos(a) * 18)},${r1(Math.sin(a) * 18)}" stroke="${INK}" stroke-width="1.2"/>`);
  // the water rushing in
  out.push(`<path d="M${fx + 110},${fy + 8} L${fx + 72},${fy + 8}" stroke="#5a8ed4" stroke-width="1.8" stroke-dasharray="5 4"/><path d="M${fx + 80},${fy + 2} L${fx + 72},${fy + 8} L${fx + 80},${fy + 14}" fill="none" stroke="#5a8ed4" stroke-width="1.8"/>`);
  out.push(`<path d="M${fx - 60},${fy + 40} C${fx - 70},${fy + 60} ${fx - 90},${fy + 70} ${fx - 100},${fy + 74}" fill="none" stroke="${INK}" stroke-width="3"/>`);
  contact(out, fx, fy + 80, 80, 5, 0.18);

  return { size: SIZE, view: [0, 420, SIZE, 370], defs: defs.join("\n"), body: out.join("\n") };
}
