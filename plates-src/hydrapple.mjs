// NO. 1019 — a grafted apple tree, and the root that decides its size.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a grafted apple. A young tree cut back to a short trunk on
//      its rootstock — the graft union a swollen knuckle where the two were
//      joined — carrying one great glossy red apple hung low on a curving
//      spur, syrup-bright, with a green vine of new shoot winding up and away
//      from it. The field note files it as a grafted fruit tree: the red
//      apple and the green that coils from it are the specimen.
//   2. The record counts many minds in one apple, powerful only when their
//      moods align — and most apples cannot pollinate themselves, so an
//      orchard needs varieties that flower at the same time.
//   3. The note's point is that the root decides how big the tree gets.
//      Dwarfing rootstocks, the Malling series worked out in England in the
//      1910s and 20s, hold a grafted variety to a fraction of its natural
//      size and bring it into bearing years sooner. Fig. 2: the same variety
//      on three rootstocks, standard, semi-dwarf, dwarf.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "hydrapple";
export const no = 1019;
const SIZE = 800;
const LEAF = { light: "#d4ecb0", base: "#6ab058", deep: "#3e8a3e", shade: "#1e5a24", edge: "#1e5a24" };

export function draw() {
  const rand = mulberry32(1019);
  const defs = standardDefs(1019);
  const out = [];
  contact(out, 300, 758, 220, 16);

  // the rootstock, the graft union, and the short trunk
  out.push(`<path d="M190,760 C200,740 210,720 212,690 L248,690 C250,720 260,740 270,760 Z" fill="#7a6048" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<ellipse cx="230" cy="686" rx="28" ry="14" fill="#8a6a4e" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M214,684 C212,640 220,600 232,560 L252,560 C248,600 244,640 246,684 Z" fill="#8a6a4e" stroke="${INK}" stroke-width="1.6"/>`);
  // the spur, curving out, and the great apple hung low on it
  out.push(`<path d="M244,590 C300,570 360,560 390,580" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M244,590 C300,570 360,560 390,580" fill="none" stroke="#8a6a4e" stroke-width="7" stroke-linecap="round"/>`);
  const cx = 400, cy = 670, R = 96;
  defs.push(`<radialGradient id="ap" cx="0.36" cy="0.28" r="0.85"><stop offset="0" stop-color="#f28a7a"/><stop offset="0.35" stop-color="#d8242e"/><stop offset="1" stop-color="#6e0e14"/></radialGradient>`);
  out.push(`<path d="M${cx},${cy - R * 0.78} C${cx + R * 0.3},${cy - R * 1.02} ${cx + R * 1.08},${cy - R * 0.9} ${cx + R},${cy - R * 0.1} C${cx + R * 0.96},${cy + R * 0.66} ${cx + R * 0.5},${cy + R * 0.96} ${cx},${cy + R * 0.94} C${cx - R * 0.5},${cy + R * 0.96} ${cx - R * 0.96},${cy + R * 0.66} ${cx - R},${cy - R * 0.1} C${cx - R * 1.08},${cy - R * 0.9} ${cx - R * 0.3},${cy - R * 1.02} ${cx},${cy - R * 0.78} Z" fill="url(#ap)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="${cx - 34}" cy="${cy - 44}" rx="22" ry="13" transform="rotate(-30 ${cx - 34} ${cy - 44})" fill="#ffffff" fill-opacity="0.55" filter="url(#sheen)"/>`);
  out.push(`<path d="M${cx},${cy - R * 0.76} L392,582" stroke="${INK}" stroke-width="3"/>`);
  // the green shoot winding up and away from the spur
  const pts = [];
  for (let k = 0; k <= 50; k++) { const t = k / 50; pts.push([392 + t * 60 + Math.sin(t * Math.PI * 4) * 18, 578 - t * 230]); }
  const d = smooth(pts);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#6ab058" stroke-width="7" stroke-linecap="round"/>`);
  for (const i of [14, 28, 42, 50]) {
    const [x, y] = pts[i], s = i % 28 ? 1 : -1;
    const b = blade([[x, y], [x + s * 30, y - 20], [x + s * 60, y - 16]], { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), lobes: 8, depth: 0.08, start: 0.2, sideVeins: 3, rand });
    paintBlade(b, { id: `l${i}`, palette: LEAF, defs, out, margin: 3 });
  }

  // ── fig. 2: one variety on three rootstocks ───────────────────────────────
  const tree = (x, h, w) => {
    const g = 766;
    out.push(`<path d="M${x - 3},${g} L${x - 2},${g - h * 0.4} L${x + 2},${g - h * 0.4} L${x + 3},${g} Z" fill="#7a6048" stroke="${INK}" stroke-width="1"/>`);
    out.push(`<ellipse cx="${x}" cy="${g - h * 0.7}" rx="${w}" ry="${h * 0.34}" fill="#4e9a4a" stroke="${INK}" stroke-width="1.2"/>`);
    for (let k = 0; k < Math.round(w / 6); k++) out.push(`<circle cx="${r1(x - w * 0.7 + rand() * w * 1.4)}" cy="${r1(g - h * 0.7 + (rand() - 0.5) * h * 0.4)}" r="2.6" fill="#d8242e"/>`);
  };
  tree(620, 170, 44);
  tree(706, 110, 30);
  tree(766, 64, 18);
  contact(out, 690, 768, 110, 5, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.join("\n"), body: out.join("\n") };
}
