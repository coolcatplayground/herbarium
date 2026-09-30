// NO. 0492 — a flowering cushion, and a mutualism with teeth.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a cushion of ground cover — a low round mound of fine
//      grassy leaves, soft and dense — with one large pink flower set in it:
//      five broad petals, rounded, a deeper pink at the heart. The mound and
//      the flower on it are what the specimen carries on its back.
//   2. The field note's record is the boldest in the room: that it turns
//      ruined land to a field of flowers.
//   3. The note's point is that a mutualism that cannot punish gets
//      cheated, so some of them can. Figs are pollinated by wasps that breed
//      inside the fruit, and where a wasp lays her eggs without bringing
//      pollen, the tree drops the fig — her brood with it. Fig. 2: a fig cut
//      in half, the tiny flowers lining it, and the wasp at the door.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "shaymin-land";
export const no = 492;
const SIZE = 800;
const GRASS = ["#5aa650", "#6ab65c", "#4a9444", "#7cc46a", "#3e8a3e"];
const PINK = { light: "#fbd0d8", base: "#ee94a8", deep: "#c85a78" };

export function draw() {
  const rand = mulberry32(492);
  const defs = standardDefs(492);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the mound: a dome of fine grassy leaves, the back ones first
  const blades = [];
  for (let k = 0; k < 1100; k++) {
    const v = k / 1100;
    const u = rand() * 2 - 1;
    const topY = 750 - 190 * Math.sqrt(Math.max(0, 1 - u * u));
    const y = 752 - (752 - topY) * (0.2 + 0.8 * v) + rand() * 10;
    const x = 320 + u * 230;
    const a = -Math.PI / 2 + u * 1.2 + (rand() - 0.5) * 0.9, L = 26 + rand() * 18;
    blades.push(`<path d="M${r1(x - 2)},${r1(y)} Q${r1(x + Math.cos(a) * L * 0.5)},${r1(y + Math.sin(a) * L * 0.5)} ${r1(x + Math.cos(a) * L)},${r1(y + Math.sin(a) * L)} Q${r1(x + Math.cos(a) * L * 0.5 + 2)},${r1(y + Math.sin(a) * L * 0.5)} ${r1(x + 2)},${r1(y)} Z" fill="${GRASS[Math.min(4, Math.floor(v * 3.5 + rand() * 1.5))]}" stroke="${INK}" stroke-width="0.3" stroke-opacity="0.5"/>`);
  }
  out.push(`<path d="M90,752 C100,600 540,600 550,752 Z" fill="${GRASS[4]}"/>`);
  out.push(blades.join(""));

  // the flower, set into the mound
  const fx = 340, fy = 612;
  defs.push(`<radialGradient id="pk" cx="${fx}" cy="${fy}" r="90" gradientUnits="userSpaceOnUse"><stop offset="0.1" stop-color="${PINK.deep}"/><stop offset="0.5" stop-color="${PINK.base}"/><stop offset="1" stop-color="${PINK.light}"/></radialGradient>`);
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2 + 0.2;
    const px = fx + Math.cos(a) * 46, py = fy + Math.sin(a) * 38;
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="50" ry="34" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="url(#pk)" stroke="${INK}" stroke-width="1.6"/>`);
    out.push(`<path d="M${r1(fx + Math.cos(a) * 14)},${r1(fy + Math.sin(a) * 12)} L${r1(fx + Math.cos(a) * 76)},${r1(fy + Math.sin(a) * 62)}" stroke="${PINK.deep}" stroke-width="1.4" stroke-opacity="0.5"/>`);
  }
  out.push(`<circle cx="${fx}" cy="${fy}" r="14" fill="${PINK.deep}" stroke="${INK}" stroke-width="1.2"/>`);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; out.push(`<circle cx="${r1(fx + Math.cos(a) * 9)}" cy="${r1(fy + Math.sin(a) * 9)}" r="2.2" fill="#f2cf3e"/>`); }

  // ── fig. 2: a fig cut in half, and the wasp at its door ───────────────────
  const gx = 690, gy = 690;
  out.push(`<path d="M${gx},${gy - 74} C${gx + 20},${gy - 70} ${gx + 70},${gy - 30} ${gx + 70},${gy + 20} C${gx + 70},${gy + 60} ${gx + 36},${gy + 76} ${gx},${gy + 76} C${gx - 36},${gy + 76} ${gx - 70},${gy + 60} ${gx - 70},${gy + 20} C${gx - 70},${gy - 30} ${gx - 20},${gy - 70} ${gx},${gy - 74} Z" fill="#7a4a6a" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M${gx},${gy - 56} C${gx + 14},${gy - 52} ${gx + 54},${gy - 24} ${gx + 54},${gy + 16} C${gx + 54},${gy + 48} ${gx + 28},${gy + 60} ${gx},${gy + 60} C${gx - 28},${gy + 60} ${gx - 54},${gy + 48} ${gx - 54},${gy + 16} C${gx - 54},${gy - 24} ${gx - 14},${gy - 52} ${gx},${gy - 56} Z" fill="#f4d8c8"/>`);
  const fl = [];
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * Math.PI * 2, x0 = gx + Math.cos(a) * 50, y0 = gy + 6 + Math.sin(a) * 52;
    fl.push(`M${r1(x0)},${r1(y0)} L${r1(gx + Math.cos(a) * 34)},${r1(gy + 6 + Math.sin(a) * 36)}`);
  }
  out.push(`<path d="${fl.join(" ")}" stroke="#c87a8a" stroke-width="1.6"/>`);
  // the wasp at the ostiole
  out.push(`<ellipse cx="${gx}" cy="${gy - 80}" rx="4" ry="8" fill="#2e2418"/><ellipse cx="${gx - 6}" cy="${gy - 86}" rx="6" ry="2.6" fill="#e8eef0" fill-opacity="0.8" stroke="${INK}" stroke-width="0.5"/><ellipse cx="${gx + 6}" cy="${gy - 86}" rx="6" ry="2.6" fill="#e8eef0" fill-opacity="0.8" stroke="${INK}" stroke-width="0.5"/>`);
  contact(out, gx, gy + 78, 70, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
