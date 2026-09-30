// NO. 0947 — a thorny tumble of canes, and a seed that is already a plant.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the tumble. A great dead bramble broken loose and rolled
//      into a loose round cage of arching canes — thick, woody, brown, set
//      with hooked thorns, their tips blackening to purple — larger and
//      coarser than the young tumbleweed of NO. 0946. The thorned ring of
//      branches the specimen is.
//   2. The field note's record is scale: mass outbreaks that bury whole towns,
//      documented often enough in the American West.
//   3. The note's point is that a tumbleweed seed is already a plant. There is
//      no stored food and barely a coat — inside is a fully formed embryo
//      wound into a tight spiral like a watch spring, and given water it
//      simply unrolls, root down and shoot up, within hours. Fig. 2: the
//      coiled embryo, and the same embryo an hour after rain, unrolled.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "brambleghast";
export const no = 947;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(947);
  const defs = standardDefs(947);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // canes: arcs round a sphere, thick, far ones darker, thorns on the near
  const cx = 320, cy = 560, R = 200;
  const unit = () => { const z = rand() * 2 - 1, t = rand() * Math.PI * 2, q = Math.sqrt(1 - z * z); return [q * Math.cos(t), q * Math.sin(t), z]; };
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const norm = (p) => { const l = Math.hypot(...p); return p.map((x) => x / l); };
  const canes = [];
  for (let k = 0; k < 26; k++) {
    const nn = unit(), u = norm(cross(nn, Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), v = cross(nn, u);
    const r = R * (0.8 + rand() * 0.2), st = rand() * Math.PI * 2, span = 1.6 + rand() * 1.4;
    const pts = [];
    let depth = 0;
    for (let j = 0; j <= 16; j++) {
      const th = st + (span * j) / 16;
      const p = [0, 1, 2].map((i) => r * (Math.cos(th) * u[i] + Math.sin(th) * v[i]));
      depth += p[2];
      pts.push([cx + p[0], cy + p[1] * 0.9]);
    }
    canes.push({ pts, depth: depth / 17 });
  }
  canes.sort((p, q) => p.depth - q.depth);
  for (const { pts, depth } of canes) {
    const far = depth < 0;
    const d = smooth(pts);
    defs.push("");
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${far ? 8 : 11}" stroke-linecap="round" stroke-opacity="${far ? 0.5 : 1}"/><path d="${d}" fill="none" stroke="${far ? "#6e5438" : "#a8784a"}" stroke-width="${far ? 5 : 8}" stroke-linecap="round"/>`);
    // purple-black tips
    const tip = smooth(pts.slice(-4));
    out.push(`<path d="${tip}" fill="none" stroke="#5a2e5e" stroke-width="${far ? 5 : 8}" stroke-linecap="round"/>`);
    if (!far) {
      const th = [];
      for (let j = 2; j < pts.length - 2; j += 2) {
        const [x0, y0] = pts[j], [x1, y1] = pts[j + 1], a = Math.atan2(y1 - y0, x1 - x0) + (j % 4 ? 1.9 : -1.9);
        th.push(`M${r1(x0 + Math.cos(a) * 3)},${r1(y0 + Math.sin(a) * 3)} l${r1(Math.cos(a) * 12 + Math.cos(a - 1.2) * 3)},${r1(Math.sin(a) * 12 + Math.sin(a - 1.2) * 3)}`);
      }
      out.push(`<path d="${th.join(" ")}" stroke="#e2c898" stroke-width="3" stroke-linecap="round"/><path d="${th.join(" ")}" stroke="${INK}" stroke-width="0.8"/>`);
    }
  }

  // ── fig. 2: a coiled embryo, and the same one unrolled after rain ─────────
  const coil = [];
  for (let k = 0; k <= 60; k++) { const a = k * 0.26, r = 30 * (1 - k / 70); coil.push([630 + Math.cos(a) * r, 720 + Math.sin(a) * r]); }
  out.push(`<circle cx="630" cy="720" r="36" fill="#e8dcb8" fill-opacity="0.6" stroke="${INK}" stroke-width="1"/><path d="${smooth(coil)}" fill="none" stroke="#6ea456" stroke-width="5" stroke-linecap="round"/>`);
  out.push(`<path d="M720,700 C730,720 736,740 738,768" fill="none" stroke="#efe4c8" stroke-width="4" stroke-linecap="round"/><path d="M720,700 C716,680 720,664 732,650" fill="none" stroke="#6ea456" stroke-width="5" stroke-linecap="round"/><path d="M732,650 q-14,-8 -18,-20 q12,2 18,20 M732,650 q10,-12 22,-14 q-6,10 -22,14" fill="#8ac86a" stroke="${INK}" stroke-width="0.8"/>`);
  for (const [x, y] of [[700, 640], [760, 630], [746, 668]]) out.push(`<path d="M${x},${y} q-3,6 0,9 q3,-3 0,-9 Z" fill="#8ab8e0" stroke="${INK}" stroke-width="0.6"/>`);
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.filter(Boolean).join("\n"), body: out.join("\n") };
}
