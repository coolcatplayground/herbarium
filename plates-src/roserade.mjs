// NO. 0407 — two posies, and the lock a flower keeps against itself.
//
// What the morphology says, and what each observation became:
//
//   1. The part: two posies, one red and one blue, three small roses to each,
//      held close on short stems and bound at the foot with their leaves —
//      the two bouquets the specimen carries, one in each hand. Colour is
//      the difference between them; the field note files it as a bicolour
//      cultivar with its traits split between two flowerings.
//   2. The note's point is self-incompatibility, run off the most variable
//      gene found in plants: a stigma recognises pollen carrying the same
//      version of the gene as itself and stops it before its tube gets
//      anywhere, so a flower cannot fertilise itself. Fig. 2: one pistil, two
//      pollen grains on it — its own, stopped short, and a stranger's, its
//      tube grown all the way down to the ovules.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "roserade";
export const no = 407;
const SIZE = 800;
const RED = { light: "#f6a8a8", base: "#dc4a56", deep: "#9e2838", shade: "#5e1420" };
const BLUE = { light: "#b8d4f4", base: "#5a8ed4", deep: "#2e5496", shade: "#1a2e5c" };
const LEAF = { light: "#b6d89a", base: "#4e8a44", deep: "#2f5e2c", shade: "#1c3c1c", edge: "#1c3c1c" };

// a small rose, cupped, seen from a little above: back petals, the cup's
// mouth with wound petals in it, and two front petals wrapping it
function rosebud(out, id, cx, cy, R, P) {
  const rim = cy - R * 0.25;
  const ink = (d, w = 1.3) => out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`);
  for (let k = 0; k < 3; k++) {
    const x = cx + (k - 1) * R * 0.5, y = rim - (k === 1 ? R * 0.14 : R * 0.04);
    const d = `M${r1(x - R * 0.4)},${r1(rim + 6)} C${r1(x - R * 0.44)},${r1(y - R * 0.34)} ${r1(x + R * 0.44)},${r1(y - R * 0.38)} ${r1(x + R * 0.4)},${r1(rim + 6)} Z`;
    out.push(`<path d="${d}" fill="${P.deep}"/>`);
    ink(d, 1.1);
  }
  out.push(`<ellipse cx="${cx}" cy="${r1(rim)}" rx="${r1(R * 0.58)}" ry="${r1(R * 0.22)}" fill="${P.shade}"/>`);
  for (let k = 0; k < 3; k++) {
    const w = R * (0.46 - k * 0.12), h = R * (0.16 - k * 0.03);
    out.push(`<path d="M${r1(cx - w)},${r1(rim + 1)} C${r1(cx - w)},${r1(rim - h * 1.6)} ${r1(cx + w)},${r1(rim - h * 1.6)} ${r1(cx + w * 0.8)},${r1(rim + h * 0.4)}" fill="${k % 2 ? P.base : P.deep}" stroke="${P.light}" stroke-width="1.4"/>`);
  }
  for (const [o, w] of [[-0.4, 0.62], [0.4, 0.62]]) {
    const x = cx + o * R, top = rim;
    const d = `M${r1(x - w * R)},${r1(top)} C${r1(x - w * R)},${r1(cy + R * 0.4)} ${r1(x - w * R * 0.4)},${r1(cy + R * 0.66)} ${r1(x)},${r1(cy + R * 0.66)} C${r1(x + w * R * 0.4)},${r1(cy + R * 0.66)} ${r1(x + w * R)},${r1(cy + R * 0.4)} ${r1(x + w * R)},${r1(top)} Q${r1(x)},${r1(top + R * 0.16)} ${r1(x - w * R)},${r1(top)} Z`;
    out.push(`<path d="${d}" fill="${P.base}"/><path d="${d}" fill="url(#${id})" filter="url(#wc)"/>`);
    out.push(`<path d="M${r1(x - w * R)},${r1(top)} Q${r1(x)},${r1(top + R * 0.16)} ${r1(x + w * R)},${r1(top)}" fill="none" stroke="${P.light}" stroke-width="3" stroke-opacity="0.8"/>`);
    ink(d, 1.4);
  }
}

function posy(out, defs, id, x, y, P, rand) {
  defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.light}"/><stop offset="0.5" stop-color="${P.base}"/><stop offset="1" stop-color="${P.deep}"/></linearGradient>`);
  // stems gathered at the foot
  for (const dx of [-40, 0, 40]) out.push(`<path d="M${x + dx},${y - 10} Q${x + dx * 0.4},${y + 90} ${x},${y + 150}" fill="none" stroke="${INK}" stroke-width="6.4"/><path d="M${x + dx},${y - 10} Q${x + dx * 0.4},${y + 90} ${x},${y + 150}" fill="none" stroke="#5e8a44" stroke-width="4"/>`);
  // leaves round the gathered stems, like a collar
  for (const [a, L] of [[2.5, 90], [0.64, 90], [2.0, 70], [1.14, 70]]) {
    const b = blade([[x, y + 70], [x + Math.cos(a) * L * 0.5, y + 70 + Math.sin(a) * L * 0.3 - 10], [x + Math.cos(a) * L, y + 70 + Math.sin(a) * L * 0.5]], {
      width: (u) => 18 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.06 + u * 0.94)), 0.7), lobes: 7, depth: 0.14, start: 0.2, sideVeins: 3, rand,
    });
    paintBlade(b, { id: `${id}l${r1(a * 10)}`, palette: LEAF, defs, out, margin: 2, ink: 1.1, veinOpacity: 0.3 });
  }
  // a band binding them
  out.push(`<rect x="${x - 14}" y="${y + 104}" width="28" height="10" rx="3" fill="#e8dcb8" stroke="${INK}" stroke-width="1.1"/>`);
  // three roses, the back one first
  rosebud(out, id, x, y - 44, 46, P);
  rosebud(out, id, x - 40, y, 44, P);
  rosebud(out, id, x + 40, y + 4, 44, P);
}

