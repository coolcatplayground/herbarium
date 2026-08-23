import { useEffect, useState } from "react";
import { loadFutureSpecies } from "../data/futureSpeciesLoader";
import { loadManuscripts } from "../data/manuscriptsLoader";
import FutureSpeciesCard from "../components/FutureSpeciesCard";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function FutureSpecies() {
  useDocumentTitle("The Propagation Bench");
  const [entries, setEntries] = useState(null);
  const [manuscriptTitles, setManuscriptTitles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadFutureSpecies(), loadManuscripts()])
      .then(([futureEntries, manuscripts]) => {
        if (cancelled) return;
        setEntries(futureEntries);
        const titles = {};
        manuscripts.forEach((m) => {
          titles[m.id] = m.title;
        });
        setManuscriptTitles(titles);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <section className="page-intro" style={{ marginBottom: "36px" }}>
        <p className="eyebrow">Nursery &mdash; Not Yet Real</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Propagation Bench</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Speculative Grass-type concepts, each a plausible next step from real, current plant
          science rather than pure invention. Nothing here is an actual Pok&eacute;mon &mdash; every
          entry is a cutting waiting to grow into a full idea, rendered as a placeholder until it
          does.
        </p>
      </section>

      {error && <p style={{ color: "var(--specimen-red)" }}>Couldn't load the bench ({error}).</p>}
      {!entries && !error && <p className="mono" style={{ color: "var(--ink-soft)" }}>Checking the cuttings&hellip;</p>}
      {entries && entries.length === 0 && (
        <p style={{ color: "var(--ink-soft)" }}>
          Nothing planted yet &mdash; add an entry to <span className="mono">public/future-species.txt</span>.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
        {entries?.map((entry) => (
          <FutureSpeciesCard
            key={entry.id}
            entry={entry}
            relatedManuscriptTitle={entry.relatedManuscript ? manuscriptTitles[entry.relatedManuscript] : null}
          />
        ))}
      </div>
    </div>
  );
}
