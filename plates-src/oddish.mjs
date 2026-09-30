// NO. 0043 — the tuber, and the crown that keeps time.
//
// What the morphology says, and what each observation became:
//
//   1. A round storage organ, deep indigo, that lives in the ground: a
//      geophyte, as the field note files it. So the plate is the tuber
//      itself, set down on the ground without its roots — drawn under it,
//      even splayed and tapering, the two taproots still read as legs.
//   2. A crown of long, broad, glossy leaves sprayed up and out from the top —
//      the whole of what shows above ground.
//   3. It keeps a clock. The field note's point is de Mairan's mimosa, whose
//      leaves opened each morning and folded each night in a dark cupboard
//      with no sun to cue them: the rhythm is internal. So fig. 2 is the same
//      plant at night, its leaves folded up and pressed together — the sleep
//      movement, nyctinasty — under a crescent moon.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "oddish";
export const no = 43;
const SIZE = 800;

const INDIGO = { light: "#a9c0d6", base: "#5b7ea2", deep: "#3c5b82", shade: "#23385a", edge: "#1f3450" };
const LEAF = { light: "#b3dc98", base: "#5aac4e", deep: "#2f7c37", shade: "#1d5226", edge: "#215a2a" };

const tuber = (x, base, s) =>
  makeOrgan({
    x, base, H: 250 * s, R: 134 * s, tilt: 0.2,
    knots: [[0, 0.34], [0.08, 0.7], [0.22, 0.93], [0.42, 1], [0.62, 0.93], [0.8, 0.68], [0.92, 0.36], [1, 0]],
  });

// A leaf of the crown: long, broad, entire, with a slight wave, arching out.
function crownLeaf(crown, angle, len, width, arch, rand) {
  const [cx, cy] = crown;
  const pts = [];
  for (let i = 0; i <= 5; i++) {
    const u = i / 5;
    const a = angle + arch * u * u;
    const r = len * u;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return blade(pts, {
    width: (u) => width * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.97) ** 0.8), 0.75) * (1 + 0.04 * Math.sin(u * 14)),
    sideVeins: 7, rand,
  });
}

export function draw() {
  const rand = mulberry32(43);
  const defs = standardDefs(43);
  const out = [];

  // ── fig. 1: by day ─────────────────────────────────────────────────────────
  const T = tuber(318, 748, 1);
  contact(out, 318, 752, 170, 18);
  paintSolid(T, { id: "t", outline: hull(T), palette: INDIGO, defs, out, hatch: 6 });
  // lenticels: the small pale breathing pores of a tuber's skin
  for (let k = 0; k < 22; k++) {
    const th = -1.1 + rand() * 2.2, t = 0.15 + rand() * 0.65;
    const [px, py] = T.surface(th, t, 1.003);
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="${r1(2 + rand() * 2 * Math.cos(th))}" ry="1.2" fill="#c9d6e4" fill-opacity="0.7"/>`);
  }

  // the crown of leaves, the upright ones first so the spreading ones lie over
  const crown = T.surface(0, 0.97);
  const LEAVES = [
    [-1.62, 250, 46, 0.1], [-1.18, 262, 50, 0.32], [-2.05, 238, 46, -0.26],
    [-0.72, 250, 50, 0.46], [-2.5, 228, 44, -0.42], [-0.3, 214, 44, 0.5],
  ];
  LEAVES.forEach(([a, len, w, arch], i) => {
    const b = crownLeaf(crown, a, len, w, arch, rand);
    paintBlade(b, { id: `l${i}`, palette: LEAF, defs, out, shade: i < 3 ? 0.25 : 0, margin: 6, veinOpacity: 0.35 });
  });

  // ── fig. 2: by night ───────────────────────────────────────────────────────
  // the same plant, its leaves folded up and pressed together to sleep
  const N = tuber(684, 742, 0.36);
  contact(out, 684, 766, 62, 8, 0.28);
  paintSolid(N, { id: "n", outline: hull(N), palette: INDIGO, defs, out, hatch: 3, ink: 1.8 });
  const nc = N.surface(0, 0.96);
  [[-1.49, 150, 17, 0.03], [-1.63, 146, 17, -0.03], [-1.4, 132, 16, 0.08], [-1.74, 128, 16, -0.08], [-1.57, 156, 16, 0]].forEach(([a, len, w, arch], i) => {
    const b = crownLeaf(nc, a, len, w, arch, rand);
    paintBlade(b, { id: `n${i}`, palette: LEAF, defs, out, shade: 0.35, margin: 3, veinOpacity: 0.25, ink: 1.3 });
  });
  // a crescent moon above it
  const mx = 626, my = 548;
  out.push(`<path d="M${mx + 6},${my - 30} A30,30 0 1,0 ${mx + 6},${my + 30} A22,26 0 1,1 ${mx + 6},${my - 30} Z" fill="#f4e7b4" stroke="${INK}" stroke-width="1.5" filter="url(#pen)"/>`);

  void smooth;
  return { size: SIZE, view: [0, 252, SIZE, 534], defs: defs.join("\n"), body: out.join("\n") };
}
