// NO. 0810 — a stick with a sprout on it, and the colour a leaf gives back.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the stick. A short length of branch, cut at both ends, pale
//      bark with a darker knot — and from a bud on it, a sprout: one pair of
//      bright young leaves opening. The stick the specimen drums with, and
//      the leaf it wears.
//   2. The field note's record is a beat that revitalises the plants nearby.
//   3. The note's point is that the most visible thing chlorophyll does is
//      leave. Autumn yellow is not made in autumn: the carotenoids were in
//      the leaf all summer, masked by the green, and they show as the
//      chlorophyll is dismantled and its nitrogen drawn back into the twig
//      for next year. Fig. 2: one leaf twice — in summer, and in autumn with
//      the green gone and the yellow that was always there.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "grookey";
export const no = 810;
const SIZE = 800;
const LEAF = { light: "#d4f0a8", base: "#7cc454", deep: "#4e9440", shade: "#2a5e24", edge: "#2a5e24" };
const YELLOW = { light: "#fff4b0", base: "#f2cf3e", deep: "#c8a02a", shade: "#8a6a1e", edge: "#8a6a1e" };

export function draw() {
  const rand = mulberry32(810);
  const defs = standardDefs(810);
  const out = [];
  contact(out, 320, 758, 230, 14);

  // the stick, lying at a slant, cut at both ends
  const x0 = 110, y0 = 744, x1 = 530, y1 = 690;
  defs.push(`<linearGradient id="bk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8b88a"/><stop offset="0.5" stop-color="#a8845a"/><stop offset="1" stop-color="#6e5438"/></linearGradient>`);
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * 18, ny = Math.cos(a) * 18;
  out.push(`<path d="M${r1(x0 + nx)},${r1(y0 + ny)} L${r1(x1 + nx)},${r1(y1 + ny)} L${r1(x1 - nx)},${r1(y1 - ny)} L${r1(x0 - nx)},${r1(y0 - ny)} Z" fill="url(#bk)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (const [x, y] of [[x0, y0], [x1, y1]]) out.push(`<ellipse cx="${x}" cy="${y}" rx="7" ry="18" transform="rotate(${r1((a * 180) / Math.PI)} ${x} ${y})" fill="#f2e2c0" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="3" ry="8" transform="rotate(${r1((a * 180) / Math.PI)} ${x} ${y})" fill="none" stroke="#c8a878" stroke-width="1"/>`);
  out.push(`<ellipse cx="250" cy="726" rx="12" ry="7" fill="#6e5438" stroke="${INK}" stroke-width="1"/>`);
  // the sprout from a bud on its top: a short stem, one pair of leaves
  const bx = 360, by = 708;
  out.push(`<path d="M${bx},${by} C${bx - 2},${by - 30} ${bx + 4},${by - 50} ${bx + 2},${by - 70}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${bx},${by} C${bx - 2},${by - 30} ${bx + 4},${by - 50} ${bx + 2},${by - 70}" fill="none" stroke="#6a9a4a" stroke-width="6" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[bx + 2, by - 68], [bx + s * 40, by - 118], [bx + s * 80, by - 150], [bx + s * 96, by - 190]], { width: (u) => 38 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.85), 0.68), sideVeins: 5, rand });
    paintBlade(b, { id: `l${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 5 });
  }

  // ── fig. 2: one leaf in summer, and in autumn ─────────────────────────────
  const leaf = (x, pal, id) => {
    const b = blade([[x, 766], [x - 2, 700], [x + 2, 630], [x + 6, 590]], { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.68), sideVeins: 5, rand });
    paintBlade(b, { id, palette: pal, defs, out, margin: 4 });
  };
  leaf(640, LEAF, "su");
  leaf(740, YELLOW, "au");
  out.push(`<path d="M670,650 L706,650" stroke="${INK}" stroke-width="1.4"/><path d="M700,645 L706,650 L700,655" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 460, SIZE, 330], defs: defs.join("\n"), body: out.join("\n") };
}
