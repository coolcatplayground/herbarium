// NO. 0460 (Mega) — a spruce bough cased in rime, and wood laid down slowly.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a bough of spruce after a freezing fog. Dark needled shoots,
//      and built out on every one of them to windward, rime ice — white,
//      feathered, jagged plates grown into the wind — until the bough is more
//      ice than needle, heavy and bent under it. The white spiked mass of the
//      Mega form.
//   2. The record is the ordinary form's: blizzards whipped up to hide in.
//   3. The note's point is the clearest mass-for-speed trade in the
//      collection, and real wood makes the same bargain. Dense timber resists
//      breakage, decay and the load of settled snow, but it is laid down
//      slowly: high-density species measurably grow slower. Fig. 2: two
//      cross-sections of one size, a fast-grown log in a few wide pale rings
//      and a slow one in many tight dark ones.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "abomasnow-mega";
export const no = 460;
const SIZE = 800;
const NEEDLE = ["#1e5446", "#2e6a58", "#3c7c68", "#285e50"];

export function draw() {
  const rand = mulberry32(4600);
  const defs = standardDefs(4600);
  const out = [];
  contact(out, 330, 758, 260, 16);

  const from = out.length;
  // the bough, bent under the weight, and its side shoots
  const main = `M90,700 C200,640 330,630 560,690`;
  out.push(`<path d="${main}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="${main}" fill="none" stroke="#5a4430" stroke-width="9" stroke-linecap="round"/>`);
  const shoots = [[160, 664, 130, 600], [250, 646, 240, 574], [340, 642, 360, 566], [430, 652, 470, 588], [510, 674, 560, 620]];
  for (const [x0, y0, x1, y1] of shoots) out.push(`<path d="M${x0},${y0} L${x1},${y1}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x0},${y0} L${x1},${y1}" stroke="#5a4430" stroke-width="4.6" stroke-linecap="round"/>`);
  const along = ([x0, y0, x1, y1], u) => [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u - (x0 === 90 ? Math.sin(Math.PI * u) * 50 : 0)];
  const all = [[90, 700, 560, 690], ...shoots];
  // needles all round the shoots
  const nd = [];
  for (const s of all) {
    for (let k = 0; k < 64; k++) {
      const [x, y] = along(s, rand()), a = rand() * Math.PI * 2;
      nd.push(`<path d="M${r1(x)},${r1(y)} l${r1(Math.cos(a) * 14)},${r1(Math.sin(a) * 14)}" stroke="${NEEDLE[k % 4]}" stroke-width="3" stroke-linecap="round"/>`);
    }
  }
  out.push(nd.join(""));
  // rime: white feathered plates grown out to windward (the left) on every shoot
  const rime = [];
  for (const s of all) {
    for (let k = 0; k < 16; k++) {
      const [x, y] = along(s, k / 15);
      const L = 24 + rand() * 26, a = Math.PI + (rand() - 0.5) * 0.8 - 0.3;
      const tipx = x + Math.cos(a) * L, tipy = y + Math.sin(a) * L;
      rime.push(`<path d="M${r1(x)},${r1(y - 7)} L${r1(tipx)},${r1(tipy)} L${r1(x)},${r1(y + 7)} Z" fill="#f4f8fa" stroke="#9ab0bc" stroke-width="0.8"/>`);
      rime.push(`<path d="M${r1(x + (tipx - x) * 0.3)},${r1(y + (tipy - y) * 0.3)} l${r1(-4 + rand() * 8)},${r1(-8)} M${r1(x + (tipx - x) * 0.6)},${r1(y + (tipy - y) * 0.6)} l${r1(-4 + rand() * 8)},${r1(8)}" stroke="#c8d8e0" stroke-width="1"/>`);
    }
  }
  out.push(rime.join(""));
  out.push(`<g transform="translate(340 758) scale(1.12) translate(-325 -740)">${out.splice(from).join("\n")}</g>`);

  // ── fig. 2: two logs of one size, wide pale rings and tight dark ones ─────
  const log = (x, rings, wood, line) => {
    out.push(`<path d="M${x - 36},766 L${x - 36},712 A36,13 0 0 1 ${x + 36},712 L${x + 36},766 A36,13 0 0 1 ${x - 36},766 Z" fill="#7a5a3a" stroke="${INK}" stroke-width="1.3"/>`);
    out.push(`<ellipse cx="${x}" cy="712" rx="36" ry="13" fill="${wood}" stroke="${INK}" stroke-width="1.3"/>`);
    for (let k = 1; k < rings; k++) out.push(`<ellipse cx="${x}" cy="712" rx="${r1(36 * k / rings)}" ry="${r1(13 * k / rings)}" fill="none" stroke="${line}" stroke-width="${rings > 8 ? 0.8 : 1.4}"/>`);
  };
  log(668, 4, "#f2e2b8", "#c8a878");
  log(752, 14, "#b8824e", "#6a4424");
  contact(out, 710, 770, 90, 5, 0.18);

  return { size: SIZE, view: [0, 480, SIZE, 310], defs: defs.join("\n"), body: out.join("\n") };
}
