// NO. 0754 — an orchid in pink, and one that builds a decoy on a hinge.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the orchid. A flower on an arching spike — two broad petals
//      held out to the sides like blades, deep pink striped with paler pink
//      lengthwise; a hooded upper sepal; a frilled lip below, paler, marked
//      at its throat — and a second bud on the spike. Pink and striped, the
//      colours the specimen keeps.
//   2. The field note's record is how much upkeep the colour takes.
//   3. The note's point is that sexual deception can include a machine. The
//      hammer orchid of Western Australia grows a dark glossy decoy on a
//      hinge, shaped and scented like the flightless female of one wasp, held
//      at the height she would wait at. The male grabs it and tries to fly
//      off with her, the hinge swings him into the column, and he leaves with
//      pollen on his back. Fig. 2: a hammer orchid, its decoy on its hinged
//      arm.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "lurantis";
export const no = 754;
const SIZE = 800;
const PINK = { light: "#fde0e6", base: "#ec8aa0", deep: "#c8506e" };

export function draw() {
  const rand = mulberry32(754);
  const defs = standardDefs(754);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the spike, arching over
  const sp = `M300,760 C296,660 300,560 330,470`;
  out.push(`<path d="${sp}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${sp}" fill="none" stroke="#6a8a4a" stroke-width="5" stroke-linecap="round"/>`);
  // a second bud lower on the spike
  out.push(`<ellipse cx="318" cy="590" rx="16" ry="26" transform="rotate(30 318 590)" fill="${PINK.base}" stroke="${INK}" stroke-width="1.4"/>`);
  // the flower
  const cx = 336, cy = 450;
  defs.push(`<linearGradient id="pt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PINK.deep}"/><stop offset="0.5" stop-color="${PINK.base}"/><stop offset="1" stop-color="${PINK.deep}"/></linearGradient>`);
  // the two petals held out like blades, striped lengthwise
  for (const s of [-1, 1]) {
    const tip = [cx + s * 190, cy + 40];
    const d = `M${cx},${cy} C${cx + s * 40},${cy - 50} ${tip[0] - s * 40},${tip[1] - 70} ${tip[0]},${tip[1]} C${tip[0] - s * 30},${tip[1] + 30} ${cx + s * 50},${cy + 50} ${cx},${cy + 10} Z`;
    out.push(`<path d="${d}" fill="url(#pt)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
    for (const f of [-0.5, -0.15, 0.2, 0.55]) out.push(`<path d="M${cx + s * 10},${cy + f * 20} Q${cx + s * 100},${cy - 20 + f * 60} ${tip[0] - s * 10},${tip[1] + f * 14}" fill="none" stroke="${PINK.light}" stroke-width="3" stroke-opacity="0.8"/>`);
  }
  // the hooded upper sepal
  out.push(`<path d="M${cx - 30},${cy - 10} C${cx - 40},${cy - 90} ${cx + 40},${cy - 90} ${cx + 30},${cy - 10} Q${cx},${cy - 24} ${cx - 30},${cy - 10} Z" fill="${PINK.base}" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M${cx},${cy - 76} L${cx},${cy - 20}" stroke="${PINK.deep}" stroke-width="1.4"/>`);
  // the frilled lip below, paler, its throat marked
  const lip = [];
  for (let k = 0; k <= 16; k++) {
    const a = Math.PI * (k / 16);
    const r = 56 + (k % 2 ? 6 : 0);
    lip.push(`${k ? "L" : "M"}${r1(cx - Math.cos(a) * r)},${r1(cy + 20 + Math.sin(a) * r * 0.9)}`);
  }
  out.push(`<path d="${lip.join(" ")} Z" fill="${PINK.light}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`);
  for (const dx of [-14, 0, 14]) out.push(`<path d="M${cx + dx * 0.5},${cy + 24} L${cx + dx},${cy + 56}" stroke="${PINK.deep}" stroke-width="2.4" stroke-linecap="round"/>`);
  void rand;

  // ── fig. 2: a hammer orchid, its decoy on a hinged arm ────────────────────
  const fx = 650, g = 766;
  const figFrom = out.length;
  out.push(`<path d="M${fx},${g} L${fx},${g - 150}" stroke="${INK}" stroke-width="3"/><path d="M${fx},${g} L${fx},${g - 150}" stroke="#8a8a4a" stroke-width="1.6"/>`);
  // the column, and the hinged arm with the dark glossy decoy on it
  out.push(`<path d="M${fx},${g - 150} C${fx + 10},${g - 170} ${fx + 20},${g - 180} ${fx + 18},${g - 196}" fill="none" stroke="#6e8a4a" stroke-width="3.4" stroke-linecap="round"/>`);
  out.push(`<circle cx="${fx}" cy="${g - 150}" r="4" fill="#e8e0a0" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx},${g - 150} L${fx + 50},${g - 160}" stroke="#6e8a4a" stroke-width="3" stroke-linecap="round"/>`);
  out.push(`<ellipse cx="${fx + 64}" cy="${g - 162}" rx="18" ry="8" fill="#3a2230" stroke="${INK}" stroke-width="1.1"/><ellipse cx="${fx + 58}" cy="${g - 165}" rx="6" ry="2.4" fill="#ffffff" fill-opacity="0.5"/>`);
  for (let k = 0; k < 5; k++) out.push(`<circle cx="${fx + 52 + k * 6}" cy="${g - 158}" r="1.6" fill="#8a5a6a"/>`);
  // the thin sepals hanging down
  for (const [dx, a] of [[-4, 2.2], [4, 0.9], [-2, 1.9], [2, 1.2]]) out.push(`<path d="M${fx + dx},${g - 150} l${r1(Math.cos(a) * 40)},${r1(Math.sin(a) * 40)}" stroke="#9a9a5a" stroke-width="2" stroke-linecap="round"/>`);
  out.push(`<path d="M${fx + 30},${g - 186} a22,22 0 0,1 22,14" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3"/>`);
  out.push(`<g transform="translate(${fx + 20} ${g}) scale(1.5) translate(${-(fx + 20)} ${-g})">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, fx + 20, g + 2, 110, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
