// An organ built the way NO. 0001's bulb was: a tube of varying radius round
// a spine that runs straight and then bends, clothed in broad scales laid in a
// spiral. Bulbs, buds, cones, closed flowers — anything imbricate.
//
// Everything that makes the drawing hold together as a solid object comes
// from the surface itself: what is visible from where we stand, which scale
// hides which, where the light falls. See bulbasaur.mjs for why the model
// replaced sketching.
//
// The defaults are NO. 0001's; its plate is drawn with this module and must
// come out byte-identical to the version drawn before it existed.
import { r1, smooth, monotone, mix, INK } from "./lib.mjs";

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const m = Math.hypot(...a) || 1; return a.map((x) => x / m); };

export function makeOrgan({
  x, base, H, R, tilt = 0.22, bendFrom = 1, bendMax = 0,
  knots, light = [-0.5, 0.72, 0.5],
}) {
  const shape = monotone(knots);
  const SPINE = (() => {
    const n = 600, out = [];
    let sx = 0, sy = 0;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      // an organ that does not bend has bendFrom = 1, and at its very tip the
      // formula below is 0/0 — NaN, which silently poisons every outline
      const phi = t < bendFrom || bendFrom >= 1 ? 0 : bendMax * ((t - bendFrom) / (1 - bendFrom)) ** 1.8;
      out.push([sx, sy, phi]);
      sx += Math.sin(phi) * (H / n);
      sy += Math.cos(phi) * (H / n);
    }
    return out;
  })();
  const spineAt = (t) => {
    const f = Math.max(0, Math.min(1, t)) * (SPINE.length - 1);
    const i = Math.min(SPINE.length - 2, Math.floor(f)), u = f - i;
    const a = SPINE[i], b = SPINE[i + 1];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  };
  // A point on the surface in 3D: X right, Y up, Z toward us. `grow` scales
  // the radius, for a layer worn outside another (sepals round a bud).
  const P3 = (theta, t, grow = 1) => {
    const [ax, ay, phi] = spineAt(t);
    const r = R * shape(Math.max(0, Math.min(1, t))) * grow;
    const s = Math.sin(theta);
    return [ax + r * s * Math.cos(phi), ay - r * s * Math.sin(phi), r * Math.cos(theta)];
  };
  const COS = Math.cos(tilt), SIN = Math.sin(tilt);
  const project = ([X, Y, Z]) => [x + X, base - (Y * COS - Z * SIN)];
  const surface = (theta, t, grow = 1) => project(P3(theta, t, grow));
  const normal = (theta, t) => {
    const tt = Math.max(0.002, Math.min(0.994, t)), e = 1e-3;
    const dT = sub(P3(theta, tt + e), P3(theta, tt - e));
    const dA = sub(P3(theta + e, tt), P3(theta - e, tt));
    let n = unit(cross(dT, dA));
    const [ax, ay] = spineAt(tt);
    if (dot(n, sub(P3(theta, tt), [ax, ay, 0])) < 0) n = n.map((v) => -v);
    return n;
  };
  const VIEW = [0, SIN, COS];
  const LIGHT = unit(light);
  const lit = (theta, t) => dot(normal(theta, t), LIGHT);
  // The part of the ring at height t that faces us, walking out from the
  // front until the surface turns away. Bent, the organ is not symmetric, so
  // the two ends are found separately.
  const cache = new Map();
  const range = (t) => {
    const key = Math.round(t * 2000);
    if (cache.has(key)) return cache.get(key);
    const step = 0.006;
    let lo = 0, hi = 0;
    while (lo > -Math.PI && dot(normal(lo - step, t), VIEW) > 0) lo -= step;
    while (hi < Math.PI && dot(normal(hi + step, t), VIEW) > 0) hi += step;
    const r = [lo, hi];
    cache.set(key, r);
    return r;
  };
  const silhouette = () => {
    const sl = [], sr = [];
    for (let i = 0; i <= 90; i++) {
      const t = Math.min(0.997, i / 90);
      const [lo, hi] = range(t);
      sl.push(surface(lo, t));
      sr.push(surface(hi, t));
    }
    sl.push(surface(0, 1));
    const [lo0, hi0] = range(0);
    const rim = [];
    for (let j = 1; j < 16; j++) rim.push(surface(hi0 - ((hi0 - lo0) * j) / 16, 0));
    return smooth(sl) + smooth([...sr].reverse(), false, { move: false }) + rim.map(([px, py]) => ` L${r1(px)},${r1(py)}`).join("") + " Z";
  };
  return { x, base, H, R, shape, spineAt, P3, surface, normal, lit, range, silhouette };
}

