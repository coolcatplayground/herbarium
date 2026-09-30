// NO. 0345 — a sea lily, and the beads it leaves behind.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the crown of a sea lily on its stalk. A crinoid is an
//      animal — the field note says so plainly — but it is filed here because
//      for most of history it was taken for a plant, and drawn it shows why:
//      a jointed stalk rising from a grip on the rock, a small cup at the top,
//      and from its rim a ring of long arms curving out like petals, each
//      feathered along its length. Purple stalk and cup, the cup ringed with
//      yellow; the arms pink, banded.
//   2. The stalk is a column of stacked discs, with small whorls of curled
//      side-arms — cirri — at intervals up it.
//   3. The field note's record is that it was regenerated from a fossil,
//      which is how most people meet a crinoid: stalks break up into their
//      discs, and the discs weather out of limestone by the million — star-
//      shaped or round, with a hole through the middle, strung as beads and
//      once called St Cuthbert's beads. Fig. 2: a few of them.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "lileep";
export const no = 345;
const SIZE = 800;
const PURPLE = { light: "#c8bce6", base: "#9484c4", deep: "#65569a", shade: "#3e3468" };
const PINK = { light: "#fbd2d6", base: "#f0a0aa", deep: "#c86e7c", shade: "#8e4452", edge: "#8e4452" };
const YELLOW = "#ecd57a";

