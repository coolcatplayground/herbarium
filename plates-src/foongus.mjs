// NO. 0590 — a painted cap, and seeds painted to look like fruit.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a mushroom. A squat white stalk, broad at the foot, under a
//      round cap coloured in two halves — the crown a glossy red, the lower
//      skirt of the cap white — divided by a dark band round its middle.
//      Bright, blocky, and patterned like something it is not: the note files
//      it as mimicry.
//   2. The field note's record is that it lures with that pattern and
//      nobody knows why it has it.
//   3. The note's point is that some seeds are painted to look like food
//      they are not. The rosary pea and a scatter of unrelated legumes make
//      hard glossy seeds in scarlet and black, patterned like a fleshy fruit
//      with a nutritious aril — and offer nothing at all. Birds take them
//      anyway. Fig. 2: a pod split open, and its scarlet seeds each capped in
//      black.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "foongus";
export const no = 590;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(590);
  const defs = standardDefs(590);
  const out = [];
  contact(out, 320, 758, 200, 16);

  // the stalk: squat, white, broad at the foot
  const stalk = `M250,758 C240,720 262,660 276,600 L364,600 C378,660 400,720 390,758 Z`;
  defs.push(`<linearGradient id="sk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#f0ebdf"/><stop offset="1" stop-color="#c8c0ac"/></linearGradient>`);
  out.push(`<path d="${stalk}" fill="url(#sk)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  // the gills just under the rim
  out.push(`<ellipse cx="320" cy="602" rx="166" ry="26" fill="#e8dcc8" stroke="${INK}" stroke-width="1.4"/>`);
  const gl = [];
  for (let k = 0; k < 40; k++) { const a = Math.PI * (k / 39); gl.push(`M${r1(320 - Math.cos(a) * 160)},${r1(602 + Math.sin(a) * 22)} L${r1(320 - Math.cos(a) * 40)},${r1(602 + Math.sin(a) * 6)}`); }
  out.push(`<path d="${gl.join(" ")}" stroke="#b8a88a" stroke-width="0.9"/>`);
  // the cap: white skirt below, red crown above, a dark band between
  const cap = `M154,600 C150,470 230,390 320,390 C410,390 490,470 486,600 C430,590 210,590 154,600 Z`;
  defs.push(`<clipPath id="cc"><path d="${cap}"/></clipPath>`);
  defs.push(`<linearGradient id="wh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#f0ebe0"/><stop offset="1" stop-color="#c8c0ae"/></linearGradient>`);
  defs.push(`<radialGradient id="rd" cx="0.38" cy="0.3" r="0.8"><stop offset="0" stop-color="#f28a8a"/><stop offset="0.5" stop-color="#d23a42"/><stop offset="1" stop-color="#8e1e28"/></radialGradient>`);
  out.push(`<path d="${cap}" fill="url(#wh)"/>`);
  out.push(`<g clip-path="url(#cc)"><path d="M140,510 C220,490 420,490 500,510 L500,380 L140,380 Z" fill="url(#rd)"/><path d="M140,510 C220,490 420,490 500,510" fill="none" stroke="#3a2e28" stroke-width="16"/></g>`);
  out.push(`<ellipse cx="264" cy="440" rx="34" ry="16" transform="rotate(-24 264 440)" fill="#ffffff" fill-opacity="0.5" filter="url(#sheen)"/>`);
  out.push(`<path d="${cap}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  void rand;

  // ── fig. 2: a rosary-pea pod split open, its seeds scarlet and black ──────
  const fx = 680, fy = 720;
  const figFrom = out.length;
  for (const s of [-1, 1]) {
    out.push(`<path d="M${fx - 80},${fy} C${fx - 60},${fy + s * 30} ${fx + 60},${fy + s * 30} ${fx + 86},${fy - 4} C${fx + 60},${fy + s * 10} ${fx - 60},${fy + s * 10} ${fx - 80},${fy} Z" fill="#c8b48a" stroke="${INK}" stroke-width="1.3" transform="rotate(${s * 8} ${fx} ${fy})"/>`);
  }
  for (let k = 0; k < 5; k++) {
    const x = fx - 54 + k * 28, y = fy + 2;
    out.push(`<ellipse cx="${x}" cy="${y}" rx="11" ry="9" fill="#d8242e" stroke="${INK}" stroke-width="1"/><path d="M${x - 11},${y - 1} A11,9 0 0,1 ${x - 3},${y - 9} L${x - 3},${y + 9} A11,9 0 0,1 ${x - 11},${y - 1} Z" fill="#1e1814"/><ellipse cx="${x + 3}" cy="${y - 3}" rx="3" ry="2" fill="#ffffff" fill-opacity="0.7"/>`);
  }
  out.push(`<g transform="translate(${fx} ${fy + 30}) scale(1.4) translate(${-fx} ${-(fy + 30)})">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, fx, fy + 34, 130, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
