// The kit most plates draw from, beyond the organ model and leaf blades:
// the standard filters, smooth-bodied organs (tubers, bells, seeds, nuts,
// caps), rims and mouths, marks mapped onto curved surfaces, roots, and
// contact shadows.
import { r1, smooth, mix, watercolour, blur, handInk, INK } from "./lib.mjs";

// The filter set every plate uses, seeded so each plate's grain is its own.
export function standardDefs(seed) {
  return [
    watercolour("wc", seed + 10, { warp: 6 }),
    watercolour("wc2", seed + 22, { warp: 4, grain: 0.4 }),
    blur("soft", 3.2), blur("wide", 11), blur("sheen", 9),
    handInk("pen", seed + 4),
  ];
}

export const contact = (out, x, y, rx, ry = 20, op = 0.24) =>
  out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="#1c140c" fill-opacity="${op}" filter="url(#wide)"/>`);

// The outline of a convex solid is the convex hull of its projection. The
// organ model's own silhouette walks round from the front until the surface
// turns away, which a squat or open shape seen from above never does — so
// anything that is not a tall closed point is outlined this way instead.
export function hull(org, { t0 = 0, t1 = 1, grow = 1 } = {}) {
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    for (let j = 0; j < 48; j++) pts.push(org.surface(-Math.PI + (j / 48) * Math.PI * 2, t0 + ((t1 - t0) * i) / 30, grow));
  }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const q of pts) { while (lower.length > 1 && turn(lower.at(-2), lower.at(-1), q) <= 0) lower.pop(); lower.push(q); }
  for (const q of [...pts].reverse()) { while (upper.length > 1 && turn(upper.at(-2), upper.at(-1), q) <= 0) upper.pop(); upper.push(q); }
  return smooth([...lower.slice(0, -1), ...upper.slice(0, -1)], true);
}

// A ring round the organ at height t — a rim, a band, a mouth.
export function ring(org, t, grow = 1, n = 48) {
  const pts = [];
  for (let j = 0; j < n; j++) pts.push(org.surface(-Math.PI + (j / n) * Math.PI * 2, t, grow));
  return smooth(pts, true);
}
// the near half of that ring only, for a band seen from the front
export function frontArc(org, t, grow = 1, span = Math.PI / 2) {
  const pts = [];
  for (let j = 0; j <= 32; j++) pts.push(org.surface(-span + (j / 32) * span * 2, t, grow));
  return smooth(pts);
}

// A smooth organ, painted: a paler solid, a watercolour wash lit from the
// upper left, a sheen, contour hatching down the shadowed side, and a pen
// outline with its shadow line.
export function paintSolid(org, { id, outline, palette: P, defs, out, sheen = true, hatch = 6, ink = 2.2, tHatch = [0.12, 0.78], light = [-0.6, -0.9, 0.7, 1] }) {
  const d = outline || hull(org);
  const [bx0, by0] = org.surface(0, 0), [bx1, by1] = org.surface(0, 1);
  const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2;
  const span = Math.max(40, Math.hypot(bx1 - bx0, by1 - by0), org.R * 2);
  const [lx0, ly0, lx1, ly1] = light;
  defs.push(
    `<linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="${r1(cx + lx0 * span * 0.5)}" y1="${r1(cy + ly0 * span * 0.5)}" x2="${r1(cx + lx1 * span * 0.5)}" y2="${r1(cy + ly1 * span * 0.5)}">` +
      `<stop offset="0" stop-color="${P.light}"/><stop offset="0.5" stop-color="${P.base}"/><stop offset="1" stop-color="${mix(P.deep, P.shade, 0.35)}"/></linearGradient>`,
  );
  defs.push(`<clipPath id="${id}c"><path d="${d}"/></clipPath>`);
  out.push(`<path d="${d}" fill="${mix(P.base, P.light, 0.35)}"/>`);
  out.push(`<path d="${d}" fill="url(#${id}g)" filter="url(#wc)"/>`);
  if (sheen) {
    const [hx, hy] = org.surface(-0.55, 0.62);
    out.push(`<ellipse cx="${r1(hx)}" cy="${r1(hy)}" rx="${r1(org.R * 0.22)}" ry="${r1(org.R * 0.4)}" transform="rotate(20 ${r1(hx)} ${r1(hy)})" fill="#fffdf0" fill-opacity="0.34" filter="url(#sheen)" clip-path="url(#${id}c)"/>`);
  }
  for (let k = 0; k < hatch; k++) {
    const pts = [];
    const [ta, tb] = tHatch;
    for (let j = 0; j <= 12; j++) {
      const t = ta + k * 0.02 + (tb - ta - k * 0.06) * (j / 12);
      pts.push(org.surface(Math.min(org.range(t)[1], 1.5) - 0.06 - k * 0.09, t));
    }
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${INK}" stroke-opacity="${r1(0.3 - k * 0.04)}" stroke-width="1" stroke-linecap="round" clip-path="url(#${id}c)"/>`);
  }
  out.push(`<g filter="url(#pen)"><path d="${d}" fill="none" stroke="${INK}" stroke-width="${ink}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="${ink * 0.85}" transform="translate(1.3 1.1)" clip-path="url(#${id}c)"/></g>`);
  return d;
}

