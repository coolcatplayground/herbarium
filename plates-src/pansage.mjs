// NO. 0511 — a tuft of leaves, and a leaf that forges its own damage.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the tuft. A dense rounded head of soft leaves, bright green,
//      each leaf small, oval and puckered like a culinary herb's, packed
//      into a cushion on a short stem — and set in its crown three small
//      yellow buds. The rounded green tuft the specimen wears on its head.
//   2. The field note files it with ornamental foliage, and its record is a
//      forager: good at finding berries and sharing them.
//   3. The note's point is that not all variegation is a defect. On some
//      arums and trilliums the pale winding streaks closely resemble the
//      tunnels of a leaf-mining fly, and a fly looking for a leaf to lay in
//      passes over one that appears to be taken already. Fig. 2: two leaves
//      — one really mined, and one only painted to look it.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "pansage";
export const no = 511;
const SIZE = 800;
const TUFT = ["#3e8a44", "#4e9a4c", "#5aaa56", "#6cb862", "#80c870"];
const LEAF = { light: "#b8dca0", base: "#5a9e4e", deep: "#357438", shade: "#1e4a22", edge: "#1e4a22" };

export function draw() {
  const rand = mulberry32(511);
  const defs = standardDefs(511);
  const out = [];
  contact(out, 320, 758, 150, 14);

  // the short stem, branching into the head
  out.push(`<path d="M312,760 L316,640 M316,680 L290,640 M316,670 L346,636" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M312,760 L316,640 M316,680 L290,640 M316,670 L346,636" stroke="#8a7a4e" stroke-width="9" stroke-linecap="round"/>`);
  // the head: puckered oval leaves packed in a dome, lower and darker first
  const cx = 320, cy = 540, RX = 170, RY = 120;
  out.push(`<ellipse cx="${cx}" cy="${cy + 20}" rx="${RX * 0.9}" ry="${RY * 0.8}" fill="${TUFT[0]}"/>`);
  const leaves = [];
  for (let k = 0; k < 260; k++) {
    const v = k / 260;
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * 0.95;
    const x = cx + Math.cos(a) * RX * r, y = cy + Math.sin(a) * RY * r + (1 - v) * 20 - v * 10;
    const ang = Math.atan2(y - cy - 40, x - cx) + (rand() - 0.5) * 0.8;
    const L = 30 + rand() * 12, W = 13 + rand() * 4;
    const tx = x + Math.cos(ang) * L, ty = y + Math.sin(ang) * L;
    const nx = -Math.sin(ang) * W, ny = Math.cos(ang) * W;
    const col = TUFT[Math.max(0, Math.min(4, Math.floor(v * 3.6 + (cy - y) / 120 + rand())))];
    leaves.push(`<path d="M${r1(x)},${r1(y)} C${r1(x + nx)},${r1(y + ny)} ${r1(tx + nx * 0.6)},${r1(ty + ny * 0.6)} ${r1(tx)},${r1(ty)} C${r1(tx - nx * 0.6)},${r1(ty - ny * 0.6)} ${r1(x - nx)},${r1(y - ny)} ${r1(x)},${r1(y)} Z" fill="${col}" stroke="${INK}" stroke-width="0.8" stroke-opacity="0.7"/>`);
    if (k % 3 === 0) leaves.push(`<path d="M${r1(x)},${r1(y)} L${r1(x + (tx - x) * 0.8)},${r1(y + (ty - y) * 0.8)}" stroke="#1e4a22" stroke-width="0.8" stroke-opacity="0.5"/>`);
  }
  out.push(leaves.join(""));
  // three yellow buds in its crown
  for (const [x, y] of [[270, 456], [320, 440], [370, 458]]) out.push(`<ellipse cx="${x}" cy="${y}" rx="9" ry="12" fill="#f2cf3e" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x - 3}" cy="${y - 4}" rx="3" ry="4" fill="#fff4b0"/>`);

  // ── fig. 2: a mined leaf, and a leaf painted to look mined ────────────────
  const leaf = (x, id) => {
    const b = blade([[x, 766], [x - 4, 700], [x, 630], [x + 6, 590]], { width: (u) => 38 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.8), 0.7), sideVeins: 4, rand });
    paintBlade(b, { id, palette: LEAF, defs, out, margin: 4 });
  };
  leaf(632, "real");
  leaf(740, "forged");
  // the real mine: a pale track widening as the larva grew, a dark dot at its end
  const mine = [[622, 720], [640, 706], [628, 690], [644, 676], [630, 660], [640, 640]];
  out.push(`<path d="${smooth(mine)}" fill="none" stroke="#e8e2b0" stroke-width="5" stroke-linecap="round"/><circle cx="640" cy="640" r="3" fill="#3a3024"/>`);
  // the forged one: the same winding, painted in, no larva at its end
  const forged = mine.map(([x, y]) => [x + 108, y]);
  out.push(`<path d="${smooth(forged)}" fill="none" stroke="#dce8b0" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 0"/>`);
  contact(out, 686, 768, 100, 5, 0.18);

  return { size: SIZE, view: [0, 390, SIZE, 400], defs: defs.join("\n"), body: out.join("\n") };
}
