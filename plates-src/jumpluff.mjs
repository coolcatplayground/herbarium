// NO. 0189 — the clocks, and what flight costs.
//
// What the morphology says, and what each observation became:
//
//   1. Three seed heads gone to their final form: dandelion clocks, each a
//      sphere of parachutes — a seed at the centre, a slender beak, and at
//      its tip a pappus of fine hairs spread like an umbrella.
//   2. The three stand on stalks from one small crown, with two small leaves.
//   3. The field note's point is what happens after the crossing. Island
//      floras are built from lineages that could fly there — and once
//      arrived, they tend to give it up: island dandelions and their
//      relatives repeatedly evolve heavier seeds with reduced plumes, because
//      on a small island most of what the wind carries off is lost to the
//      sea. Fig. 2: a mainland seed and an island one, side by side.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "jumpluff";
export const no = 189;
const SIZE = 800;
const LEAF = { light: "#c3e3a2", base: "#86c06a", deep: "#557f42", shade: "#355a2a", edge: "#355a2a" };

// a clock: parachutes on a sphere, the far ones fainter
function clock(out, cx, cy, R) {
  const N = 110;
  const far = [], near = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N, rr = Math.sqrt(1 - y * y), a = i * 2.39996;
    const d = [Math.cos(a) * rr, y, Math.sin(a) * rr];
    const ex = cx + d[0] * R, ey = cy + d[1] * R * 0.96;
    const stroke = d[2] < 0 ? far : near;
    stroke.push(`M${r1(cx + d[0] * R * 0.16)},${r1(cy + d[1] * R * 0.15)} L${r1(ex)},${r1(ey)}`);
    for (let h = 0; h < 7; h++) {
      const ha = (h / 7) * Math.PI * 2;
      stroke.push(`M${r1(ex)},${r1(ey)} l${r1(Math.cos(ha) * 9)},${r1(Math.sin(ha) * 9 * 0.8)}`);
    }
  }
  out.push(`<circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="#fbf1cf" fill-opacity="0.35"/>`);
  out.push(`<path d="${far.join(" ")}" stroke="#b7ab88" stroke-width="0.8" stroke-opacity="0.55" fill="none"/>`);
  out.push(`<circle cx="${cx}" cy="${cy}" r="${r1(R * 0.18)}" fill="#8a6a44" stroke="${INK}" stroke-width="1"/>`);
  out.push(`<path d="${near.join(" ")}" stroke="#fbf3d6" stroke-width="1.5" fill="none"/>`);
  out.push(`<path d="${near.join(" ")}" stroke="#a09470" stroke-width="0.6" fill="none"/>`);
}

export function draw() {
  const rand = mulberry32(189);
  const defs = standardDefs(189);
  const out = [];
  const crown = [322, 640];
  contact(out, 322, 756, 170, 14);

  const heads = [[322, 372, 104], [198, 548, 80], [452, 560, 80]];
  // stalks from the crown to each head
  for (const [hx, hy] of heads) {
    const d = `M${crown[0]},${crown[1]} Q${(crown[0] + hx) / 2},${(crown[1] + hy) / 2 + 30} ${hx},${hy}`;
    out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#8cb866" stroke-width="4.4" stroke-linecap="round"/>`);
  }
  // the crown, with its two small leaves, standing on a short stem
  out.push(`<path d="M${crown[0] - 8},752 L${crown[0] - 6},${crown[1]} L${crown[0] + 6},${crown[1]} L${crown[0] + 8},752 Z" fill="#8cb866" stroke="${INK}" stroke-width="1.6"/>`);
  for (const side of [-1, 1]) {
    const b = blade([[crown[0], crown[1] + 20], [crown[0] + side * 50, crown[1] + 4], [crown[0] + side * 96, crown[1] + 18]], {
      width: (u) => 22 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)), 0.7), sideVeins: 4, rand,
    });
    paintBlade(b, { id: `lf${side}`, palette: LEAF, defs, out, shade: side > 0 ? 0.2 : 0, margin: 4 });
  }
  for (const [hx, hy, R] of heads) clock(out, hx, hy, R);

  // ── fig. 2: mainland and island ───────────────────────────────────────────
  const seed = (x, y, len, sw, sh, pap) => {
    out.push(`<path d="M${x},${y} L${x},${y - len}" stroke="${INK}" stroke-width="1.2"/>`);
    for (let h = 0; h < 13; h++) {
      const ha = -Math.PI + (h / 12) * Math.PI;
      out.push(`<path d="M${x},${y - len} q${r1(Math.cos(ha) * pap * 0.5)},${r1(-pap * 0.5)} ${r1(Math.cos(ha) * pap)},${r1(Math.sin(ha) * pap * 0.7)}" fill="none" stroke="#a09470" stroke-width="0.9"/>`);
    }
    out.push(`<ellipse cx="${x}" cy="${y + sh / 2}" rx="${sw}" ry="${sh}" fill="#6e5236" stroke="${INK}" stroke-width="1"/>`);
    for (let k = 1; k < 4; k++) out.push(`<path d="M${x - sw + 1},${r1(y + (k * sh * 2) / 4 - sh / 2)} l${sw * 2 - 2},0" stroke="#a88a60" stroke-width="0.6"/>`);
  };
  const figFrom = out.length;
  seed(640, 730, 84, 3, 9, 34);
  seed(736, 736, 28, 7, 16, 12);
  out.push(`<g transform="translate(690 768) scale(1.5) translate(-690 -768)">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, 690, 768, 100, 6, 0.2);

  return { size: SIZE, view: [0, 240, SIZE, 548], defs: defs.join("\n"), body: out.join("\n") };
}
