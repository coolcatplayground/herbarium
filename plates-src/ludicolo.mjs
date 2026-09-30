// NO. 0272 — the giant pad, and its bud.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the pad, grown to its largest. The giant water lily of the
//      Amazon, Victoria, floats a leaf a couple of metres across with its
//      rim turned straight up all round, like the brim of a hat worn upside
//      down — green inside, the outside of the rim flushed red-purple and
//      ribbed.
//   2. Its face is quilted: ribs running out from the middle and cross-ribs
//      between them, the structure underneath that lets the leaf carry a
//      child's weight.
//   3. Beside it, out of the water, a flower bud on its stalk, ovoid and
//      covered in prickles, its sepals just parting at the top — the
//      pineapple-like crown the plant is known by.
//   4. The field note's point is a plant that changes its sex by how it is
//      doing. Jack-in-the-pulpit comes up male while its buried corm is
//      small and female once it is large, and can go back again after a
//      costly year. Fig. 2: two of them in a slice of soil — a small corm
//      under a small hooded flower, a large corm under a large one.
import { mulberry32, r1, smooth, mix, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "ludicolo";
export const no = 272;
const SIZE = 800;
const PAD = { light: "#9fd48a", base: "#5ea552", deep: "#3a7a3c", shade: "#22502a" };
const RIM = { light: "#c07a80", base: "#94485a", deep: "#6a2e40" };
const WATER = { light: "#e4f0ee", base: "#c6dedd", deep: "#9fc2c4" };
const BUD = { light: "#b8b070", base: "#7e7a3e", deep: "#555226" };

const flat = (cx, cy, rx, ry, a) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];

