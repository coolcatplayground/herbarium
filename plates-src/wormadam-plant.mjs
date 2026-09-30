// NO. 0413 — a case of leaves, and how a plant hears its neighbours.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the cloak. A bagworm larva builds a case round itself from
//      whatever grows where it lives, and in a meadow that is leaf — pieces
//      cut and silked on in overlapping rows until the case is a cone of
//      green. This one is clad in broad serrated leaves and set with a few
//      small white four-petalled flowers, and it hangs by its silk from a
//      twig: the cloak the specimen wears.
//   2. The field note's record is that its appearance depends on where it
//      evolved, the materials on hand becoming part of its body — which is
//      precisely how a bagworm dresses.
//   3. The note's point is that a plant can tell it has neighbours before any
//      of them shade it: leaves take up red light and pass far-red, so the
//      ratio drops in the light under other foliage, and a plant reading it
//      grows tall and thin to get clear. Fig. 2: two seedlings of one kind,
//      one in open light, one under a leaf — stretched.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "wormadam-plant";
export const no = 413;
const SIZE = 800;
const LEAF = { light: "#bfe0a0", base: "#62a852", deep: "#3a7a3a", shade: "#1e4e22", edge: "#1e4e22" };
const TWIG = "#6e5a3e";

export function draw() {
  const rand = mulberry32(413);
  const defs = standardDefs(413);
  const out = [];
  contact(out, 320, 760, 170, 14);

  // the twig it hangs from, a cut branch standing
  out.push(`<path d="M420,760 C416,660 424,520 418,400 C412,380 380,360 330,352" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M420,760 C416,660 424,520 418,400 C412,380 380,360 330,352" fill="none" stroke="${TWIG}" stroke-width="9" stroke-linecap="round"/>`);
  // the silk
  out.push(`<path d="M322,352 L320,392" stroke="#e8e4d8" stroke-width="2.4"/><path d="M322,352 L320,392" stroke="${INK}" stroke-width="0.6"/>`);
  // the case: rows of overlapping leaf pieces from the top down, each row
  // wider, the last drawn over the first so the rows shingle downward
  const ROWS = 7;
  for (let row = 0; row < ROWS; row++) {
    const y = 400 + row * 40, halfW = 30 + row * 20 - (row > 4 ? (row - 4) * 22 : 0);
    const n = 3 + Math.min(row, 4);
    for (let k = 0; k < n; k++) {
      const x = 320 - halfW + (k + 0.5) * ((2 * halfW) / n) + (rand() - 0.5) * 6;
      const b = blade([[x, y - 10], [x + (rand() - 0.5) * 6, y + 24], [x + (x - 320) * 0.12, y + 58]], {
        width: (u) => (12 + halfW / n) * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.7), lobes: 5, depth: 0.2, start: 0.35, sideVeins: 2, rand,
      });
      paintBlade(b, { id: `c${row}${k}`, palette: LEAF, defs, out, shade: 0.1 + row * 0.03, margin: 2, ink: 1.1, veinOpacity: 0.3 });
    }
  }
  // the small white flowers worked into it
  for (const [x, y] of [[282, 520], [356, 540], [318, 610]]) {
    for (let q = 0; q < 4; q++) {
      const a = (q / 4) * Math.PI * 2 + 0.4;
      out.push(`<ellipse cx="${r1(x + Math.cos(a) * 8)}" cy="${r1(y + Math.sin(a) * 8)}" rx="8" ry="5.4" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(x + Math.cos(a) * 8)} ${r1(y + Math.sin(a) * 8)})" fill="#fbfaf2" stroke="${INK}" stroke-width="0.9"/>`);
    }
    out.push(`<circle cx="${x}" cy="${y}" r="3.6" fill="#b8d08a" stroke="${INK}" stroke-width="0.6"/>`);
  }

  // ── fig. 2: open light, and under a leaf ─────────────────────────────────
  const seedling = (x, h, spread) => {
    const g = 768;
    out.push(`<path d="M${x},${g} L${x},${g - h}" stroke="${INK}" stroke-width="4"/><path d="M${x},${g} L${x},${g - h}" stroke="#86b262" stroke-width="2.4"/>`);
    for (const s of [-1, 1]) {
      const b = blade([[x, g - h], [x + s * spread * 0.5, g - h - 10], [x + s * spread, g - h - 4]], { width: (u) => (spread / 3) * Math.sin(Math.PI * Math.min(1, 0.06 + u * 0.94)) + 0.6, rand });
      paintBlade(b, { id: `s${x}${s}`, palette: LEAF, defs, out, margin: 1.4, midrib: false, ink: 1 });
    }
  };
  seedling(630, 50, 34);
  seedling(736, 140, 22);
  // the leaf overhead, and the light it lets through, reddened
  const over = blade([[680, 596], [730, 584], [790, 594]], { width: (u) => 18 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), rand });
  paintBlade(over, { id: "ov", palette: LEAF, defs, out, margin: 2, ink: 1.1 });
  out.push(`<path d="M720,610 L724,640 M740,608 L742,640 M760,610 L758,640" stroke="#c8402e" stroke-width="1.4" stroke-dasharray="3 3"/>`);
  out.push(`<path d="M610,640 L620,670 M636,636 L636,670 M660,640 L652,670" stroke="#e8b84b" stroke-width="1.6" stroke-dasharray="3 3"/>`);
  contact(out, 684, 770, 100, 6, 0.2);

  return { size: SIZE, view: [0, 330, SIZE, 460], defs: defs.join("\n"), body: out.join("\n") };
}
