// NO. 0331 — a barrel, and the pleats that let it fill.
//
// What the morphology says, and what each observation became:
//
//   1. One part: the barrel. A round cactus, bright green, ribbed from its
//      foot to its crown, each rib studded with areoles — the felted pads a
//      cactus's spines grow from — and each areole with its cluster of stout
//      spines, dark-tipped.
//   2. At the crown, a ring of yellow flowers: the barrel cacti bloom in a
//      circle round the top, and the field note records one yellow flower a
//      year.
//   3. The field note's point is that storage is the easy half and filling
//      it fast is the hard one. The ribs are pleats: after rain the stem
//      swells and the folds open out, and it can take on a great deal of
//      water in days. Fig. 2: the same stem cut across, dry and pleated
//      deep, and after rain, the pleats let out nearly round.
import { mulberry32, r1, smooth, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "cacnea";
export const no = 331;
const SIZE = 800;
const BODY = { light: "#d0ecb0", base: "#86bf6c", deep: "#548c48", shade: "#2e5a2c", edge: "#2e5a2c" };
const FLOWER = { light: "#fff3a8", base: "#f2cf3e", deep: "#c89a1c" };

// a cluster of spines from one areole, radiating outward from the surface
function areole(out, x, y, nx, ny, rand, s = 1) {
  out.push(`<ellipse cx="${r1(x)}" cy="${r1(y)}" rx="${r1(4.6 * s)}" ry="${r1(3.6 * s)}" fill="#f2ecd6" stroke="${INK}" stroke-width="0.8"/>`);
  const sp = [];
  for (let k = 0; k < 4; k++) {
    const a = Math.atan2(ny, nx) + (k - 1.5) * 0.45 + (rand() - 0.5) * 0.2;
    const L = (14 + rand() * 10) * s;
    sp.push(`M${r1(x)},${r1(y)} l${r1(Math.cos(a) * L)},${r1(Math.sin(a) * L)}`);
  }
  out.push(`<path d="${sp.join(" ")}" stroke="${INK}" stroke-width="${r1(2.2 * s)}" stroke-linecap="round"/><path d="${sp.join(" ")}" stroke="#e8e0c0" stroke-width="${r1(1.1 * s)}" stroke-linecap="round"/>`);
}

export function draw() {
  const rand = mulberry32(331);
  const defs = standardDefs(331);
  const out = [];
  contact(out, 320, 758, 200, 16);

  const B = makeOrgan({
    x: 320, base: 752, H: 270, R: 164, tilt: 0.28,
    knots: [[0, 0.74], [0.12, 0.94], [0.4, 1], [0.66, 0.94], [0.84, 0.74], [0.95, 0.42], [1, 0.12]],
  });
  paintSolid(B, { id: "b", outline: hull(B), palette: BODY, defs, out, hatch: 0 });
  // the ribs: a crease between each, and a highlight along each crest
  const RIBS = 14;
  for (let k = 0; k < RIBS; k++) {
    const th = -Math.PI + (k / RIBS) * Math.PI * 2;
    const crease = [], crest = [];
    for (let j = 0; j <= 16; j++) {
      const t = 0.03 + (j / 16) * 0.92;
      crease.push(B.surface(th, t, 0.985));
      crest.push(B.surface(th + Math.PI / RIBS, t, 1.01));
    }
    out.push(`<path d="${smooth(crease)}" fill="none" stroke="${BODY.shade}" stroke-width="2" stroke-opacity="0.45" clip-path="url(#bc)"/>`);
    out.push(`<path d="${smooth(crest)}" fill="none" stroke="${BODY.light}" stroke-width="2.4" stroke-opacity="0.45" clip-path="url(#bc)"/>`);
  }
  out.push(`<path d="${hull(B)}" fill="none" stroke="${INK}" stroke-width="2.2" filter="url(#pen)"/>`);
  // areoles along the crests of the ribs facing us
  for (let k = 0; k < RIBS; k++) {
    const th = -Math.PI + (k / RIBS) * Math.PI * 2 + Math.PI / RIBS;
    for (const t of [0.14, 0.36, 0.58, 0.78]) {
      const [lo, hi] = B.range(t);
      if (th < lo + 0.2 || th > hi - 0.2) continue;
      const [x, y] = B.surface(th, t, 1.01);
      const [nx0, ny0] = B.surface(th, t, 1.3);
      areole(out, x, y, nx0 - x, ny0 - y, rand, 0.9 + t * 0.2);
    }
  }
  // the ring of yellow flowers at the crown
  const [cx, cy] = B.surface(0, 1);
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2;
    const fx = cx + Math.cos(a) * 52, fy = cy + 6 + Math.sin(a) * 18;
    if (Math.sin(a) > 0.3) continue;
    const pet = [];
    for (let q = 0; q < 8; q++) {
      const qa = (q / 8) * Math.PI * 2;
      pet.push(`<ellipse cx="${r1(fx + Math.cos(qa) * 9)}" cy="${r1(fy - 8 + Math.sin(qa) * 6)}" rx="8" ry="4.4" transform="rotate(${r1((qa * 180) / Math.PI)} ${r1(fx + Math.cos(qa) * 9)} ${r1(fy - 8 + Math.sin(qa) * 6)})" fill="${FLOWER.base}" stroke="${INK}" stroke-width="0.9"/>`);
    }
    out.push(pet.join("") + `<circle cx="${r1(fx)}" cy="${r1(fy - 8)}" r="5" fill="${FLOWER.deep}" stroke="${INK}" stroke-width="0.8"/>`);
  }
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2;
    if (Math.sin(a) <= 0.3) continue;
    const fx = cx + Math.cos(a) * 52, fy = cy + 6 + Math.sin(a) * 18;
    const pet = [];
    for (let q = 0; q < 8; q++) {
      const qa = (q / 8) * Math.PI * 2;
      pet.push(`<ellipse cx="${r1(fx + Math.cos(qa) * 10)}" cy="${r1(fy - 8 + Math.sin(qa) * 7)}" rx="9" ry="5" transform="rotate(${r1((qa * 180) / Math.PI)} ${r1(fx + Math.cos(qa) * 10)} ${r1(fy - 8 + Math.sin(qa) * 7)})" fill="${FLOWER.light}" stroke="${INK}" stroke-width="0.9"/>`);
    }
    out.push(pet.join("") + `<circle cx="${r1(fx)}" cy="${r1(fy - 8)}" r="5.6" fill="${FLOWER.deep}" stroke="${INK}" stroke-width="0.8"/>`);
  }

  // ── fig. 2: dry and pleated, then after rain ──────────────────────────────
  const section = (x, y, R, depth, id) => {
    const pts = [];
    for (let j = 0; j < 14 * 8; j++) {
      const a = (j / (14 * 8)) * Math.PI * 2;
      const r = R * (1 - depth * (0.5 - 0.5 * Math.cos(a * 14)));
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
    }
    const d = smooth(pts, true);
    defs.push(`<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#e8f4d2"/><stop offset="0.7" stop-color="#b8dc98"/><stop offset="1" stop-color="${BODY.base}"/></radialGradient>`);
    out.push(`<path d="${d}" fill="url(#${id})" stroke="${INK}" stroke-width="1.6" filter="url(#pen)"/>`);
    out.push(`<circle cx="${x}" cy="${y}" r="${r1(R * 0.3)}" fill="none" stroke="${BODY.deep}" stroke-width="1" stroke-dasharray="3 3"/>`);
  };
  section(620, 700, 46, 0.34, "dry");
  section(724, 696, 54, 0.08, "wet");
  out.push(`<path d="M658,700 L680,700" stroke="${INK}" stroke-width="1.4"/><path d="M674,695 L680,700 L674,705" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  contact(out, 672, 760, 100, 6, 0.18);

  return { size: SIZE, view: [0, 400, SIZE, 390], defs: defs.join("\n"), body: out.join("\n") };
}
