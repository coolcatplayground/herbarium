// NO. 0421 — a flower shut against the dark, and what a bee sees when it opens.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the flower, shut. Nodding on its stalk, its green sepals
//      folded over the top like a cap, and below them the petals closed into
//      a deep plum-purple bell — the form it holds under an overcast sky. A
//      pink tip curls from the stalk above, where the flower bends over.
//   2. The field note's record is a plant on a switch: shut and barely moving
//      as a bud, opening fully in strong sun, folding back if the light
//      fails.
//   3. The note's point is that what an opening flower displays is not what
//      we see it display. Many flowers carry bullseyes and radiating lines in
//      ultraviolet-absorbing pigment, invisible to us and sharp to a bee.
//      Fig. 2: the same flower open, twice — as we see it, plain pink, and as
//      a bee does, with the dark target at its heart.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "cherrim";
export const no = 421;
const SIZE = 800;
const PLUM = { light: "#a888c8", base: "#6e4a9a", deep: "#46286e", shade: "#2a1646" };
const SEPAL = { light: "#b4e09a", base: "#4aa452", deep: "#2c7a38", shade: "#1a4e24", edge: "#1a4e24" };
const PINK = { light: "#f8c4cc", base: "#e4788e", deep: "#b44a62" };

export function draw() {
  const rand = mulberry32(421);
  const defs = standardDefs(421);
  const out = [];
  contact(out, 330, 758, 190, 14);

  // the stalk: up from the ground, bending over to carry the flower nodding
  const st = `M470,760 C476,640 470,520 440,450 C420,408 380,392 340,396`;
  out.push(`<path d="${st}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="${st}" fill="none" stroke="#6a9a4a" stroke-width="8" stroke-linecap="round"/>`);
  // the pink curl at the bend
  out.push(`<path d="M430,420 C420,380 390,360 400,340 C410,322 440,330 436,352 C432,366 414,360 418,348" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M430,420 C420,380 390,360 400,340 C410,322 440,330 436,352 C432,366 414,360 418,348" fill="none" stroke="${PINK.base}" stroke-width="12" stroke-linecap="round"/><path d="M430,420 C420,380 390,360 400,340" fill="none" stroke="${PINK.light}" stroke-width="3.4" transform="translate(-2 0)"/>`);

  // the closed petals: a deep bell hanging under the cap of sepals
  const cx = 330, top = 430;
  const bell = `M${cx - 110},${top} C${cx - 130},${top + 90} ${cx - 120},${top + 190} ${cx - 90},${top + 270} C${cx - 60},${top + 300} ${cx - 20},${top + 250} ${cx},${top + 280} C${cx + 20},${top + 250} ${cx + 60},${top + 300} ${cx + 90},${top + 270} C${cx + 120},${top + 190} ${cx + 130},${top + 90} ${cx + 110},${top} Z`;
  defs.push(`<linearGradient id="pl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${PLUM.light}"/><stop offset="0.45" stop-color="${PLUM.base}"/><stop offset="1" stop-color="${PLUM.deep}"/></linearGradient>`);
  defs.push(`<clipPath id="bc"><path d="${bell}"/></clipPath>`);
  out.push(`<path d="${bell}" fill="url(#pl)"/><path d="${bell}" fill="${PLUM.base}" fill-opacity="0.35" filter="url(#wc)"/>`);
  // the seams where the folded petals meet
  for (const dx of [-60, 0, 60]) out.push(`<path d="M${cx + dx * 0.9},${top + 10} C${cx + dx * 1.2},${top + 110} ${cx + dx * 1.1},${top + 200} ${cx + dx * 0.9},${top + 262}" fill="none" stroke="${PLUM.shade}" stroke-width="1.6" stroke-opacity="0.6" clip-path="url(#bc)"/>`);
  out.push(`<path d="M${cx - 80},${top + 40} C${cx - 90},${top + 120} ${cx - 84},${top + 190} ${cx - 70},${top + 240}" fill="none" stroke="${PLUM.light}" stroke-width="6" stroke-opacity="0.35" clip-path="url(#bc)"/>`);
  out.push(`<path d="${bell}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // the cap of sepals folded over the top
  for (const [a, L] of [[Math.PI + 0.3, 150], [-0.3, 150], [Math.PI + 0.9, 110], [-0.9, 110], [-1.57, 70]]) {
    const pts = [[cx, top - 20], [cx + Math.cos(a) * L * 0.5, top - 20 + Math.sin(a) * L * 0.2 - 18], [cx + Math.cos(a) * L, top + 10 + Math.abs(Math.cos(a)) * 30]];
    const b = blade(pts, { width: (u) => 36 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.7), sideVeins: 3, rand });
    paintBlade(b, { id: `sp${r1(a * 10)}`, palette: SEPAL, defs, out, margin: 4 });
  }

  // ── fig. 2: the open flower as we see it, and as a bee does ───────────────
  const face = (x, y, bee) => {
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
      const px = x + Math.cos(a) * 26, py = y + Math.sin(a) * 26;
      out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="24" ry="17" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="${bee ? "#d8d0a8" : PINK.light}" stroke="${INK}" stroke-width="1.2"/>`);
      if (bee) {
        out.push(`<path d="M${r1(x + Math.cos(a) * 18)},${r1(y + Math.sin(a) * 18)} L${r1(x + Math.cos(a) * 42)},${r1(y + Math.sin(a) * 42)}" stroke="#4a3e5a" stroke-width="2"/>`);
      }
    }
    out.push(`<circle cx="${x}" cy="${y}" r="${bee ? 22 : 12}" fill="${bee ? "#4a3e5a" : PINK.base}" stroke="${INK}" stroke-width="1"/>`);
    out.push(`<circle cx="${x}" cy="${y}" r="7" fill="#f2cf3e" stroke="${INK}" stroke-width="0.8"/>`);
  };
  face(632, 700, false);
  face(744, 700, true);
  contact(out, 688, 760, 110, 6, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.join("\n"), body: out.join("\n") };
}
