// NO. 0781 — a mass of drift wrack, and a stem that stretches.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the wrack. Long seaweed washed up on the tideline — dark
//      teal-green ribbon fronds, wavy, with small air bladders along them —
//      heaped in a loose mound over a scrap of old driftwood, a few ends
//      hanging down over its edge. The field note is plain that the green
//      seaweed is the body.
//   2. The note's record is a soul of seaweed adrift in the waves.
//   3. The note's point is that holding on at sea is a matter of give, not
//      grip. A kelp stipe stretches — many pull out to a third again their
//      length and spring back — so the plant goes slack in a surge instead of
//      resisting, and the peak force never builds. Wood would snap. Fig. 2: a
//      stipe at rest, and the same stipe stretched a third longer, with a
//      spring beside it.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "dhelmise";
export const no = 781;
const SIZE = 800;
const WEED = ["#2e6a64", "#3a7e74", "#24564e", "#4a8e82"];

export function draw() {
  const rand = mulberry32(781);
  const defs = standardDefs(781);
  const out = [];
  contact(out, 320, 758, 240, 16);

  const mainFrom = out.length;
  // the driftwood it has caught round
  out.push(`<path d="M110,730 C200,710 380,702 540,716 L544,738 C380,730 200,736 112,750 Z" fill="#a89478" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (const d of ["M150,732 C240,718 360,714 500,722", "M160,742 C260,730 380,726 520,732"]) out.push(`<path d="${d}" fill="none" stroke="#7a6a54" stroke-width="1.2"/>`);

  // the heap: long wavy ribbons lying across one another in a loose mound
  // over the wood, lowest first, a few ends hanging down over its front.
  // (Hung from a knot, the fronds read as tentacles; radiating from a
  // central holdfast, as legs. A heap has no centre.)
  const ribbon = (pts, w, k) => {
    const n = pts.length - 1;
    const edge = (sg) => pts.map(([x, y], j) => [x, y + sg * w * (0.75 + 0.25 * Math.sin(j * 1.7 + k)) * (1 - 0.3 * Math.abs(j / n - 0.5))]);
    const d = smooth(edge(-1)) + " " + smooth([...edge(1)].reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
    out.push(`<path d="${d}" fill="${WEED[k % 4]}" stroke="${INK}" stroke-width="1.1"/>`);
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="#1a3e38" stroke-width="1" stroke-opacity="0.55"/>`);
  };
  const cx = 320, base = 716, Wd = 220, H = 110;
  for (let k = 0; k < 16; k++) {
    const lvl = (k + 1) / 16;
    const x0 = cx - Wd * (0.5 + rand() * 0.5), x1 = cx + Wd * (0.5 + rand() * 0.5);
    const pts = [];
    for (let j = 0; j <= 18; j++) {
      const x = x0 + (x1 - x0) * (j / 18);
      const dome = Math.max(0, 1 - ((x - cx) / Wd) ** 2);
      pts.push([x, base - H * dome * lvl + Math.sin(j * 1.1 + k * 2.3) * 9]);
    }
    ribbon(pts, 11 + rand() * 4, k);
  }
  // ends hanging over the front edge of the wood
  for (const [x, k] of [[220, 1], [300, 2], [390, 3], [450, 0]]) {
    const pts = [];
    for (let j = 0; j <= 8; j++) pts.push([x + Math.sin(j * 1.3 + k) * 8 + j * 3, 700 + j * 7]);
    ribbon(pts, 9, k);
  }
  // air bladders, small and swollen, here and there along the fronds
  for (let k = 0; k < 12; k++) {
    const x = cx - Wd * 0.8 + rand() * Wd * 1.6, dome = Math.max(0, 1 - ((x - cx) / Wd) ** 2);
    const y = base - H * dome * (0.3 + rand() * 0.7);
    out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="7" ry="5" fill="#6a9e8a" stroke="${INK}" stroke-width="0.9"/><ellipse cx="${r1(x - 2)}" cy="${r1(y - 2)}" rx="2.4" ry="1.4" fill="#d8f0e4" fill-opacity="0.8"/>`);
  }
  out.push(`<g transform="translate(320 756) scale(1.15) translate(-320 -756)">${out.splice(mainFrom).join("")}</g>`);

  // ── fig. 2: a stipe at rest, and stretched, with a spring ─────────────────
  const stipe = (x, len) => {
    out.push(`<path d="M${x},766 L${x},${766 - len}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x},766 L${x},${766 - len}" stroke="#4a8e82" stroke-width="9" stroke-linecap="round"/>`);
    for (let k = 1; k < 6; k++) out.push(`<path d="M${x - 5},${766 - (len * k) / 6} l10,0" stroke="#2e5a52" stroke-width="1"/>`);
  };
  stipe(620, 120);
  stipe(690, 160);
  const coil = [];
  for (let k = 0; k <= 40; k++) coil.push([760 + Math.sin(k * 0.8) * 10, 766 - k * 4]);
  out.push(`<path d="${smooth(coil)}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 500, SIZE, 290], defs: defs.join("\n"), body: out.join("\n") };
}
