// NO. 0003 — the bloom, and what it cost.
//
// The same organ as NO. 0001 and 0002, at the end. What the morphology says,
// and what each observation became:
//
//   1. A single enormous flower: five broad, fleshy petals, salmon-pink, set
//      with raised white warts — the field note's Rafflesia, whose petals look
//      exactly like this. Seen from above and in front, rising from the centre
//      and drooping at their rims.
//   2. At its heart, a brown column clothed in diamond-set scales, the bases
//      of everything it has shed, crowned with a ring of yellow teeth.
//   3. Beneath the flower, a skirt of fronds, pinnate and drooping.
//   4. And under all of it, what paid for it. The field note's point: "the
//      bloom is not an addition to the plant. It is the corm, converted." So
//      the corm is still there, on the same torn attachment plate as NO. 0001
//      — shrunken, wrinkled, dull, spent. Fig. 2 cuts it open: almost no store
//      left, and around it, dashed, the outline of the corm it was.
//
// Across the three plates, fig. 2 is one organ's life: stored, waiting, spent.
import { mulberry32, r1, smooth, mix, watercolour, blur, handInk, INK } from "./lib.mjs";
import { makeOrgan, attachmentPlate } from "./organ.mjs";

export const slug = "venusaur";
export const no = 3;
const SIZE = 800;

// ── the view ─────────────────────────────────────────────────────────────────
// The flower lies in a plane seen from 35° above: X right, Y toward us, Z up.
const F = { x: 330, y: 404, elev: 0.62 };
const SE = Math.sin(F.elev), CE = Math.cos(F.elev);
const proj = ([X, Y, Z]) => [F.x + X, F.y + Y * SE - Z * CE];

// ── colour ───────────────────────────────────────────────────────────────────
const PETAL = { light: "#f3c6cb", base: "#dc7d85", deep: "#b3565f", shade: "#7e3538", edge: "#8c3f45" };
const BROWN = { light: "#c9a06c", base: "#9a7254", deep: "#6a4c33", shade: "#46301f", edge: "#3b2819" };
const CROWN = { light: "#fbe68a", base: "#eec64a", deep: "#c49a24" };
const FROND = { light: "#8ebc7c", base: "#4f8b56", deep: "#2f613b", shade: "#1d4128", edge: "#1b3a25" };
const SPENT = { light: "#cfc095", base: "#a39264", deep: "#716240", shade: "#4d4128", edge: "#4a3f27" };

// ── petals ───────────────────────────────────────────────────────────────────
const NP = 5, R0 = 36, RP = 256, WP = 124;
const ALPHA = Array.from({ length: NP }, (_, k) => -Math.PI / 2 + Math.PI / 5 + (k * 2 * Math.PI) / NP);
const petalWidth = (u) => WP * Math.pow(Math.sin(Math.PI * Math.pow(Math.max(0, Math.min(1, u)), 0.62)), 0.58);
function petalPoint(k, u, v) {
  const a = ALPHA[k];
  const r = R0 + u * (RP - R0);
  const half = petalWidth(u) * v * (1 + 0.035 * Math.sin(11 * u + k * 2));
  const X = Math.cos(a) * r - Math.sin(a) * half;
  const Y = Math.sin(a) * r + Math.cos(a) * half;
  // rises from the centre, droops at the rim, and rolls down at its edges
  const Z = 30 * u - 84 * u ** 2.2 - 20 * v * v * u;
  return [X, Y, Z];
}
function petalOutline(k) {
  const L = [], Rr = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    L.push(proj(petalPoint(k, u, -1)));
    Rr.push(proj(petalPoint(k, u, 1)));
  }
  return smooth(L) + smooth([...Rr].reverse(), false, { move: false }) + " Z";
}

