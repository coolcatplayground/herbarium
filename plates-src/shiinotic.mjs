// NO. 0756 — a tall glowing parasol, and a submarine lit by foxfire.
//
// What the morphology says, and what each observation became:
//
//   1. The part: one tall mushroom. A slender pale stalk, and on it a broad
//      parasol cap — purple, flecked with pale glowing spots, its rim a frill
//      of pink ruffles, its underside a pale green-yellow of gills — the
//      great purple cap with the frilled edge the specimen wears. It glows
//      softly.
//   2. The field note's record treats the glow as a lure that leaves people
//      unable to find their way home.
//   3. The note's point is the best-documented use anyone has made of a
//      glowing fungus. The Turtle — the one-man submarine built in 1775 to fix
//      charges to warships — had foxfire on its compass and depth gauge,
//      because the hull was sealed wood and a candle would have used the air.
//      Fig. 2: a compass card, its needle and points marked in foxfire.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "shiinotic";
export const no = 756;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(756);
  const defs = standardDefs(756);
  const out = [];
  contact(out, 320, 758, 150, 14);
  defs.push(`<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#eefcd8" stop-opacity="0.85"/><stop offset="1" stop-color="#eefcd8" stop-opacity="0"/></radialGradient>`);
  out.push(`<ellipse cx="320" cy="450" rx="260" ry="160" fill="url(#glow)"/>`);
  // the stalk, slender, with a swollen foot
  out.push(`<path d="M290,760 C286,730 300,700 306,640 L310,470 L330,470 L334,640 C340,700 354,730 350,760 Z" fill="#f4f0e2" stroke="${INK}" stroke-width="1.6"/>`);
  // the gills, pale green-yellow, under the cap
  out.push(`<ellipse cx="320" cy="468" rx="200" ry="32" fill="#e2ecae" stroke="${INK}" stroke-width="1.4"/>`);
  const gl = [];
  for (let k = 0; k < 50; k++) { const a = Math.PI * (k / 49); gl.push(`M${r1(320 - Math.cos(a) * 196)},${r1(468 + Math.sin(a) * 28)} L${r1(320 - Math.cos(a) * 30)},${r1(468 + Math.sin(a) * 6)}`); }
  out.push(`<path d="${gl.join(" ")}" stroke="#b8c47a" stroke-width="0.9"/>`);
  // the frilled pink rim
  const fr = [];
  for (let k = 0; k <= 40; k++) { const a = Math.PI * (k / 40); fr.push([320 - Math.cos(a) * 214, 458 + Math.sin(a) * 18 + (k % 2 ? 10 : 0)]); }
  out.push(`<path d="M${fr.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} L534,440 L106,440 Z" fill="#f4b8c8" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`);
  // the cap: a broad parasol dome, purple
  defs.push(`<radialGradient id="cp" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#c8a8e0"/><stop offset="0.6" stop-color="#8a64b4"/><stop offset="1" stop-color="#5a3e84"/></radialGradient>`);
  const cap = `M112,452 C120,370 220,330 320,330 C420,330 520,370 528,452 C440,432 200,432 112,452 Z`;
  defs.push(`<clipPath id="cc"><path d="${cap}"/></clipPath>`);
  out.push(`<path d="${cap}" fill="url(#cp)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // pale glowing spots scattered on it
  const sp = [];
  for (let k = 0; k < 16; k++) { const x = 150 + rand() * 340, y = 350 + rand() * 80; sp.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(7 + rand() * 7)}" ry="${r1(4 + rand() * 4)}" fill="#e8fcb8"/>`); }
  out.push(`<g clip-path="url(#cc)">${sp.join("")}</g>`);

  // ── fig. 2: a compass card, marked in foxfire ─────────────────────────────
  const fx = 690, fy = 690, R = 70;
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R + 8}" fill="#6e5438" stroke="${INK}" stroke-width="1.6"/><circle cx="${fx}" cy="${fy}" r="${R}" fill="#1e2a26"/>`);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; out.push(`<path d="M${r1(fx + Math.cos(a) * (R - 14))},${r1(fy + Math.sin(a) * (R - 14))} L${r1(fx + Math.cos(a) * (R - 4))},${r1(fy + Math.sin(a) * (R - 4))}" stroke="#d8fcb0" stroke-width="${k % 2 ? 1.4 : 3}"/>`); }
  out.push(`<path d="M${fx},${fy - 50} L${fx + 8},${fy} L${fx},${fy + 50} L${fx - 8},${fy} Z" fill="#d8fcb0"/><circle cx="${fx}" cy="${fy}" r="4" fill="#6e5438"/>`);
  contact(out, fx, fy + R + 12, 70, 5, 0.18);

  return { size: SIZE, view: [0, 290, SIZE, 500], defs: defs.join("\n"), body: out.join("\n") };
}
