import { Link } from "react-router-dom";
import { useState } from "react";
import { TypeIcon } from "./TypeIcon";

export default function SpecimenCard({ id, name, sprite, note, types, habitat }) {
  const [spriteFailed, setSpriteFailed] = useState(false);
  return (
    <Link
      to={`/specimen/${name}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <article
        className="plate-frame"
        style={{
          padding: "16px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "3px 4px 0 var(--paper-shadow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-soft)" }}>
            NO. {String(id).padStart(4, "0")}
          </span>
          {!note.curated && (
            <span className="mono" style={{ fontSize: "0.65rem", color: "var(--paper-shadow)" }} title="No field annotation yet">
              uncat.
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "var(--paper)",
            border: "1px solid var(--paper-line)",
            borderRadius: "10px",
            height: "120px",
          }}
        >
          {sprite && !spriteFailed ? (
            <img
              src={sprite}
              alt={name}
              width={90}
              height={90}
              style={{ imageRendering: "pixelated" }}
              loading="lazy"
              onError={() => setSpriteFailed(true)}
            />
          ) : (
            <span className="mono" style={{ fontSize: "0.7rem" }}>no plate</span>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: "1rem", textTransform: "capitalize", marginBottom: "2px" }}>{name}</h3>
          <p className="mono" style={{ fontSize: "0.72rem", fontStyle: "italic", color: "var(--botanical-green)", margin: 0 }}>
            {note.binomial}
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {types.map((t) => (
            <span
              key={t}
              className="mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--ink-soft)",
              }}
            >
              <TypeIcon type={t} size={12} />
              {t}
            </span>
          ))}
        </div>
        {habitat && (
          <span
            className="mono"
            style={{
              fontSize: "0.62rem",
              color: "var(--botanical-green-deep)",
              background: "var(--paper)",
              border: "1px solid var(--botanical-green)",
              borderRadius: "999px",
              padding: "2px 8px",
              alignSelf: "flex-start",
            }}
          >
            {habitat.name}
          </span>
        )}
      </article>
    </Link>
  );
}
