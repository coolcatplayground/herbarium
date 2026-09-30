// NO. 0907 — a vine with a hard bud at its end, and a plant hiding from us.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the vine. A slender green vine coiling up from the ground,
//      a few narrow leaves along it, dark green and pointed — and at its end
//      a hard, tight flower bud, round and deep pink, its sepals closed over
//      it in a small green star. The vine with the pink bud the specimen keeps.
//   2. The field note's record is a vine hidden under the fur with a hard bud
//      on its end — and a resting bud is more finished than it looks: the
//      flower inside is already made, folded, waiting.
//   3. The note's point is that camouflage in plants is real, and at least
//      one case is being driven by us. Fritillaria delavayi grows on scree in
//      the mountains of south-west China, and its leaves run from bright green
//      to a grey-brown hard to pick out against the stones — and the dull
//      forms are commonest exactly where it is dug hardest for medicine.
//      Fig. 2: scree, a green plant plain on it, a grey one nearly lost.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "floragato";
export const no = 907;
const SIZE = 800;
const LEAF = { light: "#9ed69a", base: "#2e8a4a", deep: "#1a6034", shade: "#0e3a20", edge: "#0e3a20" };

export function draw() {
  const rand = mulberry32(907);
  const defs = standardDefs(907);
  const out = [];
  contact(out, 320, 758, 180, 14);

  // the vine: rising from the ground in loose coils, then reaching up
  const pts = [];
  for (let k = 0; k <= 60; k++) {
    const t = k / 60;
    const r = 60 * (1 - t) ** 1.2;
    pts.push([300 + Math.cos(t * Math.PI * 5) * r + t * 40, 758 - t * 330 + Math.sin(t * Math.PI * 5) * r * 0.35]);
  }
  const d = smooth(pts);
  out.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#4e9a4e" stroke-width="7" stroke-linecap="round"/>`);
  // narrow pointed leaves along it
  for (const i of [12, 22, 32, 42, 50]) {
    const [x, y] = pts[i];
    const s = i % 20 < 10 ? -1 : 1;
    const a = -Math.PI / 2 + s * 1.1;
    const b = blade([[x, y], [x + Math.cos(a) * 40, y + Math.sin(a) * 40], [x + Math.cos(a) * 86, y + Math.sin(a) * 76]], { width: (u) => 16 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.7), sideVeins: 3, rand });
    paintBlade(b, { id: `l${i}`, palette: LEAF, defs, out, margin: 3 });
  }
  // the bud at its end: round, deep pink, sepals closed over it in a star
  const [bx, by] = pts.at(-1);
  defs.push(`<radialGradient id="bd" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="#fcc4d4"/><stop offset="0.55" stop-color="#e05a88"/><stop offset="1" stop-color="#a8284e"/></radialGradient>`);
  out.push(`<circle cx="${r1(bx)}" cy="${r1(by - 40)}" r="44" fill="url(#bd)" stroke="${INK}" stroke-width="2" filter="url(#pen)"/>`);
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k / 5) * Math.PI * 2;
    out.push(`<path d="M${r1(bx)},${r1(by - 40)} Q${r1(bx + Math.cos(a - 0.3) * 24)},${r1(by - 40 + Math.sin(a - 0.3) * 24)} ${r1(bx + Math.cos(a) * 42)},${r1(by - 40 + Math.sin(a) * 42)} Q${r1(bx + Math.cos(a + 0.3) * 24)},${r1(by - 40 + Math.sin(a + 0.3) * 24)} ${r1(bx)},${r1(by - 40)} Z" fill="#3e8a4a" stroke="${INK}" stroke-width="1"/>`);
  }

  // ── fig. 2: scree, a green plant plain on it and a grey one nearly lost ───
  const fx = 664;
  const figFrom = out.length;
  out.push(`<path d="M${fx - 100},766 C${fx - 80},700 ${fx + 80},690 ${fx + 100},766 Z" fill="#b8b0a4" stroke="${INK}" stroke-width="1.2"/>`);
  const stones = [];
  for (let k = 0; k < 40; k++) { const x = fx - 90 + rand() * 180, y = 716 + rand() * 46; stones.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(5 + rand() * 7)}" ry="${r1(3 + rand() * 4)}" fill="${["#9a948a", "#c8c0b4", "#8a8478", "#aaa498"][k % 4]}" stroke="#6e685e" stroke-width="0.6"/>`); }
  out.push(stones.join(""));
  const plant = (x, col) => { for (const a of [-2.2, -1.6, -1]) out.push(`<ellipse cx="${r1(x + Math.cos(a) * 14)}" cy="${r1(722 + Math.sin(a) * 16)}" rx="16" ry="5" transform="rotate(${r1((a * 180) / Math.PI)} ${r1(x + Math.cos(a) * 14)} ${r1(722 + Math.sin(a) * 16)})" fill="${col}" stroke="${INK}" stroke-width="0.6"/>`); };
  plant(fx - 40, "#4ea44e");
  plant(fx + 40, "#8a8a7a");
  out.push(`<g transform="translate(${fx} 766) scale(1.2) translate(${-fx} -766)">${out.splice(figFrom).join("")}</g>`);
  contact(out, fx, 768, 120, 5, 0.18);

  return { size: SIZE, view: [0, 330, SIZE, 460], defs: defs.join("\n"), body: out.join("\n") };
}
