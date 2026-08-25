import { useEffect, useState } from "react";
import { loadFutureSpecies } from "../data/futureSpeciesLoader";
import { loadManuscripts } from "../data/manuscriptsLoader";
import ConceptProjector from "../components/ConceptProjector";
import useDocumentTitle from "../hooks/useDocumentTitle";
import RoomBackdrop from "../components/RoomBackdrop";

// How many slots the drawer shows in total. Concepts fill them from the left
// and the remainder render as empty mounts.
//
// The empty mounts are the point, not padding. This bench holds one worked-out
// concept today and is meant to hold more as new research turns up something
// worth building on — a drawer with visible room in it says that better than a
// sentence promising more later. Raise this when the drawer fills; it should
// always look like there is somewhere to put the next one.
const DRAWER_SLOTS = 6;

export default function FutureSpecies() {
  useDocumentTitle("The Propagation Bench");
  const [entries, setEntries] = useState(null);
  const [manuscriptTitles, setManuscriptTitles] = useState({});
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadFutureSpecies(), loadManuscripts()])
      .then(([futureEntries, manuscripts]) => {
        if (cancelled) return;
        setEntries(futureEntries);
        // Open the first concept rather than an empty stage. The projector is
        // the reason to be on this page; making someone click before anything
        // is on it wastes the one thing worth showing.
        setActiveId((current) => current ?? futureEntries[0]?.id ?? null);
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

  const active = entries?.find((e) => e.id === activeId) || null;
  const emptySlots = Math.max(0, DRAWER_SLOTS - (entries?.length ?? 0));

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <RoomBackdrop image="rooms/propagation-bench.jpg" />
      <section className="page-intro placard" style={{ marginBottom: "28px" }}>
        <p className="eyebrow">Nursery &mdash; Not Yet Real</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Propagation Bench</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Every other drawer in this herbarium holds something pressed &mdash; a real organism,
          flattened and mounted behind glass. These have no body to press. They are creatures
          that could follow from real research but do not exist, so the bench can only project
          them. Pull a sheet from the drawer to put it under the lamp.
        </p>
      </section>

      {error && <p style={{ color: "var(--specimen-red)" }}>Couldn&rsquo;t load the bench ({error}).</p>}
      {!entries && !error && (
        <p className="mono" style={{ color: "var(--ink-soft)" }}>Checking the cuttings&hellip;</p>
      )}

      {entries && entries.length === 0 && (
        <p style={{ color: "var(--ink-soft)" }}>
          Nothing planted yet &mdash; add an entry to{" "}
          <span className="mono">public/future-species.txt</span>.
        </p>
      )}

      {entries && entries.length > 0 && (
        <>
          <div className="drawer" role="tablist" aria-label="Concepts on the bench">
            {entries.map((entry, i) => {
              const selected = entry.id === activeId;
              return (
                <button
                  key={entry.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="concept-stage"
                  className={`drawer__file${selected ? " is-open" : ""}`}
                  onClick={() => setActiveId(entry.id)}
                >
                  <span className="drawer__index mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="drawer__name">{entry.name}</span>
                  <span className="drawer__types mono">
                    {entry.types.length ? entry.types.join(" / ") : "untyped"}
                  </span>
                  {entry.art && (
                    <span className="drawer__has-sheet mono" title="A concept sheet has been drawn">
                      sheet
                    </span>
                  )}
                </button>
              );
            })}

            {Array.from({ length: emptySlots }, (_, i) => (
              <span key={`empty-${i}`} className="drawer__file drawer__file--empty" aria-hidden="true">
                <span className="drawer__index mono">
                  {String(entries.length + i + 1).padStart(2, "0")}
                </span>
                <span className="drawer__empty-note mono">unfilled</span>
              </span>
            ))}
          </div>

          <div id="concept-stage">
            <ConceptProjector
              entry={active}
              manuscriptTitle={
                active?.relatedManuscript ? manuscriptTitles[active.relatedManuscript] : null
              }
            />
          </div>

          <p className="bench__aside placard placard--quiet">
            The drawer has room in it on purpose. A concept gets added when a real finding gives
            it something to stand on &mdash; a newly described species, or a relationship somebody
            has just worked out &mdash; rather than whenever an idea turns up.
          </p>
        </>
      )}
    </div>
  );
}
