// NO. 0387 — a sprout, and the garden its root keeps.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the sprout. A short brown twig with two leaves at its top,
//      opening in a V — the first pair a seedling holds up.
//   2. The second part is what it stands in: a clod of dark topsoil, rounded,
//      crumbling at its edges. The field note files the specimen as a shell
//      of living topsoil, and the soil is the other half of it.
//   3. The field note's point is that the soil round a root is a bought
//      garden. A plant pushes a tenth to a fifth of what it fixes straight
//      back out through its roots as sugars and acids, and what that buys is
//      a population — the microbes gathering in the few millimetres of fed
//      soil are a different community from the soil a finger's width away.
//      Fig. 2: a root tip, the halo of what it leaks, and the microbes
//      crowded into it.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "turtwig";
export const no = 387;
const SIZE = 800;
const LEAF = { light: "#c0e8a0", base: "#62b454", deep: "#3a8440", shade: "#205a26", edge: "#205a26" };
const SOIL = { light: "#8a7058", base: "#5e4838", deep: "#3a2c22" };

export function draw() {
  const rand = mulberry32(387);
  const defs = standardDefs(387);
  const out = [];
  contact(out, 320, 758, 200, 16);

  // the clod of topsoil
  const clod = [];
  for (let j = 0; j <= 40; j++) {
    const a = Math.PI + (j / 40) * Math.PI;
    clod.push([320 + Math.cos(a) * 170 * (1 + 0.04 * Math.sin(j * 1.9)), 752 + Math.sin(a) * 120 * (1 + 0.05 * Math.sin(j * 2.7))]);
  }
  const cd = smooth(clod) + " Z";
  defs.push(`<radialGradient id="sl" cx="0.4" cy="0.25" r="0.8"><stop offset="0" stop-color="${SOIL.light}"/><stop offset="0.6" stop-color="${SOIL.base}"/><stop offset="1" stop-color="${SOIL.deep}"/></radialGradient>`);
  defs.push(`<clipPath id="slc"><path d="${cd}"/></clipPath>`);
  out.push(`<path d="${cd}" fill="url(#sl)"/><path d="${cd}" fill="${SOIL.base}" fill-opacity="0.4" filter="url(#wc)"/>`);
  const crumbs = [];
  for (let k = 0; k < 110; k++) {
    const x = 160 + rand() * 320, y = 636 + rand() * 120;
    crumbs.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(1.4 + rand() * 3.4)}" ry="${r1(1.2 + rand() * 2.4)}" fill="${rand() < 0.35 ? SOIL.light : SOIL.deep}" fill-opacity="${r1(0.4 + rand() * 0.4)}"/>`);
  }
  out.push(`<g clip-path="url(#slc)">${crumbs.join("")}</g>`);
  // crumbs fallen from its edge
  for (const [x, y, r] of [[150, 752, 6], [170, 756, 4], [494, 754, 5], [512, 757, 3]]) out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${SOIL.base}" stroke="${INK}" stroke-width="0.8"/>`);
  out.push(`<path d="${cd}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);

  // the sprout: a short brown twig, and two leaves opening in a V
  const tw = `M318,640 C316,610 322,586 326,560`;
  out.push(`<path d="${tw}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${tw}" fill="none" stroke="#8a6a44" stroke-width="10" stroke-linecap="round"/><path d="${tw}" fill="none" stroke="#b8966a" stroke-width="3" transform="translate(-2 0)"/>`);
  for (const side of [-1, 1]) {
    const pts = [[326, 566], [326 + side * 40, 516], [326 + side * 86, 470], [326 + side * 118, 452]];
    const b = blade(pts, { width: (u) => 40 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.85), 0.62), sideVeins: 6, rand });
    paintBlade(b, { id: `l${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.15 : 0, margin: 6 });
  }

  // ── fig. 2: a root tip in the soil it feeds ───────────────────────────────
  const fx = 690, fy = 650;
  out.push(`<rect x="${fx - 90}" y="${fy - 60}" width="180" height="176" rx="3" fill="#a88a64" fill-opacity="0.5" stroke="${INK}" stroke-width="1.2"/>`);
  // the halo of what the root leaks
  out.push(`<path d="M${fx - 34},${fy - 60} C${fx - 36},${fy + 20} ${fx - 30},${fy + 80} ${fx},${fy + 100} C${fx + 30},${fy + 80} ${fx + 36},${fy + 20} ${fx + 34},${fy - 60} Z" fill="#e8d8a0" fill-opacity="0.55"/>`);
  // the root
  out.push(`<path d="M${fx - 10},${fy - 60} L${fx - 10},${fy + 50} C${fx - 10},${fy + 66} ${fx + 10},${fy + 66} ${fx + 10},${fy + 50} L${fx + 10},${fy - 60} Z" fill="#f2ead2" stroke="${INK}" stroke-width="1.4"/>`);
  for (let k = 0; k < 8; k++) out.push(`<path d="M${fx + (k % 2 ? 10 : -10)},${fy - 50 + k * 10} l${k % 2 ? 12 : -12},${r1(4 + rand() * 6)}" stroke="${INK}" stroke-width="0.7"/>`);
  // microbes: crowded close in, sparse beyond
  const mic = [];
  for (let k = 0; k < 90; k++) {
    const near = k < 70;
    const r = near ? 14 + rand() * 20 : 40 + rand() * 40;
    const s = rand() < 0.5 ? -1 : 1;
    const x = fx + s * r, y = fy - 54 + rand() * 150;
    if (Math.abs(x - fx) > 88 || y > fy + 114) continue;
    const rod = rand() < 0.5;
    mic.push(rod ? `<rect x="${r1(x - 3)}" y="${r1(y - 1.4)}" width="6" height="2.8" rx="1.4" transform="rotate(${r1(rand() * 180)} ${r1(x)} ${r1(y)})" fill="#5e7a3e"/>` : `<circle cx="${r1(x)}" cy="${r1(y)}" r="1.8" fill="#6a4e8a"/>`);
  }
  out.push(mic.join(""));
  contact(out, fx, fy + 118, 100, 6, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
