// NO. 0773 (Grass) — an ear of speckled maize, and the genes that jump.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the ear. A dried ear of flint maize, its papery husks pulled
//      back and twisted into a tail at its foot as ears are hung to dry, the
//      kernels no two alike: yellow, purple, and yellow streaked and spotted
//      with purple — each kernel a small mosaic. The field note files the form
//      as a cassette-style swap of modules; the speckled ear is where swappable
//      DNA was found.
//   2. There is no record for this form.
//   3. The note's point is that mobile modules of DNA are real, and they were
//      found in a plant. Barbara McClintock worked out in the 1940s, from the
//      spotted kernels of maize, that certain genetic elements move —
//      inserting into a pigment gene to switch it off, jumping out again later
//      in some cells to switch it back on. Each purple spot on a yellow kernel
//      is a line of cells where one jumped. Fig. 2: one kernel, close — yellow
//      where the gene is off, purple spots where it came back on.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "silvally-grass";
export const no = 773;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(773);
  const defs = standardDefs(773);
  const out = [];
  contact(out, 330, 758, 250, 16);

  // the ear lying at a slant, husks twisted into a tail at its foot
  const x0 = 420, y0 = 700, x1 = 100, y1 = 624;
  const a = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0);
  const ca = Math.cos(a), sa = Math.sin(a);
  const T = (u, v) => [x0 + ca * L * u - sa * v, y0 + sa * L * u + ca * v];
  // the husks behind, twisted into a tail past its foot
  for (const s of [-1, 1, 0]) {
    const p = [T(0.05, s * 30), T(-0.14, s * 22), T(-0.28, s * 6 + 10), T(-0.34, 20)].map(([x, y]) => `${r1(x)},${r1(y)}`);
    out.push(`<path d="M${p[0]} Q${p[1]} ${p[2]} T${p[3]}" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${p[0]} Q${p[1]} ${p[2]} T${p[3]}" fill="none" stroke="${["#e8dcb0", "#d8c898", "#f2e8c8"][s + 1]}" stroke-width="16" stroke-linecap="round"/>`);
  }
  // the cob
  const W = 60;
  const half = (u) => W * Math.sin(Math.PI * Math.min(1, u * 0.9 + 0.1)) ** 0.5;
  const left = [], right = [];
  for (let j = 0; j <= 30; j++) { const u = j / 30; left.push(T(u, -half(u))); right.push(T(u, half(u))); }
  const cd = `M${[...left, ...right.reverse()].map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} Z`;
  out.push(`<path d="${cd}" fill="#e8c43a" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  defs.push(`<clipPath id="cc"><path d="${cd}"/></clipPath>`);
  const kern = [];
  for (let i = 1; i < 28; i++) {
    const u = i / 28.5;
    for (let c = -4; c <= 4; c++) {
      const v = (c / 4.6) * half(u), [x, y] = T(u, v), sq = Math.cos((c / 4.6) * Math.PI / 2);
      const kind = rand();
      const base = kind < 0.35 ? "#f2c63e" : kind < 0.55 ? "#6a2a6a" : "#f2c63e";
      kern.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="6" ry="${r1(5 * sq + 1)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(x)} ${r1(y)})" fill="${base}" stroke="#8a6a1e" stroke-width="0.7"/>`);
      if (kind >= 0.55) for (let q = 0; q < 3; q++) kern.push(`<circle cx="${r1(x + (rand() - 0.5) * 7)}" cy="${r1(y + (rand() - 0.5) * 6 * sq)}" r="1.4" fill="#6a2a6a"/>`);
    }
  }
  out.push(`<g clip-path="url(#cc)">${kern.join("")}</g>`);

  // ── fig. 2: one kernel, close ─────────────────────────────────────────────
  const fx = 690, fy = 690;
  out.push(`<path d="M${fx - 50},${fy - 50} C${fx - 20},${fy - 66} ${fx + 20},${fy - 66} ${fx + 50},${fy - 50} C${fx + 60},${fy} ${fx + 30},${fy + 66} ${fx},${fy + 70} C${fx - 30},${fy + 66} ${fx - 60},${fy} ${fx - 50},${fy - 50} Z" fill="#f2c63e" stroke="${INK}" stroke-width="1.6"/>`);
  for (let k = 0; k < 14; k++) {
    const x = fx - 40 + rand() * 80, y = fy - 40 + rand() * 90, r = 3 + rand() * 7;
    out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r)}" ry="${r1(r * 0.7)}" transform="rotate(${r1(rand() * 180)} ${r1(x)} ${r1(y)})" fill="#6a2a6a"/>`);
  }
  contact(out, fx, fy + 76, 60, 5, 0.18);

  return { size: SIZE, view: [0, 470, SIZE, 320], defs: defs.join("\n"), body: out.join("\n") };
}
