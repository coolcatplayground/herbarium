// NO. 0542 — leaves cut and tailored, and a seed that hires ants.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the tailoring. Leaves cut to shape: a broad leaf with a
//      clean, curved piece taken out of its edge — the neat cut a leafcutter
//      makes, one smooth arc and no ragged edge — and beside it, the pieces
//      that came out, some pointed like blades and some rounded, lying where
//      they fell. Two narrow leaves stand up from the node like a pair of
//      antennae, pale yellow-green.
//   2. The field note's record is a creature that sews leaves into clothes
//      and keeps its eggs warm with fermenting leaves.
//   3. The note's point is that seeds hire ants by imitating a dead insect.
//      Many woodland herbs attach an elaiosome to the seed — a pale, oily,
//      edible lump — and what makes an ant pick it up is oleic acid, the same
//      signal ants use to recognise their dead and carry them out. The ant
//      takes the seed home, eats the lump, and discards the seed in the
//      midden. Fig. 2: a seed with its elaiosome, and an ant carrying one.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "leavanny";
export const no = 542;
const SIZE = 800;
const LEAF = { light: "#c4e4a0", base: "#62a852", deep: "#3a7a3a", shade: "#1e4e22", edge: "#1e4e22" };
const PALE = { light: "#f4f4b8", base: "#d8e088", deep: "#a8b058", shade: "#6a7030", edge: "#6a7030" };

export function draw() {
  const rand = mulberry32(542);
  const defs = standardDefs(542);
  const out = [];
  contact(out, 330, 758, 230, 14);

  // the stem, and the two narrow pale leaves standing up from the node
  out.push(`<path d="M310,760 C312,700 316,640 320,590" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M310,760 C312,700 316,640 320,590" fill="none" stroke="#6a9a4a" stroke-width="7" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[320, 594], [320 + s * 20, 520], [320 + s * 44, 440], [320 + s * 58, 400]], { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.7), sideVeins: 2, rand });
    paintBlade(b, { id: `a${s}`, palette: PALE, defs, out, margin: 3 });
  }
  // the broad leaf, with a clean arc cut out of its edge
  const lf = blade([[318, 640], [260, 600], [180, 590], [110, 620]], { width: (u) => 64 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.9), 0.66), sideVeins: 7, rand });
  const leafFrom = out.length;
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, margin: 7 });
  const n = lf.left.length - 1;
  const [cx0, cy0] = lf.left[Math.round(0.55 * n)];
  defs.push(`<mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#fff"/><circle cx="${r1(cx0)}" cy="${r1(cy0 - 18)}" r="42" fill="#000"/></mask>`);
  out.push(`<g mask="url(#cut)">${out.splice(leafFrom).join("")}</g>`);
  defs.push(`<clipPath id="lc"><path d="${lf.d}"/></clipPath>`);
  out.push(`<circle cx="${r1(cx0)}" cy="${r1(cy0 - 18)}" r="42" fill="none" stroke="${INK}" stroke-width="1.6" clip-path="url(#lc)"/>`);
  // a second leaf on the other side, cut in a long curve
  const lf2 = blade([[322, 660], [390, 630], [470, 640], [540, 676]], { width: (u) => 54 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.9), 0.66), sideVeins: 6, rand });
  const l2From = out.length;
  paintBlade(lf2, { id: "lf2", palette: LEAF, defs, out, shade: 0.15, margin: 6 });
  const m = lf2.right.length - 1;
  const [dx0, dy0] = lf2.right[Math.round(0.6 * m)];
  defs.push(`<mask id="cut2" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#fff"/><ellipse cx="${r1(dx0)}" cy="${r1(dy0 + 26)}" rx="60" ry="34" fill="#000"/></mask>`);
  out.push(`<g mask="url(#cut2)">${out.splice(l2From).join("")}</g>`);
  // the pieces that came out, lying below: blades and rounds
  for (const [x, y, a, pointed] of [[180, 740, -0.3, true], [250, 752, 0.2, false], [420, 746, -0.1, true], [490, 752, 0.3, false]]) {
    const d = pointed
      ? `M${x - 40},${y} Q${x},${y - 22} ${x + 40},${y} Q${x},${y + 8} ${x - 40},${y} Z`
      : `M${x - 30},${y} A30,14 0 1,1 ${x + 30},${y} Q${x},${y + 6} ${x - 30},${y} Z`;
    out.push(`<path d="${d}" transform="rotate(${r1((a * 180) / Math.PI)} ${x} ${y})" fill="${LEAF.base}" stroke="${INK}" stroke-width="1.3"/>`);
  }

  // ── fig. 2: a seed with its elaiosome, and an ant carrying one ────────────
  const figFrom = out.length;
  const sx = 640, sy = 720;
  out.push(`<ellipse cx="${sx}" cy="${sy}" rx="20" ry="13" fill="#5a3e24" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${sx - 6}" cy="${sy - 4}" rx="6" ry="3" fill="#8a6a44"/>`);
  out.push(`<ellipse cx="${sx + 22}" cy="${sy - 4}" rx="11" ry="9" fill="#f8f0d4" stroke="${INK}" stroke-width="1.1"/>`);
  // the ant, walking right, the seed held in its jaws by the lump
  const ax = 724, ay = 730;
  out.push(`<ellipse cx="${ax + 16}" cy="${ay}" rx="13" ry="9" fill="#3a2418"/><ellipse cx="${ax}" cy="${ay - 2}" rx="7" ry="6" fill="#3a2418"/><ellipse cx="${ax - 12}" cy="${ay - 4}" rx="7" ry="6" fill="#3a2418"/>`);
  const legs = [];
  for (const dx of [-4, 2, 8]) for (const s of [-1, 1]) legs.push(`M${ax + dx},${ay} l${s * 6 - 2},${10 + (s > 0 ? 2 : 0)}`);
  out.push(`<path d="${legs.join(" ")}" stroke="#3a2418" stroke-width="1.4"/>`);
  out.push(`<ellipse cx="${ax - 30}" cy="${ay - 8}" rx="11" ry="7" fill="#5a3e24" stroke="${INK}" stroke-width="1"/><ellipse cx="${ax - 20}" cy="${ay - 8}" rx="6" ry="5" fill="#f8f0d4" stroke="${INK}" stroke-width="0.8"/>`);
  out.push(`<path d="M${ax - 16},${ay - 8} l-4,-10 M${ax - 14},${ay - 8} l4,-12" stroke="#3a2418" stroke-width="1"/>`);
  out.push(`<g transform="translate(700 744) scale(1.4) translate(-690 -744)">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, 690, 750, 130, 5, 0.18);

  return { size: SIZE, view: [0, 360, SIZE, 430], defs: defs.join("\n"), body: out.join("\n") };
}
