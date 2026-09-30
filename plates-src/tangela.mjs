// NO. 0114 — the tangle, and the search it is.
//
// What the morphology says, and what each observation became:
//
//   1. A ball of twining stems, blue, looped over and under each other until
//      there is no telling where any one begins. Drawn flat and matte, like
//      the strap-shaped stems they are, dense enough that the ball is solid
//      and the far ones only a little darker. A first version drew them as
//      glossy round tubes over a black core, and the ball read as innards.
//   2. Free shoot tips still reaching out of it, and curling as they go. The
//      field note's point is that a climbing tip does not grow straight: it
//      sweeps a slow circle as it extends, feeling for contact. A tangle is a
//      search pattern that has run out of things to find.
//   3. Touch is what stops the search. One tendril has found a stake and
//      coiled round it. (Two red pads under the ball, for the sprite's feet,
//      were tried and taken out: under a ball they read as a creature's feet.)
//   4. Fig. 2 is how that was first seen: Darwin traced a shoot tip's
//      movement on a glass plate, dot by dot, and the trace came out as loops
//      — circumnutation.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "tangela";
export const no = 114;
const SIZE = 800;
const VINE = { light: "#b9d5e8", base: "#6f9dc0", deep: "#4f7aa0", shade: "#3e6488" };
const BLUES = ["#6f9dc0", "#7aa6c6", "#6391b6", "#82acca"];

// a stem as a flat strap: ink, a matte body, and a fine line down its middle
function tube(out, d, w, shade = 0, k = 0) {
  const body = shade ? VINE.deep : BLUES[k % BLUES.length];
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(w + 2.2)}" stroke-linecap="round"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${body}" stroke-width="${r1(w)}" stroke-linecap="round"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${shade ? VINE.shade : VINE.light}" stroke-width="0.9" stroke-linecap="round" stroke-opacity="0.7"/>`);
}

export function draw() {
  const rand = mulberry32(114);
  const defs = standardDefs(114);
  const out = [];
  const C = { x: 320, y: 556, R: 176 };
  contact(out, C.x, 748, 200, 18);

  // the stake the one tendril has found
  const sx = 560;
  out.push(`<path d="M${sx - 5},752 L${sx - 4},300 L${sx + 4},300 L${sx + 5},752 Z" fill="#c9a86a" stroke="${INK}" stroke-width="1.4"/>`);
  for (let y = 330; y < 740; y += 70) out.push(`<path d="M${sx - 5},${y} L${sx + 5},${y + 2}" stroke="#8d7040" stroke-width="1.4"/>`);

  // loops of stem over a sphere: great-circle arcs at random, far ones first
  const unit = () => { const z = rand() * 2 - 1, t = rand() * Math.PI * 2, s = Math.sqrt(1 - z * z); return [s * Math.cos(t), s * Math.sin(t), z]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
  const arcs = [];
  for (let i = 0; i < 72; i++) {
    const n = unit(), u = norm(cross(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), v = cross(n, u);
    const shell = C.R * (0.72 + rand() * 0.28), start = rand() * Math.PI * 2, span = 1.3 + rand() * 1.6;
    const pts = [];
    let depth = 0;
    for (let k = 0; k <= 16; k++) {
      const th = start + (span * k) / 16;
      const p = [0, 1, 2].map((j) => shell * (Math.cos(th) * u[j] + Math.sin(th) * v[j]));
      depth += p[2];
      pts.push([C.x + p[0], C.y + p[1] * 0.92]);
    }
    arcs.push({ d: smooth(pts), depth: depth / 17, w: 8 + rand() * 4 });
  }
  arcs.sort((a, b) => a.depth - b.depth);
  // a blue core behind everything, so gaps read as more stems, not as holes
  out.push(`<ellipse cx="${C.x}" cy="${C.y}" rx="${C.R * 0.88}" ry="${C.R * 0.82}" fill="${VINE.shade}"/>`);
  arcs.forEach((a, i) => tube(out, a.d, a.w, a.depth < -C.R * 0.25 ? 1 : 0, i));

  // free shoot tips, searching: each ends in a curl
  const tip = (x0, y0, a0, L, curl) => {
    const pts = [[x0, y0]];
    let a = a0;
    for (let k = 1; k <= 14; k++) {
      a += (k > 7 ? curl : curl * 0.2);
      pts.push([pts.at(-1)[0] + Math.cos(a) * (L / 14) * (1 - k / 22), pts.at(-1)[1] + Math.sin(a) * (L / 14) * (1 - k / 22)]);
    }
    return smooth(pts);
  };
  [[C.x - 150, C.y - 90, -2.4, 150, 0.32], [C.x - 40, C.y - 168, -1.7, 130, -0.34], [C.x + 110, C.y - 130, -0.9, 140, 0.3], [C.x - 170, C.y + 40, 3.0, 110, -0.36]]
    .forEach(([x, y, a, L, c]) => tube(out, tip(x, y, a, L, c), 5.5));
  // the one that found the stake, coiled round it
  const coil = [[C.x + 150, C.y - 40], [sx - 40, C.y - 90], [sx - 6, C.y - 120]];
  for (let k = 0; k < 18; k++) {
    const y = C.y - 128 - k * 9;
    coil.push([sx + (k % 2 ? 11 : -11), y]);
  }
  const coilD = smooth(coil);
  tube(out, coilD, 5.5);
  // the stake, over the back of each turn
  for (let k = 1; k < 18; k += 2) {
    const y = C.y - 128 - k * 9;
    out.push(`<rect x="${sx - 4}" y="${y - 6}" width="8" height="10" fill="#c9a86a"/>`);
  }

  // ── fig. 2: the trace on the glass ────────────────────────────────────────
  const gx = 650, gy = 690;
  out.push(`<path d="M${gx - 80},${gy + 50} L${gx + 70},${gy + 50} L${gx + 100},${gy - 30} L${gx - 50},${gy - 30} Z" fill="#e8f1f2" fill-opacity="0.7" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="M${gx - 42},${gy - 24} L${gx + 90},${gy - 24}" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>`);
  const dots = [];
  let px = gx - 40, py = gy + 20;
  for (let k = 0; k < 34; k++) {
    const a = k * 0.62, rr = 16 + 6 * Math.sin(k * 0.31);
    const x = gx - 30 + k * 2.4 + Math.cos(a) * rr, y = gy + 8 + Math.sin(a) * rr * 0.55;
    dots.push([x, y]);
    px = x; py = y;
  }
  out.push(`<path d="${dots.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ")}" fill="none" stroke="${INK}" stroke-width="0.9" stroke-opacity="0.8"/>`);
  out.push(dots.map(([x, y]) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="1.8" fill="${INK}"/>`).join(""));
  out.push(`<path d="M${r1(px)},${r1(py)} l7,-3 l-3,6 Z" fill="${INK}"/>`);
  contact(out, gx + 10, gy + 58, 90, 6, 0.2);

  return { size: SIZE, view: [0, 240, SIZE, 546], defs: defs.join("\n"), body: out.join("\n") };
}
