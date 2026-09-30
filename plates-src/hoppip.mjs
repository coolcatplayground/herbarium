// NO. 0187 — a dandelion bud, and its lion's teeth.
//
// What the morphology says, and what each observation became:
//
//   1. A round pink flower head, still closed, clasped by narrow bracts —
//      the involucre every dandelion head is wrapped in before it opens.
//   2. Rising from it on a short stalk, two long leaves splayed in a V. Their
//      edges are the giveaway: cut into sharp teeth that point BACK toward the
//      base, as a dandelion's do — runcinate, dent-de-lion, lion's teeth.
//   3. Fig. 2 is the field note's story. A Central Asian dandelion, Taraxacum
//      kok-saghyz, carries usable rubber in its root; when the war cut the
//      Allies off from the plantations it was sown by the acre as an
//      emergency substitute, and it is being grown again now. Its root, cut:
//      the latex beading white out of the cut face.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan, makeScales, paintScales } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "hoppip";
export const no = 187;
const SIZE = 800;
const PINK = { light: "#ffc8da", base: "#f29dbc", deep: "#c96b8d", shade: "#8e4262", edge: "#8e4262", cast: "#4a1830" };
const BRACT = { light: "#f7b8cc", base: "#dc8aa6", deep: "#a95a78", shade: "#6e3450", edge: "#6e3450", cast: "#4a1830" };
const LEAF = { light: "#cde8a8", base: "#96cb6c", deep: "#5d8a3f", shade: "#3a5c26", edge: "#3c5e28" };

export function draw() {
  const rand = mulberry32(187);
  const defs = standardDefs(187);
  const out = [];
  const B = makeOrgan({ x: 320, base: 740, H: 196, R: 112, tilt: 0.2, knots: [[0, 0.46], [0.12, 0.82], [0.3, 0.98], [0.5, 1], [0.7, 0.9], [0.86, 0.62], [1, 0]] });
  contact(out, 320, 760, 130, 14);

  // the stalk up out of the head, and the two leaves in a V
  const [tx, ty] = B.surface(0, 0.98);
  const top = [tx + 6, ty - 64];
  out.push(`<path d="M${tx},${ty + 6} Q${tx + 8},${ty - 30} ${top[0]},${top[1]}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${tx},${ty + 6} Q${tx + 8},${ty - 30} ${top[0]},${top[1]}" fill="none" stroke="#86b85e" stroke-width="8.5" stroke-linecap="round"/>`);
  for (const [side, ang] of [[-1, -2.5], [1, -0.62]]) {
    const L = 230;
    const pts = [top, [top[0] + Math.cos(ang) * L * 0.35, top[1] + Math.sin(ang) * L * 0.35], [top[0] + Math.cos(ang + side * 0.08) * L * 0.7, top[1] + Math.sin(ang + side * 0.08) * L * 0.7], [top[0] + Math.cos(ang + side * 0.14) * L, top[1] + Math.sin(ang + side * 0.14) * L]];
    // teeth leaning back toward the base: lean is negative
    const b = blade(pts, { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.7), 0.6) + 2, lobes: 7, depth: 0.58, lean: -0.95, start: 0.14, rand });
    paintBlade(b, { id: `lf${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.2 : 0, margin: 4 });
  }

  // the head, and the bracts clasping it
  const sil = hull(B);
  defs.push(`<clipPath id="sil"><path d="${sil}"/></clipPath>`);
  paintSolid(B, { id: "h", outline: sil, palette: PINK, defs, out, hatch: 5 });
  const bracts = makeScales(B, { n: 14, phi0: 0.1, w0: 0.3, tEnd: (th, k) => 0.5 + (k % 3) * 0.05 });
  paintScales(B, bracts, { id: "br", palette: BRACT, rand, defs, out, gradient: [-120, -200, 120, 0], sheen: false, margin: 3, veins: [-0.4, 0.4], midrib: true });

  // ── fig. 2: the rubber root, cut ──────────────────────────────────────────
  const fx = 684, fy = 596;
  const figFrom = out.length;
  const root = `M${fx - 34},${fy} C${fx - 36},${fy + 60} ${fx - 20},${fy + 120} ${fx - 2},${fy + 172} C${fx + 18},${fy + 120} ${fx + 34},${fy + 60} ${fx + 34},${fy} Z`;
  defs.push(`<linearGradient id="rt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8d2a8"/><stop offset="0.5" stop-color="#cfae7a"/><stop offset="1" stop-color="#9a7a4c"/></linearGradient>`);
  out.push(`<path d="${root}" fill="url(#rt)"/>`);
  for (let k = 0; k < 7; k++) out.push(`<path d="M${fx - 28 + k * 2},${fy + 30 + k * 18} q${k % 2 ? -12 : 12},6 ${k % 2 ? -20 : 20},14" fill="none" stroke="${INK}" stroke-width="0.8"/>`);
  for (let k = 0; k < 9; k++) out.push(`<path d="M${fx - 30 + k * 7},${fy + 20 + k * 14} l14,-2" stroke="#8a6a40" stroke-width="0.8" stroke-opacity="0.6"/>`);
  out.push(`<path d="${root}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  // the cut face, and the latex welling out of its ring of canals
  out.push(`<ellipse cx="${fx}" cy="${fy}" rx="34" ry="11" fill="#f1e2c2" stroke="${INK}" stroke-width="1.4"/>`);
  out.push(`<ellipse cx="${fx}" cy="${fy}" rx="20" ry="6" fill="none" stroke="#c7ab78" stroke-width="1.2"/>`);
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2, x = fx + Math.cos(a) * 22, y = fy + Math.sin(a) * 6.5;
    out.push(`<circle cx="${r1(x)}" cy="${r1(y - 2)}" r="${r1(2.6 + (k % 3))}" fill="#fdfdf8" stroke="${INK}" stroke-width="0.7"/>`);
  }
  out.push(`<path d="M${fx + 30},${fy + 4} C${fx + 34},${fy + 18} ${fx + 30},${fy + 30} ${fx + 34},${fy + 44} a5,6 0 1,1 -9,1 C${fx + 26},${fy + 30} ${fx + 24},${fy + 16} ${fx + 26},${fy + 4} Z" fill="#fdfdf8" stroke="${INK}" stroke-width="0.9"/>`);
  contact(out, fx, 772, 50, 5, 0.2);
  out.push(`<g transform="translate(${fx} 772) scale(1.3) translate(${-fx} -772)">${out.splice(figFrom).join("\n")}</g>`);
  void smooth;
  return { size: SIZE, view: [0, 270, SIZE, 520], defs: defs.join("\n"), body: out.join("\n") };
}
