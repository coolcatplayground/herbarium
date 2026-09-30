// NO. 0003 (Mega) — the flower on a swollen trunk, and heat held in bulk.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the great flower, grown heavier. The broad pink flower of
//      NO. 0003 — five wide petals flecked pale, a ring of yellow at its heart
//      — now set on a short, massively swollen trunk, smooth and grey-green like
//      a desert rose's caudex, and round it broad fronds spreading out and down.
//      The field note files the form with succulent-stemmed desert perennials:
//      the bigger flower on the thicker body.
//   2. The record is the ordinary form's: a flower that turns sunlight to
//      power, stronger in summer.
//   3. The note's point is that bulk is a strategy. A big body of water- and
//      starch-storing tissue changes temperature slowly, so a thick-stemmed
//      succulent warms and cools far more slowly than the air round it — it
//      rides out a desert day and night on its own mass. Fig. 2: a thin stem
//      and a thick one at midday, the thermometer in each: the thin one as hot
//      as the air, the thick one cool.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "venusaur-mega";
export const no = 3;
const SIZE = 800;
const FROND = { light: "#b8e0a0", base: "#3e9a4a", deep: "#236a34", shade: "#123e1e", edge: "#123e1e" };

export function draw() {
  const rand = mulberry32(30);
  const defs = standardDefs(30);
  const out = [];
  contact(out, 320, 758, 250, 18);

  // broad fronds spreading out and down, behind the trunk
  for (const [a, L] of [[Math.PI + 0.15, 280], [-0.15, 280], [Math.PI + 0.55, 240], [-0.55, 240], [Math.PI - 0.25, 220], [0.25, 220]]) {
    const pts = [[320, 560], [320 + Math.cos(a) * L * 0.4, 560 + Math.sin(a) * L * 0.2 - 40], [320 + Math.cos(a) * L * 0.8, 560 + Math.sin(a) * L * 0.1 + 20], [320 + Math.cos(a) * L, 640]];
    const b = blade(pts, { width: (u) => 50 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.03 + u * 0.97) ** 0.8), 0.6), lobes: 12, depth: 0.25, start: 0.2, teeth: "round", sideVeins: 8, rand });
    paintBlade(b, { id: `fr${r1(a * 10)}`, palette: FROND, defs, out, shade: Math.sin(a) < 0 ? 0.2 : 0, margin: 6 });
  }
  // the swollen trunk: a smooth grey-green caudex
  defs.push(`<radialGradient id="cd" cx="0.36" cy="0.35" r="0.8"><stop offset="0" stop-color="#d8e0c8"/><stop offset="0.6" stop-color="#9aaa88"/><stop offset="1" stop-color="#5e6a52"/></radialGradient>`);
  out.push(`<path d="M190,760 C160,700 180,620 250,590 L390,590 C460,620 480,700 450,760 Z" fill="url(#cd)" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  for (const dx of [-80, -30, 30, 80]) out.push(`<path d="M${320 + dx * 0.6},600 C${320 + dx * 1.2},660 ${320 + dx * 1.3},720 ${320 + dx * 1.2},756" fill="none" stroke="#6e7a60" stroke-width="1.2" stroke-opacity="0.5"/>`);
  // the flower: five broad pink petals flecked pale, a yellow ring at its heart
  const cx = 320, cy = 520;
  defs.push(`<radialGradient id="pt" cx="${cx}" cy="${cy}" r="170" gradientUnits="userSpaceOnUse"><stop offset="0.2" stop-color="#c83a5a"/><stop offset="0.6" stop-color="#ec7a90"/><stop offset="1" stop-color="#f8b8c4"/></radialGradient>`);
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
    const px = cx + Math.cos(a) * 90, py = cy + Math.sin(a) * 44;
    out.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="100" ry="56" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(px)} ${r1(py)})" fill="url(#pt)" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
    for (let q = 0; q < 5; q++) { const rr = 50 + rand() * 80, aa = a + (rand() - 0.5) * 0.5; out.push(`<ellipse cx="${r1(cx + Math.cos(aa) * rr)}" cy="${r1(cy + Math.sin(aa) * rr * 0.5)}" rx="${r1(5 + rand() * 5)}" ry="${r1(3 + rand() * 3)}" fill="#fbe4ea" fill-opacity="0.85"/>`); }
  }
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; out.push(`<path d="M${r1(cx + Math.cos(a) * 18)},${r1(cy + Math.sin(a) * 10)} L${r1(cx + Math.cos(a) * 30)},${r1(cy + Math.sin(a) * 16 - 16)} L${r1(cx + Math.cos(a + 0.3) * 20)},${r1(cy + Math.sin(a + 0.3) * 11)} Z" fill="#f2cf3e" stroke="${INK}" stroke-width="0.9"/>`); }
  out.push(`<ellipse cx="${cx}" cy="${cy}" rx="20" ry="11" fill="#c8841c" stroke="${INK}" stroke-width="1"/>`);

  // ── fig. 2: a thin stem and a thick one at midday ─────────────────────────
  const therm = (x, level, col) => out.push(`<rect x="${x - 4}" y="640" width="8" height="70" rx="4" fill="#fbfaf2" stroke="${INK}" stroke-width="1"/><circle cx="${x}" cy="714" r="7" fill="${col}" stroke="${INK}" stroke-width="1"/><rect x="${x - 2}" y="${710 - level}" width="4" height="${level}" fill="${col}"/>`);
  out.push(`<rect x="596" y="660" width="18" height="106" fill="#9aaa88" stroke="${INK}" stroke-width="1.3"/>`);
  therm(580, 60, "#d8434e");
  out.push(`<path d="M670,766 C660,700 670,660 710,650 C750,660 760,700 750,766 Z" fill="#9aaa88" stroke="${INK}" stroke-width="1.3"/>`);
  therm(770, 20, "#5a8ed4");
  out.push(`<circle cx="680" cy="600" r="12" fill="#f2cf3e" stroke="${INK}" stroke-width="1.1"/>`);
  contact(out, 670, 768, 110, 5, 0.18);

  return { size: SIZE, view: [0, 350, SIZE, 440], defs: defs.join("\n"), body: out.join("\n") };
}
