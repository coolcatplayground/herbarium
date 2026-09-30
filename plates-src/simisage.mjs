// NO. 0512 — a crest of leaves, and why a bitter leaf is a cheap one.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the crest. A tall plume of leaves rising together from one
//      point like a flame — long, pointed, overlapping, the middle ones
//      tallest, dark at the base and paling to the tips. The leafy crest the
//      specimen wears. (Three yellow buds set on its front made a face.)
//   2. At its foot, a few leaves spreading low and sharply toothed: the
//      spiky sprays the specimen carries.
//   3. The field note's point is how a plant splits its chemical defence.
//      Bitter compounds made in small amounts — alkaloids, cardiac
//      glycosides — are cheap and toxic, and pay in short-lived leaves that
//      grazers must learn to leave; tannins are bulky and dose-dependent, and
//      pay in long-lived tough ones that no one can learn to eat around.
//      Fig. 2: those two leaves, their defence drawn in them — a few dark
//      points of poison in the thin one, the tough one solid with tannin.
import { mulberry32, r1 } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "simisage";
export const no = 512;
const SIZE = 800;
const PLUME = { light: "#bfe6a0", base: "#4aa452", deep: "#2a7a3a", shade: "#184e24", edge: "#184e24" };
const SPRAY = { light: "#a8d88c", base: "#3e9a48", deep: "#23703a", shade: "#154a26", edge: "#154a26" };

export function draw() {
  const rand = mulberry32(512);
  const defs = standardDefs(512);
  const out = [];
  contact(out, 320, 758, 210, 14);

  const foot = [320, 740];
  // the low spiky sprays at the foot, spreading
  for (const [a, L] of [[Math.PI + 0.3, 170], [-0.3, 170], [Math.PI + 0.6, 120], [-0.6, 120]]) {
    const pts = [foot, [foot[0] + Math.cos(a) * L * 0.5, foot[1] + Math.sin(a) * L * 0.3 - 16], [foot[0] + Math.cos(a) * L, foot[1] + Math.sin(a) * L * 0.4 - 4]];
    const b = blade(pts, { width: (u) => 30 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.7), lobes: 6, depth: 0.55, lean: 0.9, start: 0.15, sideVeins: 0, rand });
    paintBlade(b, { id: `s${r1(a * 10)}`, palette: SPRAY, defs, out, shade: 0.15, margin: 3 });
  }
  // the plume: long pointed leaves rising together, outer ones first
  const PL = [[-2.1, 240, 0.25], [-1.04, 240, 0.25], [-1.9, 300, 0.1], [-1.24, 300, 0.1], [-1.72, 350, 0], [-1.42, 350, 0], [-1.57, 390, 0]];
  PL.forEach(([a, L, sh], i) => {
    const pts = [foot, [foot[0] + Math.cos(a) * L * 0.35, foot[1] + Math.sin(a) * L * 0.35], [foot[0] + Math.cos(a) * L * 0.7, foot[1] + Math.sin(a) * L * 0.7], [foot[0] + Math.cos(a) * L + (a + 1.57) * 30, foot[1] + Math.sin(a) * L]];
    const b = blade(pts, { width: (u) => 44 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 1.2), 0.7), sideVeins: 5, rand });
    paintBlade(b, { id: `p${i}`, palette: PLUME, defs, out, shade: sh, margin: 6 });
  });

  // ── fig. 2: a thin bitter leaf, and a thick tannic one ────────────────────
  const thin = blade([[630, 766], [626, 700], [634, 630]], { width: (u) => 26 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), sideVeins: 4, rand });
  paintBlade(thin, { id: "thin", palette: { light: "#d8f0b8", base: "#8ccc6a", deep: "#5a9a4a", shade: "#2e5a26", edge: "#2e5a26" }, defs, out, margin: 3 });
  for (const [x, y] of [[628, 720], [636, 690], [624, 668], [632, 650]]) out.push(`<circle cx="${x}" cy="${y}" r="2.6" fill="#6a2a5a"/>`);
  const thick = blade([[744, 766], [740, 700], [748, 630]], { width: (u) => 30 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), sideVeins: 4, rand });
  paintBlade(thick, { id: "thick", palette: { light: "#8aa86a", base: "#3e6a36", deep: "#23461f", shade: "#142a12", edge: "#142a12" }, defs, out, margin: 3 });
  out.push(`<path d="${thick.d}" fill="#7a4a2a" fill-opacity="0.35"/>`);
  contact(out, 688, 768, 90, 5, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.join("\n"), body: out.join("\n") };
}
