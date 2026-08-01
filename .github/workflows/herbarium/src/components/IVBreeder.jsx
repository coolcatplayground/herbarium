import { useState } from "react";

const STATS = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];

function randomSpread() {
  return STATS.map(() => Math.floor(Math.random() * 32));
}

function shuffledIndices() {
  const idx = [0, 1, 2, 3, 4, 5];
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

const ORIGIN_COLOR = {
  "Parent A": "var(--botanical-green)",
  "Parent B": "var(--specimen-red)",
  "Random": "var(--ink-soft)",
};

export default function IVBreeder() {
  const [parentA, setParentA] = useState(randomSpread);
  const [parentB, setParentB] = useState(randomSpread);
  const [destinyKnot, setDestinyKnot] = useState(true);
  const [offspring, setOffspring] = useState(null);

  const updateStat = (setter, spread, i, value) => {
    const next = [...spread];
    next[i] = Math.max(0, Math.min(31, Number(value) || 0));
    setter(next);
  };

  const breed = () => {
    const inheritedCount = destinyKnot ? 5 : 3;
    const inheritedIdx = new Set(shuffledIndices().slice(0, inheritedCount));
    const values = [];
    const origins = [];
    for (let i = 0; i < 6; i++) {
      if (inheritedIdx.has(i)) {
        const fromA = Math.random() < 0.5;
        values.push(fromA ? parentA[i] : parentB[i]);
        origins.push(fromA ? "Parent A" : "Parent B");
      } else {
        values.push(Math.floor(Math.random() * 32));
        origins.push("Random");
      }
    }
    setOffspring({ values, origins });
  };

  return (
    <div className="plate-frame" style={{ padding: "20px 22px" }}>
      <p className="eyebrow" style={{ marginBottom: "4px" }}>Interactive &mdash; IVs &amp; the Destiny Knot</p>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: "18px" }}>
        Set two parent stat spreads (0&ndash;31 each, exactly like real Individual Values), then
        breed them. Each stat is inherited independently &mdash; the closest thing the games have
        to true independent assortment.
      </p>

      <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.85rem", marginBottom: "16px" }}>
        <input type="checkbox" checked={destinyKnot} onChange={(e) => setDestinyKnot(e.target.checked)} />
        Holding a Destiny Knot (inherits 5 of 6 stats instead of 3)
      </label>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--ink-soft)", fontWeight: 600 }}>Stat</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--botanical-green)" }}>Parent A</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--specimen-red)" }}>Parent B</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--ink-soft)" }}>Offspring</th>
            </tr>
          </thead>
          <tbody>
            {STATS.map((stat, i) => (
              <tr key={stat}>
                <td style={{ padding: "6px 8px" }}>{stat}</td>
                <td style={{ padding: "6px 8px" }}>
                  <input
                    type="number"
                    min={0}
                    max={31}
                    value={parentA[i]}
                    onChange={(e) => updateStat(setParentA, parentA, i, e.target.value)}
                    style={{ width: "56px", padding: "4px 6px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
                  />
                </td>
                <td style={{ padding: "6px 8px" }}>
                  <input
                    type="number"
                    min={0}
                    max={31}
                    value={parentB[i]}
                    onChange={(e) => updateStat(setParentB, parentB, i, e.target.value)}
                    style={{ width: "56px", padding: "4px 6px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
                  />
                </td>
                <td style={{ padding: "6px 8px" }}>
                  {offspring ? (
                    <span className="mono" style={{ color: ORIGIN_COLOR[offspring.origins[i]] }}>
                      {offspring.values[i]} <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>({offspring.origins[i]})</span>
                    </span>
                  ) : (
                    <span className="mono" style={{ color: "var(--ink-soft)" }}>&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
        <button
          onClick={breed}
          style={{
            padding: "10px 18px",
            background: "var(--botanical-green-deep)",
            color: "var(--paper-light)",
            border: "none",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Breed
        </button>
        <button
          onClick={() => {
            setParentA(randomSpread());
            setParentB(randomSpread());
            setOffspring(null);
          }}
          style={{
            padding: "10px 18px",
            background: "transparent",
            color: "var(--ink-soft)",
            border: "1px solid var(--paper-shadow)",
            fontFamily: "var(--font-body)",
            cursor: "pointer",
          }}
        >
          Randomize Parents
        </button>
      </div>
    </div>
  );
}
