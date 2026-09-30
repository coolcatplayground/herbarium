// NO. 0640 — a tuft of grass, and the glass inside a blade.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a tuft of grass. Long pointed blades, bright green, rising
//      and arching outward from one crown, a few standing tall and swept —
//      and among them the flowering stems, each ending in a slender head with
//      pink anthers hanging from it. The swept green blades and the touch of
//      pink the specimen is drawn in.
//   2. The field note's record is thin on biology and firm on one thing: it
//      fought to protect its friends.
//   3. The note's point is the story of grass and grazers: that grazers
//      evolved taller teeth to cope with the glass in grass, and that the
//      dates do not quite fit. The glass is real. Grass loads its leaves with
//      silica, laid down as tiny hard bodies — phytoliths — shaped
//      differently in each kind of grass. Fig. 2: a grass blade under a lens,
//      its rows of cells and the silica bodies among them.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "virizion";
export const no = 640;
const SIZE = 800;
const GRASS = { light: "#d4f0b0", base: "#7cc860", deep: "#4a9a44", shade: "#2a6028", edge: "#2a6028" };

export function draw() {
  const rand = mulberry32(640);
  const defs = standardDefs(640);
  const out = [];
  contact(out, 320, 758, 200, 14);

  const crown = [320, 752];
  // the flowering stems behind the blades
  for (const [a, L] of [[-1.9, 380], [-1.35, 400], [-1.62, 440]]) {
    const ex = crown[0] + Math.cos(a) * L, ey = crown[1] + Math.sin(a) * L;
    out.push(`<path d="M${crown[0]},${crown[1]} Q${r1(crown[0] + Math.cos(a) * L * 0.5)},${r1(crown[1] + Math.sin(a) * L * 0.5 - 10)} ${r1(ex)},${r1(ey)}" fill="none" stroke="${INK}" stroke-width="4"/><path d="M${crown[0]},${crown[1]} Q${r1(crown[0] + Math.cos(a) * L * 0.5)},${r1(crown[1] + Math.sin(a) * L * 0.5 - 10)} ${r1(ex)},${r1(ey)}" fill="none" stroke="#9ab870" stroke-width="2.4"/>`);
    // the slender head, and pink anthers hanging from it
    for (let k = 0; k < 7; k++) {
      const u = k / 7, x = ex - Math.cos(a) * u * 60, y = ey - Math.sin(a) * u * 60;
      out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="4" ry="8" transform="rotate(${r1((a * 180) / Math.PI + 90)} ${r1(x)} ${r1(y)})" fill="#a8c878" stroke="${INK}" stroke-width="0.7"/>`);
      out.push(`<path d="M${r1(x)},${r1(y)} l${k % 2 ? 7 : -7},8" stroke="#c8a0a8" stroke-width="0.8"/><ellipse cx="${r1(x + (k % 2 ? 8 : -8))}" cy="${r1(y + 12)}" rx="2.4" ry="4.4" fill="#e886a8" stroke="${INK}" stroke-width="0.5"/>`);
    }
  }
  // the blades, arching outward, outer ones first
  const BL = [[-2.7, 240, 1.6], [-0.44, 240, -1.6], [-2.6, 320, 1.1], [-0.54, 320, -1.1], [-2.2, 360, 0.7], [-0.94, 360, -0.7], [-1.8, 380, 0.3], [-1.34, 380, -0.3]];
  BL.forEach(([a, L, curl], i) => {
    const pts = [];
    for (let j = 0; j <= 5; j++) { const u = j / 5, aa = a - curl * u * u * 0.16; pts.push([crown[0] + Math.cos(aa) * L * u, crown[1] + Math.sin(aa) * L * u]); }
    const b = blade(pts, { width: (u) => 17 * Math.pow(1 - u, 0.7) * Math.min(1, u * 10 + 0.4) + 0.5, sideVeins: 0, rand });
    paintBlade(b, { id: `b${i}`, palette: GRASS, defs, out, shade: i < 4 ? 0.2 : 0, margin: 3, veinOpacity: 0.5 });
  });

  // ── fig. 2: a grass blade under a lens, its silica bodies ─────────────────
  const fx = 690, fy = 670, R = 90;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${R}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#d8f0c0"/>`);
  const cells = [];
  for (let row = -5; row <= 5; row++) {
    const y = fy + row * 17;
    for (let c = -6; c <= 6; c++) {
      const x = fx + c * 30 + (row % 2 ? 15 : 0);
      cells.push(`<rect x="${x - 13}" y="${y - 7}" width="26" height="14" rx="3" fill="none" stroke="#6aa050" stroke-width="1"/>`);
      if ((row + c) % 3 === 0) cells.push(`<path d="M${x - 5},${y} q2.5,-5 5,0 q2.5,5 5,0" fill="none" stroke="#f4f8fa" stroke-width="3.4"/><path d="M${x - 5},${y} q2.5,-5 5,0 q2.5,5 5,0" fill="none" stroke="#6a8ab0" stroke-width="1"/>`);
    }
  }
  out.push(`<g clip-path="url(#lens)">${cells.join("")}</g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  contact(out, fx, fy + R + 6, 70, 5, 0.18);

  return { size: SIZE, view: [0, 280, SIZE, 510], defs: defs.join("\n"), body: out.join("\n") };
}
