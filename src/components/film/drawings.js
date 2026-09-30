// The three plates the introduction draws, as data rather than markup.
//
// Each plate is a list of layers in paint order. A layer is one of:
//
//   wash    a soft colour fill, printed slightly off-register from the ink the
//           way a hand-coloured lithograph is — it fades in after the lines;
//           `alpha` thins it where the subject is meant to be see-through
//   shade   a flat dark fill at low opacity: the inside of a mouth, a shadow
//   ink     a line that draws itself on, in order
//   fine    a lighter line (hatching, veins, fibres) that draws with the ink
//   back    a line behind the subject, drawn fainter
//   dots    stipple, given as a list of [x, y, r]
//   fig     a small italic caption set in the plate, "fig. 1"
//
// Data, not JSX, so that the film and the preview script that renders these
// to PNG for review read exactly the same source.
//
// The subjects are the botanical PART each specimen is built on, never the
// creature — the same rule as the specimen plates. A crocus corm is a crocus
// corm. Anybody who knows the games will know which specimen carries one;
// nobody's artwork is being redrawn.

// ── a seeded random source, so the generated plates are identical on every
// load and in every render ────────────────────────────────────────────────────
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

// Catmull-Rom through the points, emitted as cubic Béziers. Used for anything
// generated, so a generated line is as smooth as a hand-set one.
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])},${r1(c1[1])} ${r1(c2[0])},${r1(c2[1])} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return d;
}

const ellipsePath = (cx, cy, rx, ry) =>
  `M${r1(cx - rx)},${r1(cy)} A${rx},${ry} 0 1,0 ${r1(cx + rx)},${r1(cy)} A${rx},${ry} 0 1,0 ${r1(cx - rx)},${r1(cy)} Z`;

// Stipple scattered inside an ellipse, denser toward the lower right so a cut
// face reads as lit from the upper left.
function stippleEllipse(rand, cx, cy, rx, ry, count) {
  const dots = [];
  let guard = 0;
  while (dots.length < count && guard++ < count * 20) {
    const x = (rand() * 2 - 1) * rx;
    const y = (rand() * 2 - 1) * ry;
    if ((x * x) / (rx * rx) + (y * y) / (ry * ry) > 0.84) continue;
    const shade = 0.2 + 0.8 * ((x / rx + y / ry + 2) / 4);
    if (rand() > shade) continue;
    dots.push([r1(cx + x), r1(cy + y), r1(0.5 + rand() * 0.6)]);
  }
  return dots;
}

