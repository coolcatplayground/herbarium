import { Link } from "react-router-dom";
import TypeBadge from "./TypeBadge";

// The Propagation Bench's viewer.
//
// Everywhere else in this collection, a specimen is PRESSED: a real organism,
// flattened onto a real sheet, mounted behind real glass. That is what a
// herbarium does and the whole site is built on it.
//
// A concept has no body to press. There is nothing to flatten, nothing to
// mount — so the honest way to show one is to project it, and to let the
// projection look like exactly what it is: light standing in for a specimen
// that does not exist yet. The hologram is not decoration bolted onto a card;
// it is the argument for why this room looks different from every other room.
//
// Which is why the cabinet around it stays warm paper and only the projection
// runs cold. The bench is still part of the herbarium. It is the one drawer
// that looks forward instead of back.
export default function ConceptProjector({ entry, manuscriptTitle }) {
  if (!entry) return null;

  return (
    <div className="proj" role="group" aria-label={`Concept: ${entry.name}`}>
      {/* Emitter: the projection has to come from somewhere or it reads as a
          panel with a filter on it rather than as light in a room. */}
      <div className="proj__emitter" aria-hidden="true">
        <span className="proj__lens" />
        <span className="proj__beam" />
      </div>

      <div className="proj__stage">
        <div className="proj__scan" aria-hidden="true" />
        {/* A single soft line travelling down the stage, on a long loop. It
            reads as the projection being drawn rather than as a fault in it,
            which a flicker never quite does — a flickering hologram says the
            equipment is failing, and nothing here is failing. */}
        <div className="proj__sweep" aria-hidden="true" />

        <div className="proj__grid">
          <div className="proj__figure">
            {entry.art ? (
              <img
                className="proj__sheet"
                src={`${import.meta.env.BASE_URL}${entry.art}`}
                alt={`Concept sheet for ${entry.name}`}
                loading="lazy"
              />
            ) : (
              // A concept with no sheet drawn yet is the normal case, not an
              // error, so it gets a deliberate empty state rather than a
              // broken frame or a stretched placeholder.
              <div className="proj__unsheeted">
                <span className="proj__unsheeted-mark" aria-hidden="true">?</span>
                <p className="mono">no sheet drawn yet</p>
              </div>
            )}
          </div>

          <div className="proj__read">
            <p className="proj__eyebrow">Projected concept</p>
            <h3 className="proj__name">{entry.name}</h3>
            {/* The working note is kept but demoted. A name on this bench is
                provisional by definition, and saying so under the title is
                more honest than a title that pretends to be settled. */}
            {entry.nameNote && <p className="proj__namenote mono">{entry.nameNote}</p>}

            {entry.types.length > 0 && (
              <div className="proj__types">
                {entry.types.map((t) => (
                  <TypeBadge key={t} type={t} />
                ))}
              </div>
            )}

            {entry.inspiredBy && (
              <div className="proj__field">
                <p className="proj__label">Riffs on</p>
                <p>{entry.inspiredBy}</p>
              </div>
            )}

            <div className="proj__field">
              <p className="proj__label">The concept</p>
              <p>{entry.concept}</p>
            </div>

            {entry.realBasis && (
              <div className="proj__field proj__field--basis">
                <p className="proj__label">What it is standing on</p>
                <p>{entry.realBasis}</p>
              </div>
            )}

            {entry.relatedManuscript && (
              <p className="proj__cite">
                <Link to="/manuscripts">
                  {manuscriptTitle || entry.relatedManuscript}
                </Link>
                <span className="proj__cite-tail"> — in the Reading Room</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Said once, at the foot of the projection, rather than repeated on
          every concept: this room's caveat is structural, not per-entry. */}
      <p className="proj__footnote placard placard--quiet">
        Not a real Pok&eacute;mon, and not a prediction. A concept is only worth
        keeping here if the science under it is real &mdash; the leap from that
        science to the creature is ours, and it is the part that is made up.
      </p>
    </div>
  );
}
