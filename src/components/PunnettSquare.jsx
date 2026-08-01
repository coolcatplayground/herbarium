import { Fragment } from "react";

function phenotypeFor(genotype, mode, dominantLabel, recessiveLabel, blendLabel) {
  const upper = (genotype.match(/[A-Z]/g) || []).length;
  if (mode === "complete") {
    return upper > 0 ? dominantLabel : recessiveLabel;
  }
  // incomplete dominance
  if (upper === 2) return dominantLabel;
  if (upper === 0) return recessiveLabel;
  return blendLabel;
}

function phenotypeColor(genotype, mode) {
  const upper = (genotype.match(/[A-Z]/g) || []).length;
  if (mode === "complete") return upper > 0 ? "var(--botanical-green)" : "var(--paper-shadow)";
  if (upper === 2) return "var(--specimen-red)";
  if (upper === 0) return "var(--paper-shadow)";
  return "var(--gold-line)";
}

export default function PunnettSquare({ parentA, parentB, mode, dominantLabel, recessiveLabel, blendLabel }) {
  const allelesA = parentA.split("");
  const allelesB = parentB.split("");
  const offspring = allelesA.flatMap((a) => allelesB.map((b) => [a, b].sort().reverse().join("")));

  const counts = offspring.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const phenotypeCounts = offspring.reduce((acc, g) => {
    const p = phenotypeFor(g, mode, dominantLabel, recessiveLabel, blendLabel);
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(2, 80px)", gridTemplateRows: "60px repeat(2, 80px)" }}>
        <div />
        {allelesB.map((b, i) => (
          <div key={`colhead-${i}`} className="mono" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem", color: "var(--botanical-green-deep)" }}>
            {b}
          </div>
        ))}
        {allelesA.map((a, rowI) => (
          <Fragment key={`row-${rowI}`}>
            <div key={`rowhead-${rowI}`} className="mono" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem", color: "var(--botanical-green-deep)" }}>
              {a}
            </div>
            {allelesB.map((b, colI) => {
              const g = [a, b].sort().reverse().join("");
              return (
                <div
                  key={`cell-${rowI}-${colI}`}
                  className="mono"
                  style={{
                    border: "1px solid var(--ink)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--paper)",
                    gap: "2px",
                  }}
                >
                  <span style={{ fontSize: "1rem", fontWeight: 700 }}>{g}</span>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: phenotypeColor(g, mode) }} />
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>

      <div style={{ marginTop: "20px", display: "grid", gap: "6px" }}>
        <p className="eyebrow" style={{ marginBottom: "2px" }}>Offspring Ratios</p>
        <p className="mono" style={{ fontSize: "0.8rem", margin: 0 }}>
          Genotype: {Object.entries(counts).map(([g, c]) => `${g} (${c}/4)`).join("  \u00b7  ")}
        </p>
        <p className="mono" style={{ fontSize: "0.8rem", margin: 0 }}>
          Phenotype: {Object.entries(phenotypeCounts).map(([p, c]) => `${p} (${c}/4)`).join("  \u00b7  ")}
        </p>
      </div>
    </div>
  );
}
