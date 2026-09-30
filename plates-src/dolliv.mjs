// NO. 0929 — a pair of olives on a sprig, and the pause in the middle.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a sprig. A short olive twig ending in a whorl of narrow
//      leaves, and hanging from it on two short stalks a pair of olives,
//      yellow-green and ripening, one either side — the two olives the
//      specimen wears like a crown.
//   2. The field note's record is a species that has lived beside people
//      since long ago.
//   3. The note's point is that a stone fruit grows in two bursts with a
//      pause between them. The flesh swells quickly, then stops for weeks
//      while the stone hardens inside it, then swells again — the same double
//      curve in olives, peaches, cherries and plums. Fig. 2: one olive cut at
//      three moments — small and soft; the same size with its stone gone hard;
//      full-grown.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "dolliv";
export const no = 929;
const SIZE = 800;
const LEAF = { light: "#c8e0b0", base: "#4e8a4a", deep: "#2e6a32", shade: "#1a4420", edge: "#1a4420" };

export function draw() {
  const rand = mulberry32(929);
  const defs = standardDefs(929);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the twig, rising
  out.push(`<path d="M318,760 C316,680 322,600 320,520" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M318,760 C316,680 322,600 320,520" fill="none" stroke="#7a6a44" stroke-width="7" stroke-linecap="round"/>`);
  // the whorl of narrow leaves at its end, standing up and out
  for (const [a, L] of [[-2.6, 130], [-0.54, 130], [-2.1, 150], [-1.04, 150], [-1.57, 160]]) {
    const b = blade([[320, 526], [320 + Math.cos(a) * L * 0.5, 526 + Math.sin(a) * L * 0.5], [320 + Math.cos(a) * L, 526 + Math.sin(a) * L]], { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id: `w${r1(a * 10)}`, palette: LEAF, defs, out, margin: 3 });
  }
  // the pair of olives, hanging either side on short stalks
  defs.push(`<radialGradient id="ol" cx="0.36" cy="0.3" r="0.85"><stop offset="0" stop-color="#fbf4a8"/><stop offset="0.55" stop-color="#dcd44a"/><stop offset="1" stop-color="#9aa02a"/></radialGradient>`);
  for (const s of [-1, 1]) {
    const x = 320 + s * 120, y = 580;
    out.push(`<path d="M320,560 Q${320 + s * 60},540 ${x},${y - 60}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M320,560 Q${320 + s * 60},540 ${x},${y - 60}" fill="none" stroke="#7a6a44" stroke-width="3" stroke-linecap="round"/>`);
    out.push(`<ellipse cx="${x}" cy="${y}" rx="68" ry="58" fill="url(#ol)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
    out.push(`<ellipse cx="${x - 22}" cy="${y - 22}" rx="16" ry="10" transform="rotate(-30 ${x - 22} ${y - 22})" fill="#ffffff" fill-opacity="0.5"/>`);
  }

  // ── fig. 2: one olive cut at three moments ────────────────────────────────
  const cut = (x, rx, ry, stoneHard) => {
    const y = 740;
    out.push(`<ellipse cx="${x}" cy="${y - ry}" rx="${rx}" ry="${ry}" fill="#b8cc5a" stroke="${INK}" stroke-width="1.3"/><ellipse cx="${x}" cy="${y - ry}" rx="${rx - 4}" ry="${ry - 4}" fill="#eef2c0"/>`);
    out.push(`<ellipse cx="${x}" cy="${y - ry}" rx="${r1(rx * 0.42)}" ry="${r1(ry * 0.5)}" fill="${stoneHard ? "#a8845a" : "#dce4a8"}" stroke="${stoneHard ? INK : "#a8b87a"}" stroke-width="${stoneHard ? 1.4 : 0.8}"/>`);
  };
  cut(612, 22, 26, false);
  cut(680, 22, 26, true);
  cut(754, 36, 42, true);
  contact(out, 684, 744, 110, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