// a point along a cubic
const bez = (p0, p1, p2, p3, t) => [0, 1].map((i) => (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t * t * p2[i] + t ** 3 * p3[i]);

export function draw() {
  const rand = mulberry32(345);
  const defs = standardDefs(345);
  const out = [];
  contact(out, 320, 758, 170, 14);

  // the rock it grips
  out.push(`<path d="M230,760 C236,730 270,712 320,710 C370,708 408,726 414,760 Z" fill="#b8b2a4" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  out.push(`<path d="M250,748 C280,734 330,730 380,740" fill="none" stroke="#8e887a" stroke-width="1.4" stroke-opacity="0.6"/>`);
  // the grip: short root-like branches clasping the rock
  for (const [dx, a] of [[-40, 2.7], [-20, 2.3], [20, 0.8], [40, 0.4], [0, 1.6]]) {
    const x0 = 320, y0 = 716;
    const d = `M${x0},${y0} Q${r1(x0 + dx * 0.6)},${r1(y0 + 4)} ${r1(x0 + dx + Math.cos(a) * 16)},${r1(y0 + 10 + Math.sin(a) * 8)}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${PURPLE.deep}" stroke-width="4.6" stroke-linecap="round"/>`);
  }

  // the stalk: a column of stacked discs
  const S = [[320, 718], [316, 640], [330, 560], [336, 470]];
  const N = 30;
  const discs = [];
  for (let k = 0; k <= N; k++) discs.push(bez(...S, k / N));
  const sd = smooth(discs);
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="butt"/><path d="${sd}" fill="none" stroke="${PURPLE.base}" stroke-width="14" stroke-linecap="butt"/><path d="${sd}" fill="none" stroke="${PURPLE.light}" stroke-width="4" stroke-opacity="0.7" transform="translate(-3 0)"/>`);
  for (let k = 1; k < N; k++) {
    const [x, y] = discs[k];
    out.push(`<path d="M${r1(x - 7)},${r1(y)} Q${r1(x)},${r1(y + 2.5)} ${r1(x + 7)},${r1(y)}" fill="none" stroke="${PURPLE.shade}" stroke-width="1" stroke-opacity="0.7"/>`);
  }
  // cirri: small curled side-arms at a few joints
  for (const k of [7, 14, 21]) {
    const [x, y] = discs[k];
    for (const s of [-1, 1]) out.push(`<path d="M${r1(x + s * 6)},${r1(y)} q${s * 14},-2 ${s * 18},10 q${s * 2},8 ${-s * 5},7" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M${r1(x + s * 6)},${r1(y)} q${s * 14},-2 ${s * 18},10 q${s * 2},8 ${-s * 5},7" fill="none" stroke="${PURPLE.base}" stroke-width="2" stroke-linecap="round"/>`);
  }

  // the arms: eight, curving out from the rim of the cup like petals, the
  // far ones first; each banded and feathered
  const [cx, cy] = [338, 440];
  const ARMS = [];
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + 0.2;
    ARMS.push({ a, z: Math.sin(a) });
  }
  const arm = ({ a }) => {
    const out1 = Math.cos(a), dep = Math.sin(a);
    const x0 = cx + out1 * 30, y0 = cy - 12 + dep * 8;
    const pts = [[x0, y0], [x0 + out1 * 40, y0 - 70 + dep * 12], [x0 + out1 * 110, y0 - 60 + dep * 26], [x0 + out1 * 140, y0 + 10 + dep * 30]];
    // a flat arm, broad at its middle and rounded at the tip, its edges cut
    // into fine pinnules so it reads as a feather or a petal. (Drawn round
    // and banded, the arms read as tentacles.)
    const b = blade(pts, { width: (u) => 17 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.7), 0.55), lobes: 18, depth: 0.32, start: 0.12, teeth: "round", sideVeins: 0, rand });
    paintBlade(b, { id: `arm${r1(a * 100)}`, palette: PINK, defs, out, shade: dep < 0 ? 0.25 : 0, margin: 3, veinOpacity: 0 });
  };
  ARMS.filter((q) => q.z < 0).forEach(arm);
  // the cup
  const cup = `M${cx - 34},${cy - 14} C${cx - 36},${cy + 14} ${cx - 16},${cy + 30} ${cx},${cy + 34} C${cx + 16},${cy + 30} ${cx + 36},${cy + 14} ${cx + 34},${cy - 14} C${cx + 20},${cy - 22} ${cx - 20},${cy - 22} ${cx - 34},${cy - 14} Z`;
  defs.push(`<radialGradient id="cupg" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${PURPLE.light}"/><stop offset="0.6" stop-color="${PURPLE.base}"/><stop offset="1" stop-color="${PURPLE.deep}"/></radialGradient>`);
  out.push(`<path d="${cup}" fill="url(#cupg)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  out.push(`<path d="M${cx - 24},${cy + 2} C${cx - 14},${cy + 14} ${cx + 14},${cy + 14} ${cx + 24},${cy + 2}" fill="none" stroke="${YELLOW}" stroke-width="4"/>`);
  out.push(`<path d="M${cx - 16},${cy + 16} C${cx - 8},${cy + 24} ${cx + 8},${cy + 24} ${cx + 16},${cy + 16}" fill="none" stroke="${YELLOW}" stroke-width="3"/>`);
  ARMS.filter((q) => q.z >= 0).forEach(arm);

  // ── fig. 2: the beads a stalk breaks into ─────────────────────────────────
  const bead = (x, y, r, star) => {
    let d;
    if (star) {
      const pts = [];
      for (let k = 0; k < 10; k++) {
        const a = -Math.PI / 2 + (k / 10) * Math.PI * 2, rr = k % 2 ? r * 0.62 : r;
        pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
      }
      d = smooth(pts, true);
    } else d = `M${x - r},${y} A${r},${r} 0 1,1 ${x + r},${y} A${r},${r} 0 1,1 ${x - r},${y} Z`;
    out.push(`<path d="${d}" fill="#cfc6b2" stroke="${INK}" stroke-width="1.3"/>`);
    out.push(`<circle cx="${x}" cy="${y}" r="${r1(r * 0.2)}" fill="#6a6254"/>`);
    const rays = [];
    for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; rays.push(`M${r1(x + Math.cos(a) * r * 0.3)},${r1(y + Math.sin(a) * r * 0.3)} L${r1(x + Math.cos(a) * r * 0.75)},${r1(y + Math.sin(a) * r * 0.75)}`); }
    out.push(`<path d="${rays.join(" ")}" stroke="#8e8674" stroke-width="0.8"/>`);
  };
  bead(628, 720, 22, true);
  bead(686, 736, 18, false);
  bead(742, 716, 24, true);
  bead(706, 690, 14, false);
  // and a short length of them still stacked
  for (let k = 0; k < 5; k++) out.push(`<rect x="${650 + k * 12}" y="${664 - k * 3}" width="11" height="24" rx="3" transform="rotate(-14 ${656 + k * 12} ${676 - k * 3})" fill="#cfc6b2" stroke="${INK}" stroke-width="1"/>`);
  contact(out, 690, 762, 100, 6, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.join("\n"), body: out.join("\n") };
}
