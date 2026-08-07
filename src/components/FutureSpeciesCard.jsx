import { TypeIcon } from "./TypeIcon";

export default function FutureSpeciesCard({ entry, relatedManuscriptTitle }) {
  return (
    <article
      className="plate-frame"
      style={{
        padding: "18px 20px",
        borderStyle: "dashed",
        borderWidth: "1.5px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        <div
          style={{
            flexShrink: 0,
            width: "72px",
            height: "72px",
            borderRadius: "12px",
            border: "1.5px dashed var(--paper-shadow)",
            background: "var(--paper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-hidden="true"
        >
          <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--paper-shadow)" }}>?</span>
        </div>
        <div>
          <p className="eyebrow" style={{ fontSize: "0.85rem", marginBottom: "2px" }}>Concept &mdash; not yet a real specimen</p>
          <h3 style={{ fontSize: "1.05rem", margin: 0, textTransform: "capitalize" }}>{entry.name}</h3>
          {entry.types.length > 0 && (
            <div style={{ display: "flex", gap: "8px", margin: "4px 0 2px" }}>
              {entry.types.map((t) => (
                <span
                  key={t}
                  className="mono"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.68rem", textTransform: "uppercase", color: "var(--ink-soft)" }}
                >
                  <TypeIcon type={t} size={12} />
                  {t}
                </span>
              ))}
            </div>
          )}
          {entry.inspiredBy && (
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)", margin: "2px 0 0" }}>
              inspired by: {entry.inspiredBy}
            </p>
          )}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: "0.92rem" }}>{entry.concept}</p>

      {entry.realBasis && entry.realBasis !== "N/A" && (
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
          <span className="eyebrow" style={{ fontSize: "0.85rem", display: "block", marginBottom: "2px" }}>Real Basis</span>
          {entry.realBasis}
        </p>
      )}

      {relatedManuscriptTitle && (
        <p className="mono" style={{ fontSize: "0.72rem", color: "var(--specimen-red)", margin: 0 }}>
          &rarr; grounded in: {relatedManuscriptTitle}
        </p>
      )}
    </article>
  );
}
