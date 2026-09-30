// NO. 0723 — a leaf curled into a hood, and teeth that read the climate.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the hood. One broad green leaf curled over on itself from the
//      tip, the blade arching up and rolling forward so its tip hangs down in
//      front like the brim of a hood — the green leaf the specimen wears over
//      its head. Its margin is finely toothed all round, and on the same
//      twig a small second leaf stands up behind it.
//   2. The field note's record is a groomer whose preening keeps its blade
//      quills sharp.
//   3. The note's point is that leaf teeth are a thermometer, in aggregate:
//      across the world's floras, the share of woody species with smooth-
//      edged leaves climbs steadily with mean annual temperature, and toothed
//      leaves dominate where it is cool — steadily enough that palaeobotanists
//      read the climate of a fossil flora from its leaves. Fig. 2: a smooth
//      leaf by a warm thermometer, a toothed one by a cold one.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "dartrix";
export const no = 723;
const SIZE = 800;
const LEAF = { light: "#c8eaa0", base: "#72b454", deep: "#488a3a", shade: "#285a22", edge: "#285a22" };

export function draw() {
  const rand = mulberry32(723);
  const defs = standardDefs(723);
  const out = [];
  contact(out, 320, 758, 200, 14);

  // the twig
  out.push(`<path d="M230,758 C250,720 270,690 290,660" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M230,758 C250,720 270,690 290,660" fill="none" stroke="#7a5a3a" stroke-width="7" stroke-linecap="round"/>`);
  // a small second leaf standing up behind
  const sm = blade([[284, 670], [270, 610], [262, 550]], { width: (u) => 24 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.85), 0.7), lobes: 10, depth: 0.12, start: 0.15, sideVeins: 3, rand });
  paintBlade(sm, { id: "sm", palette: LEAF, defs, out, shade: 0.2, margin: 3 });
  // the hood: rising from the twig, arching up and over, rolling forward so
  // the tip hangs down in front
  const hood = blade([[290, 662], [330, 560], [400, 480], [480, 470], [530, 520], [530, 600], [500, 650]], {
    width: (u) => 70 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.02 + u * 0.98) ** 0.8), 0.62), lobes: 30, depth: 0.08, start: 0.08, sideVeins: 9, rand,
  });
  paintBlade(hood, { id: "hd", palette: LEAF, defs, out, margin: 8 });
  // the underside showing where the blade rolls over, paler
  const n = hood.right.length - 1;
  const roll = hood.right.slice(Math.round(0.55 * n), Math.round(0.9 * n));
  out.push(`<path d="M${roll.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")}" fill="none" stroke="${LEAF.light}" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round"/>`);

  // ── fig. 2: a smooth leaf where it is warm, a toothed one where it is cold ──
  const therm = (x, level, col) => {
    out.push(`<rect x="${x - 6}" y="600" width="12" height="120" rx="6" fill="#fbfaf2" stroke="${INK}" stroke-width="1.2"/><circle cx="${x}" cy="726" r="11" fill="${col}" stroke="${INK}" stroke-width="1.2"/><rect x="${x - 3}" y="${720 - level}" width="6" height="${level}" fill="${col}"/>`);
  };
  therm(600, 100, "#d8434e");
  const warm = blade([[632, 766], [636, 700], [632, 630]], { width: (u) => 26 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), sideVeins: 4, rand });
  paintBlade(warm, { id: "wm", palette: { light: "#b8dca0", base: "#3e8a44", deep: "#23603a", shade: "#143e22", edge: "#143e22" }, defs, out, margin: 3 });
  therm(704, 30, "#5a8ed4");
  const cold = blade([[740, 766], [744, 700], [740, 630]], { width: (u) => 26 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), lobes: 12, depth: 0.25, start: 0.1, sideVeins: 4, rand });
  paintBlade(cold, { id: "cd", palette: LEAF, defs, out, margin: 3 });
  contact(out, 680, 768, 110, 5, 0.18);

  return { size: SIZE, view: [0, 370, SIZE, 420], defs: defs.join("\n"), body: out.join("\n") };
}
