// NO. 0762 — a strawberry, and the seeds that make it swell.
//
// What the morphology says, and what each observation became:
//
//   1. The part: the berry. A strawberry hanging from its stalk — white below
//      and flushing to deep red at the shoulder, as a ripening one does from
//      the tip up, studded with its small seeds — and at its crown a spread of
//      long green sepals swept out and down, one standing up. The white body,
//      the red top and the long leafy sepals the specimen wears.
//   2. The field note's record is sepals hard enough to shrug off pecking;
//      sepals are the outermost ring of a flower, and on a strawberry they
//      stay on the fruit as the green ruff.
//   3. The note's point is that the swelling is directed by the seeds. What
//      is eaten is not the fruit but a swollen stem tip; the true fruits are
//      the pips on the outside, and the tissue under each swells only if that
//      pip was fertilised. Strip the pips off, and it stays small. Fig. 2: a
//      berry with every pip, and one with a band of pips removed, pinched in.
import { mulberry32, r1, INK } from "./lib.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact } from "./kit.mjs";

export const slug = "steenee";
export const no = 762;
const SIZE = 800;
const SEPAL = { light: "#d4f0b0", base: "#7cc05a", deep: "#4a8e3e", shade: "#285a22", edge: "#285a22" };

// a strawberry, point down; pinched optionally where its pips were stripped
function berry(out, defs, id, cx, top, W, H, pinch, rand) {
  const pts = [];
  for (let j = 0; j <= 40; j++) {
    const t = j / 40, y = top + t * H;
    let w = W * Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.9)) ** 0.8 * (1 - t * 0.25);
    if (pinch && t > 0.35 && t < 0.6) w *= 0.78;
    pts.push([cx - w, y]);
  }
  const d = `M${pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} ` + [...pts].reverse().map(([x, y]) => `L${r1(2 * cx - x)},${r1(y)}`).join(" ") + " Z";
  defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8243a"/><stop offset="0.35" stop-color="#e05a66"/><stop offset="0.6" stop-color="#fbe8e4"/><stop offset="1" stop-color="#f4f0e4"/></linearGradient>`);
  out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);
  const pips = [];
  for (let k = 0; k < 60 * (W / 100); k++) {
    const t = 0.08 + rand() * 0.84, u = (rand() - 0.5) * 1.6;
    if (pinch && t > 0.35 && t < 0.6) continue;
    const w = W * Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.9)) ** 0.8 * (1 - t * 0.25);
    pips.push(`<ellipse cx="${r1(cx + u * w * 0.8)}" cy="${r1(top + t * H)}" rx="${r1(2 * (W / 100) + 0.6)}" ry="${r1(3 * (W / 100) + 0.8)}" fill="#e8c84a" stroke="#8a6a1e" stroke-width="0.5"/>`);
  }
  out.push(pips.join(""));
}

export function draw() {
  const rand = mulberry32(762);
  const defs = standardDefs(762);
  const out = [];
  contact(out, 320, 758, 150, 14);

  // the stalk it hangs from, arching in from above
  out.push(`<path d="M150,380 C220,360 300,380 320,440" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M150,380 C220,360 300,380 320,440" fill="none" stroke="#6a9a4a" stroke-width="5" stroke-linecap="round"/>`);
  berry(out, defs, "b", 320, 450, 110, 300, false, rand);
  // the long sepals swept out and down from the crown, one standing up
  for (const [a, L] of [[Math.PI + 0.3, 150], [-0.3, 150], [Math.PI + 0.8, 120], [-0.8, 120], [-1.57, 70]]) {
    const pts = [[320, 456], [320 + Math.cos(a) * L * 0.5, 456 + Math.sin(a) * L * 0.3 - 10], [320 + Math.cos(a) * L, 456 + Math.abs(Math.cos(a)) * 60 + Math.sin(a) * 20]];
    const b = blade(pts, { width: (u) => 26 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.95) ** 0.9), 0.7), sideVeins: 3, rand });
    paintBlade(b, { id: `sp${r1(a * 10)}`, palette: SEPAL, defs, out, shade: 0.1, margin: 4 });
  }

  // ── fig. 2: a berry with every pip, and one with a band stripped ──────────
  berry(out, defs, "f1", 636, 640, 40, 110, false, rand);
  berry(out, defs, "f2", 744, 640, 40, 110, true, rand);
  for (const x of [636, 744]) out.push(`<path d="M${x - 24},640 l24,-12 l24,12 M${x},628 l0,-16" fill="none" stroke="#4a8e3e" stroke-width="3" stroke-linecap="round"/>`);
  contact(out, 690, 756, 100, 5, 0.18);

  return { size: SIZE, view: [0, 350, SIZE, 440], defs: defs.join("\n"), body: out.join("\n") };
}
