// NO. 0930 — a fruiting olive branch, and a leaf built for a dry summer.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a branch of olive in fruit. A gnarled grey twig forking into
//      two arching sprays, each set with narrow grey-green leaves in pairs,
//      and hanging along them the ripe olives, glossy and near-black purple,
//      in ones and twos. The dark fruit along leafy arms the specimen carries.
//   2. The field note's record is oil given to the weak and fired to break a
//      boulder.
//   3. The note's point is that the olive's build is not its own idea but
//      what its climate does to anything that grows in it. Five regions on
//      five continents share wet winters and hot dry summers, and their
//      unrelated floras converge on the same small, tough, evergreen,
//      grey-green leaf. The olive's is silvered underneath with tiny shield-
//      shaped scales that shade its pores. Fig. 2: that underside through a
//      lens, the scales overlapping like plates.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "arboliva";
export const no = 930;
const SIZE = 800;
const LEAF = { light: "#d8e4cc", base: "#7a9a6a", deep: "#4e6e44", shade: "#2e4428", edge: "#2e4428" };

export function draw() {
  const rand = mulberry32(930);
  const defs = standardDefs(930);
  const out = [];
  contact(out, 320, 758, 240, 14);

  // the twig, grey and gnarled, forking into two arching sprays
  const trunk = `M310,760 C306,700 318,660 320,620`;
  const arms = [`M320,620 C280,580 200,560 110,580`, `M320,620 C360,570 440,550 540,570`, `M320,620 C318,580 330,540 340,500`];
  for (const d of [trunk, ...arms]) out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#8a8478" stroke-width="8" stroke-linecap="round"/>`);
  // pairs of narrow leaves along the sprays, and olives hanging
  const along = (x0, y0, x1, y1, n, dir, id) => {
    for (let k = 1; k <= n; k++) {
      const u = k / (n + 1), x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u - Math.sin(Math.PI * u) * 30;
      for (const s of [-1, 1]) {
        const a = Math.atan2(y1 - y0, x1 - x0) + s * 0.9;
        const b = blade([[x, y], [x + Math.cos(a) * 28, y + Math.sin(a) * 28], [x + Math.cos(a) * 62, y + Math.sin(a) * 58]], { width: (v) => 9 * Math.sin(Math.PI * Math.min(1, 0.05 + v * 0.95)) + 0.6, rand });
        paintBlade(b, { id: `${id}${k}${s}`, palette: LEAF, defs, out, margin: 1.5, midrib: true, ink: 1 });
      }
      if (k % 2 === 1) {
        out.push(`<path d="M${r1(x)},${r1(y)} l${dir * 4},18" stroke="${INK}" stroke-width="1.6"/>`);
        out.push(`<ellipse cx="${r1(x + dir * 4)}" cy="${r1(y + 34)}" rx="13" ry="17" fill="url(#ol)" stroke="${INK}" stroke-width="1.3"/>`);
      }
    }
  };
  defs.push(`<radialGradient id="ol" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="#8a5a8a"/><stop offset="0.55" stop-color="#3e1e40"/><stop offset="1" stop-color="#1a0e1e"/></radialGradient>`);
  along(320, 620, 110, 580, 6, -1, "a");
  along(320, 620, 540, 570, 6, 1, "b");
  along(320, 620, 340, 500, 2, 1, "c");

  // ── fig. 2: an olive leaf's underside, its shield scales ──────────────────
  const fx = 690, fy = 690, R = 82;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${R}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#d8e0d0"/>`);
  const sc = [];
  for (let row = -5; row <= 5; row++) for (let c = -5; c <= 5; c++) {
    const x = fx + c * 22 + (row % 2 ? 11 : 0), y = fy + row * 18;
    const rays = [];
    for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; rays.push(`M${x},${y} L${r1(x + Math.cos(a) * 12)},${r1(y + Math.sin(a) * 12)}`); }
    sc.push(`<circle cx="${x}" cy="${y}" r="13" fill="#f0f2ec" stroke="#98a890" stroke-width="0.8"/><path d="${rays.join(" ")}" stroke="#b8c0b0" stroke-width="0.6"/><circle cx="${x}" cy="${y}" r="2" fill="#98a890"/>`);
  }
  out.push(`<g clip-path="url(#lens)">${sc.join("")}</g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  contact(out, fx, fy + R + 6, 70, 5, 0.18);

  return { size: SIZE, view: [0, 430, SIZE, 360], defs: defs.join("\n"), body: out.join("\n") };
}
