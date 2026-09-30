// NO. 0893 (Dada) — a vine, and a seed packed for the child it carries.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the vine, and what it gives. The same green coils wound round
//      a dark branch as NO. 0893 — and at the foot of the branch, a big seed
//      split open and sprouting, its two thick seed-leaves still full of the
//      food the parent packed into it, the young shoot rising from between
//      them fed on that store before it has a leaf of its own.
//   2. The record is the ordinary form's: vines that tear off and feed the
//      forest's soil.
//   3. The note's point is that parental care is a life stage, not a form,
//      and plants keep their own version: a seed is provisioned. Everything
//      a seedling needs before it can feed itself is packed in by the parent —
//      starch, oil, protein — and the bigger the store, the deeper the shade a
//      seedling can survive. Fig. 2: two seeds cut open, a small one with a
//      little store and a large one packed full, the embryo in each the same.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "zarude-dada";
export const no = 893;
const SIZE = 800;
const VINE = { light: "#9ae07a", base: "#3aa04a", deep: "#1e6e30", shade: "#0e4420", edge: "#0e4420" };

export function draw() {
  const rand = mulberry32(8930);
  const defs = standardDefs(8930);
  const out = [];
  contact(out, 320, 758, 250, 16);

  // the dark branch, leaning up from the ground, green coils wound round it
  const x0 = 180, y0 = 750, x1 = 460, y1 = 470, r = 22;
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * r, ny = Math.cos(a) * r;
  out.push(`<path d="M${r1(x0 + nx)},${r1(y0 + ny)} L${r1(x1 + nx)},${r1(y1 + ny)} L${r1(x1 - nx)},${r1(y1 - ny)} L${r1(x0 - nx)},${r1(y0 - ny)} Z" fill="#2e2824" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="${x1}" cy="${y1}" rx="${r}" ry="9" transform="rotate(${r1((a * 180) / Math.PI + 90)} ${x1} ${y1})" fill="#8a7a6a" stroke="${INK}" stroke-width="1.2"/>`);
  for (const [u0, u1] of [[0.25, 0.45], [0.6, 0.8]]) {
    for (let k = 0; k < 4; k++) {
      const u = u0 + ((u1 - u0) * k) / 3, cx = x0 + (x1 - x0) * u, cy = y0 + (y1 - y0) * u;
      const d = `M${r1(cx + nx * 1.2 - Math.cos(a) * 8)},${r1(cy + ny * 1.2 - Math.sin(a) * 8)} Q${r1(cx + Math.cos(a) * 10)},${r1(cy + Math.sin(a) * 10)} ${r1(cx - nx * 1.2 + Math.cos(a) * 8)},${r1(cy - ny * 1.2 + Math.sin(a) * 8)}`;
      out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${VINE.base}" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${VINE.light}" stroke-width="3" transform="translate(-2 -2)"/>`);
    }
  }
  // the big seed at its foot, split and sprouting on its store
  const sx = 400, sy = 730;
  defs.push(`<radialGradient id="sd" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#f4e8c0"/><stop offset="0.6" stop-color="#e0c888"/><stop offset="1" stop-color="#a88a4a"/></radialGradient>`);
  out.push(`<path d="M${sx - 60},${sy + 20} C${sx - 70},${sy - 20} ${sx - 30},${sy - 36} ${sx},${sy - 10} C${sx + 30},${sy - 36} ${sx + 70},${sy - 20} ${sx + 60},${sy + 20} C${sx + 30},${sy + 30} ${sx - 30},${sy + 30} ${sx - 60},${sy + 20} Z" fill="url(#sd)" stroke="${INK}" stroke-width="1.8"/>`);
  out.push(`<path d="M${sx},${sy - 10} L${sx},${sy + 26}" stroke="#a88a4a" stroke-width="2"/>`);
  out.push(`<path d="M${sx - 68},${sy + 22} C${sx - 80},${sy} ${sx - 70},${sy - 30} ${sx - 50},${sy - 34}" fill="none" stroke="#6e4a2a" stroke-width="5"/>`);
  const sh = smooth([[sx, sy - 10], [sx + 4, sy - 50], [sx - 6, sy - 90], [sx + 4, sy - 120]]);
  out.push(`<path d="${sh}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${sh}" fill="none" stroke="#8ac86a" stroke-width="5" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[sx + 4, sy - 120], [sx + s * 26, sy - 140], [sx + s * 50, sy - 138]], { width: (u) => 14 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 0.6, rand });
    paintBlade(b, { id: `y${s}`, palette: VINE, defs, out, margin: 2, ink: 1.2 });
  }

  // ── fig. 2: a small seed and a large one, cut ─────────────────────────────
  const cut = (x, rx, ry) => {
    const y = 760 - ry;
    out.push(`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#8a6a44" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="${rx - 5}" ry="${ry - 5}" fill="#f4e8c0"/>`);
    out.push(`<path d="M${x - 8},${y + ry - 12} q8,-14 16,0" fill="#8ac86a" stroke="${INK}" stroke-width="1"/>`);
  };
  cut(632, 20, 16);
  cut(730, 56, 44);
  contact(out, 690, 764, 100, 5, 0.18);

  return { size: SIZE, view: [0, 430, SIZE, 360], defs: defs.join("\n"), body: out.join("\n") };
}
