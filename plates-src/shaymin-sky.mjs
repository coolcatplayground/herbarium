// NO. 0492 (Sky) — a plumed seed head in flight, and armour traded for air.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the seed head, gone to plume. A thistle-like head burst open
//      at its tip into a great soft spray of white, feathered plumes flaring
//      out like wings, the green bracts of the head below them, and caught at
//      the side, a scrap of the red flower it was — the red ribbon at its
//      neck. The white and green that the specimen, in its sky form, becomes.
//   2. The record is the land form's: a field of flowers made from ruined
//      ground.
//   3. The note's point is the trade the form makes — defence given up for
//      speed and flight — and that dispersal makes the same bargain: a seed
//      built to travel is built light, and the plume that buys distance is
//      mass not spent on a thick protective coat. Fig. 2: two seeds on a
//      balance, a small plumed one and a heavy thick-coated one, the plumed
//      one light enough to lift.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "shaymin-sky";
export const no = 492;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(4920);
  const defs = standardDefs(4920);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the stem, and the head of green bracts
  out.push(`<path d="M320,760 C318,700 322,640 320,590" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M320,760 C318,700 322,640 320,590" fill="none" stroke="#6ea456" stroke-width="8" stroke-linecap="round"/>`);
  // the plumes, flaring out and up from the head like wings, back ones first
  const plumes = [];
  for (let k = 0; k < 60; k++) {
    const a = -Math.PI / 2 + (rand() - 0.5) * 2.6, L = 170 + rand() * 90;
    const pts = [];
    for (let j = 0; j <= 8; j++) { const u = j / 8, aa = a + Math.sign(a + Math.PI / 2) * u * u * 0.4; pts.push([320 + Math.cos(aa) * L * u, 560 + Math.sin(aa) * L * u * 0.8]); }
    plumes.push(pts);
  }
  // a soft pale halo behind the spray, so the white reads against the paper
  defs.push(`<radialGradient id="halo" cx="0.5" cy="0.6" r="0.55"><stop offset="0" stop-color="#d8d4c4" stop-opacity="0.7"/><stop offset="1" stop-color="#d8d4c4" stop-opacity="0"/></radialGradient>`);
  out.push(`<ellipse cx="320" cy="470" rx="260" ry="150" fill="url(#halo)"/>`);
  for (const pts of plumes) {
    const d = smooth(pts);
    out.push(`<path d="${d}" fill="none" stroke="#8a8474" stroke-width="5.4" stroke-opacity="0.5"/><path d="${d}" fill="none" stroke="#fbfaf4" stroke-width="3.6"/>`);
    const barbs = [];
    for (let j = 2; j < pts.length; j++) { const [x, y] = pts[j], [px, py] = pts[j - 1], a = Math.atan2(y - py, x - px); for (const s of [-1, 1]) barbs.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(a + s * 2.4) * 10)},${r1(Math.sin(a + s * 2.4) * 10)}`); }
    out.push(`<path d="${barbs.join(" ")}" stroke="#a8a494" stroke-width="1"/>`);
    out.push(`<path d="${d}" fill="none" stroke="#8a8474" stroke-width="0.8"/>`);
  }
  defs.push(`<radialGradient id="hd" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#b8e0a0"/><stop offset="0.6" stop-color="#5a9a4a"/><stop offset="1" stop-color="#2e6a2e"/></radialGradient>`);
  out.push(`<path d="M280,560 C276,600 300,620 320,622 C340,620 364,600 360,560 Z" fill="url(#hd)" stroke="${INK}" stroke-width="1.6"/>`);
  for (let k = 0; k < 7; k++) out.push(`<path d="M${284 + k * 12},${596 - (k % 2) * 6} l6,-16 l6,16" fill="#4e8a3e" stroke="${INK}" stroke-width="0.8"/>`);
  // a scrap of the red flower at its neck
  out.push(`<path d="M360,576 C390,570 420,590 440,580 C428,600 398,604 360,592 Z" fill="#d83a3a" stroke="${INK}" stroke-width="1.2"/><path d="M360,586 C384,600 404,620 400,640 C388,626 370,606 356,596 Z" fill="#b82a2a" stroke="${INK}" stroke-width="1.2"/>`);

  // ── fig. 2: a plumed seed and a heavy one on a balance ───────────────────
  const fx = 690, by = 700;
  out.push(`<path d="M${fx},768 L${fx},${by}" stroke="${INK}" stroke-width="3"/><path d="M${fx - 12},768 L${fx + 12},768" stroke="${INK}" stroke-width="3"/>`);
  out.push(`<path d="M${fx - 80},${by - 18} L${fx + 80},${by + 18}" stroke="${INK}" stroke-width="3"/>`);
  out.push(`<path d="M${fx - 104},${by - 6} L${fx - 56},${by - 6} L${fx - 62},${by + 4} L${fx - 98},${by + 4} Z" fill="#b8a888" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<path d="M${fx + 56},${by + 30} L${fx + 104},${by + 30} L${fx + 98},${by + 40} L${fx + 62},${by + 40} Z" fill="#b8a888" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<path d="M${fx - 80},${by - 18} L${fx - 80},${by - 6} M${fx + 80},${by + 18} L${fx + 80},${by + 30}" stroke="${INK}" stroke-width="1.3"/>`);
  // plumed seed, light, on the high pan
  out.push(`<ellipse cx="${fx - 80}" cy="${by - 10}" rx="3" ry="5" fill="#8a6a44"/><path d="M${fx - 80},${by - 15} L${fx - 80},${by - 34}" stroke="${INK}" stroke-width="0.8"/>`);
  for (let k = 0; k < 9; k++) { const a = -Math.PI + (k / 8) * Math.PI; out.push(`<path d="M${fx - 80},${by - 34} l${r1(Math.cos(a) * 16)},${r1(Math.sin(a) * 12)}" stroke="#c8bc98" stroke-width="0.9"/>`); }
  // heavy thick-coated seed on the low pan
  out.push(`<ellipse cx="${fx + 80}" cy="${by + 20}" rx="18" ry="13" fill="#5a3e24" stroke="${INK}" stroke-width="1.4"/><ellipse cx="${fx + 80}" cy="${by + 20}" rx="11" ry="7" fill="none" stroke="#8a6a44" stroke-width="2"/>`);
  contact(out, fx, 770, 100, 5, 0.18);

  return { size: SIZE, view: [0, 320, SIZE, 470], defs: defs.join("\n"), body: out.join("\n") };
}
