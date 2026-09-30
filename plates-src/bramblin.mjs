// NO. 0946 — a tumbleweed, and why it hates the rain.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the tumbleweed. A whole dead plant broken from its root and
//      dried into a ball of stiff, branching stems — tan and straw, curving
//      in on themselves from a single snapped stalk into a rough cage — its
//      spine-tipped branchlets catching the light. The dry tangled ball the
//      specimen is.
//   2. The field note's record is a soul blown about until it tangled in dry
//      grass — and a detail that turns out to be the mechanism: it loathes
//      getting wet.
//   3. A tumbleweed's stems are curled inward by drying, and they uncurl when
//      wet: rain opens the ball up and it lies flat, and the seeds are shed
//      best when the ball is rolling dry. Fig. 2: the same plant twice — dry,
//      a ball, rolling; and wet, opened out flat on the ground.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "bramblin";
export const no = 946;
const SIZE = 800;
const STRAW = ["#c89a5a", "#d8b07a", "#a87840", "#e2c490"];

// a ball of stems: arcs of great circles on a sphere, the far ones fainter,
// so the stems wrap round and cross as a dry tumbleweed's do
function ball(out, rand, cx, cy, R, n) {
  const unit = () => { const z = rand() * 2 - 1, t = rand() * Math.PI * 2, q = Math.sqrt(1 - z * z); return [q * Math.cos(t), q * Math.sin(t), z]; };
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const norm = (p) => { const l = Math.hypot(...p); return p.map((x) => x / l); };
  const arcs = [];
  for (let k = 0; k < n; k++) {
    const nn = unit(), u = norm(cross(nn, Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), v = cross(nn, u);
    const r = R * (0.75 + rand() * 0.25), st = rand() * Math.PI * 2, span = 1.4 + rand() * 1.8;
    const pts = [];
    let depth = 0;
    for (let j = 0; j <= 14; j++) {
      const th = st + (span * j) / 14;
      const p = [0, 1, 2].map((i) => r * (Math.cos(th) * u[i] + Math.sin(th) * v[i]));
      depth += p[2];
      pts.push([cx + p[0], cy + p[1] * 0.92]);
    }
    arcs.push({ pts, depth: depth / 15, c: STRAW[k % 4], w: 1.8 + rand() * 2 });
  }
  arcs.sort((p, q) => p.depth - q.depth);
  for (const { pts, depth, c, w } of arcs) {
    const d = smooth(pts), far = depth < 0;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(w + 1.4)}" stroke-linecap="round" stroke-opacity="${far ? 0.45 : 1}"/><path d="${d}" fill="none" stroke="${far ? "#a88a5a" : c}" stroke-width="${r1(w)}" stroke-linecap="round"/>`);
    // spine-tipped branchlets off the near stems
    if (!far) {
      const sp = [];
      for (let j = 3; j < pts.length; j += 4) { const [x, y] = pts[j]; const aa = rand() * Math.PI * 2; sp.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(aa) * 9)},${r1(Math.sin(aa) * 9)}`); }
      out.push(`<path d="${sp.join(" ")}" stroke="#8a6a3a" stroke-width="1.1" stroke-linecap="round"/>`);
    }
  }
}

export function draw() {
  const rand = mulberry32(946);
  const defs = standardDefs(946);
  const out = [];
  contact(out, 320, 758, 200, 16);
  ball(out, rand, 320, 584, 170, 90);
  // the snapped stalk at its foot
  out.push(`<path d="M320,738 l-6,20 l12,0 Z" fill="#a87840" stroke="${INK}" stroke-width="1.2"/>`);

  // ── fig. 2: dry and rolling; wet and opened flat ──────────────────────────
  ball(out, rand, 630, 722, 40, 26);
  out.push(`<path d="M580,700 a50,50 0 0,0 0,40" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 3"/>`);
  const flat = [];
  for (let k = 0; k < 12; k++) { const a = Math.PI + (k / 11) * Math.PI; flat.push(`M740,760 q${r1(Math.cos(a) * 30)},${r1(Math.sin(a) * 10)} ${r1(Math.cos(a) * 56)},${r1(Math.sin(a) * 18 + 4)}`); }
  out.push(`<path d="${flat.join(" ")}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="${flat.join(" ")}" fill="none" stroke="#a8844a" stroke-width="2" stroke-linecap="round"/>`);
  for (const [x, y] of [[730, 700], [744, 712], [758, 698]]) out.push(`<path d="M${x},${y} q-3,6 0,9 q3,-3 0,-9 Z" fill="#8ab8e0" stroke="${INK}" stroke-width="0.6"/>`);
  contact(out, 690, 766, 100, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
