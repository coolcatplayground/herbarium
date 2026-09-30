// NO. 0711 — a dried gourd with its tendrils, and the dead cell that carries water.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the gourd. A bottle gourd dried on the vine — pear-shaped,
//      its skin gone dark olive-brown and hard, a glossy shoulder, a thin neck
//      rising to the stalk — and from the neck the vine's tendrils, long and
//      salmon-pink where they have dried, curling in loose springs. The dark
//      gourd and the pale curling strands the specimen carries. No face is
//      cut in it.
//   2. The field note's record is prey wrapped in hairlike arms — and a
//      cucurbit's arms are its tendrils, which coil round what they touch in
//      minutes.
//   3. The note's point is that the most useful hollow a plant makes is a
//      dead cell. A water-carrying vessel cannot work until its contents are
//      gone, so the cell builds its walls, braces them with lignin in rings and
//      spirals, then digests itself from inside — leaving a hollow pipe. Fig.
//      2: one such vessel, its spiral bracing, open at both ends.
import { smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "gourgeist-average";
export const no = 711;
const SIZE = 800;

// a tendril: out from the vine, then wound into a spring along its length
function tendril(out, pts0, turns, amp) {
  const pts = [];
  const n = 90;
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const i = Math.min(pts0.length - 2, Math.floor(t * (pts0.length - 1))), f = t * (pts0.length - 1) - i;
    const [x0, y0] = pts0[i], [x1, y1] = pts0[i + 1];
    const x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f;
    const nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny) || 1;
    const w = amp * Math.min(1, t * 3) * Math.sin(t * turns * Math.PI * 2);
    pts.push([x + (nx / l) * w, y + (ny / l) * w]);
  }
  const d = smooth(pts);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#eea08a" stroke-width="3.6" stroke-linecap="round"/>`);
}

export function draw() {
  const defs = standardDefs(711);
  const out = [];
  contact(out, 320, 758, 180, 16);

  // the tendrils from the stalk, trailing off to one side as springs, one
  // down to the ground. (Two curled symmetrically over the top, they read as
  // antennae.)
  tendril(out, [[344, 410], [400, 380], [470, 390], [530, 430]], 7, 12);
  tendril(out, [[346, 406], [420, 420], [480, 500], [510, 600], [530, 740]], 9, 10);
  tendril(out, [[340, 412], [380, 360], [430, 330]], 4, 9);
  // the gourd: pear-shaped, dried dark, a thin neck
  const g = `M332,452 C352,452 352,500 360,540 C400,560 460,600 460,670 C460,736 400,758 320,758 C240,758 180,736 180,670 C180,600 240,560 280,540 C288,500 312,452 332,452 Z`;
  defs.push(`<radialGradient id="gd" cx="0.36" cy="0.45" r="0.8"><stop offset="0" stop-color="#8a8a54"/><stop offset="0.5" stop-color="#4e4a2a"/><stop offset="1" stop-color="#2a2616"/></radialGradient>`);
  out.push(`<path d="${g}" fill="url(#gd)" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="250" cy="640" rx="34" ry="54" transform="rotate(20 250 640)" fill="#ffffff" fill-opacity="0.18" filter="url(#sheen)"/>`);
  // faint lengthwise ridges
  for (const dx of [-80, -40, 0, 40, 80]) out.push(`<path d="M${320 + dx * 0.3},560 C${320 + dx * 1.1},620 ${320 + dx * 1.1},700 ${320 + dx * 0.9},754" fill="none" stroke="#1e1a0e" stroke-width="1.2" stroke-opacity="0.4"/>`);
  // the stalk, dry and woody, at the top of the neck
  out.push(`<path d="M330,454 C326,430 334,414 346,404" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M330,454 C326,430 334,414 346,404" fill="none" stroke="#8a7a54" stroke-width="7" stroke-linecap="round"/>`);

  // ── fig. 2: a water vessel, braced in a spiral, hollow ────────────────────
  const fx = 690;
  out.push(`<rect x="${fx - 26}" y="590" width="52" height="170" rx="8" fill="#f4ecd0" fill-opacity="0.7" stroke="${INK}" stroke-width="1.4"/>`);
  const sp = [];
  for (let k = 0; k <= 80; k++) { const t = k / 80, y = 596 + t * 158, x = fx + Math.sin(t * Math.PI * 16) * 24; sp.push([x, y]); }
  out.push(`<path d="${smooth(sp)}" fill="none" stroke="#8a5a2a" stroke-width="3"/>`);
  for (const y of [590, 760]) out.push(`<ellipse cx="${fx}" cy="${y}" rx="26" ry="6" fill="#fbf6e4" stroke="${INK}" stroke-width="1.2"/>`);
  contact(out, fx, 764, 60, 5, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.join("\n"), body: out.join("\n") };
}
