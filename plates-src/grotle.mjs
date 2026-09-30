// NO. 0388 — two shrubs on a mound, and the roots under a rye plant.
//
// What the morphology says, and what each observation became:
//
//   1. The part: two shrubs, established, dense and domed, their foliage
//      small and pointed, set side by side on a low mound of earth — the
//      thicket the specimen carries. Woody stems just showing at their feet.
//   2. The mound's lip is pale and sandy where it has dried, the colour of
//      the rim the specimen's shell is known by.
//   3. The field note's point is how much of an established plant is out of
//      sight. In 1937 Dittmer grew a single winter rye plant in a box of
//      soil and washed the whole root system out to measure it: some six
//      hundred kilometres of root, and roughly ten thousand of root hairs,
//      under a shoot you could hold in one hand. Fig. 2: that plant, the
//      soil line across it, and the proportion below.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact, roots, paintRoots } from "./kit.mjs";

export const slug = "grotle";
export const no = 388;
const SIZE = 800;
const BUSH = ["#3f8a44", "#4e9a4c", "#5aa656", "#347a3c", "#62ae5a"];
const EARTH = { light: "#d8c090", base: "#a8845a", deep: "#6e5438" };

// a domed shrub: many small pointed leaves, darker below, lighter on top
function shrub(out, rand, cx, base, W, H) {
  // the woody stems at its foot
  const st = [];
  for (let k = 0; k < 5; k++) st.push(`M${r1(cx - 20 + k * 10)},${base} Q${r1(cx - 18 + k * 9)},${base - 8} ${r1(cx - 24 + k * 12)},${base - 16}`);
  out.push(`<path d="${st.join(" ")}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="${st.join(" ")}" stroke="#7a5e3a" stroke-width="3" stroke-linecap="round"/>`);
  const leaves = [];
  for (let k = 0; k < 760; k++) {
    // sample a dome, lower rows first so the top overlaps
    const v = k / 760;
    const a = rand() * Math.PI;
    const r = Math.sqrt(rand());
    const x = cx + Math.cos(a) * W * r * (rand() < 0.5 ? 1 : -1) * 0.98;
    const topY = base - 8 - H * Math.sqrt(Math.max(0, 1 - ((x - cx) / W) ** 2));
    const y = base - 8 - (base - 8 - topY) * (0.05 + 0.95 * v) + (rand() - 0.5) * 12;
    const ang = -Math.PI / 2 + (x - cx) / W * 1.2 + (rand() - 0.5) * 1.2;
    const L = 13 + rand() * 7;
    const tip = [x + Math.cos(ang) * L, y + Math.sin(ang) * L];
    const nx = -Math.sin(ang) * 4, ny = Math.cos(ang) * 4;
    const col = BUSH[Math.min(BUSH.length - 1, Math.floor(v * BUSH.length * 0.6 + rand() * 2))];
    leaves.push(`<path d="M${r1(x)},${r1(y)} Q${r1((x + tip[0]) / 2 + nx)},${r1((y + tip[1]) / 2 + ny)} ${r1(tip[0])},${r1(tip[1])} Q${r1((x + tip[0]) / 2 - nx)},${r1((y + tip[1]) / 2 - ny)} ${r1(x)},${r1(y)} Z" fill="${col}" stroke="${INK}" stroke-width="0.5" stroke-opacity="0.6"/>`);
  }
  out.push(leaves.join(""));
}

export function draw() {
  const rand = mulberry32(388);
  const defs = standardDefs(388);
  const out = [];
  contact(out, 320, 758, 240, 16);

  // the mound
  const mound = `M80,760 C110,700 200,672 320,668 C440,664 530,696 560,760 Z`;
  defs.push(`<linearGradient id="md" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${EARTH.base}"/><stop offset="1" stop-color="${EARTH.deep}"/></linearGradient>`);
  out.push(`<path d="${mound}" fill="url(#md)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  // its pale sandy lip
  out.push(`<path d="M92,742 C130,700 210,680 320,677 C430,674 510,700 548,742" fill="none" stroke="${EARTH.light}" stroke-width="9" stroke-opacity="0.9"/>`);
  out.push(`<path d="M92,742 C130,700 210,680 320,677 C430,674 510,700 548,742" fill="none" stroke="${INK}" stroke-width="0.9" stroke-opacity="0.5" transform="translate(0 5)"/>`);

  shrub(out, rand, 220, 690, 120, 150);
  shrub(out, rand, 410, 688, 130, 170);

  // ── fig. 2: Dittmer's rye — the shoot, the soil line, the roots ────────────
  const fx = 700, soil = 620;
  out.push(`<rect x="${fx - 84}" y="${soil}" width="168" height="146" rx="3" fill="#b8966a" fill-opacity="0.5" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="M${fx - 84},${soil} L${fx + 84},${soil}" stroke="#6e5436" stroke-width="2"/>`);
  paintRoots(roots(fx, soil + 2, { rand, n: 16, len: 120, spread: 2.9, forks: 4, droop: 0.9 }), out, { body: "#efe6cc", ink: 0.7 });
  // the shoot above: a few grass blades
  for (const [dx, a, L] of [[-4, -1.8, 46], [0, -1.55, 58], [4, -1.3, 44], [2, -1.65, 36]]) {
    out.push(`<path d="M${fx + dx},${soil} q${r1(Math.cos(a) * L * 0.5)},${r1(Math.sin(a) * L * 0.5)} ${r1(Math.cos(a) * L + 6)},${r1(Math.sin(a) * L)}" fill="none" stroke="${INK}" stroke-width="3.4"/><path d="M${fx + dx},${soil} q${r1(Math.cos(a) * L * 0.5)},${r1(Math.sin(a) * L * 0.5)} ${r1(Math.cos(a) * L + 6)},${r1(Math.sin(a) * L)}" fill="none" stroke="#7ab058" stroke-width="2"/>`);
  }
  void smooth;
  contact(out, fx, 768, 96, 6, 0.18);

  return { size: SIZE, view: [0, 340, SIZE, 450], defs: defs.join("\n"), body: out.join("\n") };
}
