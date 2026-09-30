// NO. 0153 — a bitten leaf, and the message in its scent.
//
// What the morphology says, and what each observation became:
//
//   1. Two parts, and only two. The first is the great leaf: broad,
//      sickle-shaped, rising from a base still rolled into a narrow scroll
//      and sweeping up and back to a point.
//   2. A bite is out of its inner edge — a clean round notch, rimmed brown
//      where the cut edge has dried.
//   3. The second part: round its foot, a few leaf-sprouts still rolled
//      lengthwise, dark and narrow, standing out like a collar.
//   4. Scent, drawn as it is in old plates: faint wisps rising from the
//      sprouts. The field note files it with bay laurel.
//   5. Fig. 2 is what the scent is for, and why the bite matters. A leaf being
//      chewed releases a blend specific to what is chewing it, and parasitic
//      wasps follow that blend to the caterpillar. The plant cannot remove
//      the animal itself, so it publishes its position to something that can.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "bayleef";
export const no = 153;
const SIZE = 800;
const OLIVE = { light: "#dbe6b4", base: "#a5c27e", deep: "#6b834c", shade: "#445432", edge: "#4a5a36" };
const LEAF = { light: "#d3e8a8", base: "#9cc46e", deep: "#62893f", shade: "#3c5a26", edge: "#3e5c2a" };
const BUD = { light: "#9fc27a", base: "#5f8a46", deep: "#40653a", shade: "#2a4526", edge: "#2a4526" };

function wisp(out, x, y, h, rand) {
  const pts = [];
  for (let k = 0; k <= 8; k++) pts.push([x + Math.sin(k * 1.3 + rand() * 0.5) * 9, y - (h * k) / 8]);
  out.push(`<path d="${smooth(pts)}" fill="none" stroke="#9fb07c" stroke-width="1.6" stroke-dasharray="7 5" stroke-linecap="round" stroke-opacity="0.8"/>`);
}

