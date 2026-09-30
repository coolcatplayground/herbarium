// NO. 1012 — a sprig of tea, and the shade that makes matcha.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the tea shoot. A sprig of Camellia sinensis — "two leaves and
//      a bud", the tip that is picked: a silvery furled bud and two young
//      leaves, glossy, finely toothed, a bright matcha green — with one white
//      flower below it, its yellow boss of stamens. The green of the tea and
//      the white the specimen is made of.
//   2. The field note's record is a lookalike that turned out to be entirely
//      unrelated — convergence, stated outright.
//   3. The note's point is that the flavour is made by darkness in the weeks
//      before picking. Tea grown for matcha is covered for about three weeks
//      before harvest: the plant goes on sending theanine up from its roots,
//      but with little light it turns less of it into bitter catechins, and
//      the leaves come out greener and sweeter. Fig. 2: a row of tea bushes
//      under a black shade cloth on poles.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "poltchageist";
export const no = 1012;
const SIZE = 800;
const LEAF = { light: "#d8f0b0", base: "#6ab84a", deep: "#3e8a36", shade: "#1e5a22", edge: "#1e5a22" };
const OLD = { light: "#a8c890", base: "#2e6a34", deep: "#1a4a24", shade: "#0e2e16", edge: "#0e2e16" };

export function draw() {
  const rand = mulberry32(1012);
  const defs = standardDefs(1012);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the woody twig and its older dark leaves
  out.push(`<path d="M300,760 C304,680 312,600 322,500 C326,460 330,430 334,400" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M300,760 C304,680 312,600 322,500 C326,460 330,430 334,400" fill="none" stroke="#8a6a44" stroke-width="7" stroke-linecap="round"/>`);
  for (const [x, y, a, L, pal] of [[306, 680, Math.PI + 0.3, 150, OLD], [312, 600, -0.3, 160, OLD], [322, 520, Math.PI + 0.5, 130, LEAF], [328, 452, -0.6, 120, LEAF]]) {
    const b = blade([[x, y], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 - 6], [x + Math.cos(a) * L, y + Math.sin(a) * L]], { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.66), lobes: 18, depth: 0.06, start: 0.15, sideVeins: 6, rand });
    paintBlade(b, { id: `l${r1(y)}`, palette: pal, defs, out, margin: 5 });
  }
  // the bud at the tip: furled, silvery with down
  out.push(`<path d="M334,404 C324,380 326,340 338,320 C350,340 350,380 340,404 Z" fill="#c8e0b0" stroke="${INK}" stroke-width="1.4"/>`);
  for (let k = 0; k < 8; k++) out.push(`<path d="M${330 + (k % 2) * 8},${396 - k * 9} l${k % 2 ? 4 : -4},-3" stroke="#f4f8ec" stroke-width="1.2"/>`);
  // one white flower lower down, its yellow boss of stamens
  const fx0 = 230, fy0 = 640;
  out.push(`<path d="M${fx0 + 40},${fy0 - 10} Q${fx0 + 60},${fy0 - 20} 310,630" fill="none" stroke="#6e5438" stroke-width="3"/>`);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; out.push(`<ellipse cx="${r1(fx0 + Math.cos(a) * 22)}" cy="${r1(fy0 + Math.sin(a) * 18)}" rx="22" ry="15" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(fx0 + Math.cos(a) * 22)} ${r1(fy0 + Math.sin(a) * 18)})" fill="#fbfaf2" stroke="${INK}" stroke-width="1.2"/>`); }
  const st = [];
  for (let k = 0; k < 28; k++) { const a = rand() * Math.PI * 2, r = rand() * 12; st.push(`<circle cx="${r1(fx0 + Math.cos(a) * r)}" cy="${r1(fy0 + Math.sin(a) * r)}" r="2" fill="#e8c83a"/>`); }
  out.push(st.join(""));

  // ── fig. 2: a row of tea bushes under a shade cloth ───────────────────────
  const fx = 690;
  for (const x of [fx - 90, fx, fx + 90]) out.push(`<path d="M${x},766 L${x},640" stroke="${INK}" stroke-width="3"/><path d="M${x},766 L${x},640" stroke="#8a7a5a" stroke-width="1.6"/>`);
  out.push(`<path d="M${fx - 100},640 L${fx + 100},640 L${fx + 100},650 L${fx - 100},650 Z" fill="#1e1e1c" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx - 100},650 L${fx - 100},700 M${fx + 100},650 L${fx + 100},700" stroke="#1e1e1c" stroke-width="5"/>`);
  out.push(`<path d="M${fx - 96},766 C${fx - 96},722 ${fx + 96},722 ${fx + 96},766 Z" fill="#3e8a3e" stroke="${INK}" stroke-width="1.3"/>`);
  for (let k = 0; k < 30; k++) out.push(`<circle cx="${r1(fx - 88 + rand() * 176)}" cy="${r1(738 + rand() * 24)}" r="2" fill="#6ab84a"/>`);
  contact(out, fx, 768, 104, 5, 0.18);

  return { size: SIZE, view: [0, 290, SIZE, 500], defs: defs.join("\n"), body: out.join("\n") };
}
