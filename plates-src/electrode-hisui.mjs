// NO. 0101 (Hisui) — the pod opened, and a seed that drills itself in.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the pod, opened. The same hard round Apricorn-like fruit as
//      NO. 0100 (Hisui), older now and turned the other way — its upper half
//      the pale wood, its lower half the rust-orange — with its woody lid
//      fallen off beside it, and the seeds packed inside showing through the
//      round hole: wedge-shaped, hard-coated, brown, fitted together like the
//      segments of an orange.
//   2. The field note's record is a body that stores energy and lets it go
//      violently; the note is careful that real pods release by tension, not
//      electricity.
//   3. The note's point is that a seed can move itself with only the weather.
//      Storksbill and wild-oat seeds carry a long awn that coils tight as it
//      dries and unwinds as it takes up moisture; with its bent tip braced
//      against grass, each day's turn of humidity screws the seed a little
//      further into the soil. Fig. 2: a storksbill seed, dry and coiled, and
//      wet and straight, its point in the ground.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "electrode-hisui";
export const no = 101;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(101);
  const defs = standardDefs(101);
  const out = [];
  contact(out, 320, 758, 200, 16);

  const cx = 310, cy = 590, R = 170;
  defs.push(`<clipPath id="ball"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>`);
  defs.push(`<radialGradient id="or" cx="0.4" cy="0.2" r="0.9"><stop offset="0" stop-color="#f8a060"/><stop offset="0.5" stop-color="#d8662a"/><stop offset="1" stop-color="#8a3414"/></radialGradient>`);
  defs.push(`<radialGradient id="wd" cx="0.38" cy="0.3" r="0.85"><stop offset="0" stop-color="#f8ecd0"/><stop offset="0.6" stop-color="#dcc298"/><stop offset="1" stop-color="#a8885a"/></radialGradient>`);
  out.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#or)"/>`);
  out.push(`<path d="M${cx - R},${cy - 10} C${cx - R * 0.6},${cy + 16} ${cx + R * 0.6},${cy + 16} ${cx + R},${cy - 10} L${cx + R},${cy - R} L${cx - R},${cy - R} Z" fill="url(#wd)" clip-path="url(#ball)"/>`);
  const gr = [];
  for (let k = 0; k < 10; k++) gr.push(`M${cx - R},${cy - 150 + k * 14} C${cx - R * 0.4},${cy - 146 + k * 14 + (rand() - 0.5) * 8} ${cx + R * 0.4},${cy - 152 + k * 14} ${cx + R},${cy - 148 + k * 14}`);
  out.push(`<path d="${gr.join(" ")}" fill="none" stroke="#b8986a" stroke-width="1.2" clip-path="url(#ball)"/>`);
  out.push(`<path d="M${cx - R + 2},${cy - 10} C${cx - R * 0.6},${cy + 16} ${cx + R * 0.6},${cy + 16} ${cx + R - 2},${cy - 10}" fill="none" stroke="${INK}" stroke-width="9" clip-path="url(#ball)"/><path d="M${cx - R + 2},${cy - 10} C${cx - R * 0.6},${cy + 16} ${cx + R * 0.6},${cy + 16} ${cx + R - 2},${cy - 10}" fill="none" stroke="#c89a5e" stroke-width="6" clip-path="url(#ball)"/>`);
  // the round hole where the lid came away, and the seeds packed inside
  const hx = cx + 30, hy = cy - R + 40;
  out.push(`<ellipse cx="${hx}" cy="${hy}" rx="60" ry="24" fill="#3a2414" stroke="${INK}" stroke-width="1.6"/>`);
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2;
    out.push(`<path d="M${hx},${hy} L${r1(hx + Math.cos(a) * 52)},${r1(hy + Math.sin(a) * 20)} L${r1(hx + Math.cos(a + 0.8) * 52)},${r1(hy + Math.sin(a + 0.8) * 20)} Z" fill="#8a5a34" stroke="#2a1a0e" stroke-width="1.2"/>`);
  }
  out.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="${cx - 70}" cy="${cy - 80}" rx="40" ry="20" transform="rotate(-30 ${cx - 70} ${cy - 80})" fill="#ffffff" fill-opacity="0.35" filter="url(#sheen)"/>`);
  // the lid, fallen beside it
  out.push(`<ellipse cx="520" cy="750" rx="40" ry="12" fill="#b8744a" stroke="${INK}" stroke-width="1.5"/><ellipse cx="520" cy="746" rx="30" ry="7" fill="#d8a878"/>`);

  // ── fig. 2: a storksbill seed, dry and coiled; wet and straight ───────────
  // dry: the seed on the ground, its awn wound into a tight spiral
  const sd = [];
  for (let k = 0; k <= 60; k++) { const t = k / 60; sd.push([640 + Math.cos(t * Math.PI * 8) * 10, 740 - t * 70 + Math.sin(t * Math.PI * 8) * 3]); }
  out.push(`<ellipse cx="640" cy="752" rx="5" ry="12" transform="rotate(20 640 752)" fill="#8a5a34" stroke="${INK}" stroke-width="1"/><path d="${smooth(sd)}" fill="none" stroke="#b89a6a" stroke-width="2.4"/><path d="M640,670 l24,-10" stroke="#b89a6a" stroke-width="2.4"/>`);
  // wet: straightened, its point driven into the soil
  out.push(`<rect x="700" y="752" width="90" height="16" fill="#b8966a" fill-opacity="0.6"/>`);
  out.push(`<ellipse cx="744" cy="760" rx="5" ry="12" fill="#8a5a34" stroke="${INK}" stroke-width="1"/><path d="M744,748 L744,660 L772,650" fill="none" stroke="#b89a6a" stroke-width="2.4"/>`);
  for (const [x, y] of [[766, 690], [720, 676], [778, 710]]) out.push(`<path d="M${x},${y} q-3,6 0,9 q3,-3 0,-9 Z" fill="#8ab8e0" stroke="${INK}" stroke-width="0.6"/>`);
  contact(out, 700, 770, 100, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
