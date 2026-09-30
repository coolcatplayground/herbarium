// NO. 0830 — a boll of cotton on its rosette, and hairs that catch bedbugs.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a great ball of cotton lint, burst from its boll, cream-
//      white and round, glossy seeds showing dark through it here and there —
//      and under it a rosette of broad olive-green leaves, pointed, spread
//      flat round its foot. The cotton puff on its leafy base the specimen is.
//   2. The field note's record holds its two uses side by side: seed spread
//      on the wind, and the same cotton spun into a glossy yarn.
//   3. The note's point is that hairs on a leaf are not always soft. Kidney
//      bean leaves carry microscopic hooked hairs that impale the feet of
//      insects walking over them — used for centuries in southeastern
//      Europe, where leaves were strewn over a bedroom floor at night to catch
//      bedbugs and swept up in the morning. Fig. 2: those hairs through a lens,
//      hooked, one holding a leg.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "eldegoss";
export const no = 830;
const SIZE = 800;
const LEAF = { light: "#d4dca0", base: "#8a9a44", deep: "#5e6e2a", shade: "#3a4418", edge: "#3a4418" };

export function draw() {
  const rand = mulberry32(830);
  const defs = standardDefs(830);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the rosette of broad pointed leaves spread flat round the foot
  for (let k = 0; k < 9; k++) {
    const a = Math.PI * (k / 8);
    const x0 = 320 - Math.cos(a) * 40, y0 = 736, L = 190;
    const pts = [[x0, y0], [x0 - Math.cos(a) * L * 0.5, y0 + 8 - Math.sin(a) * 18], [x0 - Math.cos(a) * L, y0 + 14 - Math.sin(a) * 26]];
    const b = blade(pts, { width: (u) => 42 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), sideVeins: 4, rand });
    paintBlade(b, { id: `r${k}`, palette: LEAF, defs, out, shade: 0.15, margin: 5 });
  }
  // the ball of lint
  const cx = 320, cy = 540, R = 190;
  defs.push(`<radialGradient id="ct" cx="0.42" cy="0.36" r="0.66"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="#f6f0e0"/><stop offset="1" stop-color="#dcd2b8"/></radialGradient>`);
  const hull = [];
  for (let j = 0; j < 44; j++) { const a = (j / 44) * Math.PI * 2; hull.push([cx + Math.cos(a) * R * (1 + (rand() - 0.5) * 0.06), cy + Math.sin(a) * R * 0.94 * (1 + (rand() - 0.5) * 0.06)]); }
  out.push(`<path d="${smooth(hull, true)}" fill="url(#ct)" stroke="${INK}" stroke-width="1.6" stroke-dasharray="7 3" filter="url(#pen)"/>`);
  const fib = [];
  for (let k = 0; k < 60; k++) { const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * R * 0.9; fib.push(`M${r1(cx + Math.cos(a) * r)},${r1(cy + Math.sin(a) * r * 0.94)} q${r1(8 + rand() * 8)},-4 ${r1(16 + rand() * 10)},${r1(rand() * 5)}`); }
  out.push(`<path d="${fib.join(" ")}" fill="none" stroke="#d8ceb4" stroke-width="1.2" stroke-opacity="0.8"/>`);
  // the seeds showing through
  for (let k = 0; k < 11; k++) { const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * R * 0.8; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.9; out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="6" ry="4" transform="rotate(${r1(rand() * 180)} ${r1(x)} ${r1(y)})" fill="#6e4a2a" fill-opacity="0.8"/>`); }

  // ── fig. 2: the hooked hairs of a bean leaf, holding a leg ────────────────
  const fx = 690, fy = 690, Rl = 80;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${Rl}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${Rl}" fill="#e2f0c8"/>`);
  const hooks = [];
  for (let k = 0; k < 9; k++) { const x = fx - 72 + k * 18, y = fy + 40; hooks.push(`M${x},${y} L${x + 2},${y - 40} q0,-10 -8,-8`); }
  out.push(`<g clip-path="url(#lens)"><rect x="${fx - Rl}" y="${fy + 40}" width="${Rl * 2}" height="60" fill="#8ab85a"/><path d="${hooks.join(" ")}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="${hooks.join(" ")}" fill="none" stroke="#f4f8e8" stroke-width="1" stroke-linecap="round"/>` +
    `<path d="M${fx - 40},${fy - 70} L${fx + 4},${fy - 10} L${fx + 10},${fy + 10}" fill="none" stroke="#6e3a24" stroke-width="5" stroke-linecap="round"/></g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${Rl}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  contact(out, fx, fy + Rl + 6, 70, 5, 0.18);

  return { size: SIZE, view: [0, 320, SIZE, 470], defs: defs.join("\n"), body: out.join("\n") };
}
