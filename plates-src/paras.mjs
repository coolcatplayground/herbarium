// NO. 0046 — two fruiting bodies, up through the turf.
//
// What the morphology says, and what each observation became:
//
//   1. The part is not a plant at all: two small mushrooms, the fruiting
//      bodies of a fungus. Round button caps, mauve-pink, set with large
//      amber spots, on short pale stalks, leaning a little apart.
//   2. They grow out of an animal, but the animal is not shown. The field
//      note files it with tochukaso, the caterpillar fungus, whose host lies
//      buried and whose fruiting body is all that anyone finds: pushed up
//      through the turf in spring. So the mushrooms rise from a clod of
//      alpine turf, rust-brown earth under short grass. An earlier version
//      showed the host, an orange carapace bound in white mycelium, and it
//      read as raw flesh.
//   3. Fig. 2 cuts one cap through: the pink skin, the pale flesh, the gills
//      packed beneath, and the spores falling out of them — the only part of
//      this that is ever meant to leave.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid, spotsOn, capUnderside } from "./kit.mjs";

export const slug = "paras";
export const no = 46;
const SIZE = 800;

const CAP = { light: "#e8b4c8", base: "#cd85a2", deep: "#a96283", shade: "#6e3a52", edge: "#6e3a52" };
const SOIL = { light: "#d6a472", base: "#b57a4a", deep: "#8a5634", shade: "#5a3820", edge: "#5a3820" };
const GRASS = ["#7fa65a", "#96b86a", "#5f8a44", "#a9c47c"];
const SPOT = "#efc574";
const DOME = [[0, 1], [0.18, 0.98], [0.4, 0.9], [0.62, 0.72], [0.8, 0.5], [0.93, 0.26], [1, 0]];

