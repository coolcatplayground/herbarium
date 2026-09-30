// NO. 0986 — an old red-capped toadstool, and the first flower reconstructed.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the toadstool. A great fly agaric grown old and broad — its
//      cap a deep red, flattened, set with raised white warts; a pale ring
//      hanging from its thick white stalk; and the foot swollen into a bulb
//      ringed with the torn remains of the veil it grew out of. The red and
//      white cap the specimen wears. (Its fringe of hanging frills would read
//      as teeth; a fly agaric carries its gills out of sight beneath.)
//   2. The field note's record is deliberately unreliable — a creature from a
//      dubious magazine, part dinosaur and part mushroom.
//   3. The note's point is that reconstructing an ancestor nobody has a
//      fossil of is an ordinary procedure, and it has been done for the
//      flower. Mapping floral traits across the whole family tree and running
//      the inference backwards gives a picture of the first one: bisexual,
//      radially symmetric, its parts in rings of three. Fig. 2: that
//      reconstruction, as a botanist would draw it — petals, stamens and
//      carpels in whorls.
import { mulberry32, r1, INK } from "./lib.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "brute-bonnet";
export const no = 986;
const SIZE = 800;

export function draw() {
  const rand = mulberry32(986);
  const defs = standardDefs(986);
  const out = [];
  contact(out, 320, 758, 220, 16);

  // the swollen foot, ringed with the torn veil
  out.push(`<path d="M250,760 C230,730 250,690 290,680 L350,680 C390,690 410,730 390,760 Z" fill="#f4f0e4" stroke="${INK}" stroke-width="1.8"/>`);
  for (const y of [712, 732]) out.push(`<path d="M${248 + (y - 712) * 0.3},${y} q18,-8 36,0 q18,-8 36,0 q18,-8 36,0 q18,-8 36,0" fill="none" stroke="#c8c0a8" stroke-width="2"/>`);
  // the stalk, thick and white, and the ring hanging from it
  out.push(`<path d="M292,684 C296,620 298,560 300,500 L340,500 C342,560 344,620 348,684 Z" fill="#fbf8ee" stroke="${INK}" stroke-width="1.6"/>`);
  out.push(`<path d="M296,560 C280,574 282,596 290,602 L350,602 C358,596 360,574 344,560 Z" fill="#fbf8ee" stroke="${INK}" stroke-width="1.4"/>`);
  for (const dx of [-16, 0, 16]) out.push(`<path d="M${320 + dx * 0.6},564 L${320 + dx},600" stroke="#d8d0bc" stroke-width="1"/>`);
  // the cap: broad, flattened, deep red, with raised white warts
  const cap = `M110,506 C112,420 210,380 320,380 C430,380 528,420 530,506 C460,494 180,494 110,506 Z`;
  defs.push(`<radialGradient id="cp" cx="0.4" cy="0.25" r="0.85"><stop offset="0" stop-color="#f2604a"/><stop offset="0.55" stop-color="#c8241e"/><stop offset="1" stop-color="#7a1210"/></radialGradient>`);
  defs.push(`<clipPath id="cc"><path d="${cap}"/></clipPath>`);
  out.push(`<path d="M116,504 C200,516 440,516 524,504 L520,512 C440,524 200,524 120,512 Z" fill="#f2ecd8" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<path d="${cap}" fill="url(#cp)" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  const warts = [];
  for (let k = 0; k < 30; k++) {
    const x = 130 + rand() * 380, y = 400 + rand() * 96;
    warts.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(6 + rand() * 7)}" ry="${r1(4 + rand() * 4)}" fill="#fbf8ee" stroke="#c8b8a0" stroke-width="0.8"/>`);
  }
  out.push(`<g clip-path="url(#cc)">${warts.join("")}</g>`);
  out.push(`<ellipse cx="240" cy="410" rx="50" ry="14" transform="rotate(-8 240 410)" fill="#ffffff" fill-opacity="0.25" filter="url(#sheen)"/>`);

  // ── fig. 2: the reconstructed first flower, parts in rings of three ───────
  const fx = 690, fy = 680;
  for (let ring = 0; ring < 3; ring++) {
    for (let k = 0; k < 6; k++) {
      const a = -Math.PI / 2 + (k / 6) * Math.PI * 2 + (ring % 2) * (Math.PI / 6);
      const r = 56 - ring * 8;
      out.push(`<ellipse cx="${r1(fx + Math.cos(a) * r * 0.55)}" cy="${r1(fy + Math.sin(a) * r * 0.55)}" rx="${r1(r * 0.5)}" ry="${r1(r * 0.24)}" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(fx + Math.cos(a) * r * 0.55)} ${r1(fy + Math.sin(a) * r * 0.55)})" fill="${["#f4ecd0", "#fbf6e4", "#f2e2b8"][ring]}" stroke="${INK}" stroke-width="1"/>`);
    }
  }
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; out.push(`<path d="M${fx},${fy} L${r1(fx + Math.cos(a) * 18)},${r1(fy + Math.sin(a) * 18)}" stroke="#c8a02a" stroke-width="1.6"/><circle cx="${r1(fx + Math.cos(a) * 18)}" cy="${r1(fy + Math.sin(a) * 18)}" r="2.4" fill="#e8c84a"/>`); }
  for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; out.push(`<ellipse cx="${r1(fx + Math.cos(a) * 6)}" cy="${r1(fy + Math.sin(a) * 6)}" rx="4" ry="6" fill="#8ab85a" stroke="${INK}" stroke-width="0.7"/>`); }
  out.push(`<path d="M${fx},${fy + 30} L${fx},766" stroke="#6a8a4a" stroke-width="4"/>`);
  contact(out, fx, 768, 70, 5, 0.18);

  return { size: SIZE, view: [0, 350, SIZE, 440], defs: defs.join("\n"), body: out.join("\n") };
}
