import { useState } from "react";

export default function TheorycraftingFAQ({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {items.map((item, i) => {
        const isOpen = openId === i;
        return (
          <div key={i} className="plate-frame" style={{ overflow: "hidden" }}>
            <button
              onClick={() => setOpenId(isOpen ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "16px 18px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "var(--botanical-green-deep)",
              }}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span
                className="mono"
                style={{
                  flexShrink: 0,
                  fontSize: "0.9rem",
                  color: "var(--specimen-red)",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.15s ease",
                }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <p style={{ margin: 0, padding: "0 18px 18px", color: "var(--ink-soft)" }}>
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
