// NO. 0044 — the carrion flower.
//
// What the morphology says, and what each observation became:
//
//   1. The same indigo tuber as NO. 0043, set down without its roots; the
//      crown has become a flower.
//   2. The flower is heavy: four thick, rounded petals clustered in a dome
//      round a dark centre, rust-brown freckled cream, and from beneath them
//      long orange leaves that curl as they hang. The field note files it
//      with the carrion flowers — Stapelia, Amorphophallus — whose colour
//      and smell are built to pass for something dead. Drawn as a flower,
//      not as what it imitates: an earlier version wrinkled and fringed the
//      petals and turned the leaves to ribbons, and the plate read as flesh.
//   3. It drips. A drop of nectar hangs from the front petal.
//   4. Fig. 2 is who the smell is for: a blowfly, landed on a petal. These
//      flowers are convincing enough that the flies lay their eggs on them.
import { mulberry32, r1, smooth, mix, INK } from "./lib.mjs";
import { makeOrgan } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";
import { standardDefs, contact, hull, paintSolid } from "./kit.mjs";

export const slug = "gloom";
export const no = 44;
const SIZE = 800;

const INDIGO = { light: "#a9c0d6", base: "#5b7ea2", deep: "#3c5b82", shade: "#23385a", edge: "#1f3450" };
const MAROON = { light: "#d9937a", base: "#a8543f", deep: "#7a3326", shade: "#4e1e16", edge: "#4a1c14" };
const RIBBON = { light: "#f7c29a", base: "#e2804f", deep: "#b35632", shade: "#7a3a1e", edge: "#7a3a1e" };

// A fleshy lobe: an irregular cushion, bulging, its rim not quite regular.
function lobe(cx, cy, rx, ry, rot, rand) {
  const pts = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    const w = 1 + 0.05 * Math.sin(a * 3 + rot * 5) + (rand() - 0.5) * 0.03;
    const x = Math.cos(a) * rx * w, y = Math.sin(a) * ry * w;
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return pts;
}

function paintLobe(pts, { id, cx, cy, rx, ry, rot, defs, out, rand, centre = [cx, cy + ry] }) {
  const d = smooth(pts, true);
  defs.push(
    `<radialGradient id="${id}g" cx="${r1(cx - rx * 0.35)}" cy="${r1(cy - ry * 0.4)}" r="${r1(Math.max(rx, ry) * 1.3)}" gradientUnits="userSpaceOnUse">` +
      `<stop offset="0" stop-color="${MAROON.light}"/><stop offset="0.5" stop-color="${MAROON.base}"/><stop offset="1" stop-color="${MAROON.deep}"/></radialGradient>`,
  );
  defs.push(`<clipPath id="${id}c"><path d="${d}"/></clipPath>`);
  out.push(`<path d="${d}" fill="${MAROON.base}"/><path d="${d}" fill="url(#${id}g)" filter="url(#wc)"/>`);
  // veins, fanning out from where the petal joins the flower
  const [ox, oy] = centre;
  const wr = [];
  for (let k = 0; k < 9; k++) {
    const a = Math.atan2(cy - oy, cx - ox) + (k / 8 - 0.5) * 1.5;
    const L = Math.max(rx, ry) * 2.2;
    wr.push(`<path d="M${r1(ox)},${r1(oy)} Q${r1(ox + Math.cos(a) * L * 0.5 + Math.sin(k) * 4)},${r1(oy + Math.sin(a) * L * 0.5)} ${r1(ox + Math.cos(a) * L)},${r1(oy + Math.sin(a) * L)}"/>`);
  }
  out.push(`<g clip-path="url(#${id}c)" fill="none" stroke="${MAROON.shade}" stroke-opacity="0.3" stroke-width="1">${wr.join("")}</g>`);
  // pale mottling
  const sp = [];
  for (let s = 0; s < 18; s++) {
    const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * 0.8;
    const x = Math.cos(a) * rx * rr, y = Math.sin(a) * ry * rr;
    const px = cx + x * Math.cos(rot) - y * Math.sin(rot), py = cy + x * Math.sin(rot) + y * Math.cos(rot);
    sp.push(`<ellipse cx="${r1(px)}" cy="${r1(py)}" rx="${r1(2.5 + rand() * 3.5)}" ry="${r1(2 + rand() * 2.5)}" transform="rotate(${r1(rand() * 180)} ${r1(px)} ${r1(py)})"/>`);
  }
  out.push(`<g clip-path="url(#${id}c)" fill="#f0d49c" fill-opacity="0.75">${sp.join("")}</g>`);
  out.push(`<g filter="url(#pen)"><path d="${d}" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="1.7" transform="translate(1.2 1.1)" clip-path="url(#${id}c)"/></g>`);
}