// ── fronds ───────────────────────────────────────────────────────────────────
// A skirt of broad, palm-like fronds under the petals. None is aimed
// straight at us: foreshortened to nothing, a frond pointing at the viewer
// hangs down the stalk like a tassel.
const NF = 8, LF = 300;
const FROND_ANGLES = [-2.75, -2.1, -1.2, -0.45, 0.35, 0.95, 2.2, 2.85];
function frond(j, rand) {
  const a = FROND_ANGLES[j] + (rand() - 0.5) * 0.1;
  const bend = (rand() - 0.5) * 0.35;
  const at = (r) => {
    const aa = a + bend * (r / LF) ** 2;
    return [Math.cos(aa) * r, Math.sin(aa) * r, -20 - 118 * (r / LF) ** 2.3];
  };
  const rachis = [];
  for (let i = 0; i <= 24; i++) rachis.push(proj(at(28 + ((LF - 28) * i) / 24)));
  const pinnae = [];
  for (let i = 0; i < 24; i++) {
    const r = LF * (0.18 + 0.79 * (i / 23));
    const base = at(r);
    const ahead = at(Math.min(LF, r + 4));
    const dir = [ahead[0] - base[0], ahead[1] - base[1]];
    const dl = Math.hypot(...dir) || 1;
    const len = 78 * (1 - 0.6 * (r / LF) ** 1.5);
    for (const side of [-1, 1]) {
      const ang = side * 0.95;
      const dx = (dir[0] / dl) * Math.cos(ang) - (dir[1] / dl) * Math.sin(ang);
      const dy = (dir[0] / dl) * Math.sin(ang) + (dir[1] / dl) * Math.cos(ang);
      const tip = [base[0] + dx * len, base[1] + dy * len, base[2] - len * 0.42];
      const mid = [base[0] + dx * len * 0.5, base[1] + dy * len * 0.5, base[2] - len * 0.12];
      pinnae.push([proj(base), proj(mid), proj(tip)]);
    }
  }
  return { a, depth: Math.sin(a), rachis, pinnae };
}
function pinnaPath([b, m, t]) {
  const dx = t[0] - b[0], dy = t[1] - b[1], l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l, ny = dx / l, w = 5.8;
  return `M${r1(b[0] + nx * 1.4)},${r1(b[1] + ny * 1.4)} Q${r1(m[0] + nx * w * 1.25)},${r1(m[1] + ny * w * 1.25)} ${r1(t[0])},${r1(t[1])} ` +
    `Q${r1(m[0] - nx * w * 1.25)},${r1(m[1] - ny * w * 1.25)} ${r1(b[0] - nx * 1.4)},${r1(b[1] - ny * 1.4)} Z`;
}
function paintFrond(fr, id, defs, out) {
  const shade = Math.max(0, -fr.depth) * 0.5;
  defs.push(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r1(fr.rachis[0][0])}" y1="${r1(fr.rachis[0][1])}" x2="${r1(fr.rachis.at(-1)[0])}" y2="${r1(fr.rachis.at(-1)[1])}">` +
      `<stop offset="0" stop-color="${mix(FROND.deep, FROND.shade, 0.3 + shade)}"/><stop offset="1" stop-color="${mix(FROND.light, FROND.base, 0.3 + shade)}"/></linearGradient>`,
  );
  const leaves = fr.pinnae.map(pinnaPath).join(" ");
  out.push(`<path d="${leaves}" fill="${mix(FROND.base, FROND.deep, 0.2 + shade)}"/>`);
  out.push(`<path d="${leaves}" fill="url(#${id})" filter="url(#wc)"/>`);
  out.push(`<g filter="url(#pen)"><path d="${leaves}" fill="none" stroke="${INK}" stroke-width="1" stroke-opacity="0.85"/>` +
    `<path d="${smooth(fr.rachis)}" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<path d="${smooth(fr.rachis)}" fill="none" stroke="${FROND.light}" stroke-width="0.9" stroke-opacity="0.7" transform="translate(-0.8 -0.6)"/></g>`);
}

// ── the column ───────────────────────────────────────────────────────────────
const HC = 122;
const colR = (z) => 52 + 6 * Math.sin((Math.PI * z) / HC) - 4 * (z / HC);
const colPoint = (b, z, grow = 1) => [Math.cos(b) * colR(z) * grow, Math.sin(b) * colR(z) * grow, z];

