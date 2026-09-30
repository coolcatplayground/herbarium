// NO. 0928 — an olive, and why a seed that travels is full of oil.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the olive. One large green olive, egg-shaped, glossy, a
//      little paler at its tip — the drupe the specimen carries on its head —
//      on a short stalk with a pair of narrow olive leaves, dark green above
//      and silver beneath.
//   2. The field note's record is a body that turns nutrients into oil and
//      stores it in the fruit on its head.
//   3. The note's point is that oil is the expensive way to store energy, and
//      buys something specific: fat carries a little over twice the energy of
//      starch per gram, so a seed that must be carried anywhere is usually an
//      oilseed, and one that can sit still is usually starchy. Fig. 2: the
//      flesh of an olive through a lens, its cells packed with oil droplets.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "smoliv";
export const no = 928;
const SIZE = 800;
const LEAF = { light: "#c8d8c0", base: "#4e7a4a", deep: "#2e5a32", shade: "#1a3a1e", edge: "#1a3a1e" };

export function draw() {
  const rand = mulberry32(928);
  const defs = standardDefs(928);
  const out = [];
  contact(out, 320, 758, 170, 16);

  const cx = 320, cy = 610, RX = 130, RY = 150;
  defs.push(`<radialGradient id="ol" cx="0.36" cy="0.3" r="0.85"><stop offset="0" stop-color="#e8f0a0"/><stop offset="0.55" stop-color="#a8c44a"/><stop offset="1" stop-color="#6a8a2a"/></radialGradient>`);
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${RX}" ry="${RY}" transform="rotate(-8 ${cx} ${cy})" fill="url(#ol)" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="${cx - 44}" cy="${cy - 70}" rx="30" ry="20" transform="rotate(-30 ${cx - 44} ${cy - 70})" fill="#ffffff" fill-opacity="0.5" filter="url(#sheen)"/>`);
  for (let k = 0; k < 16; k++) { const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 0.8; out.push(`<circle cx="${r1(cx + Math.cos(a) * RX * r)}" cy="${r1(cy + Math.sin(a) * RY * r)}" r="1.4" fill="#e8f0c0" fill-opacity="0.8"/>`); }
  // the stalk and a pair of narrow leaves, silver beneath
  const top = [cx + 16, cy - RY + 2];
  out.push(`<path d="M${top[0]},${top[1]} l6,-40" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${top[0]},${top[1]} l6,-40" stroke="#7a6a44" stroke-width="4" stroke-linecap="round"/>`);
  for (const [s, silver] of [[-1, false], [1, true]]) {
    const b = blade([[top[0] + 6, top[1] - 38], [top[0] + 6 + s * 50, top[1] - 60], [top[0] + 6 + s * 110, top[1] - 62]], { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.9), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id: `l${s}`, palette: silver ? { light: "#f0f4ec", base: "#c8d4c0", deep: "#98a890", shade: "#5a6a54", edge: "#5a6a54" } : LEAF, defs, out, margin: 3 });
  }

  // ── fig. 2: olive flesh through a lens, its cells packed with oil ──────────
  const fx = 690, fy = 680, R = 84;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${R}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#e2ecb0"/>`);
  const cells = [];
  for (let row = -4; row <= 4; row++) for (let c = -4; c <= 4; c++) {
    const x = fx + c * 26 + (row % 2 ? 13 : 0), y = fy + row * 22;
    cells.push(`<ellipse cx="${x}" cy="${y}" rx="12" ry="10" fill="#c8d884" stroke="#6a8a3a" stroke-width="1"/><circle cx="${x - 2}" cy="${y - 1}" r="${r1(4 + rand() * 3)}" fill="#f4e27a" stroke="#b8a03a" stroke-width="0.6"/>`);
  }
  out.push(`<g clip-path="url(#lens)">${cells.join("")}</g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  contact(out, fx, fy + R + 6, 70, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