// ── scales ───────────────────────────────────────────────────────────────────
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// `tEnd(theta, k, back)` says how far up each scale runs; `fray` crinkles the
// margins near the top, for petals whose tips are just about to part.
export function makeScales(organ, { n = 5, phi0 = -0.3, w0 = 0.9, tEnd, grow = 1, fray = 0, start = 0 } = {}) {
  const scales = Array.from({ length: n }, (_, k) => {
    const theta = wrap(phi0 + (k * 2 * Math.PI) / n);
    const back = Math.abs(theta) > 2;
    return { k, theta, back, tEnd: tEnd(theta, k, back) };
  });
  const order = [...scales].sort((a, b) => (b.back - a.back) || (Math.abs(b.theta) - Math.abs(a.theta)));
  const width = (s, t) => w0 * Math.pow(Math.max(0, 1 - Math.pow(t / s.tEnd, 2.4)), 0.55);
  const frayAt = (t, s, side) => (fray ? fray * Math.sin(58 * t + s.k * 3 + side) * Math.max(0, (t / s.tEnd - 0.72) / 0.28) : 0);

  const outline = (s) => {
    const left = [], right = [];
    let first = null;
    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const t = start + ((s.tEnd - start) * i) / steps;
      const w = width(s, t);
      const [vlo, vhi] = organ.range(t);
      let lo = s.theta - w + 0.025 * Math.sin(9 * t + s.k) + frayAt(t, s, 0);
      let hi = s.theta + w + 0.025 * Math.sin(7 * t + 2 * s.k) - frayAt(t, s, 1.7);
      lo = Math.max(lo, vlo);
      hi = Math.min(hi, vhi);
      if (lo >= hi) continue;
      if (first === null) first = { t, lo, hi };
      left.push(organ.surface(lo, t, grow));
      right.push(organ.surface(hi, t, grow));
    }
    if (!left.length) return null;
    let d = smooth(left) + smooth([...right].reverse(), false, { move: false });
    if (first.t === start) {
      const arc = [];
      for (let j = 1; j < 12; j++) arc.push(organ.surface(first.hi - ((first.hi - first.lo) * j) / 12, start, grow));
      d += arc.map(([px, py]) => ` L${r1(px)},${r1(py)}`).join("");
    }
    return d + " Z";
  };
  // lines along a scale, at a fixed fraction of its width
  const along = (s, f, t0 = 0.03, t1 = 0.96) => {
    const runs = [[]];
    for (let i = 0; i <= 48; i++) {
      const t = s.tEnd * (t0 + ((t1 - t0) * i) / 48);
      const th = s.theta + f * width(s, t);
      const [lo, hi] = organ.range(t);
      if (th > lo + 0.02 && th < hi - 0.02) runs.at(-1).push(organ.surface(th, t, grow));
      else if (runs.at(-1).length) runs.push([]);
    }
    return runs.filter((r) => r.length > 2).map((r) => smooth(r));
  };
  return { scales, order, width, outline, along, w0 };
}