function column(defs, out) {
  // body: the front half, a brown barrel shaded to the right
  const left = [], right = [];
  for (let i = 0; i <= 30; i++) {
    const z = (HC * i) / 30;
    left.push(proj(colPoint(Math.PI, z)));
    right.push(proj(colPoint(0, z)));
  }
  const front = [];
  for (let i = 0; i <= 30; i++) front.push(proj(colPoint(Math.PI - (Math.PI * i) / 30, 0)));
  const topBack = [];
  for (let i = 0; i <= 30; i++) topBack.push(proj(colPoint((Math.PI * i) / 30 - Math.PI, HC)));
  const body = smooth(left) + smooth([...right].reverse(), false, { move: false }) + smooth(front, false, { move: false }) + " Z";
  defs.push(
    `<linearGradient id="colg" gradientUnits="userSpaceOnUse" x1="${F.x - 60}" y1="0" x2="${F.x + 60}" y2="0">` +
      `<stop offset="0" stop-color="${BROWN.base}"/><stop offset="0.35" stop-color="${BROWN.light}"/><stop offset="1" stop-color="${BROWN.shade}"/></linearGradient>`,
  );
  defs.push(`<clipPath id="colclip"><path d="${body}"/></clipPath>`);
  out.push(`<path d="${body}" fill="${BROWN.base}"/>`);
  out.push(`<path d="${body}" fill="url(#colg)" filter="url(#wc)"/>`);
  // diamond-set scales: two families of helices crossing, and in each diamond
  // the chevron scar of whatever grew there once
  const helix = (b0, sgn) => {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const z = (HC * i) / 24;
      const b = b0 + sgn * (z / HC) * 1.6;
      pts.push(proj(colPoint(b, z)));
    }
    return smooth(pts);
  };
  const lines = [];
  for (let k = 0; k < 18; k++) {
    const b0 = -Math.PI + (k * 2 * Math.PI) / 9;
    lines.push(helix(b0, 1), helix(b0, -1));
  }
  out.push(`<g clip-path="url(#colclip)" fill="none" stroke="${BROWN.edge}" stroke-width="1.3" stroke-opacity="0.7">${lines.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  const scars = [];
  for (let row = 0; row < 5; row++) {
    for (let k = 0; k < 9; k++) {
      const z = HC * (0.1 + row * 0.2);
      const b = -Math.PI + ((k + 0.5 + (row % 2) * 0.5) * 2 * Math.PI) / 9;
      if (Math.sin(b) < 0.15) continue;
      const [cx, cy] = proj(colPoint(b, z, 1.01));
      const w = 7 * Math.sin(b);
      scars.push(`M${r1(cx - w)},${r1(cy - 2)} L${r1(cx)},${r1(cy + 3)} L${r1(cx + w)},${r1(cy - 2)}`);
    }
  }
  out.push(`<path d="${scars.join(" ")}" clip-path="url(#colclip)" fill="none" stroke="${BROWN.light}" stroke-width="1.4" stroke-opacity="0.8" stroke-linecap="round"/>`);
  out.push(`<g filter="url(#pen)"><path d="${body}" fill="none" stroke="${INK}" stroke-width="2"/></g>`);

  // the crown: a ring of yellow teeth round the rim, the far ones first
  const tooth = (b) => {
    const h = 0.2;
    const a = proj(colPoint(b - h, HC)), c = proj(colPoint(b + h, HC));
    const tip = proj([Math.cos(b) * colR(HC) * 1.28, Math.sin(b) * colR(HC) * 1.28, HC + 24]);
    return `M${r1(a[0])},${r1(a[1])} L${r1(tip[0])},${r1(tip[1])} L${r1(c[0])},${r1(c[1])} Z`;
  };
  const teeth = Array.from({ length: 14 }, (_, k) => -Math.PI + (k * 2 * Math.PI) / 14 + 0.1);
  const far = teeth.filter((b) => Math.sin(b) < 0), near = teeth.filter((b) => Math.sin(b) >= 0);
  defs.push(`<linearGradient id="crg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CROWN.light}"/><stop offset="1" stop-color="${CROWN.deep}"/></linearGradient>`);
  const paintTeeth = (list) => {
    const d = list.map(tooth).join(" ");
    out.push(`<path d="${d}" fill="url(#crg)"/><path d="${d}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round" filter="url(#pen)"/>`);
  };
  paintTeeth(far);
  // the top: a rim, and a dark opening sunk in it
  const disc = [], hole = [];
  for (let i = 0; i < 48; i++) {
    const b = (i / 48) * Math.PI * 2;
    disc.push(proj(colPoint(b, HC)));
    hole.push(proj(colPoint(b, HC - 6, 0.55)));
  }
  out.push(`<path d="${smooth(disc, true)}" fill="${BROWN.light}"/>`);
  out.push(`<path d="${smooth(hole, true)}" fill="#3a2a1e"/>`);
  out.push(`<path d="${smooth(hole, true)}" fill="none" stroke="${CROWN.deep}" stroke-width="2.2" stroke-opacity="0.8"/>`);
  out.push(`<path d="${smooth(disc, true)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  paintTeeth(near);
  void topBack;
}

