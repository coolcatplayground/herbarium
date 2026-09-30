// NO. 0406 — a bud, and the cold it waits for.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the bud. A rosebud shut tight — plump at the base, drawn to
//      a point, wrapped in its green sepals, which twist round it as they
//      climb — and at its foot, where the sepals part, a glimpse of pale
//      yellow petal. On a short stem, one leaf.
//   2. The field note's point is that a bud will not open on warmth alone:
//      it insists on having been cold first. Temperate woody plants count
//      chilling hours through the winter, and until the total is met a bud
//      stays shut in any amount of heat. Cut a branch in November and stand
//      it in a warm room and nothing happens; cut it in February and it
//      flowers. Fig. 2: those two twigs, side by side.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, profileOutline, paintSolid } from "./kit.mjs";

export const slug = "budew";
export const no = 406;
const SIZE = 800;
const SEPAL = { light: "#d4ecac", base: "#8cc466", deep: "#5a9444", shade: "#305a26", edge: "#305a26" };
const LEAF = { light: "#b8dc98", base: "#5e9a4a", deep: "#3a6e34", shade: "#1e4420", edge: "#1e4420" };
const PETAL = "#f4ea8a";

export function draw() {
  const rand = mulberry32(406);
  const defs = standardDefs(406);
  const out = [];
  contact(out, 320, 758, 150, 14);

  // the stem and its leaf
  const st = `M322,758 C318,712 326,672 324,628`;
  out.push(`<path d="${st}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="${st}" fill="none" stroke="#6a9a4a" stroke-width="9" stroke-linecap="round"/>`);
  const lf = blade([[322, 700], [270, 680], [214, 684], [176, 700]], { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), lobes: 9, depth: 0.12, start: 0.2, sideVeins: 5, rand });
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, margin: 5 });

  // the bud
  const B = makeOrgan({
    x: 324, base: 640, H: 290, R: 96, tilt: 0.1, bendFrom: 0.6, bendMax: 0.18,
    knots: [[0, 0.42], [0.1, 0.84], [0.26, 1], [0.46, 0.9], [0.66, 0.62], [0.84, 0.32], [0.95, 0.12], [1, 0]],
  });
  // the pale petal showing at the foot, under the sepals
  const [px, py] = B.surface(0.2, 0.16, 1.02);
  out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="46" ry="22" fill="${PETAL}" stroke="${INK}" stroke-width="1.2"/>`);
  const d = paintSolid(B, { id: "b", outline: profileOutline(B), palette: SEPAL, defs, out, hatch: 3 });
  // the sepals: bands spiralling up round the bud, each edge inked
  for (let k = 0; k < 5; k++) {
    const pts = [];
    for (let j = 0; j <= 20; j++) {
      const t = 0.04 + (j / 20) * 0.94;
      pts.push(B.surface(-1.4 + k * 0.62 + t * 1.6, t, 1.006));
    }
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${SEPAL.light}" stroke-width="4" stroke-opacity="0.55" clip-path="url(#bc)"/>`);
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${INK}" stroke-width="1.2" stroke-opacity="0.75" clip-path="url(#bc)"/>`);
  }
  // a gap low down where two sepals part and the yellow shows through
  const gap = [];
  for (let j = 0; j <= 10; j++) gap.push(B.surface(0.1 + j * 0.03, 0.1 + j * 0.02, 1.008));
  for (let j = 10; j >= 0; j--) gap.push(B.surface(0.1 + j * 0.03 + 0.18 * Math.sin((Math.PI * j) / 10), 0.1 + j * 0.02, 1.008));
  out.push(`<path d="${smooth(gap, true)}" fill="${PETAL}" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);

  // ── fig. 2: cut in November, cut in February ──────────────────────────────
  const twig = (x, open) => {
    const g = 766;
    out.push(`<path d="M${x},${g} C${x - 2},${g - 60} ${x + 6},${g - 120} ${x + 2},${g - 170}" fill="none" stroke="${INK}" stroke-width="5"/><path d="M${x},${g} C${x - 2},${g - 60} ${x + 6},${g - 120} ${x + 2},${g - 170}" fill="none" stroke="#7a6040" stroke-width="3"/>`);
    for (const [dy, s] of [[-60, -1], [-110, 1], [-170, 0]]) {
      const bx = x + s * 8 + 2, by = g + dy;
      if (open) {
        for (let q = 0; q < 5; q++) { const a = (q / 5) * Math.PI * 2; out.push(`<ellipse cx="${r1(bx + Math.cos(a) * 8)}" cy="${r1(by + Math.sin(a) * 8)}" rx="7" ry="5" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(bx + Math.cos(a) * 8)} ${r1(by + Math.sin(a) * 8)})" fill="#f8d0dc" stroke="${INK}" stroke-width="0.8"/>`); }
        out.push(`<circle cx="${bx}" cy="${by}" r="3.4" fill="#f2cf3e"/>`);
      } else out.push(`<ellipse cx="${bx}" cy="${by}" rx="5" ry="9" fill="#8a6a44" stroke="${INK}" stroke-width="1"/>`);
    }
  };
  twig(630, false);
  twig(740, true);
  // a snowflake over the one that has had its winter
  const sf = [];
  for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI; sf.push(`M${r1(740 - Math.cos(a) * 12)},${r1(560 - Math.sin(a) * 12)} L${r1(740 + Math.cos(a) * 12)},${r1(560 + Math.sin(a) * 12)}`); }
  out.push(`<path d="${sf.join(" ")}" stroke="#6a90c8" stroke-width="2.4" stroke-linecap="round"/>`);
  contact(out, 686, 768, 100, 6, 0.2);

  return { size: SIZE, view: [0, 320, SIZE, 470], defs: defs.join("\n"), body: out.join("\n") };
}
