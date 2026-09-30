// NO. 0652 (Mega) — the husk grown into a shield, and wood that sinks.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the husk of NO. 0652, hardened. Where the ordinary form is a
//      chestnut burr opened on its nut, the Mega form's is the pale leathery
//      capsule of a horse chestnut — thick, cream-white, flecked green, armed
//      with a few stout conical spines instead of a fleece of fine ones —
//      split into its three valves round the glossy brown nut. The white
//      spotted shell and its great cones.
//   2. The record is about withstanding things: a tackle that flips a tank, a
//      posture that could take a blast.
//   3. The note's point is that nothing was added. Height and mass are
//      unchanged, yet defence rises: the interior was rebuilt. Real wood
//      density varies about fourfold between species, and the densest — the
//      ironwoods — are heavier than water. Fig. 2: two blocks of one size in
//      a tank, a light wood floating high and an ironwood lying on the bottom.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "chesnaught-mega";
export const no = 652;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(6520);
  const defs = standardDefs(6520);
  const out = [];
  contact(out, 300, 758, 230, 18);

  defs.push(`<radialGradient id="hv" cx="0.4" cy="0.3" r="0.85"><stop offset="0" stop-color="#fbf8ee"/><stop offset="0.6" stop-color="#e8e2cc"/><stop offset="1" stop-color="#a8a288"/></radialGradient>`);
  defs.push(`<linearGradient id="hi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf6e0"/><stop offset="1" stop-color="#d8ceac"/></linearGradient>`);
  defs.push(`<radialGradient id="nut" cx="0.36" cy="0.28" r="0.8"><stop offset="0" stop-color="#c8844a"/><stop offset="0.5" stop-color="#8a4a22"/><stop offset="1" stop-color="#4a2410"/></radialGradient>`);
  const spine = (x, y, a, L, w) => {
    const tx = x + Math.cos(a) * L, ty = y + Math.sin(a) * L, nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
    out.push(`<path d="M${r1(x + nx)},${r1(y + ny)} L${r1(tx)},${r1(ty)} L${r1(x - nx)},${r1(y - ny)} Z" fill="url(#hi)" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`);
  };
  const flecks = (clip, x0, y0, w, h, n) => {
    const f = [];
    for (let k = 0; k < n; k++) f.push(`<ellipse cx="${r1(x0 + rand() * w)}" cy="${r1(y0 + rand() * h)}" rx="${r1(6 + rand() * 12)}" ry="${r1(5 + rand() * 9)}" fill="#6a9a4e" fill-opacity="0.7"/>`);
    out.push(`<g clip-path="url(#${clip})">${f.join("")}</g>`);
  };
  // the two side valves, splayed open, their pale insides up
  const valves = [
    ["vl", "M300,740 C230,748 120,748 86,712 C70,690 90,650 140,634 C200,620 270,650 300,700 Z", -1],
    ["vr", "M300,740 C370,748 480,748 514,712 C530,690 510,650 460,634 C400,620 330,650 300,700 Z", 1],
  ];
  for (const [id, d, s] of valves) {
    out.push(`<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#hv)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
    flecks(id, s < 0 ? 90 : 300, 630, 210, 120, 9);
    out.push(`<path d="M${300 + s * 30},712 C${300 + s * 90},680 ${300 + s * 150},664 ${300 + s * 190},676" fill="none" stroke="#fbf6e8" stroke-width="10" stroke-opacity="0.8"/>`);
    for (const [x, y, a, L] of [[246, 656, -1.9, 38], [176, 638, -2.25, 50], [104, 670, -2.7, 40]]) spine(s < 0 ? x : 600 - x, y, s < 0 ? a : Math.PI - a, L, 11);
  }
  // the glossy nut
  out.push(`<path d="M300,736 C236,736 220,680 240,640 C258,604 342,604 360,640 C380,680 364,736 300,736 Z" fill="url(#nut)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<path d="M252,690 C256,650 280,630 312,628 C290,646 276,668 268,700 Z" fill="#fbe8d2" fill-opacity="0.3"/>`);
  // the back valve, rising behind, with the great cone at its crown
  const back = "M190,640 C190,560 250,520 300,520 C350,520 410,560 410,640 C380,614 340,600 300,600 C260,600 220,614 190,640 Z";
  out.unshift(`<clipPath id="vb"><path d="${back}"/></clipPath><path d="${back}" fill="url(#hv)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  const bf = [];
  for (let k = 0; k < 7; k++) bf.push(`<ellipse cx="${r1(200 + rand() * 200)}" cy="${r1(528 + rand() * 80)}" rx="${r1(8 + rand() * 10)}" ry="${r1(6 + rand() * 8)}" fill="#6a9a4e" fill-opacity="0.7"/>`);
  out.splice(1, 0, `<g clip-path="url(#vb)">${bf.join("")}</g>`);
  const cone = [];
  const spineAt = (x, y, a, L, w) => { const tx = x + Math.cos(a) * L, ty = y + Math.sin(a) * L, nx = -Math.sin(a) * w, ny = Math.cos(a) * w; cone.push(`<path d="M${r1(x + nx)},${r1(y + ny)} L${r1(tx)},${r1(ty)} L${r1(x - nx)},${r1(y - ny)} Z" fill="url(#hi)" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`); };
  spineAt(300, 530, -Math.PI / 2, 80, 20);
  spineAt(226, 566, -Math.PI / 2 - 0.8, 50, 12);
  spineAt(374, 566, -Math.PI / 2 + 0.8, 50, 12);
  out.unshift(...cone);

  // ── fig. 2: two blocks of one size in water, one floats and one sinks ─────
  const fx = 680;
  out.push(`<rect x="${fx - 90}" y="640" width="180" height="126" fill="#dcecf4" fill-opacity="0.6" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<path d="M${fx - 90},668 L${fx + 90},668" stroke="#6a9ad8" stroke-width="1.6"/>`);
  out.push(`<rect x="${fx - 70}" y="652" width="44" height="30" fill="#f2e2b8" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<rect x="${fx + 20}" y="734" width="44" height="30" fill="#4a2c1a" stroke="${INK}" stroke-width="1.2"/>`);
  for (let k = 0; k < 8; k++) out.push(`<path d="M${fx + 20},${737 + k * 3.4} l44,0" stroke="#2a1a0e" stroke-width="0.8"/>`);
  contact(out, fx, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 420, SIZE, 370], defs: defs.join("\n"), body: out.join("\n") };
}
