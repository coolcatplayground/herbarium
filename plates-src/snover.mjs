// NO. 0459 — a fir's top under snow, and where the ice is let form.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the top of a young fir, cut, standing — a leader and its
//      last whorls of branches in tiers, stiff dark blue-green needles — and
//      over it a cap of snow, heaped on the crown and hanging in a ragged
//      fringe round its edge where it has slumped between the branches: the
//      white cap the specimen wears. (A single snowy sprig laid down said too
//      little.)
//   2. The field note files it with the frost-tolerant conifers.
//   3. The note's point is that surviving a hard frost is a matter of
//      deciding where the ice forms. A hardened plant lets it start in the
//      spaces between its cells, where a crystal does no damage, and since
//      ice holds a lower vapour pressure than water, the growing crystals
//      draw water out of the cells — leaving them shrunken, concentrated,
//      and unfrozen. Fig. 2: cells seen close, shrunk, with the ice between.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "snover";
export const no = 459;
const SIZE = 800;
const NEEDLE = ["#2e6a58", "#3c7c68", "#4a8c76", "#2a5e50"];
const TWIG = "#6e5438";
const SNOW = { light: "#ffffff", base: "#eef4f6", shade: "#c4d4dc" };

export function draw() {
  const rand = mulberry32(459);
  const defs = standardDefs(459);
  const out = [];
  contact(out, 320, 758, 170, 14);

  // the cut stem at the foot
  out.push(`<path d="M312,760 L314,700 L326,700 L328,760 Z" fill="${TWIG}" stroke="${INK}" stroke-width="1.4"/>`);
  // tiers of branches, the lowest widest, each a spray of needles
  const tiers = [[700, 200], [640, 170], [584, 140], [532, 108], [486, 76]];
  for (const [y, W] of tiers) {
    const nd = [];
    for (let k = 0; k < 160; k++) {
      const u = rand() * 2 - 1, x = 320 + u * W, yy = y - 30 * (1 - Math.abs(u)) + rand() * 26;
      const a = -Math.PI / 2 + u * 1.3 + (rand() - 0.5) * 1.4, L = 12 + rand() * 7;
      nd.push(`<path d="M${r1(x)},${r1(yy)} l${r1(Math.cos(a) * L)},${r1(Math.sin(a) * L)}" stroke="${NEEDLE[Math.floor(rand() * NEEDLE.length)]}" stroke-width="3" stroke-linecap="round"/>`);
    }
    out.push(`<path d="M${320 - W},${y + 14} Q320,${y - 40} ${320 + W},${y + 14} Q320,${y + 30} ${320 - W},${y + 14} Z" fill="${NEEDLE[3]}" stroke="${INK}" stroke-width="1.4"/>`);
    out.push(nd.join(""));
  }
  // the leader
  out.push(`<path d="M320,490 L322,420" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M320,490 L322,420" stroke="${TWIG}" stroke-width="3.6" stroke-linecap="round"/>`);
  // the cap of snow: heaped on the crown, its fringe hanging ragged
  const top = [], hem = [];
  for (let j = 0; j <= 30; j++) {
    const u = j / 30, x = 320 - 150 + u * 300;
    top.push([x, 588 - 196 * (1 - Math.abs(2 * u - 1)) ** 1.15]);
    hem.push([x, 596 + (j % 3 === 1 ? 24 + rand() * 10 : 4 + rand() * 5) - 12 * Math.sin(Math.PI * u)]);
  }
  const sd = smooth(top) + " " + smooth([...hem].reverse(), false, { move: false }).replace(/^M/, "L") + " Z";
  defs.push(`<linearGradient id="sn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SNOW.light}"/><stop offset="1" stop-color="${SNOW.shade}"/></linearGradient>`);
  out.push(`<path d="${sd}" fill="url(#sn)" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" filter="url(#pen)"/>`);
  out.push(`<path d="${smooth(top.slice(4, 26))}" fill="none" stroke="${SNOW.light}" stroke-width="5" transform="translate(-4 6)"/>`);

  // ── fig. 2: cells, shrunk, with ice between them ─────────────────────────
  const fx = 690, fy = 660, R = 92;
  defs.push(`<clipPath id="lens"><circle cx="${fx}" cy="${fy}" r="${R}"/></clipPath>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="#dfeef4"/>`);
  const cells = [], ice = [];
  const s = 42;
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const x = fx + col * s + (row % 2 ? s / 2 : 0), y = fy + row * s * 0.86;
      cells.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(s * 0.34)}" ry="${r1(s * 0.28)}" fill="#b8dca0" stroke="#4e7e44" stroke-width="1.2"/><ellipse cx="${r1(x - 4)}" cy="${r1(y - 3)}" rx="${r1(s * 0.12)}" ry="${r1(s * 0.08)}" fill="#6e9a58" fill-opacity="0.6"/>`);
      // a crystal in the space beside it
      const ix = x + s * 0.5, iy = y + s * 0.02;
      const arms = [];
      for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI + rand() * 0.2; arms.push(`M${r1(ix - Math.cos(a) * 8)},${r1(iy - Math.sin(a) * 8)} L${r1(ix + Math.cos(a) * 8)},${r1(iy + Math.sin(a) * 8)}`); }
      ice.push(arms.join(" "));
    }
  }
  out.push(`<g clip-path="url(#lens)">${cells.join("")}<path d="${ice.join(" ")}" stroke="#5a8ed4" stroke-width="1.8" stroke-linecap="round"/></g>`);
  out.push(`<circle cx="${fx}" cy="${fy}" r="${R}" fill="none" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  contact(out, fx, fy + R + 8, 74, 6, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
