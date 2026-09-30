// NO. 0315 — two roses, one red and one blue.
//
// What the morphology says, and what each observation became:
//
//   1. The part: two roses, full-blown, one red and one blue, each on its own
//      short stem, the stems crossing at the foot. Petals in rings, the outer
//      ones opened back and the inner ones still wound round the heart. A
//      leaf on each stem — a rose leaf is five toothed leaflets on one stalk
//      — and the thorns, hooked, along the stems.
//   2. A blue rose does not exist: roses lack the enzyme that makes the blue
//      delphinidin pigments. That is the point the field note turns on —
//      colour is not settled by the pigment alone. The same anthocyanin reads
//      red in an acid cell and blue once bound to a metal, which is how a
//      hydrangea turns blue in acid soil: acidity frees aluminium for the
//      roots to take up. Fig. 2: one hydrangea in two pots — acid soil,
//      blue; lime, pink.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "roselia";
export const no = 315;
const SIZE = 800;
const RED = { light: "#f6a0a0", base: "#d8434e", deep: "#9a2436", shade: "#5e1420" };
const BLUE = { light: "#b4d2f4", base: "#4f86d0", deep: "#2c4f94", shade: "#182c5a" };
const LEAF = { light: "#b6d89a", base: "#4e8a44", deep: "#2f5e2c", shade: "#1c3c1c", edge: "#1c3c1c" };

