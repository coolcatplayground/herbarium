// NO. 0811 — two sticks, and why a thin ring can be a lot of wood.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the sticks. Two lengths of branch, crossed — the pair the
//      specimen drums with — pale wood, bark peeling at their ends, and on
//      one of them a small side shoot with a tuft of yellow-green leaves, the
//      colour of the tuft on the specimen's head.
//   2. The field note's record cares about the rhythm; the note takes the
//      stick itself.
//   3. The note's point is that a thinning ring does not mean a slowing tree.
//      Wood is added as a whole cylinder each year, so the volume depends on
//      the circumference as much as on the ring's width: double the radius
//      and the same width buys twice the wood. Fig. 2: a young stem and an
//      old trunk cut across, the last ring of each shaded — the old one
//      thinner, and far more wood.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "thwackey";
export const no = 811;
const SIZE = 800;
const TUFT = { light: "#f0f4b0", base: "#c8dc6a", deep: "#8aa844", shade: "#546a26", edge: "#546a26" };

function stick(out, defs, id, x0, y0, x1, y1, r) {
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * r, ny = Math.cos(a) * r;
  defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r1(x0 + nx)}" y1="${r1(y0 + ny)}" x2="${r1(x0 - nx)}" y2="${r1(y0 - ny)}"><stop offset="0" stop-color="#6e5438"/><stop offset="0.5" stop-color="#b8946a"/><stop offset="1" stop-color="#e2c89a"/></linearGradient>`);
  out.push(`<path d="M${r1(x0 + nx)},${r1(y0 + ny)} L${r1(x1 + nx)},${r1(y1 + ny)} L${r1(x1 - nx)},${r1(y1 - ny)} L${r1(x0 - nx)},${r1(y0 - ny)} Z" fill="url(#${id})" stroke="${INK}" stroke-width="1.7" filter="url(#pen)"/>`);
  for (const [x, y] of [[x0, y0], [x1, y1]]) out.push(`<ellipse cx="${x}" cy="${y}" rx="${r1(r * 0.4)}" ry="${r}" transform="rotate(${r1((a * 180) / Math.PI)} ${x} ${y})" fill="#f2e2c0" stroke="${INK}" stroke-width="1.3"/>`);
  // peeling bark near the ends
  for (const u of [0.1, 0.88]) {
    const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u;
    out.push(`<path d="M${r1(x + nx)},${r1(y + ny)} q${r1(Math.cos(a) * 20)},${r1(Math.sin(a) * 20 + 8)} ${r1(Math.cos(a) * 34)},${r1(Math.sin(a) * 34 + 2)}" fill="none" stroke="#5a4028" stroke-width="2.4"/>`);
  }
}

export function draw() {
  const rand = mulberry32(811);
  const defs = standardDefs(811);
  const out = [];
  contact(out, 320, 758, 240, 14);
  stick(out, defs, "a", 100, 690, 540, 752, 16);
  stick(out, defs, "b", 120, 752, 520, 640, 16);
  // the side shoot on the upper stick, with its yellow-green tuft
  const sx = 400, sy = 674;
  out.push(`<path d="M${sx},${sy} C${sx + 4},${sy - 30} ${sx + 16},${sy - 50} ${sx + 20},${sy - 70}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${sx},${sy} C${sx + 4},${sy - 30} ${sx + 16},${sy - 50} ${sx + 20},${sy - 70}" fill="none" stroke="#8a7a4a" stroke-width="5" stroke-linecap="round"/>`);
  for (const [a, L] of [[-2.4, 70], [-1.9, 90], [-1.4, 96], [-0.9, 80], [-0.5, 60]]) {
    const b = blade([[sx + 20, sy - 68], [sx + 20 + Math.cos(a) * L * 0.5, sy - 68 + Math.sin(a) * L * 0.5], [sx + 20 + Math.cos(a) * L, sy - 68 + Math.sin(a) * L]], { width: (u) => 13 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id: `t${r1(a * 10)}`, palette: TUFT, defs, out, margin: 2, ink: 1.2, veinOpacity: 0.3 });
  }

  // ── fig. 2: a young stem and an old trunk, the last ring of each shaded ────
  const disc = (x, y, R, rings) => {
    out.push(`<circle cx="${x}" cy="${y}" r="${R + 4}" fill="#6e5438" stroke="${INK}" stroke-width="1.4"/>`);
    out.push(`<circle cx="${x}" cy="${y}" r="${R}" fill="#c88a4a"/>`);
    const last = R / rings;
    out.push(`<circle cx="${x}" cy="${y}" r="${R - (rings > 6 ? last * 0.5 : last)}" fill="#f2dcb0"/>`);
    for (let k = 1; k < rings; k++) out.push(`<circle cx="${x}" cy="${y}" r="${r1((R * k) / rings)}" fill="none" stroke="#a8784a" stroke-width="1"/>`);
  };
  disc(628, 732, 24, 4);
  disc(730, 706, 60, 14);
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 490, SIZE, 300], defs: defs.join("\n"), body: out.join("\n") };
}
