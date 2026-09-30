// NO. 0100 (Hisui) — a hard round pod, and a trap that counts to two.
//
// What the morphology says, and what each observation became:
//
//   1. The part: an Apricorn-like pod. A hard, round, woody fruit — the kind
//      that keeps its seed inside a shell nothing can bite, as the monkey-pot
//      and Brazil-nut trees do — its upper half a glossy rust-orange, its lower
//      half pale bare wood, the line between them a raised ridge, and set in
//      its crown the round woody lid it will open by. The field note's record
//      says this form took on the look of an Apricorn: the orange-and-wood
//      sphere is that.
//   2. The note files it with electrically signalling plants.
//   3. The note's point is that plants make real electrical signals, and a
//      Venus flytrap uses them to count. Touching a trigger hair fires one; a
//      single signal is ignored, but a second within about twenty seconds
//      shuts the trap — a memory with a timer, which is what stops it closing
//      on a raindrop. Fig. 2: two touches, the timer between them, and the
//      trap shutting on the second.
import { mulberry32, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "voltorb-hisui";
export const no = 100;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(100);
  const defs = standardDefs(100);
  const out = [];
  contact(out, 320, 758, 190, 16);

  const cx = 320, cy = 590, R = 166;
  defs.push(`<clipPath id="ball"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>`);
  defs.push(`<radialGradient id="or" cx="0.38" cy="0.26" r="0.85"><stop offset="0" stop-color="#fbb070"/><stop offset="0.5" stop-color="#e0702e"/><stop offset="1" stop-color="#9a3a14"/></radialGradient>`);
  defs.push(`<radialGradient id="wd" cx="0.38" cy="0.3" r="0.85"><stop offset="0" stop-color="#f4e2c0"/><stop offset="0.6" stop-color="#d8b88a"/><stop offset="1" stop-color="#9a7a4e"/></radialGradient>`);
  out.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#wd)"/>`);
  // the grain of the bare wood half
  const gr = [];
  for (let k = 0; k < 12; k++) gr.push(`M${cx - R},${cy + 20 + k * 14} C${cx - R * 0.4},${cy + 26 + k * 14 + (rand() - 0.5) * 8} ${cx + R * 0.4},${cy + 16 + k * 14} ${cx + R},${cy + 22 + k * 14}`);
  out.push(`<path d="${gr.join(" ")}" fill="none" stroke="#a88a5e" stroke-width="1.2" clip-path="url(#ball)"/>`);
  // the orange upper half, and the raised ridge between
  out.push(`<path d="M${cx - R},${cy + 6} C${cx - R * 0.6},${cy + 30} ${cx + R * 0.6},${cy + 30} ${cx + R},${cy + 6} L${cx + R},${cy - R} L${cx - R},${cy - R} Z" fill="url(#or)" clip-path="url(#ball)"/>`);
  out.push(`<path d="M${cx - R + 2},${cy + 6} C${cx - R * 0.6},${cy + 30} ${cx + R * 0.6},${cy + 30} ${cx + R - 2},${cy + 6}" fill="none" stroke="${INK}" stroke-width="9" clip-path="url(#ball)"/><path d="M${cx - R + 2},${cy + 6} C${cx - R * 0.6},${cy + 30} ${cx + R * 0.6},${cy + 30} ${cx + R - 2},${cy + 6}" fill="none" stroke="#c89a5e" stroke-width="6" clip-path="url(#ball)"/>`);
  out.push(`<ellipse cx="${cx - 60}" cy="${cy - 90}" rx="44" ry="24" transform="rotate(-30 ${cx - 60} ${cy - 90})" fill="#ffffff" fill-opacity="0.45" filter="url(#sheen)"/>`);
  out.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  // the lid set in its crown
  out.push(`<ellipse cx="${cx + 20}" cy="${cy - R + 14}" rx="30" ry="10" fill="#b8744a" stroke="${INK}" stroke-width="1.5"/><circle cx="${cx + 20}" cy="${cy - R + 12}" r="4" fill="#6e3a1e"/>`);

  // ── fig. 2: two touches, a timer, the trap shutting on the second ─────────
  const trap = (x, shut) => {
    const y = 730;
    if (shut) out.push(`<path d="M${x - 32},${y} C${x - 20},${y - 30} ${x + 20},${y - 30} ${x + 32},${y} C${x + 20},${y - 8} ${x - 20},${y - 8} ${x - 32},${y} Z" fill="#8ac86a" stroke="${INK}" stroke-width="1.3"/>`);
    else out.push(`<path d="M${x},${y} L${x - 36},${y - 30} C${x - 30},${y - 4} ${x - 10},${y + 2} ${x},${y} L${x + 36},${y - 30} C${x + 30},${y - 4} ${x + 10},${y + 2} ${x},${y} Z" fill="#c83e4a" stroke="${INK}" stroke-width="1.3"/>`);
    out.push(`<path d="M${x},${y} L${x},766" stroke="#6ea456" stroke-width="4"/>`);
  };
  trap(624, false);
  trap(744, true);
  // the touches, and the clock between
  out.push(`<path d="M612,690 l6,14" stroke="#e8843a" stroke-width="2.4" stroke-linecap="round"/><path d="M732,684 l6,14" stroke="#e8843a" stroke-width="2.4" stroke-linecap="round"/>`);
  out.push(`<circle cx="684" cy="670" r="16" fill="#fbfaf2" stroke="${INK}" stroke-width="1.3"/><path d="M684,670 l0,-11 M684,670 l7,4" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M650,680 L664,676 M704,676 L718,680" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3"/>`);
  contact(out, 684, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
