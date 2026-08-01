// Original icon glyphs, not reproductions of any official or third-party
// game asset — simple, universal symbols (a flame, a droplet, a leaf...)
// paired with the widely-used community convention for each type's color,
// which is just a color association, not proprietary artwork.

export const TYPE_COLORS = {
  normal: "#8f8f7a",
  fire: "#e08030",
  water: "#5a90d6",
  electric: "#e0c020",
  grass: "#5fa050",
  ice: "#78d0d0",
  fighting: "#b0402a",
  poison: "#9f4aa0",
  ground: "#c0a050",
  flying: "#9088d8",
  psychic: "#e0608a",
  bug: "#a0b020",
  rock: "#a8965a",
  ghost: "#6a5a90",
  dragon: "#6040d0",
  dark: "#5a4a3a",
  steel: "#8a96a6",
  fairy: "#e090c0",
};

// Each glyph is a minimal path/shape drawn on a 24x24 grid, meant to read
// clearly at badge size (14-18px). Stroke-based, single color (currentColor).
const GLYPHS = {
  normal: "M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z M12 9v6M9 12h6",
  fire: "M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-2-1-2-1-4 2 1 3 3 3 6a5 5 0 0 1-10 0c0-5 3-6 5-11Z",
  water: "M12 2c3 5 6 9 6 13a6 6 0 0 1-12 0c0-4 3-8 6-13Z",
  electric: "M13 2 5 14h5l-1 8 8-12h-5l1-8Z",
  grass: "M12 21V9M12 9C8 9 5 6 5 3c4 0 7 3 7 6ZM12 13c4 0 7-3 7-6-4 0-7 3-7 6Z",
  ice: "M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M12 2 9 5M12 2l3 3M12 22l-3-3M12 22l3-3",
  fighting: "M6 9c0-3 2.7-5 6-5s6 2 6 5c0 2-1 3.5-2.5 4.3L15 17H9l-.5-3.7C7 12.5 6 11 6 9ZM8 20h8",
  poison: "M12 2 4 8v8l8 6 8-6V8l-8-6Z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  ground: "M3 15h18M5 15c0-5 3-9 7-9s7 4 7 9M3 19h18",
  flying: "M2 13c4-6 8-8 10-8s2 3-2 5c5-1 9 0 12 3-4 0-7 1-9 3 3 0 5 1 6 3-4-1-7-1-9 1-2-3-6-4-8-7Z",
  psychic: "M12 3a5 5 0 0 1 5 5c0 2-1 3-2 4l-1 2H10l-1-2c-1-1-2-2-2-4a5 5 0 0 1 5-5ZM10 17h4M11 20h2",
  bug: "M12 4a3 3 0 0 1 3 3v1a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-3a5 5 0 0 1 5-5V7a3 3 0 0 1 3-3ZM4 10 2 8M20 10l2-2M4 16l-2 1M20 16l2 1",
  rock: "M4 16 9 6l4 3 3-5 4 12H4Z",
  ghost: "M6 20V11a6 6 0 0 1 12 0v9l-2-2-2 2-2-2-2 2-2-2-2 2ZM9 10h.01M15 10h.01",
  dragon: "M4 20c2-6 5-8 6-14 3 2 3 6 1 8 3-1 6-3 7-7 2 5-1 10-6 12-3 1-6 1-8 1Z",
  dark: "M20 13a8 8 0 1 1-9-9 6.5 6.5 0 0 0 9 9Z",
  steel: "M12 3 4 7v10l8 4 8-4V7l-8-4Z M12 9v6M9 12h6",
  fairy: "M12 2c.6 4.4 2.2 6 6.6 6.6-4.4.6-6 2.2-6.6 6.6-.6-4.4-2.2-6-6.6-6.6C9.8 8 11.4 6.4 12 2ZM19 15c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z",
};

export function TypeIcon({ type, size = 14 }) {
  const color = TYPE_COLORS[type] || "#8a8a7a";
  const path = GLYPHS[type];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={path} />
    </svg>
  );
}
