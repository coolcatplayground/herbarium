// NO. 0270 — a floating leaf, and the air it pumps.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the pad. A water lily's floating leaf, round, broad, its
//      rim turned up a little all the way round like a shallow dish, and cut
//      by the one narrow slit every lily pad has, running from the edge to
//      where the stalk joins underneath.
//   2. Its face is two greens: a paler ground and darker wedges set round
//      it, points inward, between the main veins that run out from the
//      centre — the star the plate is recognised by.
//   3. It floats: a patch of still water round it, a few rings.
//   4. The field note's point is that a floating leaf is a snorkel, and in
//      some lilies a pump. Young leaves draw air in and hold it slightly
//      above atmospheric pressure — driven by warmth, not muscle — and the
//      pressure pushes a steady flow down the stalk, through the rhizome in
//      the airless mud, and out again through the older leaves. Fig. 2 is
//      that circuit: two pads, their stalks, the rhizome, and the way the
//      air goes.
import { mulberry32, r1, smooth, mix, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "lotad";
export const no = 270;
const SIZE = 800;
const PAD = { light: "#8fcf86", base: "#5aa860", deep: "#36804a", shade: "#1f5a34", rim: "#7cbf74" };
const WATER = { light: "#e4f0ee", base: "#c6dedd", deep: "#9fc2c4" };

// a point on an ellipse lying flat, angle a measured round from the viewer
const flat = (cx, cy, rx, ry, a) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];

