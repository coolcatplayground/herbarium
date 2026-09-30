// NO. 0465 — a thicket, and the widest pipes a plant builds.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the thicket. A great mound of twining stems, blue and
//      matte, looped over and under until no one stem can be followed —
//      NO. 0114's tangle grown old and heavy — and here and there a new shoot
//      reaching out of it, its tip flushed red: young leaves on vines very
//      often come out red before they green.
//   2. The field note's record is disposability: stems lost are regrown at
//      once, and where growth is fastest it tears its own vines back.
//   3. The note's point is that bulk without a trunk changes what the wood is
//      for. A tree's xylem has to hold the tree up, so its vessels stay
//      narrow and many; a climber has been relieved of that and builds the
//      widest vessels in the plant kingdom, near half a millimetre across.
//      Fig. 2: two stems cut across, a tree's and a liana's, at one scale.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "tangrowth";
export const no = 465;
const SIZE = 800;
const BLUES = ["#5f8cb4", "#6a98be", "#557fa8", "#7aa6c8"];
const VINE = { light: "#b2cce2", deep: "#40688e", shade: "#34597c" };

function vine(out, d, w, k, shade) {
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(w + 2.2)}" stroke-linecap="round"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${shade ? VINE.deep : BLUES[k % 4]}" stroke-width="${r1(w)}" stroke-linecap="round"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${shade ? VINE.shade : VINE.light}" stroke-width="0.9" stroke-opacity="0.7"/>`);
}

export function draw() {
  const rand = mulberry32(465);
  const defs = standardDefs(465);
  const out = [];
  contact(out, 320, 760, 260, 18);
  const C = { x: 320, y: 600, RX: 240, RY: 170 };

  // loops of stem over a squat dome, far ones first
  const unit = () => { const z = rand() * 2 - 1, t = rand() * Math.PI * 2, s = Math.sqrt(1 - z * z); return [s * Math.cos(t), s * Math.sin(t), z]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
  const arcs = [];
  for (let i = 0; i < 110; i++) {
    const n = unit(), u = norm(cross(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), v = cross(n, u);
    const shell = 0.72 + rand() * 0.28, start = rand() * Math.PI * 2, span = 1.2 + rand() * 1.6;
    const pts = [];
    let depth = 0;
    for (let k = 0; k <= 16; k++) {
      const th = start + (span * k) / 16;
      const p = [0, 1, 2].map((j) => shell * (Math.cos(th) * u[j] + Math.sin(th) * v[j]));
      // a dome: flatten the underside against the ground
      const y = C.y + Math.min(p[1] * C.RY, 150);
      depth += p[2];
      pts.push([C.x + p[0] * C.RX, y]);
    }
    arcs.push({ d: smooth(pts), depth: depth / 17, w: 8 + rand() * 5 });
  }
  arcs.sort((a, b) => a.depth - b.depth);
  out.push(`<path d="M${C.x - C.RX * 0.9},750 C${C.x - C.RX * 0.92},${C.y - C.RY * 0.9} ${C.x + C.RX * 0.92},${C.y - C.RY * 0.9} ${C.x + C.RX * 0.9},750 Z" fill="${VINE.shade}"/>`);
  arcs.forEach((a, i) => vine(out, a.d, a.w, i, a.depth < -0.25));

  // new shoots reaching out, red at the tips
  const shoots = [[C.x - 200, 520, -2.6, 150], [C.x + 180, 470, -0.5, 170], [C.x + 20, 440, -1.4, 130]];
  for (const [x, y, a, L] of shoots) {
    const pts = [[x, y]];
    let ang = a;
    for (let k = 1; k <= 12; k++) { ang += k > 7 ? 0.22 : 0.02; pts.push([pts.at(-1)[0] + Math.cos(ang) * (L / 12), pts.at(-1)[1] + Math.sin(ang) * (L / 12)]); }
    vine(out, smooth(pts.slice(0, 8)), 6, 1, false);
    const tip = smooth(pts.slice(7));
    out.push(`<path d="${tip}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${tip}" fill="none" stroke="#c84a5a" stroke-width="5.6" stroke-linecap="round"/>`);
    // a young red leaf folded at the tip
    const [ex, ey] = pts.at(-1);
    out.push(`<path d="M${r1(ex)},${r1(ey)} q10,-14 22,-8 q-6,12 -22,8 Z" fill="#d8606e" stroke="${INK}" stroke-width="1"/>`);
  }

  // ── fig. 2: a tree's stem and a liana's, cut across ───────────────────────
  const disc = (x, y, R, pores, rmin, rmax) => {
    out.push(`<circle cx="${x}" cy="${y}" r="${R}" fill="#e8d6b0" stroke="${INK}" stroke-width="1.6"/>`);
    const p = [];
    for (let k = 0; k < pores; k++) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * (R - rmax - 4);
      p.push(`<circle cx="${r1(x + Math.cos(a) * r)}" cy="${r1(y + Math.sin(a) * r)}" r="${r1(rmin + rand() * (rmax - rmin))}" fill="#6e5438"/>`);
    }
    out.push(p.join(""));
  };
  disc(632, 712, 48, 160, 0.8, 1.6);
  disc(744, 712, 48, 14, 4, 7);
  contact(out, 688, 764, 110, 6, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
