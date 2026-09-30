// NO. 0071 — the pitcher that keeps its promise.
//
// What the morphology says, and what each observation became:
//
//   1. The trap full grown and upright: a great yellow-green pitcher,
//      freckled, its mouth open to the sky under a broad leaf held up over it
//      as a lid — the lid of a Nepenthes, which keeps the rain out.
//   2. A thick ribbed rim, the peristome, pink-red, and inside it the dark
//      throat.
//   3. A long tendril curling away from its back: a pitcher is the end of a
//      leaf, carried on a tendril, and this one still has the tendril.
//   4. The field note's species is Nepenthes albomarginata, and the one thing
//      that marks it is here: a narrow band of white edible hairs just under
//      the rim. Termites come to harvest it in columns, the footing gives out,
//      and a single pitcher takes hundreds in a night — a lure that actually
//      pays, then eats the customers. Fig. 2 is that band, and the column.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, profileOutline, paintSolid, spotsOn, ring } from "./kit.mjs";

export const slug = "victreebel";
export const no = 71;
const SIZE = 800;

const PITCH = { light: "#f5f2b4", base: "#e6e46e", deep: "#b9b451", shade: "#7e7a30", edge: "#7a762c" };
const LEAF = { light: "#cfeab8", base: "#9fd28c", deep: "#62a05c", shade: "#3e7040", edge: "#427244" };

