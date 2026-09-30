// NO. 0285 — a squat cap, and the wind it makes.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the cap. Low, broad and pale, the colour of old cream, set
//      with round sage-green spots, a few small knobs at its crown, and its
//      rim scalloped all the way round where the edge folds under. It sits
//      almost on the ground on a stalk too short to see past the rim, the
//      gills just showing beneath, greenish.
//   2. The field note files it with the puffballs and agarics, and its point
//      is that a mushroom nothing comes along to knock makes its own weather.
//      Spores dropped under a cap meet still air and would settle straight
//      back; so the mushroom evaporates water hard enough to cool the air
//      round itself and set up a slow current — a few centimetres a second —
//      that lifts them out past the rim. Fig. 2: a cap cut through, and the
//      spores carried up and away on the air it moves.
import { mulberry32, r1, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid, spotsOn, capUnderside } from "./kit.mjs";

export const slug = "shroomish";
export const no = 285;
const SIZE = 800;
const CAP = { light: "#faf3df", base: "#dccfae", deep: "#baa982", shade: "#7a6c4e", edge: "#7a6c4e" };
const SPOT = "#8db9a3";

export function draw() {
  const rand = mulberry32(285);
  const defs = standardDefs(285);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // a low dome, seen from a little above its rim
  const cap = makeOrgan({
    x: 320, base: 718, H: 176, R: 212, tilt: -0.08,
    knots: [[0, 1], [0.16, 0.98], [0.4, 0.88], [0.64, 0.68], [0.84, 0.42], [0.95, 0.2], [1, 0.06]],
  });
  // the gills, just showing under the rim
  capUnderside(cap, out, { fill: "#c9d8bc", gill: "#7f9a78", hub: 0.3 });
  paintSolid(cap, { id: "c", outline: hull(cap), palette: CAP, defs, out, hatch: 4, tHatch: [0.08, 0.6] });
  // the round green spots
  const spots = spotsOn(cap, { rand, count: 11, t: [0.14, 0.86], theta: [-1.35, 1.35], size: [16, 30] });
  out.push(`<g clip-path="url(#cc)">${spots.map((q) => `<path d="${q}" fill="#5e8a76" fill-opacity="0.35" transform="translate(1.4 2)"/><path d="${q}" fill="${SPOT}"/>`).join("")}</g>`);
  // the small knobs at the crown
  for (const [th, t] of [[-0.3, 0.93], [0.2, 0.96], [0.55, 0.9]]) {
    const [kx, ky] = cap.surface(th, t, 1.01);
    out.push(`<path d="M${r1(kx - 12)},${r1(ky + 6)} Q${r1(kx - 6)},${r1(ky - 16)} ${r1(kx + 2)},${r1(ky - 12)} Q${r1(kx + 12)},${r1(ky - 6)} ${r1(kx + 12)},${r1(ky + 6)} Z" fill="${CAP.base}" stroke="${INK}" stroke-width="1.4"/>`);
  }
  // the scalloped rim: round lobes folding under all along the front edge
  const LOBES = 11;
  const lobes = [];
  for (let k = 0; k < LOBES; k++) {
    const t0 = -Math.PI / 2 + (k / LOBES) * Math.PI, t1 = -Math.PI / 2 + ((k + 1) / LOBES) * Math.PI;
    const [ax, ay] = cap.surface(t0, 0.02), [bx, by] = cap.surface(t1, 0.02);
    const [mx, my] = cap.surface((t0 + t1) / 2, 0.02);
    const drop = 26 * Math.cos((t0 + t1) / 2) + 12;
    lobes.push(`M${r1(ax)},${r1(ay)} Q${r1(mx)},${r1(my + drop * 2.4)} ${r1(bx)},${r1(by)} Z`);
  }
  const ld = lobes.join(" ");
  out.push(`<path d="${ld}" fill="${CAP.base}"/><path d="${ld}" fill="${CAP.deep}" fill-opacity="0.45" filter="url(#wc2)"/>`);
  out.push(`<path d="${ld}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" filter="url(#pen)"/>`);

  // ── fig. 2: a cap cut through, and the air it moves ───────────────────────
  const fx = 688, fy = 700;
  const half = `M${fx - 80},${fy} C${fx - 80},${fy - 70} ${fx + 80},${fy - 70} ${fx + 80},${fy} Z`;
  out.push(`<path d="${half}" fill="#f4ecd6" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M${fx - 74},${fy} C${fx - 60},${fy - 50} ${fx + 60},${fy - 50} ${fx + 74},${fy}" fill="none" stroke="${CAP.deep}" stroke-width="1" stroke-opacity="0.6"/>`);
  // the gills along the underside
  const gl = [];
  for (let k = 0; k < 24; k++) { const x = fx - 70 + k * 6; if (Math.abs(x - fx) > 10) gl.push(`M${x},${fy} l0,8`); }
  out.push(`<path d="${gl.join(" ")}" stroke="#7f9a78" stroke-width="1.2"/>`);
  out.push(`<path d="M${fx - 8},${fy} L${fx - 10},${fy + 58} L${fx + 10},${fy + 58} L${fx + 8},${fy} Z" fill="#efe6cf" stroke="${INK}" stroke-width="1.3"/>`);
  // the current: cooled air sinking at the stem, spreading, rising past the rim
  const flow = (d, [hx, hy], a) => {
    out.push(`<path d="${d}" fill="none" stroke="#6a8ab0" stroke-width="1.6" stroke-dasharray="5 4"/>`);
    out.push(`<path d="M${r1(hx - Math.cos(a - 0.5) * 8)},${r1(hy - Math.sin(a - 0.5) * 8)} L${hx},${hy} L${r1(hx - Math.cos(a + 0.5) * 8)},${r1(hy - Math.sin(a + 0.5) * 8)}" fill="none" stroke="#6a8ab0" stroke-width="1.6"/>`);
  };
  for (const s of [-1, 1]) flow(`M${fx + s * 24},${fy + 16} C${fx + s * 60},${fy + 34} ${fx + s * 104},${fy + 20} ${fx + s * 104},${fy - 44}`, [fx + s * 104, fy - 44], -Math.PI / 2);
  // spores riding it
  for (let k = 0; k < 30; k++) {
    const s = rand() < 0.5 ? -1 : 1, u = rand();
    const x = fx + s * (20 + u * 86), y = fy + 20 - u * u * 70 + (rand() - 0.5) * 10;
    out.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(1 + rand())}" fill="#8a6a4a" fill-opacity="0.8"/>`);
  }
  contact(out, fx, fy + 60, 70, 5, 0.2);

  return { size: SIZE, view: [0, 470, SIZE, 320], defs: defs.join("\n"), body: out.join("\n") };
}
