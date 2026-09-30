// NO. 0755 — a cluster of glowing caps, and a plant that glows.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the cluster. Three small mushrooms from one base — slender
//      pale stalks, bell-shaped caps, lilac shading to pink at the crowns
//      with a paler band at the rim — and all of them giving off a soft
//      green-white glow, the foxfire of luminous fungi. The pastel caps the
//      specimen wears.
//   2. The field note's record is that caps eaten off regrow overnight —
//      mushrooms appear that fast because nearly all the growth happened out
//      of sight, in the mycelium, before.
//   3. The note's point is that the fungal light pathway has been moved into
//      a plant. Every luminous fungus runs the same chemistry — one compound,
//      made from a precursor the fungus already has, oxidised to give green
//      light — and in 2020 its four genes were put into tobacco, which glows
//      for its whole life, brightest in its young leaves and flowers.
//      Fig. 2: that plant in the dark.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "morelull";
export const no = 755;
const SIZE = 800;

function shroom(out, id, defs, x, g, h, w, lean) {
  const tx = x + lean, ty = g - h;
  out.push(`<path d="M${x - 9},${g} C${x - 8},${g - h * 0.4} ${tx - 6},${ty + h * 0.3} ${tx - 5},${ty + 10} L${tx + 5},${ty + 10} C${tx + 6},${ty + h * 0.3} ${x + 8},${g - h * 0.4} ${x + 9},${g} Z" fill="#f4f0e2" stroke="${INK}" stroke-width="1.4"/>`);
  defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4b8d0"/><stop offset="0.6" stop-color="#c0a8dc"/><stop offset="1" stop-color="#9a86c4"/></linearGradient>`);
  const cap = `M${tx - w},${ty + 14} C${tx - w},${ty - w * 0.9} ${tx + w},${ty - w * 0.9} ${tx + w},${ty + 14} C${tx + w * 0.5},${ty + 6} ${tx - w * 0.5},${ty + 6} ${tx - w},${ty + 14} Z`;
  out.push(`<path d="${cap}" fill="url(#${id})" stroke="${INK}" stroke-width="1.7" filter="url(#pen)"/>`);
  out.push(`<path d="M${tx - w + 4},${ty + 8} C${tx - w * 0.5},${ty} ${tx + w * 0.5},${ty} ${tx + w - 4},${ty + 8}" fill="none" stroke="#f2ecf8" stroke-width="5" stroke-opacity="0.8"/>`);
}

export function draw() {
  const rand = mulberry32(755);
  const defs = standardDefs(755);
  const out = [];
  contact(out, 320, 758, 170, 14);
  // the glow behind the cluster
  defs.push(`<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#e8fcd0" stop-opacity="0.9"/><stop offset="1" stop-color="#e8fcd0" stop-opacity="0"/></radialGradient>`);
  out.push(`<ellipse cx="320" cy="560" rx="220" ry="200" fill="url(#glow)"/>`);
  // the base they share
  out.push(`<path d="M270,760 C276,736 364,736 370,760 Z" fill="#e8e0cc" stroke="${INK}" stroke-width="1.4"/>`);
  shroom(out, "c1", defs, 286, 752, 220, 70, -60);
  shroom(out, "c2", defs, 350, 752, 180, 60, 60);
  shroom(out, "c3", defs, 318, 752, 290, 84, 0);
  // specks of light drifting off the caps
  for (let k = 0; k < 18; k++) out.push(`<circle cx="${r1(200 + rand() * 240)}" cy="${r1(380 + rand() * 200)}" r="${r1(1.4 + rand() * 1.4)}" fill="#e8fcb0"/>`);

  // ── fig. 2: the glowing tobacco, in the dark ──────────────────────────────
  const fx = 690, g = 766;
  out.push(`<rect x="${fx - 90}" y="${g - 190}" width="180" height="190" rx="4" fill="#1e2a26" stroke="${INK}" stroke-width="1.4"/>`);
  defs.push(`<radialGradient id="tg" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#d8ffb0"/><stop offset="1" stop-color="#6ab84a"/></radialGradient>`);
  out.push(`<path d="M${fx},${g - 4} L${fx},${g - 150}" stroke="#8ad86a" stroke-width="3"/>`);
  for (const [dy, s, L] of [[-40, -1, 60], [-70, 1, 56], [-100, -1, 44], [-126, 1, 36]]) out.push(`<ellipse cx="${fx + s * L * 0.5}" cy="${g + dy}" rx="${L * 0.55}" ry="${L * 0.24}" transform="rotate(${s * -18} ${fx + s * L * 0.5} ${g + dy})" fill="url(#tg)"/>`);
  for (const dx of [-8, 8]) out.push(`<circle cx="${fx + dx}" cy="${g - 160}" r="6" fill="#f4ffd8"/><circle cx="${fx + dx}" cy="${g - 160}" r="2.4" fill="#b8e88a"/>`);
  contact(out, fx, g + 2, 100, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
