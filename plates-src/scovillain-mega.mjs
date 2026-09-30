// NO. 0952 (Mega) — the hotter chilli, and a burn aimed at the wrong teeth.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the pair of chillies of NO. 0952, turned hotter. The red
//      one is now a wrinkled, blistered pod with a long hooked tail — the
//      shape of the hottest cultivars, the tail like a flame drawn out — beside
//      a smaller green one, both hanging from a dark stem among near-black
//      leaves, as some ornamental peppers grow, with the small white star
//      flowers of a chilli where the Mega form carries its white horns.
//   2. The record: one head turns the spicy chemicals to fire, the other is
//      driven vicious by them.
//   3. The note's point is that capsaicin is aimed. It binds a heat receptor
//      mammals carry and birds effectively do not, so it burns the animals
//      whose molars would grind the seeds and spares the ones that swallow
//      them whole and carry them off. Fig. 2: two seeds — one crushed, which
//      is the fate the heat prevents, and one passed whole and sprouting.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "scovillain-mega";
export const no = 952;
const SIZE = 800;
const DARK = { light: "#6a6a5a", base: "#3a3e32", deep: "#24281e", shade: "#12140e", edge: "#0e100a" };
const GREEN = { light: "#a8d88a", base: "#4e9a4a", deep: "#2e6a34", shade: "#1e4a24", edge: "#1e4a24" };

export function draw() {
  const rand = mulberry32(9520);
  const defs = standardDefs(9520);
  const out = [];
  contact(out, 300, 758, 200, 14);

  // the dark stem, forked
  const st = "M300,758 C298,690 300,620 296,560 M298,600 C260,580 230,560 214,530 M298,588 C340,570 372,548 390,520";
  out.push(`<path d="${st}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${st}" fill="none" stroke="#3a3e32" stroke-width="5.4" stroke-linecap="round"/>`);
  // near-black leaves
  for (const [pts, id] of [
    [[[296, 562], [270, 520], [262, 478]], "a"], [[[296, 562], [318, 516], [340, 486]], "b"], [[[298, 640], [250, 628], [210, 640]], "c"],
    [[[298, 660], [346, 650], [388, 664]], "d"], [[[214, 530], [184, 500], [170, 468]], "e"], [[[390, 520], [420, 490], [446, 478]], "f"],
  ]) {
    const b = blade(pts, { width: (u) => 22 * Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9) + 0.6, sideVeins: 4, rand });
    paintBlade(b, { id, palette: DARK, defs, out, margin: 2, veinOpacity: 0.25 });
  }
  // white star flowers
  for (const [x, y] of [[262, 470], [342, 478], [176, 460]]) {
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k / 5) * Math.PI * 2; out.push(`<ellipse cx="${r1(x + Math.cos(a) * 9)}" cy="${r1(y + Math.sin(a) * 9)}" rx="8" ry="4.4" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(x + Math.cos(a) * 9)} ${r1(y + Math.sin(a) * 9)})" fill="#fbfaf2" stroke="${INK}" stroke-width="0.9"/>`); }
    out.push(`<circle cx="${x}" cy="${y}" r="3.4" fill="#d8c84a" stroke="${INK}" stroke-width="0.7"/>`);
  }
  // the red pod: wrinkled, blistered, with a long hooked tail
  defs.push(`<linearGradient id="rd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f06a4a"/><stop offset="0.45" stop-color="#d8281e"/><stop offset="1" stop-color="#8a1410"/></linearGradient>`);
  const red = "M214,536 C170,540 150,580 156,620 C160,660 150,690 170,712 C186,730 196,700 210,690 C218,712 204,744 186,752 C212,756 236,720 236,680 C246,640 250,580 214,536 Z";
  out.push(`<path d="${red}" fill="url(#rd)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  for (const d of ["M176,580 C190,600 184,630 196,650", "M200,566 C214,590 206,620 222,644", "M168,640 C180,660 176,680 190,690"]) out.push(`<path d="${d}" fill="none" stroke="#7a1410" stroke-width="1.6" stroke-opacity="0.6"/>`);
  out.push(`<path d="M178,574 C172,600 172,630 176,656" fill="none" stroke="#fbd0c0" stroke-width="4" stroke-opacity="0.5" stroke-linecap="round"/>`);
  out.push(`<path d="M196,540 C206,524 222,524 232,540 C222,536 206,536 196,540 Z" fill="#2e5a2e" stroke="${INK}" stroke-width="1.2"/>`);
  // the green pod, smaller and smooth
  defs.push(`<linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ac86a"/><stop offset="0.5" stop-color="#3e8a3a"/><stop offset="1" stop-color="#1e5a24"/></linearGradient>`);
  const grn = "M392,526 C420,530 428,570 420,610 C414,640 404,670 392,690 C384,666 370,640 368,606 C364,566 372,528 392,526 Z";
  out.push(`<path d="${grn}" fill="url(#gr)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<path d="M382,548 C378,580 378,610 384,640" fill="none" stroke="#d8f0c0" stroke-width="3.4" stroke-opacity="0.5" stroke-linecap="round"/>`);
  out.push(`<path d="M376,530 C384,516 400,516 408,530 C400,526 384,526 376,530 Z" fill="#2e5a2e" stroke="${INK}" stroke-width="1.2"/>`);

  // ── fig. 2: a crushed seed, and a seed passed whole and sprouting ─────────
  out.push(`<path d="M592,760 l10,-8 l6,10 z M606,748 l12,-4 l-2,12 z M616,762 l10,-10 l4,10 z" fill="#f2e2a8" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<path d="M598,720 l30,24 M628,720 l-30,24" stroke="#b8342a" stroke-width="2.4" stroke-linecap="round"/>`);
  out.push(`<ellipse cx="720" cy="756" rx="16" ry="11" fill="#f2e2a8" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="M722,746 C722,720 716,700 724,680" fill="none" stroke="${INK}" stroke-width="3"/><path d="M722,746 C722,720 716,700 724,680" fill="none" stroke="#8ab85a" stroke-width="1.6"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[724, 680], [724 + s * 12, 668], [724 + s * 26, 666]], { width: (u) => 8 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 0.4, rand });
    paintBlade(b, { id: `cot${s}`, palette: GREEN, defs, out, margin: 1, ink: 1 });
  }
  contact(out, 670, 768, 90, 5, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
