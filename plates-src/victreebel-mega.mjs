// NO. 0071 (Mega) — the pitcher swollen to a vat, and a trap sized to its prey.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the pitcher of NO. 0071, grown enormous. The same yellow
//      trap, speckled darker, but ballooned into a squat round vat that sits
//      heavy on the ground, its narrow neck wound round with its own tendril,
//      and the lid leaf above it broadened and serrated and turned in the
//      Mega form's autumn colours — orange and red at the edges, green at the
//      heart. The fat yellow bulb and the flame-edged lid.
//   2. The record builds a nastier picture than most: prey lured with the
//      smell of honey and swallowed whole.
//   3. The note's point is that trap volume sets diet. Real Nepenthes run
//      from thimble traps for ants to vessels holding litres of fluid, and the
//      biggest species can take far larger prey than insects. Size is not
//      decoration; it is a change of menu. Fig. 2: a small pitcher and a large
//      one cut open, the digestive fluid in each against a graduated scale.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "victreebel-mega";
export const no = 71;
const SIZE = 800;
const LID = { light: "#f8c890", base: "#e8843a", deep: "#b8481e", shade: "#7a2a14", edge: "#6a2410" };
const GREEN = { light: "#c8e8a8", base: "#8ac878", deep: "#5a9a54", shade: "#346a36", edge: "#2e5a30" };

export function draw() {
  const rand = mulberry32(710);
  const defs = standardDefs(710);
  const out = [];
  contact(out, 300, 760, 210, 18);

  // the vat: a squat round pitcher, speckled
  defs.push(`<radialGradient id="vat" cx="0.38" cy="0.34" r="0.8"><stop offset="0" stop-color="#fbf4a8"/><stop offset="0.55" stop-color="#e8dc5a"/><stop offset="1" stop-color="#a89a2a"/></radialGradient>`);
  const body = "M300,470 C336,470 340,510 350,530 C470,550 520,630 510,700 C500,756 420,766 300,766 C180,766 100,756 90,700 C80,630 130,550 250,530 C260,510 264,470 300,470 Z";
  out.push(`<path d="${body}" fill="url(#vat)" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  out.push(`<clipPath id="vc"><path d="${body}"/></clipPath>`);
  const sp = [];
  for (let k = 0; k < 26; k++) { const x = 110 + rand() * 380, y = 560 + rand() * 190; sp.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(6 + rand() * 12)}" ry="${r1(4 + rand() * 7)}" fill="#a8983a" fill-opacity="0.55"/>`); }
  out.push(`<g clip-path="url(#vc)">${sp.join("")}</g>`);
  // the mouth rim at the neck
  out.push(`<ellipse cx="300" cy="472" rx="30" ry="9" fill="#8a2a3a" stroke="${INK}" stroke-width="1.6"/><ellipse cx="300" cy="473" rx="22" ry="5" fill="#3a1418"/>`);
  // the tendril wound round the neck, then trailing out to the right
  const wind = [];
  for (let k = 0; k <= 40; k++) { const t = k / 40, a = t * Math.PI * 6; wind.push([300 + Math.cos(a) * (30 + t * 16), 488 + t * 40 + Math.sin(a) * 6]); }
  const wd = `M${wind.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} C420,560 480,560 530,530 C570,508 584,480 562,468`;
  out.push(`<path d="${wd}" fill="none" stroke="${INK}" stroke-width="5.4" stroke-linecap="round"/><path d="${wd}" fill="none" stroke="#6a8a3a" stroke-width="3.2" stroke-linecap="round"/>`);
  // two small green leaves on the tendril
  for (const [pts, id] of [[[[470, 556], [498, 540], [532, 548]], "g1"], [[[530, 530], [556, 528], [580, 544]], "g2"]]) {
    const b = blade(pts, { width: (u) => 14 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 0.5, sideVeins: 3, rand });
    paintBlade(b, { id, palette: GREEN, defs, out, margin: 2, ink: 1.1 });
  }
  // the lid leaf: broad, serrated, orange-red at the edge and green at the heart
  const lid = blade([[300, 462], [296, 420], [300, 370], [306, 320]], { width: (u) => 96 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.7), lobes: 7, depth: 0.32, start: 0.15, teeth: "sharp", sideVeins: 6, rand });
  paintBlade(lid, { id: "lid", palette: LID, defs, out, margin: 3 });
  const heart = blade([[300, 456], [298, 424], [302, 386]], { width: (u) => 34 * Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95)) + 1, sideVeins: 0, rand });
  paintBlade(heart, { id: "lh", palette: GREEN, defs, out, margin: 0, ink: 0, veinOpacity: 0 });

  // ── fig. 2: a small pitcher and a large one cut open, against a scale ─────
  const fx = 640;
  out.push(`<path d="M${fx - 70},766 C${fx - 76},740 ${fx - 74},724 ${fx - 62},716 L${fx - 62},704 L${fx - 48},704 L${fx - 48},716 C${fx - 36},724 ${fx - 34},740 ${fx - 40},766 Z" fill="#f4f0c8" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="M${fx - 72},766 C${fx - 74},752 ${fx - 72},748 ${fx - 70},746 L${fx - 40},746 C${fx - 38},748 ${fx - 36},752 ${fx - 38},766 Z" fill="#c8b870" fill-opacity="0.8"/>`);
  out.push(`<path d="M${fx - 10},766 C${fx - 30},700 ${fx - 20},660 ${fx + 20},640 L${fx + 20},612 L${fx + 50},612 L${fx + 50},640 C${fx + 90},660 ${fx + 100},700 ${fx + 80},766 Z" fill="#f4f0c8" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<path d="M${fx - 14},766 C${fx - 22},730 ${fx - 20},708 ${fx - 14},696 L${fx + 84},696 C${fx + 90},708 ${fx + 92},730 ${fx + 84},766 Z" fill="#c8b870" fill-opacity="0.8"/>`);
  out.push(`<path d="M${fx + 110},766 L${fx + 110},610" stroke="${INK}" stroke-width="1.3"/>`);
  for (let k = 0; k <= 6; k++) out.push(`<path d="M${fx + 110},${766 - k * 26} l${k % 2 ? 6 : 10},0" stroke="${INK}" stroke-width="1.1"/>`);
  contact(out, fx + 20, 768, 110, 5, 0.18);

  return { size: SIZE, view: [0, 290, SIZE, 500], defs: defs.join("\n"), body: out.join("\n") };
}
