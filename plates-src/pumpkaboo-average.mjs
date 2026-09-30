// NO. 0710 — a pumpkin, and how big one can be made to grow.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the pumpkin. Round, deeply ribbed, orange flushed with
//      brown at its shoulders, and on top a thick dark stalk that curls over
//      into a long twisting tendril — the curling dark top the specimen
//      carries — with one broad lobed pumpkin leaf beside it.
//   2. The field note's record is a pumpkin body that carries spirits where
//      they belong — the lantern tradition, which is about the carving, not
//      the plant.
//   3. The note's point is that size in this genus is not subtle. Show
//      pumpkins pass a tonne and put on more than twenty kilograms on a good
//      day, and nearly every one descends from a single bred line, Atlantic
//      Giant. The limit is structural: past a point the fruit cannot hold its
//      own shape, and it slumps. Fig. 2: an ordinary pumpkin beside a giant
//      one, slumped under its own weight, with a metre bar.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "pumpkaboo-average";
export const no = 710;
const SIZE = 800;
const LEAF = { light: "#c4e0a0", base: "#5e9a4a", deep: "#3a6e34", shade: "#1e4420", edge: "#1e4420" };

function pumpkin(out, defs, id, cx, g, W, H, slump) {
  defs.push(`<radialGradient id="${id}" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#fbb070"/><stop offset="0.55" stop-color="#e67a3a"/><stop offset="1" stop-color="#a8481e"/></radialGradient>`);
  // the ribs: overlapping lobes, the outer ones first
  const N = 7;
  for (let k of [0, 6, 1, 5, 2, 4, 3]) {
    const u = (k / (N - 1)) * 2 - 1;
    const x = cx + u * W * 0.72;
    const w = W * (0.34 - Math.abs(u) * 0.08);
    const h = H * (1 - Math.abs(u) * 0.12) * (1 - slump * 0.2);
    const d = `M${r1(x)},${r1(g - h * 0.02)} C${r1(x - w * 1.1)},${r1(g - h * 0.1)} ${r1(x - w * 1.1)},${r1(g - h * 0.95)} ${r1(x)},${r1(g - h)} C${r1(x + w * 1.1)},${r1(g - h * 0.95)} ${r1(x + w * 1.1)},${r1(g - h * 0.1)} ${r1(x)},${r1(g - h * 0.02)} Z`;
    out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="1.6"/>`);
  }
  // brown flush at the shoulders
  out.push(`<ellipse cx="${cx}" cy="${r1(g - H * 0.9 * (1 - slump * 0.2))}" rx="${r1(W * 0.5)}" ry="${r1(H * 0.12)}" fill="#6e4a2e" fill-opacity="0.45"/>`);
  return [cx, g - H * (1 - slump * 0.2)];
}

export function draw() {
  const rand = mulberry32(710);
  const defs = standardDefs(710);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the leaf beside it, behind
  const lf = blade([[420, 700], [480, 640], [540, 610], [590, 620]], { width: (u) => 60 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.8), 0.6), lobes: 5, depth: 0.4, start: 0.15, teeth: "round", sideVeins: 5, rand });
  paintBlade(lf, { id: "lf", palette: LEAF, defs, out, shade: 0.1, margin: 6 });
  const [tx, ty] = pumpkin(out, defs, "pk", 300, 756, 200, 250, 0);
  // the stalk: thick, dark, curling over into a twisting tendril
  const st = `M${tx - 10},${ty + 14} C${tx - 14},${ty - 30} ${tx + 10},${ty - 70} ${tx + 50},${ty - 90} C${tx + 90},${ty - 110} ${tx + 110},${ty - 70} ${tx + 90},${ty - 50} C${tx + 76},${ty - 38} ${tx + 64},${ty - 56} ${tx + 74},${ty - 64}`;
  out.push(`<path d="${st}" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="${st}" fill="none" stroke="#4e3a2a" stroke-width="22" stroke-linecap="round"/><path d="${st}" fill="none" stroke="#7a6048" stroke-width="5" stroke-linecap="round" transform="translate(-3 -2)"/>`);

  // ── fig. 2: an ordinary pumpkin, and a giant slumped under its weight ─────
  const figFrom = out.length;
  pumpkin(out, defs, "sm", 588, 766, 30, 34, 0);
  pumpkin(out, defs, "gt", 686, 766, 84, 96, 1);
  // a one-metre bar beside them
  out.push(`<path d="M776,766 L776,656 M770,766 L782,766 M770,656 L782,656" stroke="${INK}" stroke-width="1.4"/>`);
  void figFrom;
  contact(out, 676, 768, 110, 5, 0.18);

  return { size: SIZE, view: [0, 380, SIZE, 410], defs: defs.join("\n"), body: out.join("\n") };
}
