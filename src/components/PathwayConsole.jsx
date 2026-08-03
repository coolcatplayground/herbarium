import { useState } from "react";

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function interpolateColor(lowHex, highHex, t) {
  const low = hexToRgb(lowHex);
  const high = hexToRgb(highHex);
  const mixed = low.map((c, i) => c + (high[i] - c) * t);
  return rgbToHex(mixed);
}

// Models a real biosynthetic pathway bottleneck: output intensity is capped
// by whichever stage is weakest, not the average of all stages — the same
// logic as a real rate-limiting step. Cranking one slider to max doesn't
// help if an earlier or later stage is still low.
export default function PathwayConsole({ stages, lowColor, highColor, lowLabel, highLabel, regulator }) {
  const [levels, setLevels] = useState(() => Object.fromEntries(stages.map((s) => [s.key, 30])));
  const [regulatorSilenced, setRegulatorSilenced] = useState(false);

  const effectiveLevels = { ...levels };
  if (regulator && regulatorSilenced) {
    effectiveLevels[regulator.gatesKey] = Math.min(effectiveLevels[regulator.gatesKey], 8);
  }

  const bottleneck = Math.min(...stages.map((s) => effectiveLevels[s.key]));
  const t = bottleneck / 100;
  const color = interpolateColor(lowColor, highColor, t);
  const bottleneckStage = stages.find((s) => effectiveLevels[s.key] === bottleneck);

  return (
    <div className="plate-frame" style={{ padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background: color,
              border: "1px solid var(--paper-shadow)",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.08)",
              transition: "background 0.2s ease",
            }}
            aria-hidden="true"
          />
          <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)", textAlign: "center", margin: 0 }}>
            {t < 0.25 ? lowLabel : t > 0.7 ? highLabel : "intermediate"}
          </p>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {stages.map((s) => (
            <div key={s.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span className="eyebrow" style={{ fontSize: "0.68rem" }}>{s.label}</span>
                <span className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-soft)" }}>
                  {effectiveLevels[s.key]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={levels[s.key]}
                onChange={(e) => setLevels({ ...levels, [s.key]: Number(e.target.value) })}
                style={{ width: "100%" }}
                disabled={regulator && regulatorSilenced && s.key === regulator.gatesKey}
              />
              <p style={{ fontSize: "0.78rem", color: "var(--ink-soft)", margin: "4px 0 0" }}>{s.description}</p>
            </div>
          ))}

          {regulator && (
            <label style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "0.82rem", marginTop: "4px" }}>
              <input
                type="checkbox"
                checked={regulatorSilenced}
                onChange={(e) => setRegulatorSilenced(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <span>{regulator.label}</span>
            </label>
          )}

          <div style={{ paddingTop: "12px", borderTop: "1px solid var(--paper-line)" }}>
            <p className="mono" style={{ fontSize: "0.75rem", color: "var(--specimen-red)", margin: 0 }}>
              Bottleneck: {bottleneckStage.label} ({bottleneck}%)
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--ink-soft)", margin: "4px 0 0" }}>
              Color depth is capped by the weakest stage, not the average of all three &mdash; exactly
              like a real pathway's rate-limiting step. Maxing out the other two sliders won't fix a
              bottleneck here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
