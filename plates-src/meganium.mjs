// NO. 0154 — the flower of a canopy that agreed on a date.
//
// What the morphology says, and what each observation became:
//
//   1. One great open flower: a double ring of broad pink petals, frilled
//      and serrated at their rims, each rim edged white.
//   2. At its heart, a cup of stamens, two of them long enough to rise far
//      above the rest and curl, with yellow anthers at their tips.
//   3. The field note files it with the mature flowering canopy, and its
//      point is mast flowering: the dipterocarp forests of Southeast Asia
//      bloom all together in years far apart, hundreds of species within
//      weeks, then nothing for years — so nothing that eats the seed can keep
//      a population alive on it. Fig. 2 is what all that flowering makes: a
//      dipterocarp fruit, two long wings and three short, spinning down.
import { mulberry32, r1, smooth, mix, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "meganium";
export const no = 154;
const SIZE = 800;
const PINK = { light: "#f8b3c1", base: "#ec7189", deep: "#c85b70", shade: "#8e3a4c", edge: "#9a3e52" };
const LEAF = { light: "#d3e8ad", base: "#a9cc86", deep: "#6e9a55", shade: "#44683a", edge: "#46683a" };

const F = { x: 322, y: 470, elev: 0.66 };
const SE = Math.sin(F.elev), CE = Math.cos(F.elev);
const proj = ([X, Y, Z]) => [F.x + X, F.y + Y * SE - Z * CE];

// A fan-shaped petal: narrow at the centre, broadest at its rim, and the rim
// itself rounded, frilled and serrated. A first version let the width fall to
// nothing at the rim, so the serrated edge collapsed to a point and stuck out
// of every petal as a dark spike.
function petal(a, RP, W, k) {
  const R0 = 26;
  const width = (u) => W * Math.pow(Math.sin(Math.PI * 0.5 * Math.pow(Math.max(0, Math.min(1, u)), 0.6)), 0.7);
  const point = (u, v, extra = 0) => {
    const frill = u > 0.5 ? 0.04 * Math.sin(u * 60 + k) : 0;
    const r = R0 + u * (RP - R0) + extra;
    const half = width(u) * v * (1 + frill);
    const Z = 20 * u - 64 * u ** 2.4 - 14 * v * v * u;
    return [Math.cos(a) * r - Math.sin(a) * half, Math.sin(a) * r + Math.cos(a) * half, Z];
  };
  const L = [], R = [];
  for (let i = 0; i <= 50; i++) { L.push(proj(point(i / 50, -1))); R.push(proj(point(i / 50, 1))); }
  // the rim: rounded outward, cut into fine teeth
  const rim = [];
  for (let j = 1; j < 36; j++) {
    const v = -1 + (2 * j) / 36;
    const bulge = 26 * Math.cos((v * Math.PI) / 2) + (j % 2 ? 5 : -2) + 4 * Math.sin(j * 1.7 + k);
    rim.push(proj(point(1, v, bulge)));
  }
  return { d: smooth(L) + rim.map(([x, y]) => ` L${r1(x)},${r1(y)}`).join("") + smooth([...R].reverse(), false, { move: false }) + " Z", point };
}

export function draw() {
  const rand = mulberry32(154);
  const defs = standardDefs(154);
  const out = [];
  contact(out, F.x, 760, 180, 16);

  // a stalk and two leaves under it
  out.push(`<path d="M${F.x - 14},${F.y + 40} C${F.x - 16},620 ${F.x - 18},700 ${F.x - 20},752 L${F.x + 20},752 C${F.x + 18},700 ${F.x + 16},620 ${F.x + 14},${F.y + 40} Z" fill="#8fb870" stroke="${INK}" stroke-width="1.6"/>`);
  for (const side of [-1, 1]) {
    const pts = [[F.x, 700], [F.x + side * 70, 680], [F.x + side * 140, 690], [F.x + side * 190, 720]];
    const b = blade(pts, { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96)), 0.7), sideVeins: 6, rand });
    paintBlade(b, { id: `lv${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.25 : 0, margin: 5 });
  }

  // two rings of petals, the outer first, each ring far side first
  const rings = [
    { n: 6, RP: 262, W: 118, off: 0 },
    { n: 6, RP: 196, W: 92, off: Math.PI / 6 },
  ];
  let id = 0;
  for (const ring of rings) {
    const list = Array.from({ length: ring.n }, (_, k) => ({ k, a: -Math.PI / 2 + ring.off + (k * 2 * Math.PI) / ring.n }))
      .sort((p, q) => Math.sin(p.a) - Math.sin(q.a));
    for (const { k, a } of list) {
      const { d, point } = petal(a, ring.RP, ring.W, k);
      const i = id++;
      const [x0, y0] = proj(point(0, 0)), [x1, y1] = proj(point(1, 0));
      const shade = Math.max(0, -Math.sin(a)) * 0.3;
      defs.push(
        `<linearGradient id="pg${i}" gradientUnits="userSpaceOnUse" x1="${r1(x0)}" y1="${r1(y0)}" x2="${r1(x1)}" y2="${r1(y1)}">` +
          `<stop offset="0" stop-color="${mix(PINK.deep, PINK.shade, 0.2 + shade)}"/><stop offset="0.45" stop-color="${mix(PINK.base, PINK.deep, shade)}"/>` +
          `<stop offset="0.9" stop-color="${mix(PINK.light, PINK.base, 0.2 + shade)}"/></linearGradient>`,
      );
      defs.push(`<clipPath id="pc${i}"><path d="${d}"/></clipPath>`);
      out.push(`<path d="${d}" fill="${PINK.base}"/><path d="${d}" fill="url(#pg${i})" filter="url(#wc)"/>`);
      // veins
      const veins = [];
      for (let v = -0.8; v <= 0.81; v += 0.2) {
        const pts = [];
        for (let s = 1; s <= 12; s++) pts.push(proj(point(0.08 + 0.86 * (s / 12), v)));
        veins.push(`<path d="${smooth(pts)}"/>`);
      }
      out.push(`<g clip-path="url(#pc${i})" fill="none" stroke="${PINK.edge}" stroke-opacity="0.25" stroke-width="1">${veins.join("")}</g>`);
      // the white edge of the frill
      out.push(`<path d="${d}" fill="none" stroke="#fff6f8" stroke-width="16" clip-path="url(#pc${i})"/>`);
      out.push(`<path d="${d}" fill="none" stroke="#f3d4da" stroke-width="5" stroke-opacity="0.8" clip-path="url(#pc${i})" transform="translate(0.8 1)"/>`);
      out.push(`<g filter="url(#pen)"><path d="${d}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/></g>`);
    }
  }

  // the cup, and the stamens standing up out of it
  const cup = [];
  for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; cup.push(proj([Math.cos(a) * 44, Math.sin(a) * 44, 10])); }
  out.push(`<path d="${smooth(cup, true)}" fill="#e8e29a" stroke="${INK}" stroke-width="1.4"/>`);
  const stamen = (a, rr, h, curl, big) => {
    const [bx0, by0] = proj([Math.cos(a) * rr, Math.sin(a) * rr, 10]);
    const pts = [[bx0, by0], [bx0 + Math.cos(a) * 6, by0 - h * 0.45], [bx0 + curl * 0.6, by0 - h * 0.85], [bx0 + curl, by0 - h]];
    const sd = smooth(pts);
    out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="${big ? 5.4 : 3.6}" stroke-linecap="round"/><path d="${sd}" fill="none" stroke="#dfeec2" stroke-width="${big ? 3 : 1.8}" stroke-linecap="round"/>`);
    const [ax, ay] = pts.at(-1);
    out.push(`<ellipse cx="${r1(ax)}" cy="${r1(ay)}" rx="${big ? 7 : 4.5}" ry="${big ? 5.5 : 3.5}" fill="#f2cf3e" stroke="${INK}" stroke-width="1.1"/>`);
  };
  for (let k = 0; k < 9; k++) stamen((k / 9) * Math.PI * 2, 24, 40 + (k % 3) * 8, (rand() - 0.5) * 14, false);
  stamen(-2.2, 12, 150, -34, true);
  stamen(-0.9, 12, 160, 30, true);

  // ── fig. 2: a dipterocarp fruit, spinning down ────────────────────────────
  const fx = 688, fy = 668;
  const g = [];
  const wing = (ang, len, w) => {
    const pts = [[fx, fy], [fx + Math.cos(ang) * len * 0.5, fy + Math.sin(ang) * len * 0.5], [fx + Math.cos(ang) * len, fy + Math.sin(ang) * len]];
    return blade(pts, { width: (u) => w * Math.pow(Math.sin(Math.PI * Math.min(1, 0.06 + u * 0.94)), 0.55), sideVeins: 0, rand });
  };
  const WING = { light: "#e8c49a", base: "#c48a5a", deep: "#8f5a36", shade: "#5a3820", edge: "#5a3820" };
  for (const [ang, len, w, i] of [[-1.9, 150, 17, 0], [-1.45, 160, 17, 1]]) {
    const b = wing(ang, len, w);
    paintBlade(b, { id: `w${i}`, palette: WING, defs, out, margin: 3, ink: 1.4 });
    for (const f of [-0.5, 0, 0.5]) {
      const pts = b.frames.filter((_, j) => j % 20 === 0 && j > 10).map(({ p, n }, j2) => [p[0] + n[0] * f * w * 0.8 * Math.sin(Math.PI * Math.min(1, (j2 + 1) / 12)), p[1] + n[1] * f * w * 0.8 * Math.sin(Math.PI * Math.min(1, (j2 + 1) / 12))]);
      g.push(`<path d="${smooth(pts)}" fill="none" stroke="${WING.edge}" stroke-width="0.8" stroke-opacity="0.5"/>`);
    }
  }
  out.push(g.join(""));
  for (const ang of [-0.7, 0.2, 2.6]) {
    const b = wing(ang, 34, 8);
    paintBlade(b, { id: `ws${r1(ang * 10)}`, palette: WING, defs, out, margin: 2, midrib: false, ink: 1.2 });
  }
  out.push(`<ellipse cx="${fx}" cy="${fy + 8}" rx="15" ry="19" fill="#8a5a36" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${fx - 5}" cy="${fy + 2}" rx="4" ry="6" fill="#b9885c" fill-opacity="0.8"/>`);
  // the spin, as a motion arc
  out.push(`<path d="M${fx - 40},${fy + 60} A46,14 0 1,0 ${fx + 44},${fy + 58}" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.6"/>`);
  contact(out, fx, 764, 60, 6, 0.18);

  return { size: SIZE, view: [0, 180, SIZE, 600], defs: defs.join("\n"), body: out.join("\n") };
}
