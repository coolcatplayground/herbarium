import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGrassRoster, fetchKeyData, onSpriteError, thumbUrl } from "../api/pokeapi";
import { getHabitat } from "../data/habitatMap";
import { loadHabitatOverrides } from "../data/habitatOverridesLoader";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Character axes for the key, in the fixed order they're asked. Each axis
// pulls from a field already computed on every specimen object below.
const AXES = [
  { key: "habitatName", label: "Habitat Affinity" },
  { key: "stage", label: "Evolutionary Stage" },
  { key: "generation", label: "Generation Introduced" },
  { key: "formType", label: "Form" },
];

const STAGE_ORDER = ["Does Not Evolve", "Base Stage", "Middle Stage", "Final Stage", "Unknown"];
const GEN_ORDER = [
  "Kanto (Gen I)", "Johto (Gen II)", "Hoenn (Gen III)", "Sinnoh (Gen IV)",
  "Unova (Gen V)", "Kalos (Gen VI)", "Alola (Gen VII)", "Galar (Gen VIII)",
  "Paldea (Gen IX)", "Unknown",
];
const FORM_ORDER = ["Standard Species", "Mega Evolution", "Alolan Form", "Galarian Form", "Hisuian Form", "Paldean Form"];

function sortValues(axisKey, values) {
  const order = axisKey === "stage" ? STAGE_ORDER : axisKey === "generation" ? GEN_ORDER : axisKey === "formType" ? FORM_ORDER : null;
  if (!order) return [...values].sort();
  return [...values].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

// Sentinel for "I don't know / can't tell" on a step, distinct from
// "not answered yet" (null). A skipped step doesn't narrow the pool, but
// still counts as answered so the key moves on to the next character.
const SKIP = "__SKIP__";
const EMPTY_FILTERS = { habitatName: null, stage: null, generation: null, formType: null };

export default function DeterminationKey() {
  useDocumentTitle("The Determination Key");
  const [roster, setRoster] = useState(null);
  const [keyData, setKeyData] = useState({});
  const [progress, setProgress] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  // The key has to read habitats the same way the gallery does, overrides
  // included — otherwise Cacnea keys out as unspecialised here while its own
  // specimen face and the gallery both file it under nocturnal-function.
  const [habitatOverrides, setHabitatOverrides] = useState({});

  useEffect(() => {
    let cancelled = false;
    loadHabitatOverrides().then((o) => !cancelled && setHabitatOverrides(o));
    fetchGrassRoster().then((entries) => {
      if (cancelled) return;
      setRoster(entries);
      fetchKeyData(entries, {
        onProgress: (completed, total) => {
          if (!cancelled) setProgress({ completed, total });
        },
      }).then((data) => {
        if (!cancelled) setKeyData(data);
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const specimens = useMemo(() => {
    if (!roster) return [];
    return roster.map((r) => {
      const d = keyData[r.name] || {};
      return {
        ...r,
        secondaryType: d.secondaryType ?? null,
        habitatName: getHabitat(d.secondaryType, habitatOverrides[r.name]).name,
        stage: d.stage || "Unknown",
        generation: d.generation || "Unknown",
        formType: d.formType || "Standard Species",
      };
    });
  }, [roster, keyData, habitatOverrides]);

  // Walks the fixed axis order and stops at the first unanswered step (or
  // the point the pool narrows to one), rather than computing everything
  // at once — that's what turns this into a staircase instead of a flat
  // filter panel. Each already-answered axis narrows the running pool in
  // order; a skipped axis is recorded but doesn't narrow anything.
  const { steps, finalPool, status } = useMemo(() => {
    let pool = specimens;
    const built = [];
    for (let i = 0; i < AXES.length; i++) {
      const axis = AXES[i];
      const val = filters[axis.key];
      if (val === null) {
        built.push({ axis, index: i, status: "active", pool });
        return { steps: built, finalPool: pool, status: "active" };
      }
      built.push({ axis, index: i, status: "answered", value: val });
      if (val !== SKIP) pool = pool.filter((s) => s[axis.key] === val);
      // An empty pool is not a determination — treating it as one and then
      // reading finalPool[0] takes the whole page down. The options offered at
      // each step are derived from the live pool so this shouldn't arise from
      // normal use, but a stale or hand-edited answer can still produce it.
      if (pool.length === 0) {
        return { steps: built, finalPool: pool, status: "none" };
      }
      if (pool.length === 1) {
        return { steps: built, finalPool: pool, status: "determined" };
      }
    }
    return { steps: built, finalPool: pool, status: pool.length === 1 ? "determined" : "exhausted" };
  }, [specimens, filters]);

  function changeFromStep(index) {
    setFilters((f) => {
      const next = { ...f };
      for (let j = index; j < AXES.length; j++) next[AXES[j].key] = null;
      return next;
    });
  }

  const anyAnswered = Object.values(filters).some((v) => v !== null);
  const loading = !roster || (progress && progress.completed < progress.total);

  return (
    <div className="container" style={{ padding: "24px 24px 60px" }}>
      {/* The key is reached from the gallery's filter row rather than the nav,
          so it carries its own way back. */}
      <Link to="/" className="mono" style={{ fontSize: "0.8rem", color: "var(--ink-soft)", textDecoration: "none" }}>
        &larr; Back to the gallery
      </Link>
      <section className="page-intro" style={{ margin: "18px 0 32px" }}>
        <p className="eyebrow">Determinavit</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Determination Key</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Real herbaria call this process determination &mdash; working out what a specimen actually
          is, and leaving a record of how you got there. We've laid it out the way a printed
          identification key traditionally is: nested, one step revealed under the last, narrowing
          the field with each answer you give. A couple of steps here offer more than two options at
          once, which technically makes this a polytomous key rather than a strictly binary
          dichotomous one &mdash; and unlike paper, you can always go back and change an earlier
          answer without starting over.
        </p>
        <p style={{ color: "var(--ink-soft)" }}>
          A note on how to read this: the four characters below sort by classification &mdash; type
          pairing, evolutionary stage, generation, and form &mdash; not by what a specimen actually
          looks like. A true botanical key leans on leaf shape and growth habit instead, which is a
          slower, one-by-one kind of looking we haven't done for the whole roster yet. Think of this
          as the first pass, with the visual work still ahead of us.
        </p>
      </section>

      {loading ? (
        <p className="mono" style={{ color: "var(--ink-soft)" }}>
          {progress ? `Cataloging specimens\u2026 ${progress.completed}/${progress.total}` : "Loading roster\u2026"}
        </p>
      ) : (
        <>
          <section style={{ marginBottom: "28px" }}>
            {steps.map((step, i) => {
              const isFirst = i === 0;
              return (
                <div
                  key={step.axis.key}
                  style={{
                    marginLeft: isFirst ? 0 : "22px",
                    paddingLeft: isFirst ? 0 : "18px",
                    borderLeft: isFirst ? "none" : "2px solid var(--paper-shadow)",
                    paddingBottom: "18px",
                  }}
                >
                  <p className="eyebrow" style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                    {i + 1}. {step.axis.label}
                  </p>

                  {step.status === "answered" ? (
                    <p className="mono" style={{ fontSize: "0.8rem", margin: 0 }}>
                      {step.value === SKIP ? (
                        <span style={{ color: "var(--ink-soft)" }}>Skipped</span>
                      ) : (
                        <span style={{ color: "var(--specimen-red)" }}>{step.value}</span>
                      )}{" "}
                      <button
                        onClick={() => changeFromStep(i)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--botanical-green-deep)",
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          padding: 0,
                          marginLeft: "6px",
                        }}
                      >
                        change
                      </button>
                    </p>
                  ) : (
                    (() => {
                      const counts = {};
                      step.pool.forEach((s) => {
                        counts[s[step.axis.key]] = (counts[s[step.axis.key]] || 0) + 1;
                      });
                      const values = sortValues(step.axis.key, Object.keys(counts));
                      return (
                        <div>
                          <p className="mono" style={{ fontSize: "0.75rem", color: "var(--ink-soft)", marginBottom: "8px" }}>
                            {step.pool.length} candidates so far
                          </p>
                          <select
                            value=""
                            onChange={(e) => setFilters((f) => ({ ...f, [step.axis.key]: e.target.value }))}
                            style={{
                              padding: "8px 10px",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.8rem",
                              border: "1px solid var(--paper-shadow)",
                              borderRadius: "8px",
                              background: "var(--paper)",
                              color: "var(--ink)",
                              marginRight: "10px",
                            }}
                          >
                            <option value="" disabled>Choose {step.axis.label.toLowerCase()}&hellip;</option>
                            {values.map((v) => (
                              <option key={v} value={v}>{v} ({counts[v]})</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setFilters((f) => ({ ...f, [step.axis.key]: SKIP }))}
                            className="mono"
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--ink-soft)",
                              textDecoration: "underline",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              padding: 0,
                            }}
                          >
                            Skip this character
                          </button>
                        </div>
                      );
                    })()
                  )}
                </div>
              );
            })}

            {anyAnswered && (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mono"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--specimen-red)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Start over
              </button>
            )}
          </section>

          <section>
            {status === "determined" ? (
              <Link
                to={`/specimen/${finalPool[0].name}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "96px 1fr",
                  gap: "18px",
                  alignItems: "center",
                  padding: "20px",
                  border: "2px solid var(--specimen-red)",
                  borderRadius: "14px",
                  textDecoration: "none",
                  maxWidth: "440px",
                }}
              >
                <img src={thumbUrl(finalPool[0].id)} alt={finalPool[0].name} width={80} height={80} style={{ objectFit: "contain" }} onError={onSpriteError} />
                <div>
                  <p className="eyebrow" style={{ marginBottom: "2px", color: "var(--specimen-red)" }}>Determined</p>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "var(--ink)", textTransform: "capitalize" }}>
                    {finalPool[0].name.replace(/-/g, " ")}
                  </p>
                </div>
              </Link>
            ) : status === "none" ? (
              <p style={{ color: "var(--specimen-red)", maxWidth: "600px" }}>
                No specimen in the roster carries that combination of characters. Change an earlier
                answer above, or start over.
              </p>
            ) : status === "exhausted" ? (
              <div>
                <p style={{ color: "var(--ink-soft)", maxWidth: "600px", marginBottom: "16px" }}>
                  Every character here has been answered or skipped, and {finalPool.length} specimens
                  still land in exactly the same spot. That's a real limit of sorting by
                  classification alone &mdash; telling them apart from here would take an actual look
                  at leaf shape and growth habit, not just what's on file.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: "16px" }}>
                  {finalPool.map((s) => (
                    <Link
                      key={s.name}
                      to={`/specimen/${s.name}`}
                      style={{ textDecoration: "none", textAlign: "center", color: "var(--ink)" }}
                    >
                      <img src={thumbUrl(s.id)} alt={s.name} width={64} height={64} style={{ objectFit: "contain" }} onError={onSpriteError} />
                      <p className="mono" style={{ fontSize: "0.68rem", margin: "4px 0 0", textTransform: "capitalize" }}>
                        {s.name.replace(/-/g, " ")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}

