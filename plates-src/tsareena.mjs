// NO. 0763 — a mangosteen, crowned, and a smell cold can take away.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the mangosteen. A round fruit, deep purple, glossy, and on
//      top a crown of four thick green sepals turned back like the petals of
//      a rosette, a short stalk in its middle; and beside it the same fruit
//      broken open — the thick purple rind several times the thickness of an
//      orange's, and inside, the white segments. The green crown the
//      specimen wears.
//   2. The field note's record is kicking and hardened tips; the fruit this
//      line is drawn from keeps its real defence in the rind.
//   3. The note's point is that the last thing a fruit builds is its smell,
//      and it is the easiest thing to destroy. Ripening ends with a burst of
//      volatile esters made in the final days, and in a tomato the genes for
//      them are switched off by cold: kept below about twelve degrees for a
//      few days, it never gets them back. Fig. 2: two tomatoes, the one kept
//      warm giving off its scent, the chilled one giving off nothing.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "tsareena";
export const no = 763;
const SIZE = 800;

function crown(out, cx, cy, r) {
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + 0.4;
    const px = cx + Math.cos(a) * r * 0.55, py = cy + Math.sin(a) * r * 0.2;
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="${r1(r * 0.6)}" ry="${r1(r * 0.3)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="#5aa650" stroke="${INK}" stroke-width="1.4"/>`);
    out.push(`<path d="M${cx},${cy} L${r1(cx + Math.cos(a) * r * 0.9)},${r1(cy + Math.sin(a) * r * 0.33)}" stroke="#2e6a2e" stroke-width="1" stroke-opacity="0.6"/>`);
  }
  out.push(`<rect x="${cx - 5}" y="${cy - 26}" width="10" height="26" rx="3" fill="#6a5a3a" stroke="${INK}" stroke-width="1.1"/>`);
}

export function draw() {
  const rand = mulberry32(763);
  const defs = standardDefs(763);
  const out = [];
  contact(out, 320, 758, 230, 16);
  defs.push(`<radialGradient id="mg" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#9a5a8e"/><stop offset="0.55" stop-color="#5a2250"/><stop offset="1" stop-color="#2e0e2a"/></radialGradient>`);

  // the whole fruit
  out.push(`<circle cx="240" cy="660" r="96" fill="url(#mg)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  out.push(`<ellipse cx="204" cy="616" rx="26" ry="14" transform="rotate(-30 204 616)" fill="#ffffff" fill-opacity="0.35"/>`);
  crown(out, 240, 572, 90);
  // the broken one: the thick rind, and the white segments inside
  const bx = 430, by = 690;
  out.push(`<path d="M${bx - 80},${by} A80,70 0 0,1 ${bx + 80},${by} L${bx + 80},${by + 6} A80,64 0 0,1 ${bx - 80},${by + 6} Z" fill="url(#mg)" stroke="${INK}" stroke-width="1.8"/>`);
  out.push(`<ellipse cx="${bx}" cy="${by}" rx="80" ry="26" fill="#8a2a6a" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<ellipse cx="${bx}" cy="${by}" rx="54" ry="17" fill="#fbf6ee" stroke="${INK}" stroke-width="1.2"/>`);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; out.push(`<path d="M${bx},${by} L${r1(bx + Math.cos(a) * 54)},${r1(by + Math.sin(a) * 17)}" stroke="#d8d0c0" stroke-width="1.2"/>`); }
  void rand;

  // ── fig. 2: a tomato kept warm, and one kept cold ─────────────────────────
  const tom = (x, warm) => {
    out.push(`<circle cx="${x}" cy="726" r="34" fill="#d8342e" stroke="${INK}" stroke-width="1.5"/><ellipse cx="${x - 12}" cy="712" rx="8" ry="5" fill="#ffffff" fill-opacity="0.4"/>`);
    out.push(`<path d="M${x - 14},694 l14,6 l14,-6 M${x},700 l0,-10" fill="none" stroke="#4a8e3e" stroke-width="3" stroke-linecap="round"/>`);
    if (warm) for (const dx of [-16, 0, 16]) out.push(`<path d="M${x + dx},684 q-6,-12 0,-24 q6,-12 0,-24" fill="none" stroke="#c89a4a" stroke-width="1.6" stroke-dasharray="4 3"/>`);
    else {
      const sf = [];
      for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI; sf.push(`M${r1(x - Math.cos(a) * 12)},${r1(656 - Math.sin(a) * 12)} L${r1(x + Math.cos(a) * 12)},${r1(656 + Math.sin(a) * 12)}`); }
      out.push(`<path d="${sf.join(" ")}" stroke="#5a8ed4" stroke-width="2.4" stroke-linecap="round"/>`);
    }
  };
  tom(630, true);
  tom(740, false);
  contact(out, 686, 762, 100, 5, 0.18);

  return { size: SIZE, view: [0, 420, SIZE, 370], defs: defs.join("\n"), body: out.join("\n") };
}
