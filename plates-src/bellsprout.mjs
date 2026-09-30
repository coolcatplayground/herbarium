// NO. 0069 — a bell.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the bell. A single flower, yellow, elongated, widest near
//      its closed crown and narrowing to a flared, pink-lipped mouth, with a
//      short stub of the stalk it nodded from. No stalk, leaves or roots: the
//      bell alone is enough to name it, and the pitcher of NO. 0070 is
//      already a different shape. The trap it will become is not yet a trap.
//   2. The mouth is drawn open and pale inside, a flower's throat — dark,
//      it read as a mouth.
//   3. No fig. 2. The field note's point is root against shoot — a starved
//      plant puts its carbon underground — and a diagram of seedlings with
//      their roots was drawn for it and taken out: the plate is the bell.
import { r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, profileOutline, paintSolid, ring } from "./kit.mjs";

export const slug = "bellsprout";
export const no = 69;
const SIZE = 800;

const YELLOW = { light: "#f8f4b8", base: "#ecea6f", deep: "#c9c24a", shade: "#8f8a2e", edge: "#8a842c" };

// the bell, built upright with its mouth down; the caller lays it over
function bellAt(x, base, s) {
  return makeOrgan({
    x, base, H: 168 * s, R: 60 * s, tilt: -0.34, bendFrom: 0.3, bendMax: 0.55,
    knots: [[0, 0.6], [0.05, 0.5], [0.16, 0.56], [0.4, 0.84], [0.64, 1], [0.84, 0.9], [0.95, 0.56], [1, 0]],
  });
}

function paintBell(out, defs, bell, id, s) {
  paintSolid(bell, { id, outline: profileOutline(bell), palette: YELLOW, defs, out, hatch: s > 0.7 ? 5 : 2, ink: 2.2 * Math.max(0.7, s), tHatch: [0.15, 0.85] });
  const mouth = ring(bell, 0.02, 1);
  out.push(`<path d="${mouth}" fill="#f3e3b0"/><path d="${mouth}" fill="${YELLOW.deep}" fill-opacity="0.45" transform="translate(${r1(3 * s)} ${r1(2 * s)})"/>`);
  out.push(`<path d="${mouth}" fill="none" stroke="#e8a0a8" stroke-width="${r1(7 * s)}"/>`);
  out.push(`<path d="${mouth}" fill="none" stroke="${INK}" stroke-width="${r1(1.4 * Math.max(0.7, s))}"/>`);
}

export function draw() {
  const defs = standardDefs(69);
  const out = [];

  // ── fig. 1: the bell ──────────────────────────────────────────────────────
  // Only the bell, resting on its lip, tipped forward so the mouth shows, with
  // a short stub of the stalk it was cut from. Laid right over on its side,
  // the stub became a handle and the bell a jug.
  const S = 1.6, gx = 390, ground = 756;
  contact(out, gx - 10, 760, 170, 14);
  const bell = bellAt(gx + 20, ground + 14, S);
  const top = bell.surface(0.6, 0.99);
  const stub = [top, [top[0] + 10, top[1] - 22], [top[0] + 30, top[1] - 34], [top[0] + 50, top[1] - 28]];
  const sd = smooth(stub);
  out.push(`<path d="${sd}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="butt"/><path d="${sd}" fill="none" stroke="#9a8a5c" stroke-width="10" stroke-linecap="butt"/>`);
  out.push(`<path d="${sd}" fill="none" stroke="#cdbf90" stroke-width="3" transform="translate(-1.2 -1.2)"/>`);
  const [ex, ey] = stub.at(-1);
  out.push(`<ellipse cx="${r1(ex)}" cy="${r1(ey)}" rx="3.6" ry="6" transform="rotate(-20 ${r1(ex)} ${r1(ey)})" fill="#e9e0bf" stroke="${INK}" stroke-width="1.2"/>`);
  // tipped forward about its crown, the mouth turned out toward us
  const bellFrom = out.length;
  paintBell(out, defs, bell, "a", S);
  out.push(`<g transform="rotate(24 ${r1(top[0])} ${r1(top[1])})">${out.splice(bellFrom).join("\n")}</g>`);

  return { size: SIZE, view: [150, 410, 480, 380], defs: defs.join("\n"), body: out.join("\n") };
}