function mushroom(out, defs, rand, { id, x, y, h, lean, R, H }) {
  const top = [x + lean, y - h];
  // the cap: a dome seen from a little below
  const cap = makeOrgan({ x: top[0], base: top[1], H, R, tilt: -0.14, knots: DOME });
  const d = paintSolid(cap, { id, outline: hull(cap), palette: CAP, defs, out, hatch: 4, ink: 2, tHatch: [0.1, 0.72] });
  const spots = spotsOn(cap, { rand, count: 7, t: [0.24, 0.85], theta: [-1.3, 1.3], size: [R * 0.12, R * 0.2] });
  out.push(`<g clip-path="url(#${id}c)">${spots.map((q) => `<path d="${q}" fill="#c88f4a" transform="translate(1 1.4)"/><path d="${q}" fill="${SPOT}"/>`).join("")}</g>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // the gills under the whole rim
  capUnderside(cap, out, { hub: 0.2 });
  // the stalk: pale, fibrous, leaning, hanging down in front of the gills
  const [hx, hy] = cap.surface(0, 0, 0);
  const w0 = R * 0.26, w1 = R * 0.2;
  const stalk = `M${r1(x - w0)},${r1(y)} C${r1(x - w0 + lean * 0.3)},${r1(y - h * 0.5)} ${r1(hx - w1)},${r1(hy + h * 0.3)} ${r1(hx - w1)},${r1(hy)} ` +
    `L${r1(hx + w1)},${r1(hy)} C${r1(hx + w1)},${r1(hy + h * 0.3)} ${r1(x + w0 + lean * 0.3)},${r1(y - h * 0.5)} ${r1(x + w0)},${r1(y)} Z`;
  defs.push(`<linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbf3e2"/><stop offset="0.6" stop-color="#eadbbf"/><stop offset="1" stop-color="#b9a582"/></linearGradient>`);
  out.push(`<path d="${stalk}" fill="url(#${id}s)"/>`);
  for (let k = -2; k <= 2; k++) out.push(`<path d="M${r1(x + k * w0 * 0.35)},${r1(y - 4)} Q${r1(x + k * w0 * 0.3 + lean * 0.4)},${r1(y - h * 0.5)} ${r1(hx + k * w1 * 0.35)},${r1(hy + 4)}" fill="none" stroke="#a8946e" stroke-opacity="0.45" stroke-width="0.8"/>`);
  out.push(`<path d="${stalk}" fill="none" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
}

export function draw() {
  const rand = mulberry32(46);
  const defs = standardDefs(46);
  const out = [];

  // Scaled up about its foot, for the same reason as NO. 0044.
  const mainFrom = out.length;
  contact(out, 330, 748, 190, 18);
  // the clod of turf they come up through
  const clod = [];
  for (let i = 0; i <= 40; i++) {
    const a = Math.PI + (i / 40) * Math.PI;
    clod.push([330 + Math.cos(a) * 168, 736 + Math.sin(a) * 58 * (1 + 0.05 * Math.sin(i * 1.7))]);
  }
  const sd = smooth(clod) + " Z";
  defs.push(`<linearGradient id="shg" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="${SOIL.light}"/><stop offset="0.5" stop-color="${SOIL.base}"/><stop offset="1" stop-color="${SOIL.deep}"/></linearGradient>`);
  defs.push(`<clipPath id="shc"><path d="${sd}"/></clipPath>`);
  out.push(`<path d="${sd}" fill="${SOIL.base}"/><path d="${sd}" fill="url(#shg)" filter="url(#wc)"/>`);
  // crumbs and small stones in the earth
  const crumbs = [];
  for (let k = 0; k < 70; k++) {
    const x = 170 + rand() * 320, y = 684 + rand() * 54;
    crumbs.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(1.4 + rand() * 3)}" ry="${r1(1 + rand() * 2)}" fill="${rand() < 0.3 ? "#e3c49a" : SOIL.shade}" fill-opacity="${r1(0.35 + rand() * 0.35)}"/>`);
  }
  out.push(`<g clip-path="url(#shc)">${crumbs.join("")}</g>`);
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  // short grass along the top of the clod, the back row first
  const grass = (row) => {
    const g = [];
    for (let k = 0; k < 64; k++) {
      const u = k / 63, x = 178 + u * 304 + (rand() - 0.5) * 6;
      const top = 736 - 58 * Math.sin(Math.PI * u) * 0.98 + row * 6;
      const h = 10 + rand() * 16, lean = (rand() - 0.5) * 12;
      g.push(`<path d="M${r1(x - 2)},${r1(top + 3)} Q${r1(x + lean * 0.4)},${r1(top - h * 0.6)} ${r1(x + lean)},${r1(top - h)} Q${r1(x + lean * 0.3 + 1)},${r1(top - h * 0.5)} ${r1(x + 2)},${r1(top + 3)} Z" fill="${GRASS[k % 4]}" stroke="${INK}" stroke-width="0.6" stroke-opacity="0.7"/>`);
    }
    out.push(g.join(""));
  };
  grass(0);

  mushroom(out, defs, rand, { id: "m1", x: 256, y: 694, h: 92, lean: -30, R: 124, H: 106 });
  mushroom(out, defs, rand, { id: "m2", x: 420, y: 700, h: 70, lean: 24, R: 100, H: 86 });
  grass(1);

  out.push(`<g transform="translate(330 752) scale(1.16) translate(-330 -752)">${out.splice(mainFrom).join("\n")}</g>`);

  // ── fig. 2: a cap cut through ─────────────────────────────────────────────
  const fx = 690, fy = 704;
  const capTop = [];
  for (let i = 0; i <= 30; i++) {
    const a = Math.PI + (i / 30) * Math.PI;
    capTop.push([fx + Math.cos(a) * 62, fy + Math.sin(a) * 50]);
  }
  const capD = smooth(capTop) + ` L${fx + 62},${fy} L${fx - 62},${fy} Z`;
  const fleshD = smooth(capTop.map(([x, y]) => [fx + (x - fx) * 0.9, fy + (y - fy) * 0.84])) + ` L${fx + 56},${fy} L${fx - 56},${fy} Z`;
  out.push(`<path d="${capD}" fill="${CAP.base}"/><path d="${fleshD}" fill="#f8efe2"/>`);
  // the gills, packed under the flesh
  const gl = [];
  for (let k = 0; k < 28; k++) {
    const x = fx - 54 + k * 4;
    if (Math.abs(x - fx) < 10) continue;
    gl.push(`M${r1(x)},${fy} L${r1(x + (x - fx) * 0.02)},${fy + 16 - Math.abs(x - fx) * 0.12}`);
  }
  out.push(`<path d="M${fx - 56},${fy} L${fx + 56},${fy} L${fx + 46},${fy + 10} L${fx - 46},${fy + 10} Z" fill="#e8c7b8"/>`);
  out.push(`<path d="${gl.join(" ")}" stroke="#a3776a" stroke-width="1.2"/>`);
  // the stalk, cut, fibres running its length
  out.push(`<path d="M${fx - 11},${fy} L${fx - 13},${fy + 52} L${fx + 13},${fy + 52} L${fx + 11},${fy} Z" fill="#f4ead6" stroke="${INK}" stroke-width="1.3"/>`);
  for (const dx of [-6, 0, 6]) out.push(`<path d="M${fx + dx},${fy + 2} L${fx + dx * 1.1},${fy + 50}" stroke="#c7b48e" stroke-width="0.8"/>`);
  // spores, falling
  for (let k = 0; k < 22; k++) out.push(`<circle cx="${r1(fx - 50 + rand() * 100)}" cy="${r1(fy + 14 + rand() * 40)}" r="${r1(0.8 + rand() * 0.8)}" fill="#8a5a4a" fill-opacity="0.7"/>`);
  out.push(`<path d="${capD}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  contact(out, fx, fy + 58, 60, 6, 0.24);

  return { size: SIZE, view: [0, 370, SIZE, 420], defs: defs.join("\n"), body: out.join("\n") };
}
