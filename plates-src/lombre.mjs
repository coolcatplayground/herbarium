// NO. 0271 — a leaf held up out of the water.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the leaf. Not floating now but held up above the water on
//      its own stalk, as the leaves of a lotus are — flat-topped, broad, and
//      its rim no longer turned up but hanging down all round, heavy and
//      ragged at the hem where the edge has torn and folded. The underside
//      shows beneath the hanging rim, darker, ribbed.
//   2. Below it, the water it has risen out of, the stalk going down into it.
//   3. The field note's point is that plants at the waterline build two kinds
//      of leaf and choose between them as the level moves: submerged, thin
//      and finely divided, taking gas straight from the water; above the
//      surface, flat, waxed and stiff enough to hold itself up. Fig. 2 is the
//      plant that does both on one stem, water crowfoot — threads below the
//      line, lobed floating leaves on it, and a white flower just above.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "lombre";
export const no = 271;
const SIZE = 800;
const PAD = { light: "#9fd68e", base: "#62a856", deep: "#3f7c3e", shade: "#24522a", edge: "#24522a" };
const WATER = { light: "#e4f0ee", base: "#c6dedd", deep: "#9fc2c4" };

export function draw() {
  const rand = mulberry32(271);
  const defs = standardDefs(271);
  const out = [];
  const cx = 330, top = 486, RX = 200, RY = 60, HANG = 70;

  // the water, and the stalk going down into it
  defs.push(`<radialGradient id="wt" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${WATER.base}"/><stop offset="0.8" stop-color="${WATER.light}"/><stop offset="1" stop-color="${WATER.light}" stop-opacity="0"/></radialGradient>`);
  out.push(`<ellipse cx="${cx}" cy="742" rx="280" ry="44" fill="url(#wt)"/>`);
  for (const [rx, ry, op] of [[70, 12, 0.6], [120, 20, 0.4], [180, 30, 0.25]]) out.push(`<ellipse cx="${cx + 6}" cy="742" rx="${rx}" ry="${ry}" fill="none" stroke="${WATER.deep}" stroke-width="1.2" stroke-opacity="${op}"/>`);
  const stalk = `M${cx + 6},744 C${cx - 6},660 ${cx + 10},590 ${cx},${top + 10}`;
  out.push(`<path d="${stalk}" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="${stalk}" fill="none" stroke="#86b262" stroke-width="11" stroke-linecap="round"/><path d="${stalk}" fill="none" stroke="#c2dca0" stroke-width="3" transform="translate(-3 0)"/>`);

  // the hanging rim: from the edge of the flat top down to a ragged hem,
  // round the front half; its underside darker, ribbed
  const N = 18;
  const rimTop = [], hem = [];
  for (let j = 0; j <= N; j++) {
    const a = (j / N) * Math.PI;
    const x = cx + Math.cos(a) * RX, y = top + Math.sin(a) * RY;
    rimTop.push([x, y]);
    // the hem hangs lower at the front, and is torn into rounded tongues
    const drop = HANG * (0.55 + 0.45 * Math.sin(a)) * (j % 2 ? 0.6 + rand() * 0.12 : 1 - rand() * 0.14);
    hem.push([cx + Math.cos(a) * (RX + 8), y + drop]);
  }
  const rim = smooth(rimTop) + " " + smooth(hem.reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
  defs.push(`<linearGradient id="rimg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAD.base}"/><stop offset="1" stop-color="${PAD.shade}"/></linearGradient>`);
  defs.push(`<clipPath id="rimc"><path d="${rim}"/></clipPath>`);
  out.push(`<path d="${rim}" fill="url(#rimg)"/><path d="${rim}" fill="${PAD.deep}" fill-opacity="0.4" filter="url(#wc)"/>`);
  const ribs = [];
  for (let k = 1; k < 22; k++) {
    const a = (k / 22) * Math.PI;
    const x = cx + Math.cos(a) * RX, y = top + Math.sin(a) * RY;
    ribs.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(a) * 6)},${r1(HANG * (0.5 + 0.45 * Math.sin(a)))}`);
  }
  out.push(`<path d="${ribs.join(" ")}" fill="none" stroke="${PAD.light}" stroke-width="1.4" stroke-opacity="0.4" clip-path="url(#rimc)"/>`);
  out.push(`<path d="${rim}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" filter="url(#pen)"/>`);

  // the flat top
  const face = `M${cx - RX},${top} A${RX},${RY} 0 1,1 ${cx + RX},${top} A${RX},${RY} 0 1,1 ${cx - RX},${top} Z`;
  defs.push(`<radialGradient id="fg" gradientUnits="userSpaceOnUse" cx="${cx - 50}" cy="${top - 20}" r="${RX * 1.1}" gradientTransform="translate(0 ${r1((top - 20) * 0.7)}) scale(1 0.3)"><stop offset="0" stop-color="${PAD.light}"/><stop offset="0.75" stop-color="${PAD.base}"/><stop offset="1" stop-color="${PAD.deep}"/></radialGradient>`);
  defs.push(`<clipPath id="fc"><path d="${face}"/></clipPath>`);
  out.push(`<path d="${face}" fill="${PAD.base}"/><path d="${face}" fill="url(#fg)" filter="url(#wc)"/>`);
  const veins = [];
  for (let k = 0; k < 18; k++) {
    const a = (k / 18) * Math.PI * 2;
    veins.push(`M${cx},${top} L${r1(cx + Math.cos(a) * RX)},${r1(top + Math.sin(a) * RY)}`);
  }
  out.push(`<path d="${veins.join(" ")}" stroke="${PAD.shade}" stroke-width="1" stroke-opacity="0.3" clip-path="url(#fc)"/>`);
  out.push(`<circle cx="${cx}" cy="${top}" r="6" fill="${PAD.deep}"/>`);
  out.push(`<path d="${face}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);

  // ── fig. 2: water crowfoot — one stem, two kinds of leaf ──────────────────
  const fx = 684, wl = 640, bed = 764;
  out.push(`<rect x="${fx - 96}" y="${wl}" width="192" height="${bed - wl}" fill="${WATER.base}" fill-opacity="0.6" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<path d="M${fx - 96},${wl} L${fx + 96},${wl}" stroke="${WATER.deep}" stroke-width="2"/>`);
  const st = `M${fx - 20},${bed} C${fx - 30},${bed - 50} ${fx + 10},${wl + 50} ${fx},${wl - 18}`;
  out.push(`<path d="${st}" fill="none" stroke="${INK}" stroke-width="4"/><path d="${st}" fill="none" stroke="#86b262" stroke-width="2.4"/>`);
  // below the line: leaves cut into threads
  for (const [x, y, dir] of [[fx - 22, bed - 34, -1], [fx - 12, bed - 74, 1], [fx - 4, wl + 36, -1]]) {
    const th = [];
    for (let k = 0; k < 9; k++) {
      const a = (dir < 0 ? Math.PI : 0) + (k / 8 - 0.5) * 1.6 * dir;
      th.push(`M${x},${y} q${r1(Math.cos(a) * 14)},${r1(Math.sin(a) * 14 - 6)} ${r1(Math.cos(a) * 30)},${r1(Math.sin(a) * 26)}`);
    }
    out.push(`<path d="${th.join(" ")}" fill="none" stroke="#3f7c3e" stroke-width="1.2"/>`);
  }
  // on the line: two lobed floating leaves
  for (const [x, rx] of [[fx - 44, 24], [fx + 40, 22]]) {
    out.push(`<path d="M${x - rx},${wl} q${r1(rx * 0.3)},-9 ${r1(rx * 0.66)},-2 q${r1(rx * 0.34)},-9 ${r1(rx * 0.68)},0 q${r1(rx * 0.34)},-9 ${r1(rx * 0.66)},2 q${r1(-rx * 0.3)},9 ${r1(-rx)},6 q${r1(-rx * 0.7)},1 ${r1(-rx)},-6 Z" fill="${PAD.base}" stroke="${INK}" stroke-width="1.2"/>`);
  }
  // and just above it, a white flower
  const [fwx, fwy] = [fx, wl - 22];
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
    out.push(`<ellipse cx="${r1(fwx + Math.cos(a) * 8)}" cy="${r1(fwy + Math.sin(a) * 5)}" rx="7" ry="5" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(fwx + Math.cos(a) * 8)} ${r1(fwy + Math.sin(a) * 5)})" fill="#fbfaf2" stroke="${INK}" stroke-width="0.9"/>`);
  }
  out.push(`<circle cx="${fwx}" cy="${fwy}" r="3.4" fill="#f2cf3e" stroke="${INK}" stroke-width="0.7"/>`);
  contact(out, fx, bed + 4, 104, 6, 0.2);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