export function draw() {
  const rand = mulberry32(44);
  const defs = standardDefs(44);
  const out = [];

  // Scaled up about its foot: a compact subject beside its fig. 2 otherwise
  // sits small in its case next to the others.
  const mainFrom = out.length;
  const T = makeOrgan({
    x: 318, base: 756, H: 226, R: 128, tilt: 0.2,
    knots: [[0, 0.34], [0.08, 0.7], [0.22, 0.93], [0.42, 1], [0.62, 0.93], [0.8, 0.68], [0.92, 0.36], [1, 0]],
  });
  contact(out, 318, 760, 160, 18);
  paintSolid(T, { id: "t", outline: hull(T), palette: INDIGO, defs, out, hatch: 6 });

  const [cx, cy0] = T.surface(0, 0.93);
  const cy = cy0 - 8;

  // the ribbons, hanging and curling, two to a side
  const RIBS = [
    [[cx - 40, cy + 10], [cx - 112, cy + 18], [cx - 150, cy + 70], [cx - 146, cy + 130], [cx - 118, cy + 150], [cx - 108, cy + 128]],
    [[cx - 30, cy + 20], [cx - 70, cy + 60], [cx - 88, cy + 120], [cx - 74, cy + 168], [cx - 50, cy + 170], [cx - 52, cy + 150]],
    [[cx + 40, cy + 10], [cx + 116, cy + 16], [cx + 156, cy + 66], [cx + 154, cy + 128], [cx + 128, cy + 150], [cx + 116, cy + 130]],
    [[cx + 30, cy + 20], [cx + 72, cy + 56], [cx + 92, cy + 116], [cx + 80, cy + 164], [cx + 56, cy + 168], [cx + 56, cy + 148]],
  ];
  RIBS.forEach((sp, i) => {
    const b = blade(sp, { width: (u) => 19 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.04 + u * 0.96) ** 0.7), 0.8) + 0.8, sideVeins: 6, rand });
    paintBlade(b, { id: `r${i}`, palette: RIBBON, defs, out, shade: i % 2 ? 0.2 : 0, margin: 4, ink: 1.4, veinOpacity: 0.45 });
  });

  // the four lobes: the far one first, the near one last
  const L = [
    { dx: 0, dy: -44, rx: 66, ry: 44, rot: 0, outer: [0, -1] },
    { dx: -62, dy: -4, rx: 58, ry: 50, rot: 0.3, outer: [-1, 0] },
    { dx: 62, dy: -4, rx: 58, ry: 50, rot: -0.3, outer: [1, 0] },
    { dx: 0, dy: 34, rx: 70, ry: 48, rot: 0, outer: [0, 1] },
  ];
  // the dark centre, sunk between them, with its pale corona
  out.push(`<ellipse cx="${cx}" cy="${cy - 6}" rx="40" ry="26" fill="#6a3322"/>`);
  L.slice(0, 3).forEach((l, i) => paintLobe(lobe(cx + l.dx, cy + l.dy, l.rx, l.ry, l.rot, rand), { id: `b${i}`, cx: cx + l.dx, cy: cy + l.dy, rx: l.rx, ry: l.ry, rot: l.rot, defs, out, rand, centre: [cx, cy - 4] }));
  out.push(`<ellipse cx="${cx}" cy="${cy - 4}" rx="22" ry="13" fill="#5a2a1c" stroke="#e8c48a" stroke-width="4"/>`);
  out.push(`<ellipse cx="${cx}" cy="${cy - 4}" rx="22" ry="13" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
  const l3 = L[3];
  paintLobe(lobe(cx + l3.dx, cy + l3.dy, l3.rx, l3.ry, l3.rot, rand), { id: "b3", cx: cx + l3.dx, cy: cy + l3.dy, rx: l3.rx, ry: l3.ry, rot: 0, defs, out, rand, centre: [cx, cy - 4] });

  // the drop of nectar hanging from the front lobe
  const dx0 = cx + 14, dy0 = cy + 78;
  const drop = `M${dx0 - 3},${dy0} C${dx0 - 3},${dy0 + 9} ${dx0 - 8},${dy0 + 15} ${dx0 - 8},${dy0 + 21} C${dx0 - 8},${dy0 + 30} ${dx0 + 8},${dy0 + 30} ${dx0 + 8},${dy0 + 21} C${dx0 + 8},${dy0 + 15} ${dx0 + 3},${dy0 + 9} ${dx0 + 3},${dy0} Z`;
  out.push(`<path d="${drop}" fill="#f3d98a" fill-opacity="0.85" stroke="${INK}" stroke-width="1.2"/>`);
  out.push(`<ellipse cx="${dx0 - 3}" cy="${dy0 + 19}" rx="2" ry="3.4" fill="#ffffff" fill-opacity="0.9"/>`);

  out.push(`<g transform="translate(318 760) scale(1.22) translate(-318 -760)">${out.splice(mainFrom).join("\n")}</g>`);

  // ── fig. 2: a blowfly, landed on a petal ──────────────────────────────────
  const fx = 692, fy = 720;
  const piece = lobe(fx, fy, 62, 30, -0.1, rand);
  paintLobe(piece, { id: "f", cx: fx, cy: fy, rx: 62, ry: 30, rot: -0.1, defs, out, rand, centre: [fx - 70, fy + 20] });
  const figFrom = out.length;
  const qx = fx + 4, qy = fy - 16;
  // legs
  const legs = [[-10, 2, -22, 14], [-2, 4, -8, 18], [6, 3, 14, 17], [-12, 1, -28, 6], [8, 2, 24, 10], [0, 4, 4, 19]];
  out.push(`<path d="${legs.map(([x0, y0, x1, y1]) => `M${qx + x0},${qy + y0} Q${qx + (x0 + x1) / 2},${qy + Math.min(y0, y1) - 6} ${qx + x1},${qy + y1}`).join(" ")}" fill="none" stroke="${INK}" stroke-width="1.3"/>`);
  // abdomen, metallic blue-green; thorax; head with its red eyes
  defs.push(`<radialGradient id="fly" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#9fd0c4"/><stop offset="0.5" stop-color="#2f7a78"/><stop offset="1" stop-color="#1c3e48"/></radialGradient>`);
  out.push(`<ellipse cx="${qx + 14}" cy="${qy}" rx="17" ry="11" fill="url(#fly)" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<ellipse cx="${qx - 6}" cy="${qy - 2}" rx="10" ry="9" fill="#2c4a44" stroke="${INK}" stroke-width="1.3"/>`);
  out.push(`<circle cx="${qx - 18}" cy="${qy - 1}" r="7" fill="#b8402e" stroke="${INK}" stroke-width="1.2"/><circle cx="${qx - 20}" cy="${qy - 3}" r="2" fill="#f2c9b8"/>`);
  // wings, folded back over the body, clear, with a few veins
  for (const [rot, dy] of [[-14, -8], [-4, -5]]) {
    out.push(`<ellipse cx="${qx + 20}" cy="${qy + dy}" rx="22" ry="8" transform="rotate(${rot} ${qx + 6} ${qy - 4})" fill="#eef4f6" fill-opacity="0.6" stroke="${INK}" stroke-width="0.9"/>`);
  }
  out.push(`<path d="M${qx + 2},${qy - 6} l30,-8 M${qx + 4},${qy - 4} l30,-3" fill="none" stroke="${INK}" stroke-width="0.5" stroke-opacity="0.6"/>`);
  out.push(`<g transform="translate(${qx} ${qy + 18}) scale(1.35) translate(${-qx} ${-(qy + 18)})">${out.splice(figFrom).join("\n")}</g>`);
  contact(out, fx, fy + 34, 66, 7, 0.26);

  void mix;
  return { size: SIZE, view: [0, 276, SIZE, 512], defs: defs.join("\n"), body: out.join("\n") };
}
