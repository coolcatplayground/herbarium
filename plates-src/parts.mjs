// Parts that plates share beyond the organ model: leaf blades, lobed or
// entire, and the painting of them.
import { r1, smooth, mix, INK } from "./lib.mjs";

// Resample a polyline to n points evenly spaced along its length, with the
// tangent and left-hand normal at each.
export function resample(pts, n = 160) {
  // densify through a Catmull-Rom first, so a few control points make a curve
  const dense = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (let k = 0; k < 24; k++) {
      const t = k / 24, t2 = t * t, t3 = t2 * t;
      dense.push([0, 1].map((j) => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  dense.push(pts.at(-1));
  const cum = [0];
  for (let i = 1; i < dense.length; i++) cum.push(cum[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const L = cum.at(-1);
  const out = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const s = (L * i) / (n - 1);
    while (j < cum.length - 2 && cum[j + 1] < s) j++;
    const u = (s - cum[j]) / (cum[j + 1] - cum[j] || 1);
    out.push([dense[j][0] + (dense[j + 1][0] - dense[j][0]) * u, dense[j][1] + (dense[j + 1][1] - dense[j][1]) * u]);
  }
  const frames = out.map((p, i) => {
    const a = out[Math.max(0, i - 1)], b = out[Math.min(n - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    return { p, t: [tx / l, ty / l], n: [ty / l, -tx / l] };
  });
  return { frames, length: L };
}

// A leaf blade along a spine. `width(u)` is the half-width at u (0 base, 1
// tip). With `lobes`, the margin is cut into teeth that lean toward the tip,
// as the lobes of a pinnatifid leaf do; `depth` is how far the cut goes in.
// `teeth: "round"` gives lobes like a fern or an oak; the default is sharp,
// saw-like teeth — and sharp, narrow and radiating reads as the wrong plant.
// `sideVeins` gives an entire (unlobed) leaf its pinnate veins, arching from
// the midrib toward the margin and forward.
export function blade(spinePts, { width, lobes = 0, depth = 0.45, lean = 0.9, start = 0.08, rand = null, n = 260, teeth = "sharp", sideVeins = 0 }) {
  const { frames, length } = resample(spinePts, n);
  const tooth = (u) => {
    if (!lobes || u < start) return 1;
    const f = ((u - start) / (1 - start)) * lobes;
    const k = Math.floor(f), frac = f - k;
    // rises to a point at 0.78 of the lobe, then drops back sharply to the sinus
    const pr = teeth === "round"
      ? Math.pow(Math.sin(Math.PI * Math.min(1, frac)), 0.5)
      : frac < 0.78 ? Math.pow(frac / 0.78, 0.75) : Math.pow((1 - frac) / 0.22, 1.3);
    return 1 - depth + depth * pr;
  };
  const side = (sgn) =>
    frames.map(({ p, t, n: nn }, i) => {
      const u = i / (frames.length - 1);
      const w = width(u);
      const m = w * tooth(u);
      const jit = rand ? (rand() - 0.5) * 0.6 : 0;
      const push = (m - w * (1 - depth)) * lean * (lobes ? 1 : 0);
      return [p[0] + nn[0] * m * sgn + t[0] * push + jit, p[1] + nn[1] * m * sgn + t[1] * push + jit];
    });
  const left = side(1), right = side(-1);
  const d = smooth(left) + smooth([...right].reverse(), false, { move: false }) + " Z";
  // a vein from the midrib out to each lobe tip
  const veins = [];
  if (lobes) {
    for (let k = 0; k < lobes; k++) {
      const uS = start + ((k + 0.1) / lobes) * (1 - start);
      const uT = start + ((k + 0.78) / lobes) * (1 - start);
      const iS = Math.round(uS * (frames.length - 1)), iT = Math.round(uT * (frames.length - 1));
      for (const edge of [left, right]) {
        const a = frames[iS].p, b = edge[iT];
        const mid = [(a[0] + b[0]) / 2 + frames[iS].t[0] * 4, (a[1] + b[1]) / 2 + frames[iS].t[1] * 4];
        veins.push(`M${r1(a[0])},${r1(a[1])} Q${r1(mid[0])},${r1(mid[1])} ${r1(b[0] - (b[0] - a[0]) * 0.12)},${r1(b[1] - (b[1] - a[1]) * 0.12)}`);
      }
    }
  }
  if (!lobes && sideVeins) {
    for (let k = 1; k <= sideVeins; k++) {
      const u = 0.08 + (k / (sideVeins + 1)) * 0.84;
      const iA = Math.round(u * (frames.length - 1));
      const iB = Math.min(frames.length - 1, Math.round((u + 0.1) * (frames.length - 1)));
      for (const edge of [left, right]) {
        const a0 = frames[iA].p, e = edge[iB], mid = [(a0[0] * 0.55 + e[0] * 0.45), (a0[1] * 0.55 + e[1] * 0.45)];
        const tgt = [a0[0] + (e[0] - a0[0]) * 0.86, a0[1] + (e[1] - a0[1]) * 0.86];
        veins.push(`M${r1(a0[0])},${r1(a0[1])} Q${r1(mid[0] - frames[iA].t[0] * 3)},${r1(mid[1] - frames[iA].t[1] * 3)} ${r1(tgt[0])},${r1(tgt[1])}`);
      }
    }
  }
  return { d, left, right, spine: frames.map((f) => f.p), frames, length, veins };
}

// Paint a blade: a paler solid under a watercolour wash, graded from base to
// tip, a fleshier margin, veins, a midrib with its highlight, and a pen
// contour with a shadow line.
export function paintBlade(b, { id, palette: P, defs, out, wc = "wc", pen = "pen", shade = 0, margin = 5, veinOpacity = 0.4, midrib = true, ink = 1.6 }) {
  const [x1, y1] = b.spine[0], [x2, y2] = b.spine.at(-1);
  defs.push(
    `<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}">` +
      `<stop offset="0" stop-color="${mix(P.deep, P.shade, 0.35 + shade * 0.4)}"/>` +
      `<stop offset="0.45" stop-color="${mix(P.base, P.deep, shade * 0.6)}"/>` +
      `<stop offset="1" stop-color="${mix(P.light, P.base, 0.25 + shade * 0.5)}"/></linearGradient>`,
  );
  defs.push(`<clipPath id="${id}c"><path d="${b.d}"/></clipPath>`);
  out.push(`<path d="${b.d}" fill="${mix(mix(P.base, P.light, 0.3), P.deep, shade * 0.5)}"/>`);
  out.push(`<path d="${b.d}" fill="url(#${id}g)" filter="url(#${wc})"/>`);
  out.push(`<path d="${b.d}" fill="none" stroke="${P.light}" stroke-opacity="0.45" stroke-width="${margin}" clip-path="url(#${id}c)"/>`);
  for (const v of b.veins) out.push(`<path d="${v}" fill="none" stroke="${P.edge}" stroke-opacity="${veinOpacity}" stroke-width="1" stroke-linecap="round"/>`);
  if (midrib) {
    const rib = smooth(b.spine.slice(2, Math.round(b.spine.length * 0.93)));
    out.push(`<path d="${rib}" fill="none" stroke="${P.light}" stroke-opacity="0.75" stroke-width="2.6" stroke-linecap="round"/>`);
    out.push(`<path d="${rib}" fill="none" stroke="${P.edge}" stroke-opacity="0.5" stroke-width="1" stroke-linecap="round" transform="translate(1.2 1)"/>`);
  }
  out.push(`<g filter="url(#${pen})"><path d="${b.d}" fill="none" stroke="${INK}" stroke-width="${ink}" stroke-linejoin="round"/>` +
    `<path d="${b.d}" fill="none" stroke="${INK}" stroke-opacity="0.4" stroke-width="${ink * 0.9}" stroke-linejoin="round" transform="translate(1.1 1)" clip-path="url(#${id}c)"/></g>`);
}
