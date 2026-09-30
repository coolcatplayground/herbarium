// NO. 0842 — a russet apple, and the bears that bred the first sweet ones.
//
// What the morphology says, and what each observation became:
//
//   1. The part: an old sweet apple, large and squat, golden-green with a red
//      flush low on one side — and over its shoulders a russet: the rough
//      brown netting some heirloom apples grow on their skin, laid across the
//      top like the lattice on a pie. A short stalk, two small leaves. The
//      latticed golden top over the green the specimen is.
//   2. The field note's record is a nectarous scent and skin sweet enough
//      that children once ate it.
//   3. The note's point is that the apple was being selected for size and
//      sugar before anyone was doing the selecting. Its wild ancestor still
//      grows in the Tian Shan, the fruit running from crab-sour to sweet, and
//      bears eat the largest and sweetest and carry the seed off in them.
//      Fig. 2: a sour little crabapple and a big sweet wild apple, side by
//      side, and a bear's print by the sweet one.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "appletun";
export const no = 842;
const SIZE = 800;
const LEAF = { light: "#e2f4c0", base: "#a8d078", deep: "#6e9a4a", shade: "#3e6028", edge: "#3e6028" };

export function draw() {
  const rand = mulberry32(842);
  const defs = standardDefs(842);
  const out = [];
  contact(out, 320, 758, 240, 16);

  const cx = 320, cy = 620, R = 180;
  const d = `M${cx},${cy - R * 0.62} C${cx + R * 0.4},${cy - R * 0.82} ${cx + R * 1.08},${cy - R * 0.7} ${cx + R},${cy} C${cx + R * 0.96},${cy + R * 0.62} ${cx + R * 0.5},${cy + R * 0.76} ${cx},${cy + R * 0.74} C${cx - R * 0.5},${cy + R * 0.76} ${cx - R * 0.96},${cy + R * 0.62} ${cx - R},${cy} C${cx - R * 1.08},${cy - R * 0.7} ${cx - R * 0.4},${cy - R * 0.82} ${cx},${cy - R * 0.62} Z`;
  defs.push(`<radialGradient id="ap" cx="0.4" cy="0.3" r="0.85"><stop offset="0" stop-color="#f4f0a0"/><stop offset="0.5" stop-color="#c8d06a"/><stop offset="0.85" stop-color="#8aa84a"/><stop offset="1" stop-color="#5e7a34"/></radialGradient>`);
  defs.push(`<clipPath id="apc"><path d="${d}"/></clipPath>`);
  out.push(`<path d="${d}" fill="url(#ap)"/>`);
  // the red flush low on one side
  out.push(`<ellipse cx="${cx + 90}" cy="${cy + 60}" rx="110" ry="70" fill="#c83a3a" fill-opacity="0.45" clip-path="url(#apc)" filter="url(#wc2)"/>`);
  // the russet: a netted golden-brown lattice over its shoulders
  const lat = [];
  for (let k = -4; k <= 4; k++) {
    lat.push(`M${cx + k * 36 - 60},${cy - R * 0.9} Q${cx + k * 36},${cy - 40} ${cx + k * 36 + 40},${cy + 10}`);
    lat.push(`M${cx + k * 36 + 60},${cy - R * 0.9} Q${cx + k * 36},${cy - 40} ${cx + k * 36 - 40},${cy + 10}`);
  }
  defs.push(`<linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8884a" stop-opacity="1"/><stop offset="0.7" stop-color="#c89a5a" stop-opacity="0.8"/><stop offset="1" stop-color="#c89a5a" stop-opacity="0"/></linearGradient>`);
  out.push(`<g clip-path="url(#apc)"><path d="${lat.join(" ")}" fill="none" stroke="#6e4a24" stroke-width="18" stroke-opacity="0.5"/><path d="${lat.join(" ")}" fill="none" stroke="#d8a868" stroke-width="12" stroke-opacity="0.9"/></g>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  // stalk and two small leaves
  out.push(`<ellipse cx="${cx}" cy="${cy - R * 0.6}" rx="26" ry="8" fill="#6e4a24" fill-opacity="0.6"/>`);
  out.push(`<path d="M${cx},${cy - R * 0.6} l6,-30" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${cx},${cy - R * 0.6} l6,-30" stroke="#7a5a3a" stroke-width="4" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[cx + 6, cy - R * 0.6 - 28], [cx + 6 + s * 30, cy - R * 0.6 - 56], [cx + 6 + s * 44, cy - R * 0.6 - 96]], { width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.62), sideVeins: 3, rand });
    paintBlade(b, { id: `l${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 3 });
  }

  // ── fig. 2: a crabapple, a sweet wild apple, and a bear's print ───────────
  out.push(`<circle cx="612" cy="746" r="16" fill="#b8c43a" stroke="${INK}" stroke-width="1.2"/><path d="M612,730 l2,-10" stroke="${INK}" stroke-width="2"/>`);
  defs.push(`<radialGradient id="wa" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#f8e080"/><stop offset="0.6" stop-color="#e0703a"/><stop offset="1" stop-color="#a83a24"/></radialGradient>`);
  out.push(`<circle cx="690" cy="722" r="42" fill="url(#wa)" stroke="${INK}" stroke-width="1.5"/><path d="M690,680 l3,-12" stroke="${INK}" stroke-width="2.4"/>`);
  // the print: a pad and five toes
  out.push(`<ellipse cx="764" cy="754" rx="16" ry="10" fill="#6e5438" fill-opacity="0.7"/>`);
  for (let k = 0; k < 5; k++) out.push(`<ellipse cx="${748 + k * 8}" cy="${738 - Math.sin((k / 4) * Math.PI) * 4}" rx="3.4" ry="4.4" fill="#6e5438" fill-opacity="0.7"/>`);
  void r1;
  contact(out, 690, 766, 110, 5, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