// Paint a set of scales, back to front, the way NO. 0001's are painted: a
// cast shadow on the scale beneath, a paler solid under a watercolour wash, a
// fleshier margin, varying veins, a midrib, a sheen on the sunward side, and a
// pen contour with a shadow line under it.
export function paintScales(organ, set, {
  id, palette, rand, defs, out,
  gradient = [-240, -520, 260, 0], veins = [-0.78, -0.6, -0.44, -0.27, -0.12, 0.12, 0.27, 0.44, 0.6, 0.78],
  sheen = [30, 88, 0.5], midrib = true, silClip = "sil", wc = "wc", pen = "pen", margin = 9,
}) {
  const P = palette;
  for (const s of set.order) {
    const d = set.outline(s);
    if (!d) continue;
    const [lo, hi] = organ.range(0.35);
    const mid = Math.max(lo + 0.1, Math.min(hi - 0.1, s.theta));
    const shade = Math.max(0, Math.min(0.75, 0.5 - 0.62 * organ.lit(mid, 0.35)));
    const g = `${id}g${s.k}`;
    const [gx1, gy1, gx2, gy2] = gradient;
    defs.push(
      `<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="${organ.x + gx1}" y1="${organ.base + gy1}" x2="${organ.x + gx2}" y2="${organ.base + gy2}">` +
        `<stop offset="0" stop-color="${mix(P.light, P.deep, shade * 0.55)}"/>` +
        `<stop offset="0.5" stop-color="${mix(P.base, P.deep, shade * 0.7)}"/>` +
        `<stop offset="1" stop-color="${mix(P.deep, P.shade, 0.3 + shade * 0.5)}"/></linearGradient>`,
    );
    const clip = `${id}c${s.k}`;
    defs.push(`<clipPath id="${clip}"><path d="${d}"/></clipPath>`);
    if (!s.back) out.push(`<path d="${d}" fill="none" stroke="${P.cast}" stroke-opacity="0.55" stroke-width="12" filter="url(#soft)" clip-path="url(#${silClip})"/>`);
    out.push(`<path d="${d}" fill="${mix(mix(P.base, P.light, 0.45), P.deep, shade * 0.5)}"/>`);
    out.push(`<path d="${d}" fill="url(#${g})" filter="url(#${wc})"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${P.light}" stroke-opacity="0.55" stroke-width="${margin}" clip-path="url(#${clip})"/>`);
    for (const f0 of veins) {
      const f = f0 + (rand() - 0.5) * 0.06;
      const op = r1(0.16 + rand() * 0.26);
      const w = r1(0.7 + rand() * 0.6);
      for (const v of set.along(s, f, 0.04 + rand() * 0.06, 0.9 + rand() * 0.07)) {
        out.push(`<path d="${v}" fill="none" stroke="${P.edge}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`);
      }
    }
    if (midrib) {
      for (const v of set.along(s, 0, 0.02, 0.985)) {
        out.push(`<path d="${v}" fill="none" stroke="${P.edge}" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round"/>`);
        out.push(`<path d="${v}" fill="none" stroke="${P.light}" stroke-opacity="0.6" stroke-width="1.2" stroke-linecap="round" transform="translate(-2.4 0)"/>`);
      }
    }
    if (sheen && !s.back && Math.abs(s.theta) < 1.2) {
      const [rx, ry, ts] = sheen;
      const [hx, hy] = organ.surface(s.theta - 0.35 * set.w0, ts);
      out.push(`<ellipse cx="${r1(hx)}" cy="${r1(hy)}" rx="${rx}" ry="${ry}" transform="rotate(14 ${r1(hx)} ${r1(hy)})" fill="#fbffe6" fill-opacity="0.3" filter="url(#sheen)" clip-path="url(#${clip})"/>`);
    }
    out.push(`<g filter="url(#${pen})"><path d="${d}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="1.6" stroke-linejoin="round" transform="translate(1.3 1.1)" clip-path="url(#${clip})"/></g>`);
  }
}

// The torn attachment plate every organ of this line was lifted from: the
// broad pale disc where it sat on its bearer's back.
export function attachmentPlate(organ, { rand, defs, out, id = "plate", flare = 1.03, depth = 13, scars = true }) {
  const [lo0, hi0] = organ.range(0);
  const top = [], bottom = [];
  for (let j = 0; j <= 24; j++) {
    const th = lo0 + ((hi0 - lo0) * j) / 24;
    top.push(organ.surface(th, 0));
    const [px, py] = organ.surface(th, 0);
    const torn = j === 0 || j === 24 ? 0 : (rand() - 0.5) * 7 + Math.sin(j * 1.7) * 2.5;
    bottom.push([organ.x + (px - organ.x) * flare, py + depth + torn]);
  }
  const d = smooth(top) + [...bottom].reverse().map(([px, py]) => ` L${r1(px)},${r1(py)}`).join("") + " Z";
  defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3ead0"/><stop offset="0.6" stop-color="#e2d4ab"/><stop offset="1" stop-color="#c8b582"/></linearGradient>`);
  out.push(`<path d="${d}" fill="url(#${id})"/>`);
  out.push(`<path d="${bottom.map(([px, py], i) => `${i ? "L" : "M"}${r1(px)},${r1(py)}`).join(" ")}" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round" filter="url(#pen)"/>`);
  if (scars) {
    for (let j = 3; j < 22; j += 2) {
      const [px, py] = bottom[j];
      out.push(`<ellipse cx="${r1(px)}" cy="${r1(py - 6 - rand() * 3)}" rx="${r1(1.6 + rand())}" ry="1.3" fill="#9c875a" fill-opacity="0.8"/>`);
    }
  }
  return { top, bottom };
}
