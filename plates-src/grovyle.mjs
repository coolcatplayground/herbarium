// NO. 0253 — a twig from the canopy, and the gaps between crowns.
//
// What the morphology says, and what each observation became:
//
//   1. One part: a twig, fallen from high up, carrying its leaves in tufts —
//      long, narrow, sword-shaped leaves, dark green with a pale midrib,
//      several from each node and all swept back the same way along the
//      twig, as the leaves of a branch tip lie when wind has streamed them.
//      One more leaf runs on alone from the tip.
//   2. The field note files it with the canopy, which is less the top of a
//      forest than another floor of it.
//   3. Fig. 2 is the canopy's habit the note dwells on: crown shyness. Look
//      straight up through a stand of tall trees and the crowns often do not
//      touch; each is held back from its neighbours by a clean gap, and the
//      canopy reads as a jigsaw with sky along every join. Why is still not
//      settled — branches abrading in the wind, and trees sensing a
//      neighbour by the far-red light off its leaves, both have evidence.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "grovyle";
export const no = 253;
const SIZE = 800;
const LEAF = { light: "#a6d890", base: "#469a4c", deep: "#2c6c36", shade: "#1a4422", edge: "#1a4422" };
const CROWN = ["#4e9a4e", "#3f8a44", "#5aa656", "#44904a", "#529e50", "#3a8040", "#4a9448"];

// a point along a cubic
const bez = (p0, p1, p2, p3, t) => [0, 1].map((i) => (1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t * t * p2[i] + t ** 3 * p3[i]);

export function draw() {
  const rand = mulberry32(253);
  const defs = standardDefs(253);
  const out = [];
  contact(out, 330, 758, 220, 14);

  // the twig, rising from where it lies
  const T = [[150, 756], [260, 690], [380, 560], [540, 420]];
  const td = `M${T[0]} C${T[1]} ${T[2]} ${T[3]}`;
  out.push(`<path d="${td}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="${td}" fill="none" stroke="#7a6a44" stroke-width="9" stroke-linecap="round"/><path d="${td}" fill="none" stroke="#a8966a" stroke-width="2.4" transform="translate(-1.6 -1)"/>`);

  // tufts of long narrow leaves, all swept back along the twig
  const leaf = (x, y, a, L, id) => {
    const pts = [];
    for (let j = 0; j <= 4; j++) {
      const u = j / 4;
      pts.push([x + Math.cos(a) * L * u, y + Math.sin(a) * L * u + 26 * u * u]);
    }
    const b = blade(pts, { width: (u) => 17 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.75), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id, palette: LEAF, defs, out, margin: 3, veinOpacity: 0.2 });
  };
  [[0.36, [-2.62, -2.36, -2.12, -1.9], [200, 236, 226, 190]], [0.68, [-2.5, -2.22, -1.96, -1.72], [190, 226, 214, 176]]].forEach(([t, angles, lens], k) => {
    const [x, y] = bez(...T, t);
    // the far leaves first, so the tuft fans toward us
    angles.forEach((a, i) => leaf(x, y, a, lens[i], `t${k}${i}`));
    out.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="7" fill="#6a5a38" stroke="${INK}" stroke-width="1.2"/>`);
  });
  // and one leaf running on from the tip
  leaf(T[3][0], T[3][1], -1.05, 200, "tip");

  // ── fig. 2: crown shyness, looking straight up ────────────────────────────
  const fx = 684, fy = 650, R = 104;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${R}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#e2eef4"/>`);
  // each crown fills its own cell of the plane, held back from the edges of
  // the cell by a gap: the cells are the Voronoi regions of the trunks
  const C = [[-58, -52], [8, -70], [70, -30], [-70, 10], [0, -4], [60, 44], [-30, 62], [28, 90], [-96, 70], [100, -80]];
  const crowns = [];
  C.forEach(([cx0, cy0], i) => {
    const pts = [];
    for (let j = 0; j < 40; j++) {
      const a = (j / 40) * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a);
      let r = 70;
      C.forEach(([ox, oy], k) => {
        if (k === i) return;
        const vx = ox - cx0, vy = oy - cy0, dot = dx * vx + dy * vy;
        if (dot > 0) r = Math.min(r, (vx * vx + vy * vy) / (2 * dot));
      });
      r = Math.max(4, r - 6 - rand() * 2.5) * (0.97 + 0.05 * Math.sin(a * 7 + i));
      pts.push([fx + cx0 + dx * r, fy + cy0 + dy * r]);
    }
    crowns.push(`<path d="${smooth(pts, true)}" fill="${CROWN[i % CROWN.length]}"/>`);
    crowns.push(`<path d="${smooth(pts, true)}" fill="none" stroke="${INK}" stroke-width="1" stroke-opacity="0.7"/>`);
  });
  out.push(`<g clip-path="url(#lens)" filter="url(#wc2)">${crowns.filter((_, i) => i % 2 === 0).join("")}</g>`);
  out.push(`<g clip-path="url(#lens)">${crowns.filter((_, i) => i % 2 === 1).join("")}</g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  contact(out, fx, fy + R + 8, 80, 6, 0.18);

  return { size: SIZE, view: [0, 260, SIZE, 530], defs: defs.join("\n"), body: out.join("\n") };
}
