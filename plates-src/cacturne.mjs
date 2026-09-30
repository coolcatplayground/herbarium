// NO. 0332 — a column, and the breath it takes at night.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the top of a columnar cactus. A tall stem, pale green,
//      ribbed, the ribs set with areoles and short spines, and between them
//      darker diamond-shaped tubercles — the diamond pattern it is known by.
//   2. On its crown a single bud, long and pointed, clad in overlapping
//      scales that flare out at its foot like a brim: the bud of a flower that
//      will open for one night only.
//   3. The field note's point is CAM, the night shift. A cactus keeps its
//      pores shut through the heat of the day, when opening them would cost
//      it its water, and opens them after dark to take in carbon dioxide,
//      banking it as acid until the sun comes up to use it. Fig. 2: one pore
//      of the skin, open under the moon and shut under the sun.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "cacturne";
export const no = 332;
const SIZE = 800;
const BODY = { light: "#dcefc4", base: "#9cc884", deep: "#6a9a5a", shade: "#3a6036", edge: "#3a6036" };
const DIAMOND = "#5e8e4e";
const BUD = { light: "#b8cc88", base: "#7e9a52", deep: "#4e6a34" };

export function draw() {
  const rand = mulberry32(332);
  const defs = standardDefs(332);
  const out = [];
  contact(out, 320, 758, 130, 14);

  const C = makeOrgan({
    x: 320, base: 756, H: 360, R: 84, tilt: 0.12,
    knots: [[0, 1], [0.7, 1], [0.86, 0.94], [0.95, 0.7], [1, 0.3]],
  });
  paintSolid(C, { id: "c", outline: hull(C), palette: BODY, defs, out, hatch: 0 });
  const RIBS = 10;
  for (let k = 0; k < RIBS; k++) {
    const th = -Math.PI + (k / RIBS) * Math.PI * 2;
    const crease = [];
    for (let j = 0; j <= 18; j++) crease.push(C.surface(th, 0.02 + (j / 18) * 0.94, 0.985));
    out.push(`<path d="${smooth(crease)}" fill="none" stroke="${BODY.shade}" stroke-width="1.8" stroke-opacity="0.4" clip-path="url(#cc)"/>`);
  }
  // diamond tubercles between the ribs, darker, and an areole atop each
  const diamonds = [], areoles = [];
  for (let k = 0; k < RIBS; k++) {
    const th = -Math.PI + (k / RIBS) * Math.PI * 2 + Math.PI / RIBS;
    for (let row = 0; row < 7; row++) {
      const t = 0.1 + row * 0.12 + (k % 2 ? 0.06 : 0);
      if (t > 0.86) continue;
      const [lo, hi] = C.range(t);
      if (th < lo + 0.25 || th > hi - 0.25) continue;
      const dt = 0.035, dth = 0.2;
      const p = [C.surface(th, t + dt, 1.006), C.surface(th + dth, t, 1.006), C.surface(th, t - dt, 1.006), C.surface(th - dth, t, 1.006)];
      diamonds.push(`M${p.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" L")} Z`);
      areoles.push(C.surface(th, t + dt * 0.6, 1.01));
    }
  }
  out.push(`<path d="${diamonds.join(" ")}" fill="${DIAMOND}" fill-opacity="0.7" stroke="${BODY.shade}" stroke-width="0.8" clip-path="url(#cc)"/>`);
  const sp = [];
  for (const [x, y] of areoles) {
    out.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="3.2" fill="#f2ecd6" stroke="${INK}" stroke-width="0.7"/>`);
    for (let q = 0; q < 3; q++) {
      const a = -Math.PI / 2 + (q - 1) * 0.8 + (rand() - 0.5) * 0.3 + (x - 320) * 0.004;
      sp.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(a) * 11)},${r1(Math.sin(a) * 11)}`);
    }
  }
  out.push(`<path d="${sp.join(" ")}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="${sp.join(" ")}" stroke="#ece4c6" stroke-width="0.7" stroke-linecap="round"/>`);
  out.push(`<path d="${hull(C)}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);

  // the bud on the crown: long and pointed, scaled, flaring at its foot
  const [bx, by] = C.surface(0, 0.97);
  const brim = [];
  for (let k = 0; k < 9; k++) {
    const a = Math.PI + (k / 8) * Math.PI;
    brim.push(`M${r1(bx + Math.cos(a) * 18)},${r1(by + 2 + Math.sin(a) * 4)} L${r1(bx + Math.cos(a) * 46)},${r1(by + 10 + Math.sin(a) * 8)} L${r1(bx + Math.cos(a + 0.2) * 22)},${r1(by + Math.sin(a) * 4)} Z`);
  }
  out.push(`<path d="${brim.join(" ")}" fill="${BUD.base}" stroke="${INK}" stroke-width="1.2"/>`);
  const bud = `M${bx - 26},${by + 2} C${bx - 30},${by - 50} ${bx - 8},${by - 110} ${bx + 4},${by - 150} C${bx + 12},${by - 110} ${bx + 30},${by - 50} ${bx + 26},${by + 2} Z`;
  defs.push(`<linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${BUD.light}"/><stop offset="0.6" stop-color="${BUD.base}"/><stop offset="1" stop-color="${BUD.deep}"/></linearGradient>`);
  defs.push(`<clipPath id="budc"><path d="${bud}"/></clipPath>`);
  out.push(`<path d="${bud}" fill="url(#bg)"/>`);
  const scales = [];
  for (let row = 0; row < 7; row++) {
    const y = by - 12 - row * 19, w = 24 * (1 - row / 8);
    for (const dx of [-w * 0.5, w * 0.5]) scales.push(`M${r1(bx + dx - 8)},${r1(y)} Q${r1(bx + dx)},${r1(y - 16)} ${r1(bx + dx + 8)},${r1(y)}`);
  }
  out.push(`<path d="${scales.join(" ")}" fill="none" stroke="${BUD.deep}" stroke-width="1.2" clip-path="url(#budc)"/>`);
  out.push(`<path d="${bud}" fill="none" stroke="${INK}" stroke-width="1.8" filter="url(#pen)"/>`);

  // ── fig. 2: one pore, by night and by day ─────────────────────────────────
  const stoma = (x, y, open) => {
    const gap = open ? 7 : 0.8;
    for (const s of [-1, 1]) {
      const d = `M${x},${y - 30} C${x + s * (gap + 26)},${y - 26} ${x + s * (gap + 26)},${y + 26} ${x},${y + 30} C${x + s * (gap + 6)},${y + 18} ${x + s * gap},${y + 8} ${x + s * gap},${y} C${x + s * gap},${y - 8} ${x + s * (gap + 6)},${y - 18} ${x},${y - 30} Z`;
      out.push(`<path d="${d}" fill="#a8d08c" stroke="${INK}" stroke-width="1.3"/>`);
    }
    if (open) out.push(`<ellipse cx="${x}" cy="${y}" rx="${gap - 1}" ry="16" fill="#3a3024"/>`);
  };
  const figFrom = out.length;
  // the moon, and the pore open under it
  out.push(`<path d="M628,610 A16,16 0 1,0 628,642 A12,14 0 1,1 628,610 Z" fill="#f4e7b4" stroke="${INK}" stroke-width="1.2"/>`);
  stoma(630, 700, true);
  // the sun, and the pore shut under it
  out.push(`<circle cx="740" cy="626" r="13" fill="#f2cf3e" stroke="${INK}" stroke-width="1.2"/>`);
  const rays = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; rays.push(`M${r1(740 + Math.cos(a) * 18)},${r1(626 + Math.sin(a) * 18)} l${r1(Math.cos(a) * 8)},${r1(Math.sin(a) * 8)}`); }
  out.push(`<path d="${rays.join(" ")}" stroke="${INK}" stroke-width="1.4"/>`);
  stoma(740, 700, false);
  out.push(`<g transform="translate(686 740) scale(1.3) translate(-686 -740)">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, 686, 744, 110, 5, 0.16);

  return { size: SIZE, view: [0, 220, SIZE, 570], defs: defs.join("\n"), body: out.join("\n") };
}
