// NO. 0102 — six seeds, and more than one embryo in each.
//
// What the morphology says, and what each observation became:
//
//   1. A clutch of six large seeds, egg-shaped, pale pink, heaped together,
//      no two quite the same size or tilt. Their coats are cracking.
//   2. One has split at the crown, and what is inside is coming out: the
//      yellow store, and a green shoot. A seed about to become the next thing.
//   3. Fig. 2 is the field note's point. Six sharing one shell has a
//      botanical name — polyembryony. Sow a citrus pip and several seedlings
//      often come up at once, because alongside the one embryo made by
//      fertilisation, the mother's own tissue lining the seed spawns extras
//      that are clones of her. A seed cut open: one embryo from the cross, and
//      beside it the smaller clones crowding the same store.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "exeggcute";
export const no = 102;
const SIZE = 800;

const SEED = { light: "#fdf0f1", base: "#ecced1", deep: "#cfb3b7", shade: "#9f878b", edge: "#957e82" };
const EGG = [[0, 0.3], [0.08, 0.68], [0.25, 0.94], [0.45, 1], [0.65, 0.93], [0.82, 0.72], [0.94, 0.4], [1, 0]];

// A crack in a shell: a hairline that wanders, kinks now and then, and
// forks once. It used to zigzag evenly up and down, and on a pink coat an
// even zigzag reads as stitches.
function crack(org, rand, th0, t0, len) {
  const walk = (th, t, dir, n) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      pts.push(org.surface(th, t, 1.004));
      dir += (rand() - 0.5) * (rand() < 0.3 ? 1.4 : 0.35);
      th += Math.cos(dir) * 0.09;
      t += Math.sin(dir) * 0.035;
    }
    return pts;
  };
  const main = walk(th0, t0, (rand() - 0.5) * 0.6, len);
  const at = Math.floor(len * 0.45);
  const branch = walk(th0 + at * 0.09, t0, 0.9 + rand() * 0.4, Math.floor(len * 0.4));
  const line = (p) => p.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ");
  return line(main) + " " + line([main[at], ...branch.slice(1)]);
}

