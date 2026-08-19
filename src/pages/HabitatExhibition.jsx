import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchGrassRoster, fetchRosterTypes, spriteUrl, onSpriteError } from "../api/pokeapi";
import { getHabitat, getHabitatBySlug } from "../data/habitatMap";
import { loadHabitatOverrides } from "../data/habitatOverridesLoader";
import { loadFieldNotes } from "../data/fieldNotesLoader";
import { getSpecimenNote } from "../data/specimenNote";
import SpecimenCase from "../components/SpecimenCase";
import TypeBadge from "../components/TypeBadge";
import useDocumentTitle from "../hooks/useDocumentTitle";

// One habitat, presented as an exhibition room rather than a filtered list:
// the illustrated scene, the category's own write-up, and then each specimen
// held here shown in its case beside what it personally contributes.
//
// That last part is the payoff of the two-level habitat writing — the category
// text says what the habitat is, and every placard says why this specimen is
// standing in it.
export default function HabitatExhibition() {
  const { slug } = useParams();
  const habitat = getHabitatBySlug(slug);
  useDocumentTitle(habitat ? habitat.name : "Habitat");

  const [roster, setRoster] = useState(null);
  const [typesMap, setTypesMap] = useState({});
  const [overrides, setOverrides] = useState({});
  const [notesMap, setNotesMap] = useState({});
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchGrassRoster(), loadHabitatOverrides(), loadFieldNotes()]).then(
      ([entries, ov, notes]) => {
        if (cancelled) return;
        setRoster(entries);
        setOverrides(ov);
        setNotesMap(notes);
        setProgress({ completed: 0, total: entries.length });
        fetchRosterTypes(entries, {
          onProgress: (completed, total) => !cancelled && setProgress({ completed, total }),
        }).then((types) => {
          if (!cancelled) {
            setTypesMap(types);
            setProgress(null);
          }
        });
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  // Membership is matched on the habitat *name*, not the secondary type, so a
  // hand-overridden specimen (Cacnea is filed under nocturnal-function despite
  // carrying no secondary type at all) turns up in the right room.
  const residents = useMemo(() => {
    if (!roster || !habitat) return [];
    return roster
      .filter((r) => r.name in typesMap)
      .map((r) => ({
        ...r,
        habitat: getHabitat(typesMap[r.name], overrides[r.name]),
        note: getSpecimenNote(r.name, r.id, notesMap),
      }))
      .filter((r) => r.habitat.name === habitat.name);
  }, [roster, typesMap, overrides, notesMap, habitat]);

  if (!habitat) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <p style={{ color: "var(--specimen-red)" }}>No habitat is catalogued under &ldquo;{slug}&rdquo;.</p>
        <Link to="/">&larr; Back to the gallery</Link>
      </div>
    );
  }

  const loading = !roster || progress;

  return (
    <div className="container" style={{ padding: "24px 24px 90px" }}>
      <Link to="/exhibition" className="mono" style={{ fontSize: "0.8rem", color: "var(--ink-soft)", textDecoration: "none" }}>
        &larr; Back to the exhibition hall
      </Link>

      {habitat.image && (
        <figure style={{ margin: "18px 0 0" }}>
          <img
            src={`${import.meta.env.BASE_URL}${habitat.image}`}
            alt={`An illustrated scene of ${habitat.name.toLowerCase()}`}
            style={{
              width: "100%",
              maxHeight: "460px",
              objectFit: "cover",
              borderRadius: "var(--radius)",
              border: "1px solid var(--paper-shadow)",
              display: "block",
            }}
          />
        </figure>
      )}

      <section style={{ maxWidth: "760px", marginTop: habitat.image ? "26px" : "18px" }}>
        <p className="eyebrow">The Habitat Wing</p>
        <h2 style={{ fontSize: "var(--step3)", marginTop: 0, marginBottom: "10px" }}>{habitat.name}</h2>

        {/* The badges carry it on their own — one badge reads as mono-Grass,
            two as a pairing, and a caption saying so was just narrating what
            the reader could already see. The meaning is kept for assistive
            tech, which gets the words rather than the colours. */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}
          aria-label={
            habitat.key === "none"
              ? "Read from Grass typing alone, with no secondary type"
              : `Read from the Grass and ${habitat.key} type pairing`
          }
        >
          <TypeBadge type="grass" size="sm" />
          {habitat.key !== "none" && <TypeBadge type={habitat.key} size="sm" />}
        </div>

        <p style={{ color: "var(--ink-soft)" }}>{habitat.description}</p>
      </section>

      <section style={{ marginTop: "40px" }}>
        <p className="eyebrow" style={{ marginBottom: "4px" }}>
          Held In This Room
        </p>
        <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)", margin: "0 0 20px" }}>
          {loading
            ? progress
              ? `Reading the collection… ${progress.completed}/${progress.total}`
              : "Opening the room…"
            : `${residents.length} specimen${residents.length === 1 ? "" : "s"}`}
        </p>

        <div style={{ display: "grid", gap: "18px" }}>
          {residents.map((r) => (
            <article
              key={r.name}
              className="plate-frame console-split console-split--figure-left"
              style={{ padding: "18px 20px" }}
            >
              <Link to={`/specimen/${r.name}`} style={{ textDecoration: "none" }}>
                <SpecimenCase sprite={spriteUrl(r.id)} name={r.name} lazy onSpriteError={onSpriteError} />
              </Link>

              <div>
                <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)", margin: 0 }}>
                  NO. {String(r.id).padStart(4, "0")}
                </p>
                <h3 style={{ margin: "2px 0 2px", textTransform: "capitalize", fontSize: "1.05rem" }}>
                  <Link to={`/specimen/${r.name}`} style={{ color: "var(--ink)", textDecoration: "none" }}>
                    {r.name.replace(/-/g, " ")}
                  </Link>
                </h3>
                <p
                  className="mono"
                  style={{ fontSize: "0.75rem", fontStyle: "italic", color: "var(--botanical-green-deep)", margin: "0 0 8px" }}
                >
                  {r.note.binomial}
                </p>

                {r.note.habitatNote ? (
                  <p style={{ margin: 0, fontSize: "0.92rem" }}>{r.note.habitatNote}</p>
                ) : (
                  <p className="mono" style={{ margin: 0, fontSize: "0.75rem", color: "var(--ink-soft)" }}>
                    No placard written for this specimen yet &mdash; add a{" "}
                    <span style={{ color: "var(--specimen-red)" }}>habitat_note</span> to its block in
                    field-notes.txt.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
