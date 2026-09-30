// NO. 0188 — the flower, before it shuts.
//
// What the morphology says, and what each observation became:
//
//   1. A broad yellow flower head seen from above: eight wide, rounded petals
//      round a pale green disc of tiny florets.
//   2. Under it, a round green body — the involucre, the cup of bracts every
//      dandelion head sits in. The detail that names the genus: its outer
//      bracts do not hug the cup, they turn back and hang down, and that is
//      how a botanist tells a dandelion from its many look-alikes.
//   3. The field note's point is the stage that follows. Once the florets
//      are done a dandelion shuts its head and stays shut for days while the
//      seed and its parachutes are made inside, and meanwhile the stalk,
//      which flowered low and sheltered, lengthens to lift the head clear of
//      everything for the wind. Fig. 2: the same head, shut, raised high.
import { mulberry32, r1, smooth, mix, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid, profileOutline } from "./kit.mjs";

export const slug = "skiploom";
export const no = 188;
const SIZE = 800;
const YELLOW = { light: "#fbf3b0", base: "#f5e57c", deep: "#d4c35c", shade: "#9a8a34", edge: "#8e7e2e" };
const GREEN = { light: "#b9dd8c", base: "#86c451", deep: "#568a34", shade: "#355a20", edge: "#355a20" };

// the reflexed outer bracts: out from the cup, then turned back and down
function reflexed(org, out, defs, rand, { t = 0.3, len = 64, w = 12, thetas, id }) {
  thetas.forEach((th, i) => {
    const [sx, sy] = org.surface(th, t);
    const dir = Math.sin(th) >= 0 ? 1 : -1;
    const ox = Math.sin(th) * 0.9 + dir * 0.1;
    const pts = [[sx, sy], [sx + ox * len * 0.45, sy - len * 0.06], [sx + ox * len * 0.8, sy + len * 0.26], [sx + ox * len * 0.92, sy + len * 0.7]];
    const b = blade(pts, { width: (u) => w * Math.pow(Math.sin(Math.PI * Math.min(1, 0.06 + u * 0.94) ** 0.55), 0.8), sideVeins: 0, rand });
    paintBlade(b, { id: `${id}${i}`, palette: GREEN, defs, out, shade: Math.cos(th) < 0 ? 0.3 : 0.05, margin: 3, veinOpacity: 0.3, ink: 1.3 });
  });
}

