// NO. 0275 — a fan leaf, and what it does in a gale.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the fan. A single great leaf, palmately lobed — seven lobes
//      from one point, spread like the ribs of a fan, glossy dark green with
//      pale midribs, the margins finely toothed — on a long stalk. It is the
//      leaf of Fatsia japonica, yatsude, the eight-fingered leaf that in
//      Japanese folklore is the tengu's fan.
//   2. The lobes are broad and smooth-edged and joined by a web for a third
//      of their length: drawn as seven free, toothed leaflets, the fan read as
//      a very different plant. The stalk stands on its broad clasping foot.
//   3. The field note's point is that a leaf's answer to wind is to stop
//      being a fan. Broad leaves reconfigure as the air speeds up — curling
//      back, rolling up, gathering into a streamlined bundle — so drag climbs
//      far more slowly than a flat plate's would, which is the only reason a
//      tree keeps its foliage in a gale. Fig. 2 is the same leaf in a strong
//      wind: the lobes swept together downwind into one narrow bundle.
import { mulberry32, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "shiftry";
export const no = 275;
const SIZE = 800;
const FAN = { light: "#b0d894", base: "#4f9a48", deep: "#2f6a34", shade: "#1c4422", edge: "#1c4422" };
const WOOD = { base: "#8a6a44", light: "#b89a6c" };

// a lobe of the fan, from the hub out
function lobe(hub, a, L, W, rand) {
  const pts = [];
  for (let j = 0; j <= 4; j++) {
    const u = j / 4;
    pts.push([hub[0] + Math.cos(a) * L * u, hub[1] + Math.sin(a) * L * u + 18 * u * u]);
  }
  return blade(pts, {
    width: (u) => W * Math.pow(Math.sin(Math.PI * Math.min(1, 0.02 + u * 0.98) ** 0.62), 0.7),
    lobes: 5, depth: 0.05, start: 0.45, teeth: "round", sideVeins: 5, rand,
  });
}

export function draw() {
  const rand = mulberry32(275);
  const defs = standardDefs(275);
  const out = [];
  contact(out, 340, 758, 200, 14);

  // the stalk, from its broad clasping foot, up to the fan
  out.push(`<path d="M268,760 C276,736 292,728 300,716 C308,728 324,736 332,760 Z" fill="${WOOD.base}" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
  const hub = [340, 440];
  const stalk = `M300,746 C306,660 330,540 ${hub[0]},${hub[1] + 10}`;
  out.push(`<path d="${stalk}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="${stalk}" fill="none" stroke="#7fa65e" stroke-width="8" stroke-linecap="round"/><path d="${stalk}" fill="none" stroke="#b9d69a" stroke-width="2.4" transform="translate(-2 0)"/>`);

  // the web that joins the lobes for the inner third of their length
  const web = [];
  for (let j = 0; j <= 24; j++) {
    const a = -Math.PI - 0.12 + (j / 24) * (Math.PI + 0.24);
    web.push([hub[0] + Math.cos(a) * 92, hub[1] + Math.sin(a) * 92 + 8]);
  }
  const wd = smooth([hub, ...web], true);
  // the fan: seven lobes, the outer ones first so the middle lies over them
  const LOBES = [-3.02, -0.12, -2.56, -0.58, -2.1, -1.04, -1.57];
  LOBES.forEach((a, i) => {
    const mid = 1 - Math.abs(a + Math.PI / 2) / 1.5;
    const b = lobe(hub, a, 160 + 110 * mid, 56 + 12 * mid, rand);
    paintBlade(b, { id: `lb${i}`, palette: FAN, defs, out, shade: mid < 0.3 ? 0.2 : 0, margin: 6, veinOpacity: 0.35 });
    if (i === 3) out.push(`<path d="${wd}" fill="${FAN.base}"/><path d="${wd}" fill="${FAN.deep}" fill-opacity="0.35" filter="url(#wc)"/>`);
  });
  // where the lobes meet the stalk
  out.push(`<ellipse cx="${hub[0]}" cy="${hub[1] + 4}" rx="16" ry="12" fill="${FAN.deep}" stroke="${INK}" stroke-width="1.4"/>`);

  // ── fig. 2: the same leaf in a gale ───────────────────────────────────────
  const fx = 580, fy = 650;
  const figFrom = out.length;
  // the wind, coming from the left
  for (const [y, x0, len] of [[fy - 40, fx - 70, 60], [fy - 8, fx - 84, 70], [fy + 24, fx - 72, 56]]) {
    out.push(`<path d="M${x0},${y} l${len},0" stroke="${INK}" stroke-width="1.2" stroke-dasharray="6 4"/><path d="M${x0 + len - 6},${y - 4} l6,4 l-6,4" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  }
  // the stalk bent over, and the lobes swept together downwind
  out.push(`<path d="M${fx + 10},770 C${fx + 16},720 ${fx + 30},680 ${fx + 44},${fy}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${fx + 10},770 C${fx + 16},720 ${fx + 30},680 ${fx + 44},${fy}" fill="none" stroke="#7fa65e" stroke-width="4" stroke-linecap="round"/>`);
  const h2 = [fx + 44, fy];
  [-0.3, 0.3, -0.18, 0.18, -0.06, 0.06, 0].forEach((da, i) => {
    const a = da * 0.9;
    const pts = [h2, [h2[0] + Math.cos(a) * 50, h2[1] + Math.sin(a) * 50 + 4], [h2[0] + Math.cos(a) * 100, h2[1] + Math.sin(a) * 76 + 10]];
    const b = blade(pts, { width: (u) => 15 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.7), 0.75), rand });
    paintBlade(b, { id: `g${i}`, palette: FAN, defs, out, shade: Math.abs(da) > 0.2 ? 0.3 : 0, margin: 2, ink: 1.2, veinOpacity: 0.2 });
  });
  out.push(`<g transform="translate(${fx + 10} 770) scale(1.1) translate(${-(fx + 10)} -770)">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, fx + 30, 770, 70, 6, 0.2);

  return { size: SIZE, view: [0, 176, SIZE, 614], defs: defs.join("\n"), body: out.join("\n") };
}
