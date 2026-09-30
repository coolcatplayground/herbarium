// NO. 0002 — the bud, and the leaves that decide when it opens.
//
// The same organ as NO. 0001, a stage on. What the morphology says, and what
// each observation became:
//
//   1. The store has become a bud. The broad green scales of the bulb have
//      parted and pulled back into a calyx at its foot, and what they were
//      closed over is out: a tall pink flower bud, its petals still wrapped
//      tight, their tips just beginning to fray apart at the top. Pre-anthesis
//      — the moment before opening.
//   2. It is ringed by four large leaves, deeply toothed, each lobe leaning
//      toward the tip. These are not decoration. The field note's point is that
//      the leaves do the measuring: they read the length of the night, and the
//      bud opens on a signal they send up to it. So the leaves are drawn as the
//      working organs they are, with the veins that carry the verdict.
//   3. Fig. 2 cuts the bud open. The flower that was a folded speck inside the
//      corm at NO. 0001 is now nearly finished inside its petals — stamens
//      with their anthers, the pistil at the centre — waiting on the leaves.
import { mulberry32, r1, smooth, watercolour, blur, handInk, INK } from "./lib.mjs";
import { makeOrgan, makeScales, paintScales, attachmentPlate } from "./organ.mjs";
import { blade, paintBlade } from "./parts.mjs";

export const slug = "ivysaur";
export const no = 2;
const SIZE = 800;

// ── the bud ─────────────────────────────────────────────────────────────────
const B = { x: 336, base: 722, H: 344, R: 112, tilt: 0.2, bendFrom: 0.62, bendMax: 0.22 };
const BUD = makeOrgan({
  ...B,
  knots: [
    [0, 0.5], [0.1, 0.8], [0.26, 0.96], [0.42, 1], [0.58, 0.95],
    [0.72, 0.8], [0.84, 0.58], [0.93, 0.32], [1, 0],
  ],
});
// five petals, wrapped; their tips fray apart near the top
const PETALS = makeScales(BUD, {
  n: 5, phi0: -0.22, w0: 0.92, fray: 0.07,
  tEnd: (theta, k, back) => (back ? 1 : [0.975, 0.99, 0.985, 1, 0.97][k]),
});
// the bulb's scales, parted and pulled back into a calyx round the foot
const SEPALS = makeScales(BUD, {
  n: 4, phi0: 0.42, w0: 0.9, grow: 1.07,
  tEnd: (theta, k) => [0.34, 0.3, 0.36, 0.32][k],
});

// ── colour ───────────────────────────────────────────────────────────────────
const PINK = { light: "#f4b9c1", base: "#dc7684", deep: "#ad5068", shade: "#7a3448", edge: "#8e3c52", cast: "#4a1826" };
const GREEN = { light: "#d4eba6", base: "#93c779", deep: "#4f8b58", shade: "#2c5a3c", edge: "#35684a", cast: "#173222" };
const LEAF = { light: "#9cc98a", base: "#4f8b56", deep: "#33663f", shade: "#1f4229", edge: "#1d3d27" };

// ── the leaves ───────────────────────────────────────────────────────────────
// Four broad fronds with rounded lobes, arching out from behind the bud's
// foot like a fountain: two spread low and wide with their tips dropping, two
// rise behind and bend outward. A first draft had them narrow, saw-toothed
// and radiating like spokes — which reads, unmistakably, as the wrong plant.
const LEAVES = [
  { id: "l3", spine: [[318, 600], [282, 510], [230, 444], [168, 406], [114, 400]], w: 46, lobes: 10 },
  { id: "l4", spine: [[356, 600], [398, 506], [454, 440], [518, 402], [570, 398]], w: 46, lobes: 10 },
  { id: "l1", spine: [[300, 664], [230, 638], [152, 628], [86, 640], [38, 672]], w: 56, lobes: 10 },
  { id: "l2", spine: [[372, 664], [448, 634], [526, 622], [592, 634], [640, 666]], w: 56, lobes: 10 },
];

