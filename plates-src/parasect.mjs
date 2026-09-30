// NO. 0047 — the fungus, finished.
//
// What the morphology says, and what each observation became:
//
//   1. One great fruiting body now: a broad bell of a cap, mauve-pink,
//      blotched with amber, big enough to hood whatever it grew from. Seen
//      from a little below, so the gills show under its rim.
//   2. A stout pale stalk down into a mat of mycelium, and in the mat, what
//      is left of the host — the same carapace NO. 0046 grew from, now dark,
//      cracked and hollow. The field note calls it fully sporulated: the
//      fungus has finished with it.
//   3. Fig. 2 is the note's own example of what a fungus can make a plant do.
//      Puccinia monoica infects rockcress, stops it flowering, and makes the
//      shoot grow a rosette of bright yellow leaves shaped like a flower,
//      coated in sugary fluid for insects to drink — a pseudoflower. There is
//      no flower there at all.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid, spotsOn, capUnderside } from "./kit.mjs";

export const slug = "parasect";
export const no = 47;
const SIZE = 800;

const CAP = { light: "#e9b6cb", base: "#cf89a6", deep: "#a35f7e", shade: "#6a3550", edge: "#6a3550" };

export function draw() {
  const rand = mulberry32(47);
  const defs = standardDefs(47);
  const out = [];

  contact(out, 330, 752, 210, 18);
  // the mycelium mat, and the husk of the host in it
  const husk = [];
  for (let i = 0; i <= 30; i++) {
    const a = Math.PI + (i / 30) * Math.PI;
    husk.push([470 + Math.cos(a) * 92, 742 + Math.sin(a) * 34]);
  }
  const hd = smooth(husk) + " Z";
  out.push(`<path d="${hd}" fill="#7d5a42"/><path d="${hd}" fill="#9a7052" filter="url(#wc)"/>`);
  out.push(`<path d="M420,716 L438,730 L430,742 M492,712 L480,728 L496,740 M455,722 L462,742" fill="none" stroke="#3a2618" stroke-width="1.4"/>`);
  out.push(`<path d="${hd}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  const mat = [];
  for (let i = 0; i < 140; i++) {
    const x = 170 + rand() * 360, y = 722 + rand() * 26, a = rand() * Math.PI, L = 8 + rand() * 18;
    mat.push(`M${r1(x)},${r1(y)} q${r1(Math.cos(a) * L * 0.5)},${r1(-4 - rand() * 4)} ${r1(Math.cos(a) * L)},${r1(Math.sin(a) * L * 0.3)}`);
  }
  out.push(`<path d="${mat.join(" ")}" fill="none" stroke="#fbf8f0" stroke-opacity="0.9" stroke-width="1.1" stroke-linecap="round"/>`);

  // the cap: a broad bell, from a little below
  const sx = 322;
  const cap = makeOrgan({
    x: sx, base: 520, H: 200, R: 236, tilt: -0.16,
    knots: [[0, 1], [0.1, 0.99], [0.28, 0.92], [0.5, 0.76], [0.72, 0.52], [0.88, 0.28], [1, 0]],
  });
  const d = paintSolid(cap, { id: "c", outline: hull(cap), palette: CAP, defs, out, hatch: 7, tHatch: [0.08, 0.72] });
  const spots = spotsOn(cap, { rand, count: 10, t: [0.18, 0.8], theta: [-1.35, 1.35], size: [16, 32] });
  out.push(`<g clip-path="url(#cc)">${spots.map((s) => `<path d="${s}" fill="#c98a2e" transform="translate(1.4 1.8)"/><path d="${s}" fill="#eebc42"/>`).join("")}</g>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.3" filter="url(#pen)"/>`);
  // the gills under the whole rim
  capUnderside(cap, out, { n: 96, hub: 0.13 });
  // the stalk, hanging down in front of them into the mat
  const [, hy] = cap.surface(0, 0, 0);
  const stalk = `M${sx - 44},744 C${sx - 40},690 ${sx - 32},600 ${sx - 30},${r1(hy)} L${sx + 30},${r1(hy)} C${sx + 32},600 ${sx + 40},690 ${sx + 44},744 Z`;
  defs.push(`<linearGradient id="stk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbf3e2"/><stop offset="0.55" stop-color="#e6d6b8"/><stop offset="1" stop-color="#ab977a"/></linearGradient>`);
  out.push(`<path d="${stalk}" fill="url(#stk)"/>`);
  for (let k = -3; k <= 3; k++) out.push(`<path d="M${sx + k * 12},742 Q${sx + k * 9},640 ${sx + k * 8},${r1(hy + 6)}" fill="none" stroke="#a8946e" stroke-opacity="0.4" stroke-width="0.9"/>`);
  out.push(`<path d="${stalk}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);

  // ── fig. 2: the pseudoflower ──────────────────────────────────────────────
  const fx = 680, fy = 680;
  out.push(`<path d="M${fx - 6},${fy + 74} L${fx - 5},${fy + 4} L${fx + 5},${fy + 4} L${fx + 6},${fy + 74} Z" fill="#7da35e" stroke="${INK}" stroke-width="1.2"/>`);
  const leaves = [];
  for (let k = 0; k < 11; k++) {
    const a = (k / 11) * Math.PI * 2 + 0.2;
    const L = 50 + (k % 2) * 10;
    const tip = [fx + Math.cos(a) * L, fy + Math.sin(a) * L * 0.5];
    const nx = -Math.sin(a) * 13, ny = Math.cos(a) * 6.5;
    const mid = [fx + Math.cos(a) * L * 0.5, fy + Math.sin(a) * L * 0.25];
    leaves.push({ y: Math.sin(a), d: `M${fx},${fy} Q${r1(mid[0] + nx)},${r1(mid[1] + ny)} ${r1(tip[0])},${r1(tip[1])} Q${r1(mid[0] - nx)},${r1(mid[1] - ny)} ${fx},${fy} Z` });
  }
  leaves.sort((a, b) => a.y - b.y).forEach(({ d: ld }) => out.push(`<path d="${ld}" fill="#f2d04a" stroke="${INK}" stroke-width="1"/>`));
  for (let k = 0; k < 8; k++) {
    const a = rand() * Math.PI * 2, rr = 12 + rand() * 30;
    out.push(`<circle cx="${r1(fx + Math.cos(a) * rr)}" cy="${r1(fy + Math.sin(a) * rr * 0.5)}" r="1.8" fill="#ffffff" fill-opacity="0.9"/>`);
  }
  out.push(`<circle cx="${fx}" cy="${fy}" r="5" fill="#e0a62a" stroke="${INK}" stroke-width="0.8"/>`);
  contact(out, fx, fy + 76, 50, 6, 0.24);

  return { size: SIZE, view: [0, 296, SIZE, 482], defs: defs.join("\n"), body: out.join("\n") };
}