export function draw() {
  const rand = mulberry32(3);
  const defs = [
    watercolour("wc", 13, { warp: 6 }),
    watercolour("wc2", 25, { warp: 4, grain: 0.4 }),
    blur("soft", 3.2), blur("wide", 11), blur("sheen", 9),
    handInk("pen", 7),
  ];
  const out = [];

  out.push(`<ellipse cx="${F.x}" cy="768" rx="210" ry="20" fill="#1c140c" fill-opacity="0.24" filter="url(#wide)"/>`);

  const fronds = Array.from({ length: NF }, (_, j) => frond(j, rand)).sort((p, q) => p.depth - q.depth);
  const back = fronds.filter((f) => f.depth < -0.2), fore = fronds.filter((f) => f.depth >= -0.2);
  back.forEach((f, i) => paintFrond(f, `fb${i}`, defs, out));

  // the stalk, from under the flower down to the corm that fed it
  defs.push(`<linearGradient id="stalk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f8e52"/><stop offset="0.4" stop-color="#9fb878"/><stop offset="1" stop-color="#4c6a3a"/></linearGradient>`);
  out.push(`<path d="M${F.x - 22},470 C${F.x - 24},560 ${F.x - 28},640 ${F.x - 32},700 L${F.x + 32},700 C${F.x + 28},640 ${F.x + 24},560 ${F.x + 22},470 Z" fill="url(#stalk)" stroke="${INK}" stroke-width="1.6"/>`);

  // the spent corm, on the plate it was lifted from
  const corm = spentCorm(defs, out, rand);
  void corm;

  fore.forEach((f, i) => paintFrond(f, `ff${i}`, defs, out));

  // petals, back to front, with the column between
  const order = ALPHA.map((a, k) => ({ k, y: Math.sin(a) })).sort((p, q) => p.y - q.y);
  // Each petal's shadow is clipped to the petals already laid beneath it: on
  // a transparent ground an unclipped shadow is a dark halo, not a shadow.
  const laid = [];
  const paintPetal = ({ k }) => {
    const d = petalOutline(k);
    const [c0x, c0y] = proj(petalPoint(k, 0, 0)), [c1x, c1y] = proj(petalPoint(k, 1, 0));
    const shade = Math.max(0, 0.35 - 0.35 * Math.cos(ALPHA[k] + 2.2));
    defs.push(
      `<linearGradient id="pg${k}" gradientUnits="userSpaceOnUse" x1="${r1(c0x)}" y1="${r1(c0y)}" x2="${r1(c1x)}" y2="${r1(c1y)}">` +
        `<stop offset="0" stop-color="${mix(PETAL.deep, PETAL.shade, 0.3 + shade)}"/><stop offset="0.4" stop-color="${mix(PETAL.base, PETAL.deep, shade)}"/>` +
        `<stop offset="1" stop-color="${mix(PETAL.light, PETAL.base, 0.25 + shade)}"/></linearGradient>`,
    );
    defs.push(`<clipPath id="pc${k}"><path d="${d}"/></clipPath>`);
    if (laid.length) {
      defs.push(`<clipPath id="under${k}">${laid.map((q) => `<path d="${q}"/>`).join("")}</clipPath>`);
      out.push(`<path d="${d}" fill="none" stroke="#2c0e10" stroke-opacity="0.45" stroke-width="12" filter="url(#soft)" clip-path="url(#under${k})"/>`);
    }
    laid.push(d);
    out.push(`<path d="${d}" fill="${mix(mix(PETAL.base, PETAL.light, 0.35), PETAL.deep, shade * 0.6)}"/>`);
    out.push(`<path d="${d}" fill="url(#pg${k})" filter="url(#wc)"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${PETAL.light}" stroke-opacity="0.55" stroke-width="8" clip-path="url(#pc${k})"/>`);
    // radial veins
    const veins = [];
    for (const v of [-0.7, -0.45, -0.2, 0.05, 0.3, 0.55, 0.78]) {
      const pts = [];
      for (let i = 1; i <= 16; i++) pts.push(proj(petalPoint(k, 0.08 + 0.86 * (i / 16), v + (rand() - 0.5) * 0.04)));
      veins.push(smooth(pts));
    }
    out.push(`<g clip-path="url(#pc${k})" fill="none" stroke="${PETAL.edge}" stroke-opacity="0.22" stroke-width="1">${veins.map((d2) => `<path d="${d2}"/>`).join("")}</g>`);
    // the warts: raised, white, irregular — Rafflesia's
    const spots = [];
    for (let s = 0; s < 16; s++) {
      const u = 0.22 + rand() * 0.7, v = (rand() * 2 - 1) * 0.72;
      const rho = 4 + rand() * 9 * (0.5 + u);
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const ph = (i / 10) * Math.PI * 2;
        const wob = 1 + (rand() - 0.5) * 0.35;
        const du = (rho * wob * Math.cos(ph)) / (RP - R0), dv = (rho * wob * Math.sin(ph)) / Math.max(20, petalWidth(u));
        pts.push(proj(petalPoint(k, u + du, v + dv)));
      }
      spots.push(smooth(pts, true));
    }
    out.push(`<g clip-path="url(#pc${k})">` +
      spots.map((d2) => `<path d="${d2}" fill="#e7cac6" transform="translate(1.4 1.6)"/><path d="${d2}" fill="#fbf3ee"/>`).join("") + `</g>`);
    out.push(`<g filter="url(#pen)"><path d="${d}" fill="none" stroke="${INK}" stroke-width="1.9" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="1.6" transform="translate(1.3 1.1)" clip-path="url(#pc${k})"/></g>`);
  };
  order.filter((p) => p.y < 0).forEach(paintPetal);
  column(defs, out);
  order.filter((p) => p.y >= 0).forEach(paintPetal);

  out.push(...section(defs, rand));
  return { size: SIZE, view: [0, 196, SIZE, 602], defs: defs.join("\n"), body: out.join("\n") };
}

