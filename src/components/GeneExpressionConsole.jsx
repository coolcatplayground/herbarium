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
// A genuinely clean blue, distinct from the muddy DEEP_BLUE above — only
// reachable in this model by also clearing the competing red pigment via
// the decomposition slider, since that's the one lever no real rose paper
// actually tests (real breeders want MORE color, not a degradation pathway
// that removes it).
const TRUE_BLUE = "#2f4fa0";
// Deep purple-red for the Shiny form's left arm — grounded directly in
// Cheng et al. 2024's real black-red rose data, not new speculation.
const DEEP_PURPLE = "#3d0f24";
// Near-black with a whisper of violet undertone, matching the real finding
// that "black" plant organs are, on inspection, extremely dense dark
// purple rather than a true black pigment.
const NEAR_BLACK = "#17121e";

export default function GeneExpressionConsole() {
  const [levels, setLevels] = useState({ biosynthesis: 70, stabilization: 50, transport: 40 });
  const [delphinidin, setDelphinidin] = useState(0);
  const [phShift, setPhShift] = useState(0);
  const [decomposition, setDecomposition] = useState(0);
  const [shinyMode, setShinyMode] = useState(false);
  const [flavoneSuppression, setFlavoneSuppression] = useState(0);

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
  // same real pathway with hypothetical steps bolted on, matching how Lee
  // et al. 2025 needed to add F3'5'H AND pH-shifting NHX genes together,
  // not either alone.
  const mutedHue = lerpColor(DEEP_RED, DEEP_BLUE, delphinidin / 100);
  // Decomposition only matters once there's actual blue pigment to reveal —
  // clearing red pigment with nothing behind it just gets back to pale, not
  // blue, so this is gated by delphinidin rather than acting alone.
  const cleanupFactor = (decomposition / 100) * (delphinidin / 100);
  const hueTarget = lerpColor(mutedHue, TRUE_BLUE, cleanupFactor);
  const blueSwatchColor = lerpColor(PALE, hueTarget, intensity / 100);
  const phTooLow = delphinidin > 40 && phShift < 40 && decomposition < 40;

  // Shiny left arm reuses the exact same real intensity math — the paper
  // this grounds shows a ~1.75x concentration jump (1400 vs 800 µg/g) for
  // black-red vs pink roses, same pigment types throughout. No new
  // mechanism, just the same real pathway pushed further.
  const shinyRedSwatch = lerpColor(PALE, DEEP_PURPLE, intensity / 100);

  // Shiny right arm extends the blue theory with a fourth, also-hypothetical
  // lever: suppressing a competing pathway (flavone biosynthesis), the real
  // second mechanism found alongside high anthocyanin in black-pigmented
  // species. Gated the same way as decomposition — only matters once
  // there's already meaningful blue pigment to darken.
  const blackCleanupFactor = (flavoneSuppression / 100) * (delphinidin / 100);
  const shinyHueTarget = lerpColor(hueTarget, NEAR_BLACK, blackCleanupFactor);
  const shinyBlueSwatch = lerpColor(PALE, shinyHueTarget, intensity / 100);

  return (
    <div className="plate-frame" style={{ padding: "24px 26px" }}>
      <p className="eyebrow" style={{ marginBottom: "4px" }}>Test the Hypothesis Yourself</p>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: "20px" }}>
        Adjust expression across the three stages below to watch pigment intensity shift from pale
        to deep. This models intensity specifically &mdash; the separate question of red versus blue
        hue is addressed just below.
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

      <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "4px", color: "var(--specimen-red)" }}>
          Theorizing the Blue Arm &mdash; Speculative, Not From the Cited Manuscript
        </p>

        <div style={{ marginTop: "16px", padding: "22px 24px", border: "1.5px dashed var(--paper-shadow)", borderRadius: "12px" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--ink-soft)", marginBottom: "16px" }}>
            No manuscript here studies Roselia's actual blue arm &mdash; this is theorizing, built on
            real, separate facts. Real roses genetically lack <em>F3'5'H</em>, the enzyme needed to
            make delphinidin, the anthocyanin most responsible for blue/violet color; engineering a
            blue-ish rose took inserting a foreign F3'5'H gene <em>and</em> separately raising
            vacuolar pH via NHX genes, neither alone being enough. But even that real result reads as
            muddy lavender, not clean blue, because residual red pigment stays mixed in. There's a
            third lever no real rose paper tests, because no breeder wants it: real roses actively
            suppress an anthocyanin-degrading enzyme via high tannin content, which is part of why
            cut roses hold color so long. Reversing that &mdash; actively clearing the competing red
            pigment &mdash; is the one thing a breeding program would never try, since it fights the
            entire goal of keeping color, not losing it.
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
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label htmlFor="decomposition" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Anthocyanin Decomposition Pathway <span className="mono" style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--ink-soft)" }}>(ADE/POD activity &mdash; naturally suppressed in real roses)</span>
                  </label>
                  <span className="mono" style={{ fontSize: "0.8rem", color: "var(--specimen-red)" }}>{decomposition}%</span>
                </div>
                <input
                  id="decomposition"
                  type="range"
                  min={0}
                  max={100}
                  value={decomposition}
                  onChange={(e) => setDecomposition(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
                <p style={{ fontSize: "0.76rem", color: "var(--ink-soft)", margin: "6px 0 0" }}>
                  Models what happens if Roselia's blue arm had much lower tannin content, freeing
                  this enzyme to actively clear pigment. The cited paper doesn't show this is
                  selective for red-type anthocyanins over blue-type &mdash; treating it as clearing
                  mainly the competing red, leaving delphinidin intact, is this theory's own reach
                  past what's actually demonstrated.
                </p>
                {phTooLow && (
                  <p style={{ fontSize: "0.76rem", color: "var(--specimen-red)", margin: "6px 0 0" }}>
                    Delphinidin without a matching pH shift or decomposition reads muddy violet-red,
                    not blue &mdash; real engineered blue roses needed pH and pigment addition
                    together, and even then couldn't clear the leftover red the way this third lever
                    theorizes.
                  </p>
                )}
              </div>

              <p style={{ fontSize: "0.78rem", color: "var(--ink-soft)", margin: 0 }}>
                Two honest ways this could actually work in Roselia, neither observed in any real
                rose: (1) tissue-specific activation of genes no real rose carries, switched on only
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
              <p className="mono" style={{ fontSize: "0.68rem", color: "var(--specimen-red)", textAlign: "center", margin: 0 }}>
                {cleanupFactor > 0.6 ? "Reads as clean blue" : delphinidin > 40 ? "Reads as muddy violet-red" : "Still pink"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1.5px dashed var(--paper-shadow)" }}>
        <p className="eyebrow" style={{ marginBottom: "4px", color: "var(--specimen-red)" }}>
          The Shiny Form &mdash; Deep Purple &amp; Black
        </p>

        <div style={{ marginTop: "16px", padding: "22px 24px", border: "1.5px dashed var(--paper-shadow)", borderRadius: "12px" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--ink-soft)", marginBottom: "16px" }}>
            Shiny Roselia shifts its left arm from pink to deep purple and its right arm from blue
            to black. The purple side needs no new mechanism at all: a real rose study found
            "black-red" petals carry nearly double the anthocyanin concentration of pink ones (1400
            vs 800 &micro;g/g), same pigment types throughout &mdash; it's the same real pathway
            modeled above, just pushed further. Black is a genuine extension of the blue theory: a
            review of black-pigmented plants confirms true black pigment doesn't exist in nature at
            all &mdash; every studied case turns out to be extremely dense anthocyanin read as black
            by the eye, sometimes paired with suppression of a second, competing pathway
            (flavone biosynthesis) to darken it further. That's the same two-lever shape as the
            decomposition slider above, extended one step past it.
          </p>

          <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.88rem", marginBottom: "20px" }}>
            <input type="checkbox" checked={shinyMode} onChange={(e) => setShinyMode(e.target.checked)} />
            Preview the Shiny variant
          </label>

          {shinyMode && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: shinyRedSwatch,
                    border: "1px solid var(--paper-shadow)",
                    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",
                  }}
                  aria-label="Shiny left arm color"
                />
                <p className="mono" style={{ fontSize: "0.72rem", textAlign: "center", margin: 0 }}>
                  Left arm &mdash; driven by the same real sliders above
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: shinyBlueSwatch,
                    border: "1px solid var(--paper-shadow)",
                    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",
                  }}
                  aria-label="Shiny right arm color"
                />
                <p className="mono" style={{ fontSize: "0.72rem", textAlign: "center", margin: 0 }}>
                  Right arm &mdash; add flavone suppression below
                </p>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <label htmlFor="flavone" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Hypothetical Flavone Pathway Suppression <span className="mono" style={{ fontWeight: 400, fontSize: "0.72rem", color: "var(--ink-soft)" }}>(a second, real mechanism found alongside high anthocyanin in black-pigmented species)</span>
                  </label>
                  <span className="mono" style={{ fontSize: "0.8rem", color: "var(--specimen-red)" }}>{flavoneSuppression}%</span>
                </div>
                <input
                  id="flavone"
                  type="range"
                  min={0}
                  max={100}
                  value={flavoneSuppression}
                  onChange={(e) => setFlavoneSuppression(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
                <p style={{ fontSize: "0.76rem", color: "var(--ink-soft)", margin: "6px 0 0" }}>
                  Needs the delphinidin and decomposition levers from the blue theory above already
                  turned up &mdash; suppressing a competing pathway only darkens pigment that's
                  already there to darken.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
