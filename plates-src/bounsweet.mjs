// NO. 0761 — a sweet fruit, and where its sugar comes from.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the fruit. Round, glossy, deep magenta above, the colour
//      giving way to cream at its foot where the sun has not reached, with a
//      small dry point at the bottom; and on top two broad green sepals
//      spread out flat like leaves from a short stalk — the fruit and the
//      leafy cap the specimen is.
//   2. The field note's record is a fruit that gives off a delicious smell,
//      that birds are always after, and that spins its sepals to resist.
//   3. The note's point is that sweetness is imported, not made on the spot.
//      A fruit is a sink: it makes little sugar of its own and draws sucrose
//      in through the phloem from leaves that may be metres away. Which is why
//      the picking date is final for most fruit — cut off, the supply stops.
//      Fig. 2: a leaf making sugar, the stalk carrying it, the fruit filling.
import { mulberry32, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "bounsweet";
export const no = 761;
const SIZE = 800;
const SEPAL = { light: "#c8eca0", base: "#6ab85a", deep: "#3e8a3e", shade: "#1e5424", edge: "#1e5424" };

export function draw() {
  const rand = mulberry32(761);
  const defs = standardDefs(761);
  const out = [];
  contact(out, 320, 758, 180, 16);

  // the fruit: glossy magenta above, cream at its foot
  const cx = 320, cy = 620, R = 140;
  defs.push(`<linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e05a8e"/><stop offset="0.55" stop-color="#b82a64"/><stop offset="0.72" stop-color="#d87aa0"/><stop offset="0.86" stop-color="#fbf2ec"/><stop offset="1" stop-color="#e8dcd4"/></linearGradient>`);
  out.push(`<path d="M${cx},${cy - R} C${cx + R * 1.1},${cy - R} ${cx + R * 1.1},${cy + R * 0.9} ${cx},${cy + R} C${cx - R * 1.1},${cy + R * 0.9} ${cx - R * 1.1},${cy - R} ${cx},${cy - R} Z" fill="url(#fr)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="${cx - 50}" cy="${cy - 70}" rx="34" ry="18" transform="rotate(-30 ${cx - 50} ${cy - 70})" fill="#ffffff" fill-opacity="0.5" filter="url(#sheen)"/>`);
  out.push(`<path d="M${cx - 6},${cy + R - 4} L${cx},${cy + R + 8} L${cx + 6},${cy + R - 4} Z" fill="#6e4a3a"/>`);
  // the short stalk and the two broad sepals spread flat from it
  out.push(`<path d="M${cx},${cy - R + 6} L${cx + 4},${cy - R - 30}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${cx},${cy - R + 6} L${cx + 4},${cy - R - 30}" stroke="#6a8a44" stroke-width="6" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[cx, cy - R + 4], [cx + s * 70, cy - R - 20], [cx + s * 150, cy - R - 10], [cx + s * 190, cy - R + 20]], {
      width: (u) => 50 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.8), 0.62), sideVeins: 5, rand,
    });
    paintBlade(b, { id: `s${s}`, palette: SEPAL, defs, out, shade: s > 0 ? 0.2 : 0, margin: 6 });
  }

  // ── fig. 2: a leaf making sugar, the stalk carrying it, the fruit filling ──
  const fx = 690;
  const lf = blade([[fx - 90, 620], [fx - 40, 590], [fx + 10, 596]], { width: (u) => 22 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), sideVeins: 3, rand });
  paintBlade(lf, { id: "lf", palette: SEPAL, defs, out, margin: 2, ink: 1.1 });
  out.push(`<path d="M${fx + 10},596 C${fx + 40},600 ${fx + 60},630 ${fx + 60},690" fill="none" stroke="${INK}" stroke-width="4"/><path d="M${fx + 10},596 C${fx + 40},600 ${fx + 60},630 ${fx + 60},690" fill="none" stroke="#6a8a44" stroke-width="2.4"/>`);
  out.push(`<circle cx="${fx + 60}" cy="716" r="26" fill="#c83a70" stroke="${INK}" stroke-width="1.4"/>`);
  // sugar moving from leaf to fruit
  for (const [x, y] of [[fx - 30, 604], [fx + 20, 600], [fx + 46, 622], [fx + 58, 660], [fx + 56, 712], [fx + 66, 720]]) out.push(`<circle cx="${x}" cy="${y}" r="3" fill="#f2cf3e" stroke="${INK}" stroke-width="0.5"/>`);
  out.push(`<path d="M${fx + 76},630 L${fx + 76},676" stroke="${INK}" stroke-width="1.2"/><path d="M${fx + 71},668 L${fx + 76},676 L${fx + 81},668" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  contact(out, fx + 30, 746, 90, 5, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
