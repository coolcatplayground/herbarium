// NO. 0251 — a bulb, kept, and the seed kept with it.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the bulb. Pale green, round at the foot and drawn up to a
//      point that curves over at the top — an onion's shape, the neck
//      turning as a young bulb's does. Fine lines run its length where the
//      scale leaves lie one inside another.
//   2. Out of the top of it, two slender shoots, rising and parting,
//      their tips glaucous blue — the bloom of wax that makes an onion's
//      leaves blue at the ends. (Set lower, from the sides, they read as
//      arms.)
//   3. It sits on its basal plate, the small flat stem every bulb has at its
//      foot. No roots, no wings, no face.
//   4. The field note files it with seed banks — germplasm kept against
//      time — and its clearest story is Vavilov's institute in Leningrad,
//      whose staff guarded tonnes of seed and tubers through the siege and
//      would not eat them. Fig. 2 is what such a collection is made of: one
//      accession, a sealed glass vial of seed with its tag.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade } from "./parts.mjs";
import { standardDefs, contact, paintSolid, profileOutline } from "./kit.mjs";

export const slug = "celebi";
export const no = 251;
const SIZE = 800;
const MINT = { light: "#f1f9e4", base: "#cbe7ad", deep: "#96c07c", shade: "#5e8a4c", edge: "#5e8a4c" };
const SHOOT = { light: "#cfe8b8", base: "#8cc47a", deep: "#5a9658", shade: "#2e5c34", edge: "#2e5c34" };
const BLUE = "#5e9ed4";

export function draw() {
  const rand = mulberry32(251);
  const defs = standardDefs(251);
  const out = [];
  contact(out, 330, 758, 170, 16);

  // the two shoots behind the neck, curving out, blue at the tips
  const B = makeOrgan({
    x: 330, base: 744, H: 320, R: 118, tilt: 0.2, bendFrom: 0.5, bendMax: 0.75,
    knots: [[0, 0.46], [0.08, 0.84], [0.24, 1], [0.44, 0.9], [0.62, 0.6], [0.78, 0.32], [0.9, 0.14], [1, 0]],
  });
  for (const [side, th] of [[-1, -0.5], [1, 0.5]]) {
    const [x0, y0] = B.surface(th, 0.8);
    const pts = [[x0, y0 + 16], [x0 + side * 14, y0 - 40], [x0 + side * 36, y0 - 90], [x0 + side * 66, y0 - 128]];
    const b = blade(pts, { width: (u) => 9 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.6), 0.8) + 0.6, rand });
    // a gradient along the shoot: green, then the waxy blue at the end
    const [ex, ey] = pts.at(-1);
    defs.push(`<linearGradient id="sh${side}" gradientUnits="userSpaceOnUse" x1="${r1(x0)}" y1="${r1(y0)}" x2="${r1(ex)}" y2="${r1(ey)}"><stop offset="0.55" stop-color="${SHOOT.base}"/><stop offset="0.85" stop-color="${BLUE}"/></linearGradient>`);
    out.push(`<path d="${b.d}" fill="url(#sh${side})" stroke="${INK}" stroke-width="1.4" filter="url(#pen)"/>`);
  }

  // the bulb
  const d = paintSolid(B, { id: "b", outline: profileOutline(B), palette: MINT, defs, out, hatch: 3, tHatch: [0.1, 0.5] });
  // the lines of the scale leaves, running up it
  for (const th of [-1.1, -0.6, -0.15, 0.3, 0.75, 1.15]) {
    const pts = [];
    for (let j = 0; j <= 14; j++) pts.push(B.surface(th, 0.04 + (j / 14) * 0.9, 1.004));
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${MINT.shade}" stroke-width="1" stroke-opacity="0.35" clip-path="url(#bc)"/>`);
  }
  // the basal plate at its foot
  out.push(`<ellipse cx="332" cy="746" rx="46" ry="9" fill="#b8a27a" stroke="${INK}" stroke-width="1.4"/>`);
  void d;

  // ── fig. 2: one accession — a vial of seed, sealed, tagged ────────────────
  const fx = 680, fy = 766;
  const vial = `M${fx - 26},${fy - 150} L${fx - 26},${fy - 20} C${fx - 26},${fy + 2} ${fx + 26},${fy + 2} ${fx + 26},${fy - 20} L${fx + 26},${fy - 150} Z`;
  defs.push(`<clipPath id="vc"><path d="${vial}"/></clipPath>`);
  out.push(`<path d="${vial}" fill="#eef4f2" fill-opacity="0.6"/>`);
  const seeds = [];
  for (let k = 0; k < 46; k++) {
    const x = fx - 22 + rand() * 44, y = fy - 8 - rand() * 86;
    seeds.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="5" ry="3.2" transform="rotate(${r1(rand() * 180)} ${r1(x)} ${r1(y)})" fill="${rand() < 0.5 ? "#b8903e" : "#94702a"}" stroke="${INK}" stroke-width="0.5"/>`);
  }
  out.push(`<g clip-path="url(#vc)">${seeds.join("")}</g>`);
  out.push(`<path d="M${fx - 18},${fy - 140} L${fx - 18},${fy - 30}" stroke="#ffffff" stroke-width="4" stroke-opacity="0.6"/>`);
  out.push(`<path d="${vial}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  out.push(`<rect x="${fx - 24}" y="${fy - 170}" width="48" height="22" rx="3" fill="#6a6a66" stroke="${INK}" stroke-width="1.4"/>`);
  // the tag, on its string
  out.push(`<path d="M${fx + 20},${fy - 158} C${fx + 44},${fy - 150} ${fx + 50},${fy - 120} ${fx + 58},${fy - 104}" fill="none" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx + 44},${fy - 104} L${fx + 84},${fy - 104} L${fx + 90},${fy - 90} L${fx + 84},${fy - 76} L${fx + 44},${fy - 76} Z" fill="#f4ecd4" stroke="${INK}" stroke-width="1.2" transform="rotate(12 ${fx + 58} ${fy - 104})"/>`);
  out.push(`<circle cx="${fx + 58}" cy="${fy - 98}" r="2.4" fill="none" stroke="${INK}" stroke-width="1" transform="rotate(12 ${fx + 58} ${fy - 104})"/>`);
  contact(out, fx, fy + 2, 50, 5, 0.2);

  return { size: SIZE, view: [0, 250, SIZE, 540], defs: defs.join("\n"), body: out.join("\n") };
}
