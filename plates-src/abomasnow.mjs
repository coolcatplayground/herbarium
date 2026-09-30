// NO. 0460 — a mat of spruce at the treeline, pruned by the snow.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a krummholz. At its limit the same spruce stops being a
//      tree: it grows prostrate, dense and flat, a low mat of dark needled
//      shoots pruned level with the depth of the winter snow, because any
//      shoot rising above that line is stripped by wind-driven ice within a
//      season. A thick load of snow sits on it, shaggy along its edge where
//      it hangs into the needles — the white mass the specimen is known by.
//   2. One stem has got above the snow and survived as a flag: bare on the
//      windward side, its branches all streaming away downwind.
//   3. The field note's point is that at the limit what survives is whatever
//      the snow covers. Fig. 2: the same mat, cut through — the snow line
//      over it, the level it is pruned to, and the wind above.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "abomasnow";
export const no = 460;
const SIZE = 800;
const NEEDLE = ["#1e5446", "#2e6a58", "#3c7c68", "#285e50"];
const SNOW = { light: "#ffffff", base: "#eef3f5", shade: "#bccdd6" };

export function draw() {
  const rand = mulberry32(460);
  const defs = standardDefs(460);
  const out = [];
  contact(out, 330, 760, 270, 16);

  // the mat: a low dense mass of needled shoots
  const mat = `M70,760 C80,700 140,650 240,640 C340,630 460,636 560,660 C600,680 606,730 600,760 Z`;
  out.push(`<path d="${mat}" fill="${NEEDLE[0]}" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  const nd = [];
  for (let k = 0; k < 900; k++) {
    const x = 80 + rand() * 515, y = 646 + rand() * 112;
    const a = -Math.PI / 2 + (rand() - 0.5) * 2.6, L = 8 + rand() * 7;
    nd.push(`<path d="M${r1(x)},${r1(y)} l${r1(Math.cos(a) * L)},${r1(Math.sin(a) * L)}" stroke="${NEEDLE[Math.floor(rand() * 4)]}" stroke-width="2.4" stroke-linecap="round"/>`);
  }
  defs.push(`<clipPath id="mc"><path d="${mat}"/></clipPath>`);
  out.push(`<g clip-path="url(#mc)">${nd.join("")}</g>`);

  // the flag stem: bare to windward, its branches streaming to the right
  out.push(`<path d="M200,660 C198,600 204,520 200,430" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M200,660 C198,600 204,520 200,430" stroke="#6e5438" stroke-width="7" stroke-linecap="round"/>`);
  for (const [y, L] of [[450, 60], [480, 90], [512, 110], [546, 120], [580, 104]]) {
    out.push(`<path d="M201,${y} C${201 + L * 0.4},${y - 6} ${201 + L * 0.7},${y + 2} ${201 + L},${y + 10}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M201,${y} C${201 + L * 0.4},${y - 6} ${201 + L * 0.7},${y + 2} ${201 + L},${y + 10}" fill="none" stroke="#6e5438" stroke-width="3" stroke-linecap="round"/>`);
    const n = [];
    for (let k = 0; k < L / 5; k++) {
      const u = k / (L / 5), x = 201 + L * u, yy = y - 4 * Math.sin(Math.PI * u) + u * 10;
      for (const s of [-1, 1]) n.push(`M${r1(x)},${r1(yy)} l${r1(8 + rand() * 4)},${r1(s * (7 + rand() * 4))}`);
    }
    out.push(`<path d="${n.join(" ")}" stroke="${NEEDLE[2]}" stroke-width="2.6" stroke-linecap="round"/>`);
  }

  // the load of snow on the mat, shaggy where it hangs into the needles
  const top = [], hem = [];
  for (let j = 0; j <= 40; j++) {
    const x = 84 + (j / 40) * 506;
    const y = 646 - 30 * Math.sin(Math.PI * (j / 40));
    top.push([x, y - 26]);
    hem.push([x, y + 10 + (j % 3 === 1 ? 18 + rand() * 10 : 4 + rand() * 4)]);
  }
  // the hem in soft rounded lumps where the snow slumps into the needles
  const sd = smooth(top) + " " + smooth([...hem].reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
  defs.push(`<linearGradient id="sn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SNOW.light}"/><stop offset="1" stop-color="${SNOW.shade}"/></linearGradient>`);
  out.push(`<path d="${sd}" fill="url(#sn)" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" filter="url(#pen)"/>`);
  // snow on the flag's limbs too
  for (const [y, L] of [[480, 90], [546, 120]]) out.push(`<path d="M206,${y - 6} C${206 + L * 0.4},${y - 14} ${206 + L * 0.7},${y - 6} ${201 + L},${y + 2} L${201 + L},${y + 6} C${206 + L * 0.6},${y + 2} ${206 + L * 0.3},${y - 2} 206,${y} Z" fill="${SNOW.base}" stroke="${INK}" stroke-width="1"/>`);

  // ── fig. 2: the mat cut through, the snow line, the wind above ────────────
  const fx = 690, g = 764;
  out.push(`<path d="M${fx - 90},${g} C${fx - 84},${g - 40} ${fx + 84},${g - 40} ${fx + 90},${g} Z" fill="${NEEDLE[1]}" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<rect x="${fx - 96}" y="${g - 50}" width="192" height="50" fill="${SNOW.base}" fill-opacity="0.55"/>`);
  out.push(`<path d="M${fx - 96},${g - 50} L${fx + 96},${g - 50}" stroke="#5a8ed4" stroke-width="1.6" stroke-dasharray="6 4"/>`);
  for (const y of [g - 70, g - 90, g - 110]) out.push(`<path d="M${fx - 90},${y} l150,0" stroke="${INK}" stroke-width="1.2" stroke-dasharray="7 4"/><path d="M${fx + 54},${y - 5} l6,5 l-6,5" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  // one shoot poked above the line, stripped
  out.push(`<path d="M${fx + 30},${g - 36} L${fx + 34},${g - 80}" stroke="${INK}" stroke-width="3"/><path d="M${fx + 34},${g - 80} l-6,-6 M${fx + 32},${g - 66} l-7,-3" stroke="${INK}" stroke-width="1.2"/>`);
  contact(out, fx, g + 2, 100, 6, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
