// NO. 0549 — an orange flower with a crown, and the tulips a virus painted.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the flower. A single bloom held up on a stem between two
//      long leaves — broad, cupped orange-red petals, five of them, opening
//      into a bowl, and rising from its heart a crown of yellow stamens on
//      long filaments, each tipped with a knob of pollen. The orange flower
//      with the yellow crown the specimen wears.
//   2. The field note's record prices it: oils from its flowers are
//      staggeringly expensive, as rose otto is, by sheer arithmetic.
//   3. The note's point is that the most valuable flowers ever traded were
//      diseased. The flamed and feathered tulips of the seventeenth-century
//      Dutch market took their patterns from a virus that breaks the base
//      colour into streaks — and weakens the bulb as it does. Fig. 2: two
//      tulips, a plain one and a "broken" one, flamed.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "lilligant";
export const no = 549;
const SIZE = 800;
const PETAL = { light: "#fbc08a", base: "#ec7e40", deep: "#c4522a", shade: "#7a2e18" };
const LEAF = { light: "#c4e8a8", base: "#5ab05a", deep: "#347e3a", shade: "#1e5024", edge: "#1e5024" };

export function draw() {
  const rand = mulberry32(549);
  const defs = standardDefs(549);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the stem, and the two long leaves either side of it
  out.push(`<path d="M318,760 C316,680 322,600 320,540" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M318,760 C316,680 322,600 320,540" fill="none" stroke="#5a9a4a" stroke-width="7" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const pts = [[318, 720], [318 + s * 60, 660], [318 + s * 120, 600], [318 + s * 150, 520]];
    const b = blade(pts, { width: (u) => 40 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.66), sideVeins: 5, rand });
    paintBlade(b, { id: `l${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 6 });
  }
  // the flower: a bowl of five cupped petals, the back ones first
  const cx = 320, cy = 470;
  defs.push(`<linearGradient id="pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PETAL.light}"/><stop offset="0.55" stop-color="${PETAL.base}"/><stop offset="1" stop-color="${PETAL.deep}"/></linearGradient>`);
  const petal = (dx, top, w, h, dark) => {
    const x = cx + dx;
    const d = `M${x - w * 0.3},${cy + 60} C${x - w},${cy + 30} ${x - w * 1.05},${top + 20} ${x - w * 0.6},${top} C${x - w * 0.2},${top - 14} ${x + w * 0.2},${top - 14} ${x + w * 0.6},${top} C${x + w * 1.05},${top + 20} ${x + w},${cy + 30} ${x + w * 0.3},${cy + 60} Z`;
    out.push(`<path d="${d}" fill="${dark ? PETAL.deep : PETAL.base}"/><path d="${d}" fill="url(#pt)" fill-opacity="${dark ? 0.5 : 0.9}" filter="url(#wc)"/>`);
    out.push(`<path d="M${x},${cy + 50} C${x - 4},${top + 60} ${x + 4},${top + 30} ${x},${top + 6}" fill="none" stroke="${PETAL.shade}" stroke-width="1.2" stroke-opacity="0.4"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.7" filter="url(#pen)"/>`);
  };
  petal(-46, cy - 90, 50, 0, true);
  petal(46, cy - 90, 50, 0, true);
  // the crown of stamens, rising from the heart behind the front petals
  for (let k = 0; k < 9; k++) {
    const a = -Math.PI / 2 + (k / 8 - 0.5) * 1.6;
    const L = 90 + Math.cos((k / 8 - 0.5) * 2) * 30;
    const tx = cx + Math.cos(a) * L * 0.8, ty = cy - 10 + Math.sin(a) * L;
    out.push(`<path d="M${cx},${cy} Q${r1((cx + tx) / 2 + Math.cos(a) * 6)},${r1((cy + ty) / 2)} ${r1(tx)},${r1(ty)}" fill="none" stroke="${INK}" stroke-width="3.6"/><path d="M${cx},${cy} Q${r1((cx + tx) / 2 + Math.cos(a) * 6)},${r1((cy + ty) / 2)} ${r1(tx)},${r1(ty)}" fill="none" stroke="#dce8a0" stroke-width="2"/>`);
    out.push(`<ellipse cx="${r1(tx)}" cy="${r1(ty)}" rx="8" ry="6" fill="#f2cf3e" stroke="${INK}" stroke-width="1.1"/>`);
  }
  petal(-78, cy - 40, 52, 0, false);
  petal(78, cy - 40, 52, 0, false);
  petal(0, cy - 20, 60, 0, false);
  void rand;

  // ── fig. 2: a plain tulip, and a broken one ───────────────────────────────
  const tulip = (x, broken) => {
    const g = 766;
    out.push(`<path d="M${x},${g} L${x},${g - 110}" stroke="${INK}" stroke-width="4"/><path d="M${x},${g} L${x},${g - 110}" stroke="#5a9a4a" stroke-width="2.4"/>`);
    const d = `M${x - 26},${g - 150} C${x - 30},${g - 112} ${x - 16},${g - 100} ${x},${g - 100} C${x + 16},${g - 100} ${x + 30},${g - 112} ${x + 26},${g - 150} L${x + 14},${g - 136} L${x},${g - 156} L${x - 14},${g - 136} Z`;
    out.push(`<path d="${d}" fill="${broken ? "#fbf2dc" : "#d8434e"}" stroke="${INK}" stroke-width="1.4"/>`);
    if (broken) {
      const flames = [];
      for (const dx of [-18, -8, 2, 12, 20]) flames.push(`M${x + dx * 0.6},${g - 104} C${x + dx},${g - 120} ${x + dx * 1.2 - 4},${g - 134} ${x + dx * 1.1},${g - 148}`);
      out.push(`<path d="${flames.join(" ")}" fill="none" stroke="#b8243a" stroke-width="3.4" stroke-linecap="round"/>`);
    }
  };
  tulip(640, false);
  tulip(740, true);
  contact(out, 690, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 340, SIZE, 450], defs: defs.join("\n"), body: out.join("\n") };
}
