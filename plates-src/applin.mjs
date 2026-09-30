// NO. 0840 — an apple, and fruit addressed to an animal that is gone.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the apple. Round, glossy red, paler and yellowish at its
//      shoulder, its stalk in a deep hollow on top — and from the stalk two
//      small pale-green leaves standing up. The red apple with two leaves the
//      specimen lives inside.
//   2. The field note's record is a life spent inside one apple, and that
//      the apple's flavour decides what it becomes.
//   3. The note's point is that some fruit is addressed to an animal that no
//      longer exists. The osage orange is a dense, heavy, softball-sized
//      fruit that falls and rots where it lands; nothing alive in North
//      America eats it and spreads the seed. The animals that did — mastodons,
//      giant ground sloths — have been gone thirteen thousand years. Fig. 2:
//      an osage orange, green and brain-wrinkled, and one cut in half.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "applin";
export const no = 840;
const SIZE = 800;
const LEAF = { light: "#e2f4c0", base: "#a8d078", deep: "#6e9a4a", shade: "#3e6028", edge: "#3e6028" };

export function draw() {
  const rand = mulberry32(840);
  const defs = standardDefs(840);
  const out = [];
  contact(out, 320, 758, 200, 16);

  const cx = 320, cy = 610, R = 150;
  defs.push(`<radialGradient id="ap" cx="0.36" cy="0.28" r="0.85"><stop offset="0" stop-color="#f8d07a"/><stop offset="0.25" stop-color="#e8524a"/><stop offset="0.7" stop-color="#b82a34"/><stop offset="1" stop-color="#6e1420"/></radialGradient>`);
  // the apple: broad at the shoulder, a dip at the top, a little narrower below
  const d = `M${cx},${cy - R * 0.78} C${cx + R * 0.3},${cy - R * 1.02} ${cx + R * 1.08},${cy - R * 0.9} ${cx + R},${cy - R * 0.1} C${cx + R * 0.96},${cy + R * 0.66} ${cx + R * 0.5},${cy + R * 0.96} ${cx},${cy + R * 0.94} C${cx - R * 0.5},${cy + R * 0.96} ${cx - R * 0.96},${cy + R * 0.66} ${cx - R},${cy - R * 0.1} C${cx - R * 1.08},${cy - R * 0.9} ${cx - R * 0.3},${cy - R * 1.02} ${cx},${cy - R * 0.78} Z`;
  out.push(`<path d="${d}" fill="url(#ap)" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  // faint streaks and lenticels on the skin
  for (let k = 0; k < 9; k++) { const x = cx - R * 0.7 + k * R * 0.17; out.push(`<path d="M${r1(x)},${r1(cy - R * 0.6)} C${r1(x + (x - cx) * 0.2)},${r1(cy)} ${r1(x + (x - cx) * 0.2)},${r1(cy + R * 0.5)} ${r1(x)},${r1(cy + R * 0.8)}" fill="none" stroke="#8a1e28" stroke-width="1.4" stroke-opacity="0.25"/>`); }
  for (let k = 0; k < 24; k++) { const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * R * 0.8; out.push(`<circle cx="${r1(cx + Math.cos(a) * r)}" cy="${r1(cy + Math.sin(a) * r * 0.9)}" r="1.4" fill="#f8d8a0" fill-opacity="0.7"/>`); }
  out.push(`<ellipse cx="${cx - 60}" cy="${cy - 70}" rx="34" ry="20" transform="rotate(-30 ${cx - 60} ${cy - 70})" fill="#ffffff" fill-opacity="0.45" filter="url(#sheen)"/>`);
  // the hollow at the top, the stalk, and two small leaves standing up
  out.push(`<ellipse cx="${cx}" cy="${cy - R * 0.76}" rx="30" ry="10" fill="#6e1420" fill-opacity="0.6"/>`);
  out.push(`<path d="M${cx},${cy - R * 0.76} C${cx + 2},${cy - R * 0.9} ${cx + 8},${cy - R} ${cx + 12},${cy - R * 1.06}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${cx},${cy - R * 0.76} C${cx + 2},${cy - R * 0.9} ${cx + 8},${cy - R} ${cx + 12},${cy - R * 1.06}" fill="none" stroke="#7a5a3a" stroke-width="4" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[cx + 10, cy - R], [cx + 10 + s * 30, cy - R - 50], [cx + 10 + s * 50, cy - R - 110]], { width: (u) => 30 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.62), sideVeins: 3, rand });
    paintBlade(b, { id: `l${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 4 });
  }

  // ── fig. 2: an osage orange, whole and halved ─────────────────────────────
  const whole = (x, y, r) => {
    out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#a8c44a" stroke="${INK}" stroke-width="1.5"/>`);
    const w = [];
    for (let k = 0; k < 30; k++) { const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * r * 0.9; w.push(`M${r1(x + Math.cos(a) * rr)},${r1(y + Math.sin(a) * rr)} q${r1((rand() - 0.5) * 12)},${r1((rand() - 0.5) * 12)} ${r1((rand() - 0.5) * 16)},${r1((rand() - 0.5) * 16)}`); }
    out.push(`<path d="${w.join(" ")}" fill="none" stroke="#6e8a2e" stroke-width="1.4"/>`);
  };
  whole(636, 718, 44);
  out.push(`<path d="M700,760 A44,44 0 0,1 788,760 Z" fill="#a8c44a" stroke="${INK}" stroke-width="1.5"/><path d="M706,760 A38,38 0 0,1 782,760 Z" fill="#f2ecc0"/>`);
  for (let k = 0; k < 14; k++) { const a = Math.PI + (k / 13) * Math.PI; out.push(`<path d="M744,760 L${r1(744 + Math.cos(a) * 34)},${r1(760 + Math.sin(a) * 34)}" stroke="#c8c07a" stroke-width="1"/>`); }
  contact(out, 700, 764, 110, 5, 0.18);

  return { size: SIZE, view: [0, 320, SIZE, 470], defs: defs.join("\n"), body: out.join("\n") };
}