export function draw() {
  const rand = mulberry32(188);
  const defs = standardDefs(188);
  const out = [];
  const cx = 322, cy = 540;
  contact(out, cx, 754, 190, 16);

  // the short stalk it flowered on
  out.push(`<path d="M${cx - 16},756 C${cx - 14},730 ${cx - 12},712 ${cx - 14},690 L${cx + 14},690 C${cx + 12},712 ${cx + 14},730 ${cx + 16},756 Z" fill="#86b85e" stroke="${INK}" stroke-width="1.8"/>`);

  // the involucre: a round green cup, its outer bracts turned back and down
  const cup = makeOrgan({ x: cx, base: 704, H: 176, R: 132, tilt: 0.34, knots: [[0, 0.3], [0.18, 0.78], [0.45, 1], [0.75, 0.95], [1, 0.8]] });
  reflexed(cup, out, defs, rand, { thetas: [-2.5, 2.5, -2.0, 2.0], id: "rb", len: 70 });
  paintSolid(cup, { id: "cu", outline: hull(cup), palette: GREEN, defs, out, hatch: 0 });
  // the inner bracts, pressed edge to edge up the cup
  for (let th = -1.35; th <= 1.36; th += 0.27) {
    const pts = [];
    for (let j = 0; j <= 10; j++) pts.push(cup.surface(th, 0.14 + (j / 10) * 0.86, 1.004));
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${GREEN.shade}" stroke-width="1.1" stroke-opacity="0.55" clip-path="url(#cuc)"/>`);
  }
  reflexed(cup, out, defs, rand, { thetas: [-1.5, 1.5, -0.95, 0.95, -0.35, 0.35], id: "rf", len: 76 });

  // the flower: eight broad petals, rounded at the tip, seen from above
  const ky = 0.5, r0 = 30, L = 176, W = 58;
  const petals = [];
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 + 0.2 + (rand() - 0.5) * 0.06;
    const P = (u, v) => {
      const lx = r0 + u * L, ly = v;
      return [cx + Math.cos(a) * lx - Math.sin(a) * ly, cy + (Math.sin(a) * lx + Math.cos(a) * ly) * ky];
    };
    const f = (u) => Math.pow(u, 0.55) * Math.sqrt(Math.max(0, 1 - u ** 5));
    const side = [];
    for (let j = 0; j <= 16; j++) side.push(j / 16);
    const pts = [...side.map((u) => P(u, W * f(u))), ...side.slice(1, -1).reverse().map((u) => P(u, -W * f(u)))];
    const vein = [0.12, 0.82].map((u) => P(u, 0));
    const sv = [-0.5, 0.5].map((s) => [P(0.2, 0), P(0.55, s * W * 0.8), P(0.8, s * W * 0.72)]);
    petals.push({ d: smooth(pts, true), y: Math.sin(a), vein, sv });
  }
  petals.sort((p, q) => p.y - q.y);
  defs.push(`<radialGradient id="pg" cx="${cx}" cy="${cy}" r="${r0 + L}" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 ${r1(cy * (1 - ky))}) scale(1 ${ky})"><stop offset="0.2" stop-color="${YELLOW.deep}"/><stop offset="0.55" stop-color="${YELLOW.base}"/><stop offset="1" stop-color="${YELLOW.light}"/></radialGradient>`);
  for (const { d, y, vein, sv } of petals) {
    out.push(`<path d="${d}" fill="${mix(YELLOW.base, YELLOW.deep, Math.max(0, -y) * 0.35)}"/><path d="${d}" fill="url(#pg)" filter="url(#wc)" fill-opacity="${r1(0.92 - Math.max(0, -y) * 0.2)}"/>`);
    out.push(`<path d="M${r1(vein[0][0])},${r1(vein[0][1])} L${r1(vein[1][0])},${r1(vein[1][1])} ${sv.map((s) => smooth(s)).join(" ")}" fill="none" stroke="${YELLOW.edge}" stroke-width="0.9" stroke-opacity="0.35"/>`);
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" filter="url(#pen)"/>`);
  }
  // the disc of florets
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="60" ry="${r1(60 * ky)}" fill="#e6f1c8" stroke="${INK}" stroke-width="1.6"/>`);
  const fl = [];
  for (let n = 1; n < 120; n++) {
    const r = 5.4 * Math.sqrt(n), a = n * 2.39996;
    if (r > 55) break;
    fl.push(`<circle cx="${r1(cx + Math.cos(a) * r)}" cy="${r1(cy + Math.sin(a) * r * ky)}" r="2"/>`);
  }
  out.push(`<g fill="#a9c26e" stroke="${INK}" stroke-width="0.4">${fl.join("")}</g>`);

  // ── fig. 2: shut, and lifted ──────────────────────────────────────────────
  const fx = 690;
  const stalk = `M${fx - 3},772 C${fx - 6},680 ${fx + 4},600 ${fx},480`;
  out.push(`<path d="${stalk}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${stalk}" fill="none" stroke="#86b85e" stroke-width="5.4" stroke-linecap="round"/>`);
  const bud = makeOrgan({ x: fx, base: 486, H: 96, R: 38, tilt: 0.1, knots: [[0, 0.5], [0.2, 0.9], [0.45, 1], [0.7, 0.86], [0.9, 0.5], [1, 0]] });
  reflexed(bud, out, defs, rand, { thetas: [-1.3, 1.3, -0.5, 0.5], id: "fr", t: 0.12, len: 30, w: 6 });
  paintSolid(bud, { id: "fb", outline: profileOutline(bud), palette: GREEN, defs, out, hatch: 2, ink: 1.8 });
  for (const th of [-0.9, -0.3, 0.3, 0.9]) {
    const pts = [];
    for (let j = 0; j <= 8; j++) pts.push(bud.surface(th, 0.05 + (j / 8) * 0.85, 1.005));
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${GREEN.shade}" stroke-width="1" clip-path="url(#fbc)"/>`);
  }
  // the spent yellow petals, just showing at the closed top
  const [px, py] = bud.surface(0, 0.97);
  out.push(`<path d="M${r1(px - 8)},${r1(py + 6)} L${r1(px - 3)},${r1(py - 6)} L${r1(px + 1)},${r1(py + 4)} L${r1(px + 5)},${r1(py - 7)} L${r1(px + 9)},${r1(py + 6)} Z" fill="${YELLOW.deep}" stroke="${INK}" stroke-width="1"/>`);
  contact(out, fx, 774, 36, 5, 0.2);
  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
