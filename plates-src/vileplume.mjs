// NO. 0045 — the platter, and what its pollen is not.
//
// What the morphology says, and what each observation became:
//
//   1. The same indigo tuber as NO. 0043 and 0044, now carrying one enormous
//      flower, borne flat: five petals so broad they meet and overlap into a
//      scalloped platter, crimson-pink, set with many small pale spots.
//   2. At its heart, no column (that was NO. 0003's): a raised rim round a
//      sunken dark well, the opening Rafflesia's flowers have at the centre.
//   3. Fig. 2 is the field note's argument. A flower with an audience makes
//      heavy, sticky, ornamented pollen, clumped in its oil and meant to be
//      carried, not blown — so it is the wrong shape to make anyone ill.
//      Allergy comes from the plants that do not advertise: wind-pollinated
//      grasses and trees, whose grains are small, dry and smooth. Three of
//      this flower's grains, clumped; beside them, one grain of grass pollen
//      at the same magnification.
import { mulberry32, r1, smooth, mix, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "vileplume";
export const no = 45;
const SIZE = 800;

const INDIGO = { light: "#a9c0d6", base: "#5b7ea2", deep: "#3c5b82", shade: "#23385a", edge: "#1f3450" };
const PETAL = { light: "#f2b3bd", base: "#dc7f8c", deep: "#b85565", shade: "#7e3342", edge: "#8e3c4c" };

const F = { x: 322, y: 452, elev: 0.74 };
const SE = Math.sin(F.elev), CE = Math.cos(F.elev);
const proj = ([X, Y, Z]) => [F.x + X, F.y + Y * SE - Z * CE];
const NP = 5, R0 = 24, RP = 292, WP = 158;
const ALPHA = Array.from({ length: NP }, (_, k) => -Math.PI / 2 + (k * 2 * Math.PI) / NP + 0.1);
const width = (u) => WP * Math.pow(Math.sin(Math.PI * Math.pow(Math.max(0, Math.min(1, u)), 0.55)), 0.5);
function petalPoint(k, u, v) {
  const a = ALPHA[k], r = R0 + u * (RP - R0);
  const half = width(u) * v * (1 + 0.03 * Math.sin(9 * u + k));
  // borne flat, the rim drooping only a little
  const Z = 14 * u - 44 * u ** 2.6 - 10 * v * v * u;
  return [Math.cos(a) * r - Math.sin(a) * half, Math.sin(a) * r + Math.cos(a) * half, Z];
}

export function draw() {
  const rand = mulberry32(45);
  const defs = standardDefs(45);
  const out = [];

  // the tuber, small under so much flower
  const T = makeOrgan({
    x: 322, base: 742, H: 170, R: 104, tilt: 0.2,
    knots: [[0, 0.34], [0.08, 0.7], [0.22, 0.93], [0.42, 1], [0.62, 0.93], [0.8, 0.68], [0.92, 0.36], [1, 0]],
  });
  contact(out, 322, 770, 150, 16);
  paintSolid(T, { id: "t", outline: hull(T), palette: INDIGO, defs, out, hatch: 5 });
  // the stalk carrying the flower up off it
  out.push(`<path d="M${F.x - 16},${F.y + 20} L${F.x - 18},600 L${F.x + 18},600 L${F.x + 16},${F.y + 20} Z" fill="#6f8f58" stroke="${INK}" stroke-width="1.4"/>`);

  // petals, far first
  const order = ALPHA.map((a, k) => ({ k, y: Math.sin(a) })).sort((p, q) => p.y - q.y);
  const laid = [];
  for (const { k } of order) {
    const L = [], R = [];
    for (let i = 0; i <= 44; i++) { L.push(proj(petalPoint(k, i / 44, -1))); R.push(proj(petalPoint(k, i / 44, 1))); }
    const d = smooth(L) + smooth([...R].reverse(), false, { move: false }) + " Z";
    const [x0, y0] = proj(petalPoint(k, 0, 0)), [x1, y1] = proj(petalPoint(k, 1, 0));
    const shade = Math.max(0, -Math.sin(ALPHA[k])) * 0.25;
    defs.push(
      `<linearGradient id="p${k}g" gradientUnits="userSpaceOnUse" x1="${r1(x0)}" y1="${r1(y0)}" x2="${r1(x1)}" y2="${r1(y1)}">` +
        `<stop offset="0" stop-color="${mix(PETAL.deep, PETAL.shade, 0.25 + shade)}"/><stop offset="0.35" stop-color="${mix(PETAL.base, PETAL.deep, shade)}"/>` +
        `<stop offset="1" stop-color="${mix(PETAL.light, PETAL.base, 0.3 + shade)}"/></linearGradient>`,
    );
    defs.push(`<clipPath id="p${k}c"><path d="${d}"/></clipPath>`);
    if (laid.length) {
      defs.push(`<clipPath id="u${k}">${laid.map((q) => `<path d="${q}"/>`).join("")}</clipPath>`);
      out.push(`<path d="${d}" fill="none" stroke="#300c12" stroke-opacity="0.42" stroke-width="12" filter="url(#soft)" clip-path="url(#u${k})"/>`);
    }
    laid.push(d);
    out.push(`<path d="${d}" fill="${mix(PETAL.base, PETAL.light, 0.3)}"/><path d="${d}" fill="url(#p${k}g)" filter="url(#wc)"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${PETAL.light}" stroke-opacity="0.5" stroke-width="8" clip-path="url(#p${k}c)"/>`);
    // radial veins
    const veins = [];
    for (let v = -0.8; v <= 0.81; v += 0.2) {
      const pts = [];
      for (let i = 1; i <= 14; i++) pts.push(proj(petalPoint(k, 0.08 + 0.86 * (i / 14), v)));
      veins.push(`<path d="${smooth(pts)}"/>`);
    }
    out.push(`<g clip-path="url(#p${k}c)" fill="none" stroke="${PETAL.edge}" stroke-opacity="0.2" stroke-width="1">${veins.join("")}</g>`);
    // many small pale spots, smaller toward the centre
    const spots = [];
    for (let s = 0; s < 34; s++) {
      const u = 0.18 + rand() * 0.76, v = (rand() * 2 - 1) * 0.82;
      const rho = 3.5 + rand() * 7 * (0.4 + u);
      const pts = [];
      for (let i = 0; i < 9; i++) {
        const ph = (i / 9) * Math.PI * 2, w = 1 + (rand() - 0.5) * 0.3;
        pts.push(proj(petalPoint(k, u + (rho * w * Math.cos(ph)) / (RP - R0), v + (rho * w * Math.sin(ph)) / Math.max(24, width(u)))));
      }
      spots.push(smooth(pts, true));
    }
    out.push(`<g clip-path="url(#p${k}c)">${spots.map((q) => `<path d="${q}" fill="#dfa6ae" transform="translate(1 1.4)"/><path d="${q}" fill="#fbe7ea"/>`).join("")}</g>`);
    out.push(`<g filter="url(#pen)"><path d="${d}" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="1.6" transform="translate(1.2 1.1)" clip-path="url(#p${k}c)"/></g>`);
  }

  // the raised rim and the sunken well at the centre
  const ringPts = (r, z) => Array.from({ length: 40 }, (_, i) => proj([Math.cos((i / 40) * Math.PI * 2) * r, Math.sin((i / 40) * Math.PI * 2) * r, z]));
  const outer = smooth(ringPts(70, 4), true), lip = smooth(ringPts(56, 20), true), well = smooth(ringPts(36, 12), true), hole = smooth(ringPts(18, 4), true);
  defs.push(`<radialGradient id="rim" cx="${F.x - 20}" cy="${F.y - 14}" r="90" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d98f7c"/><stop offset="1" stop-color="#8e3f36"/></radialGradient>`);
  out.push(`<path d="${outer}" fill="#9a4640" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<path d="${lip}" fill="url(#rim)" filter="url(#wc)"/><path d="${lip}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  out.push(`<path d="${well}" fill="#5a2420"/><path d="${hole}" fill="#1e0a09"/>`);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const [ax, ay] = proj([Math.cos(a) * 40, Math.sin(a) * 40, 14]), [bx, by] = proj([Math.cos(a) * 54, Math.sin(a) * 54, 19]);
    out.push(`<path d="M${r1(ax)},${r1(ay)} L${r1(bx)},${r1(by)}" stroke="#6e2c26" stroke-width="1.1" stroke-opacity="0.7"/>`);
  }

  // ── fig. 2: its pollen, and grass pollen, at one magnification ────────────
  const grain = (gx, gy, R, id) => {
    defs.push(`<radialGradient id="${id}" cx="${gx - R * 0.35}" cy="${gy - R * 0.35}" r="${R * 1.3}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbe39a"/><stop offset="0.6" stop-color="#eeb84a"/><stop offset="1" stop-color="#b8822a"/></radialGradient>`);
    const spikes = [];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + (i % 2) * 0.1;
      const x0 = gx + Math.cos(a) * R, y0 = gy + Math.sin(a) * R, x1 = gx + Math.cos(a) * (R + 7), y1 = gy + Math.sin(a) * (R + 7);
      const px = -Math.sin(a) * 2.6, py = Math.cos(a) * 2.6;
      spikes.push(`M${r1(x0 + px)},${r1(y0 + py)} L${r1(x1)},${r1(y1)} L${r1(x0 - px)},${r1(y0 - py)} Z`);
    }
    out.push(`<path d="${spikes.join(" ")}" fill="#e2a83e" stroke="${INK}" stroke-width="0.8"/>`);
    out.push(`<circle cx="${gx}" cy="${gy}" r="${R}" fill="url(#${id})" stroke="${INK}" stroke-width="1.5"/>`);
    // surface pores in a net
    for (let i = 0; i < 9; i++) {
      const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * R * 0.7;
      out.push(`<circle cx="${r1(gx + Math.cos(a) * rr)}" cy="${r1(gy + Math.sin(a) * rr)}" r="1.6" fill="#b8822a" fill-opacity="0.8"/>`);
    }
  };
  // the oily coat, pollenkitt, gluing the grains together
  out.push(`<path d="M640,688 C652,668 690,666 704,684 C722,690 722,722 704,730 C688,746 650,742 640,724 C628,716 628,698 640,688 Z" fill="#f7d98a" fill-opacity="0.55" stroke="${INK}" stroke-width="0.8" stroke-opacity="0.5"/>`);
  grain(656, 700, 21, "g1");
  grain(694, 694, 19, "g2");
  grain(676, 728, 18, "g3");
  // grass pollen, same magnification: small, smooth, dry, one pore
  out.push(`<circle cx="760" cy="720" r="7" fill="#f3e9c2" stroke="${INK}" stroke-width="1.2"/><circle cx="762.5" cy="717.5" r="1.8" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
  contact(out, 690, 764, 80, 7, 0.22);

  return { size: SIZE, view: [0, 196, SIZE, 590], defs: defs.join("\n"), body: out.join("\n") };
}
