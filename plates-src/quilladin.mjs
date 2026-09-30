// NO. 0651 — a chestnut husk splitting, and the line drawn for it to fail along.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the husk, ripe and opening. A round burr grown hard, deep
//      green shading to brown at its foot, bristling all over with stiff
//      spines, and split at the crown in a cross, its four valves peeled back in
//      a star and the glossy brown chestnuts packed between them. The round
//      spiked green body. (Split in one slit across its face with the nuts in
//      a row, and long spines out of its sides, it read as a mouth and arms.)
//   2. The field note's record is strength gained by being knocked about —
//      thigmomorphogenesis, the plant's thickening under repeated stress.
//   3. The note's point is that a hard case is useless unless it can be told
//      where to fail. A dehiscing fruit lays down a suture as it grows — a
//      narrow file of cells left thin-walled while everything round them
//      hardens — so that when the tissue dries and tension builds, it splits
//      exactly there. Fig. 2: a piece of the husk wall cut across, the thick
//      walled cells either side and the thin-walled seam between them.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "quilladin";
export const no = 651;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(651);
  const defs = standardDefs(651);
  const out = [];
  contact(out, 320, 758, 200, 16);

  const cx = 320, cy = 616, R = 136;
  defs.push(`<radialGradient id="hk" cx="0.4" cy="0.3" r="0.85"><stop offset="0" stop-color="#c8e49a"/><stop offset="0.6" stop-color="#8ab85a"/><stop offset="1" stop-color="#5a6a34"/></radialGradient>`);
  // the body of the husk, the top a little flattened where it has opened
  out.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#hk)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // stiff spines all over
  const sp = [];
  for (let k = 0; k < 170; k++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * R;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (y < cy - R * 0.55) continue;
    const L = 8 + (r / R) * 12;
    sp.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(a) * L)},${r1(Math.sin(a) * L)}`);
  }
  out.push(`<path d="${sp.join(" ")}" stroke="#4e6a2e" stroke-width="1.6" stroke-linecap="round"/>`);
  // the opening at the crown: four valves peeled back from a cross-shaped
  // split, their pale insides up, the nuts packed between them
  const top = [cx, cy - R * 0.7];
  out.push(`<ellipse cx="${top[0]}" cy="${top[1]}" rx="70" ry="30" fill="#e8dcb8" stroke="${INK}" stroke-width="1.3"/>`);
  for (const [dx, dy, rot] of [[-24, -4, -18], [22, -6, 16], [0, 8, 0]]) {
    const x = top[0] + dx, y = top[1] + dy;
    out.push(`<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 20},${y + 12} C${x - 22},${y - 10} ${x - 8},${y - 24} ${x},${y - 26} C${x + 8},${y - 24} ${x + 22},${y - 10} ${x + 20},${y + 12} Q${x},${y + 16} ${x - 20},${y + 12} Z" fill="#6e3e1e" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x - 6}" cy="${y - 8}" rx="4" ry="8" fill="#ffffff" fill-opacity="0.4"/><path d="M${x},${y - 26} l0,-7" stroke="#d8c49a" stroke-width="2"/></g>`);
  }
  for (const a of [-2.36, -0.78, 0.78, 2.36]) {
    const tx = top[0] + Math.cos(a) * 118, ty = top[1] + Math.sin(a) * 40 + 4;
    const nx = -Math.sin(a) * 24, ny = Math.cos(a) * 10;
    out.push(`<path d="M${r1(top[0] + Math.cos(a) * 30 + nx)},${r1(top[1] + Math.sin(a) * 14 + ny)} Q${r1((top[0] + tx) / 2 + nx)},${r1((top[1] + ty) / 2 + ny - 14)} ${r1(tx)},${r1(ty)} Q${r1((top[0] + tx) / 2 - nx)},${r1((top[1] + ty) / 2 - ny - 4)} ${r1(top[0] + Math.cos(a) * 30 - nx)},${r1(top[1] + Math.sin(a) * 14 - ny)} Z" fill="${a > 0 ? "#7aa84e" : "#e8dcb0"}" stroke="${INK}" stroke-width="1.4"/>`);
  }

  // ── fig. 2: the husk wall cut across, and the suture ──────────────────────
  const fx = 690, fy = 690;
  out.push(`<rect x="${fx - 90}" y="${fy - 60}" width="180" height="120" rx="4" fill="#f4ead0" stroke="${INK}" stroke-width="1.4"/>`);
  for (let row = 0; row < 5; row++) {
    for (let c = 0; c < 9; c++) {
      const x = fx - 84 + c * 20, y = fy - 54 + row * 22;
      const seam = c === 4;
      out.push(`<rect x="${x}" y="${y}" width="18" height="20" rx="3" fill="${seam ? "#f8f4e4" : "#b8844a"}" stroke="#6e4a2a" stroke-width="${seam ? 0.6 : 2.4}"/>`);
      if (!seam) out.push(`<rect x="${x + 6}" y="${y + 6}" width="6" height="8" rx="2" fill="#f4ead0"/>`);
    }
  }
  out.push(`<path d="M${fx},${fy - 76} L${fx},${fy - 64} M${fx},${fy + 64} L${fx},${fy + 76}" stroke="#c8402e" stroke-width="2"/>`);
  contact(out, fx, fy + 66, 100, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
