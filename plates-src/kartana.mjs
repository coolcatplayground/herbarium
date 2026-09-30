// NO. 0798 — a folded paper-thin leaf, and a hair that is a hypodermic.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the blade. A long, flat, paper-thin leaf, white-green and
//      stiff, folded lengthwise into sharp creases like origami, its edge
//      honed — a sedge's cutting leaf — rising from a short sheath banded red
//      and gold at its foot. The folded white blade with its red and gold
//      the specimen is.
//   2. The field note's record is a body as thin as paper, honed to an edge.
//   3. The note's point is that the finest edge in a plant is a needle, not a
//      blade. A nettle's sting is one cell drawn out into a hollow spike of
//      silica with a bulb at its base, its tip made pre-broken — scored so
//      that the lightest touch snaps it off at an angle, leaving a bevelled
//      point exactly like a hypodermic's. Fig. 2: one stinging hair, the bulb,
//      the shaft, and its tip snapped away.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "kartana";
export const no = 798;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(798);
  const defs = standardDefs(798);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the blade: a long flat leaf folded lengthwise into facets, each face lit
  // differently, rising and curving over to a fine point
  const spine = [[320, 700], [330, 600], [360, 490], [420, 390], [510, 320]];
  const W = [34, 30, 24, 16, 2];
  const faces = [[], []];
  for (let k = 0; k < spine.length; k++) {
    const [x, y] = spine[k];
    const [nx, ny] = k < spine.length - 1 ? spine[k + 1] : [x + 40, y - 20];
    const a = Math.atan2(ny - y, nx - x), px = -Math.sin(a), py = Math.cos(a);
    faces[0].push([x + px * W[k], y + py * W[k]]);
    faces[1].push([x - px * W[k], y - py * W[k]]);
  }
  const face = (edge, fill) => `<path d="M${spine.map(([x, y]) => `${x},${y}`).join(" L")} L${[...edge].reverse().map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} Z" fill="${fill}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  out.push(face(faces[0], "#f4f6ee"));
  out.push(face(faces[1], "#d8e0d0"));
  // the crease lines across it, where it has been folded
  for (let k = 1; k < spine.length - 1; k++) out.push(`<path d="M${r1(faces[0][k][0])},${r1(faces[0][k][1])} L${spine[k][0]},${spine[k][1]} L${r1(faces[1][k][0])},${r1(faces[1][k][1])}" fill="none" stroke="#a8b0a0" stroke-width="1.2"/>`);
  // a second, shorter blade folded the other way behind
  const sp2 = [[316, 700], [290, 620], [240, 560], [170, 530]];
  const f2 = sp2.map(([x, y], k) => [x + 6, y - 22 + k * 5]);
  out.push(`<path d="M${sp2.map(([x, y]) => `${x},${y}`).join(" L")} L${[...f2].reverse().map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} Z" fill="#e8ece0" stroke="${INK}" stroke-width="1.4"/>`);
  // the sheath at its foot, banded red and gold
  out.push(`<path d="M298,760 L304,690 L338,690 L344,760 Z" fill="#e8e4d8" stroke="${INK}" stroke-width="1.5"/>`);
  for (const [y, c] of [[704, "#d8402e"], [720, "#e8b83a"], [736, "#d8402e"]]) out.push(`<path d="M303,${y} L341,${y}" stroke="${c}" stroke-width="7"/>`);
  out.push(`<path d="M298,760 L304,690 L338,690 L344,760 Z" fill="none" stroke="${INK}" stroke-width="1.5"/>`);
  void rand;

  // ── fig. 2: one nettle hair, its tip snapped away ─────────────────────────
  const fx = 690, g = 766;
  out.push(`<path d="M${fx - 70},${g} L${fx + 70},${g}" stroke="#6ea456" stroke-width="10"/>`);
  out.push(`<path d="M${fx - 22},${g - 4} C${fx - 30},${g - 40} ${fx - 10},${g - 60} ${fx - 6},${g - 64} L${fx - 3},${g - 170} L${fx + 3},${g - 170} L${fx + 6},${g - 64} C${fx + 10},${g - 60} ${fx + 30},${g - 40} ${fx + 22},${g - 4} Z" fill="#f4f8fa" fill-opacity="0.85" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<ellipse cx="${fx}" cy="${g - 30}" rx="14" ry="18" fill="#d8e8f0" fill-opacity="0.7"/>`);
  // the bevelled break, and the tip snapped off beside it
  out.push(`<path d="M${fx - 3},${g - 170} L${fx + 3},${g - 178}" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="M${fx + 20},${g - 190} l4,-16 l4,0 l-2,14 Z" fill="#f4f8fa" stroke="${INK}" stroke-width="1"/>`);
  contact(out, fx, g + 2, 80, 5, 0.18);

  return { size: SIZE, view: [0, 280, SIZE, 510], defs: defs.join("\n"), body: out.join("\n") };
}
