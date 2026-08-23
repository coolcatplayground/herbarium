import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadManuscripts } from "../data/manuscriptsLoader";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Manuscripts() {
  useDocumentTitle("The Reading Room");
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadManuscripts()
      .then((data) => !cancelled && setEntries(data))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <section className="page-intro" style={{ marginBottom: "36px" }}>
        <p className="eyebrow">The Reading Room</p>
        <h2 style={{ fontSize: "var(--step3)" }}>Real Manuscripts, Grass-Type Ideas</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Actual, published agriculture and plant-science research, each paired with one idea for
          how it maps onto the Pok&eacute;mon world. The papers are real and linked directly to
          their source &mdash; the connections are our own reading, not the authors'.
        </p>
        <p className="mono" style={{ fontSize: "0.78rem", color: "var(--botanical-green-deep)" }}>
          Open access only &mdash; every link here is free to read in full, no institutional login required.
        </p>
      </section>

      {error && <p style={{ color: "var(--specimen-red)" }}>Couldn't load the reading list ({error}).</p>}
      {!entries && !error && <p className="mono" style={{ color: "var(--ink-soft)" }}>Pulling books from the shelf&hellip;</p>}
      {entries && entries.length === 0 && (
        <p style={{ color: "var(--ink-soft)" }}>
          Nothing here yet &mdash; add an entry to <span className="mono">public/manuscripts.txt</span>.
        </p>
      )}

      <div style={{ display: "grid", gap: "18px" }}>
        {entries?.map((m) => (
          <article key={m.id} className="plate-frame" style={{ padding: "20px 24px" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{m.title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", margin: "0 0 12px" }}>
              <p className="mono" style={{ fontSize: "0.78rem", color: "var(--ink-soft)", margin: 0 }}>
                {[m.authors, m.year, m.journal].filter(Boolean).join(" · ")}
              </p>
              {m.openAccess && (
                <span
                  className="mono"
                  style={{
                    fontSize: "0.65rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--botanical-green-deep)",
                    background: "var(--paper)",
                    border: "1px solid var(--botanical-green)",
                    borderRadius: "999px",
                    padding: "2px 9px",
                  }}
                  title="Free to read in full, no paywall or institutional login required"
                >
                  Open Access
                </span>
              )}
            </div>

            <p style={{ margin: "0 0 14px" }}>
              <span className="eyebrow" style={{ fontSize: "0.9rem", display: "block", marginBottom: "2px" }}>
                The Pok&eacute;mon Connection
              </span>
              {m.connection}
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
              <a
                href={m.link}
                target="_blank"
                rel="noreferrer"
                className="mono"
                style={{
                  fontSize: "0.78rem",
                  color: "var(--botanical-green-deep)",
                  textDecoration: "none",
                  border: "1px solid var(--botanical-green)",
                  borderRadius: "999px",
                  padding: "5px 14px",
                }}
              >
                Read the paper &#8599;
              </a>
              {m.relatedSpecimen && (
                <Link
                  to={`/specimen/${m.relatedSpecimen}`}
                  className="mono"
                  style={{ fontSize: "0.78rem", color: "var(--specimen-red)", textDecoration: "none" }}
                >
                  See {m.relatedSpecimen} on the specimen page &rarr;
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
