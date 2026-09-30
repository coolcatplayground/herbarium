// NO. 0547 — old man's beard, and the lightest seeds of all.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a seed head of Clematis — old man's beard — gone to fluff.
//      A great soft cloud of cream plumes, each seed trailing a long curling
//      feathered tail, massed into a round head far bigger than the flower
//      that made it; and from the stem beneath it, two leaf-stalks curled
//      into tight green spirals, the way a clematis grips. The cream cloud
//      and the curled green are what the specimen is.
//   2. The field note's record is rootlessness: it drifts on the wind and
//      turns up everywhere.
//   3. The note's point is that the lightest seeds carry almost nothing. An
//      orchid seed weighs a few millionths of a gram — a scrap of embryo in a
//      papery coat, no food packed beside it — and one capsule holds a
//      million of them, drifting like dust. Fig. 2: an orchid capsule split
//      along its seams, pouring seed like smoke.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "whimsicott";
export const no = 547;
const SIZE = 800;

// a tendril curled into a spiral
function spiral(out, x, y, dir, R) {
  const pts = [];
  for (let k = 0; k <= 60; k++) { const u = k / 60, a = u * Math.PI * 3.4, r = R * (1 - u * 0.85); pts.push([x + dir * (R - Math.cos(a) * r), y - Math.sin(a) * r]); }
  const d = smooth(pts);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#4aa05a" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#b8e0a0" stroke-width="2.4" transform="translate(-1 -1)"/>`);
}

export function draw() {
  const rand = mulberry32(547);
  const defs = standardDefs(547);
  const out = [];
  contact(out, 320, 758, 200, 16);

  // the stem, and the two leaf-stalks curled into spirals below the head
  out.push(`<path d="M318,760 C316,720 320,680 320,640" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M318,760 C316,720 320,680 320,640" fill="none" stroke="#7a6040" stroke-width="7" stroke-linecap="round"/>`);
  spiral(out, 300, 690, -1, 46);
  spiral(out, 340, 690, 1, 46);

  // the cloud: a dense round head of feathery plumes
  const cx = 320, cy = 480, R = 200;
  defs.push(`<radialGradient id="cl" cx="0.42" cy="0.38" r="0.62"><stop offset="0" stop-color="#fffdf2"/><stop offset="0.7" stop-color="#f2ead2"/><stop offset="1" stop-color="#dcd0ae"/></radialGradient>`);
  const hull = [];
  for (let j = 0; j < 40; j++) { const a = (j / 40) * Math.PI * 2; hull.push([cx + Math.cos(a) * R * (1 + (rand() - 0.5) * 0.1), cy + Math.sin(a) * R * 0.86 * (1 + (rand() - 0.5) * 0.1)]); }
  out.push(`<path d="${smooth(hull, true)}" fill="url(#cl)" stroke="${INK}" stroke-width="1.4" filter="url(#pen)"/>`);
  // plumes: curling feathered tails, each from a seed near the middle
  const plumes = [];
  for (let k = 0; k < 150; k++) {
    const a = rand() * Math.PI * 2, L = R * (0.55 + rand() * 0.42);
    const x0 = cx + Math.cos(a) * 20, y0 = cy + Math.sin(a) * 18;
    const bend = (rand() - 0.5) * 1.2;
    const pts = [];
    for (let j = 0; j <= 8; j++) { const u = j / 8, aa = a + bend * u * u; pts.push([x0 + Math.cos(aa) * L * u, y0 + Math.sin(aa) * L * u * 0.86]); }
    plumes.push(smooth(pts));
  }
  out.push(`<path d="${plumes.join(" ")}" fill="none" stroke="#fffdf4" stroke-width="3.4" stroke-opacity="0.9"/>`);
  out.push(`<path d="${plumes.join(" ")}" fill="none" stroke="#c8bc98" stroke-width="0.7" stroke-opacity="0.8"/>`);
  // the seeds at the centre, small and brown
  const seeds = [];
  for (let k = 0; k < 30; k++) { const a = rand() * Math.PI * 2, r = rand() * 18; seeds.push(`<ellipse cx="${r1(cx + Math.cos(a) * r)}" cy="${r1(cy + Math.sin(a) * r)}" rx="4" ry="2.6" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(cx + Math.cos(a) * r)} ${r1(cy + Math.sin(a) * r)})" fill="#8a6a44"/>`); }
  out.push(seeds.join(""));

  // ── fig. 2: an orchid capsule, split, pouring seed like smoke ─────────────
  const fx = 680, fy = 690;
  out.push(`<path d="M${fx},${fy + 70} L${fx},${fy + 36}" stroke="${INK}" stroke-width="3"/><path d="M${fx},${fy + 70} L${fx},${fy + 36}" stroke="#7a9a4a" stroke-width="1.6"/>`);
  for (const s of [-1, 1]) out.push(`<path d="M${fx},${fy + 38} C${fx + s * 30},${fy + 20} ${fx + s * 30},${fy - 40} ${fx + s * 8},${fy - 64} C${fx + s * 16},${fy - 30} ${fx + s * 14},${fy + 10} ${fx},${fy + 38} Z" fill="#b8a46a" stroke="${INK}" stroke-width="1.3"/>`);
  const dust = [];
  for (let k = 0; k < 160; k++) { const u = rand(), x = fx + 10 + u * 110 + (rand() - 0.5) * 30 * u, y = fy - 40 - u * 60 + (rand() - 0.5) * 50 * u; dust.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(0.6 + rand() * 0.6)}" fill="#8a7a54" fill-opacity="${r1(0.9 - u * 0.6)}"/>`); }
  out.push(dust.join(""));
  contact(out, fx, fy + 72, 50, 5, 0.18);

  return { size: SIZE, view: [0, 250, SIZE, 540], defs: defs.join("\n"), body: out.join("\n") };
}
