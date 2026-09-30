// NO. 0652 — a husk grown to a shield, and the hardest thing a plant makes.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the husk, fully woody. A chestnut burr at the end of its
//      life, dried hard and pale, opened into four thick valves — one
//      rising behind, two curved out and down to the ground, one folded down
//      in front, a woody cup — their outer faces covered in stiff cream-white spines
//      grown into a bristling mat, their rims edged green where the last of
//      the living tissue is — and in its centre one great polished nut,
//      rich brown. The cream shell with green edges that the specimen wears.
//   2. The field note's record is withstanding things: a tackle that flips a
//      tank, a stance that takes a blast.
//   3. The note's point is that the hardest thing a plant makes is not wood.
//      Tagua, the seed of a South American palm, packs its endosperm so
//      densely with mannan that the nut takes a polish and turns on a lathe
//      like ivory — the button trade ran on it. Fig. 2: a tagua nut, its
//      brown skin, the ivory-white inside where it has been cut, and a button
//      turned from it.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "chesnaught";
export const no = 652;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(652);
  const defs = standardDefs(652);
  const out = [];
  contact(out, 320, 758, 240, 16);

  const cx = 320, cy = 660;
  defs.push(`<linearGradient id="vl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf4e0"/><stop offset="0.6" stop-color="#e8dcc0"/><stop offset="1" stop-color="#b8a47e"/></linearGradient>`);
  const valve = (d) => {
    out.push(`<path d="${d}" fill="url(#vl)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
    out.push(`<path d="${d}" fill="none" stroke="#6ea456" stroke-width="6" stroke-opacity="0.75"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  };
  const spines = (x0, y0, x1, y1, n) => {
    const sp = [];
    for (let k = 0; k < n; k++) {
      const u = rand(), v = rand();
      const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * v;
      const aa = -Math.PI / 2 + (rand() - 0.5) * 1.4;
      sp.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(aa) * 14)},${r1(Math.sin(aa) * 14)}`);
    }
    out.push(`<path d="${sp.join(" ")}" stroke="#a8946a" stroke-width="2.2" stroke-linecap="round"/><path d="${sp.join(" ")}" stroke="#fbf6e6" stroke-width="1" stroke-linecap="round"/>`);
  };
  // the back valve rising behind the nut
  valve(`M${cx - 110},${cy - 30} C${cx - 120},${cy - 160} ${cx + 120},${cy - 160} ${cx + 110},${cy - 30} Z`);
  spines(cx - 90, cy - 130, cx + 90, cy - 50, 50);
  // the two side valves curved out and down to the ground
  valve(`M${cx - 100},${cy - 30} C${cx - 180},${cy - 40} ${cx - 240},${cy + 20} ${cx - 250},${cy + 90} C${cx - 190},${cy + 70} ${cx - 120},${cy + 40} ${cx - 60},${cy + 30} Z`);
  valve(`M${cx + 100},${cy - 30} C${cx + 180},${cy - 40} ${cx + 240},${cy + 20} ${cx + 250},${cy + 90} C${cx + 190},${cy + 70} ${cx + 120},${cy + 40} ${cx + 60},${cy + 30} Z`);
  spines(cx - 230, cy - 20, cx - 110, cy + 60, 30);
  spines(cx + 110, cy - 20, cx + 230, cy + 60, 30);
  // the great polished nut, sitting in the cup
  defs.push(`<radialGradient id="nt" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="#c88a54"/><stop offset="0.55" stop-color="#7a4222"/><stop offset="1" stop-color="#3e1e0e"/></radialGradient>`);
  out.push(`<path d="M${cx - 80},${cy + 20} C${cx - 88},${cy - 60} ${cx - 30},${cy - 116} ${cx},${cy - 122} C${cx + 30},${cy - 116} ${cx + 88},${cy - 60} ${cx + 80},${cy + 20} Z" fill="url(#nt)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="${cx - 26}" cy="${cy - 60}" rx="13" ry="30" transform="rotate(14 ${cx - 26} ${cy - 60})" fill="#ffffff" fill-opacity="0.45"/>`);
  out.push(`<path d="M${cx},${cy - 122} l0,-14" stroke="#dcc8a0" stroke-width="3"/>`);
  // the front valve folded down in front, spined, over the nut's foot
  valve(`M${cx - 120},${cy + 10} C${cx - 60},${cy - 6} ${cx + 60},${cy - 6} ${cx + 120},${cy + 10} C${cx + 110},${cy + 70} ${cx - 110},${cy + 70} ${cx - 120},${cy + 10} Z`);
  spines(cx - 100, cy + 10, cx + 100, cy + 56, 60);

  // ── fig. 2: a tagua nut cut, and a button turned from it ──────────────────
  const fx = 660, fy = 710;
  out.push(`<path d="M${fx - 46},${fy + 30} C${fx - 56},${fy - 20} ${fx - 30},${fy - 56} ${fx},${fy - 58} C${fx + 30},${fy - 56} ${fx + 56},${fy - 20} ${fx + 46},${fy + 30} C${fx + 20},${fy + 50} ${fx - 20},${fy + 50} ${fx - 46},${fy + 30} Z" fill="#6e4a2a" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M${fx - 40},${fy + 10} C${fx - 40},${fy - 30} ${fx + 40},${fy - 30} ${fx + 40},${fy + 10} C${fx + 20},${fy + 28} ${fx - 20},${fy + 28} ${fx - 40},${fy + 10} Z" fill="#fbf6e6" stroke="${INK}" stroke-width="1.2"/>`);
  const bx = 760, by = 730;
  out.push(`<circle cx="${bx}" cy="${by}" r="22" fill="#fbf4e0" stroke="${INK}" stroke-width="1.4"/><circle cx="${bx}" cy="${by}" r="16" fill="none" stroke="#c8b894" stroke-width="1.4"/>`);
  for (const [dx, dy] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) out.push(`<circle cx="${bx + dx}" cy="${by + dy}" r="2.4" fill="#8a7a54"/>`);
  contact(out, 704, 758, 100, 5, 0.18);

  return { size: SIZE, view: [0, 440, SIZE, 350], defs: defs.join("\n"), body: out.join("\n") };
}
