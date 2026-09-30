// NO. 0898 — a turnip crowned in dark leaf, and what a "root vegetable" is.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the crown. A pale turnip, white shading to lilac at its
//      shoulder, its taproot tail drawn to a thread — and bursting from its
//      top a great rounded head of dark-green leaves folded close over one
//      another like the outer leaves of a cabbage, pale ribs showing. The
//      dark-green crown over white the specimen wears.
//   2. The field note's record is a king who made plants spring forth.
//   3. The note's point is that "root vegetable" is a kitchen word, not a
//      botanical one. A carrot is a swollen taproot; a potato is a stem,
//      thickened underground, and its eyes are buds; a sweet potato is a root
//      thickened another way, with no buds to cut it by. Fig. 2: a carrot and
//      a potato cut, the potato's eyes sprouting — which a root cannot do.
import { mulberry32, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "calyrex";
export const no = 898;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(898);
  const defs = standardDefs(898);
  const out = [];
  contact(out, 320, 758, 180, 16);

  // the turnip: round, white below, lilac at the shoulder, a thread of root
  const cx = 320, cy = 650, R = 96;
  defs.push(`<linearGradient id="tp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a888c8"/><stop offset="0.35" stop-color="#e8dcf0"/><stop offset="0.7" stop-color="#fbfaf4"/><stop offset="1" stop-color="#e8e4d8"/></linearGradient>`);
  out.push(`<path d="M${cx},${cy + R} C${cx + 6},${cy + R + 8} ${cx + 10},${cy + R + 12} ${cx + 22},${cy + R + 12}" fill="none" stroke="${INK}" stroke-width="2"/>`);
  out.push(`<path d="M${cx - R},${cy} C${cx - R},${cy - R * 0.8} ${cx + R},${cy - R * 0.8} ${cx + R},${cy} C${cx + R},${cy + R * 0.7} ${cx + 20},${cy + R} ${cx},${cy + R + 6} C${cx - 20},${cy + R} ${cx - R},${cy + R * 0.7} ${cx - R},${cy} Z" fill="url(#tp)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  for (let k = 0; k < 5; k++) out.push(`<path d="M${cx - 60 + k * 30},${cy + 30 + (k % 2) * 10} l14,1" stroke="#b8b0a0" stroke-width="1.2"/>`);
  // the short pale leaf-stalks rising from its top into the crown. (Drawn as a
  // row of pale points under the dark crown, the leaf-bases read as teeth.)
  for (const dx of [-40, -14, 12, 38]) out.push(`<path d="M${cx + dx * 0.6},${cy - 60} C${cx + dx * 0.8},${cy - 90} ${cx + dx},${cy - 110} ${cx + dx * 1.3},${cy - 140}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M${cx + dx * 0.6},${cy - 60} C${cx + dx * 0.8},${cy - 90} ${cx + dx},${cy - 110} ${cx + dx * 1.3},${cy - 140}" fill="none" stroke="#dce8c8" stroke-width="8" stroke-linecap="round"/>`);
  // the crown: dark leaves folded close over one another in a rounded head
  const hy = 450;
  defs.push(`<radialGradient id="cr" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#4e8a5e"/><stop offset="0.6" stop-color="#1e5a3a"/><stop offset="1" stop-color="#0e3422"/></radialGradient>`);
  const leaves = [[-110, 30, 120, 100, -20], [110, 30, 120, 100, 20], [-50, -10, 110, 130, -8], [50, -10, 110, 130, 8], [0, 20, 130, 120, 0]];
  for (const [dx, dy, w, h, rot] of leaves) {
    const x = cx + dx, y = hy + dy;
    const d = `M${x},${y + h * 0.9} C${x - w},${y + h * 0.7} ${x - w * 0.9},${y - h * 0.6} ${x},${y - h * 0.7} C${x + w * 0.9},${y - h * 0.6} ${x + w},${y + h * 0.7} ${x},${y + h * 0.9} Z`;
    out.push(`<path d="${d}" transform="rotate(${rot} ${x} ${y})" fill="url(#cr)" stroke="${INK}" stroke-width="1.8"/>`);
    out.push(`<path d="M${x},${y + h * 0.85} C${x - 4},${y + h * 0.2} ${x + 4},${y - h * 0.2} ${x},${y - h * 0.62}" transform="rotate(${rot} ${x} ${y})" fill="none" stroke="#b8d8b8" stroke-width="3" stroke-opacity="0.7"/>`);
  }
  void rand; void smooth;

  // ── fig. 2: a carrot, and a potato sprouting from its eyes ────────────────
  out.push(`<path d="M600,690 C600,670 640,666 646,690 L630,770 Z" fill="#e8843a" stroke="${INK}" stroke-width="1.4"/>`);
  for (let k = 0; k < 4; k++) out.push(`<path d="M${606 + k * 2},${706 + k * 16} l${14 - k * 2},0" stroke="#b8541e" stroke-width="1"/>`);
  out.push(`<path d="M612,672 l-8,-40 M622,670 l0,-44 M632,672 l8,-38" stroke="#4e9a4e" stroke-width="3" stroke-linecap="round"/>`);
  out.push(`<ellipse cx="730" cy="736" rx="52" ry="34" fill="#d8b87a" stroke="${INK}" stroke-width="1.4"/>`);
  for (const [x, y] of [[708, 722], [742, 716], [760, 742], [720, 752]]) {
    out.push(`<circle cx="${x}" cy="${y}" r="3" fill="#8a6a44"/>`);
    out.push(`<path d="M${x},${y} q-2,-10 2,-18" fill="none" stroke="#a8c86a" stroke-width="2.4" stroke-linecap="round"/>`);
  }
  contact(out, 680, 770, 110, 5, 0.18);

  return { size: SIZE, view: [0, 320, SIZE, 470], defs: defs.join("\n"), body: out.join("\n") };
}