export function draw() {
  const rand = mulberry32(270);
  const defs = standardDefs(270);
  const out = [];
  const cx = 320, cy = 648, RX = 240, RY = 112, LIFT = 34;

  // the water it floats on
  defs.push(`<radialGradient id="wt" cx="${cx}" cy="${cy + 20}" r="330" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 ${r1((cy + 20) * 0.7)}) scale(1 0.3)"><stop offset="0" stop-color="${WATER.base}"/><stop offset="0.8" stop-color="${WATER.light}"/><stop offset="1" stop-color="${WATER.light}" stop-opacity="0"/></radialGradient>`);
  out.push(`<ellipse cx="${cx}" cy="${cy + 26}" rx="340" ry="130" fill="url(#wt)"/>`);
  for (const [rx, ry, op] of [[272, 124, 0.5], [306, 134, 0.3]]) out.push(`<ellipse cx="${cx}" cy="${cy + 22}" rx="${rx}" ry="${ry}" fill="none" stroke="${WATER.deep}" stroke-width="1.2" stroke-opacity="${op}"/>`);

  // the slit: from the edge, front right, in to the middle
  const SLIT = 0.62, W = 0.07;
  const inRing = (a) => a > SLIT - W && a < SLIT + W;
  // the upturned rim, seen round the front: water line below, rim top above
  const front = [], top = [];
  for (let j = 0; j <= 48; j++) {
    const a = (j / 48) * Math.PI;
    front.push(flat(cx, cy + LIFT * 0.4, RX + 4, RY + 2, a));
    top.push(flat(cx, cy - LIFT * 0.6, RX, RY, a));
  }
  const band = smooth(top) + " " + smooth([...front].reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
  out.push(`<path d="${band}" fill="${PAD.shade}"/><path d="${band}" fill="${PAD.deep}" fill-opacity="0.6" filter="url(#wc2)"/>`);
  // the face of the pad, with the slit cut into it
  const face = [];
  for (let j = 0; j <= 96; j++) {
    const a = SLIT + W + (j / 96) * (Math.PI * 2 - 2 * W);
    face.push(flat(cx, cy - LIFT * 0.6, RX, RY, a));
  }
  const fd = smooth([[cx + 6, cy - LIFT * 0.6 + 2], ...face], true);
  defs.push(`<clipPath id="face"><path d="${fd}"/></clipPath>`);
  defs.push(`<radialGradient id="fg" gradientUnits="userSpaceOnUse" cx="${cx - 60}" cy="${cy - 40}" r="${RX * 1.2}" gradientTransform="translate(0 ${r1((cy - 40) * 0.66)}) scale(1 0.34)"><stop offset="0" stop-color="${PAD.light}"/><stop offset="0.7" stop-color="${PAD.base}"/><stop offset="1" stop-color="${PAD.deep}"/></radialGradient>`);
  out.push(`<path d="${fd}" fill="${PAD.base}"/><path d="${fd}" fill="url(#fg)" filter="url(#wc)"/>`);
  // the darker wedges between the veins, points inward
  const wedges = [];
  for (let k = 0; k < 7; k++) {
    const a = SLIT + 0.45 + (k / 7) * (Math.PI * 2 - 0.9);
    const [x0, y0] = flat(cx, cy - LIFT * 0.6, RX * 0.3, RY * 0.3, a);
    const [x1, y1] = flat(cx, cy - LIFT * 0.6, RX * 0.94, RY * 0.94, a - 0.2);
    const [x2, y2] = flat(cx, cy - LIFT * 0.6, RX * 0.94, RY * 0.94, a + 0.2);
    wedges.push(`M${r1(x0)},${r1(y0)} L${r1(x1)},${r1(y1)} Q${r1(flat(cx, cy - LIFT * 0.6, RX * 0.97, RY * 0.97, a)[0])},${r1(flat(cx, cy - LIFT * 0.6, RX * 0.97, RY * 0.97, a)[1])} ${r1(x2)},${r1(y2)} Z`);
  }
  out.push(`<path d="${wedges.join(" ")}" fill="${PAD.shade}" fill-opacity="0.55" clip-path="url(#face)" filter="url(#wc2)"/>`);
  // the veins running out from the centre
  const veins = [];
  for (let k = 0; k < 22; k++) {
    const a = SLIT + W + 0.05 + (k / 21) * (Math.PI * 2 - 2 * W - 0.1);
    const [x1, y1] = flat(cx, cy - LIFT * 0.6, RX * 0.96, RY * 0.96, a);
    const [xm, ym] = flat(cx, cy - LIFT * 0.6, RX * 0.5, RY * 0.5, a + 0.03);
    veins.push(`M${cx + 4},${r1(cy - LIFT * 0.6)} Q${r1(xm)},${r1(ym)} ${r1(x1)},${r1(y1)}`);
  }
  out.push(`<path d="${veins.join(" ")}" fill="none" stroke="${PAD.shade}" stroke-width="1" stroke-opacity="0.35" clip-path="url(#face)"/>`);
  // the upturned rim's lip, catching the light
  out.push(`<path d="${smooth(face.filter((_, j) => j > 2 && j < 94))}" fill="none" stroke="${PAD.rim}" stroke-width="5" stroke-opacity="0.7" clip-path="url(#face)"/>`);
  out.push(`<g filter="url(#pen)"><path d="${fd}" fill="none" stroke="${INK}" stroke-width="2"/><path d="${band}" fill="none" stroke="${INK}" stroke-width="1.8"/></g>`);
  void rand; void inRing; void mix;

  // ── fig. 2: the air's way round ───────────────────────────────────────────
  const fx = 684, wy = 610, my = 712, bot = 770;
  out.push(`<rect x="${fx - 104}" y="${wy}" width="208" height="${my - wy}" fill="${WATER.base}" fill-opacity="0.7" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<rect x="${fx - 104}" y="${my}" width="208" height="${bot - my}" fill="#b89a74" fill-opacity="0.7" stroke="${INK}" stroke-width="1.1"/>`);
  // the rhizome in the mud, and two stalks up to two pads
  out.push(`<path d="M${fx - 80},${my + 30} C${fx - 30},${my + 22} ${fx + 30},${my + 36} ${fx + 80},${my + 28}" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M${fx - 80},${my + 30} C${fx - 30},${my + 22} ${fx + 30},${my + 36} ${fx + 80},${my + 28}" fill="none" stroke="#8a6a44" stroke-width="12" stroke-linecap="round"/>`);
  for (const px of [fx - 52, fx + 52]) {
    const d = `M${px},${my + 26} C${px - 10},${my - 30} ${px + 12},${wy + 40} ${px},${wy + 2}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="5.4"/><path d="${d}" fill="none" stroke="#9ab86a" stroke-width="3.4"/>`);
    out.push(`<ellipse cx="${px}" cy="${wy}" rx="40" ry="9" fill="${px < fx ? PAD.light : PAD.deep}" stroke="${INK}" stroke-width="1.4"/>`);
  }
  // the flow: in at the young leaf, down, along, up, out at the old
  const arrow = (d, [hx, hy], a) => {
    out.push(`<path d="${d}" fill="none" stroke="#b8402e" stroke-width="1.8" stroke-dasharray="5 4"/>`);
    out.push(`<path d="M${r1(hx - Math.cos(a - 0.5) * 8)},${r1(hy - Math.sin(a - 0.5) * 8)} L${hx},${hy} L${r1(hx - Math.cos(a + 0.5) * 8)},${r1(hy - Math.sin(a + 0.5) * 8)}" fill="none" stroke="#b8402e" stroke-width="1.8"/>`);
  };
  arrow(`M${fx - 52},${wy - 40} L${fx - 52},${wy - 12}`, [fx - 52, wy - 12], Math.PI / 2);
  arrow(`M${fx - 64},${wy + 20} C${fx - 70},${my - 20} ${fx - 60},${my + 6} ${fx - 40},${my + 8}`, [fx - 40, my + 8], 0.1);
  arrow(`M${fx - 20},${my + 10} L${fx + 30},${my + 12}`, [fx + 30, my + 12], 0);
  arrow(`M${fx + 64},${my + 4} C${fx + 70},${my - 30} ${fx + 64},${wy + 30} ${fx + 66},${wy + 16}`, [fx + 66, wy + 16], -Math.PI / 2);
  arrow(`M${fx + 52},${wy - 12} L${fx + 52},${wy - 40}`, [fx + 52, wy - 40], -Math.PI / 2);
  contact(out, fx, bot + 2, 110, 6, 0.2);

  return { size: SIZE, view: [0, 494, SIZE, 298], defs: defs.join("\n"), body: out.join("\n") };
}
