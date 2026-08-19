import { Link } from "react-router-dom";
import { spriteUrl, onSpriteError } from "../api/pokeapi";

// The specimen's line of descent, rendered as a vertical stem so it fits the
// narrow left column of the specimen sheet. This replaces two separate
// sections that were showing the same chain twice — a flattened "Growth
// Record" and a branching "Evolution Tree" — and folds the botanical stage
// labels from the first into the single remaining component.
//
// Vertical is the better orientation here, not just the one that fits: a line
// of descent reads top-to-bottom the way a taxonomic hierarchy is printed, and
// nothing has to squeeze when a chain is long.

// Positional rather than index-clamped. The old timeline took stage labels off
// the array index, so on a branching chain three different siblings could all
// come back "Flowering / maturity" — the lineage is a true line, so first and
// last are meaningful.
function stageLabel(index, total) {
  if (total === 1) return "Single stage — no further growth";
  if (index === 0) return "Germination";
  if (index === total - 1) return "Flowering / maturity";
  return "Vegetative growth";
}

const prettify = (n) => n.replace(/-/g, " ");

// Sprite and name are one target, the way the old evolution tree behaved —
// clicking the specimen is the obvious gesture, not just its label.
function LineageNode({ node, isCurrent }) {
  const body = (
    <>
      <img
        src={spriteUrl(node.id)}
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        loading="lazy"
        style={{
          objectFit: "contain",
          borderRadius: "50%",
          background: "var(--paper)",
          border: `2px solid ${isCurrent ? "var(--specimen-red)" : "var(--paper-shadow)"}`,
          padding: "2px",
          // A specimen the collection doesn't hold reads as a reference rather
          // than an exhibit.
          opacity: node.inCollection ? 1 : 0.45,
        }}
      onError={onSpriteError} />
    </>
  );

  if (!node.inCollection) {
    return <span title={`${prettify(node.name)} is not a Grass-type, so it isn't held in this collection`}>{body}</span>;
  }
  return (
    <Link to={`/specimen/${node.name}`} aria-label={prettify(node.name)}>
      {body}
    </Link>
  );
}

export default function GrowthLineage({ lineage, currentSpecies }) {
  if (!lineage?.length) return null;

  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: "2px" }}>Line of Descent</p>
      <p className="mono" style={{ fontSize: "0.66rem", color: "var(--ink-soft)", margin: "0 0 12px" }}>
        This specimen&rsquo;s own line, root to mature form.
      </p>

      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {lineage.map((node, i) => {
          // Compared on the species, not the displayed name: the label is now
          // whichever variety the collection holds (`pumpkaboo-average`),
          // while the page's own identity is still the species (`pumpkaboo`).
          const isCurrent = (node.speciesName || node.name) === currentSpecies;
          const isLast = i === lineage.length - 1;
          return (
            <li key={node.name} style={{ display: "grid", gridTemplateColumns: "44px 1fr", columnGap: "10px" }}>
              {/* Stem column: specimen, then the connector running to the next */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <LineageNode node={node} isCurrent={isCurrent} />
                {!isLast && (
                  <span
                    aria-hidden="true"
                    style={{ width: "2px", flex: 1, minHeight: "26px", background: "var(--paper-line)" }}
                  />
                )}
              </div>

              <div style={{ paddingBottom: isLast ? 0 : "14px" }}>
                {node.inCollection ? (
                  <Link
                    to={`/specimen/${node.name}`}
                    className="mono"
                    style={{
                      display: "inline-block",
                      fontSize: "0.82rem",
                      textTransform: "capitalize",
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? "var(--specimen-red)" : "var(--ink)",
                      textDecoration: "none",
                    }}
                    aria-current={isCurrent ? "true" : undefined}
                  >
                    {prettify(node.name)}
                  </Link>
                ) : (
                  <span
                    className="mono"
                    style={{
                      display: "inline-block",
                      fontSize: "0.82rem",
                      textTransform: "capitalize",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {prettify(node.name)}
                  </span>
                )}

                <p className="mono" style={{ fontSize: "0.64rem", color: "var(--ink-soft)", margin: "1px 0 0" }}>
                  {node.inCollection ? stageLabel(i, lineage.length) : "Not held here — not a Grass-type"}
                </p>

                {node.trigger && (
                  <p className="mono" style={{ fontSize: "0.64rem", color: "var(--moss)", margin: "3px 0 0" }}>
                    &uarr; {node.trigger}
                  </p>
                )}

                {/* Megas and regional forms hang off the species rather than
                    the chain, so they'd otherwise never surface in a lineage
                    at all — Venusaur-Mega belongs on every page of Bulbasaur's
                    line, and Exeggutor-Alola on Exeggcute's. */}
                {node.forms?.length > 0 && (
                  <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {node.forms.map((f) => (
                      <Link
                        key={f.name}
                        to={`/specimen/${f.name}`}
                        className="mono"
                        title={`${prettify(f.name)} — an alternate form of ${prettify(node.name)}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.6rem",
                          textTransform: "capitalize",
                          textDecoration: "none",
                          color: "var(--botanical-green-deep)",
                          border: "1px dashed var(--paper-shadow)",
                          borderRadius: "999px",
                          padding: "2px 7px 2px 3px",
                        }}
                      >
                        <img
                          src={spriteUrl(f.id)}
                          alt=""
                          aria-hidden="true"
                          width={18}
                          height={18}
                          loading="lazy"
                          style={{ objectFit: "contain" }}
                        onError={onSpriteError} />
                        {prettify(f.name)}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Branches this line didn't take, limited to specimens the
                    collection actually holds. */}
                {node.siblings?.length > 0 && (
                  <p className="mono" style={{ fontSize: "0.62rem", color: "var(--ink-soft)", margin: "5px 0 0" }}>
                    also diverges to{" "}
                    {node.siblings.map((s, k) => (
                      <span key={s.name}>
                        {k > 0 && ", "}
                        <Link
                          to={`/specimen/${s.name}`}
                          style={{ color: "var(--botanical-green-deep)", textTransform: "capitalize" }}
                        >
                          {prettify(s.name)}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
