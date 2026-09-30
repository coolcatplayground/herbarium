// NO. 0546 — a cotton boll, burst, and the sugar it pays ants with.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the boll. A cotton fruit split open along its seams into
//      four dry brown segments, and out of it the fibre bursting in soft
//      round lobes, cream-white, far larger than the capsule that held it —
//      and on either side of it a broad green bract, ragged at the tip: the
//      two leaves at the sides of the specimen's puff.
//   2. The field note's record is that it sheds cotton as a decoy and grows
//      it back, and that the cotton makes fine stuffing.
//   3. The note's point is that cotton feeds ants on purpose. It carries
//      nectaries away from the flower — on the leaf veins and the bracts —
//      secreting sugar for no pollinator at all, and the ants that come for
//      it patrol the plant and take the caterpillars. Fig. 2: the back of a
//      cotton leaf, the nectary on its midrib glistening, an ant at it.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "cottonee";
export const no = 546;
const SIZE = 800;
const BRACT = { light: "#b8e0a0", base: "#4aa05a", deep: "#2c7a3e", shade: "#1a4e26", edge: "#1a4e26" };
const HULL = "#8a6440";

export function draw() {
  const rand = mulberry32(546);
  const defs = standardDefs(546);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the two bracts at the sides, broad, ragged at the tip
  for (const s of [-1, 1]) {
    const pts = [[320 + s * 40, 690], [320 + s * 120, 660], [320 + s * 200, 640], [320 + s * 250, 660]];
    const b = blade(pts, { width: (u) => 50 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.6), 0.6), lobes: 5, depth: 0.45, start: 0.7, sideVeins: 5, rand });
    paintBlade(b, { id: `b${s}`, palette: BRACT, defs, out, shade: s > 0 ? 0.2 : 0, margin: 6 });
  }
  // the split capsule behind the fibre: four dry segments
  for (const [a, L] of [[-2.5, 120], [-1.9, 110], [-1.2, 110], [-0.6, 120]]) {
    const x = 320 + Math.cos(a) * L, y = 700 + Math.sin(a) * L * 0.8;
    out.push(`<path d="M320,720 Q${r1((320 + x) / 2 + Math.sin(a) * 30)},${r1((720 + y) / 2)} ${r1(x)},${r1(y)} Q${r1((320 + x) / 2 - Math.sin(a) * 10)},${r1((720 + y) / 2 + 20)} 320,720 Z" fill="${HULL}" stroke="${INK}" stroke-width="1.4"/>`);
  }
  // the fibre: soft round lobes, cream-white, with shading between
  const LOBES = [[260, 640, 70], [380, 636, 72], [320, 600, 82], [230, 690, 54], [410, 690, 56], [320, 680, 70]];
  defs.push(`<radialGradient id="ct" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#f2efe4"/><stop offset="1" stop-color="#d8d4c4"/></radialGradient>`);
  for (const [x, y, r] of LOBES) {
    const pts = [];
    for (let j = 0; j < 28; j++) { const a = (j / 28) * Math.PI * 2; pts.push([x + Math.cos(a) * r * (1 + (rand() - 0.5) * 0.08), y + Math.sin(a) * r * 0.86 * (1 + (rand() - 0.5) * 0.08)]); }
    out.push(`<path d="${smooth(pts, true)}" fill="url(#ct)" stroke="${INK}" stroke-width="1.5" filter="url(#pen)"/>`);
    const w = [];
    for (let k = 0; k < 8; k++) { const a = rand() * Math.PI * 2, rr = rand() * r * 0.7; w.push(`M${r1(x + Math.cos(a) * rr)},${r1(y + Math.sin(a) * rr * 0.86)} q${r1(6 + rand() * 6)},${r1(-3)} ${r1(12 + rand() * 6)},${r1(rand() * 4)}`); }
    out.push(`<path d="${w.join(" ")}" fill="none" stroke="#c8c2b0" stroke-width="1" stroke-opacity="0.7"/>`);
  }

  // ── fig. 2: a nectary on the leaf's midrib, and an ant at it ──────────────
  const fx = 690, fy = 690;
  const lf = blade([[fx - 90, fy + 60], [fx - 20, fy + 20], [fx + 50, fy - 30], [fx + 90, fy - 70]], { width: (u) => 50 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96)), 0.7), sideVeins: 5, rand });
  paintBlade(lf, { id: "lf", palette: { light: "#dcefc4", base: "#9cc884", deep: "#6a9a5a", shade: "#3a6036", edge: "#3a6036" }, defs, out, margin: 4 });
  const [nx, ny] = lf.spine[Math.round(0.3 * (lf.spine.length - 1))];
  out.push(`<ellipse cx="${r1(nx)}" cy="${r1(ny)}" rx="6" ry="4" fill="#e8c84a" stroke="${INK}" stroke-width="0.8"/><circle cx="${r1(nx - 2)}" cy="${r1(ny - 7)}" r="4" fill="#fbf4d0" fill-opacity="0.9" stroke="${INK}" stroke-width="0.6"/>`);
  const ax = nx + 22, ay = ny - 18;
  out.push(`<ellipse cx="${r1(ax + 12)}" cy="${r1(ay - 6)}" rx="9" ry="6" fill="#3a2418"/><ellipse cx="${r1(ax)}" cy="${r1(ay)}" rx="5" ry="4" fill="#3a2418"/><ellipse cx="${r1(ax - 9)}" cy="${r1(ay + 5)}" rx="5" ry="4.4" fill="#3a2418"/>`);
  out.push(`<path d="M${r1(ax)},${r1(ay)} l-4,10 M${r1(ax)},${r1(ay)} l6,10 M${r1(ax + 2)},${r1(ay)} l10,6 M${r1(ax - 12)},${r1(ay + 6)} l-4,4" stroke="#3a2418" stroke-width="1.2"/>`);
  contact(out, fx, fy + 70, 90, 5, 0.18);

  return { size: SIZE, view: [0, 470, SIZE, 320], defs: defs.join("\n"), body: out.join("\n") };
}
