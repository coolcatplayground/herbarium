// NO. 0753 — a pink bud in its leaves, and a vine that copies its host.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the bud. A pink flower bud, plump, standing on a short stem,
//      clasped at its foot by two broad pale-green leaves that curl up round
//      it, and capped by a cluster of rounded blue-green bracts folded over
//      its top — the green hood over the pink the specimen is.
//   2. The field note's record is a plant that sleeps in the light by day
//      and moves at night to somewhere safer — relocation, done slowly.
//   3. The note's point is the best and least explained case of a plant
//      disguising itself as another. Boquila, a Chilean vine, imitates the
//      foliage of whatever it climbs — leaf size, shape, colour, the length of
//      the stalk — and one vine crossing from host to host changes its leaves
//      as it goes. Fig. 2: a Boquila stem climbing across two hosts, its
//      leaves long and narrow against the one, round against the other.
import { mulberry32, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "fomantis";
export const no = 753;
const SIZE = 800;
const LEAF = { light: "#d8f0c0", base: "#8cc86e", deep: "#5a9a4a", shade: "#2e6026", edge: "#2e6026" };
const BRACT = { light: "#b8e4cc", base: "#5eb08e", deep: "#3a846a", shade: "#1e5240", edge: "#1e5240" };

export function draw() {
  const rand = mulberry32(753);
  const defs = standardDefs(753);
  const out = [];
  contact(out, 320, 758, 180, 14);

  out.push(`<path d="M320,760 L320,700" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M320,760 L320,700" stroke="#6a9a4a" stroke-width="9" stroke-linecap="round"/>`);
  // the bud: plump, pink
  defs.push(`<radialGradient id="bd" cx="0.38" cy="0.35" r="0.8"><stop offset="0" stop-color="#fce4ea"/><stop offset="0.55" stop-color="#f0a0b4"/><stop offset="1" stop-color="#c8607c"/></radialGradient>`);
  out.push(`<path d="M320,712 C250,706 230,620 250,560 C266,510 374,510 390,560 C410,620 390,706 320,712 Z" fill="url(#bd)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  for (const dx of [-30, 0, 30]) out.push(`<path d="M${320 + dx * 0.7},700 C${320 + dx * 1.3},650 ${320 + dx * 1.3},590 ${320 + dx},540" fill="none" stroke="#c8607c" stroke-width="1.4" stroke-opacity="0.5"/>`);
  // the two broad leaves clasping its foot, curling up round it
  for (const s of [-1, 1]) {
    const pts = [[320, 710], [320 + s * 70, 700], [320 + s * 120, 660], [320 + s * 130, 610]];
    const b = blade(pts, { width: (u) => 44 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.8), 0.7), sideVeins: 5, rand });
    paintBlade(b, { id: `c${s}`, palette: LEAF, defs, out, shade: s > 0 ? 0.2 : 0, margin: 5 });
  }
  // the hood of rounded bracts folded over its top
  for (const [dx, dy, r, rot] of [[-50, 520, 46, -30], [50, 520, 46, 30], [0, 490, 54, 0], [-24, 470, 34, -10], [24, 470, 34, 10]]) {
    out.push(`<ellipse cx="${320 + dx}" cy="${dy}" rx="${r}" ry="${r * 0.72}" transform="rotate(${rot} ${320 + dx} ${dy})" fill="${BRACT.base}" stroke="${INK}" stroke-width="1.6"/>`);
    out.push(`<path d="M${320 + dx - r * 0.5},${dy} Q${320 + dx},${dy - r * 0.4} ${320 + dx + r * 0.5},${dy}" fill="none" stroke="${BRACT.light}" stroke-width="2.4" stroke-opacity="0.8"/>`);
  }

  // ── fig. 2: a Boquila vine across two hosts, copying each ──────────────────
  const fx = 690;
  // the two host twigs, one with long narrow leaves, one with round ones
  const host = (x, round) => {
    out.push(`<path d="M${x},766 L${x},600" stroke="${INK}" stroke-width="4"/><path d="M${x},766 L${x},600" stroke="#6e5438" stroke-width="2.4"/>`);
    for (let k = 0; k < 4; k++) {
      const y = 620 + k * 36, s = k % 2 ? 1 : -1;
      if (round) out.push(`<ellipse cx="${x + s * 16}" cy="${y}" rx="14" ry="12" fill="#3e8a44" stroke="${INK}" stroke-width="0.9"/>`);
      else out.push(`<ellipse cx="${x + s * 22}" cy="${y}" rx="22" ry="6" transform="rotate(${s * 20} ${x + s * 22} ${y})" fill="#3e8a44" stroke="${INK}" stroke-width="0.9"/>`);
    }
  };
  host(fx - 50, false);
  host(fx + 50, true);
  // the vine crossing between them, its leaves copying whichever it is on
  out.push(`<path d="M${fx - 90},700 C${fx - 50},690 ${fx},650 ${fx + 90},660" fill="none" stroke="#8a9a4a" stroke-width="2.4"/>`);
  for (const [x, y, round] of [[fx - 70, 694, false], [fx - 30, 680, false], [fx + 30, 656, true], [fx + 70, 658, true]]) {
    if (round) out.push(`<ellipse cx="${x}" cy="${y - 12}" rx="10" ry="9" fill="#9ac46a" stroke="${INK}" stroke-width="0.9"/>`);
    else out.push(`<ellipse cx="${x}" cy="${y - 10}" rx="16" ry="4.4" transform="rotate(-20 ${x} ${y - 10})" fill="#9ac46a" stroke="${INK}" stroke-width="0.9"/>`);
  }
  contact(out, fx, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
