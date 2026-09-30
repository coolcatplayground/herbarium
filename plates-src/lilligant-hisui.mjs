// NO. 0549 (Hisui) — a mountain flower on a hard stem, and a defence budget.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the mountain form of the flower. A pale pink bloom of rounded
//      petals, with a whorl of pale lilac in its heart, held on a long, wiry,
//      purplish stem — and down that stem, stiff narrow leaves, curved and
//      hard-edged, springing out in pairs like blades. The long leggy stem
//      and the pink flower the specimen carries.
//   2. The record is the ordinary form's: essential oils from its flowers,
//      staggeringly expensive.
//   3. The note's point is that the trade in this form's numbers is a real
//      one. A defence budget is finite, and a plant invests in chemistry —
//      alkaloids and glycosides, costly to make and to store — or in structure
//      — fibre, thick walls, hard edges, cheap per gram and slow to build.
//      Alpine plants, under cold and wind, lean to structure. Fig. 2: a leaf
//      defended by chemistry, spotted with its toxin cells, and one defended
//      by structure, thick-edged and fibrous.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "lilligant-hisui";
export const no = 549;
const SIZE = 800;
const LEAF = { light: "#c8e4b0", base: "#5e9a4a", deep: "#3a6e34", shade: "#1e4420", edge: "#1e4420" };

export function draw() {
  const rand = mulberry32(5490);
  const defs = standardDefs(5490);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the long wiry purplish stem
  out.push(`<path d="M318,760 C314,650 326,540 320,430" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M318,760 C314,650 326,540 320,430" fill="none" stroke="#8a5a8a" stroke-width="5" stroke-linecap="round"/>`);
  // stiff narrow curved leaves in pairs, springing out like blades
  for (const [y, L] of [[700, 150], [610, 130], [520, 100]]) {
    for (const s of [-1, 1]) {
      const pts = [[320, y], [320 + s * L * 0.4, y - 30], [320 + s * L * 0.8, y - 34], [320 + s * L, y - 10]];
      const b = blade(pts, { width: (u) => 14 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.7), sideVeins: 0, rand });
      paintBlade(b, { id: `l${y}${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.15 : 0, margin: 3, ink: 1.5 });
    }
  }
  // the flower: rounded pale-pink petals, and a whorl of pale lilac in its heart
  const cx = 320, cy = 400;
  for (let k = 0; k < 6; k++) {
    const a = -Math.PI / 2 + (k / 6) * Math.PI * 2;
    const px = cx + Math.cos(a) * 44, py = cy + Math.sin(a) * 30;
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="46" ry="30" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="#f6cadc" stroke="${INK}" stroke-width="1.5"/>`);
    out.push(`<path d="M${r1(cx + Math.cos(a) * 14)},${r1(cy + Math.sin(a) * 10)} L${r1(cx + Math.cos(a) * 74)},${r1(cy + Math.sin(a) * 50)}" stroke="#d88aa8" stroke-width="1.1" stroke-opacity="0.6"/>`);
  }
  for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; out.push(`<ellipse cx="${r1(cx + Math.cos(a) * 12)}" cy="${r1(cy + Math.sin(a) * 9)}" rx="14" ry="9" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(cx + Math.cos(a) * 12)} ${r1(cy + Math.sin(a) * 9)})" fill="#d8c0ec" stroke="${INK}" stroke-width="1"/>`); }
  out.push(`<circle cx="${cx}" cy="${cy}" r="6" fill="#f2cf3e"/>`);

  // ── fig. 2: a leaf defended by chemistry, and one by structure ────────────
  const chem = blade([[636, 766], [632, 700], [640, 636]], { width: (u) => 26 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), sideVeins: 4, rand });
  paintBlade(chem, { id: "chem", palette: { light: "#d8f0b8", base: "#86c464", deep: "#5a9a4a", shade: "#2e5a26", edge: "#2e5a26" }, defs, out, margin: 3 });
  for (let k = 0; k < 10; k++) out.push(`<circle cx="${r1(624 + rand() * 24)}" cy="${r1(660 + rand() * 90)}" r="2.2" fill="#8a3a6a"/>`);
  const tough = blade([[744, 766], [740, 700], [748, 636]], { width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), sideVeins: 6, rand });
  paintBlade(tough, { id: "tough", palette: { light: "#a8b890", base: "#4e6a3e", deep: "#2e4424", shade: "#1a2a14", edge: "#1a2a14" }, defs, out, margin: 5, ink: 2.4 });
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 330, SIZE, 460], defs: defs.join("\n"), body: out.join("\n") };
}
