// NO. 0493 (Grass) — an ear of maize, and the wild grass it came from.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the ear. A great ear of maize, its green husk leaves peeled
//      back and spread out round its foot like a ring of blades, the cob in the
//      middle packed with golden kernels in straight rows, and a tuft of silk
//      at its tip. The field note files the specimen with a single-gene switch
//      that changes a whole plant: this is the plant it changed. The gold held
//      in a ring of green.
//   2. There is no record for this form.
//   3. The note's point is that whole-organism switches are usually fictional
//      and occasionally not. Teosinte, the wild grass maize came from, is a
//      many-branched plant with a few kernels each sealed in a stony case —
//      and much of the difference between it and a maize plant sits in a
//      handful of genes, teosinte branched1 above all. Fig. 2: a teosinte
//      spike, a finger's length of hard-cased kernels, beside a kernel of
//      maize.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "arceus-grass";
export const no = 493;
const SIZE = 800;
const HUSK = { light: "#d8f0b0", base: "#7ab858", deep: "#4a8a3a", shade: "#285a22", edge: "#285a22" };

export function draw() {
  const rand = mulberry32(493);
  const defs = standardDefs(493);
  const out = [];
  contact(out, 320, 758, 240, 16);

  // the husk leaves peeled back round its foot, spread like a ring of blades
  for (const [a, L] of [[Math.PI + 0.25, 210], [-0.25, 210], [Math.PI + 0.7, 170], [-0.7, 170], [Math.PI - 0.2, 180], [0.2, 180]]) {
    const pts = [[320, 700], [320 + Math.cos(a) * L * 0.4, 700 + Math.sin(a) * L * 0.2 - 20], [320 + Math.cos(a) * L, 700 + Math.sin(a) * L * 0.2 + 20]];
    const b = blade(pts, { width: (u) => 34 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.9), 0.7), sideVeins: 0, rand });
    paintBlade(b, { id: `h${r1(a * 10)}`, palette: HUSK, defs, out, shade: Math.sin(a) < 0 ? 0.15 : 0, margin: 4, veinOpacity: 0.5 });
  }
  // the cob: rows of golden kernels, tapering to the tip
  const top = 380, foot = 710, W = 66;
  const w = (y) => W * Math.sin(Math.PI * Math.min(1, ((foot - y) / (foot - top)) * 0.9 + 0.1)) ** 0.5;
  const cob = [];
  for (let y = foot; y >= top; y -= 10) cob.push([320 - w(y), y]);
  const cd = `M${cob.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} ` + [...cob].reverse().map(([x, y]) => `L${r1(640 - x)},${r1(y)}`).join(" ") + " Z";
  out.push(`<path d="${cd}" fill="#e8b830" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  defs.push(`<clipPath id="cc"><path d="${cd}"/></clipPath>`);
  const k = [];
  for (let y = foot - 6; y > top + 6; y -= 13) {
    const ww = w(y);
    for (let c = -5; c <= 5; c++) {
      const x = 320 + (c / 5.5) * ww, sq = Math.cos((c / 5.5) * Math.PI / 2);
      k.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(6 * sq + 1)}" ry="6" fill="${["#f6d24a", "#e8b830", "#f2c63e"][(c + 12) % 3]}" stroke="#a8781e" stroke-width="0.8"/>`);
    }
  }
  out.push(`<g clip-path="url(#cc)">${k.join("")}</g>`);
  out.push(`<ellipse cx="290" cy="500" rx="10" ry="80" fill="#ffffff" fill-opacity="0.3" clip-path="url(#cc)"/>`);
  // the silk at its tip
  const silk = [];
  for (let j = 0; j < 14; j++) silk.push(`M320,${top + 6} q${r1((rand() - 0.5) * 40)},-30 ${r1((rand() - 0.5) * 70)},-60`);
  out.push(`<path d="${silk.join(" ")}" fill="none" stroke="#c8864a" stroke-width="1.4"/>`);

  // ── fig. 2: a teosinte spike, beside one kernel of maize ─────────────────
  const tx = 640;
  for (let j = 0; j < 8; j++) {
    const y = 760 - j * 16, x = tx + (j % 2 ? 4 : -4);
    out.push(`<path d="M${x - 8},${y} L${x - 6},${y - 15} L${x + 6},${y - 15} L${x + 8},${y} Z" fill="#6e6a5a" stroke="${INK}" stroke-width="1"/>`);
  }
  out.push(`<path d="M${tx},632 l0,-14" stroke="#8a8a6a" stroke-width="2"/>`);
  out.push(`<ellipse cx="740" cy="748" rx="12" ry="16" fill="#f2c63e" stroke="${INK}" stroke-width="1.3"/>`);
  contact(out, 690, 768, 90, 5, 0.18);

  return { size: SIZE, view: [0, 300, SIZE, 490], defs: defs.join("\n"), body: out.join("\n") };
}
