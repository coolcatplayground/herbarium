// NO. 0182 — two flowers, and which way they face.
//
// What the morphology says, and what each observation became:
//
//   1. Two red flowers, side by side on their stalks, each turned a little
//      away from the other: five broad, rounded petals, and at the centre a
//      short yellow trumpet, its throat olive. (Drawn first with many thin
//      notched petals round a dark eye, they were a gerbera, not this.)
//   2. And a little of the leaves: four broad pointed ones in a low rosette
//      at the foot, arching out and down, green in front and gold behind —
//      the two tones of the plant. A full ring of them was drawn first;
//      flared round the stalks it read as a skirt, and the plant as a dancer.
//   3. The field note's point is heliotropism, and the usual mistake about
//      it: a sunflower head does not follow the sun once it is grown. The
//      tracking happens while the stem is still elongating — the shaded side
//      growing faster through the day, the lit side catching up at night —
//      and when growth stops the head stays fixed facing east, where it warms
//      fastest in the morning and draws more pollinators. Fig. 2 is a day of
//      that tracking: east at dawn, up at noon, west by evening.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "bellossom";
export const no = 182;
const SIZE = 800;
const RED = { light: "#f6a07a", base: "#e65f3c", deep: "#c2432a", shade: "#7a2a1e", edge: "#7a2a1e" };
const GREEN = { light: "#a9c98e", base: "#659568", deep: "#3f6a47", shade: "#27472e", edge: "#27472e" };
const GOLD = { light: "#f8e8a8", base: "#ecd07a", deep: "#c4a44a", shade: "#8a702e", edge: "#8a702e" };

// A flower of five broad, rounded petals round a short yellow trumpet, seen a
// little from the side: `turn` narrows it across and shifts the trumpet's
// throat toward the side it faces.
function flower(out, defs, id, cx, cy, R, turn, rand, n = 5) {
  const kx = Math.cos(turn), ky = 0.9;
  const P = (a, r, v = 0) => [cx + (Math.cos(a) * r - Math.sin(a) * v) * kx, cy + (Math.sin(a) * r + Math.cos(a) * v) * ky];
  const W = R * 0.56, r0 = R * 0.1;
  const petals = [];
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + (k / n) * Math.PI * 2 + (rand() - 0.5) * 0.08;
    const w = (u) => Math.pow(u, 0.5) * Math.sqrt(Math.max(0, 1 - u ** 6)) * (1 + 0.04 * Math.sin(u * 20 + k));
    const us = [];
    for (let j = 0; j <= 18; j++) us.push(j / 18);
    const pts = [...us.map((u) => P(a, r0 + u * (R - r0), W * w(u))), ...us.slice(1, -1).reverse().map((u) => P(a, r0 + u * (R - r0), -W * w(u)))];
    petals.push({ d: smooth(pts, true), a });
  }
  defs.push(`<radialGradient id="${id}g" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${R}"><stop offset="0.15" stop-color="${RED.deep}"/><stop offset="0.6" stop-color="${RED.base}"/><stop offset="1" stop-color="${RED.light}"/></radialGradient>`);
  // each petal laps the next, round the flower
  for (const { d, a } of petals) {
    out.push(`<path d="${d}" fill="${RED.base}"/><path d="${d}" fill="url(#${id}g)" filter="url(#wc)"/>`);
    const [x0, y0] = P(a, R * 0.24), [x1, y1] = P(a, R * 0.8);
    out.push(`<path d="M${r1(x0)},${r1(y0)} L${r1(x1)},${r1(y1)}" stroke="${RED.shade}" stroke-width="1" stroke-opacity="0.3"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round" filter="url(#pen)"/>`);
  }
  // the trumpet: a yellow rim, and the olive throat inside it, set toward
  // the side the flower faces
  const tr = R * 0.3, sh = Math.sin(turn) * R * 0.07;
  out.push(`<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(tr * kx)}" ry="${r1(tr * ky)}" fill="${GOLD.base}" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<ellipse cx="${r1(cx - tr * 0.18 * kx)}" cy="${r1(cy - tr * 0.22)}" rx="${r1(tr * 0.5 * kx)}" ry="${r1(tr * 0.3)}" fill="${GOLD.light}" fill-opacity="0.7"/>`);
  out.push(`<ellipse cx="${r1(cx + sh)}" cy="${r1(cy + 1)}" rx="${r1(tr * 0.56 * kx)}" ry="${r1(tr * 0.56 * ky)}" fill="#7e7428" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<ellipse cx="${r1(cx + sh * 1.6)}" cy="${r1(cy + 3)}" rx="${r1(tr * 0.3 * kx)}" ry="${r1(tr * 0.3 * ky)}" fill="#5a5220"/>`);
}