// A rose seen from a little above its side: back petals rising behind as the
// top of the silhouette, the open cup with the inner petals still wound in
// it, and three broad front petals wrapping the cup, their lips rolled
// outward. (Drawn from straight above as flat rings round a spiral, it read
// as a pinwheel.)
function rose(out, defs, id, cx, cy, R, P, rand) {
  const grad = (gid, y0, y1) => defs.push(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${r1(y0)}" x2="0" y2="${r1(y1)}"><stop offset="0" stop-color="${P.light}"/><stop offset="0.5" stop-color="${P.base}"/><stop offset="1" stop-color="${P.deep}"/></linearGradient>`);
  const rimY = cy - R * 0.3;
  grad(`${id}g`, rimY - R * 0.4, cy + R * 0.6);
  const ink = (d, w = 1.5) => out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" filter="url(#pen)"/>`);
  // back petals: rounded lobes rising behind the cup
  for (let k = 0; k < 4; k++) {
    const x = cx + (k - 1.5) * R * 0.44 + (rand() - 0.5) * 6, y = rimY - R * 0.08 - (k === 1 || k === 2 ? R * 0.12 : 0);
    const d = `M${r1(x - R * 0.36)},${r1(rimY + 8)} C${r1(x - R * 0.42)},${r1(y - R * 0.3)} ${r1(x + R * 0.42)},${r1(y - R * 0.34)} ${r1(x + R * 0.36)},${r1(rimY + 8)} Z`;
    out.push(`<path d="${d}" fill="${P.deep}"/><path d="${d}" fill="url(#${id}g)" fill-opacity="0.55" filter="url(#wc)"/>`);
    ink(d, 1.3);
  }
  // the cup's mouth, and the inner petals wound inside it
  out.push(`<ellipse cx="${cx}" cy="${r1(rimY)}" rx="${r1(R * 0.62)}" ry="${r1(R * 0.24)}" fill="${P.shade}"/>`);
  for (let k = 0; k < 4; k++) {
    const w = R * (0.52 - k * 0.12), h = R * (0.2 - k * 0.04), dx = (k % 2 ? 1 : -1) * R * 0.06;
    const d = `M${r1(cx + dx - w)},${r1(rimY + 2)} C${r1(cx + dx - w)},${r1(rimY - h * 1.6)} ${r1(cx + dx + w)},${r1(rimY - h * 1.6)} ${r1(cx + dx + w * 0.8)},${r1(rimY + h * 0.4)} Q${r1(cx + dx)},${r1(rimY - h * 0.2)} ${r1(cx + dx - w)},${r1(rimY + 2)} Z`;
    out.push(`<path d="${d}" fill="${k % 2 ? P.base : P.deep}"/>`);
    out.push(`<path d="M${r1(cx + dx - w)},${r1(rimY + 2)} C${r1(cx + dx - w)},${r1(rimY - h * 1.6)} ${r1(cx + dx + w)},${r1(rimY - h * 1.6)} ${r1(cx + dx + w * 0.8)},${r1(rimY + h * 0.4)}" fill="none" stroke="${P.light}" stroke-width="1.8" stroke-opacity="0.8"/>`);
    ink(d, 1);
  }
  // three front petals wrapping the cup, lips rolled out
  const FRONT = [[-0.46, 0.62], [0.46, 0.62], [0, 0.66]];
  FRONT.forEach(([o, w], k) => {
    const x = cx + o * R, top = rimY + R * (k === 2 ? 0.1 : -0.02);
    const d = `M${r1(x - w * R)},${r1(top)} C${r1(x - w * R * 1.05)},${r1(cy + R * 0.35)} ${r1(x - w * R * 0.4)},${r1(cy + R * 0.62)} ${r1(x)},${r1(cy + R * 0.64)} C${r1(x + w * R * 0.4)},${r1(cy + R * 0.62)} ${r1(x + w * R * 1.05)},${r1(cy + R * 0.35)} ${r1(x + w * R)},${r1(top)} Q${r1(x)},${r1(top + R * 0.16)} ${r1(x - w * R)},${r1(top)} Z`;
    out.push(`<path d="${d}" fill="${P.base}"/><path d="${d}" fill="url(#${id}g)" filter="url(#wc)"/>`);
    // the rolled lip along the top edge
    out.push(`<path d="M${r1(x - w * R)},${r1(top)} Q${r1(x)},${r1(top + R * 0.16)} ${r1(x + w * R)},${r1(top)}" fill="none" stroke="${P.light}" stroke-width="4" stroke-opacity="0.75"/>`);
    out.push(`<path d="M${r1(x)},${r1(top + R * 0.2)} Q${r1(x + o * 12)},${r1(cy + R * 0.3)} ${r1(x)},${r1(cy + R * 0.58)}" fill="none" stroke="${P.shade}" stroke-width="1" stroke-opacity="0.35"/>`);
    ink(d);
  });
  // the sepals under the bloom
  for (const [dx, a] of [[-R * 0.3, 2.3], [0, 1.57], [R * 0.3, 0.84]]) {
    const x = cx + dx, y = cy + R * 0.58;
    out.push(`<path d="M${r1(x - 8)},${r1(y)} Q${r1(x + Math.cos(a) * 20)},${r1(y + Math.sin(a) * 26 - 4)} ${r1(x + Math.cos(a) * 30)},${r1(y + Math.sin(a) * 30)} Q${r1(x + Math.cos(a) * 10 + 6)},${r1(y + Math.sin(a) * 12)} ${r1(x + 8)},${r1(y)} Z" fill="#5e8a44" stroke="${INK}" stroke-width="1.1"/>`);
  }
}

// a rose leaf: five toothed leaflets on one stalk
function roseLeaf(out, defs, id, x, y, a, s, rand) {
  const rach = [[x, y], [x + Math.cos(a) * 70 * s, y + Math.sin(a) * 70 * s]];
  out.push(`<path d="M${r1(x)},${r1(y)} L${r1(rach[1][0])},${r1(rach[1][1])}" stroke="${INK}" stroke-width="3.4"/><path d="M${r1(x)},${r1(y)} L${r1(rach[1][0])},${r1(rach[1][1])}" stroke="#6a8a44" stroke-width="2"/>`);
  const LEAFLETS = [[0.35, -1], [0.35, 1], [0.7, -1], [0.7, 1], [1, 0]];
  LEAFLETS.forEach(([u, side], i) => {
    const bx = x + Math.cos(a) * 70 * s * u, by = y + Math.sin(a) * 70 * s * u;
    const la = a + side * 0.9;
    const L = (side ? 38 : 46) * s;
    const b = blade([[bx, by], [bx + Math.cos(la) * L * 0.5, by + Math.sin(la) * L * 0.5], [bx + Math.cos(la) * L, by + Math.sin(la) * L]], {
      width: (v) => 13 * s * Math.pow(Math.sin(Math.PI * Math.min(1, 0.06 + v * 0.94)), 0.7), lobes: 7, depth: 0.14, start: 0.15, sideVeins: 3, rand,
    });
    paintBlade(b, { id: `${id}${i}`, palette: LEAF, defs, out, margin: 2, ink: 1.1, veinOpacity: 0.3 });
  });
}

export function draw() {
  const rand = mulberry32(315);
  const defs = standardDefs(315);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the two stems, crossing at the foot, thorned
  const stems = [
    { d: `M350,758 C340,680 290,620 244,546`, pts: [[346, 720], [322, 648], [292, 586]] },
    { d: `M290,758 C300,680 360,620 414,538`, pts: [[296, 716], [322, 652], [358, 590]] },
  ];
  for (const { d, pts } of stems) {
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#6a8a44" stroke-width="6.4" stroke-linecap="round"/>`);
    pts.forEach(([x, y], i) => {
      const s = i % 2 ? 1 : -1;
      out.push(`<path d="M${x},${y - 5} L${x + s * 12},${y + 2} L${x},${y + 5} Z" fill="#8a5a36" stroke="${INK}" stroke-width="0.9"/>`);
    });
  }
  roseLeaf(out, defs, "la", 318, 660, Math.PI + 0.5, 1, rand);
  roseLeaf(out, defs, "lb", 326, 612, -0.45, 1, rand);

  rose(out, defs, "r", 232, 494, 100, RED, rand);
  rose(out, defs, "b", 424, 484, 96, BLUE, rand);

  // ── fig. 2: one hydrangea, two soils ──────────────────────────────────────
  const pot = (x, P) => {
    const y = 768;
    out.push(`<path d="M${x - 34},${y - 60} L${x + 34},${y - 60} L${x + 26},${y} L${x - 26},${y} Z" fill="#c07a52" stroke="${INK}" stroke-width="1.4"/>`);
    out.push(`<rect x="${x - 38}" y="${y - 70}" width="76" height="12" rx="2" fill="#b06a44" stroke="${INK}" stroke-width="1.2"/>`);
    out.push(`<path d="M${x},${y - 70} L${x},${y - 104}" stroke="${INK}" stroke-width="4"/><path d="M${x},${y - 70} L${x},${y - 104}" stroke="#6a8a44" stroke-width="2.4"/>`);
    // the mophead: a dome of small four-petalled florets
    const fl = [];
    for (let k = 0; k < 34; k++) {
      const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 40;
      const fx = x + Math.cos(a) * r, fy = y - 132 + Math.sin(a) * r * 0.78;
      for (let q = 0; q < 4; q++) {
        const qa = (q / 4) * Math.PI * 2 + a;
        fl.push(`<ellipse cx="${r1(fx + Math.cos(qa) * 4)}" cy="${r1(fy + Math.sin(qa) * 4)}" rx="4" ry="3" fill="${rand() < 0.5 ? P.base : P.light}" stroke="${INK}" stroke-width="0.4"/>`);
      }
    }
    out.push(fl.join(""));
  };
  pot(636, { base: "#6a90d8", light: "#a8c4ee" });
  pot(740, { base: "#e08aa8", light: "#f4bccc" });
  contact(out, 688, 770, 110, 6, 0.2);

  return { size: SIZE, view: [0, 330, SIZE, 460], defs: defs.join("\n"), body: out.join("\n") };
}
