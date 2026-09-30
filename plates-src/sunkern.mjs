// NO. 0191 — a seed, and how long it can wait.
//
// What the morphology says, and what each observation became:
//
//   1. A single large seed: a sunflower's, as the field note files it — a
//      flattened teardrop, dark, with pale stripes running its length.
//   2. It is splitting at its tip. The coat has cracked open in a jagged
//      edge, the pale kernel shows, and two seed-leaves are out on a short
//      stem: waiting over.
//   3. Fig. 2 is the field note's experiment. In 1879 the botanist Beal
//      buried twenty bottles of seed in a Michigan sand lot to find out how
//      long they would keep. It is still running; mullein from the bottle
//      opened in 2021 germinated after 142 years underground. A bottle of
//      sand, seeds in it, corked.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "sunkern";
export const no = 191;
const SIZE = 800;
const DARK = { light: "#8a7a66", base: "#4a3f35", deep: "#2e2620", shade: "#1a1511", edge: "#1a1511" };
const LEAF = { light: "#bfe39e", base: "#7fbe62", deep: "#4d8238", shade: "#2e5222", edge: "#2e5222" };

export function draw() {
  const rand = mulberry32(191);
  const defs = standardDefs(191);
  const out = [];
  contact(out, 320, 754, 140, 16);
  const S = makeOrgan({
    x: 320, base: 740, H: 330, R: 132, tilt: 0.18, bendFrom: 0.5, bendMax: 0.12,
    knots: [[0, 0.5], [0.12, 0.88], [0.3, 1], [0.5, 0.95], [0.7, 0.76], [0.86, 0.5], [0.96, 0.22], [1, 0]],
  });
  const d = paintSolid(S, { id: "s", outline: hull(S), palette: DARK, defs, out, hatch: 0 });
  // the pale stripes running its length
  for (const th of [-1.3, -0.95, -0.62, -0.3, 0.02, 0.34, 0.66, 0.98, 1.3]) {
    const L = [], R = [];
    for (let j = 0; j <= 20; j++) {
      const t = 0.04 + (j / 20) * 0.66;
      const w = (0.035 + 0.02 * Math.sin(th * 7.3 + t * 9)) * Math.sin(Math.PI * Math.min(1, t / 0.72 + 0.1));
      L.push(S.surface(th - w, t, 1.003));
      R.push(S.surface(th + w, t, 1.003));
    }
    out.push(`<path d="${smooth(L) + smooth([...R].reverse(), false, { move: false })} Z" fill="#e8d7a0" fill-opacity="0.85" clip-path="url(#sc)"/>`);
  }
  // the coat split open at the tip: the kernel inside, pale
  const lip = [];
  for (let j = 0; j <= 18; j++) {
    const th = -1.4 + (j / 18) * 2.8;
    lip.push(S.surface(th, 0.72 + (j % 2 ? 0.06 : 0) + (rand() - 0.5) * 0.02, 1.002));
  }
  const [tx, ty] = S.surface(0, 1);
  const open = lip.map(([x, y], j) => `${j ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ") + ` L${r1(lip.at(-1)[0] + 50)},${r1(ty - 80)} L${r1(lip[0][0] - 50)},${r1(ty - 80)} Z`;
  out.push(`<g clip-path="url(#sc)"><path d="${open}" fill="#f1dd8b"/><path d="${open}" fill="#d9bd5a" filter="url(#wc2)" fill-opacity="0.5" transform="translate(0 6)"/></g>`);
  out.push(`<path d="${lip.map(([x, y], j) => `${j ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ")}" fill="none" stroke="${INK}" stroke-width="1.8"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  // two seed-leaves, out on a short stem
  const sx = tx, sy = ty + 18;
  out.push(`<path d="M${sx},${sy} C${sx - 2},${sy - 30} ${sx + 4},${sy - 50} ${sx + 2},${sy - 74}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${sx},${sy} C${sx - 2},${sy - 30} ${sx + 4},${sy - 50} ${sx + 2},${sy - 74}" fill="none" stroke="#8cc26a" stroke-width="7" stroke-linecap="round"/>`);
  for (const side of [-1, 1]) {
    const b = blade([[sx + 2, sy - 74], [sx + side * 60, sy - 110], [sx + side * 128, sy - 104]], {
      width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.62), sideVeins: 4, rand,
    });
    paintBlade(b, { id: `c${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.2 : 0, margin: 5 });
  }

  // ── fig. 2: Beal's bottle ─────────────────────────────────────────────────
  const bx = 692, by = 768;
  const bottle = `M${bx - 44},${by} L${bx - 44},${by - 110} C${bx - 44},${by - 134} ${bx - 14},${by - 140} ${bx - 14},${by - 160} L${bx - 14},${by - 186} L${bx + 14},${by - 186} L${bx + 14},${by - 160} C${bx + 14},${by - 140} ${bx + 44},${by - 134} ${bx + 44},${by - 110} L${bx + 44},${by} Z`;
  defs.push(`<clipPath id="btl"><path d="${bottle}"/></clipPath>`);
  out.push(`<path d="${bottle}" fill="#e3ecea" fill-opacity="0.6"/>`);
  out.push(`<rect x="${bx - 50}" y="${by - 76}" width="100" height="80" fill="#d8c08a" clip-path="url(#btl)"/>`);
  for (let k = 0; k < 40; k++) out.push(`<circle cx="${r1(bx - 40 + rand() * 80)}" cy="${r1(by - 70 + rand() * 66)}" r="${r1(0.6 + rand() * 0.8)}" fill="#a88a54" clip-path="url(#btl)"/>`);
  for (let k = 0; k < 9; k++) {
    const x = bx - 34 + rand() * 68, y = by - 62 + rand() * 52;
    out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="3.4" ry="2" transform="rotate(${r1(rand() * 180)} ${r1(x)} ${r1(y)})" fill="#4a3a2a" clip-path="url(#btl)"/>`);
  }
  out.push(`<path d="M${bx - 36},${by - 100} L${bx - 36},${by - 16}" stroke="#ffffff" stroke-width="4" stroke-opacity="0.6"/>`);
  out.push(`<path d="${bottle}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  out.push(`<rect x="${bx - 15}" y="${by - 204}" width="30" height="24" rx="3" fill="#b8905c" stroke="${INK}" stroke-width="1.4"/>`);
  contact(out, bx, by + 4, 60, 6, 0.22);

  return { size: SIZE, view: [0, 268, SIZE, 520], defs: defs.join("\n"), body: out.join("\n") };
}
