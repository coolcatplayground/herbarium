import { TypeIcon, TYPE_BADGE } from "./TypeIcon";

// A filled type pill, styled after the standard type badges: the type's own
// color as the ground, its symbol and name in contrasting ink on top.
//
// The reference badges use white lettering with a thick dark outline on every
// type, which is what lets a pale fill like Electric carry white text. That
// outline doesn't survive being shrunk to the 0.62rem these sit at in the
// catalog, so instead the lettering flips to dark on pale and mid-tone fills
// (see TYPE_BADGE in TypeIcon.jsx) and the whole badge keeps a thin darkened
// rim, which is what reads as "badge" at this size.
//
// Sizes are named rather than numeric so the three call sites stay visually
// consistent: `sm` in the catalog grid and concept cards, `md` on the
// specimen sheet where there's room for it.
const SIZES = {
  sm: { font: "0.62rem", icon: 12, padding: "3px 9px", gap: "4px" },
  md: { font: "0.7rem", icon: 14, padding: "4px 11px", gap: "5px" },
};

export default function TypeBadge({ type, size = "sm" }) {
  const resolved = TYPE_BADGE[type];
  // Unknown type: fall back to a plain outlined chip rather than rendering an
  // unstyled or invisible badge.
  if (!resolved) {
    return (
      <span
        className="mono"
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontSize: SIZES[size].font,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          padding: SIZES[size].padding,
          borderRadius: "999px",
          border: "1px solid var(--paper-shadow)",
          color: "var(--ink-soft)",
        }}
      >
        {type}
      </span>
    );
  }

  const { background, ink } = resolved;
  const s = SIZES[size];

  return (
    <span
      className="mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        fontSize: s.font,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: s.padding,
        borderRadius: "999px",
        background,
        color: ink,
        // Darkened rim in the type's own hue rather than a flat black outline,
        // so the badge still sits inside the warm paper palette.
        border: `1px solid rgba(64, 52, 42, 0.28)`,
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.22)",
        lineHeight: 1.35,
        whiteSpace: "nowrap",
      }}
    >
      <TypeIcon type={type} size={s.icon} color={ink} />
      {type}
    </span>
  );
}