export function draw() {
  const rand = mulberry32(153);
  const defs = standardDefs(153);
  const out = [];
  const nx = 304, ny = 738;
  contact(out, nx, 754, 130, 14);

  // the rolled sprouts, standing out round the foot of the leaf
  const sprouts = [];
  for (let k = 0; k < 7; k++) sprouts.push({ a: (k / 7) * Math.PI * 2 + 0.35, e: k % 2 ? 0.95 : 0.6 });
  const sprout = ({ a, e }, i) => {
    const len = 96 - Math.abs(Math.sin(a)) * 18;
    const dx = Math.cos(a) * Math.cos(e), dy = -Math.sin(e) + Math.sin(a) * Math.cos(e) * 0.4;
    const x0 = nx + Math.cos(a) * 12, y0 = ny + Math.sin(a) * 4;
    const pts = [[x0, y0], [x0 + dx * len * 0.4, y0 + dy * len * 0.4], [x0 + dx * len * 0.8, y0 + dy * len * 0.8 - 2], [x0 + dx * len * 1.02, y0 + dy * len + 4]];
    const b = blade(pts, { width: (u) => 12 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.75), 0.7) + 1.2, rand });
    paintBlade(b, { id: `sp${i}`, palette: BUD, defs, out, shade: Math.sin(a) < 0 ? 0.35 : 0, margin: 3, ink: 1.3, veinOpacity: 0.25 });
    // the rolled margin, one pale line down its length
    const n = b.spine.length - 1;
    out.push(`<path d="${smooth(b.left.slice(24, 230).map(([x, y], j) => { const [px, py] = b.spine[Math.round(((24 + j) / b.left.length) * n)]; return [px + (x - px) * 0.45, py + (y - py) * 0.45]; }))}" fill="none" stroke="${BUD.light}" stroke-width="1.4" stroke-opacity="0.8"/>`);
  };
  sprouts.filter(({ a }) => Math.sin(a) < 0).forEach((w, i) => sprout(w, i));

  // the leaf: its base rolled into a narrow scroll, then a broad sickle
  // sweeping up and back to a point
  const ROLL = 0.2;
  const spine = [[nx, ny + 2], [nx + 4, ny - 50], [nx + 16, ny - 104], [nx + 44, ny - 176], [nx + 62, ny - 262], [nx + 50, ny - 340], [nx + 12, ny - 394], [nx - 50, ny - 420], [nx - 118, ny - 404]];
  const leaf = blade(spine, {
    width: (u) => {
      if (u < ROLL) return 11 + u * 16;
      const v = (u - ROLL) / (1 - ROLL);
      return 14.2 * (1 - v) ** 2 + 50 * Math.pow(Math.sin(Math.PI * Math.min(1, v * 0.98 + 0.02) ** 0.62), 0.95) * Math.min(1, v * 6);
    }, sideVeins: 10, rand,
  });
  // the bite: a round notch out of the inner (concave) edge
  const fr = leaf.frames[Math.round(0.56 * (leaf.frames.length - 1))];
  const w = 14.2 * 0.45 ** 2 + 50 * Math.pow(Math.sin(Math.PI * Math.min(1, ((0.56 - ROLL) / (1 - ROLL)) * 0.98 + 0.02) ** 0.62), 0.95);
  const mid = [nx - 10, ny - 300];
  const side = [1, -1].map((sg) => [fr.p[0] + fr.n[0] * w * sg, fr.p[1] + fr.n[1] * w * sg, sg])
    .sort((p, q) => Math.hypot(p[0] - mid[0], p[1] - mid[1]) - Math.hypot(q[0] - mid[0], q[1] - mid[1]))[0];
  const BR = 24;
  const bc = [side[0] + fr.n[0] * side[2] * BR * 0.35, side[1] + fr.n[1] * side[2] * BR * 0.35];
  defs.push(`<mask id="bite" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#fff"/><circle cx="${r1(bc[0])}" cy="${r1(bc[1])}" r="${BR}" fill="#000"/></mask>`);
  defs.push(`<clipPath id="leafc"><path d="${leaf.d}"/></clipPath>`);
  const leafFrom = out.length;
  paintBlade(leaf, { id: "top", palette: LEAF, defs, out, shade: 0.05, margin: 7 });
  // the scroll: the margin wound round it, a few turns
  const n = leaf.spine.length - 1;
  for (let k = 0; k < 4; k++) {
    const u0 = 0.03 + k * 0.045;
    const [ax, ay] = leaf.left[Math.round(u0 * n)], [bx, by] = leaf.right[Math.round((u0 + 0.035) * n)];
    out.push(`<path d="M${r1(ax)},${r1(ay)} Q${r1((ax + bx) / 2 + 3)},${r1((ay + by) / 2 + 5)} ${r1(bx)},${r1(by)}" fill="none" stroke="${LEAF.shade}" stroke-width="1.2" stroke-opacity="0.7"/>`);
  }
  // the cut edge of the bite, dried brown, then inked
  out.push(`<circle cx="${r1(bc[0])}" cy="${r1(bc[1])}" r="${BR + 2.5}" fill="none" stroke="#a88a4a" stroke-width="5" clip-path="url(#leafc)"/>`);
  out.push(`<g mask="url(#bite)">${out.splice(leafFrom).join("\n")}</g>`);
  out.push(`<circle cx="${r1(bc[0])}" cy="${r1(bc[1])}" r="${BR}" fill="none" stroke="${INK}" stroke-width="1.8" clip-path="url(#leafc)"/>`);

  sprouts.filter(({ a }) => Math.sin(a) >= 0).forEach((w2, i) => sprout(w2, i + 20));
  wisp(out, nx - 86, ny - 90, 80, rand);
  wisp(out, nx + 100, ny - 100, 70, rand);

  // ── fig. 2: chewed, and calling for help ──────────────────────────────────
  const fx = 680, fy = 700;
  const figFrom = out.length;
  const lf = blade([[fx - 80, fy + 40], [fx - 20, fy + 10], [fx + 40, fy - 10], [fx + 90, fy - 40]], {
    width: (u) => 36 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96)), 0.7), sideVeins: 5, rand,
  });
  paintBlade(lf, { id: "fl", palette: OLIVE, defs, out, margin: 4, ink: 1.4 });
  // bites out of its edge
  for (const u of [0.42, 0.56]) {
    const [x, y] = lf.left[Math.round(u * (lf.left.length - 1))];
    out.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="11" fill="#f2ede0" fill-opacity="0"/><path d="M${r1(x - 10)},${r1(y + 2)} A10,10 0 0,1 ${r1(x + 10)},${r1(y - 2)}" fill="#f5f0e4" stroke="${INK}" stroke-width="1.1"/>`);
  }
  // the caterpillar at the bite
  const [cx0, cy0] = lf.left[Math.round(0.5 * (lf.left.length - 1))];
  for (let k = 7; k >= 0; k--) out.push(`<circle cx="${r1(cx0 - 30 + k * 8)}" cy="${r1(cy0 + 8 - Math.sin(k * 0.8) * 4)}" r="${k === 7 ? 6 : 5.4}" fill="${k === 7 ? "#6c8a3a" : "#9bbf5a"}" stroke="${INK}" stroke-width="0.9"/>`);
  // the wasp, coming in on the scent
  const wx = fx + 70, wy = fy - 110;
  out.push(`<path d="M${wx - 16},${wy + 2} C${wx - 8},${wy - 3} ${wx + 8},${wy - 3} ${wx + 14},${wy + 1} C${wx + 8},${wy + 5} ${wx - 8},${wy + 5} ${wx - 16},${wy + 2} Z" fill="#2e2418"/>`);
  out.push(`<ellipse cx="${wx - 2}" cy="${wy - 9}" rx="11" ry="5" transform="rotate(-18 ${wx - 2} ${wy - 9})" fill="#e8eef0" fill-opacity="0.8" stroke="${INK}" stroke-width="0.8"/>`);
  out.push(`<path d="M${wx + 14},${wy + 1} l8,4 M${wx - 16},${wy + 2} l-10,6 l2,4" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
  wisp(out, fx - 10, fy - 20, 70, rand);
  wisp(out, fx + 20, fy - 30, 60, rand);
  contact(out, fx, fy + 60, 90, 6, 0.2);
  // scaled about its right end, so it grows into the room on the left
  out.push(`<g transform="translate(${fx + 96} ${fy + 60}) scale(1.3) translate(${-(fx + 96)} ${-(fy + 60)})">${out.splice(figFrom).join("\n")}</g>`);

  return { size: SIZE, view: [0, 250, SIZE, 536], defs: defs.join("\n"), body: out.join("\n") };
}