export function draw() {
  const rand = mulberry32(182);
  const defs = standardDefs(182);
  const out = [];
  const bx = 322, by = 744;
  contact(out, bx, 754, 190, 14);

  // the two stalks, from one foot
  const F1 = [270, 470], F2 = [382, 458];
  for (const [x2, y2] of [F1, F2]) {
    const d = `M${bx},${by - 20} C${bx + (x2 - bx) * 0.1},${by - 130} ${x2 + (bx - x2) * 0.2},${y2 + 140} ${x2},${y2}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#7fa65e" stroke-width="6" stroke-linecap="round"/>`);
  }

  // four broad leaves in a low rosette, arching out and down: gold behind,
  // green in front
  const LEAVES = [
    [GOLD, -1, 176, 70], [GOLD, 1, 176, 70],
    [GREEN, -1, 150, 40], [GREEN, 1, 150, 40],
  ];
  LEAVES.forEach(([pal, side, L, rise], i) => {
    const pts = [[bx, by - 4], [bx + side * L * 0.3, by - rise * 0.9], [bx + side * L * 0.66, by - rise], [bx + side * L, by - rise * 0.3]];
    const lf = blade(pts, { width: (u) => 46 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.72), 0.8), sideVeins: 5, rand });
    paintBlade(lf, { id: `lf${i}`, palette: pal, defs, out, shade: i < 2 ? 0.2 : 0, margin: 5 });
  });

  flower(out, defs, "fa", F1[0], F1[1], 94, -0.4, rand);
  flower(out, defs, "fb", F2[0], F2[1], 90, 0.4, rand);

  // ── fig. 2: a day of tracking ─────────────────────────────────────────────
  const fx = 662, fy = 720;
  out.push(`<path d="M${fx - 80},${fy - 110} Q${fx},${fy - 190} ${fx + 80},${fy - 110}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.7"/>`);
  out.push(`<circle cx="${fx}" cy="${fy - 150}" r="10" fill="#f2cf3e" stroke="${INK}" stroke-width="1.2"/>`);
  for (const [dx, lean] of [[-56, -0.7], [0, 0], [56, 0.7]]) {
    const bx = fx + dx, by = fy;
    const hx = bx + Math.sin(lean) * 60, hy = by - Math.cos(lean) * 60;
    out.push(`<path d="M${bx},${by} Q${bx + Math.sin(lean) * 14},${by - 36} ${r1(hx)},${r1(hy)}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M${bx},${by} Q${bx + Math.sin(lean) * 14},${by - 36} ${r1(hx)},${r1(hy)}" fill="none" stroke="#7fa65e" stroke-width="2.4" stroke-linecap="round"/>`);
    out.push(`<ellipse cx="${r1(hx + Math.sin(lean) * 8)}" cy="${r1(hy - Math.cos(lean) * 8)}" rx="16" ry="9" transform="rotate(${r1((lean * 180) / Math.PI)} ${r1(hx + Math.sin(lean) * 8)} ${r1(hy - Math.cos(lean) * 8)})" fill="${RED.base}" stroke="${INK}" stroke-width="1.2"/>`);
  }
  contact(out, fx, fy + 6, 90, 6, 0.2);

  return { size: SIZE, view: [0, 330, SIZE, 456], defs: defs.join("\n"), body: out.join("\n") };
}