export function draw() {
  const rand = mulberry32(272);
  const defs = standardDefs(272);
  const out = [];
  const cx = 300, cy = 690, RX = 250, RY = 92, H = 40;

  // the water
  defs.push(`<radialGradient id="wt" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${WATER.base}"/><stop offset="0.8" stop-color="${WATER.light}"/><stop offset="1" stop-color="${WATER.light}" stop-opacity="0"/></radialGradient>`);
  out.push(`<ellipse cx="${cx + 30}" cy="${cy + 14}" rx="360" ry="112" fill="url(#wt)"/>`);

  // the bud, behind the pad to the right: prickly stalk out of the water
  const bx = 520, by = 470;
  const bst = `M${bx + 14},${cy + 10} C${bx + 20},${cy - 60} ${bx + 4},${by + 120} ${bx},${by + 60}`;
  out.push(`<path d="${bst}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="${bst}" fill="none" stroke="#8a7a4a" stroke-width="9" stroke-linecap="round"/>`);
  const prick = [];
  for (let k = 0; k < 10; k++) {
    const y = cy - 10 - k * 18, x = bx + 12 - k * 1.2;
    prick.push(`M${r1(x - 4)},${r1(y)} l-6,-4 M${r1(x + 4)},${r1(y - 8)} l6,-4`);
  }
  out.push(`<path d="${prick.join(" ")}" stroke="${INK}" stroke-width="1.1"/>`);
  // the bud: an ovoid, prickles all over, sepals parting at the top
  const bud = `M${bx - 40},${by + 20} C${bx - 46},${by - 40} ${bx - 20},${by - 70} ${bx},${by - 74} C${bx + 20},${by - 70} ${bx + 46},${by - 40} ${bx + 40},${by + 20} C${bx + 34},${by + 62} ${bx - 34},${by + 62} ${bx - 40},${by + 20} Z`;
  defs.push(`<radialGradient id="bg" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stop-color="${BUD.light}"/><stop offset="0.6" stop-color="${BUD.base}"/><stop offset="1" stop-color="${BUD.deep}"/></radialGradient>`);
  defs.push(`<clipPath id="bc"><path d="${bud}"/></clipPath>`);
  out.push(`<path d="${bud}" fill="url(#bg)"/>`);
  // the prickles, in diagonal rows as on a pineapple
  const pk = [];
  for (let i = -6; i <= 6; i++) {
    for (let j = 0; j < 9; j++) {
      const x = bx + i * 12 + (j % 2) * 6, y = by + 50 - j * 14;
      pk.push(`M${x - 3},${y} L${x},${y - 7} L${x + 3},${y}`);
    }
  }
  out.push(`<path d="${pk.join(" ")}" fill="none" stroke="${BUD.light}" stroke-width="1.2" clip-path="url(#bc)"/>`);
  out.push(`<path d="${bud}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  // the sepals parting, a glimpse of white petal between them
  out.push(`<path d="M${bx - 10},${by - 70} C${bx - 8},${by - 92} ${bx + 8},${by - 92} ${bx + 10},${by - 70} Z" fill="#f6f2e2" stroke="${INK}" stroke-width="1.2"/>`);
  for (const [dx, rot] of [[-16, -24], [16, 24], [0, 0]]) out.push(`<path d="M${bx + dx - 8},${by - 66} Q${bx + dx},${by - 100} ${bx + dx + 8},${by - 66} Z" transform="rotate(${rot} ${bx + dx} ${by - 66})" fill="${BUD.base}" stroke="${INK}" stroke-width="1.2"/>`);

  // the pad: the rim's outside first, round the front
  const N = 128;
  const front = [], lip = [];
  for (let j = 0; j <= N; j++) {
    const a = (j / N) * Math.PI;
    front.push(flat(cx, cy, RX, RY, a));
    lip.push(flat(cx, cy - H, RX, RY, a));
  }
  const outside = smooth(lip) + " " + smooth([...front].reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
  defs.push(`<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${RIM.light}"/><stop offset="0.5" stop-color="${RIM.base}"/><stop offset="1" stop-color="${mix(RIM.deep, PAD.shade, 0.3)}"/></linearGradient>`);
  defs.push(`<clipPath id="oc"><path d="${outside}"/></clipPath>`);
  // the far side of the rim, seen from inside, green
  const back = [];
  for (let j = 0; j <= N; j++) back.push(flat(cx, cy - H, RX, RY, Math.PI + (j / N) * Math.PI));
  const inner = [];
  for (let j = 0; j <= N; j++) inner.push(flat(cx, cy - 4, RX - 6, RY - 3, Math.PI + (j / N) * Math.PI));
  const backWall = smooth(back) + " " + smooth([...inner].reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
  out.push(`<path d="${backWall}" fill="${PAD.deep}"/><path d="${backWall}" fill="${PAD.base}" fill-opacity="0.5" filter="url(#wc2)"/>`);
  // the floor of the pad, quilted
  const floor = `M${cx - RX + 6},${cy - 4} A${RX - 6},${RY - 3} 0 1,1 ${cx + RX - 6},${cy - 4} A${RX - 6},${RY - 3} 0 1,1 ${cx - RX + 6},${cy - 4} Z`;
  defs.push(`<clipPath id="fc"><path d="${floor}"/></clipPath>`);
  defs.push(`<radialGradient id="fg" gradientUnits="userSpaceOnUse" cx="${cx - 40}" cy="${cy - 20}" r="${RX}" gradientTransform="translate(0 ${r1((cy - 20) * 0.63)}) scale(1 0.37)"><stop offset="0" stop-color="${PAD.light}"/><stop offset="0.8" stop-color="${PAD.base}"/><stop offset="1" stop-color="${PAD.deep}"/></radialGradient>`);
  out.push(`<path d="${floor}" fill="${PAD.base}"/><path d="${floor}" fill="url(#fg)" filter="url(#wc)"/>`);
  const q = [];
  for (let k = 0; k < 20; k++) {
    const a = (k / 20) * Math.PI * 2;
    const [x, y] = flat(cx, cy - 4, RX, RY, a);
    q.push(`M${cx},${cy - 4} L${r1(x)},${r1(y)}`);
  }
  for (const f of [0.3, 0.52, 0.72, 0.9]) q.push(`M${r1(cx - (RX - 6) * f)},${cy - 4} A${r1((RX - 6) * f)},${r1((RY - 3) * f)} 0 1,1 ${r1(cx + (RX - 6) * f)},${cy - 4} A${r1((RX - 6) * f)},${r1((RY - 3) * f)} 0 1,1 ${r1(cx - (RX - 6) * f)},${cy - 4}`);
  out.push(`<path d="${q.join(" ")}" fill="none" stroke="${PAD.shade}" stroke-width="1.1" stroke-opacity="0.35" clip-path="url(#fc)"/>`);
  // and the near rim, standing up in front of it
  out.push(`<path d="${outside}" fill="url(#rg)"/><path d="${outside}" fill="${RIM.base}" fill-opacity="0.35" filter="url(#wc2)"/>`);
  const ribs = [];
  for (let j = 4; j < N; j += 4) {
    const [x0, y0] = lip[j], [x1, y1] = front[j];
    ribs.push(`M${r1(x0)},${r1(y0 + 3)} L${r1(x1)},${r1(y1 - 2)}`);
  }
  out.push(`<path d="${ribs.join(" ")}" stroke="${RIM.deep}" stroke-width="1.2" stroke-opacity="0.5" clip-path="url(#oc)"/>`);
  // the lip's green inner edge, just showing along the top of the rim
  out.push(`<path d="${smooth(lip)}" fill="none" stroke="${PAD.light}" stroke-width="3.4" stroke-opacity="0.8"/>`);
  out.push(`<g filter="url(#pen)"><path d="${outside}" fill="none" stroke="${INK}" stroke-width="1.9"/><path d="${smooth(back)}" fill="none" stroke="${INK}" stroke-width="1.6"/></g>`);
  void rand;

  // ── fig. 2: jack-in-the-pulpit, small corm and large ──────────────────────
  const fx = 664, soil = 700;
  const figFrom = out.length;
  out.push(`<rect x="${fx - 90}" y="${soil}" width="180" height="70" fill="#c9a77a" fill-opacity="0.55" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<path d="M${fx - 90},${soil} L${fx + 90},${soil}" stroke="#6e5436" stroke-width="2"/>`);
  const jack = (x, s) => {
    // the corm below the line
    out.push(`<ellipse cx="${x}" cy="${soil + 30}" rx="${r1(22 * s)}" ry="${r1(14 * s)}" fill="#a88a5c" stroke="${INK}" stroke-width="1.2"/>`);
    const topY = soil - 110 * s;
    out.push(`<path d="M${x},${soil + 20} L${x},${r1(topY + 40 * s)}" stroke="${INK}" stroke-width="${r1(5 * s)}"/><path d="M${x},${soil + 20} L${x},${r1(topY + 40 * s)}" stroke="#86a45e" stroke-width="${r1(3 * s)}"/>`);
    // the spathe: a striped tube, and its hood over the top
    const tube = `M${r1(x - 10 * s)},${r1(topY + 44 * s)} L${r1(x - 12 * s)},${r1(topY + 4 * s)} L${r1(x + 12 * s)},${r1(topY + 4 * s)} L${r1(x + 10 * s)},${r1(topY + 44 * s)} Z`;
    out.push(`<path d="${tube}" fill="#8aa45a" stroke="${INK}" stroke-width="1.1"/>`);
    for (const dx of [-5, 0, 5]) out.push(`<path d="M${r1(x + dx * s)},${r1(topY + 8 * s)} L${r1(x + dx * s)},${r1(topY + 42 * s)}" stroke="#5a2e40" stroke-width="${r1(1.2 * s)}" stroke-opacity="0.6"/>`);
    out.push(`<path d="M${r1(x - 13 * s)},${r1(topY + 8 * s)} C${r1(x - 20 * s)},${r1(topY - 30 * s)} ${r1(x + 30 * s)},${r1(topY - 40 * s)} ${r1(x + 30 * s)},${r1(topY + 12 * s)} C${r1(x + 22 * s)},${r1(topY - 8 * s)} ${r1(x + 2 * s)},${r1(topY - 10 * s)} ${r1(x - 13 * s)},${r1(topY + 8 * s)} Z" fill="#6e8a44" stroke="${INK}" stroke-width="1.1"/>`);
    out.push(`<path d="M${r1(x - 6 * s)},${r1(topY - 12 * s)} C${r1(x + 6 * s)},${r1(topY - 22 * s)} ${r1(x + 20 * s)},${r1(topY - 20 * s)} ${r1(x + 24 * s)},${r1(topY - 2 * s)}" fill="none" stroke="#5a2e40" stroke-width="${r1(1.2 * s)}" stroke-opacity="0.5"/>`);
  };
  jack(fx - 44, 0.6);
  jack(fx + 40, 1);
  out.push(`<g transform="translate(${fx} ${soil + 70}) scale(1.28) translate(${-fx} ${-(soil + 70)})">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, fx, soil + 72, 124, 6, 0.2);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
