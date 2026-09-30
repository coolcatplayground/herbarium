// NO. 0273 — an acorn in a ringed cup.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the acorn. A glossy brown nut, rounded, drawn to a small
//      point at its foot, capped by a grey cup with a short woody stalk. The
//      cup is not scaly as a European oak's is but banded — ring on ring of
//      raised grey bands, the cup of the ring-cupped oaks of East Asia,
//      Quercus glauca and its kin. Stood upright on its point, cup and stalk
//      at the top.
//   2. Under it, one of the tree's leaves: leathery, oblong, toothed toward
//      the tip, dark above.
//   3. No face. The acorn is the plate.
//   4. The field note's point is how an acorn travels. It is far too heavy to
//      fly, and oaks moved north after the ice at hundreds of metres a year:
//      the answer is jays, which bury acorns one at a time at about the depth
//      a seedling wants, several thousand in an autumn, and do not come back
//      for all of them. Fig. 2 is the forgotten one — an acorn in a slice of
//      soil, pushed in to the depth a jay pushes it, its root going down.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid, frontArc } from "./kit.mjs";

export const slug = "seedot";
export const no = 273;
const SIZE = 800;
const NUT = { light: "#d8a870", base: "#a8703e", deep: "#7a4c26", shade: "#4a2c14", edge: "#4a2c14" };
const CUP = { light: "#c6c4bc", base: "#8c8a86", deep: "#62605c", shade: "#3c3a38", edge: "#3c3a38" };
const LEAF = { light: "#9fbf84", base: "#557e44", deep: "#34582c", shade: "#1f3a1c", edge: "#1f3a1c" };

