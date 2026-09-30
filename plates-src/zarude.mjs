// NO. 0893 — a vine wound round a branch, and what mistletoe gives back.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the vine and what it grips. A length of dark branch, and
//      wound round it in tight green coils a climbing vine — thick, glossy,
//      ridged along its turns like a wrung rope — its free end reaching off
//      the branch with a few leaves. The green coils bound round dark wood
//      the specimen wears on its arms.
//   2. The field note's record is vines that tear off and become nutrients in
//      the soil, helping the forest grow.
//   3. The note's point is what happens when a parasite is taken away.
//      Mistletoe taps its host's water while staying green, and was long
//      treated as pure damage — until an experiment stripped all of it from
//      a set of Australian woodlands, and they lost a large share of their
//      birds: the litter of mistletoe leaves was feeding the insects on the
//      ground. Fig. 2: a mistletoe clump on a branch, its berries, its fallen
//      leaves beneath.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "zarude";
export const no = 893;
const SIZE = 800;
const VINE = { light: "#9ae07a", base: "#3aa04a", deep: "#1e6e30", shade: "#0e4420", edge: "#0e4420" };

export function draw() {
  const rand = mulberry32(893);
  const defs = standardDefs(893);
  const out = [];
  contact(out, 320, 758, 250, 16);

  // the branch, dark, lying at a slant
  const x0 = 90, y0 = 740, x1 = 560, y1 = 640, r = 26;
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * r, ny = Math.cos(a) * r;
  defs.push(`<linearGradient id="br" gradientUnits="userSpaceOnUse" x1="${r1(x0 + nx)}" y1="${r1(y0 + ny)}" x2="${r1(x0 - nx)}" y2="${r1(y0 - ny)}"><stop offset="0" stop-color="#1e1a18"/><stop offset="0.5" stop-color="#3a3430"/><stop offset="1" stop-color="#6a6058"/></linearGradient>`);
  out.push(`<path d="M${r1(x0 + nx)},${r1(y0 + ny)} L${r1(x1 + nx)},${r1(y1 + ny)} L${r1(x1 - nx)},${r1(y1 - ny)} L${r1(x0 - nx)},${r1(y0 - ny)} Z" fill="url(#br)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  for (const [x, y] of [[x0, y0], [x1, y1]]) out.push(`<ellipse cx="${x}" cy="${y}" rx="10" ry="${r}" transform="rotate(${r1((a * 180) / Math.PI)} ${x} ${y})" fill="#8a7a6a" stroke="${INK}" stroke-width="1.3"/>`);
  // the coils: turns of vine wound round the branch in two bands
  const coil = (u0, u1, turns) => {
    const front = [], back = [];
    for (let k = 0; k <= turns * 24; k++) {
      const t = k / (turns * 24), u = u0 + (u1 - u0) * t, ph = t * turns * Math.PI * 2;
      const cxp = x0 + (x1 - x0) * u, cyp = y0 + (y1 - y0) * u;
      const p = [cxp + nx * Math.cos(ph) * 1.15, cyp + ny * Math.cos(ph) * 1.15];
      (Math.sin(ph) > 0 ? front : back).push(p);
    }
    return { front, back };
  };
  for (const [u0, u1, t] of [[0.18, 0.4, 4], [0.58, 0.78, 3.5]]) {
    const { front } = coil(u0, u1, t);
    // draw each front half-turn as a thick glossy rope stroke
    let seg = [];
    const segs = [];
    for (let k = 0; k < front.length; k++) {
      seg.push(front[k]);
      if (k === front.length - 1 || Math.hypot(front[k + 1][0] - front[k][0], front[k + 1][1] - front[k][1]) > 20) { segs.push(seg); seg = []; }
    }
    for (const sg of segs) {
      if (sg.length < 2) continue;
      const d = smooth(sg);
      out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${VINE.base}" stroke-width="14" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${VINE.light}" stroke-width="4" stroke-linecap="round" transform="translate(-2 -3)"/>`);
    }
  }
  // the free end reaching off the branch, with a few leaves
  const fe = `M${x0 + (x1 - x0) * 0.78},${y0 + (y1 - y0) * 0.78 - 24} C470,600 500,540 470,500`;
  out.push(`<path d="${fe}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="${fe}" fill="none" stroke="${VINE.base}" stroke-width="9" stroke-linecap="round"/>`);
  for (const [x, y, la] of [[488, 574, -0.2], [476, 520, -2.6], [470, 500, -1.3]]) {
    const b = blade([[x, y], [x + Math.cos(la) * 34, y + Math.sin(la) * 34], [x + Math.cos(la) * 70, y + Math.sin(la) * 70]], { width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), sideVeins: 3, rand });
    paintBlade(b, { id: `v${r1(la * 10)}`, palette: VINE, defs, out, margin: 3 });
  }

  // ── fig. 2: a mistletoe clump on a branch, its leaves fallen beneath ──────
  const fx = 690;
  out.push(`<path d="M${fx - 90},600 L${fx + 90},584" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${fx - 90},600 L${fx + 90},584" stroke="#6e5a44" stroke-width="7" stroke-linecap="round"/>`);
  const tuft = [];
  for (let k = 0; k < 16; k++) { const aa = Math.PI * (0.1 + rand() * 0.8), L = 30 + rand() * 30; tuft.push(`M${fx},594 l${r1(-Math.cos(aa) * L)},${r1(Math.sin(aa) * L * 0.9)}`); }
  out.push(`<path d="${tuft.join(" ")}" stroke="#8aa84a" stroke-width="3" stroke-linecap="round"/>`);
  for (let k = 0; k < 10; k++) { const aa = Math.PI * (0.1 + rand() * 0.8), L = 26 + rand() * 30; out.push(`<ellipse cx="${r1(fx - Math.cos(aa) * L)}" cy="${r1(594 + Math.sin(aa) * L * 0.9)}" rx="9" ry="4" transform="rotate(${r1(rand() * 180)} ${r1(fx - Math.cos(aa) * L)} ${r1(594 + Math.sin(aa) * L * 0.9)})" fill="#a8c46a" stroke="${INK}" stroke-width="0.7"/>`); }
  for (let k = 0; k < 6; k++) out.push(`<circle cx="${r1(fx - 24 + rand() * 48)}" cy="${r1(620 + rand() * 30)}" r="4" fill="#fbf6d8" stroke="${INK}" stroke-width="0.7"/>`);
  for (let k = 0; k < 7; k++) { const x = fx - 70 + k * 22 + rand() * 8; out.push(`<ellipse cx="${r1(x)}" cy="764" rx="9" ry="3.4" transform="rotate(${r1((rand() - 0.5) * 50)} ${r1(x)} 764)" fill="#c8b46a" stroke="${INK}" stroke-width="0.7"/>`); }
  contact(out, fx, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 440, SIZE, 350], defs: defs.join("\n"), body: out.join("\n") };
}