// ─────────────────────────────────────────────────────────────────────────────
// NO. 0001 — a crocus corm, whole and in longitudinal section.
//
// The field note's point is that the "bulb" is a corm, and that the difference
// is visible with a knife: an onion cut in half is rings of leaf base, a corm
// cut in half is solid stem. So the plate shows both — the whole corm in its
// fibrous tunic, and the cut face beside it, stippled solid, with no rings.
//
// The tunic is generated on a tilted spheroid rather than hand-set. Drawn by
// hand as even meridians it read as a globe; the real coat is irregular
// fibres converging at the neck, so each fibre is a meridian of the spheroid
// with its own start, length and wobble, and only the near side is drawn.
// ─────────────────────────────────────────────────────────────────────────────
function buildCorm() {
  const rand = mulberry32(1);
  const C = { x: 151, y: 238, rx: 80, ry: 58, tilt: 0.28 };

  // A point on the corm's surface: t from the neck (0) to the base (π), φ
  // around the vertical axis with 0 facing the viewer. Returns the screen
  // position and whether that point faces us.
  const surface = (t, phi) => {
    const X = C.rx * Math.sin(t) * Math.sin(phi);
    const Y = C.ry * Math.cos(t);
    const Z = C.rx * Math.sin(t) * Math.cos(phi);
    const Yv = Y * Math.cos(C.tilt) - Z * Math.sin(C.tilt);
    const Zv = Y * Math.sin(C.tilt) + Z * Math.cos(C.tilt);
    return { x: C.x + X, y: C.y - Yv, front: Zv > 2 };
  };

  // the silhouette, sampled from the same model so the fibres sit inside it
  const outline = [];
  for (let k = 0; k <= 72; k++) {
    const a = (k / 72) * Math.PI * 2;
    // a slight flattening at the base, where the basal plate is
    const squash = Math.sin(a) > 0 ? 1 - 0.06 * Math.sin(a) ** 4 : 1;
    outline.push([
      C.x + (C.rx + 2) * Math.cos(a),
      C.y + (C.ry * Math.cos(C.tilt) + C.rx * Math.sin(C.tilt) * 0.28 + 2) * Math.sin(a) * squash,
    ]);
  }
  const body = smoothPath(outline) + " Z";

  const fibres = [];
  for (let i = 0; i < 44; i++) {
    const phi = -1.45 + rand() * 2.9;
    const t0 = 0.08 + rand() * 0.5;
    const t1 = Math.min(Math.PI - 0.12, t0 + 0.8 + rand() * 1.6);
    const wob = 0.5 + rand() * 1.4;
    const pts = [];
    for (let k = 0; k <= 10; k++) {
      const t = t0 + ((t1 - t0) * k) / 10;
      const p = surface(t, phi + Math.sin(t * 5 + i) * 0.035);
      if (!p.front) continue;
      pts.push([p.x + Math.sin(k * 1.7 + i) * wob, p.y]);
    }
    if (pts.length > 3) fibres.push(smoothPath(pts));
  }

  // netting: short slanting ties between neighbouring fibres
  const ties = [];
  for (let i = 0; i < 26; i++) {
    const t = 0.35 + rand() * 2.1;
    const phi = -1.2 + rand() * 2.4;
    const a = surface(t, phi);
    const b = surface(t + 0.16, phi + 0.2);
    if (a.front && b.front) ties.push(`M${r1(a.x)},${r1(a.y)} L${r1(b.x)},${r1(b.y)}`);
  }

  // cross-contour hatching on the shadow side, lower right
  const hatch = [];
  for (let k = 0; k < 11; k++) {
    const t = 1.05 + k * 0.15;
    const pts = [];
    for (let j = 0; j <= 6; j++) {
      const p = surface(t, 0.55 + j * 0.16);
      if (p.front) pts.push([p.x, p.y]);
    }
    if (pts.length > 2) hatch.push(smoothPath(pts));
  }

  const neck = surface(0, 0);
  const neckFibres = [];
  for (let i = 0; i < 9; i++) {
    const dx = (i - 4) * 4.2;
    const top = neck.y - 20 - rand() * 10;
    neckFibres.push(
      smoothPath([
        [neck.x + dx * 1.5, neck.y + 6],
        [neck.x + dx * 0.9, neck.y - 8],
        [neck.x + dx * 0.5 + (rand() - 0.5) * 3, top],
      ]),
    );
  }

  const shoot = "M144,160 C141,128 146,104 151,84 C156,104 161,128 158,160";
  const leafL = "M149,96 C141,72 129,52 111,34 C127,48 142,66 153,92";
  const leafR = "M153,94 C163,68 177,52 197,40 C182,54 167,72 157,98";

  const roots = [
    "M127,297 C121,314 131,330 123,350 C119,360 122,368 117,378",
    "M140,300 C137,320 145,338 137,362",
    "M153,302 C154,323 147,343 154,371",
    "M166,301 C171,319 163,337 170,358 C173,367 169,373 173,381",
    "M179,298 C188,313 182,328 191,346",
    "M117,293 C106,305 109,319 99,333",
    "M189,293 C201,300 204,312 214,318",
  ];
  const rootlets = [
    "M123,334 C116,338 112,344 106,346",
    "M143,346 C149,350 151,356 157,358",
    "M149,330 C142,334 139,340 133,342",
    "M167,326 C174,330 177,336 183,337",
    "M186,330 C193,333 196,338 202,338",
    "M131,358 C126,362 124,368 119,370",
  ];

  const section = { x: 322, y: 262, rx: 49, ry: 36 };
  const sectionPath = smoothPath(
    Array.from({ length: 49 }, (_, k) => {
      const a = (k / 48) * Math.PI * 2;
      const squash = Math.sin(a) > 0 ? 1 - 0.08 * Math.sin(a) ** 4 : 1;
      return [section.x + section.rx * Math.cos(a), section.y + section.ry * Math.sin(a) * squash];
    }),
  );

  return {
    viewBox: "0 0 400 400",
    seed: 1,
    layers: [
      { kind: "wash", tone: "tan", d: body, dx: 4, dy: 3 },
      { kind: "wash", tone: "green", d: `${shoot} Z`, dx: 3, dy: 2 },
      { kind: "wash", tone: "leaf", d: `${leafL} Z`, dx: 2, dy: 2 },
      { kind: "wash", tone: "leaf", d: `${leafR} Z`, dx: 2, dy: 2 },
      { kind: "wash", tone: "cream", d: `${sectionPath} Z`, dx: 3, dy: 3 },

      { kind: "ink", d: body, weight: 1.9 },
      ...fibres.map((d) => ({ kind: "fine", d })),
      ...ties.map((d) => ({ kind: "fine", d })),
      ...hatch.map((d) => ({ kind: "fine", d })),
      ...neckFibres.map((d) => ({ kind: "ink", d, weight: 0.9 })),
      { kind: "ink", d: shoot, weight: 1.4 },
      { kind: "fine", d: "M151,92 C151,116 151,138 151,158" },
      { kind: "ink", d: leafL, weight: 1.2 },
      { kind: "ink", d: leafR, weight: 1.2 },
      { kind: "ink", d: "M117,292 C138,305 170,305 194,292", weight: 2.1 },
      ...roots.map((d) => ({ kind: "ink", d, weight: 1.1 })),
      ...rootlets.map((d) => ({ kind: "fine", d })),

      // fig. 2 — the cut face. Heavier outline, because it is a section.
      { kind: "ink", d: `${sectionPath} Z`, weight: 2.3 },
      { kind: "dots", dots: stippleEllipse(rand, section.x, section.y + 2, section.rx - 3, section.ry - 3, 300) },
      { kind: "ink", d: "M315,231 C316,219 320,210 322,200 C324,210 328,219 329,231", weight: 1.3 },
      { kind: "fine", d: "M322,232 C320,254 323,274 325,295" },
      { kind: "fine", d: "M309,238 C302,258 304,278 309,294" },
      { kind: "fine", d: "M335,238 C343,258 341,278 336,294" },
      { kind: "ink", d: "M304,296 C317,303 332,303 344,295", weight: 1.7 },

      { kind: "fig", x: 124, y: 396, text: "fig. 1" },
      { kind: "fig", x: 294, y: 324, text: "fig. 2, cut" },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NO. 0071 — a pitcher of Nepenthes albomarginata.
//
// The species in the field note, and the one detail that makes it that
// species: the narrow band of white edible hairs just under the rim, which
// termites come to harvest and fall in from. Everything else is the ordinary
// anatomy of a pitcher — the tendril from the leaf tip, the ribbed
// peristome, the lid hinged at the back of the mouth, the dark throat, and
// the two fringed wings down the front.
// ─────────────────────────────────────────────────────────────────────────────
function buildPitcher() {
  const M = { x: 236, y: 146, rx: 48, ry: 15 }; // the mouth
  const body =
    "M189,150 C185,180 201,204 197,232 C192,262 164,286 169,322 C174,352 212,366 241,365 C274,364 306,348 308,317 C310,283 284,260 278,230 C273,202 289,178 284,150";

  const ribs = [];
  for (let deg = 0; deg < 360; deg += 7) {
    const a = (deg * Math.PI) / 180;
    const s = Math.sin(a);
    if (s < -0.25) continue; // the far side of the rim is under the lid
    const o = [M.x + (M.rx + 3) * Math.cos(a), M.y + (M.ry + 3) * s];
    const i = [M.x + (M.rx - 8) * Math.cos(a), M.y - 2 + (M.ry - 6) * s];
    const mid = [(o[0] + i[0]) / 2 + Math.cos(a) * 1.5, (o[1] + i[1]) / 2 + 1.2];
    ribs.push(`M${r1(i[0])},${r1(i[1])} Q${r1(mid[0])},${r1(mid[1])} ${r1(o[0])},${r1(o[1])}`);
  }

  // The white band: its lower edge, and the hairs standing in it.
  const bandTop = "M190,158 C212,170 262,170 284,158";
  const bandEdge = "M191,172 C213,184 262,184 284,172";
  const hairs = [];
  for (let k = 0; k <= 30; k++) {
    const t = k / 30;
    const x = 193 + t * 89;
    const yBottom = 172 + Math.sin(t * Math.PI) * 11;
    const yTop = yBottom - 7 - (k % 3) * 1.3;
    hairs.push(`M${r1(x)},${r1(yBottom)} L${r1(x + 0.9)},${r1(yTop)}`);
  }

  const wing = (x0, drift, dir) => {
    const pts = [];
    for (let k = 0; k <= 10; k++) {
      const t = k / 10;
      pts.push([x0 + drift * t * t, 188 + t * 118]);
    }
    const fringe = [];
    for (let k = 1; k < 10; k++) {
      const [x, y] = pts[k];
      const len = 9 - k * 0.5;
      fringe.push(`M${r1(x)},${r1(y)} Q${r1(x + dir * len * 0.6)},${r1(y - 1)} ${r1(x + dir * len)},${r1(y + 3)}`);
    }
    return { d: smoothPath(pts), fringe };
  };
  const wingL = wing(219, -10, -1);
  const wingR = wing(253, 9, 1);

  // The lid, hinged across the back of the rim and standing open.
  const lid =
    "M214,138 C200,114 207,84 236,72 C268,59 302,74 302,100 C302,118 288,132 266,137 C250,140 230,141 214,138 Z";
  const lidVeins = [
    "M222,132 C236,112 256,98 288,94",
    "M232,137 C250,124 270,114 296,110",
    "M218,122 C226,102 244,86 268,78",
  ];

  const leaf = "M24,52 C70,40 134,70 164,114 C122,100 60,90 24,52 Z";

  // Veins running down the pitcher, following the bulge of its lower half.
  const veins = [
    "M204,190 C202,218 190,250 186,296 C184,322 194,342 210,356",
    "M236,190 C236,222 232,258 232,300 C232,326 236,346 240,362",
    "M268,190 C270,222 278,256 282,296 C284,322 276,342 262,356",
    "M190,262 C182,284 178,304 182,326",
    "M290,262 C298,284 302,304 298,326",
  ];

  // The speckling a lower pitcher carries, densest toward the base, where
  // the colour of the older tissue deepens.
  const rand = mulberry32(71);
  const speckles = [];
  for (let guard = 0; speckles.length < 90 && guard < 4000; guard++) {
    const x = 170 + rand() * 138;
    const y = 214 + rand() * 146;
    // inside the lower body, roughly
    const nx = (x - 239) / 66;
    const ny = (y - 318) / 46;
    if (nx * nx + ny * ny > 1 && y > 280) continue;
    if (y < 280 && Math.abs(x - 238) > 38 + (y - 214) * 0.32) continue;
    if (rand() > 0.25 + ((y - 214) / 146) * 0.75) continue;
    speckles.push([r1(x), r1(y), r1(0.7 + rand() * 1.3)]);
  }

  return {
    viewBox: "0 0 400 400",
    seed: 71,
    layers: [
      { kind: "wash", tone: "leaf", d: leaf, dx: 3, dy: 3 },
      { kind: "wash", tone: "green", d: `${body} C270,164 202,164 189,150 Z`, dx: 4, dy: 3 },
      { kind: "wash", tone: "cream", d: "M190,158 C212,170 262,170 284,158 L284,172 C262,184 213,184 191,172 Z", dx: 0, dy: 0 },
      { kind: "wash", tone: "leaf", d: lid, dx: 3, dy: 3 },
      { kind: "wash", tone: "rose", d: ellipsePath(M.x, M.y, M.rx + 3, M.ry + 3), dx: 2, dy: 2 },
      // the throat: the reason the mouth reads as an opening and not a lid
      { kind: "shade", d: ellipsePath(M.x, M.y - 2, M.rx - 9, M.ry - 6) },

      { kind: "ink", d: leaf, weight: 1.4 },
      { kind: "fine", d: "M24,52 C78,66 126,88 164,114" },
      { kind: "fine", d: "M58,60 L68,74 M84,68 L94,82 M110,78 L118,92 M134,90 L140,102" },
      {
        kind: "ink",
        d: "M164,114 C160,150 132,184 140,226 C147,262 126,288 142,312 C154,330 178,324 172,308 C166,294 146,304 156,320 C164,334 176,346 188,352",
        weight: 1.5,
      },

      { kind: "ink", d: body, weight: 1.9 },
      ...veins.map((d) => ({ kind: "back", d })),
      { kind: "dots", tone: "speckle", dots: speckles },
      { kind: "fine", d: "M293,300 C295,318 291,334 281,345" },
      { kind: "fine", d: "M300,289 C303,311 298,334 286,351" },
      { kind: "fine", d: "M286,251 C290,265 296,277 302,287" },
      { kind: "fine", d: "M279,236 C282,248 287,258 293,266" },
      { kind: "fine", d: "M180,300 C178,316 184,332 196,344" },
      { kind: "ink", d: wingL.d, weight: 1.3 },
      { kind: "ink", d: wingR.d, weight: 1.3 },
      ...wingL.fringe.map((d) => ({ kind: "fine", d })),
      ...wingR.fringe.map((d) => ({ kind: "fine", d })),

      { kind: "fine", d: bandTop },
      { kind: "ink", d: bandEdge, weight: 1 },
      ...hairs.map((d) => ({ kind: "fine", d })),

      { kind: "ink", d: lid, weight: 1.6 },
      ...lidVeins.map((d) => ({ kind: "fine", d })),
      { kind: "ink", d: "M296,118 C306,122 314,118 318,108", weight: 1.2 },

      { kind: "ink", d: ellipsePath(M.x, M.y, M.rx + 3, M.ry + 3), weight: 1.7 },
      { kind: "ink", d: ellipsePath(M.x, M.y - 2, M.rx - 9, M.ry - 6), weight: 1.1 },
      ...ribs.map((d) => ({ kind: "fine", d })),

      { kind: "fine", d: "M322,214 C308,208 298,196 289,180" },
      { kind: "fig", x: 318, y: 228, text: "the white band" },
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NO. 0946 — a tumbleweed: Salsola, the Russian thistle.
//
// Generated rather than hand-set, because a tumbleweed is exactly the kind of
// thing a hand draws badly — a hundred short twigs, none of them important.
// The method follows the plant: the branches of a dead Salsola arch out and
// back until the whole plant is a ball, so each twig is a short arc of a great
// circle on a sphere, rotated at random and projected flat. Twigs fork; the
// leaves end in spines; twigs on the far side are drawn fainter, which is what
// makes it read as round; and a few stragglers stand proud of the outline so
// the silhouette is never a clean circle.
//
// The broken stem is kept. It is the point: a tumbleweed is a plant that has
// died, snapped at the base on purpose, and gone off to scatter its seed.
// ─────────────────────────────────────────────────────────────────────────────
export const TUMBLE = { cx: 200, cy: 205, r: 100, ground: 307 };

function buildTumbleweed() {
  const rand = mulberry32(946);
  const { cx, cy, r: R } = TUMBLE;
  const front = [];
  const back = [];
  const fine = [];

  const unit = () => {
    const z = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - z * z);
    return [s * Math.cos(t), s * Math.sin(t), z];
  };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]);
    return [a[0] / l, a[1] / l, a[2] / l];
  };

  const twig = (shellLo, shellHi, spanLo, spanHi) => {
    const n = unit();
    const u = norm(cross(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
    const v = cross(n, u);
    const shell = R * (shellLo + rand() * (shellHi - shellLo));
    const start = rand() * Math.PI * 2;
    const span = spanLo + rand() * (spanHi - spanLo);
    const steps = 8;
    const pts = [];
    let depth = 0;
    for (let k = 0; k <= steps; k++) {
      const th = start + (span * k) / steps;
      const p = [0, 1, 2].map((j) => shell * (Math.cos(th) * u[j] + Math.sin(th) * v[j]));
      depth += p[2];
      pts.push([cx + p[0] + (rand() - 0.5) * 0.9, cy + p[1] + (rand() - 0.5) * 0.9]);
    }
    return { pts, far: depth / (steps + 1) < -R * 0.12 };
  };

  const addForksAndSpines = (pts) => {
    for (let k = 1; k < pts.length - 1; k++) {
      const [x0, y0] = pts[k];
      const [x1, y1] = pts[k + 1];
      const len = Math.hypot(x1 - x0, y1 - y0) || 1;
      const tx = (x1 - x0) / len;
      const ty = (y1 - y0) / len;
      const roll = rand();
      if (roll < 0.1) {
        // a fork: a short side twig leaving at 25–45°
        const side = rand() < 0.5 ? -1 : 1;
        const ang = side * (0.45 + rand() * 0.35);
        const fx = tx * Math.cos(ang) - ty * Math.sin(ang);
        const fy = tx * Math.sin(ang) + ty * Math.cos(ang);
        const L = 7 + rand() * 9;
        const bend = (rand() - 0.5) * 5;
        fine.push(
          `M${r1(x0)},${r1(y0)} Q${r1(x0 + fx * L * 0.5 - fy * bend)},${r1(y0 + fy * L * 0.5 + fx * bend)} ${r1(x0 + fx * L)},${r1(y0 + fy * L)}`,
        );
      } else if (roll < 0.26) {
        // a spine — Salsola's leaves harden into them as the plant dies
        const side = rand() < 0.5 ? -1 : 1;
        const L = 2.5 + rand() * 2.5;
        fine.push(`M${r1(x0)},${r1(y0)} L${r1(x0 - ty * side * L + tx * 1.5)},${r1(y0 + tx * side * L + ty * 1.5)}`);
      }
    }
  };

  for (let i = 0; i < 130; i++) {
    const { pts, far } = twig(0.66, 1.0, 0.55, 1.25);
    if (far) back.push(smoothPath(pts));
    else {
      front.push(smoothPath(pts));
      addForksAndSpines(pts);
    }
  }
  // stragglers, proud of the outline
  for (let i = 0; i < 14; i++) {
    const { pts, far } = twig(0.98, 1.08, 0.25, 0.5);
    if (!far) {
      front.push(smoothPath(pts));
      addForksAndSpines(pts);
    }
  }

  // The wash is an irregular blob, not a disc: a disc read as a setting sun.
  const blob = [];
  for (let k = 0; k <= 40; k++) {
    const a = (k / 40) * Math.PI * 2;
    const rr = R * (0.86 + 0.03 * Math.sin(a * 3 + 1) + 0.02 * Math.sin(a * 7));
    blob.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }

  return {
    viewBox: "0 0 400 400",
    seed: 946,
    layers: [
      // Half strength: at full it read as a solid ball, a biscuit rather than
      // a tangle you can see through.
      { kind: "wash", tone: "straw", alpha: 0.5, d: `${smoothPath(blob)} Z`, dx: 3, dy: 3 },
      ...back.map((d) => ({ kind: "back", d })),
      ...front.map((d) => ({ kind: "ink", d, weight: 0.95 })),
      ...fine.map((d) => ({ kind: "fine", d })),
      // the snapped stem
      {
        kind: "ink",
        d: `M${cx - 8},${cy + R - 18} C${cx - 11},${cy + R - 8} ${cx - 17},${cy + R - 3} ${cx - 25},${cy + R - 1} L${cx - 21},${cy + R + 3} L${cx - 28},${cy + R + 2}`,
        weight: 2,
      },
    ],
  };
}

export const PLATES = {
  corm: buildCorm(),
  pitcher: buildPitcher(),
  tumbleweed: buildTumbleweed(),
};

// Tones for the washes. Kept pale on purpose: a wash that competes with the
// line turns a plate into a cartoon.
//
// Four stops each, because a watercolour wash is not one colour. `light` is
// where the light falls (upper left), `base` the body of the wash, `deep`
// where it settles in shadow, and `edge` the darker line pigment leaves as
// it dries at the rim of a wash — the single most recognisable thing about
// watercolour, and the thing a flat fill most obviously lacks.
export const WASH = {
  tan: { light: "#f5eacf", base: "#ead7ae", deep: "#d7bb85", edge: "#b8995e" },
  cream: { light: "#fcf8ed", base: "#f5ecd6", deep: "#e8d8b2", edge: "#cdb88a" },
  green: { light: "#e8f1de", base: "#d3e4c3", deep: "#b3cd9c", edge: "#8aa874" },
  leaf: { light: "#deecce", base: "#c6dbb0", deep: "#a4c289", edge: "#7c9b63" },
  rose: { light: "#f0cfd7", base: "#e3b0bd", deep: "#cf8c9e", edge: "#b0627a" },
  straw: { light: "#f6efdb", base: "#ece0bd", deep: "#d9c696", edge: "#bda267" },
};
