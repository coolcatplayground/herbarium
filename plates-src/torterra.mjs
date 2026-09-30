// NO. 0389 — the tree on the mound, and what shelters under a cushion.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the tree. A small, old, broad-crowned tree — a gnarled
//      trunk leaning, the crown in dense rounded masses of leaf — rooted in a
//      low mound of moss and turf, the kind of ground a tree makes round its
//      own foot over years.
//   2. The field note files it with the nurse plants: things that make a
//      place others can live. Its record is that small creatures nest on it
//      and some are born there and never leave.
//   3. The note's point is facilitation, measured where it is plainest: on
//      high cold ground, cushion plants — hard dense mounds of one species —
//      hold moisture, trap soil and run several degrees warmer inside than
//      the air, and other species settle in them that could not survive a
//      metre away. Fig. 2: a cushion plant with seedlings of other kinds
//      growing up out of it.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "torterra";
export const no = 389;
const SIZE = 800;
const CROWN = ["#2f6e36", "#3f8240", "#4e944a", "#5aa452", "#6ab25c"];
const BARK = { light: "#a88a64", base: "#7a5e3e", deep: "#4e3a24" };

// a crown lobe: a rounded mass of small leaves, darker underneath
function lobe(out, rand, cx, cy, rx, ry) {
  const leaves = [];
  for (let k = 0; k < 170; k++) {
    const v = k / 170;
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand());
    const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
    const shade = (y - (cy - ry)) / (2 * ry);
    const col = CROWN[Math.max(0, Math.min(4, Math.round((1 - shade) * 3 + v * 1.4 + (rand() - 0.5))))];
    const ang = rand() * Math.PI * 2, L = 9 + rand() * 6;
    const tx = x + Math.cos(ang) * L, ty = y + Math.sin(ang) * L;
    leaves.push(`<path d="M${r1(x)},${r1(y)} Q${r1((x + tx) / 2 - Math.sin(ang) * 4)},${r1((y + ty) / 2 + Math.cos(ang) * 4)} ${r1(tx)},${r1(ty)} Q${r1((x + tx) / 2 + Math.sin(ang) * 4)},${r1((y + ty) / 2 - Math.cos(ang) * 4)} ${r1(x)},${r1(y)} Z" fill="${col}"/>`);
  }
  const outline = [];
  for (let j = 0; j < 24; j++) { const a = (j / 24) * Math.PI * 2; outline.push([cx + Math.cos(a) * rx * (1 + (rand() - 0.5) * 0.12), cy + Math.sin(a) * ry * (1 + (rand() - 0.5) * 0.12)]); }
  out.push(`<path d="${smooth(outline, true)}" fill="${CROWN[1]}" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
  out.push(leaves.join(""));
}

export function draw() {
  const rand = mulberry32(389);
  const defs = standardDefs(389);
  const out = [];
  contact(out, 320, 758, 240, 16);

  // the mound of moss and turf
  const mound = `M100,760 C130,700 220,676 320,672 C420,668 510,700 540,760 Z`;
  defs.push(`<linearGradient id="md" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7aa85a"/><stop offset="0.3" stop-color="#5a8a44"/><stop offset="1" stop-color="#6e5438"/></linearGradient>`);
  out.push(`<path d="${mound}" fill="url(#md)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  const moss = [];
  for (let k = 0; k < 80; k++) { const x = 130 + rand() * 380, y = 690 + rand() * 30; moss.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(2 + rand() * 3)}" fill="${rand() < 0.5 ? "#8cbc62" : "#4e7e3a"}" fill-opacity="0.8"/>`); }
  out.push(moss.join(""));

  // the trunk: leaning, gnarled, splitting into two limbs
  const trunk = `M292,690 C286,640 300,600 290,560 C282,528 256,500 238,470 L258,462 C276,490 300,516 312,540 C324,510 350,488 372,470 L388,482 C364,500 340,530 330,566 C320,610 334,650 340,690 Z`;
  defs.push(`<linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${BARK.light}"/><stop offset="0.5" stop-color="${BARK.base}"/><stop offset="1" stop-color="${BARK.deep}"/></linearGradient>`);
  out.push(`<path d="${trunk}" fill="url(#bk)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (const d of ["M300,680 C296,640 306,600 298,566", "M318,676 C314,630 326,590 318,560"]) out.push(`<path d="${d}" fill="none" stroke="${BARK.deep}" stroke-width="1.2" stroke-opacity="0.6"/>`);
  // surface roots spreading into the moss
  for (const [x1, y1] of [[240, 706], [390, 704], [270, 716]]) out.push(`<path d="M316,688 Q${(316 + x1) / 2},${y1 - 14} ${x1},${y1}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M316,688 Q${(316 + x1) / 2},${y1 - 14} ${x1},${y1}" fill="none" stroke="${BARK.base}" stroke-width="4.4" stroke-linecap="round"/>`);

  // the crown: rounded masses, back ones first
  for (const [cx, cy, rx, ry] of [[240, 430, 90, 62], [390, 420, 100, 66], [316, 380, 110, 70], [200, 470, 70, 46], [430, 468, 76, 48], [316, 450, 90, 54]]) lobe(out, rand, cx, cy, rx, ry);

  // ── fig. 2: a cushion plant, and what grows up out of it ──────────────────
  const fx = 690, fy = 760;
  const cushion = `M${fx - 86},${fy} C${fx - 84},${fy - 60} ${fx + 84},${fy - 60} ${fx + 86},${fy} Z`;
  out.push(`<path d="${cushion}" fill="#9ab86a" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
  const tuft = [];
  for (let k = 0; k < 150; k++) { const a = Math.PI + rand() * Math.PI, r = Math.sqrt(rand()); tuft.push(`<circle cx="${r1(fx + Math.cos(a) * 80 * r)}" cy="${r1(fy - 4 + Math.sin(a) * 42 * r)}" r="1.6" fill="${rand() < 0.5 ? "#6e9448" : "#bcd88a"}"/>`); }
  out.push(tuft.join(""));
  // three other plants growing up out of it
  for (const [x, h, col] of [[fx - 40, 60, "#d8588a"], [fx + 6, 76, "#f2cf3e"], [fx + 48, 52, "#8a7ad8"]]) {
    out.push(`<path d="M${x},${fy - 36} L${x},${fy - 36 - h}" stroke="${INK}" stroke-width="3"/><path d="M${x},${fy - 36} L${x},${fy - 36 - h}" stroke="#6a9a4a" stroke-width="1.6"/>`);
    out.push(`<path d="M${x},${fy - 50} q-12,-6 -16,-16 q10,2 16,12 M${x},${fy - 56} q12,-6 16,-16 q-10,2 -16,12" fill="#6a9a4a" stroke="${INK}" stroke-width="0.8"/>`);
    for (let q = 0; q < 5; q++) { const a = (q / 5) * Math.PI * 2; out.push(`<circle cx="${r1(x + Math.cos(a) * 5)}" cy="${r1(fy - 36 - h + Math.sin(a) * 5)}" r="4" fill="${col}" stroke="${INK}" stroke-width="0.6"/>`); }
  }
  // warmer inside: a small dashed isotherm under the dome
  out.push(`<path d="M${fx - 60},${fy - 2} C${fx - 56},${fy - 38} ${fx + 56},${fy - 38} ${fx + 60},${fy - 2}" fill="none" stroke="#c8402e" stroke-width="1.2" stroke-dasharray="4 3"/>`);
  contact(out, fx, fy + 2, 96, 6, 0.2);

  return { size: SIZE, view: [0, 290, SIZE, 500], defs: defs.join("\n"), body: out.join("\n") };
}
