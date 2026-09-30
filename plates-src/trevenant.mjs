// NO. 0709 — an old hollow trunk, and the heartwood that died on purpose.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the trunk. A short, massive old trunk, fissured bark ridged
//      and twisted, spreading at its foot into a skirt of surface roots that
//      grip the ground in all directions — and from its knuckled top, a
//      pollard's crown of many shoots with clumps of dark leaf. The trunk has gone
//      hollow up one side, a long ragged split opening onto the dark inside,
//      as very old trees do and go on living. The gnarled trunk, the spread
//      roots and the leafy clumps.
//   2. The field note's record is roots that tie into the trees around it.
//   3. The note's point is that the middle of a trunk is dead on purpose. As
//      a tree thickens, its oldest wood is retired: the vessels are plugged,
//      the cells die, and the whole core is filled with the resins and
//      tannins that give heartwood its colour and its resistance to rot. Fig.
//      2: the trunk cut across — dark heartwood at the centre, pale living
//      sapwood round it, bark outside.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "trevenant";
export const no = 709;
const SIZE = 800;
const CROWN = ["#2e6a34", "#3e7e40", "#4e924c", "#5aa256"];

function clump(out, rand, cx, cy, rx, ry) {
  const lv = [];
  for (let k = 0; k < 110; k++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand());
    const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
    const aa = rand() * Math.PI * 2, L = 10 + rand() * 6;
    lv.push(`<path d="M${r1(x)},${r1(y)} q${r1(Math.cos(aa) * L * 0.5 - Math.sin(aa) * 4)},${r1(Math.sin(aa) * L * 0.5 + Math.cos(aa) * 4)} ${r1(Math.cos(aa) * L)},${r1(Math.sin(aa) * L)} q${r1(-Math.cos(aa) * L * 0.5 - Math.sin(aa) * 4)},${r1(-Math.sin(aa) * L * 0.5 + Math.cos(aa) * 4)} ${r1(-Math.cos(aa) * L)},${r1(-Math.sin(aa) * L)} Z" fill="${CROWN[Math.floor(rand() * 4)]}"/>`);
  }
  const hull = [];
  for (let j = 0; j < 22; j++) { const a = (j / 22) * Math.PI * 2; hull.push([cx + Math.cos(a) * rx * (1 + (rand() - 0.5) * 0.16), cy + Math.sin(a) * ry * (1 + (rand() - 0.5) * 0.16)]); }
  out.push(`<path d="${smooth(hull, true)}" fill="${CROWN[0]}" stroke="${INK}" stroke-width="1.5" filter="url(#pen)"/>`);
  out.push(lv.join(""));
}

export function draw() {
  const rand = mulberry32(709);
  const defs = standardDefs(709);
  const out = [];
  contact(out, 320, 758, 240, 16);

  // the crown: a knuckled pollard head, many shoots rising from it at once,
  // leaf clumps at uneven heights. (Two limbs out to either side over
  // spread roots read as a figure with arms and legs.)
  const SHOOTS = [[250, 480, 200, 330], [286, 470, 280, 290], [320, 466, 340, 300], [356, 470, 420, 340], [300, 474, 250, 380], [340, 472, 400, 400]];
  for (const [x0, y0, x1, y1] of SHOOTS) out.push(`<path d="M${x0},${y0} Q${(x0 + x1) / 2 + 6},${(y0 + y1) / 2} ${x1},${y1}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x0},${y0} Q${(x0 + x1) / 2 + 6},${(y0 + y1) / 2} ${x1},${y1}" fill="none" stroke="#6e5a44" stroke-width="7" stroke-linecap="round"/>`);
  clump(out, rand, 200, 320, 62, 44);
  clump(out, rand, 420, 332, 66, 46);
  clump(out, rand, 290, 272, 76, 50);
  clump(out, rand, 360, 290, 60, 44);
  clump(out, rand, 246, 372, 50, 36);
  clump(out, rand, 404, 390, 48, 34);
  // surface roots: many, low, gripping all round the foot
  for (let k = 0; k < 9; k++) {
    const u = k / 8 - 0.5;
    const x1 = 320 + u * 360, y1 = 752 + Math.abs(u) * 6;
    const d = `M${r1(320 + u * 120)},712 C${r1(320 + u * 200)},726 ${r1(x1 - u * 40)},${r1(y1 - 10)} ${r1(x1)},${r1(y1)}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(12 - Math.abs(u) * 8)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#7a6048" stroke-width="${r1(9 - Math.abs(u) * 7)}" stroke-linecap="round"/>`);
  }
  // the trunk: squat, massive, fissured, knuckled at the top
  const trunk = `M222,730 C232,650 240,560 250,480 C270,454 370,454 390,480 C400,560 408,650 418,730 Z`;
  defs.push(`<linearGradient id="tk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8906e"/><stop offset="0.5" stop-color="#7a6048"/><stop offset="1" stop-color="#4a3a2a"/></linearGradient>`);
  defs.push(`<clipPath id="tc"><path d="${trunk}"/></clipPath>`);
  out.push(`<path d="${trunk}" fill="url(#tk)"/>`);
  const ridges = [];
  for (let k = 0; k < 10; k++) { const x = 236 + k * 18; ridges.push(`M${x},730 C${x + 10},650 ${x - 8},560 ${x + 6},470`); }
  out.push(`<path d="${ridges.join(" ")}" fill="none" stroke="#3a2c1e" stroke-width="2" stroke-opacity="0.7" clip-path="url(#tc)"/>`);
  // the hollow: one long ragged split up its side, off-centre
  out.push(`<path d="M364,712 C356,660 372,610 362,550 C358,590 346,630 350,670 C352,690 358,704 364,712 Z" fill="#2a1e14" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="${trunk}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);

  // ── fig. 2: the trunk cut across — heartwood, sapwood, bark ───────────────
  const fx = 690, fy = 690, R = 78;
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#5a3a24" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R - 8}" fill="#e8d4a8"/>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R - 28}" fill="#9a5a2e"/>`);
  for (let k = 1; k <= 8; k++) out.push(`<circle cx="${fx}" cy="${fy}" r="${(R - 10) * (k / 9)}" fill="none" stroke="#6e3e1e" stroke-width="0.8" stroke-opacity="0.6"/>`);
  contact(out, fx, fy + R + 6, 70, 5, 0.18);

  return { size: SIZE, view: [0, 210, SIZE, 580], defs: defs.join("\n"), body: out.join("\n") };
}
