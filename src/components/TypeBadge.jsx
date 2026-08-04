const TYPE_COLORS = {
  grass: "#2f4b3c",
  poison: "#8c3b2e",
  bug: "#6b7f5c",
  fire: "#a9863f",
  water: "#3a5f6b",
  flying: "#7c6f9c",
  fairy: "#a9636f",
  ground: "#8c6b3e",
  dragon: "#4a4f8c",
  ghost: "#5c4f6b",
  dark: "#2a2820",
  normal: "#7a7566",
  psychic: "#8c4f6b",
  fighting: "#8c4f3e",
  rock: "#6b5f4a",
  steel: "#5f6b6b",
  ice: "#4f7c8c",
  electric: "#a98c3f",
};

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || "#4a4636";
  return (
    <span
      className="mono"
      style={{
        display: "inline-block",
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--paper-light)",
        background: color,
        padding: "2px 8px",
        border: "1px solid var(--ink)",
      }}
    >
      {type}
    </span>
  );
}
