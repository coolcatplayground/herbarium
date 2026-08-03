import { useState } from "react";

const STAGES = [
  {
    key: "biosynthesis",
    label: "Biosynthesis",
    genes: "CHS, DFR",
    description: "Raw anthocyanin production. CHS is the rate-limiting first enzyme in the whole pathway \u2014 the paper's real mutant had this and every other biosynthesis gene upregulated except ANS.",
  },
  {
    key: "stabilization",
    label: "Stabilization",
    genes: "UFGT / GT1, glycosylation genes",
    description: "Raw anthocyanin is chemically unstable and degrades fast. Glycosylation locks it into a stable, transportable form \u2014 without this step, pigment made upstream never survives to accumulate.",
  },
  {
    key: "transport",
    label: "Vacuolar Transport",
    genes: "TT12 (MATE family)",
    description: "Even stabilized pigment is invisible until it's actively pumped into the cell's vacuole. The real mutant had eight TT12 transporter genes upregulated \u2014 pigment has to be made AND moved to actually show as color.",
  },
];

function lerpColor(a, b, t) {
  const parse = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const round = (x) => Math.round(x).toString(16).padStart(2, "0");
  return `#${round(ar + (br - ar) * t)}${round(ag + (bg - ag) * t)}${round(ab + (bb - ab) * t)}`;
}

const PALE = "#f6dde4";
const DEEP = "#8c1f3a";

export default function GeneExpressionConsole() {
  const [levels, setLevels] = useState({ biosynthesis: 70, stabilization: 50, transport: 40 });

  // Bottleneck model: overall pigment output can't exceed whatever stage is
  // most limiting, softened slightly by the other two stages — a rough
  // stand-in for how real rate-limiting steps work in a biosynthetic
  // pathway, not a literal simulation.
  const values = STAGES.map((s) => levels[s.key]);
  const bottleneckValue = Math.min(...values);
  const bottleneckStage = STAGES.find((s) => levels[s.key] === bottleneckValue);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const intensity = Math.round(bottleneckValue * 0.7 + average * 0.3);

  const swatchColor = lerpColor(PALE, DEEP, intensity / 100);

  return (
    <div className="plate-frame" style={{ padding: "24px 26px" }}>
      <p className="eyebrow" style={{ marginBottom: "4px" }}>Interactive &mdash; Modeled on the Real Study</p>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: "20px" }}>
        Set expression levels for the three real pathway stages Lu et al. found differed between a
        light-pink rose and its deep-pink natural mutant. This models pigment <em>intensity</em>{" "}
        specifically &mdash; it doesn't explain Roselia's other real detail, one red flower and one
        blue flower on the same plant, which is a separate, still-open hue question this paper
        doesn't address.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "32px", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "20px" }}>
          {STAGES.map((s) => (
            <div key={s.key}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label htmlFor={s.key} style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {s.label} <span className="mono" style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--ink-soft)" }}>({s.genes})</span>
                </label>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--specimen-red)" }}>{levels[s.key]}%</span>
              </div>
              <input
                id={s.key}
                type="range"
                min={0}
                max={100}
                value={levels[s.key]}
                onChange={(e) => setLevels({ ...levels, [s.key]: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
              <p style={{ fontSize: "0.78rem", color: "var(--ink-soft)", margin: "4px 0 0" }}>{s.description}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: swatchColor,
              border: "1px solid var(--paper-shadow)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",
            }}
            aria-label={`Simulated pigment intensity: ${intensity}%`}
          />
          <p className="mono" style={{ fontSize: "0.78rem", textAlign: "center", margin: 0 }}>
            Pigment intensity<br /><strong style={{ fontSize: "1.1rem" }}>{intensity}%</strong>
          </p>
          <p className="mono" style={{ fontSize: "0.68rem", color: "var(--specimen-red)", textAlign: "center", margin: 0 }}>
            Bottleneck: {bottleneckStage.label}
          </p>
        </div>
      </div>
    </div>
  );
}
