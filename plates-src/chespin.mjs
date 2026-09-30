// NO. 0650 — a young chestnut burr, and what a squirrel knows about acorns.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the burr, young and closed. A round husk, fresh light green,
//      covered in soft green spines that stand up in bunches — longest in a
//      crest on top — sitting in its cup of brown bracts on a short twig with
//      one toothed chestnut leaf. The green spined cap the specimen wears.
//   2. The field note's record is quills soft until they are flexed, and a
//      shell thick enough to shrug off a truck.
//   3. The note's point is that the arms race is settled in the handling.
//      Grey squirrels eat white-oak acorns on the spot and cache red-oak ones,
//      because white oaks sprout in autumn and would germinate in the larder;
//      and when they do cache a white-oak acorn, they bite the embryo out
//      first. Fig. 2: a red-oak acorn whole, and a white-oak acorn with its
//      tip bitten away.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "chespin";
export const no = 650;
const SIZE = 800;
const LEAF = { light: "#c4e4a0", base: "#62a852", deep: "#3a7a3a", shade: "#1e4e22", edge: "#1e4e22" };

export function draw() {
  const rand = mulberry32(650);
  const defs = standardDefs(650);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the twig and its toothed leaf
  out.push(`<path d="M150,758 C200,740 260,720 300,690" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M150,758 C200,740 260,720 300,690" fill="none" stroke="#7a5a3a" stroke-width="6" stroke-linecap="round"/>`);
  const lf = blade([[230, 720], [320, 730], [420, 740], [510, 736]], { width: (u) => 36 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.66), lobes: 14, depth: 0.14, start: 0.1, sideVeins: 12, rand });
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, shade: 0.1, margin: 5 });
  // the cup of brown bracts
  out.push(`<path d="M240,690 C250,640 390,640 400,690 C380,712 260,712 240,690 Z" fill="#8a6440" stroke="${INK}" stroke-width="1.6"/>`);
  // the husk
  const cx = 320, cy = 600, R = 108;
  defs.push(`<radialGradient id="hk" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stop-color="#e2f4c0"/><stop offset="0.6" stop-color="#a8d478"/><stop offset="1" stop-color="#6ea44e"/></radialGradient>`);
  out.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#hk)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  // spines in bunches all over; the ones on the rim stand out
  const sp = [];
  for (let k = 0; k < 90; k++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * R * 0.95;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    const out1 = r / R;
    for (let q = 0; q < 3; q++) {
      const aa = a + (q - 1) * 0.35;
      const L = 10 + out1 * 16;
      sp.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(aa) * L)},${r1(Math.sin(aa) * L)}`);
    }
  }
  out.push(`<path d="${sp.join(" ")}" stroke="#4e8a3e" stroke-width="1.6" stroke-linecap="round"/>`);
  // the crest on top: long soft spines in a spray
  for (let k = 0; k < 9; k++) {
    const a = -Math.PI / 2 + (k / 8 - 0.5) * 1.3;
    const pts = [[cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8], [cx + Math.cos(a) * (R + 40), cy + Math.sin(a) * (R + 40)], [cx + Math.cos(a) * (R + 90), cy + Math.sin(a) * (R + 80)]];
    const b = blade(pts, { width: (u) => 13 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 1.3), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id: `c${k}`, palette: { light: "#dcf2b8", base: "#8cc862", deep: "#5a9a44", shade: "#2e6024", edge: "#2e6024" }, defs, out, margin: 2, ink: 1.2, veinOpacity: 0.3 });
  }

  // ── fig. 2: a red-oak acorn whole, a white-oak acorn with its tip bitten ──
  const acorn = (x, y, bitten) => {
    out.push(`<path d="M${x - 20},${y - 20} C${x - 24},${y + 10} ${x - 12},${y + 34} ${x},${y + 38} C${x + 12},${y + 34} ${x + 24},${y + 10} ${x + 20},${y - 20} Z" fill="#b8844a" stroke="${INK}" stroke-width="1.3"/>`);
    if (bitten) out.push(`<path d="M${x - 14},${y + 24} C${x - 8},${y + 16} ${x + 8},${y + 16} ${x + 14},${y + 24} L${x + 10},${y + 34} L${x - 10},${y + 34} Z" fill="#f4ead0" stroke="${INK}" stroke-width="1"/>`);
    out.push(`<path d="M${x - 24},${y - 18} C${x - 24},${y - 44} ${x + 24},${y - 44} ${x + 24},${y - 18} C${x + 12},${y - 12} ${x - 12},${y - 12} ${x - 24},${y - 18} Z" fill="#7a6244" stroke="${INK}" stroke-width="1.2"/>`);
    for (let k = 0; k < 3; k++) out.push(`<path d="M${x - 20 + k * 4},${y - 26 - k * 5} q${20 - k * 4},-4 ${40 - k * 8},0" fill="none" stroke="#4e3e2a" stroke-width="1"/>`);
  };
  acorn(640, 720, false);
  acorn(740, 720, true);
  contact(out, 690, 762, 100, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
