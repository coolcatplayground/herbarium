// NO. 0470 — a leaf, and how long a leaf is meant to last.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the leaf. One large leaf, pale spring green, broad at the
//      middle and drawn to a long point, its margin cut into a few deep
//      irregular notches along one side — the jagged leaf the specimen wears
//      as a tail — and two small upright leaves at its foot, where the stalk
//      comes off the stem.
//   2. The field note's record is scent: the young smell of fresh grass, the
//      old of fallen leaves.
//   3. The note's point is that a leaf's lifespan is the whole strategy, and
//      it is predictable: across thousands of species, a thin, cheap,
//      nitrogen-rich leaf photosynthesises fast and lasts months, and a
//      thick, tough, expensive one runs slow and lasts years — one line
//      through every biome. Fig. 2: the two leaves cut across, the thin and
//      the thick.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "leafeon";
export const no = 470;
const SIZE = 800;
const LEAF = { light: "#e2f2c4", base: "#9ccc7a", deep: "#5e9a4e", shade: "#34642e", edge: "#34642e" };
const SMALL = { light: "#c8e8a8", base: "#6eb05a", deep: "#407e38", shade: "#244e22", edge: "#244e22" };

export function draw() {
  const rand = mulberry32(470);
  const defs = standardDefs(470);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the stem, and the two small upright leaves at the node
  out.push(`<path d="M300,760 C302,730 306,712 310,690" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M300,760 C302,730 306,712 310,690" fill="none" stroke="#8aa45a" stroke-width="7" stroke-linecap="round"/>`);
  for (const [s, a] of [[-1, -2.0], [1, -1.2]]) {
    const b = blade([[310, 692], [310 + Math.cos(a) * 40, 692 + Math.sin(a) * 40], [310 + Math.cos(a) * 90, 692 + Math.sin(a) * 100]], {
      width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.7), sideVeins: 3, rand,
    });
    paintBlade(b, { id: `e${s}`, palette: SMALL, defs, out, shade: s > 0 ? 0.2 : 0, margin: 3 });
  }
  // the leaf: broad, long-pointed, notched deep along one margin
  const lf = blade([[312, 694], [360, 610], [430, 520], [520, 440], [600, 400]], {
    width: (u) => 100 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.85), 0.62), sideVeins: 9, rand,
  });
  const leafFrom = out.length;
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, margin: 8 });
  // the notches: deep V cuts into the upper margin, the paper showing through
  const n = lf.left.length - 1;
  const cuts = [];
  for (const u of [0.3, 0.48, 0.66]) {
    const [ex, ey] = lf.left[Math.round(u * n)];
    const [px, py] = lf.spine[Math.round(u * (lf.spine.length - 1))];
    const [ax, ay] = lf.left[Math.round((u - 0.05) * n)], [bx, by] = lf.left[Math.round((u + 0.05) * n)];
    const d = 0.55;
    cuts.push(`M${r1(ax)},${r1(ay)} L${r1(ex + (px - ex) * d)},${r1(ey + (py - ey) * d)} L${r1(bx)},${r1(by)} Z`);
  }
  defs.push(`<mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#fff"/><path d="${cuts.join(" ")}" fill="#000"/></mask>`);
  out.push(`<g mask="url(#cut)">${out.splice(leafFrom).join("")}</g>`);
  out.push(`<path d="${cuts.join(" ")}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round" clip-path="url(#lfclip)"/>`);
  defs.push(`<clipPath id="lfclip"><path d="${lf.d}"/></clipPath>`);

  // ── fig. 2: a thin leaf and a thick one, cut across ───────────────────────
  const section = (x, y, w, t, fill, cells) => {
    out.push(`<path d="M${x - w},${y} C${x - w * 0.5},${y - t} ${x + w * 0.5},${y - t} ${x + w},${y} C${x + w * 0.5},${y + t * 0.6} ${x - w * 0.5},${y + t * 0.6} ${x - w},${y} Z" fill="${fill}" stroke="${INK}" stroke-width="1.4"/>`);
    const c = [];
    for (let k = 0; k < cells; k++) c.push(`<circle cx="${r1(x - w * 0.7 + (k / (cells - 1)) * w * 1.4)}" cy="${r1(y - t * 0.2)}" r="${r1(t * 0.22)}" fill="none" stroke="#2e5a26" stroke-width="0.8"/>`);
    out.push(c.join(""));
  };
  // the leaves themselves above their sections
  const small = (x, y, w, pal, id) => {
    const b = blade([[x - w, y], [x, y - 8], [x + w, y]], { width: (u) => (w / 3) * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), sideVeins: 2, rand });
    paintBlade(b, { id, palette: pal, defs, out, margin: 2, ink: 1.1 });
  };
  small(636, 660, 50, LEAF, "thin");
  small(744, 660, 34, { light: "#8aa86a", base: "#3e6a36", deep: "#23461f", shade: "#142a12", edge: "#142a12" }, "thick");
  section(636, 730, 52, 10, "#dcefc0", 7);
  section(744, 730, 40, 30, "#6e9454", 5);
  contact(out, 690, 760, 100, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
