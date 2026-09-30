// Shared tools for drawing specimen plates.
//
// A plate is drawn in code, rendered to WebP by scripts/render-plates.mjs, and
// served from public/plates/ — where the site picks it up in place of the
// sprite (see src/data/plates.js). Each plate module exports:
//
//   slug       the specimen, as field-notes.txt and PokéAPI spell it
//   draw()     returns { size, defs, body } — the inside of one SVG document
//
// Plates stand in the glass vitrine on every card and specimen sheet, on a
// transparent ground, bottom-aligned to the case floor, with the drop shadow
// supplied by CSS. So a plate is an object, not a sheet of paper: no
// background, no border, and nothing important in the bottom few pixels.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const r1 = (n) => Math.round(n * 10) / 10;

// Catmull-Rom through the points, as cubic Béziers. With `move: false` the
// path continues from wherever the pen already is, with a line to the first
// point — for joining curves into one outline with sharp corners between them.
export function smooth(pts, closed = false, { move = true } = {}) {
  const n = pts.length;
  if (n < 2) return "";
  const at = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `${move ? "M" : " L"}${r1(pts[0][0])},${r1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])},${r1(c1[1])} ${r1(c2[0])},${r1(c2[1])} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return closed ? d + " Z" : d;
}

// Monotone cubic interpolation (Fritsch–Carlson) through [x, y] knots, for
// profiles: it never overshoots, so a bulb's outline never grows a bump the
// knots did not ask for.
export function monotone(knots) {
  const xs = knots.map((k) => k[0]);
  const ys = knots.map((k) => k[1]);
  const n = knots.length;
  const d = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  const f = (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
  f.slope = (x, e = 1e-4) => (f(x + e) - f(x - e)) / (2 * e);
  return f;
}

export const mix = (a, b, t) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

// The watercolour treatment. Three things a flat fill lacks, each one noise:
//
//   warp    the edge is never a clean vector curve
//   bloom   broad blotches where the pigment pooled thicker or thinner —
//           the uneven tone that is most of what makes a wash look painted
//   grain   granulation, colour settled into the tooth of the paper
//
// Grain is deliberately coarse (0.38, not ~0.8): plates render at twice size
// and are scaled down, and a finer grain simply averages away in the scaling.
// Apply it over a paler solid base, not an identical one, or the variation it
// makes has nothing to show against.
export function watercolour(id, seed, { warp = 6, grain = 0.5, bloom = 0.9 } = {}) {
  return `<filter id="${id}" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="${seed}" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="${warp}" xChannelSelector="R" yChannelSelector="G" result="rough"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="${seed + 3}" result="b"/>
    <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${bloom * 1.6} 0 0 0 ${1 - bloom * 0.95}" result="bloom"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.38" numOctaves="2" seed="${seed + 7}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${grain} 0 0 0 ${1 - grain * 0.75}" result="tooth"/>
    <feComposite in="bloom" in2="tooth" operator="arithmetic" k1="1" result="mask"/>
    <feComposite in="rough" in2="mask" operator="in"/>
  </filter>`;
}

// A pen line is never a perfect vector: a very slight wobble, too small to
// see as wobble, is what stops a contour reading as clip art.
export const handInk = (id, seed) =>
  `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter>`;

export const blur = (id, sd) =>
  `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

export const INK = "#3f3226";

// A plate is drawn on a square board but may be cropped to its subject with
// `view: [x, y, w, h]` — the case shows it contained, so empty board above a
// squat specimen only makes the specimen smaller in its case.
export function svgDocument({ size, view, defs, body }) {
  const [x, y, w, h] = view || [0, 0, size, size];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">
<defs>${defs}</defs>
${body}
</svg>`;
}
