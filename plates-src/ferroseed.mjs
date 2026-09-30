// NO. 0597 — a burr, and the hook that invented a fastener.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the burr. A round seed-head, grey-green and hard, girdled by
//      a raised band round its middle, and set all over with stout spines,
//      each spine green and ending in a small hook — the spiked ball the
//      specimen is. On a short broken stalk, fallen.
//   2. The field note's record is that it clings to cave ceilings and draws
//      iron from the rock.
//   3. The note's point is that a burr is tuned to its carrier: its hooks
//      are scaled to catch fibres of a particular thickness, and species
//      differ in how long they hold, which decides how far the seed goes.
//      De Mestral, walking his dog, looked at burdock burrs under a lens and
//      made Velcro of what he saw. Fig. 2: that view — one hook, and the
//      loop of hair it has caught.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "ferroseed";
export const no = 597;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(597);
  const defs = standardDefs(597);
  const out = [];
  contact(out, 320, 758, 190, 16);

  const cx = 320, cy = 590, R = 150;
  // the spines behind the ball first (the upper-back half), then the ball,
  // then the front ones
  const spines = [];
  for (let k = 0; k < 60; k++) {
    const y = 1 - (2 * (k + 0.5)) / 60, rr = Math.sqrt(1 - y * y), a = k * 2.39996;
    spines.push({ d: [Math.cos(a) * rr, y, Math.sin(a) * rr] });
  }
  const spine = ({ d }) => {
    const [dx, dy] = d;
    const bx = cx + dx * R * 0.96, by = cy + dy * R * 0.9;
    const L = 46;
    const tx = cx + dx * (R + L), ty = cy + dy * (R * 0.9 + L);
    const nx = -dy, ny = dx, w = 11;
    out.push(`<path d="M${r1(bx + nx * w)},${r1(by + ny * w)} L${r1(tx)},${r1(ty)} L${r1(bx - nx * w)},${r1(by - ny * w)} Z" fill="#4e9a5a" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>`);
    // the hook at its tip
    out.push(`<path d="M${r1(tx)},${r1(ty)} q${r1(nx * 7 + dx * 4)},${r1(ny * 7 + dy * 4)} ${r1(nx * 6 - dx * 4)},${r1(ny * 6 - dy * 4)}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`);
  };
  spines.filter((s) => s.d[2] < -0.1).forEach(spine);
  defs.push(`<radialGradient id="bl" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#d8dcd4"/><stop offset="0.6" stop-color="#9aa29a"/><stop offset="1" stop-color="#5e665e"/></radialGradient>`);
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * 0.9}" fill="url(#bl)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // the girdle round its middle
  out.push(`<path d="M${cx - R + 4},${cy + 6} C${cx - R * 0.5},${cy + 34} ${cx + R * 0.5},${cy + 34} ${cx + R - 4},${cy + 6}" fill="none" stroke="#4e564e" stroke-width="14"/><path d="M${cx - R + 4},${cy + 2} C${cx - R * 0.5},${cy + 30} ${cx + R * 0.5},${cy + 30} ${cx + R - 4},${cy + 2}" fill="none" stroke="#c8ccc4" stroke-width="3"/>`);
  spines.filter((s) => s.d[2] >= -0.1).forEach(spine);
  // the broken stalk
  out.push(`<path d="M${cx + 60},${cy + R * 0.86} l40,24 l-6,8 l-40,-22 Z" fill="#8a7a54" stroke="${INK}" stroke-width="1.2"/>`);
  void rand;

  // ── fig. 2: one hook, and the loop of hair it has caught ──────────────────
  const fx = 690, fy = 690;
  out.push(`<circle cx="${fx}" cy="${fy}" r="80" fill="#f4f0e4" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M${fx - 20},${fy + 76} L${fx - 6},${fy - 30} C${fx - 2},${fy - 56} ${fx + 30},${fy - 56} ${fx + 30},${fy - 30} C${fx + 30},${fy - 16} ${fx + 18},${fy - 12} ${fx + 12},${fy - 20}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${fx - 20},${fy + 76} L${fx - 6},${fy - 30} C${fx - 2},${fy - 56} ${fx + 30},${fy - 56} ${fx + 30},${fy - 30} C${fx + 30},${fy - 16} ${fx + 18},${fy - 12} ${fx + 12},${fy - 20}" fill="none" stroke="#4e9a5a" stroke-width="7" stroke-linecap="round"/>`);
  out.push(`<path d="M${fx - 76},${fy + 10} C${fx - 20},${fy - 6} ${fx + 10},${fy - 50} ${fx + 20},${fy - 40} C${fx + 30},${fy - 30} ${fx + 40},${fy + 20} ${fx + 76},${fy + 26}" fill="none" stroke="#8a6a44" stroke-width="3"/>`);
  contact(out, fx, fy + 88, 70, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
