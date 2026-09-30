// NO. 0274 — the acorn, sprouted, and the leaf it carries up.
//
// What the morphology says, and what each observation became:
//
//   1. One part, taken from the top: the single long leaf, pointed, pale
//      midrib, swept back from where it grows. The field note files the
//      specimen as a sprouting acorn, so the leaf is shown on the shoot that
//      carries it, up out of the split acorn lying at its foot.
//   2. The shoot is bare and brown-green below the leaf: a seedling oak spends
//      its first weeks as one stem and one leaf at the top.
//   3. The field note's point is that one bud at the top runs the whole
//      plant, by suppression — auxin coming down from the tip holds the buds
//      below it dormant, which is why a plant left alone makes a single
//      leader and pinching the leader out makes it bush. Fig. 2: two
//      saplings. One left alone, one leader; one with its tip taken off, and
//      the two buds below it grown out and turned up to replace it.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "nuzleaf";
export const no = 274;
const SIZE = 800;
const NUT = { light: "#d8a870", base: "#a8703e", deep: "#7a4c26", shade: "#4a2c14" };
const LEAF = { light: "#b9e09a", base: "#5fae4e", deep: "#3a7e36", shade: "#23522a", edge: "#23522a" };
const SHOOT = "#8a7a4e";

// a stem, ink under colour
function stem(out, d, w, colour = SHOOT) {
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(w + 3)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${colour}" stroke-width="${r1(w)}" stroke-linecap="round"/>`);
}

export function draw() {
  const rand = mulberry32(274);
  const defs = standardDefs(274);
  const out = [];
  contact(out, 330, 758, 190, 14);

  // the acorn, lying on its side and split at the point
  const ax = 300, ay = 722;
  defs.push(`<radialGradient id="nut" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${NUT.light}"/><stop offset="0.55" stop-color="${NUT.base}"/><stop offset="1" stop-color="${NUT.deep}"/></radialGradient>`);
  // its first root, turning down into the ground
  stem(out, `M${ax + 70},${ay + 6} C${ax + 92},${ay + 16} ${ax + 98},${ay + 30} ${ax + 104},${ay + 36}`, 6, "#efe4c8");
  out.push(`<g transform="rotate(-12 ${ax} ${ay})"><path d="M${ax - 78},${ay} C${ax - 78},${ay - 44} ${ax + 20},${ay - 50} ${ax + 76},${ay - 6} L${ax + 84},${ay + 2} L${ax + 76},${ay + 8} C${ax + 20},${ay + 50} ${ax - 78},${ay + 44} ${ax - 78},${ay} Z" fill="url(#nut)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>` +
    `<path d="M${ax - 40},${ay - 30} C${ax},${ay - 38} ${ax + 40},${ay - 30} ${ax + 70},${ay - 8}" fill="none" stroke="${NUT.light}" stroke-width="4" stroke-opacity="0.6"/>` +
    `<path d="M${ax + 50},${ay - 20} L${ax + 62},${ay - 2} L${ax + 52},${ay + 16}" fill="none" stroke="${INK}" stroke-width="1.4"/></g>`);
  // the shoot, up out of the split, arching a little
  const sx = ax + 74, sy = ay - 20;
  const shoot = [[sx, sy], [sx + 6, sy - 90], [sx - 6, sy - 200], [sx + 10, sy - 300], [sx + 30, sy - 364]];
  stem(out, smooth(shoot), 7);
  // two dormant buds on the way up
  for (const [bx, by] of [[sx + 2, sy - 130], [sx - 2, sy - 240]]) out.push(`<ellipse cx="${bx + 6}" cy="${by}" rx="5" ry="7" transform="rotate(30 ${bx + 6} ${by})" fill="#7c6a3e" stroke="${INK}" stroke-width="1"/>`);
  // the leaf at the top: long, pointed, swept back
  const [lx, ly] = shoot.at(-1);
  const leaf = blade([[lx, ly], [lx + 50, ly - 40], [lx + 120, ly - 60], [lx + 200, ly - 58], [lx + 270, ly - 36]], {
    width: (u) => 40 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.8), 0.72), sideVeins: 9, rand,
  });
  paintBlade(leaf, { id: "lf", palette: LEAF, defs, out, margin: 6 });

  // ── fig. 2: a leader left alone, and one taken off ─────────────────────────
  const sapling = (x, cut) => {
    const g = 760;
    const top = cut ? g - 150 : g - 200;
    stem(out, `M${x},${g} L${x},${top}`, 4.4);
    const leaves = [];
    const pair = (y, len, up) => {
      for (const side of [-1, 1]) leaves.push([[x, y], [x + side * len * 0.5, y - up * 0.6], [x + side * len, y - up]]);
    };
    if (cut) {
      // the cut, and the two buds below it grown into new leaders
      out.push(`<path d="M${x - 5},${top} L${x + 5},${top - 3}" stroke="${INK}" stroke-width="2"/>`);
      for (const side of [-1, 1]) {
        const d = `M${x},${top + 16} C${x + side * 20},${top + 6} ${x + side * 26},${top - 20} ${x + side * 24},${top - 60}`;
        stem(out, d, 3.4);
        leaves.push([[x + side * 24, top - 60], [x + side * 30, top - 76], [x + side * 26, top - 92]]);
      }
      pair(g - 70, 34, 16);
    } else {
      leaves.push([[x, top], [x + 4, top - 18], [x, top - 34]]);
      pair(g - 70, 22, 8);
      pair(g - 130, 22, 8);
    }
    leaves.forEach((pts, i) => {
      const b = blade(pts, { width: (u) => 7 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 0.6, rand });
      paintBlade(b, { id: `s${x}${i}`, palette: LEAF, defs, out, margin: 1.5, midrib: false, ink: 1 });
    });
  };
  sapling(630, false);
  sapling(730, true);
  contact(out, 680, 764, 90, 6, 0.2);

  return { size: SIZE, view: [0, 226, SIZE, 564], defs: defs.join("\n"), body: out.join("\n") };
}
