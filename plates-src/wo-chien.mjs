// NO. 1001 — a heap of dead leaves over writing slips, and the walnut's reputation.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the heap. A mound of dead leaves — curled, brown, olive and
//      tan, lobed, piled thick like a cloak — and half-buried in it a bundle of
//      old wooden writing slips, the thin boards once bound with cord that
//      records were kept on before paper. The field note's record gives the
//      leaves and the tablets; that is what is drawn.
//   2. The record is a grudge: someone punished for writing a king's evil
//      deeds on wooden tablets, now clad in dead leaves, draining the life
//      from the vegetation round it.
//   3. The note's point is that allelopathy — one plant poisoning others with
//      what it releases — is easy to show in a dish and hard to prove in a
//      field. Black walnut makes juglone, and it is truly toxic to a tomato in
//      a pot; under a real tree, shade and roots competing may do as much.
//      Fig. 2: a walnut in its green husk, and a tomato seedling wilting
//      beside it.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "wo-chien";
export const no = 1001;
const SIZE = 800;
const DEAD = [
  { light: "#e2cc98", base: "#b8944a", deep: "#8a6a2e", shade: "#5a4418", edge: "#5a4418" },
  { light: "#c8c890", base: "#8a8a4a", deep: "#5e6030", shade: "#3a3a1a", edge: "#3a3a1a" },
  { light: "#d8b080", base: "#a8744a", deep: "#7a4e2a", shade: "#4e3018", edge: "#4e3018" },
];

export function draw() {
  const rand = mulberry32(1001);
  const defs = standardDefs(1001);
  const out = [];
  contact(out, 320, 758, 250, 16);

  // the bundle of wooden slips, half-buried, leaning, bound with cord
  const sx = 420, sy = 700;
  for (let k = 0; k < 7; k++) {
    const x = sx + k * 16;
    out.push(`<path d="M${x},${sy + 40} L${x + 30},${sy - 130} L${x + 44},${sy - 128} L${x + 14},${sy + 42} Z" fill="${k % 2 ? "#c8a878" : "#b8946a"}" stroke="${INK}" stroke-width="1.2"/>`);
    for (let q = 0; q < 4; q++) out.push(`<path d="M${x + 16 + q * 4},${sy - 90 + q * 30} l4,-2" stroke="#4e3a24" stroke-width="1.6"/>`);
  }
  for (const y of [sy - 90, sy - 20]) out.push(`<path d="M${sx + 10},${y + 4} L${sx + 150},${y - 8}" stroke="#8a4a2a" stroke-width="3"/>`);
  // the heap of dead leaves over a dark mound of older litter, lower first
  out.push(`<path d="M90,760 C100,660 200,590 300,586 C400,590 500,660 510,760 Z" fill="#5e4a2e" stroke="${INK}" stroke-width="1.6"/>`);
  for (let k = 0; k < 120; k++) {
    const v = k / 120;
    const u = rand() * 2 - 1;
    const top = 756 - 170 * Math.sqrt(Math.max(0, 1 - u * u));
    const x = 300 + u * 190, y = 756 - (756 - top) * (0.15 + 0.85 * v) + rand() * 10;
    const a = -Math.PI / 2 + u * 1.3 + (rand() - 0.5) * 1.2, L = 40 + rand() * 24;
    const pts = [[x, y], [x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 - 6], [x + Math.cos(a) * L, y + Math.sin(a) * L]];
    const b = blade(pts, { width: (w) => 18 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + w * 0.95) ** 0.8), 0.7), lobes: 4, depth: 0.4, start: 0.3, teeth: "round", sideVeins: 2, rand });
    paintBlade(b, { id: `d${k}`, palette: DEAD[k % 3], defs, out, shade: rand() * 0.3, margin: 2, ink: 1, veinOpacity: 0.4 });
  }

  // ── fig. 2: a walnut in its husk, and a tomato seedling wilting ───────────
  const figFrom = out.length;
  defs.push(`<radialGradient id="wn" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="#c8d888"/><stop offset="0.6" stop-color="#7a9a44"/><stop offset="1" stop-color="#4e6a2a"/></radialGradient>`);
  out.push(`<circle cx="630" cy="736" r="30" fill="url(#wn)" stroke="${INK}" stroke-width="1.4"/>`);
  for (let k = 0; k < 10; k++) out.push(`<circle cx="${r1(618 + rand() * 24)}" cy="${r1(722 + rand() * 28)}" r="1.4" fill="#e8f0c0"/>`);
  out.push(`<path d="M730,766 C730,730 736,712 752,700" fill="none" stroke="${INK}" stroke-width="4"/><path d="M730,766 C730,730 736,712 752,700" fill="none" stroke="#8aa45a" stroke-width="2.4"/>`);
  for (const [x, y, s] of [[750, 702, 1], [738, 724, -1]]) out.push(`<path d="M${x},${y} q${s * 14},8 ${s * 18},26 q${s * -8},-6 ${s * -18},-26 Z" fill="#a8b86a" stroke="${INK}" stroke-width="0.9"/>`);
  out.push(`<g transform="translate(672 766) scale(1.3) translate(-700 -766)">${out.splice(figFrom).join("")}</g>`);
  contact(out, 684, 768, 120, 5, 0.18);

  return { size: SIZE, view: [0, 440, SIZE, 350], defs: defs.join("\n"), body: out.join("\n") };
}
