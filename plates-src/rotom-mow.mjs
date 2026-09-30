// NO. 0479 (Mow) — a roll of turf, and a leaf that grows from its base.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the turf. A strip of lawn cut and rolled — the soil and
//      matted roots showing in the spiral of its end — and a square of it laid
//      flat beside, the grass mown to one level, even and green. The field note
//      files the specimen as N/A, a machine, and points at the one real plant
//      thing in it: the lawn it is built to cut.
//   2. The record makes no claim about plants at all.
//   3. The note's point is that turf covers more ground in the United States
//      than any irrigated crop — by satellite estimate, around three times the
//      irrigated maize — and it is grown in order to be cut. Grass takes the
//      mowing because its leaves grow from the base, not the tip: cut the top
//      off and the blade simply keeps coming up from below. Fig. 2: one grass
//      blade, its cut tip, and the growing zone at its foot pushing it back up.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "rotom-mow";
export const no = 479;
const SIZE = 800;
const GRASS = ["#4e9a44", "#5aa84e", "#3e8a3a", "#6ab45a"];

export function draw() {
  const rand = mulberry32(479);
  const defs = standardDefs(479);
  const out = [];
  contact(out, 320, 758, 250, 14);

  // the flat square, mown level
  out.push(`<path d="M300,760 L330,700 L560,700 L530,760 Z" fill="#6e5438" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M300,760 L330,700 L560,700 L530,760 Z" fill="none"/>`);
  const flat = [];
  for (let k = 0; k < 420; k++) { const u = rand(), v = rand(); const x = 300 + u * 230 + v * 30, y = 760 - v * 60; flat.push(`<path d="M${r1(x)},${r1(y)} l${r1((rand() - 0.5) * 3)},-8" stroke="${GRASS[k % 4]}" stroke-width="2" stroke-linecap="round"/>`); }
  out.push(flat.join(""));
  out.push(`<path d="M300,760 L530,760 L530,768 L300,768 Z" fill="#5a4430" stroke="${INK}" stroke-width="1"/>`);
  // the roll: a cylinder lying on its side, its end a spiral of soil and turf
  const rx = 200, ry = 690, R = 70;
  out.push(`<path d="M${rx},${ry - R} L${rx + 0},${ry - R} L${rx + 0},${ry + R} Z" fill="none"/>`);
  out.push(`<path d="M${rx - 110},${ry - R} L${rx},${ry - R} L${rx},${ry + R} L${rx - 110},${ry + R} Z" fill="#4e9a44" stroke="${INK}" stroke-width="1.6"/>`);
  const tuft = [];
  for (let k = 0; k < 140; k++) { const x = rx - 108 + rand() * 106, y = ry - R + rand() * R * 2; tuft.push(`<path d="M${r1(x)},${r1(y)} l-6,${r1((rand() - 0.5) * 3)}" stroke="${GRASS[k % 4]}" stroke-width="1.8"/>`); }
  out.push(tuft.join(""));
  out.push(`<ellipse cx="${rx}" cy="${ry}" rx="26" ry="${R}" fill="#6e5438" stroke="${INK}" stroke-width="1.6"/>`);
  const sp = [];
  for (let k = 0; k <= 60; k++) { const a = k * 0.34, r = R * (1 - k / 64); sp.push(`${k ? "L" : "M"}${r1(rx + Math.cos(a) * r * 0.36)},${r1(ry + Math.sin(a) * r)}`); }
  out.push(`<path d="${sp.join(" ")}" fill="none" stroke="#4e9a44" stroke-width="3"/>`);

  // ── fig. 2: a grass blade, cut, growing back from its base ────────────────
  const fx = 690;
  out.push(`<rect x="${fx - 70}" y="740" width="140" height="26" fill="#b8966a" fill-opacity="0.55" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx - 8},744 L${fx - 6},640 L${fx + 6},640 L${fx + 8},744 Z" fill="#5aa84e" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<path d="M${fx - 6},640 L${fx + 6},640" stroke="#c8402e" stroke-width="2"/>`);
  out.push(`<path d="M${fx - 12},628 L${fx + 4},600 L${fx + 14},604" fill="none" stroke="#8ab86a" stroke-width="3" stroke-dasharray="4 3"/>`);
  out.push(`<rect x="${fx - 9}" y="716" width="18" height="26" fill="#e8f0a0" fill-opacity="0.8" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="M${fx + 22},736 L${fx + 22},676" stroke="${INK}" stroke-width="1.3"/><path d="M${fx + 17},684 L${fx + 22},676 L${fx + 27},684" fill="none" stroke="${INK}" stroke-width="1.3"/>`);
  contact(out, fx, 768, 80, 5, 0.18);

  return { size: SIZE, view: [0, 560, SIZE, 230], defs: defs.join("\n"), body: out.join("\n") };
}
