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
const DEEP_RED = "#8c1f3a";
// A muted violet-blue, not a saturated sky blue — real engineered "blue"
// roses (e.g. Suntory's Applause) read as lavender-mauve, not vivid blue,
// because residual red pigment and imperfect pH shift keep it from ever
// being a clean blue. Modeling a fully saturated blue would overstate what
// the real mechanism actually produces.
const DEEP_BLUE = "#5b4b8a";

export default function GeneExpressionConsole() {
  const [levels, setLevels] = useState({ biosynthesis: 70, stabilization: 50, transport: 40 });
  const [theoryOpen, setTheoryOpen] = useState(false);
  const [delphinidin, setDelphinidin] = useState(0);
  const [phShift, setPhShift] = useState(0);

  // Bottleneck model: overall pigment output can't exceed whatever stage is
  // most limiting, softened slightly by the other two stages — a rough
  // stand-in for how real rate-limiting steps work in a biosynthetic
  // pathway, not a literal simulation.
  const values = STAGES.map((s) => levels[s.key]);
  const bottleneckValue = Math.min(...values);
  const bottleneckStage = STAGES.find((s) => levels[s.key] === bottleneckValue);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const intensity = Math.round(bottleneckValue * 0.7 + average * 0.3);

  const swatchColor = lerpColor(PALE, DEEP_RED, intensity / 100);

  // The blue-arm theory reuses the SAME pigment-amount math (intensity) as
  // the real sliders above — the theory isn't a separate system, it's the
  // same real pathway with two extra, explicitly hypothetical steps bolted
  // on, matching how Lee et al. 2025 needed to add F3'5'H AND pH-shifting
  // NHX genes together, not either alone.
  const hueTarget = lerpColor(DEEP_RED, DEEP_BLUE, delphinidin / 100);
  const blueSwatchColor = lerpColor(PALE, hueTarget, intensity / 100);
  const phTooLow = delphinidin > 40 && phShift < 40;

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

      <button
        onClick={() => setTheoryOpen(!theoryOpen)}
        style={{
          marginTop: "24px",
          padding: "10px 16px",
          background: "transparent",
          border: "1.5px dashed var(--paper-shadow)",
          borderRadius: "10px",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "0.85rem",
          color: "var(--specimen-red)",
          width: "100%",
          textAlign: "left",
        }}
      >
        {theoryOpen ? "\u2212" : "+"} Theorizing the blue arm (speculative &mdash; not from the cited manuscript)
      </button>

      {theoryOpen && (
        <div style={{ marginTop: "16px", padding: "22px 24px", border: "1.5px dashed var(--paper-shadow)", borderRadius: "12px" }}>
          <p className="eyebrow" style={{ marginBottom: "8px" }}>Speculation, Clearly Labeled</p>
          <p style={{ fontSize: "0.88rem", color: "var(--ink-soft)", marginBottom: "16px" }}>
            No manuscript here studies Roselia's actual blue arm &mdash; this is theorizing, built on
            a real, separate fact: real roses genetically lack <em>F3'5'H</em>, the enzyme needed to
            make delphinidin, the anthocyanin most responsible for blue/violet color. No natural rose
            has ever been blue because of this single missing gene. Scientists who engineered a
            blue-ish rose had to insert a foreign F3'5'H gene <em>and</em> separately raise vacuolar
            pH via NHX genes &mdash; neither change alone was enough. The two sliders below are that
            same two-part real mechanism, treated as hypothetical additions layered on top of the
            same real pathway modeled above.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "32px", alignItems: "start" }}>
            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label htmlFor="delphinidin" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Hypothetical Delphinidin Pathway <span className="mono" style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--ink-soft)" }}>(F3'5'H-like activity &mdash; absent in every real rose)</span>
                  </label>
                  <span className="mono" style={{ fontSize: "0.8rem", color: "var(--specimen-red)" }}>{delphinidin}%</span>
                </div>
                <input
                  id="delphinidin"
                  type="range"
                  min={0}
                  max={100}
                  value={delphinidin}
                  onChange={(e) => setDelphinidin(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label htmlFor="ph" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Vacuolar pH Shift <span className="mono" style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--ink-soft)" }}>(NHX-like activity)</span>
                  </label>
                  <span className="mono" style={{ fontSize: "0.8rem", color: "var(--specimen-red)" }}>{phShift}%</span>
                </div>
                <input
                  id="ph"
                  type="range"
                  min={0}
                  max={100}
                  value={phShift}
                  onChange={(e) => setPhShift(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
                {phTooLow && (
                  <p style={{ fontSize: "0.76rem", color: "var(--specimen-red)", margin: "6px 0 0" }}>
                    Delphinidin without a matching pH shift reads muddy violet-red, not blue &mdash;
                    real engineered blue roses needed both changes together.
                  </p>
                )}
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--ink-soft)", margin: 0 }}>
                Two honest ways this could actually work in Roselia, neither observed in any real
                rose: (1) tissue-specific activation of a gene no real rose carries, switched on only
                in the blue arm, or (2) Roselia isn't one genotype at all but a graft chimera &mdash;
                two genetically distinct plant lineages fused into one body, each running its own
                real chemistry. Real botany has a documented example of exactly that: +Laburnocytisus
                adamii, a 19th-century graft-chimera that grows two visually and genetically distinct
                flower types on one plant because it's literally two plants fused, not a mutation.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: blueSwatchColor,
                  border: "1px solid var(--paper-shadow)",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",
                }}
                aria-label="Theorized blue-arm color"
              />
              <p className="mono" style={{ fontSize: "0.78rem", textAlign: "center", margin: 0 }}>
                Theorized blue arm
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
