import { Link } from "react-router-dom";

const STAGE_LABELS = ["Germination", "Vegetative growth", "Flowering / maturity"];

export default function PhenologyTimeline({ stages, currentName }) {
  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: "10px" }}>Growth Record</p>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0" }}>
        {stages.map((stage, i) => {
          const isCurrent = stage.name === currentName;
          const label = STAGE_LABELS[Math.min(i, STAGE_LABELS.length - 1)];
          return (
            <div key={stage.name} style={{ display: "flex", alignItems: "center", flex: stages.length - 1 === i ? "0 0 auto" : "1" }}>
              <Link to={`/specimen/${stage.name}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "90px" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "2px solid var(--botanical-green)",
                      background: isCurrent ? "var(--specimen-red)" : "var(--paper-light)",
                    }}
                  />
                  <span
                    className="mono"
                    style={{
                      fontSize: "0.7rem",
                      textTransform: "capitalize",
                      fontWeight: isCurrent ? 700 : 400,
                      color: isCurrent ? "var(--specimen-red)" : "var(--ink)",
                    }}
                  >
                    {stage.name}
                  </span>
                  <span className="mono" style={{ fontSize: "0.62rem", color: "var(--ink-soft)", textAlign: "center" }}>
                    {label}
                  </span>
                  {stage.trigger && (
                    <span className="mono" style={{ fontSize: "0.6rem", color: "var(--moss)", textAlign: "center" }}>
                      {stage.trigger}
                    </span>
                  )}
                </div>
              </Link>
              {i < stages.length - 1 && (
                <div style={{ flex: 1, height: "2px", background: "var(--paper-line)", minWidth: "24px", marginBottom: "34px" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