export function draw() {
  const rand = mulberry32(102);
  const defs = standardDefs(102);
  const out = [];
  contact(out, 330, 758, 250, 20);

  // back to front: the top seed, the middle pair, the front three
  const SEEDS = [
    { x: 332, base: 612, s: 1.0, lean: 0.08, open: true },
    { x: 240, base: 676, s: 1.02, lean: -0.18 },
    { x: 424, base: 680, s: 0.96, lean: 0.2 },
    { x: 150, base: 746, s: 0.98, lean: -0.1, cracks: 1 },
    { x: 322, base: 752, s: 1.06, lean: 0.04, cracks: 2 },
    { x: 494, base: 748, s: 0.94, lean: 0.14 },
  ];
  SEEDS.forEach((S, i) => {
    const org = makeOrgan({ x: S.x, base: S.base, H: 164 * S.s, R: 68 * S.s, tilt: 0.16, bendFrom: 0.1, bendMax: S.lean, knots: EGG });
    const d = paintSolid(org, { id: `s${i}`, outline: hull(org), palette: SEED, defs, out, hatch: 2, ink: 2 });
    // the coat's faint freckling
    for (let k = 0; k < 14; k++) {
      const th = -1.2 + rand() * 2.4, t = 0.15 + rand() * 0.7;
      const [px, py] = org.surface(th, t, 1.003);
      out.push(`<circle cx="${r1(px)}" cy="${r1(py)}" r="${r1(0.8 + rand() * 1.2)}" fill="#c9a8ad" fill-opacity="0.55"/>`);
    }
    for (let c = 0; c < (S.cracks || 0); c++) {
      // a crack runs a long way across the coat before it stops
      const cd = crack(org, rand, -1.0 + c * 0.7, 0.46 + c * 0.16, 10);
      out.push(`<path d="${cd}" fill="none" stroke="#fffaf8" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" transform="translate(0.9 1)" clip-path="url(#s${i}c)"/>`);
      out.push(`<path d="${cd}" fill="none" stroke="${SEED.shade}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#s${i}c)"/>`);
    }
    if (S.open) {
      // split at the crown: a jagged opening, the yellow store, and a shoot
      const lip = [];
      for (let j = 0; j <= 16; j++) {
        const th = -1.35 + (j / 16) * 2.7;
        lip.push(org.surface(th, 0.8 + (j % 2 ? 0.03 + rand() * 0.06 : rand() * 0.02), 1.002));
      }
      // The crown of the shell is gone and the inside shows, within the
      // shell's own outline. Drawn as a shape rising above it, it read as a
      // yellow hat sitting on the seed.
      const [tx, ty] = org.surface(0, 1);
      const open = lip.map(([x, y], j) => `${j ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ") + ` L${r1(lip.at(-1)[0] + 40)},${r1(ty - 60)} L${r1(lip[0][0] - 40)},${r1(ty - 60)} Z`;
      out.push(`<g clip-path="url(#s${i}c)"><path d="${open}" fill="${SEED.light}"/>` +
        `<path d="${open}" fill="#f4d25a" transform="translate(0 7)"/><path d="${open}" fill="#e2b438" filter="url(#wc2)" fill-opacity="0.5" transform="translate(0 10)"/></g>`);
      out.push(`<path d="${lip.map(([x, y], j) => `${j ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ")}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
      const sx = tx + 2, sy = ty - 2;
      out.push(`<path d="M${sx},${sy + 18} C${sx - 2},${sy - 10} ${sx + 4},${sy - 30} ${sx + 2},${sy - 44}" fill="none" stroke="#7fae5a" stroke-width="5" stroke-linecap="round"/>`);
      for (const side of [-1, 1]) {
        out.push(`<path d="M${sx + 2},${sy - 42} C${sx + side * 10},${sy - 62} ${sx + side * 30},${sy - 62} ${sx + side * 34},${sy - 50} C${sx + side * 24},${sy - 44} ${sx + side * 10},${sy - 42} ${sx + 2},${sy - 42} Z" fill="#9ccb72" stroke="${INK}" stroke-width="1.2"/>`);
      }
    }
    void d;
  });

  // ── fig. 2: one seed, cut, with several embryos in it ─────────────────────
  const fx = 690, fy = 690;
  const seed = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    seed.push([fx + Math.cos(a) * 64 * (1 + 0.04 * Math.sin(a * 2)), fy + Math.sin(a) * 50 - (Math.sin(a) < 0 ? 8 * Math.sin(a) : 0)]);
  }
  const sd = smooth(seed, true);
  out.push(`<path d="${sd}" fill="${SEED.deep}"/>`);
  out.push(`<g transform="translate(${fx} ${fy}) scale(0.9 0.86) translate(${-fx} ${-fy})"><path d="${sd}" fill="#fbf2dc"/></g>`);
  // the embryo from the cross: larger, curved, two cotyledons
  const embryo = (x, y, s, rot) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">` +
    `<path d="M-2,14 C-4,4 -2,-6 0,-12" fill="none" stroke="#6f9a50" stroke-width="3.2" stroke-linecap="round"/>` +
    `<path d="M0,-12 C-12,-20 -20,-12 -16,-4 C-10,-4 -4,-8 0,-12 Z" fill="#a8d07e" stroke="${INK}" stroke-width="0.9"/>` +
    `<path d="M0,-12 C12,-20 20,-12 16,-4 C10,-4 4,-8 0,-12 Z" fill="#a8d07e" stroke="${INK}" stroke-width="0.9"/></g>`;
  out.push(embryo(fx - 14, fy + 4, 1.25, -8));
  // and the clones of the mother, smaller, crowding the same store
  out.push(embryo(fx + 24, fy - 8, 0.72, 18));
  out.push(embryo(fx + 30, fy + 22, 0.62, 34));
  out.push(embryo(fx + 6, fy + 28, 0.56, -24));
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  contact(out, fx, fy + 58, 70, 6, 0.22);

  return { size: SIZE, view: [0, 370, SIZE, 418], defs: defs.join("\n"), body: out.join("\n") };
}
