// NO. 0949 — a bracket on rotting wood, and the only thing that breaks lignin.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the bracket. A shelf fungus grown out from a log — broad,
//      flat, fan-shaped, its top near-black with a glossy rim banded in
//      yellow, its underside a pale cream sheet of pores — and the wood under
//      it bleached white and stringy where the fungus has taken it apart.
//      The black cap and the yellow band the specimen wears. (Drawn with
//      anything hanging from it, it would read as tentacles; a bracket has
//      none.)
//   2. The field note's record is hunting, and predatory fungi are real.
//   3. The note's point is that only one group of organisms takes wood apart
//      completely, and it does not use a key. Lignin has no regular repeating
//      bond for an enzyme to fit, so white-rot fungi make free radicals
//      outside their cells and let them tear it at random — and the wood is
//      left white, soft and stringy. Fig. 2: a block of wood, half sound and
//      brown, half white-rotted, the zone line between.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "toedscruel";
export const no = 949;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(949);
  const defs = standardDefs(949);
  const out = [];
  contact(out, 320, 758, 250, 16);

  // the log, lying, its near end cut, part of it bleached and stringy
  const log = `M80,760 L80,640 C200,630 440,630 560,640 L560,760 Z`;
  defs.push(`<linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a4a"/><stop offset="1" stop-color="#4e3a28"/></linearGradient>`);
  defs.push(`<clipPath id="lc"><path d="${log}"/></clipPath>`);
  out.push(`<path d="${log}" fill="url(#lg)"/>`);
  out.push(`<path d="M220,760 C240,700 300,660 400,650 L560,650 L560,760 Z" fill="#ece4d0" clip-path="url(#lc)"/>`);
  const str = [];
  for (let k = 0; k < 20; k++) { const y = 660 + k * 5; str.push(`M${250 + k * 3},${y} C${340},${y - 4} ${440},${y + 4} 560,${y}`); }
  out.push(`<path d="${str.join(" ")}" fill="none" stroke="#c8bca0" stroke-width="1.2" clip-path="url(#lc)"/>`);
  out.push(`<path d="M220,760 C240,700 300,660 400,650" fill="none" stroke="#2a1e14" stroke-width="2.4"/>`);
  out.push(`<path d="${log}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="80" cy="700" rx="16" ry="60" fill="#c8a882" stroke="${INK}" stroke-width="1.5"/>`);

  // the brackets: shelves grown out from the log's side, in a tier
  const shelf = (x, y, w, id) => {
    const d = `M${x - w},${y} C${x - w},${y - w * 0.36} ${x + w},${y - w * 0.36} ${x + w},${y} C${x + w * 0.6},${y + w * 0.12} ${x - w * 0.6},${y + w * 0.12} ${x - w},${y} Z`;
    out.push(`<path d="M${x - w + 6},${y + 2} C${x - w * 0.6},${y + w * 0.2} ${x + w * 0.6},${y + w * 0.2} ${x + w - 6},${y + 2} Z" fill="#f2e8cc" stroke="${INK}" stroke-width="1.2"/>`);
    defs.push(`<radialGradient id="${id}" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#5a5048"/><stop offset="0.6" stop-color="#1e1a18"/><stop offset="1" stop-color="#0e0c0a"/></radialGradient>`);
    out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
    // growth bands, and the yellow rim
    for (let k = 1; k <= 3; k++) { const f = 1 - k * 0.22; out.push(`<path d="M${r1(x - w * f)},${r1(y - 4)} C${r1(x - w * f)},${r1(y - w * 0.36 * f)} ${r1(x + w * f)},${r1(y - w * 0.36 * f)} ${r1(x + w * f)},${r1(y - 4)}" fill="none" stroke="#4a403a" stroke-width="1.2"/>`); }
    out.push(`<path d="M${x - w + 4},${y - 2} C${x - w + 4},${y - w * 0.32} ${x + w - 4},${y - w * 0.32} ${x + w - 4},${y - 2}" fill="none" stroke="#e8d44a" stroke-width="7" stroke-opacity="0.9"/>`);
  };
  shelf(300, 620, 150, "s1");
  shelf(440, 600, 90, "s2");
  shelf(200, 606, 80, "s3");
  void rand;

  // ── fig. 2: a block, half sound and half white-rotted ─────────────────────
  const fx = 690;
  out.push(`<rect x="${fx - 80}" y="660" width="160" height="104" fill="#8a6a4a" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="M${fx},660 C${fx - 16},690 ${fx + 16},730 ${fx},764 L${fx + 80},764 L${fx + 80},660 Z" fill="#ece4d0"/>`);
  for (let k = 0; k < 7; k++) out.push(`<path d="M${fx - 76},${670 + k * 14} L${fx - 6},${670 + k * 14}" stroke="#6e5438" stroke-width="1"/><path d="M${fx + 6},${670 + k * 14} q20,-3 40,0 q20,3 30,0" fill="none" stroke="#c8bca0" stroke-width="1.2"/>`);
  out.push(`<path d="M${fx},660 C${fx - 16},690 ${fx + 16},730 ${fx},764" fill="none" stroke="#1e140e" stroke-width="3"/>`);
  out.push(`<rect x="${fx - 80}" y="660" width="160" height="104" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  contact(out, fx, 768, 90, 5, 0.18);

  return { size: SIZE, view: [0, 490, SIZE, 300], defs: defs.join("\n"), body: out.join("\n") };
}
