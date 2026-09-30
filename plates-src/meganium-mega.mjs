// NO. 0154 (Mega) — the flower in three tiers, and years of starch spent on it.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the frilled flower of NO. 0154, doubled. Where the ordinary
//      bloom is one pink frilled cup, the Mega form's is three tiers — an
//      inner cup of deep crimson, a middle ruff of pink, and an outer ruff of
//      white petals streaked red at the tips — with the two long stamens still
//      rising from the heart, set on its whorl of leaves. The red, pink and
//      white collar.
//   2. The record says its breath revives dead grass — a plant's breath being
//      what other plants live on.
//   3. The note's point is the economics of a giant bloom. Mass doubles and
//      everything goes into the flower; real giant flowers work the same way.
//      Amorphophallus builds an underground corm over years, storing starch
//      until it can afford one enormous inflorescence, and the bloom spends
//      the corm down to almost nothing. Fig. 2: the corm across four years,
//      growing under a single leaf, then spent under the flower.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "meganium-mega";
export const no = 154;
const SIZE = 800;
const LEAF = { light: "#d0ecb0", base: "#8ac86e", deep: "#5a9a4e", shade: "#346a32", edge: "#2e5a2e" };

function frill(out, cx, cy, R, ry, n, fill, stroke, rand, streak) {
  const pts = [];
  for (let k = 0; k <= n * 6; k++) {
    const a = (k / (n * 6)) * Math.PI * 2, j = k % 6;
    const rr = R * (j === 3 ? 1 : j === 0 ? 0.8 : 0.93 + rand() * 0.07) * (k % 2 ? 0.97 : 1);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * ry]);
  }
  out.push(`<path d="M${pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round" filter="url(#pen)"/>`);
  for (let k = 0; k < n; k++) {
    const a = ((k + 0.5) / n) * Math.PI * 2;
    out.push(`<path d="M${r1(cx + Math.cos(a) * R * 0.3)},${r1(cy + Math.sin(a) * R * 0.3 * ry)} L${r1(cx + Math.cos(a) * R * 0.86)},${r1(cy + Math.sin(a) * R * 0.86 * ry)}" stroke="${streak || stroke}" stroke-width="${streak ? 4 : 1}" stroke-opacity="${streak ? 0.75 : 0.4}" stroke-linecap="round"/>`);
  }
}

export function draw() {
  const rand = mulberry32(1540);
  const defs = standardDefs(1540);
  const out = [];
  contact(out, 300, 758, 220, 16);

  // the whorl of leaves, and the short stalk
  for (const [a, L] of [[Math.PI + 0.12, 190], [-0.12, 190], [Math.PI - 0.3, 150], [0.3, 150]]) {
    const pts = [[300, 740], [300 + Math.cos(a) * L * 0.5, 740 + Math.sin(a) * L * 0.1 - 20], [300 + Math.cos(a) * L, 752]];
    const b = blade(pts, { width: (u) => 34 * Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.8) + 0.8, sideVeins: 5, rand });
    paintBlade(b, { id: `l${r1(a * 10)}`, palette: LEAF, defs, out, shade: a > 0 && a < 1 ? 0.2 : 0, margin: 3 });
  }
  out.push(`<rect x="290" y="640" width="20" height="104" fill="#8ac86e" stroke="${INK}" stroke-width="1.6"/>`);
  // three tiers: white streaked red, then pink, then a crimson cup
  const cx = 300, cy = 590;
  frill(out, cx, cy + 18, 200, 0.5, 12, "#fbf6f2", INK, rand, "#d8343e");
  frill(out, cx, cy + 6, 150, 0.52, 10, "#f2a0b4", INK, rand);
  frill(out, cx, cy - 4, 100, 0.54, 8, "#c82a3a", INK, rand);
  frill(out, cx, cy - 10, 56, 0.56, 6, "#9a1826", INK, rand);
  out.push(`<ellipse cx="${cx}" cy="${cy - 12}" rx="20" ry="10" fill="#f2e090" stroke="${INK}" stroke-width="1.2"/>`);
  // the two long stamens rising from the heart
  for (const s of [-1, 1]) out.push(`<path d="M${cx + s * 6},${cy - 14} C${cx + s * 10},${cy - 90} ${cx + s * 30},${cy - 150} ${cx + s * 40},${cy - 190}" fill="none" stroke="${INK}" stroke-width="3.4"/><path d="M${cx + s * 6},${cy - 14} C${cx + s * 10},${cy - 90} ${cx + s * 30},${cy - 150} ${cx + s * 40},${cy - 190}" fill="none" stroke="#e8d86a" stroke-width="1.8"/><ellipse cx="${cx + s * 42}" cy="${cy - 196}" rx="6" ry="9" transform="rotate(${s * 20} ${cx + s * 42} ${cy - 196})" fill="#f2cf3e" stroke="${INK}" stroke-width="1.1"/>`);

  // ── fig. 2: the corm across four years, then spent under the flower ───────
  out.push(`<path d="M560,716 L790,716" stroke="#8a6a4a" stroke-width="1.2" stroke-dasharray="5 4"/>`);
  [[580, 8], [630, 13], [690, 19], [760, 7]].forEach(([x, r], k) => {
    out.push(`<ellipse cx="${x}" cy="${716 + r + 6}" rx="${r * 1.4}" ry="${r}" fill="#c8a878" stroke="${INK}" stroke-width="1.2"/>`);
    if (k < 3) {
      const lf = blade([[x, 716], [x + 4, 690 - r], [x + 18, 670 - r * 1.5]], { width: (u) => (8 + r * 0.4) * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 0.5, rand });
      paintBlade(lf, { id: `fl${k}`, palette: LEAF, defs, out, margin: 1, ink: 1 });
    } else {
      out.push(`<path d="M${x},716 L${x},652" stroke="${INK}" stroke-width="3"/><path d="M${x},650 L${x},596" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/><path d="M${x},650 L${x},596" stroke="#e8c84a" stroke-width="2.6" stroke-linecap="round"/><path d="M${x - 4},656 C${x - 18},640 ${x - 16},616 ${x - 6},602 C${x - 6},624 ${x + 16},632 ${x + 12},656 Z" fill="#c82a3a" stroke="${INK}" stroke-width="1.2"/>`);
    }
  });
  contact(out, 675, 768, 110, 4, 0.12);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
