// NO. 0906 — a sprig of catnip, and the haze a forest breathes out.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a sprig of catnip. A square stem, soft and grey-green,
//      with leaves in opposite pairs — heart-shaped, scalloped at the edge,
//      downy, paler beneath — and at its top a short spike of small white
//      lipped flowers dotted with purple. The soft pale green, and the leaf-
//      shaped marks, the specimen wears.
//   2. The field note's record is a sweet scent that grows stronger in the
//      sun, which is simply true of aromatic plants.
//   3. The note's point is that the haze over a forested range is the plants
//      breathing out. Oaks, poplars and conifers give off isoprene and other
//      terpenes in quantity on hot days — enough that they oxidise into fine
//      particles that scatter blue light, which is how the Blue Ridge and the
//      Smoky Mountains got their names. Fig. 2: ridges fading into blue.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "sprigatito";
export const no = 906;
const SIZE = 800;
const LEAF = { light: "#e2f0d0", base: "#a8cc8a", deep: "#6e9a5a", shade: "#3e6034", edge: "#3e6034" };

export function draw() {
  const rand = mulberry32(906);
  const defs = standardDefs(906);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the square stem, rising
  out.push(`<path d="M318,760 C320,660 316,560 322,420" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M318,760 C320,660 316,560 322,420" fill="none" stroke="#8ab070" stroke-width="7" stroke-linecap="round"/><path d="M318,760 C320,660 316,560 322,420" fill="none" stroke="#c8e0b0" stroke-width="1.6" transform="translate(-2 0)"/>`);
  // opposite pairs of heart-shaped scalloped leaves, largest at the bottom
  const PAIRS = [[700, 110], [620, 100], [540, 86], [470, 66]];
  PAIRS.forEach(([y, L], i) => {
    for (const s of [-1, 1]) {
      const a = s > 0 ? -0.35 : Math.PI + 0.35;
      const pts = [[320, y], [320 + Math.cos(a) * L * 0.4, y + Math.sin(a) * L * 0.4 - 6], [320 + Math.cos(a) * L, y + Math.sin(a) * L + 10]];
      const b = blade(pts, { width: (u) => L * 0.42 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.02 + u * 0.98) ** 1.4), 0.6), lobes: 7, depth: 0.14, start: 0.1, teeth: "round", sideVeins: 4, rand });
      paintBlade(b, { id: `p${i}${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.15 : 0, margin: 5 });
    }
  });
  // the flower spike at its top: small white lipped flowers dotted purple
  // a tapering cone of whorls, each whorl a ring of small florets
  for (let w = 0; w < 7; w++) {
    const y = 440 - w * 16, R = 26 - w * 3;
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2 + w * 0.4, x = 322 + Math.cos(a) * R;
      const yy = y + Math.sin(a) * R * 0.3;
      out.push(`<ellipse cx="${r1(x)}" cy="${r1(yy)}" rx="6" ry="4.4" fill="${Math.sin(a) > 0 ? "#fbfaf4" : "#e8e0ec"}" stroke="${INK}" stroke-width="0.7"/><circle cx="${r1(x)}" cy="${r1(yy + 1)}" r="1.3" fill="#8a5aa8"/>`);
    }
  }

  // ── fig. 2: ridges fading into blue haze ──────────────────────────────────
  const fx = 690;
  out.push(`<rect x="${fx - 100}" y="620" width="200" height="146" rx="4" fill="#eef2f4" stroke="${INK}" stroke-width="1.2"/>`);
  const RIDGES = [["#c8d4e8", 660], ["#a8b8d8", 684], ["#8a9cc8", 708], ["#5e7a8a", 732], ["#3e6a4a", 752]];
  RIDGES.forEach(([c, y], k) => {
    const pts = [];
    for (let j = 0; j <= 20; j++) pts.push(`${j ? "L" : "M"}${r1(fx - 100 + j * 10)},${r1(y - 18 * Math.sin(j * 0.5 + k * 1.3) - 8 * Math.sin(j * 1.3 + k))}`);
    out.push(`<path d="${pts.join(" ")} L${fx + 100},766 L${fx - 100},766 Z" fill="${c}"/>`);
  });
  out.push(`<rect x="${fx - 100}" y="620" width="200" height="146" rx="4" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  contact(out, fx, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 330, SIZE, 460], defs: defs.join("\n"), body: out.join("\n") };
}