export function draw() {
  const rand = mulberry32(71);
  const defs = standardDefs(71);
  const out = [];
  const P = makeOrgan({
    x: 330, base: 734, H: 340, R: 134, tilt: 0.3,
    // bulbous below, pinched at a waist, flared at the rim — a pitcher, not a can
    knots: [[0, 0.4], [0.12, 0.86], [0.28, 1], [0.44, 0.97], [0.6, 0.8], [0.76, 0.7], [0.9, 0.76], [1, 0.86]],
  });
  contact(out, 330, 760, 160, 16);

  // the tendril, curling away from its back
  const [tx, ty] = P.surface(1.9, 0.16);
  const tend = [[tx, ty], [tx + 70, ty - 20], [tx + 150, ty - 90], [tx + 170, ty - 190], [tx + 130, ty - 240], [tx + 96, ty - 210], [tx + 114, ty - 180], [tx + 140, ty - 196]];
  const td = smooth(tend);
  out.push(`<path d="${td}" fill="none" stroke="#6f8a4a" stroke-width="8" stroke-linecap="round"/><path d="${td}" fill="none" stroke="#b4c98a" stroke-width="1.8" stroke-linecap="round" transform="translate(-1 -1)"/>`);
  out.push(`<path d="${td}" fill="none" stroke="${INK}" stroke-width="1.3" filter="url(#pen)"/>`);
  const bud = blade([[tx + 140, ty - 196], [tx + 162, ty - 214], [tx + 188, ty - 220]], { width: (u) => 13 * Math.sin(Math.PI * Math.min(1, u * 0.98)), rand });
  paintBlade(bud, { id: "bud", palette: LEAF, defs, out, margin: 3, midrib: false, ink: 1.3 });

  // two leaves at its foot
  for (const side of [-1, 1]) {
    const [sx, sy] = P.surface(side * 1.2, 0.14);
    const pts = [];
    for (let i = 0; i <= 4; i++) {
      const u = i / 4;
      pts.push([sx + side * 170 * u, sy - 20 * u - 44 * Math.sin(Math.PI * u) + 20 * u * u]);
    }
    const b = blade(pts, { width: (u) => 54 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.8), 0.7), sideVeins: 7, rand });
    paintBlade(b, { id: `f${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.25 : 0.05, margin: 6 });
  }

  // the lid: a broad leaf held up over the mouth from the back of the rim
  const [lx, ly] = P.surface(Math.PI, 1);
  const lid = blade([[lx + 2, ly + 4], [lx - 4, ly - 70], [lx + 6, ly - 140], [lx + 26, ly - 196]], {
    width: (u) => 96 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.95) ** 0.9), 0.65), sideVeins: 8, rand,
  });
  paintBlade(lid, { id: "lid", palette: LEAF, defs, out, shade: 0.15, margin: 8 });

  // the body
  const d = paintSolid(P, { id: "p", outline: profileOutline(P), palette: PITCH, defs, out, hatch: 6, tHatch: [0.1, 0.8] });
  const freck = spotsOn(P, { rand, count: 30, t: [0.08, 0.8], theta: [-1.4, 1.4], size: [3, 8] });
  out.push(`<g clip-path="url(#pc)" fill="#8f8a3c" fill-opacity="0.8">${freck.map((q) => `<path d="${q}"/>`).join("")}</g>`);
  // the white band of edible hairs, just under the rim
  const bandTop = [], bandBot = [];
  for (let j = 0; j <= 40; j++) {
    const th = -1.55 + (j / 40) * 3.1;
    bandTop.push(P.surface(th, 0.955, 1.004));
    bandBot.push(P.surface(th, 0.875, 1.004));
  }
  const band = smooth(bandTop) + smooth([...bandBot].reverse(), false, { move: false }) + " Z";
  out.push(`<path d="${band}" fill="#f7f3e6" clip-path="url(#pc)"/>`);
  const hairs = [];
  for (let j = 0; j < 90; j++) {
    const th = -1.5 + (j / 90) * 3, [ax, ay] = P.surface(th, 0.88, 1.005), [bx, by] = P.surface(th + 0.01, 0.95, 1.005);
    hairs.push(`M${r1(ax)},${r1(ay)} L${r1(bx)},${r1(by)}`);
  }
  out.push(`<path d="${hairs.join(" ")}" stroke="#cfc6a4" stroke-width="0.8" clip-path="url(#pc)"/>`);
  out.push(`<path d="${smooth(bandBot)}" fill="none" stroke="${INK}" stroke-width="1" stroke-opacity="0.7"/>`);
  // the mouth: dark throat, and a thick ribbed rim
  const mouth = ring(P, 1, 0.8), rim = ring(P, 1, 1);
  defs.push(`<radialGradient id="thr" cx="0.5" cy="0.6" r="0.6"><stop offset="0" stop-color="#1e0a0b"/><stop offset="1" stop-color="#6a2a2e"/></radialGradient>`);
  out.push(`<path d="${rim}" fill="#d8707e"/><path d="${mouth}" fill="url(#thr)"/>`);
  const ribs = [];
  for (let j = 0; j < 72; j++) {
    const th = -Math.PI + (j / 72) * Math.PI * 2;
    const [ax, ay] = P.surface(th, 1, 0.82), [bx, by] = P.surface(th, 1, 0.99);
    ribs.push(`M${r1(ax)},${r1(ay)} L${r1(bx)},${r1(by)}`);
  }
  out.push(`<path d="${ribs.join(" ")}" stroke="#9e4452" stroke-width="1.1" stroke-opacity="0.8"/>`);
  out.push(`<path d="${mouth}" fill="none" stroke="${INK}" stroke-width="1.4"/><path d="${rim}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.3" filter="url(#pen)"/>`);

  // ── fig. 2: the band, and the column harvesting it ────────────────────────
  const fx = 590, fy = 676, fw = 200, fh = 84;
  out.push(`<path d="M${fx},${fy} L${fx + fw},${fy - 8} L${fx + fw},${fy + fh - 8} L${fx},${fy + fh} Z" fill="${PITCH.base}" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="M${fx},${fy + 20} L${fx + fw},${fy + 12} L${fx + fw},${fy + 50} L${fx},${fy + 58} Z" fill="#f7f3e6"/>`);
  const fh2 = [];
  for (let k = 0; k < 60; k++) { const x = fx + 2 + k * 2.8, y = fy + 16 - (k * 2.8 / fw) * 8; fh2.push(`M${r1(x)},${r1(y + 25)} l1,-24`); }
  out.push(`<path d="${fh2.join(" ")}" stroke="#d6cdac" stroke-width="0.7"/>`);
  out.push(`<path d="M${fx},${fy} L${fx + fw},${fy - 8}" stroke="#d8707e" stroke-width="7"/>`);
  for (let k = 0; k < 5; k++) {
    const x = fx + 26 + k * 36, y = fy + 38 - (k * 36 / fw) * 8 - (k % 2) * 3;
    out.push(`<g transform="translate(${x} ${y}) scale(1.5) translate(${-x} ${-y})"><g stroke="${INK}" stroke-width="0.7" fill="none"><path d="M${x - 4},${y - 3} l-4,-4 M${x - 4},${y + 3} l-4,4 M${x + 1},${y - 3} l0,-5 M${x + 1},${y + 3} l0,5 M${x + 6},${y - 3} l4,-4 M${x + 6},${y + 3} l4,4 M${x + 10},${y - 1} l6,-3 M${x + 10},${y + 1} l6,3"/></g>`);
    out.push(`<ellipse cx="${x - 3}" cy="${y}" rx="6.5" ry="3.6" fill="#f1e3c6" stroke="${INK}" stroke-width="0.7"/><ellipse cx="${x + 5}" cy="${y}" rx="3.4" ry="3" fill="#f1e3c6" stroke="${INK}" stroke-width="0.7"/><circle cx="${x + 10}" cy="${y}" r="3" fill="#a8633a" stroke="${INK}" stroke-width="0.7"/></g>`);
  }
  contact(out, fx + fw / 2, fy + fh + 6, fw / 2, 6, 0.2);
  void rand;
  return { size: SIZE, view: [0, 150, SIZE, 636], defs: defs.join("\n"), body: out.join("\n") };
}