export function draw() {
  const rand = mulberry32(407);
  const defs = standardDefs(407);
  const out = [];
  contact(out, 320, 758, 220, 14);
  posy(out, defs, "red", 220, 600, RED, rand);
  posy(out, defs, "blue", 440, 600, BLUE, rand);

  // ── fig. 2: a pistil, and two pollen grains on it ─────────────────────────
  const fx = 690, top = 560;
  const pistil = `M${fx - 16},${top} C${fx - 20},${top - 12} ${fx + 20},${top - 12} ${fx + 16},${top} L${fx + 5},${top + 18} L${fx + 5},${top + 130} C${fx + 40},${top + 140} ${fx + 44},${top + 196} ${fx},${top + 204} C${fx - 44},${top + 196} ${fx - 40},${top + 140} ${fx - 5},${top + 130} L${fx - 5},${top + 18} Z`;
  out.push(`<path d="${pistil}" fill="#d8ecb8" stroke="${INK}" stroke-width="1.6"/>`);
  for (const [ox, oy] of [[-12, 170], [8, 164], [-2, 184], [14, 182]]) out.push(`<ellipse cx="${fx + ox}" cy="${top + oy}" rx="7" ry="9" fill="#f4f0dc" stroke="${INK}" stroke-width="0.8"/>`);
  // its own pollen: the tube stops short, with a bar across it
  out.push(`<circle cx="${fx - 12}" cy="${top - 10}" r="7" fill="#e8c84a" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx - 8},${top - 4} C${fx - 4},${top + 10} ${fx - 2},${top + 30} ${fx - 2},${top + 44}" fill="none" stroke="#c89a2a" stroke-width="2"/><path d="M${fx - 10},${top + 46} l16,0" stroke="#c8402e" stroke-width="2.4"/>`);
  // a stranger's: the tube runs the whole way to an ovule
  out.push(`<circle cx="${fx + 12}" cy="${top - 12}" r="7" fill="#b8d0f0" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx + 9},${top - 5} C${fx + 4},${top + 30} ${fx + 2},${top + 110} ${fx + 2},${top + 150} C${fx + 4},${top + 160} ${fx + 8},${top + 162} ${fx + 8},${top + 164}" fill="none" stroke="#5a8ed4" stroke-width="2"/>`);
  contact(out, fx, top + 206, 60, 5, 0.2);

  return { size: SIZE, view: [0, 470, SIZE, 320], defs: defs.join("\n"), body: out.join("\n") };
}
