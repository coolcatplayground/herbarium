// NO. 0787 — a temple tree's seed, and the tree that temples kept alive.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the pod of a sterculia, a sacred-grove tree — a star of
//      woody follicles on one stalk, each split open along its seam into a
//      boat, scarlet inside, lined with black seeds on golden arils. The red,
//      black and gold the specimen is painted in. (Drawn as two hinged valves
//      edged with a row of pale points, it read as a pair of jaws.)
//   2. The field note files it with sacred and totemic trees, whose record is
//      power over growing things.
//   3. The note's point is that one tree owes its survival to being planted
//      at temples. Ginkgo has no close living relatives, no wild population
//      anyone is sure of, and a fossil record of well over a hundred million
//      years — and it came through the last few thousand largely because
//      monasteries grew it. Fig. 2: a ginkgo leaf, fan-shaped, notched, its
//      veins forking and forking again.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "tapu-bulu";
export const no = 787;
const SIZE = 800;

// a follicle: one boat-shaped woody valve lying open, scarlet within, the
// black seeds set along its seam
function follicle(out, defs, id, x, y, a, L, W, rand) {
  const ca = Math.cos(a), sa = Math.sin(a), T = (u, v) => [x + ca * u - sa * v, y + sa * u + ca * v];
  const outer = [], inner = [];
  for (let j = 0; j <= 20; j++) {
    const u = j / 20, w = W * Math.sin(Math.PI * u) ** 0.7;
    outer.push(T(L * u, w));
    inner.push(T(L * u, -w * 0.9));
  }
  const d = smooth([...outer, ...[...inner].reverse()], true);
  defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r1(T(0, W)[0])}" y1="${r1(T(0, W)[1])}" x2="${r1(T(0, -W)[0])}" y2="${r1(T(0, -W)[1])}"><stop offset="0" stop-color="#7a2a1e"/><stop offset="0.5" stop-color="#b8342a"/><stop offset="1" stop-color="#e8584a"/></linearGradient>`);
  out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  // the woody outer rim, brown, along one side
  out.push(`<path d="${smooth(outer)}" fill="none" stroke="#6e3a24" stroke-width="7" stroke-opacity="0.8"/>`);
  // the seeds along the seam, glossy black, each with a golden aril
  for (let k = 1; k < 7; k++) {
    const [sx, sy] = T(L * (0.15 + k * 0.11), -W * 0.2);
    out.push(`<ellipse cx="${r1(sx)}" cy="${r1(sy)}" rx="8" ry="6" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(sx)} ${r1(sy)})" fill="#1e1814" stroke="${INK}" stroke-width="0.8"/><circle cx="${r1(sx + ca * 6)}" cy="${r1(sy + sa * 6)}" r="3.4" fill="#e8c43a"/>`);
  }
  void rand;
}

export function draw() {
  const rand = mulberry32(787);
  const defs = standardDefs(787);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the stalk, and the pod at its end: its follicles spread open in a star,
  // lying on the ground
  const hub = [320, 700];
  out.push(`<path d="M150,750 C220,740 280,720 ${hub[0]},${hub[1]}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M150,750 C220,740 280,720 ${hub[0]},${hub[1]}" fill="none" stroke="#5a4a3a" stroke-width="7" stroke-linecap="round"/>`);
  [[-2.7, 170], [-0.44, 180], [-1.6, 150], [-1.0, 170], [-2.1, 160]].forEach(([a, L], i) => follicle(out, defs, `f${i}`, hub[0], hub[1], a, L, 34, rand));
  out.push(`<circle cx="${hub[0]}" cy="${hub[1]}" r="14" fill="#6e3a24" stroke="${INK}" stroke-width="1.4"/>`);

  // ── fig. 2: a ginkgo leaf, veins forking again and again ──────────────────
  const fx = 690, fy = 720;
  const fan = `M${fx},${fy} L${fx - 88},${fy - 110} C${fx - 60},${fy - 150} ${fx - 10},${fy - 156} ${fx - 4},${fy - 130} L${fx},${fy - 118} L${fx + 4},${fy - 130} C${fx + 10},${fy - 156} ${fx + 60},${fy - 150} ${fx + 88},${fy - 110} Z`;
  out.push(`<path d="${fan}" fill="#e8c84a" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
  const v = [];
  const fork = (x, y, a, len, depth) => {
    const x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len;
    v.push(`M${r1(x)},${r1(y)} L${r1(x1)},${r1(y1)}`);
    if (depth > 0) { fork(x1, y1, a - 0.14, len * 0.9, depth - 1); fork(x1, y1, a + 0.14, len * 0.9, depth - 1); }
  };
  fork(fx, fy, -Math.PI / 2 - 0.34, 34, 3);
  fork(fx, fy, -Math.PI / 2 + 0.34, 34, 3);
  out.push(`<path d="${v.join(" ")}" stroke="#b8942a" stroke-width="1"/>`);
  out.push(`<path d="M${fx},${fy} L${fx + 2},${fy + 40}" stroke="${INK}" stroke-width="4"/><path d="M${fx},${fy} L${fx + 2},${fy + 40}" stroke="#a88a3a" stroke-width="2.4"/>`);
  contact(out, fx, fy + 42, 70, 5, 0.18);

  return { size: SIZE, view: [0, 480, SIZE, 310], defs: defs.join("\n"), body: out.join("\n") };
}
