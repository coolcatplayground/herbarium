import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGrassRoster, fetchRosterTypes, spriteUrl } from "../api/pokeapi";
import { getSpecimenNote } from "../data/specimenNote";
import { loadFieldNotes } from "../data/fieldNotesLoader";
import { getHabitat } from "../data/habitatMap";
import { loadHabitatOverrides } from "../data/habitatOverridesLoader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import SpecimenCard from "../components/SpecimenCard";
// The nav's own glyph set, reused so the key's entry point here is visually
// the same object that used to sit in the header.
import { GLYPHS } from "../components/NavHeader";

export default function Herbarium() {
  useDocumentTitle("The Gallery");
  const [roster, setRoster] = useState(null);
  const [notesMap, setNotesMap] = useState({});
  const [habitatOverrides, setHabitatOverrides] = useState({});
  const [typesMap, setTypesMap] = useState({});
  const [typesProgress, setTypesProgress] = useState(null); // {completed, total} while loading
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [habitatFilter, setHabitatFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchGrassRoster(), loadFieldNotes(), loadHabitatOverrides()])
      .then(([entries, notes, overrides]) => {
        if (cancelled) return;
        setRoster(entries);
        setNotesMap(notes);
        setHabitatOverrides(overrides);
        // Fetch habitat-relevant secondary types in the background — the
        // grid is already usable without this, so don't block on it.
        setTypesProgress({ completed: 0, total: entries.length });
        fetchRosterTypes(entries, {
          onProgress: (completed, total) => !cancelled && setTypesProgress({ completed, total }),
        }).then((types) => {
          if (!cancelled) {
            setTypesMap(types);
            setTypesProgress(null);
          }
        });
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const specimens = useMemo(() => {
    if (!roster) return [];
    return roster.map((r) => {
      // A fetched pure-Grass specimen has a secondary type of `null`, which is
      // a real answer, not a missing one — so presence of the key is what
      // distinguishes "resolved" from "still loading". Using `??` here instead
      // collapsed that null into undefined and left all 47 mono-Grass
      // specimens permanently without a habitat.
      const resolved = r.name in typesMap;
      const secondaryType = resolved ? typesMap[r.name] : undefined;
      const habitat = resolved ? getHabitat(secondaryType, habitatOverrides[r.name]) : null;
      return {
        ...r,
        note: getSpecimenNote(r.name, r.id, notesMap),
        secondaryType,
        habitat,
      };
    });
  }, [roster, notesMap, typesMap, habitatOverrides]);

  const habitatOptions = useMemo(() => {
    const seen = new Map();
    specimens.forEach((s) => {
      if (s.habitat) seen.set(s.habitat.name, s.habitat.name);
    });
    return Array.from(seen.values()).sort();
  }, [specimens]);

  const filtered = useMemo(() => {
    return specimens.filter((s) => {
      if (habitatFilter !== "all" && s.habitat?.name !== habitatFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        s.name.includes(q) ||
        s.note.binomial.toLowerCase().includes(q) ||
        s.note.plantAnalogue.toLowerCase().includes(q)
      );
    });
  }, [specimens, query, habitatFilter]);

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      <section style={{ marginBottom: "36px", maxWidth: "720px" }}>
        {/* Reads "Welcome to The Gallery" top-to-bottom while keeping the
            eyebrow-over-heading rhythm every other page uses. */}
        <p className="eyebrow">Welcome to</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Gallery</h2>
        {/* The `base note` and `uncat.` labels still exist and will appear the
            moment a specimen arrives without a write-up — but every one of the
            145 currently held has its own, so the copy no longer explains
            states a visitor can't see. */}
        <p style={{ color: "var(--ink-soft)" }}>
          Every documented Grass-type specimen, grown under glass and catalogued alongside its
          closest analogue in real plant biology. Megas and regional forms are held as specimens
          in their own right rather than as footnotes to the species they came from &mdash; where
          a form differs in mass, structure or tolerance, the difference is the subject of its
          entry.
        </p>
      </section>

      <div
        style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "28px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--paper-line)",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, binomial, or plant analogue&hellip;"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: "1 1 280px",
            padding: "10px 12px",
            border: "1px solid var(--ink)",
            background: "var(--paper-light)",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
          }}
        />
        <select
          value={habitatFilter}
          onChange={(e) => setHabitatFilter(e.target.value)}
          className="mono"
          style={{ padding: "8px 10px", fontSize: "0.78rem", border: "1px solid var(--ink)", background: "var(--paper-light)" }}
        >
          <option value="all">All habitats</option>
          {habitatOptions.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        {/* Third way into the collection, sitting with the other two. Search
            finds a specimen you can already name and the habitat filter finds
            one by where it lives; the key finds one you can only describe. */}
        <Link
          to="/key"
          className="mono"
          title="Identify a specimen by answering one character at a time"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 13px",
            fontSize: "0.78rem",
            textDecoration: "none",
            color: "var(--botanical-green-deep)",
            border: "1px solid var(--ink)",
            background: "var(--paper-light)",
            whiteSpace: "nowrap",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <path d={GLYPHS.key} />
          </svg>
          Key to specimen
        </Link>
        {typesProgress && (
          <span className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)" }}>
            reading habitat data&hellip; {typesProgress.completed}/{typesProgress.total}
          </span>
        )}
        {roster && (
          <span className="mono" style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>
            {filtered.length} / {roster.length} specimens
          </span>
        )}
      </div>

      <p style={{ color: "var(--ink-soft)", fontSize: "0.85rem", maxWidth: "720px", marginTop: "-10px", marginBottom: "24px" }}>
        Habitat is a pattern read off each specimen's real secondary type, not a game fact &mdash;
        Grass/Water tends to mean wetland flora, Grass/Ground tends to mean deep root systems and
        soil interaction, and Grass/Dark reads as nocturnal-function flora: night-active stomata,
        temperature-sensitive processes, and moth- or bat-pollinated blooms, which is exactly why a
        desert cactus like Cacturne ends up there rather than in an odd spot. Where the typing
        genuinely misreads a specimen, the guess is overridden by hand and labelled as such.
      </p>

      {error && (
        <p style={{ color: "var(--specimen-red)" }}>
          Couldn't reach the Pokédex archive ({error}). Try refreshing.
        </p>
      )}

      {!roster && !error && (
        <p className="mono" style={{ color: "var(--ink-soft)" }}>Unrolling the specimen sheets&hellip;</p>
      )}

      <div
        style={{
          display: "grid",
          // Widened from 190px when the specimens moved into glass cases. The
          // case is 4:3 and its cavity is only 61% of that height, so the
          // chrome eats vertical room — at 190px a specimen rendered 69px
          // against the 90px it had in the old flat box.
          //
          // Measured against the 1180px container: this yields four cases per
          // row at 271px each, and a 104px specimen — larger than the old flat
          // layout managed. The catalog was six across before, so the case
          // genuinely costs density; five would need tracks under ~214px,
          // which drops the specimen to ~79px and makes the vitrines cramped.
          // Bigger-and-fewer is the better trade for a wall of cases.
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map((s) => (
          <SpecimenCard
            key={s.id}
            id={s.id}
            name={s.name}
            sprite={spriteUrl(s.id)}
            note={s.note}
            types={s.secondaryType ? ["grass", s.secondaryType] : ["grass"]}
            habitat={s.habitat}
          />
        ))}
      </div>
    </div>
  );
}
