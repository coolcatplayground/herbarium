// NO. 0598 — a hanging burr on its vines, and what thorns really do.
//
// What the morphology says, and what each observation became:
//
//   1. The part: a burr grown great and hanging. A broad flattened seed-case,
//      iron-grey, girdled round its middle and set along the girdle with
//      short heavy spikes, fallen on its side from the vine it hung on; and from its top, three
//      curving vines each ending in a small green spiked fruit — the pods
//      the specimen swings on its tendrils.
//   2. The field note's record is spikes harder than steel, and nutrients
//      scraped out of rock.
//   3. The note's point is that thorns rarely stop anything — they slow it,
//      and slowing it is the point. A browsing animal takes smaller bites and
//      spends longer on each where a branch is armed, so the plant loses less
//      per minute of attention. Fig. 2: two twigs after the same browsing —
//      the smooth one stripped, the thorny one with most of its leaves left.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "ferrothorn";
export const no = 598;
const SIZE = 800;

function spikyBall(out, x, y, r, rand) {
  const sp = [];
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + rand() * 0.2;
    sp.push(`M${r1(x + Math.cos(a + 0.2) * r)},${r1(y + Math.sin(a + 0.2) * r)} L${r1(x + Math.cos(a) * (r + 12))},${r1(y + Math.sin(a) * (r + 12))} L${r1(x + Math.cos(a - 0.2) * r)},${r1(y + Math.sin(a - 0.2) * r)} Z`);
  }
  out.push(`<path d="${sp.join(" ")}" fill="#c8ccc4" stroke="${INK}" stroke-width="1.1"/>`);
  out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#4e9a5a" stroke="${INK}" stroke-width="1.5"/><ellipse cx="${x - r * 0.3}" cy="${y - r * 0.35}" rx="${r * 0.3}" ry="${r * 0.2}" fill="#b8e0a0" fill-opacity="0.8"/>`);
}

export function draw() {
  const rand = mulberry32(598);
  const defs = standardDefs(598);
  const out = [];
  contact(out, 320, 758, 230, 16);

  // the three vines from its top, curving out to their fruit
  const top = [320, 560];
  const V = [[[120, 600], [160, 470], [90, 460]], [[520, 600], [470, 470], [540, 470]], [[330, 420], [300, 380], [360, 360]]];
  for (const [c1, c2, end] of V) {
    const d = `M${top[0]},${top[1]} C${c1[0]},${c1[1] - 120} ${c2[0]},${c2[1]} ${end[0]},${end[1]}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#5e9a64" stroke-width="6" stroke-linecap="round"/>`);
  }
  // the pod: flattened, iron-grey, girdled, spiked along its girdle
  const cx = 320, cy = 660, RX = 170, RY = 90;
  defs.push(`<radialGradient id="pd" cx="0.38" cy="0.3" r="0.8"><stop offset="0" stop-color="#e2e4dc"/><stop offset="0.55" stop-color="#9aa29a"/><stop offset="1" stop-color="#4e564e"/></radialGradient>`);
  const spikes = [];
  for (let k = 0; k < 14; k++) {
    const a = Math.PI * (k / 13);
    const x = cx - Math.cos(a) * RX * 1.02, y = cy + 14 + Math.sin(a) * 18;
    spikes.push(`M${r1(x - 10)},${r1(y)} L${r1(x - Math.cos(a) * 30)},${r1(y + 30 + Math.sin(a) * 6)} L${r1(x + 10)},${r1(y)} Z`);
  }
  out.push(`<path d="${spikes.join(" ")}" fill="#b8bcb4" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${RX}" ry="${RY}" fill="url(#pd)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<path d="M${cx - RX + 2},${cy + 10} C${cx - RX * 0.5},${cy + 40} ${cx + RX * 0.5},${cy + 40} ${cx + RX - 2},${cy + 10}" fill="none" stroke="#3a403a" stroke-width="16"/>`);
  for (let k = 0; k < 9; k++) { const x = cx - RX * 0.8 + k * RX * 0.2; out.push(`<circle cx="${r1(x)}" cy="${r1(cy + 16 + Math.sin((k / 8) * Math.PI) * 10)}" r="3" fill="#c8ccc4"/>`); }
  // short spikes on its crown
  for (const dx of [-90, -30, 30, 90]) out.push(`<path d="M${cx + dx - 8},${cy - RY * 0.8 + Math.abs(dx) * 0.3} L${cx + dx},${cy - RY - 20 + Math.abs(dx) * 0.3} L${cx + dx + 8},${cy - RY * 0.8 + Math.abs(dx) * 0.3} Z" fill="#b8bcb4" stroke="${INK}" stroke-width="1.1"/>`);
  // the fruit at the vine tips
  for (const [, , [x, y]] of V) spikyBall(out, x, y, 22, rand);

  // ── fig. 2: two twigs after the same browsing ─────────────────────────────
  const twig = (x, thorny) => {
    const g = 766;
    out.push(`<path d="M${x},${g} L${x},${g - 150}" stroke="${INK}" stroke-width="5"/><path d="M${x},${g} L${x},${g - 150}" stroke="#7a6040" stroke-width="3"/>`);
    for (let k = 0; k < 6; k++) {
      const y = g - 20 - k * 24, s = k % 2 ? 1 : -1;
      if (thorny) {
        out.push(`<path d="M${x},${y} l${s * 20},-8" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`);
        out.push(`<ellipse cx="${x + s * 16}" cy="${y + 6}" rx="12" ry="6" transform="rotate(${s * 20} ${x + s * 16} ${y + 6})" fill="#5aa650" stroke="${INK}" stroke-width="0.9"/>`);
      } else if (k > 3) out.push(`<ellipse cx="${x + s * 14}" cy="${y}" rx="12" ry="6" transform="rotate(${s * 20} ${x + s * 14} ${y})" fill="#5aa650" stroke="${INK}" stroke-width="0.9"/>`);
      else out.push(`<path d="M${x},${y} l${s * 8},-2" stroke="#7a6040" stroke-width="2"/>`);
    }
  };
  twig(640, false);
  twig(740, true);
  contact(out, 690, 768, 90, 5, 0.18);
  void smooth;

  return { size: SIZE, view: [0, 330, SIZE, 460], defs: defs.join("\n"), body: out.join("\n") };
}