// ── the spent corm ───────────────────────────────────────────────────────────
const CORM = makeOrgan({
  x: F.x, base: 748, H: 84, R: 118, tilt: 0.3,
  knots: [[0, 0.8], [0.22, 0.98], [0.45, 1], [0.68, 0.84], [0.86, 0.5], [1, 0]],
});
// The outline of a convex solid is the convex hull of its projection. The
// organ model's own silhouette walks round from the front to where the
// surface turns away — which, seen from above, a squat dome never does: its
// whole top ring faces us, the walk runs on round the back, and the outline
// crossed itself into a twisted ribbon.
function hullOutline(org) {
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    for (let j = 0; j < 48; j++) pts.push(org.surface(-Math.PI + (j / 48) * Math.PI * 2, i / 30));
  }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const q of pts) { while (lower.length > 1 && turn(lower.at(-2), lower.at(-1), q) <= 0) lower.pop(); lower.push(q); }
  for (const q of [...pts].reverse()) { while (upper.length > 1 && turn(upper.at(-2), upper.at(-1), q) <= 0) upper.pop(); upper.push(q); }
  return smooth([...lower.slice(0, -1), ...upper.slice(0, -1)], true);
}

function spentCorm(defs, out, rand) {
  attachmentPlate(CORM, { rand, defs, out, id: "cplate", flare: 1.05, depth: 11 });
  const sil = hullOutline(CORM);
  defs.push(
    `<linearGradient id="spent" gradientUnits="userSpaceOnUse" x1="${F.x - 110}" y1="660" x2="${F.x + 120}" y2="760">` +
      `<stop offset="0" stop-color="${SPENT.light}"/><stop offset="0.5" stop-color="${SPENT.base}"/><stop offset="1" stop-color="${SPENT.shade}"/></linearGradient>`,
  );
  defs.push(`<clipPath id="cormclip"><path d="${sil}"/></clipPath>`);
  out.push(`<path d="${sil}" fill="${SPENT.base}"/>`);
  out.push(`<path d="${sil}" fill="url(#spent)" filter="url(#wc)"/>`);
  // wrinkles: the skin of a store that has been emptied
  const wr = [];
  for (let i = 0; i < 26; i++) {
    const th = -1.5 + (i / 25) * 3 + (rand() - 0.5) * 0.08;
    const pts = [];
    for (let j = 0; j <= 10; j++) {
      const t = 0.04 + 0.9 * (j / 10);
      pts.push(CORM.surface(th + 0.08 * Math.sin(j * 1.9 + i), t));
    }
    wr.push(smooth(pts));
  }
  out.push(`<g clip-path="url(#cormclip)" fill="none" stroke="${SPENT.edge}" stroke-opacity="0.45" stroke-width="1">${wr.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  // papery remnants of the old scales, withered at the foot
  for (let i = 0; i < 5; i++) {
    const th = -1.0 + i * 0.5 + (rand() - 0.5) * 0.1;
    const [ax, ay] = CORM.surface(th - 0.16, 0.02), [bx, by] = CORM.surface(th + 0.16, 0.02);
    const [tx, ty] = CORM.surface(th + 0.05, 0.2 + rand() * 0.1);
    out.push(`<path d="M${r1(ax)},${r1(ay)} Q${r1((ax + tx) / 2 - 3)},${r1((ay + ty) / 2)} ${r1(tx)},${r1(ty)} Q${r1((bx + tx) / 2 + 3)},${r1((by + ty) / 2)} ${r1(bx)},${r1(by)} Z" fill="#dcc99a" fill-opacity="0.85" stroke="${INK}" stroke-width="0.8" stroke-opacity="0.7"/>`);
  }
  out.push(`<g filter="url(#pen)"><path d="${sil}" fill="none" stroke="${INK}" stroke-width="2.2"/></g>`);
  return sil;
}

// ── fig. 2: the spent corm, cut, with the outline of what it was ─────────────
function section(defs, rand) {
  const S = { x: 690, base: 770 };
  const out = [];
  // NO. 0001's corm in section, at this plate's scale: what this one was
  const ghost = makeOrgan({
    x: S.x, base: S.base, H: 500 * 0.3, R: 268 * 0.3, tilt: 0, bendFrom: 0.46, bendMax: 1.5,
    knots: [[0, 0.62], [0.06, 0.84], [0.18, 0.98], [0.3, 1], [0.44, 0.9], [0.58, 0.66], [0.7, 0.44], [0.82, 0.24], [0.92, 0.1], [1, 0]],
  });
  const profile = (org, R, H, inset = 0, tMax = 1) => {
    const right = [], left = [];
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * tMax;
      const w = R * org.shape(t) - inset;
      if (w <= 0) break;
      const [ax, ay, phi] = org.spineAt(t);
      const cx = S.x + ax, cy = S.base - ay - inset * 0.8;
      right.push([cx + w * Math.cos(phi), cy + w * Math.sin(phi)]);
      left.push([cx - w * Math.cos(phi), cy - w * Math.sin(phi)]);
    }
    return smooth(right) + smooth([...left].reverse(), false, { move: false }) + " Z";
  };
  const was = profile(ghost, 268 * 0.3, 150);

  // the corm now: squat, shrunk, its outline puckered
  const now = [];
  for (let i = 0; i <= 64; i++) {
    const a = Math.PI + (i / 64) * Math.PI;
    const pucker = 1 + 0.035 * Math.sin(i * 0.62 + 1) + 0.015 * Math.sin(i * 1.7);
    now.push([S.x + Math.cos(a) * 58 * pucker, S.base - 4 + Math.sin(a) * 40 * pucker]);
  }
  const nowD = smooth(now) + ` L${S.x + 50},${S.base} L${S.x - 50},${S.base} Z`;

  out.push(`<ellipse cx="${S.x}" cy="${S.base + 8}" rx="84" ry="9" fill="#1c140c" fill-opacity="0.28" filter="url(#wide)"/>`);
  // what it was, dashed
  out.push(`<path d="${was}" fill="none" stroke="${INK}" stroke-width="1.3" stroke-dasharray="5 4" stroke-opacity="0.55"/>`);
  // the stalk rising out of it, cut, its bundles in a ring on the cut face
  out.push(`<path d="M${S.x - 12},${S.base - 40} L${S.x - 11},${S.base - 92} L${S.x + 11},${S.base - 92} L${S.x + 12},${S.base - 40} Z" fill="#a8bd84" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<ellipse cx="${S.x}" cy="${S.base - 92}" rx="11" ry="4" fill="#dfe8c6" stroke="${INK}" stroke-width="1"/>`);
  for (let k = 0; k < 8; k++) out.push(`<circle cx="${r1(S.x + 7 * Math.cos((k / 8) * Math.PI * 2))}" cy="${r1(S.base - 92 + 2.4 * Math.sin((k / 8) * Math.PI * 2))}" r="0.9" fill="#6f8c4d"/>`);
  // the cut face: pale, cavitied, with barely a grain of store left
  defs.push(`<linearGradient id="spentcore" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#efe6cc"/><stop offset="1" stop-color="#d9caa2"/></linearGradient>`);
  out.push(`<path d="${nowD}" fill="${SPENT.base}"/>`);
  out.push(`<g transform="translate(${S.x} ${S.base}) scale(0.9 0.86) translate(${-S.x} ${-S.base})"><path d="${nowD}" fill="url(#spentcore)" filter="url(#wc2)"/></g>`);
  defs.push(`<clipPath id="nowclip"><path d="${nowD}"/></clipPath>`);
  const dots = [];
  for (let i = 0; dots.length < 38 && i < 800; i++) {
    const x = S.x - 50 + rand() * 100, y = S.base - 4 - rand() * 36;
    dots.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(0.5 + rand() * 0.6)}"/>`);
  }
  out.push(`<g clip-path="url(#nowclip)" fill="#7d6c44" fill-opacity="0.6">${dots.join("")}</g>`);
  // cavities where the store was drawn out
  for (const [cx, cy, rx, ry] of [[S.x - 26, S.base - 18, 9, 5], [S.x + 22, S.base - 22, 7, 4], [S.x - 4, S.base - 12, 6, 3.5]]) {
    out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#b9a67a" stroke="${INK}" stroke-width="0.7" stroke-opacity="0.6"/>`);
  }
  // the bundles that carried it all up into the flower
  for (const dx of [-30, -14, 0, 14, 30]) {
    out.push(`<path d="M${S.x + dx},${S.base - 4} C${S.x + dx * 0.8},${S.base - 20} ${S.x + dx * 0.3},${S.base - 32} ${S.x + dx * 0.25},${S.base - 44}" fill="none" stroke="#7e9a5a" stroke-width="1.2" stroke-opacity="0.8"/>`);
  }
  out.push(`<g filter="url(#pen)"><path d="${nowD}" fill="none" stroke="${INK}" stroke-width="2.3" stroke-linejoin="round"/></g>`);
  return out;
}