// Marks mapped onto a curved surface — spots, warts, freckles — kept to the
// side that faces us, and foreshortened as they turn away.
export function spotsOn(org, { rand, count, t = [0.2, 0.9], theta = [-1.2, 1.2], size = [4, 10], grow = 1.004 }) {
  const out = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 30) {
    const tt = t[0] + rand() * (t[1] - t[0]);
    const th = theta[0] + rand() * (theta[1] - theta[0]);
    const [lo, hi] = org.range(tt);
    if (th < lo + 0.15 || th > hi - 0.15) continue;
    const rho = size[0] + rand() * (size[1] - size[0]);
    const r = Math.max(8, org.R * org.shape(tt));
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const ph = (i / 10) * Math.PI * 2;
      const wob = 1 + (rand() - 0.5) * 0.3;
      pts.push(org.surface(th + (rho * wob * Math.cos(ph)) / r, tt + (rho * wob * Math.sin(ph)) / org.H, grow));
    }
    out.push(smooth(pts, true));
  }
  return out;
}

// Roots: tapering, wandering, branching once or twice. Returned as paths to
// be drawn twice — a pale body, then the ink.
export function roots(x, y, { rand, n = 6, len = 90, spread = 1.1, droop = 1, forks = 2, dir = Math.PI / 2 }) {
  const paths = [];
  for (let i = 0; i < n; i++) {
    const a0 = dir + (i / Math.max(1, n - 1) - 0.5) * spread + (rand() - 0.5) * 0.2;
    const L = len * (0.6 + rand() * 0.5);
    const pts = [[x + (i - (n - 1) / 2) * 3, y]];
    let a = a0;
    for (let s = 1; s <= 8; s++) {
      a += (rand() - 0.5) * 0.45 + (Math.PI / 2 - a) * 0.12 * droop;
      const [px, py] = pts.at(-1);
      pts.push([px + Math.cos(a) * (L / 8), py + Math.sin(a) * (L / 8)]);
      if (s > 2 && s < 7 && forks && rand() < 0.28) {
        const b = a + (rand() < 0.5 ? -1 : 1) * (0.5 + rand() * 0.4);
        const q = [[px, py]];
        for (let k = 1; k <= 3; k++) q.push([q.at(-1)[0] + Math.cos(b + (rand() - 0.5) * 0.4) * (L / 14), q.at(-1)[1] + Math.sin(b + (rand() - 0.5) * 0.4) * (L / 14)]);
        paths.push({ d: smooth(q), w: 0.9 });
      }
    }
    paths.push({ d: smooth(pts), w: 1.5 });
  }
  return paths;
}
export function paintRoots(list, out, { body = "#e8dcc0", ink = 1 } = {}) {
  out.push(list.map(({ d, w }) => `<path d="${d}" fill="none" stroke="${body}" stroke-width="${r1(w * 2.6)}" stroke-linecap="round"/>`).join(""));
  out.push(`<g filter="url(#pen)">${list.map(({ d, w }) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${r1(w * ink)}" stroke-linecap="round"/>`).join("")}</g>`);
}

// The underside of a cap seen from a little below: the whole ellipse inside
// the rim is gills, radiating to the stalk. Filling only its near half left
// the far half showing as cap skin — a pink band that read as a second rim.
export function capUnderside(cap, out, { fill = "#f0d8cc", gill = "#b58a7c", n = 72, hub = 0.16 } = {}) {
  const rim = [];
  for (let j = 0; j < 64; j++) rim.push(cap.surface(-Math.PI + (j / 64) * Math.PI * 2, 0, 0.985));
  const d = smooth(rim, true);
  const lines = [];
  for (let j = 0; j < n; j++) {
    const th = -Math.PI + (j / n) * Math.PI * 2;
    const [ax, ay] = cap.surface(th, 0, 0.975), [bx, by] = cap.surface(th, 0, hub);
    lines.push(`M${r1(ax)},${r1(ay)} L${r1(bx)},${r1(by)}`);
  }
  out.push(`<path d="${d}" fill="${fill}"/><path d="${lines.join(" ")}" stroke="${gill}" stroke-width="1" stroke-opacity="0.75"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  return { d, hub: cap.surface(0, 0, 0) };
}

// The outline of a waisted or open-mouthed organ seen from above: the true
// left and right profile up its height, closed by the far arc of the rim at
// the top and the near arc of the base below. A convex hull cannot do this —
// it fills in every concavity by definition, so it drew a pinched pitcher as
// a straight-sided can.
export function profileOutline(org, { t0 = 0, t1 = 1, n = 60, grow = 1 } = {}) {
  const extreme = (t) => {
    let L = null, R = null;
    for (let j = 0; j < 96; j++) {
      const th = -Math.PI + (j / 96) * Math.PI * 2, p = org.surface(th, t, grow);
      if (!L || p[0] < L.p[0]) L = { p, th };
      if (!R || p[0] > R.p[0]) R = { p, th };
    }
    return { L, R };
  };
  const left = [], right = [];
  for (let i = 0; i <= n; i++) {
    const { L, R } = extreme(t0 + ((t1 - t0) * i) / n);
    left.push(L.p);
    right.push(R.p);
  }
  const top = extreme(t1), bot = extreme(t0);
  const arc = (t, a, b, through) => {
    const pts = [];
    let d = b - a;
    if (through === "back" && Math.abs(a + d / 2) < Math.PI / 2) d = d > 0 ? d - Math.PI * 2 : d + Math.PI * 2;
    if (through === "front" && Math.abs(a + d / 2) > Math.PI / 2) d = d > 0 ? d - Math.PI * 2 : d + Math.PI * 2;
    for (let j = 1; j < 24; j++) pts.push(org.surface(a + (d * j) / 24, t, grow));
    return pts;
  };
  const pts = [
    ...left,
    ...arc(t1, top.L.th, top.R.th, "back"),
    ...[...right].reverse(),
    ...arc(t0, bot.R.th, bot.L.th, "front"),
  ];
  return smooth(pts, true);
}
