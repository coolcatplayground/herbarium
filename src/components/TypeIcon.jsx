// Type symbols traced from a reference sheet of the standard Pokémon type
// icons, supplied as SVG (see /pkmntype for the source files). These are
// recognisable renderings of the official symbols rather than original
// artwork — kept here under the same non-commercial fan-work terms as the
// rest of the project (see the disclaimer in README.md).
//
// Colors are the widely-used community convention for each type, which is a
// color association rather than proprietary artwork. These match the standard
// type-badge palette rather than the muted herbarium tones used previously —
// the badges are meant to read as Pokémon types first.

export const TYPE_COLORS = {
  normal: "#a8a77a",
  fire: "#ee8130",
  water: "#6390f0",
  electric: "#f7d02c",
  grass: "#7ac74c",
  ice: "#96d9d6",
  fighting: "#c22e28",
  poison: "#a33ea1",
  ground: "#e2bf65",
  flying: "#a98ff3",
  psychic: "#f95587",
  bug: "#a6b91a",
  rock: "#b6a136",
  ghost: "#735797",
  dragon: "#6f35fc",
  dark: "#705746",
  steel: "#b7b7ce",
  fairy: "#d685ad",
};

// WCAG relative luminance, used to decide whether a type's badge needs light
// or dark lettering. Several types (electric, ice, ground, steel) are far too
// pale to carry white text — the reference badges solve that with a heavy dark
// outline around the letters, which turns to mud at the 0.62rem this app uses,
// so the text color flips instead.
function relativeLuminance(hex) {
  const channels = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const BADGE_LIGHT = "#fdfbf4"; // --paper-light
// Deliberately deeper than --ink (#5a4a3a). The mid-tone fills — fire,
// psychic, water, fairy — sit almost exactly halfway between white and the
// standard ink, landing around 4.4:1 against both. Taking the dark option a
// few shades further is what clears AA on those without touching the fills.
const BADGE_DARK = "#2e2419";

// The badge fills are the authentic type colors, unmodified — that fidelity is
// the whole point of the palette, so the *lettering* is what adapts, never the
// ground. The reference badges use white text on every type and get away with
// it via a heavy dark outline around each letter; that outline turns to mud at
// the ~10px these render at, so pale and mid-tone fills take dark lettering
// instead. Trades exact text-color fidelity for exact fill fidelity, which is
// the right way round.
function resolveBadge(bg) {
  const ink =
    contrastRatio(bg, BADGE_LIGHT) >= contrastRatio(bg, BADGE_DARK) ? BADGE_LIGHT : BADGE_DARK;
  return { background: bg, ink };
}

// Precomputed so the badge doesn't redo this on every render.
export const TYPE_BADGE = Object.fromEntries(
  Object.entries(TYPE_COLORS).map(([type, bg]) => [type, resolveBadge(bg)])
);

// The source files are drawn on a 100x100 canvas but the artwork only
// occupies a ~43x41 region in the middle of it — about 18% of the canvas. At
// badge size (12-14px) that would render the glyph at roughly 5px, so the
// viewBox below is cropped to the union bounding box of all 18 symbols plus a
// little padding. Cropping to the *union* rather than per-icon keeps the
// symbols correctly sized relative to each other, the way they were drawn
// (electric and water are genuinely narrow; ghost is genuinely wide).
const VIEW_BOX = "26.5 27.5 47 47";

// Filled shapes with evenodd winding — several symbols (water, ice, poison)
// rely on it for their interior cut-outs.
const GLYPHS = {
  normal:
    "M36.96,32.61 L34.78,34.78 L34.78,45.65 L32.61,47.83 L32.61,56.52 L34.78,58.70 L36.96,65.22 L39.13,67.39 L41.30,67.39 L43.48,69.57 L47.83,69.57 L50.00,71.74 L60.87,69.57 L65.22,65.22 L67.39,65.22 L67.39,63.04 L71.74,56.52 L71.74,47.83 L69.57,45.65 L69.57,41.30 L71.74,39.13 L69.57,36.96 L69.57,34.78 L67.39,32.61 Z M50.00,36.96 L52.17,36.96 L54.35,39.13 L58.70,39.13 L65.22,45.65 L65.22,56.52 L63.04,58.70 L63.04,60.87 L56.52,65.22 L47.83,65.22 L45.65,63.04 L43.48,63.04 L39.13,56.52 L39.13,45.65 L45.65,39.13 L47.83,39.13 Z",
  fire:
    "M50.00,32.61 L50.00,41.30 L41.30,50.00 L41.30,52.17 L39.13,54.35 L39.13,63.04 L41.30,65.22 L41.30,67.39 L41.30,54.35 L43.48,52.17 L47.83,52.17 L50.00,54.35 L50.00,56.52 L58.70,65.22 L56.52,71.74 L63.04,67.39 L63.04,65.22 L65.22,63.04 L65.22,56.52 L60.87,52.17 L58.70,45.65 L56.52,45.65 L54.35,43.48 L54.35,34.78 L52.17,34.78 Z",
  water:
    "M52.17,32.61 L52.17,34.78 L50.00,36.96 L50.00,41.30 L41.30,54.35 L41.30,63.04 L45.65,69.57 L58.70,69.57 L63.04,63.04 L63.04,54.35 L56.52,45.65 Z M43.48,63.04 L45.65,60.87 L58.70,60.87 L60.87,63.04 L60.87,65.22 L56.52,69.57 L47.83,69.57 L43.48,65.22 Z",
  electric:
    "M54.35,30.43 L50.00,30.43 L50.00,32.61 L45.65,36.96 L45.65,39.13 L41.30,45.65 L41.30,50.00 L43.48,52.17 L45.65,52.17 L52.17,58.70 L52.17,63.04 L50.00,65.22 L50.00,67.39 L60.87,56.52 L60.87,54.35 L56.52,50.00 L56.52,45.65 L63.04,39.13 L63.04,36.96 Z",
  grass:
    "M69.57,41.30 L69.57,43.48 L65.22,47.83 L65.22,50.00 L58.70,60.87 L58.70,65.22 L56.52,67.39 L56.52,69.57 L63.04,69.57 L65.22,67.39 L65.22,60.87 L67.39,58.70 L67.39,47.83 L69.57,45.65 Z M58.70,34.78 L58.70,36.96 L52.17,47.83 L50.00,47.83 L47.83,45.65 L47.83,43.48 L45.65,45.65 L45.65,47.83 L43.48,50.00 L43.48,52.17 L41.30,54.35 L34.78,69.57 L43.48,69.57 L43.48,65.22 L45.65,63.04 L45.65,52.17 L47.83,50.00 L50.00,50.00 L52.17,52.17 L52.17,63.04 L52.17,60.87 L56.52,54.35 L56.52,50.00 L58.70,47.83 Z",
  ice:
    "M54.35,30.43 L50.00,30.43 L52.17,36.96 L43.48,43.48 L41.30,43.48 L39.13,41.30 L39.13,39.13 L34.78,39.13 L34.78,41.30 L39.13,41.30 L41.30,43.48 L41.30,56.52 L39.13,58.70 L34.78,58.70 L34.78,60.87 L39.13,60.87 L41.30,58.70 L45.65,58.70 L47.83,60.87 L50.00,60.87 L52.17,63.04 L52.17,65.22 L50.00,67.39 L50.00,69.57 L52.17,71.74 L54.35,69.57 L54.35,67.39 L52.17,65.22 L52.17,63.04 L54.35,60.87 L56.52,60.87 L58.70,58.70 L69.57,60.87 L69.57,58.70 L65.22,58.70 L63.04,56.52 L63.04,45.65 L65.22,43.48 L67.39,43.48 L69.57,41.30 L69.57,39.13 L65.22,39.13 L65.22,41.30 L63.04,43.48 L56.52,41.30 L52.17,36.96 Z M41.30,47.83 L43.48,45.65 L45.65,45.65 L47.83,47.83 L47.83,52.17 L45.65,54.35 L43.48,54.35 L41.30,52.17 Z",
  fighting:
    "M67.39,52.17 L65.22,50.00 L54.35,50.00 L54.35,56.52 L52.17,58.70 L50.00,58.70 L47.83,56.52 L36.96,56.52 L36.96,63.04 L41.30,67.39 L54.35,67.39 L56.52,65.22 L60.87,65.22 L63.04,63.04 L65.22,63.04 L65.22,54.35 Z M63.04,34.78 L63.04,43.48 L65.22,43.48 L65.22,34.78 Z M54.35,34.78 L54.35,43.48 L56.52,43.48 L56.52,34.78 Z M45.65,34.78 L45.65,50.00 L47.83,50.00 L47.83,34.78 Z M36.96,34.78 L36.96,50.00 L39.13,50.00 L39.13,34.78 Z",
  poison:
    "M32.61,67.39 L34.78,69.57 L67.39,69.57 L69.57,67.39 L67.39,67.39 L65.22,65.22 L58.70,65.22 L52.17,58.70 L50.00,58.70 L43.48,65.22 L36.96,65.22 L34.78,67.39 Z M56.52,47.83 L56.52,52.17 L58.70,54.35 L60.87,54.35 L63.04,52.17 L63.04,47.83 Z M41.30,34.78 L39.13,36.96 L39.13,43.48 L41.30,45.65 L47.83,45.65 L50.00,43.48 L50.00,36.96 L47.83,34.78 Z",
  ground:
    "M32.61,56.52 L34.78,58.70 L36.96,58.70 L43.48,63.04 L47.83,63.04 L50.00,65.22 L52.17,65.22 L54.35,63.04 L58.70,63.04 L60.87,60.87 L63.04,60.87 L65.22,63.04 L65.22,65.22 L63.04,67.39 L60.87,67.39 L58.70,69.57 L54.35,69.57 L52.17,71.74 L50.00,71.74 L47.83,69.57 L43.48,69.57 L36.96,65.22 L32.61,65.22 L34.78,65.22 L41.30,69.57 L45.65,69.57 L47.83,71.74 L54.35,71.74 L56.52,69.57 L60.87,69.57 L63.04,67.39 L69.57,65.22 L67.39,65.22 L65.22,63.04 L65.22,60.87 L67.39,58.70 L69.57,58.70 L69.57,56.52 L67.39,56.52 L65.22,54.35 L60.87,54.35 L54.35,50.00 L47.83,50.00 L41.30,54.35 L36.96,54.35 L34.78,56.52 Z M34.78,34.78 L34.78,36.96 L41.30,36.96 L41.30,32.61 L36.96,32.61 Z",
  flying:
    "M69.57,32.61 L63.04,32.61 L60.87,34.78 L56.52,34.78 L54.35,36.96 L47.83,36.96 L41.30,41.30 L41.30,43.48 L39.13,45.65 L39.13,50.00 L36.96,52.17 L36.96,56.52 L34.78,58.70 L34.78,69.57 L34.78,67.39 L41.30,60.87 L43.48,60.87 L45.65,58.70 L52.17,58.70 L54.35,56.52 L54.35,54.35 L63.04,45.65 L60.87,43.48 L60.87,41.30 Z",
  psychic:
    "M47.83,32.61 L41.30,39.13 L36.96,39.13 L34.78,41.30 L34.78,63.04 L41.30,63.04 L47.83,69.57 L54.35,69.57 L60.87,63.04 L67.39,63.04 L67.39,60.87 L69.57,58.70 L67.39,56.52 L67.39,45.65 L69.57,43.48 L67.39,41.30 L67.39,39.13 L60.87,39.13 L54.35,32.61 Z M50.00,36.96 L52.17,36.96 L56.52,41.30 L60.87,41.30 L63.04,43.48 L63.04,54.35 L65.22,56.52 L65.22,58.70 L63.04,60.87 L58.70,60.87 L52.17,65.22 L50.00,65.22 L39.13,58.70 L39.13,43.48 L41.30,41.30 L45.65,41.30 Z",
  bug:
    "M50.00,58.70 L50.00,63.04 L47.83,65.22 L47.83,67.39 L54.35,67.39 L54.35,65.22 L52.17,63.04 L52.17,58.70 Z M67.39,43.48 L56.52,47.83 L56.52,56.52 L58.70,58.70 L58.70,63.04 L60.87,65.22 L60.87,67.39 L63.04,67.39 L67.39,63.04 L67.39,58.70 L69.57,56.52 L69.57,50.00 L67.39,47.83 Z M34.78,43.48 L34.78,52.17 L32.61,54.35 L34.78,56.52 L34.78,63.04 L41.30,69.57 L41.30,65.22 L43.48,63.04 L43.48,58.70 L45.65,56.52 L45.65,52.17 L47.83,50.00 L45.65,47.83 Z M41.30,39.13 L47.83,43.48 L54.35,43.48 L63.04,36.96 L60.87,36.96 L56.52,32.61 L45.65,32.61 L41.30,36.96 Z",
  rock:
    "M43.48,30.43 L30.43,43.48 L30.43,58.70 L34.78,63.04 L34.78,58.70 L36.96,56.52 L39.13,56.52 L43.48,60.87 L43.48,63.04 L41.30,65.22 L39.13,65.22 L39.13,67.39 L41.30,69.57 L58.70,69.57 L69.57,58.70 L69.57,41.30 L58.70,30.43 Z M58.70,60.87 L60.87,58.70 L63.04,58.70 L65.22,60.87 L65.22,63.04 L63.04,65.22 L60.87,65.22 L58.70,63.04 Z",
  ghost:
    "M45.65,34.78 L36.96,43.48 L36.96,50.00 L34.78,52.17 L32.61,52.17 L28.26,56.52 L28.26,58.70 L39.13,60.87 L47.83,69.57 L52.17,69.57 L60.87,60.87 L71.74,58.70 L71.74,54.35 L69.57,54.35 L63.04,50.00 L63.04,43.48 L58.70,36.96 L56.52,36.96 L54.35,34.78 Z M52.17,45.65 L54.35,43.48 L56.52,43.48 L58.70,45.65 L58.70,47.83 L56.52,50.00 L54.35,50.00 L52.17,47.83 Z M41.30,43.48 L43.48,41.30 L45.65,41.30 L47.83,43.48 L47.83,47.83 L45.65,50.00 L43.48,50.00 L41.30,47.83 Z",
  dragon:
    "M45.65,30.43 L45.65,34.78 L43.48,36.96 L43.48,41.30 L41.30,43.48 L41.30,47.83 L39.13,50.00 L43.48,50.00 L45.65,52.17 L45.65,54.35 L43.48,56.52 L36.96,56.52 L34.78,54.35 L32.61,47.83 L30.43,47.83 L30.43,58.70 L34.78,63.04 L36.96,60.87 L36.96,58.70 L39.13,56.52 L41.30,56.52 L45.65,63.04 L45.65,67.39 L47.83,69.57 L47.83,71.74 L52.17,71.74 L54.35,69.57 L54.35,63.04 L58.70,58.70 L63.04,58.70 L65.22,60.87 L65.22,63.04 L67.39,63.04 L67.39,60.87 L69.57,58.70 L69.57,45.65 L67.39,52.17 L65.22,54.35 L63.04,54.35 L60.87,52.17 L60.87,45.65 L56.52,39.13 L56.52,32.61 L54.35,32.61 L54.35,36.96 L52.17,39.13 L50.00,39.13 L45.65,34.78 Z",
  dark:
    "M50.00,43.48 L47.83,45.65 L47.83,52.17 L50.00,54.35 L52.17,52.17 L52.17,45.65 Z M32.61,43.48 L32.61,54.35 L41.30,63.04 L43.48,63.04 L45.65,65.22 L54.35,65.22 L56.52,63.04 L63.04,60.87 L69.57,50.00 L69.57,45.65 L65.22,39.13 L58.70,43.48 L58.70,54.35 L52.17,60.87 L47.83,60.87 L41.30,54.35 L41.30,43.48 L36.96,39.13 Z",
  steel:
    "M63.04,41.30 L60.87,43.48 L56.52,43.48 L54.35,45.65 L54.35,52.17 L56.52,54.35 L58.70,65.22 L69.57,56.52 L67.39,54.35 L67.39,50.00 L65.22,47.83 L65.22,43.48 Z M56.52,47.83 L58.70,45.65 L60.87,45.65 L63.04,47.83 L63.04,50.00 L60.87,52.17 L58.70,52.17 L56.52,50.00 Z M39.13,34.78 L39.13,36.96 L36.96,39.13 L36.96,43.48 L34.78,45.65 L34.78,50.00 L32.61,52.17 L32.61,56.52 L34.78,54.35 L36.96,54.35 L39.13,56.52 L39.13,58.70 L36.96,60.87 L47.83,69.57 L52.17,69.57 L52.17,60.87 L47.83,54.35 L47.83,41.30 L50.00,39.13 L60.87,36.96 L60.87,34.78 Z M39.13,54.35 L41.30,52.17 L43.48,52.17 L45.65,54.35 L45.65,56.52 L43.48,58.70 L41.30,58.70 L39.13,56.52 Z",
  fairy:
    "M32.61,32.61 L32.61,43.48 L34.78,45.65 L34.78,47.83 L36.96,47.83 L39.13,50.00 L39.13,56.52 L36.96,58.70 L39.13,58.70 L41.30,60.87 L43.48,58.70 L45.65,58.70 L47.83,60.87 L47.83,65.22 L45.65,67.39 L50.00,63.04 L52.17,63.04 L54.35,65.22 L54.35,67.39 L54.35,63.04 L56.52,60.87 L60.87,60.87 L63.04,58.70 L60.87,52.17 L67.39,45.65 L69.57,34.78 L67.39,32.61 L58.70,32.61 L52.17,39.13 L50.00,39.13 L41.30,32.61 Z M45.65,45.65 L47.83,43.48 L52.17,43.48 L56.52,47.83 L56.52,50.00 L54.35,52.17 L47.83,52.17 L45.65,50.00 Z",
};

// `color` overrides the type's own color — used by TypeBadge, where the glyph
// sits on a type-colored fill and has to switch to the contrasting ink instead.
export function TypeIcon({ type, size = 14, color }) {
  const fill = color || TYPE_COLORS[type] || "#8a8a7a";
  const path = GLYPHS[type];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox={VIEW_BOX}
      fill={fill}
      fillRule="evenodd"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={path} />
    </svg>
  );
}