export function draw() {
  const rand = mulberry32(2);
  const defs = [
    watercolour("wc", 12, { warp: 6 }),
    watercolour("wc2", 24, { warp: 4, grain: 0.4 }),
    blur("soft", 3.2), blur("wide", 11), blur("sheen", 9),
    handInk("pen", 6),
  ];
  const out = [];

  // contact shadow, under the bud only: the leaves arch clear of the floor
  out.push(`<ellipse cx="${B.x}" cy="${B.base + 26}" rx="190" ry="20" fill="#1c140c" fill-opacity="0.24" filter="url(#wide)"/>`);

  // the leaves, behind the bud — no blurred shadow round them, which on a
  // transparent ground reads as a glow, not a shadow
  for (const L of LEAVES) {
    const b = blade(L.spine, {
      // narrow at the stalk, broad through the middle, a blunt point
      width: (u) => L.w * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + u * 0.93) ** 0.7), 0.7) * (u < 0.1 ? 0.35 + 6.5 * u : 1),
      lobes: L.lobes, depth: 0.36, lean: 0.7, start: 0.12, rand, teeth: "round",
    });
    const shade = L.id === "l2" ? 0.35 : L.id === "l4" ? 0.25 : 0.05;
    paintBlade(b, { id: L.id, palette: LEAF, defs, out, shade, margin: 6 });
  }

  // the old attachment plate, and the bud standing on it
  attachmentPlate(BUD, { rand, defs, out, flare: 1.08, depth: 12 });
  const silhouette = BUD.silhouette();
  defs.push(`<clipPath id="sil"><path d="${silhouette}"/></clipPath>`);
  // inner petals, deeper in shadow, where the outer ones part at the tip
  defs.push(
    `<linearGradient id="inner" gradientUnits="userSpaceOnUse" x1="${B.x - 90}" y1="${B.base - 360}" x2="${B.x + 90}" y2="${B.base - 100}">` +
      `<stop offset="0" stop-color="#c25d74"/><stop offset="1" stop-color="${PINK.shade}"/></linearGradient>`,
  );
  out.push(`<path d="${silhouette}" fill="url(#inner)"/>`);
  paintScales(BUD, PETALS, {
    id: "p", palette: PINK, rand, defs, out,
    gradient: [-110, -360, 120, 0], sheen: [12, 60, 0.46], margin: 6,
    veins: [-0.7, -0.45, -0.22, 0.22, 0.45, 0.7], midrib: false,
  });
  // contour hatching down the shadowed side of the bud
  for (let k = 0; k < 5; k++) {
    const inset = 0.06 + k * 0.08;
    const pts = [];
    for (let j = 0; j <= 12; j++) {
      const t = 0.12 + k * 0.03 + (0.62 - k * 0.07) * (j / 12);
      pts.push(BUD.surface(BUD.range(t)[1] - inset, t));
    }
    out.push(`<path d="${smooth(pts)}" fill="none" stroke="${INK}" stroke-opacity="${r1(0.3 - k * 0.05)}" stroke-width="1" stroke-linecap="round"/>`);
  }
  out.push(`<g filter="url(#pen)"><path d="${silhouette}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
    `<path d="${silhouette}" fill="none" stroke="${INK}" stroke-opacity="0.5" stroke-width="2" transform="translate(1.4 1.2)"/></g>`);
  // the calyx: the bulb's green scales, pulled back round the foot
  paintScales(BUD, SEPALS, {
    id: "s", palette: GREEN, rand, defs, out,
    gradient: [-120, -120, 120, 0], sheen: false, margin: 5,
    veins: [-0.5, -0.2, 0.2, 0.5], silClip: "sil",
  });

  out.push(...section(defs, rand));
  return { size: SIZE, view: [0, 290, SIZE, 508], defs: defs.join("\n"), body: out.join("\n") };
}

// ── fig. 2: the bud cut open ─────────────────────────────────────────────────
function section(defs, rand) {
  const S = { x: 684, base: 772, s: 0.6 };
  const out = [];
  const Rs = B.R * S.s;
  const outline = (inset, tMax = 1) => {
    const right = [], left = [];
    for (let i = 0; i <= 60; i++) {
      const t = (i / 60) * tMax;
      const w = B.R * BUD.shape(t) * S.s - inset;
      if (w <= 0) break;
      const [ax, ay, phi] = BUD.spineAt(t);
      const cx = S.x + ax * S.s, cy = S.base - ay * S.s - inset * 0.7;
      right.push([cx + w * Math.cos(phi), cy + w * Math.sin(phi)]);
      left.push([cx - w * Math.cos(phi), cy - w * Math.sin(phi)]);
    }
    return smooth(right) + smooth([...left].reverse(), false, { move: false }) + " Z";
  };
  const at = (t, f) => {
    const [ax, ay, phi] = BUD.spineAt(t);
    const w = B.R * BUD.shape(t) * S.s * f;
    return [S.x + ax * S.s + w * Math.cos(phi), S.base - ay * S.s + w * Math.sin(phi)];
  };

  out.push(`<ellipse cx="${S.x + 4}" cy="${S.base + 10}" rx="${Rs * 1.3}" ry="10" fill="#1c140c" fill-opacity="0.3" filter="url(#wide)"/>`);
  // the far half, seen past the cut
  out.push(`<g transform="translate(8 -4)"><path d="${outline(0)}" fill="${PINK.deep}"/><path d="${outline(0)}" fill="none" stroke="${INK}" stroke-width="1.6"/></g>`);
  // petals, layer inside layer, folded over the flower
  const layers = [[0, PINK.base], [4, "#f2c4cb"], [6.5, PINK.base], [10, "#f6d3d8"], [12.5, "#e59aa6"]];
  for (const [inset, c] of layers) out.push(`<path d="${outline(inset)}" fill="${c}"/>`);
  defs.push(`<linearGradient id="hollow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbeef0"/><stop offset="1" stop-color="#f3dcc9"/></linearGradient>`);
  out.push(`<path d="${outline(15)}" fill="url(#hollow)" filter="url(#wc2)"/>`);
  defs.push(`<clipPath id="hollowclip"><path d="${outline(15)}"/></clipPath>`);

  // The receptacle: a flat, fleshy floor right across the base, not a dome —
  // a dome under a round ovary read as shoulders under a head.
  const [rx0, ry0] = at(0.1, 0);
  const [fl] = at(0.1, -0.78), [fr] = at(0.1, 0.78);
  out.push(`<path d="M${r1(fl)},${r1(ry0 + 2)} C${r1(fl + 10)},${r1(ry0 - 5)} ${r1(fr - 10)},${r1(ry0 - 5)} ${r1(fr)},${r1(ry0 + 2)} L${r1(fr)},${r1(ry0 + 10)} L${r1(fl)},${r1(ry0 + 10)} Z" fill="#c9dfa2" stroke="${INK}" stroke-width="0.9" stroke-opacity="0.6" clip-path="url(#hollowclip)"/>`);

  // stamens: filaments, and anthers heavy with pollen not yet shed
  const [cx, cy] = at(0.5, 0);
  for (let k = 0; k < 6; k++) {
    const f = -0.62 + (k / 5) * 1.24;
    const [bx, by] = [rx0 + f * 16, ry0 - 8];
    const [tx, ty] = at(0.6 + Math.abs(f) * -0.08, f * 0.55);
    out.push(`<path d="M${r1(bx)},${r1(by)} Q${r1((bx + tx) / 2 + f * 6)},${r1((by + ty) / 2)} ${r1(tx)},${r1(ty + 8)}" fill="none" stroke="#9aa66a" stroke-width="1.2" clip-path="url(#hollowclip)"/>`);
    out.push(`<ellipse cx="${r1(tx)}" cy="${r1(ty)}" rx="3.2" ry="8.5" transform="rotate(${r1(f * 16)} ${r1(tx)} ${r1(ty)})" fill="#e9c24c" stroke="${INK}" stroke-width="0.8" clip-path="url(#hollowclip)"/>`);
  }
  // The pistil, drawn as one flask: a swollen ovary narrowing without a break
  // into the style, a small stigma at its head, and the ovules inside it.
  const oy = ry0 - 2;
  out.push(`<path d="M${r1(rx0 - 12)},${r1(oy)} C${r1(rx0 - 15)},${r1(oy - 20)} ${r1(rx0 - 5)},${r1(oy - 28)} ${r1(rx0 - 2.2)},${r1(oy - 38)} ` +
    `C${r1(rx0 - 1.6)},${r1(cy + 20)} ${r1(cx - 1.6)},${r1(cy)} ${r1(cx - 1.4)},${r1(cy - 10)} L${r1(cx + 1.4)},${r1(cy - 10)} ` +
    `C${r1(cx + 1.6)},${r1(cy)} ${r1(rx0 + 1.6)},${r1(cy + 20)} ${r1(rx0 + 2.2)},${r1(oy - 38)} ` +
    `C${r1(rx0 + 5)},${r1(oy - 28)} ${r1(rx0 + 15)},${r1(oy - 20)} ${r1(rx0 + 12)},${r1(oy)} Z" fill="#a3c97f" stroke="${INK}" stroke-width="1"/>`);
  for (let k = 0; k < 4; k++) out.push(`<ellipse cx="${r1(rx0 - 4.5 + (k % 2) * 9)}" cy="${r1(oy - 8 - Math.floor(k / 2) * 8)}" rx="2.2" ry="2.8" fill="#eef6d9" stroke="${INK}" stroke-width="0.5" stroke-opacity="0.6"/>`);
  out.push(`<path d="M${r1(cx - 5)},${r1(cy - 9)} C${r1(cx - 6)},${r1(cy - 16)} ${r1(cx + 6)},${r1(cy - 16)} ${r1(cx + 5)},${r1(cy - 9)} Z" fill="#7fa95e" stroke="${INK}" stroke-width="0.8"/>`);

  // the calyx in section: the old green scales at the foot
  const calyx = (sgn) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = (i / 12) * 0.34;
      pts.push(at(t, sgn * (1.07 + 0.05 * (i / 12))));
    }
    return pts;
  };
  for (const sgn of [1, -1]) {
    const edge = calyx(sgn);
    const inner = edge.map(([px, py], i) => [px - sgn * (7 - i * 0.45), py]);
    const d = smooth(edge) + smooth([...inner].reverse(), false, { move: false }) + " Z";
    out.push(`<path d="${d}" fill="${GREEN.base}" stroke="${INK}" stroke-width="1.2"/>`);
  }

  out.push(`<path d="${outline(15)}" fill="none" stroke="${INK}" stroke-opacity="0.5" stroke-width="0.9"/>`);
  for (const inset of [4, 6.5, 10, 12.5]) out.push(`<path d="${outline(inset)}" fill="none" stroke="${INK}" stroke-opacity="0.3" stroke-width="0.7"/>`);
  out.push(`<path d="${outline(0)}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`);
  void rand;
  return out;
}
