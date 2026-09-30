// NO. 0948 — wood ear on a fallen branch, and a plant that lives off fungi.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the wood ear. A jelly fungus growing from a fallen branch —
//      soft, rubbery, cup-shaped lobes, translucent pinkish-tan with a paler
//      bloom on their backs and faint veins, clustered along the wood. The
//      field note files it under the genus Woodear: the pale pink cap of the
//      specimen, and the flaps its record says are chewy and delicious.
//   2. That record is culinary, and true: wood ear is eaten across East Asia.
//   3. The note's point is that some plants have stopped photosynthesising
//      and live off fungi. Indian pipe comes up waxy white without a trace of
//      chlorophyll and takes its carbon from a fungus in the soil — which is
//      itself taking it from a nearby tree. The plant pays nothing in. Fig. 2:
//      Indian pipe, a cluster of white nodding stems.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "toedscool";
export const no = 948;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(948);
  const defs = standardDefs(948);
  const out = [];
  contact(out, 320, 758, 240, 16);

  // the fallen branch
  const x0 = 90, y0 = 736, x1 = 560, y1 = 700, r = 28;
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * r, ny = Math.cos(a) * r;
  defs.push(`<linearGradient id="br" gradientUnits="userSpaceOnUse" x1="${r1(x0 + nx)}" y1="${r1(y0 + ny)}" x2="${r1(x0 - nx)}" y2="${r1(y0 - ny)}"><stop offset="0" stop-color="#4a3a2a"/><stop offset="0.5" stop-color="#7a6248"/><stop offset="1" stop-color="#a88a6a"/></linearGradient>`);
  out.push(`<path d="M${r1(x0 + nx)},${r1(y0 + ny)} L${r1(x1 + nx)},${r1(y1 + ny)} L${r1(x1 - nx)},${r1(y1 - ny)} L${r1(x0 - nx)},${r1(y0 - ny)} Z" fill="url(#br)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (const [x, y] of [[x0, y0], [x1, y1]]) out.push(`<ellipse cx="${x}" cy="${y}" rx="10" ry="${r}" transform="rotate(${r1((a * 180) / Math.PI)} ${x} ${y})" fill="#c8a882" stroke="${INK}" stroke-width="1.3"/>`);
  // the lobes: rubbery cups along the top of the branch, back ones first
  defs.push(`<radialGradient id="we" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="#fbe0d8"/><stop offset="0.55" stop-color="#e8a8a0"/><stop offset="1" stop-color="#b87870"/></radialGradient>`);
  const LOBES = [[180, 690, 60, 50, -20], [260, 672, 74, 62, -6], [350, 664, 80, 66, 8], [440, 664, 66, 56, 18], [220, 704, 50, 40, -30], [400, 694, 54, 44, 24]];
  for (const [x, y, w, h, rot] of LOBES) {
    const d = `M${x - w},${y + 10} C${x - w * 1.05},${y - h} ${x + w * 1.05},${y - h} ${x + w},${y + 10} C${x + w * 0.5},${y - 4} ${x - w * 0.5},${y - 4} ${x - w},${y + 10} Z`;
    out.push(`<path d="${d}" transform="rotate(${rot} ${x} ${y})" fill="url(#we)" fill-opacity="0.92" stroke="${INK}" stroke-width="1.6"/>`);
    // the veins radiating from where it joins the wood, and a wavy rim
    const v = [];
    for (let k = 0; k < 6; k++) { const aa = Math.PI + (k / 5) * Math.PI; v.push(`M${x},${y + 4} Q${r1(x + Math.cos(aa) * w * 0.5)},${r1(y + Math.sin(aa) * h * 0.4)} ${r1(x + Math.cos(aa) * w * 0.9)},${r1(y + Math.sin(aa) * h * 0.8)}`); }
    out.push(`<path d="${v.join(" ")}" transform="rotate(${rot} ${x} ${y})" fill="none" stroke="#a8686a" stroke-width="1" stroke-opacity="0.5"/>`);
    out.push(`<path d="M${x - w * 0.9},${y - h * 0.3} C${x - w * 0.4},${y - h * 0.9} ${x + w * 0.4},${y - h * 0.9} ${x + w * 0.9},${y - h * 0.3}" transform="rotate(${rot} ${x} ${y})" fill="none" stroke="#fdf0ec" stroke-width="3" stroke-opacity="0.7"/>`);
  }
  void rand;

  // ── fig. 2: Indian pipe — white nodding stems without chlorophyll ─────────
  for (const [x, h, lean] of [[640, 130, -0.3], [672, 150, 0.1], [704, 120, 0.4], [728, 104, 0.6]]) {
    const tx = x + lean * 30, ty = 766 - h;
    out.push(`<path d="M${x},766 C${x},${766 - h * 0.6} ${tx - 4},${ty + 20} ${tx},${ty}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x},766 C${x},${766 - h * 0.6} ${tx - 4},${ty + 20} ${tx},${ty}" fill="none" stroke="#fbfaf2" stroke-width="6" stroke-linecap="round"/>`);
    for (let k = 1; k < 4; k++) out.push(`<path d="M${x - 5},${766 - k * h * 0.2} l10,-4" stroke="#dcd8cc" stroke-width="2"/>`);
    // the nodding flower, bell-shaped, turned down
    out.push(`<path d="M${tx - 12},${ty} C${tx - 14},${ty + 20} ${tx + 14},${ty + 24} ${tx + 16},${ty + 4} C${tx + 10},${ty - 10} ${tx - 8},${ty - 10} ${tx - 12},${ty} Z" fill="#fbfaf2" stroke="${INK}" stroke-width="1.2" transform="rotate(${r1(60 + lean * 40)} ${tx} ${ty})"/>`);
  }
  contact(out, 686, 768, 90, 5, 0.18);

  return { size: SIZE, view: [0, 520, SIZE, 270], defs: defs.join("\n"), body: out.join("\n") };
}
