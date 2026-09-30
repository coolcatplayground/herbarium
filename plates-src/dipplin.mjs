// NO. 1011 — a glazed apple, and an apple forbidden to ripen.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the candied apple. A red apple dipped in hard syrup — the
//      glaze glossy, darker red, running down its sides in thick drips and
//      pooling round its foot — its short stalk and two small pale leaves
//      standing clear of the coat at the top. The glazed red apple the
//      specimen is.
//   2. The field note's record is two creatures in one fruit, and an apple
//      grown in only one place.
//   3. The note's point is that the apple in a shop in June was picked the
//      previous autumn and has been chemically forbidden to ripen. A gas,
//      1-methylcyclopropene, binds the fruit's ethylene receptors and does not
//      let go, so it cannot hear its own ripening signal. Fig. 2: two apples
//      after the same months in store — the untreated one soft and wrinkled,
//      the treated one as firm as the day it was picked.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "dipplin";
export const no = 1011;
const SIZE = 800;
const LEAF = { light: "#f4f8c8", base: "#d8e088", deep: "#a8b058", shade: "#6a7030", edge: "#6a7030" };

export function draw() {
  const rand = mulberry32(1011);
  const defs = standardDefs(1011);
  const out = [];
  contact(out, 320, 758, 200, 16);

  const cx = 320, cy = 600, R = 150;
  // the pool of glaze round its foot
  out.push(`<path d="M150,756 C160,736 220,730 320,730 C420,730 480,736 490,756 C440,766 200,766 150,756 Z" fill="#c8242e" stroke="${INK}" stroke-width="1.6"/>`);
  // the apple under its coat, and the glaze with drips
  const apple = `M${cx},${cy - R * 0.78} C${cx + R * 0.3},${cy - R * 1.02} ${cx + R * 1.08},${cy - R * 0.9} ${cx + R},${cy - R * 0.1} C${cx + R * 0.96},${cy + R * 0.66} ${cx + R * 0.5},${cy + R * 0.96} ${cx},${cy + R * 0.94} C${cx - R * 0.5},${cy + R * 0.96} ${cx - R * 0.96},${cy + R * 0.66} ${cx - R},${cy - R * 0.1} C${cx - R * 1.08},${cy - R * 0.9} ${cx - R * 0.3},${cy - R * 1.02} ${cx},${cy - R * 0.78} Z`;
  defs.push(`<radialGradient id="gl" cx="0.36" cy="0.28" r="0.85"><stop offset="0" stop-color="#f28a7a"/><stop offset="0.35" stop-color="#d8242e"/><stop offset="1" stop-color="#6e0e14"/></radialGradient>`);
  out.push(`<path d="${apple}" fill="url(#gl)" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  // drips running down the lower sides
  for (const [x, L] of [[200, 60], [248, 90], [300, 50], [360, 80], [420, 64]]) {
    const y0 = cy + R * 0.5 + Math.abs(x - cx) * -0.2;
    out.push(`<path d="M${x - 12},${r1(y0)} C${x - 12},${r1(y0 + L * 0.6)} ${x - 8},${r1(y0 + L)} ${x},${r1(y0 + L)} C${x + 8},${r1(y0 + L)} ${x + 12},${r1(y0 + L * 0.6)} ${x + 12},${r1(y0)} Z" fill="#b81e28" stroke="${INK}" stroke-width="1.4"/>`);
    out.push(`<ellipse cx="${x - 4}" cy="${r1(y0 + L * 0.6)}" rx="3" ry="8" fill="#ffffff" fill-opacity="0.5"/>`);
  }
  // the glossy highlights of the glaze
  out.push(`<ellipse cx="${cx - 60}" cy="${cy - 70}" rx="38" ry="22" transform="rotate(-30 ${cx - 60} ${cy - 70})" fill="#ffffff" fill-opacity="0.6" filter="url(#sheen)"/><ellipse cx="${cx + 70}" cy="${cy - 40}" rx="10" ry="18" fill="#ffffff" fill-opacity="0.4"/>`);
  // stalk and two small pale leaves clear of the coat
  out.push(`<path d="M${cx},${cy - R * 0.76} l6,-34" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${cx},${cy - R * 0.76} l6,-34" stroke="#7a5a3a" stroke-width="4" stroke-linecap="round"/>`);
  for (const s of [-1, 1]) {
    const b = blade([[cx + 6, cy - R * 0.76 - 30], [cx + 6 + s * 30, cy - R * 0.76 - 60], [cx + 6 + s * 44, cy - R * 0.76 - 104]], { width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.62), sideVeins: 3, rand });
    paintBlade(b, { id: `l${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 3 });
  }

  // ── fig. 2: after months in store — untreated and treated ─────────────────
  defs.push(`<radialGradient id="ap2" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="#f8b08a"/><stop offset="0.6" stop-color="#d8484a"/><stop offset="1" stop-color="#8a1e24"/></radialGradient>`);
  // the untreated one: shrunk, soft, wrinkled lengthwise from stalk to base
  out.push(`<path d="M630,760 C600,760 594,734 600,716 C606,700 620,700 630,704 C640,700 656,700 662,716 C668,734 662,760 630,760 Z" fill="#b8784a" stroke="${INK}" stroke-width="1.4"/>`);
  for (const dx of [-18, -8, 4, 14]) out.push(`<path d="M${630 + dx * 0.5},708 C${630 + dx * 1.1},724 ${630 + dx * 1.2},744 ${630 + dx * 0.8},758" fill="none" stroke="#6e3e24" stroke-width="1.1" stroke-opacity="0.7"/>`);
  out.push(`<path d="M630,704 l2,-10" stroke="${INK}" stroke-width="2.4"/>`);
  out.push(`<circle cx="740" cy="728" r="34" fill="url(#ap2)" stroke="${INK}" stroke-width="1.5"/><path d="M740,694 l3,-10" stroke="${INK}" stroke-width="2.4"/>`);
  contact(out, 690, 764, 110, 5, 0.18);

  return { size: SIZE, view: [0, 350, SIZE, 440], defs: defs.join("\n"), body: out.join("\n") };
}
