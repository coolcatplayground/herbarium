// NO. 0286 — a ringed mushroom, and the grain a fungus replaces.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the mushroom. A green cap, flattened and broad with a paler
//      band at its rim, on a pale stalk wearing a ring — the annulus, the
//      torn skirt of the veil that covered the gills while the cap was young,
//      left hanging round the stalk like a collar.
//   2. And at its foot, the second, small part: three round green spore
//      bodies on one short stem, the club the specimen carries.
//   3. The field note's record is the seeds ringing its tail, made of
//      hardened toxic spores. A toxic fungus growing out of a cereal head is
//      not invention: ergot infects rye and replaces the grain with a hard
//      dark body full of alkaloids, and bread milled from it poisoned whole
//      towns for centuries. Fig. 2: an ear of rye with ergot among its grains.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid, capUnderside } from "./kit.mjs";

export const slug = "breloom";
export const no = 286;
const SIZE = 800;
const CAP = { light: "#c4e4b0", base: "#78ac6c", deep: "#4e8450", shade: "#2c5634", edge: "#2c5634" };
const STALK = { light: "#fbf5e2", base: "#ece0c0", deep: "#c8b68c" };
const BALL = { light: "#c8e6b4", base: "#7fb070", deep: "#4e8450" };

export function draw() {
  const rand = mulberry32(286);
  const defs = standardDefs(286);
  const out = [];
  contact(out, 320, 758, 200, 16);

  // the stalk, pale, slightly swollen at the foot
  const x = 320, foot = 756, capY = 480;
  const stalk = `M${x - 34},${foot} C${x - 30},${foot - 60} ${x - 22},${capY + 120} ${x - 20},${capY + 10} L${x + 20},${capY + 10} C${x + 22},${capY + 120} ${x + 30},${foot - 60} ${x + 34},${foot} Z`;
  defs.push(`<linearGradient id="sk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${STALK.light}"/><stop offset="0.6" stop-color="${STALK.base}"/><stop offset="1" stop-color="${STALK.deep}"/></linearGradient>`);
  out.push(`<path d="${stalk}" fill="url(#sk)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (const dx of [-10, 0, 10]) out.push(`<path d="M${x + dx * 1.6},${foot - 4} Q${x + dx * 1.2},${foot - 140} ${x + dx},${capY + 20}" fill="none" stroke="${STALK.deep}" stroke-width="0.9" stroke-opacity="0.6"/>`);

  // the cap: broad and flattened, gills under it
  const cap = makeOrgan({
    x, base: capY, H: 96, R: 176, tilt: -0.1,
    knots: [[0, 1], [0.2, 0.97], [0.45, 0.86], [0.7, 0.64], [0.9, 0.34], [1, 0.12]],
  });
  capUnderside(cap, out, { fill: "#e8e2c4", gill: "#a89c74", hub: 0.14 });
  paintSolid(cap, { id: "c", outline: hull(cap), palette: CAP, defs, out, hatch: 4, tHatch: [0.1, 0.6] });
  // the paler band round the rim
  const band = [];
  for (let j = 0; j <= 40; j++) band.push(cap.surface(-Math.PI / 2 + (j / 40) * Math.PI, 0.1, 1.004));
  out.push(`<path d="${smooth(band)}" fill="none" stroke="${CAP.light}" stroke-width="14" stroke-opacity="0.75" clip-path="url(#cc)"/>`);
  out.push(`<path d="${hull(cap)}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);

  // the ring: the veil's torn skirt hanging round the stalk
  const ry = capY + 90;
  const hem = Array.from({ length: 8 }, (_, i) => {
    const u = (i + 1) / 8;
    return `L${r1(x - 42 + u * 84)},${r1(ry + 44 + (i % 2 ? 0 : 7) + Math.sin(u * Math.PI) * 10)}`;
  }).join(" ");
  const ring = `M${x - 26},${ry} C${x - 44},${ry + 10} ${x - 50},${ry + 34} ${x - 42},${ry + 44} ${hem} C${x + 50},${ry + 34} ${x + 44},${ry + 10} ${x + 26},${ry} Z`;
  out.push(`<path d="${ring}" fill="${STALK.light}" stroke="${INK}" stroke-width="1.6"/>`);
  for (const dx of [-30, -15, 0, 15, 30]) out.push(`<path d="M${x + dx * 0.6},${ry + 4} L${x + dx},${ry + 44}" stroke="${STALK.deep}" stroke-width="0.9"/>`);

  // at its foot, the club: three spore bodies on a short stem
  const bx = 510, by = 734;
  const cs = `M${bx - 70},${by + 20} C${bx - 40},${by + 10} ${bx - 20},${by - 4} ${bx},${by - 10}`;
  out.push(`<path d="${cs}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${cs}" fill="none" stroke="${STALK.base}" stroke-width="6" stroke-linecap="round"/>`);
  defs.push(`<radialGradient id="ball" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${BALL.light}"/><stop offset="0.6" stop-color="${BALL.base}"/><stop offset="1" stop-color="${BALL.deep}"/></radialGradient>`);
  for (const [dx, dy, r] of [[8, -30, 20], [30, -6, 19], [2, 8, 18]]) out.push(`<circle cx="${bx + dx}" cy="${by + dy}" r="${r}" fill="url(#ball)" stroke="${INK}" stroke-width="1.5" filter="url(#pen)"/>`);

  // ── fig. 2: an ear of rye, ergot among the grain ──────────────────────────
  const fx = 690, base = 770;
  const figFrom = out.length;
  const culm = `M${fx - 10},${base} C${fx - 6},${base - 80} ${fx},${base - 140} ${fx + 6},${base - 170}`;
  out.push(`<path d="${culm}" fill="none" stroke="${INK}" stroke-width="4"/><path d="${culm}" fill="none" stroke="#c8b070" stroke-width="2.4"/>`);
  const ERGOT = new Set([3, 8, 12]);
  for (let k = 0; k < 16; k++) {
    const side = k % 2 ? 1 : -1, y = base - 80 - k * 6.4, gx = fx - 4 + (k / 16) * 10;
    if (ERGOT.has(k)) {
      // a sclerotium: long, dark, curved, standing out of the ear
      out.push(`<path d="M${r1(gx)},${r1(y)} q${r1(side * 14)},-10 ${r1(side * 16)},-34 q${r1(-side * 6)},4 ${r1(-side * 12)},30 Z" fill="#3a2a30" stroke="${INK}" stroke-width="0.9"/>`);
    } else {
      out.push(`<ellipse cx="${r1(gx + side * 7)}" cy="${r1(y - 5)}" rx="4.4" ry="8" transform="rotate(${side * 29} ${r1(gx + side * 7)} ${r1(y - 5)})" fill="#e2c880" stroke="${INK}" stroke-width="0.8"/>`);
      out.push(`<path d="M${r1(gx + side * 8)},${r1(y - 12)} l${side * 8},-26" stroke="#b89a58" stroke-width="0.8"/>`);
    }
  }
  void rand;
  out.push(`<g transform="translate(${fx} ${base}) scale(1.4) translate(${-fx} ${-base})">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, fx, base + 2, 54, 5, 0.2);

  return { size: SIZE, view: [0, 340, SIZE, 450], defs: defs.join("\n"), body: out.join("\n") };
}
