// NO. 0152 — a juvenile leaf.
//
// What the morphology says, and what each observation became:
//
//   1. Two parts, and only two: the leaf and the collar of buds. The leaf is
//      large for the plant that carries it — elliptical, pointed, rising on a
//      short stalk and leaning forward. The first true leaf of a seedling.
//   2. Round its foot, a ring of small seed-like buds, round, glossy and
//      dark, set in a circle like a necklace. Nothing else of the plant is
//      shown.
//   3. The field note's point is heteroblasty: juvenile leaves can differ so
//      completely from adult ones that the two have been named as different
//      species. The New Zealand lancewood spends its first fifteen years
//      hung with long, stiff, toothed, mottled leaves pointing down — then,
//      once it clears the height a moa could reach, switches to short plain
//      ones held up. Fig. 2: one stem, one leaf of each.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "chikorita";
export const no = 152;
const SIZE = 800;
const LEAF = { light: "#dcebb8", base: "#94cf86", deep: "#5f9c5e", shade: "#3c6b3e", edge: "#40703f" };
const BUD = { light: "#9fd48f", base: "#6fae65", deep: "#3f7a44", shade: "#28502c", edge: "#28502c" };
const LANCE = { light: "#a39a78", base: "#6f6a4c", deep: "#44402c", shade: "#2a271a", edge: "#2a271a" };
const ADULT = { light: "#b9d68e", base: "#7ba858", deep: "#4c7438", shade: "#2e4a22", edge: "#2e4a22" };

export function draw() {
  const rand = mulberry32(152);
  const defs = standardDefs(152);
  const out = [];
  const bx = 300, by = 728;
  contact(out, bx + 20, 752, 150, 14);

  // the ring of buds, round as seeds; the far half first
  // Drawn as round beads: organ hulls this small came out as hexagons, and
  // pointed ovoids read as petals.
  defs.push(`<radialGradient id="bead" cx="0.36" cy="0.32" r="0.72"><stop offset="0" stop-color="${BUD.light}"/><stop offset="0.55" stop-color="${BUD.base}"/><stop offset="1" stop-color="${BUD.deep}"/></radialGradient>`);
  const ring = [];
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + 0.2;
    ring.push({ x: bx + Math.cos(a) * 60, y: by - 22 + Math.sin(a) * 17, z: Math.sin(a) });
  }
  const bud = ({ x, y, z }) => {
    const r = 16.5 + z * 2;
    out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(r)}" ry="${r1(r * 1.04)}" fill="url(#bead)" stroke="${INK}" stroke-width="1.5"/>`);
    out.push(`<ellipse cx="${r1(x - r * 0.3)}" cy="${r1(y - r * 0.36)}" rx="${r1(r * 0.3)}" ry="${r1(r * 0.18)}" fill="#e6f5d6" fill-opacity="0.75"/>`);
  };
  ring.filter((q) => q.z < 0).sort((p, q) => p.z - q.z).forEach(bud);

  // the leaf: a short stalk, then a broad blade rising and leaning forward to
  // a point
  const leaf = blade([[bx, by + 4], [bx + 2, by - 70], [bx + 20, by - 170], [bx + 58, by - 262], [bx + 112, by - 338], [bx + 180, by - 388]], {
    width: (u) => 9 * Math.max(0, 1 - u * 5) + 70 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.02 + u * 0.98) ** 0.95), 0.72) * Math.min(1, Math.max(0, u - 0.08) * 6), sideVeins: 11, rand,
  });
  paintBlade(leaf, { id: "lf", palette: LEAF, defs, out, margin: 8 });
  ring.filter((q) => q.z >= 0).sort((p, q) => p.z - q.z).forEach(bud);

  // ── fig. 2: the lancewood's two leaves on one stem ─────────────────────────
  const fx = 690, fy = 560;
  const figFrom = out.length;
  out.push(`<path d="M${fx},${fy + 200} L${fx},${fy}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${fx},${fy + 200} L${fx},${fy}" stroke="#8a7650" stroke-width="3.6" stroke-linecap="round"/>`);
  // juvenile: long, stiff, toothed, mottled, pointing down
  const juv = blade([[fx, fy + 40], [fx - 30, fy + 100], [fx - 54, fy + 180]], {
    width: (u) => 8 * Math.sin(Math.PI * Math.min(1, 0.04 + u)) + 1, lobes: 12, depth: 0.5, lean: -0.4, rand,
  });
  paintBlade(juv, { id: "juv", palette: LANCE, defs, out, margin: 2, midrib: true, ink: 1.2 });
  for (let k = 1; k < 7; k++) {
    const [x, y] = juv.spine[Math.round((k / 7) * (juv.spine.length - 1))];
    out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="3" ry="5" fill="#2e2a1c" fill-opacity="0.5"/>`);
  }
  // adult: short, plain, held up
  const adult = blade([[fx, fy + 20], [fx + 20, fy - 20], [fx + 34, fy - 64]], {
    width: (u) => 13 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.97)), 0.7), sideVeins: 4, rand,
  });
  paintBlade(adult, { id: "adl", palette: ADULT, defs, out, margin: 3, ink: 1.2 });
  contact(out, fx, fy + 202, 30, 5, 0.2);
  out.push(`<g transform="translate(${fx} ${fy + 204}) scale(1.35) translate(${-fx} ${-(fy + 204)})">${out.splice(figFrom).join("\n")}</g>`);

  return { size: SIZE, view: [0, 300, SIZE, 480], defs: defs.join("\n"), body: out.join("\n") };
}
