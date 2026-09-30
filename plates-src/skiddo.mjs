// NO. 0672 — a garland of leaves, and a garden on a sloth.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the garland. A thick collar of broad leaves, bright green
//      and deeply lobed, overlapping in a ring as a wreath does — the ring of
//      living leaves the specimen wears round its neck and down its back —
//      laid down flat, a few leaves turned up at its rim.
//   2. The field note files it with living ground cover carried on an
//      animal, and its point is that this is not entirely fanciful.
//   3. A three-toed sloth's fur carries green algae, living in cracks along
//      the hair that take up and hold water, and the coat supports a small
//      community of its own: algae, fungi, and moths that live nowhere else.
//      Fig. 2: one of those hairs through a lens, its cracks green with the
//      algae growing in them.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "skiddo";
export const no = 672;
const SIZE = 800;
const LEAF = { light: "#bfe8a0", base: "#4aa84a", deep: "#2a7a34", shade: "#184e22", edge: "#184e22" };

export function draw() {
  const rand = mulberry32(672);
  const defs = standardDefs(672);
  const out = [];
  contact(out, 320, 758, 250, 16);

  // the ring of leaves, seen from a little above: back of the ring first
  const cx = 320, cy = 650, RX = 170, RY = 60;
  const N = 16;
  const ring = [];
  for (let k = 0; k < N; k++) ring.push({ a: (k / N) * Math.PI * 2 + 0.1, z: Math.sin((k / N) * Math.PI * 2 + 0.1) });
  ring.sort((p, q) => p.z - q.z).forEach(({ a }, i) => {
    const x0 = cx + Math.cos(a) * RX * 0.7, y0 = cy + Math.sin(a) * RY * 0.7;
    const up = Math.sin(a) < 0 ? -1 : 0;
    const L = 130;
    const tx = cx + Math.cos(a) * (RX + 90), ty = cy + Math.sin(a) * (RY + 40) + up * 40;
    const pts = [[x0, y0], [(x0 + tx) / 2, (y0 + ty) / 2 - 18], [tx, ty]];
    const b = blade(pts, { width: (u) => 46 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.8), 0.7), lobes: 4, depth: 0.35, start: 0.3, teeth: "round", sideVeins: 5, rand });
    paintBlade(b, { id: `r${i}`, palette: LEAF, defs, out, shade: Math.sin(a) < 0 ? 0.3 : 0, margin: 6 });
    void L;
  });
  // the empty middle of the wreath
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${RX * 0.66}" ry="${RY * 0.62}" fill="#6e5438" fill-opacity="0.18"/>`);

  // ── fig. 2: a sloth hair through a lens, green in its cracks ──────────────
  const fx = 690, fy = 680, R = 88;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${R}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#f4f0e4"/>`);
  const hair = [];
  hair.push(`<path d="M${fx - 110},${fy + 40} L${fx + 110},${fy - 40} L${fx + 110},${fy - 8} L${fx - 110},${fy + 72} Z" fill="#c8a47a" stroke="${INK}" stroke-width="1.4"/>`);
  for (let k = 0; k < 11; k++) {
    const u = -1 + k * 0.2, x = fx + u * 100, y = fy - u * 36 + 16;
    hair.push(`<path d="M${r1(x - 4)},${r1(y - 14)} L${r1(x + 4)},${r1(y + 14)}" stroke="#5e9a3e" stroke-width="5" stroke-linecap="round"/><path d="M${r1(x - 4)},${r1(y - 14)} L${r1(x + 4)},${r1(y + 14)}" stroke="#3a6a2a" stroke-width="1"/>`);
    for (let q = 0; q < 3; q++) hair.push(`<circle cx="${r1(x + (rand() - 0.5) * 6)}" cy="${r1(y + (rand() - 0.5) * 20)}" r="1.8" fill="#8ac86a"/>`);
  }
  out.push(`<g clip-path="url(#lens)">${hair.join("")}</g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  contact(out, fx, fy + R + 6, 70, 5, 0.18);

  return { size: SIZE, view: [0, 440, SIZE, 350], defs: defs.join("\n"), body: out.join("\n") };
}
