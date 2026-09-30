// NO. 0103 — the crown of the palm.
//
// What the morphology says, and what each observation became:
//
//   1. The part is the crown: the top of a coconut palm, cut from its trunk.
//      Long leaves spring up out of it and arch over, a fan of them, and at
//      their foot the nuts it carries, three, clustered tight, straw-yellow.
//      The field note names it — Cocos nucifera.
//   2. The leaves are drawn as long single blades, as a frond reads from any
//      distance with its leaflets folded up along the midrib. Pinnate fronds,
//      drawn out leaflet by leaflet, read as a fern.
//   3. No trunk, and no eyes on the nuts — the three pores at a coconut's end
//      make a face. Drawn first as a whole palm, trunk and all, it read as a
//      figure with three heads; drawn as a cut bunch lying under a frond, it
//      no longer read as this plant at all.
//   4. Fig. 2 is the note's point: the species is two populations, Pacific
//      and Indo-Atlantic, told apart genetically — and by the shape of the
//      nut. Two nuts, side by side: one long and three-angled, one round.
//      Which way the boundary runs, the note says, follows the routes people
//      sailed rather than the currents a drifting nut would ride.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "exeggutor";
export const no = 103;
const SIZE = 800;

const NUT = { light: "#fbf6d2", base: "#e2d9a2", deep: "#bfb274", shade: "#857a44", edge: "#80753f" };
const FROND = { light: "#a6d68a", base: "#5aa85a", deep: "#347a44", shade: "#22502e", edge: "#22502e" };

// A husked coconut: a smooth ovoid, broad at the stalk end and drawn to a
// blunt point at the other, lying along angle `ang` with the point that way.
function coconut(out, defs, id, cx, cy, a, b, ang) {
  const pts = [];
  for (let i = 0; i < 48; i++) {
    const t = (i / 48) * Math.PI * 2;
    const x = a * Math.cos(t), y = b * Math.sin(t) * (1 - 0.16 * Math.cos(t));
    pts.push([cx + x * Math.cos(ang) - y * Math.sin(ang), cy + x * Math.sin(ang) + y * Math.cos(ang)]);
  }
  const d = smooth(pts, true);
  defs.push(`<radialGradient id="${id}g" gradientUnits="userSpaceOnUse" cx="${r1(cx - a * 0.3)}" cy="${r1(cy - b * 0.45)}" r="${r1(a * 1.25)}"><stop offset="0" stop-color="${NUT.light}"/><stop offset="0.55" stop-color="${NUT.base}"/><stop offset="1" stop-color="${NUT.deep}"/></radialGradient>`);
  defs.push(`<clipPath id="${id}c"><path d="${d}"/></clipPath>`);
  out.push(`<path d="${d}" fill="${NUT.base}"/><path d="${d}" fill="url(#${id}g)" filter="url(#wc2)"/>`);
  // the ridge of the three-angled husk, running end to end a little off centre
  const ridge = [];
  for (let k = 0; k <= 10; k++) {
    const t = -1 + (2 * k) / 10, x = a * 0.92 * t, y = b * 0.28 * Math.sqrt(1 - t * t) - b * 0.1;
    ridge.push([cx + x * Math.cos(ang) - y * Math.sin(ang), cy + x * Math.sin(ang) + y * Math.cos(ang)]);
  }
  out.push(`<path d="${smooth(ridge)}" fill="none" stroke="${NUT.edge}" stroke-width="1.2" stroke-opacity="0.4" clip-path="url(#${id}c)"/>`);
  out.push(`<ellipse cx="${r1(cx - a * 0.28)}" cy="${r1(cy - b * 0.42)}" rx="${r1(a * 0.3)}" ry="${r1(b * 0.16)}" fill="#fffdf0" fill-opacity="0.5" filter="url(#sheen)" clip-path="url(#${id}c)"/>`);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
}

export function draw() {
  const rand = mulberry32(103);
  const defs = standardDefs(103);
  const out = [];
  contact(out, 330, 758, 230, 16);

  // the leaves: a fan of long blades from one point behind the nuts, the
  // outer ones arching over and down, drawn outside in
  const C = [322, 628];
  const LEAVES = [];
  for (let k = 0; k < 11; k++) {
    const a = -Math.PI / 2 + (k / 10 - 0.5) * 2.7 + (k % 2 ? 0.04 : -0.04);
    LEAVES.push({ a, k, out: Math.abs(k / 10 - 0.5) });
  }
  LEAVES.sort((p, q) => q.out - p.out).forEach(({ a, k, out: o }) => {
    const L = 340 - o * 90;
    const droop = 0.25 + o * 1.6;
    const pts = [];
    for (let j = 0; j <= 6; j++) {
      const u = j / 6;
      pts.push([C[0] + Math.cos(a) * L * u, C[1] + Math.sin(a) * L * u + droop * L * 0.6 * u ** 2.2]);
    }
    const lf = blade(pts, { width: (u) => 23 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.5), 0.7), sideVeins: 0, rand });
    paintBlade(lf, { id: `lv${k}`, palette: FROND, defs, out, shade: o > 0.3 ? 0.25 : 0, margin: 4, veinOpacity: 0.3 });
  });

  // the three nuts, clustered tight at the foot of the leaves, the back one
  // first, each with its point turned out from the middle
  const NUTS = [[394, 640, 62, 52, -0.35], [262, 676, 66, 54, Math.PI + 0.3], [336, 702, 70, 57, 1.25]];
  NUTS.forEach(([x, y, na, nb, ang], i) => coconut(out, defs, `n${i}`, x, y, na, nb, ang));

  // ── fig. 2: two nuts, two populations ─────────────────────────────────────
  const nutShape = (x, y, w, h, angular) => {
    const pts = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const k = angular ? 1 + 0.08 * Math.cos(3 * a) : 1;
      pts.push([x + Math.cos(a) * w * k, y + Math.sin(a) * h * k - (angular && Math.sin(a) < 0 ? 10 * Math.sin(a) * Math.sin(a) : 0)]);
    }
    return smooth(pts, true);
  };
  const long = nutShape(640, 700, 34, 60, true), round = nutShape(730, 712, 46, 48, false);
  for (const [d, id] of [[long, "nl"], [round, "nr"]]) {
    defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    out.push(`<path d="${d}" fill="${NUT.base}"/><path d="${d}" fill="${NUT.deep}" fill-opacity="0.35" filter="url(#wc2)"/>`);
    const fib = [];
    for (let k = 0; k < 16; k++) fib.push(`M${r1(560 + k * 14)},640 Q${r1(566 + k * 14)},700 ${r1(560 + k * 14)},770`);
    out.push(`<path d="${fib.join(" ")}" fill="none" stroke="${NUT.edge}" stroke-width="0.8" stroke-opacity="0.4" clip-path="url(#${id})"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  }
  contact(out, 686, 770, 90, 7, 0.22);

  return { size: SIZE, view: [0, 320, SIZE, 470], defs: defs.join("\n"), body: out.join("\n") };
}