// the acorn: nut, ringed cup and stalk; returns nothing, paints into out
function acorn(out, defs, id, x, ground, s) {
  const nut = makeOrgan({
    x, base: ground, H: 250 * s, R: 96 * s, tilt: 0.18,
    knots: [[0, 0.06], [0.07, 0.44], [0.22, 0.8], [0.45, 0.98], [0.68, 1], [0.88, 0.94], [1, 0.84]],
  });
  paintSolid(nut, { id: `${id}n`, outline: hull(nut, { t1: 0.78 }), palette: NUT, defs, out, hatch: 4, tHatch: [0.1, 0.6] });
  // faint lines down the length of the nut
  for (const th of [-0.9, -0.35, 0.25, 0.8]) {
    const pts = [];
    for (let j = 0; j <= 10; j++) pts.push(nut.surface(th, 0.06 + (j / 10) * 0.7, 1.004));
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${NUT.shade}" stroke-width="1" stroke-opacity="0.25" clip-path="url(#${id}nc)"/>`);
  }
  // the dry point at its foot
  const [px, py] = nut.surface(0, 0);
  out.push(`<path d="M${r1(px - 5)},${r1(py - 6)} L${r1(px)},${r1(py + 6)} L${r1(px + 5)},${r1(py - 6)} Z" fill="${NUT.shade}"/>`);
  // the cup: wider than the nut, banded
  const [, cy] = nut.surface(0, 0.72);
  const cup = makeOrgan({
    x, base: cy + 6 * s, H: 98 * s, R: 104 * s, tilt: 0.18,
    knots: [[0, 1], [0.25, 0.99], [0.5, 0.92], [0.75, 0.72], [0.92, 0.4], [1, 0.18]],
  });
  paintSolid(cup, { id: `${id}c`, outline: hull(cup), palette: CUP, defs, out, hatch: 0, sheen: false });
  for (const t of [0.1, 0.26, 0.42, 0.58, 0.74]) {
    out.push(`<path d="${frontArc(cup, t, 1.006, 1.45)}" fill="none" stroke="${CUP.shade}" stroke-width="${r1(2 * s)}" stroke-opacity="0.6" clip-path="url(#${id}cc)"/>`);
    out.push(`<path d="${frontArc(cup, t + 0.05, 1.006, 1.45)}" fill="none" stroke="${CUP.light}" stroke-width="${r1(3 * s)}" stroke-opacity="0.55" clip-path="url(#${id}cc)"/>`);
  }
  // the rim, where the cup stands off the nut
  out.push(`<path d="${frontArc(cup, 0.01, 1.01, 1.5)}" fill="none" stroke="${INK}" stroke-width="${r1(1.6 * s)}"/>`);
  // the stalk
  const [tx, ty] = cup.surface(0, 1);
  const st = [[tx, ty + 4], [tx + 2, ty - 26 * s], [tx - 4, ty - 50 * s], [tx - 2, ty - 66 * s]];
  const sd = smooth(st);
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="${r1(15 * s)}" stroke-linecap="butt"/><path d="${sd}" fill="none" stroke="${CUP.deep}" stroke-width="${r1(12 * s)}" stroke-linecap="butt"/>`);
  out.push(`<path d="${sd}" fill="none" stroke="${CUP.light}" stroke-width="${r1(3 * s)}" transform="translate(-2 0)"/>`);
  const [ex, ey] = st.at(-1);
  out.push(`<ellipse cx="${r1(ex)}" cy="${r1(ey)}" rx="${r1(6 * s)}" ry="${r1(2.6 * s)}" fill="#b8a888" stroke="${INK}" stroke-width="1.1"/>`);
}

export function draw() {
  const rand = mulberry32(273);
  const defs = standardDefs(273);
  const out = [];
  contact(out, 330, 758, 200, 16);

  // a leaf of the tree, lying under it
  const lf = blade([[150, 752], [250, 742], [360, 736], [470, 744], [540, 758]], {
    width: (u) => 46 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.7),
    lobes: 9, depth: 0.1, start: 0.5, sideVeins: 8, rand,
  });
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, shade: 0.15, margin: 5 });

  acorn(out, defs, "a", 330, 738, 1);

  // ── fig. 2: the forgotten one, in a slice of soil ─────────────────────────
  const fx = 680, soil = 612;
  const figFrom = out.length;
  out.push(`<rect x="${fx - 92}" y="${soil}" width="184" height="152" rx="3" fill="#c9a77a" fill-opacity="0.55" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="M${fx - 92},${soil} L${fx + 92},${soil}" stroke="#6e5436" stroke-width="2"/>`);
  for (let k = 0; k < 40; k++) out.push(`<circle cx="${r1(fx - 86 + rand() * 172)}" cy="${r1(soil + 6 + rand() * 140)}" r="${r1(0.8 + rand() * 1.4)}" fill="#8a6a44" fill-opacity="0.6"/>`);
  // the acorn lying where it was pushed, its root going down
  const ax = fx - 10, ay = soil + 46;
  out.push(`<path d="M${ax + 22},${ay + 6} C${ax + 30},${ay + 30} ${ax + 22},${ay + 60} ${ax + 30},${ay + 94}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/><path d="M${ax + 22},${ay + 6} C${ax + 30},${ay + 30} ${ax + 22},${ay + 60} ${ax + 30},${ay + 94}" fill="none" stroke="#efe4c8" stroke-width="3" stroke-linecap="round"/>`);
  out.push(`<ellipse cx="${ax}" cy="${ay}" rx="26" ry="17" transform="rotate(18 ${ax} ${ay})" fill="${NUT.base}" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${ax - 6}" cy="${ay - 5}" rx="10" ry="4" transform="rotate(18 ${ax - 6} ${ay - 5})" fill="${NUT.light}" fill-opacity="0.7"/>`);
  // the jay's bill-depth, marked
  out.push(`<path d="M${fx + 70},${soil + 4} L${fx + 70},${ay}" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3"/><path d="M${fx + 64},${soil + 4} l12,0 M${fx + 64},${ay} l12,0" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<g transform="translate(${fx} 766) scale(1.2) translate(${-fx} -766)">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, fx, 770, 116, 6, 0.2);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
