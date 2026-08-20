import { Link } from "react-router-dom";
import { useState } from "react";
import TypeBadge from "./TypeBadge";
import SpecimenCase from "./SpecimenCase";
import { onSpriteError } from "../api/pokeapi";

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
          {note.inherited && (
            <span
              className="mono"
              style={{ fontSize: "0.65rem", color: "var(--paper-shadow)" }}
              title={`Shows the field note written for ${note.inheritedFrom} — this form doesn't have one of its own yet`}
            >
              base note
            </span>
          )}
        </div>
        {sprite && !spriteFailed ? (
          // The plate carries the specimen's name, so the card doesn't repeat
          // it underneath — the binomial below is the label instead, which is
          // how a real herbarium sheet is identified.
          <SpecimenCase sprite={sprite} name={name} lazy onSpriteError={(e) => {
            // First failure swaps in the upstream copy; only if that fails too
            // does the card fall back to its no-sprite layout.
            if (e.currentTarget.dataset.spriteFallback) setSpriteFailed(true);
            else onSpriteError(e);
          }} />
        ) : (
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
            <span className="mono" style={{ fontSize: "0.7rem" }}>no plate</span>
          </div>
        )}
        <div>
          {/* The binomial is the card's heading now that the plate carries the
              common name. Kept as an h3 so the catalog still has one heading
              per specimen for screen readers and document outline. */}
          <h3
            className="mono"
            style={{
              fontSize: "0.82rem",
              fontStyle: "italic",
              fontWeight: 600,
              color: "var(--botanical-green-deep)",
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            {note.binomial}
          </h3>
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
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
