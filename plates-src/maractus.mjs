// NO. 0556 — cactus pads in flower, and a pod that meters its seed.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a prickly pear. Flat oval pads, bright green, one growing
//      from the rim of another, dotted with areoles each bearing a tuft of
//      short yellow spines; and on the rims of the top pads, magenta
//      flowers, many-petalled, cupped, with yellow at the heart. The flowers
//      on its arms and head, the yellow spines — what the specimen carries.
//   2. The field note's record is that once a year it scatters seeds packed
//      with nutrients, a precious food in the desert.
//   3. The note's point is that a dry pod that rattles is often a metering
//      device. A poppy's capsule ripens with a ring of small pores under its
//      rim and no other way out, so seed can only leave when the stiff stalk
//      is bent hard over and flicked back — the censer mechanism, a pinch at
//      a time. Fig. 2: a poppy capsule on its stalk, bent, shaking out seed.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "maractus";
export const no = 556;
const SIZE = 800;
const PAD = { light: "#c8ecac", base: "#6cb858", deep: "#3e8a3e", shade: "#245a26" };
const PINK = { light: "#fbc4e0", base: "#e25aa8", deep: "#a42e74" };

function pad(out, defs, id, cx, cy, rx, ry, rot, rand) {
  defs.push(`<radialGradient id="${id}" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="${PAD.light}"/><stop offset="0.6" stop-color="${PAD.base}"/><stop offset="1" stop-color="${PAD.deep}"/></radialGradient>`);
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="url(#${id})" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  // areoles in diagonal rows, each a small felt dot with a tuft of spines
  const a = (rot * Math.PI) / 180;
  const sp = [], ar = [];
  for (let i = -3; i <= 3; i++) {
    for (let j = -4; j <= 4; j++) {
      const u = (i + (j % 2) * 0.5) / 3.6, v = j / 4.6;
      if (u * u + v * v > 0.78) continue;
      const lx = u * rx, ly = v * ry;
      const x = cx + lx * Math.cos(a) - ly * Math.sin(a), y = cy + lx * Math.sin(a) + ly * Math.cos(a);
      ar.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="2.8" fill="#f2e8c8" stroke="#8a7a4a" stroke-width="0.5"/>`);
      for (let q = 0; q < 3; q++) { const aa = -Math.PI / 2 + (q - 1) * 0.6 + (rand() - 0.5) * 0.4; sp.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(aa) * 9)},${r1(Math.sin(aa) * 9)}`); }
    }
  }
  out.push(ar.join(""));
  out.push(`<path d="${sp.join(" ")}" stroke="#e8c83a" stroke-width="1.4" stroke-linecap="round"/>`);
}

function flower(out, x, y, r) {
  for (let k = 0; k < 12; k++) {
    const a = -Math.PI / 2 + (k / 12) * Math.PI * 2 + (k % 2) * 0.1;
    const px = x + Math.cos(a) * r * 0.6, py = y + Math.sin(a) * r * 0.45;
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="${r1(r * 0.55)}" ry="${r1(r * 0.3)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="${k % 2 ? PINK.base : PINK.light}" stroke="${INK}" stroke-width="1"/>`);
  }
  out.push(`<circle cx="${x}" cy="${y}" r="${r1(r * 0.3)}" fill="#f2cf3e" stroke="${INK}" stroke-width="1"/>`);
}

export function draw() {
  const rand = mulberry32(556);
  const defs = standardDefs(556);
  const out = [];
  contact(out, 320, 758, 200, 16);

  pad(out, defs, "p1", 320, 650, 90, 112, 0, rand);
  pad(out, defs, "p2", 214, 520, 66, 84, -28, rand);
  pad(out, defs, "p3", 420, 506, 66, 84, 26, rand);
  pad(out, defs, "p4", 330, 470, 56, 72, 6, rand);
  // the flowers on the rims of the top pads
  flower(out, 170, 446, 34);
  flower(out, 464, 434, 34);
  flower(out, 338, 402, 30);

  // ── fig. 2: a poppy capsule, bent over, shaking out its seed ──────────────
  const fx = 630, g = 766;
  out.push(`<path d="M${fx},${g} C${fx + 4},${g - 70} ${fx + 30},${g - 130} ${fx + 70},${g - 140}" fill="none" stroke="${INK}" stroke-width="4"/><path d="M${fx},${g} C${fx + 4},${g - 70} ${fx + 30},${g - 130} ${fx + 70},${g - 140}" fill="none" stroke="#9aaa6a" stroke-width="2.4"/>`);
  const cx2 = fx + 82, cy2 = g - 132;
  out.push(`<g transform="rotate(60 ${cx2} ${cy2})"><ellipse cx="${cx2}" cy="${cy2}" rx="18" ry="22" fill="#b8b48a" stroke="${INK}" stroke-width="1.4"/>` +
    `<path d="M${cx2 - 20},${cy2 - 20} L${cx2 + 20},${cy2 - 20} L${cx2 + 14},${cy2 - 28} L${cx2 - 14},${cy2 - 28} Z" fill="#8a8660" stroke="${INK}" stroke-width="1.2"/>` +
    [-12, -4, 4, 12].map((dx) => `<circle cx="${cx2 + dx}" cy="${cy2 - 17}" r="1.8" fill="#3a3024"/>`).join("") + `</g>`);
  const seeds = [];
  for (let k = 0; k < 24; k++) { const u = rand(); seeds.push(`<circle cx="${r1(cx2 + 30 + u * 40 + (rand() - 0.5) * 12)}" cy="${r1(cy2 + 2 + u * u * 90)}" r="1.4" fill="#3a3a44"/>`); }
  out.push(seeds.join(""));
  out.push(`<path d="M${fx + 40},${g - 170} q20,-6 32,6" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3"/>`);
  contact(out, fx + 20, g + 2, 70, 5, 0.18);

  return { size: SIZE, view: [0, 340, SIZE, 450], defs: defs.join("\n"), body: out.join("\n") };
}
