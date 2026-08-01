import { useEffect, useMemo, useState } from "react";
import { fetchGrassRoster, fetchRosterTypes } from "../api/pokeapi";
import { getSpecimenNote } from "../data/specimenNote";
import { loadFieldNotes } from "../data/fieldNotesLoader";
import { getHabitat } from "../data/habitatMap";
import { loadHabitatOverrides } from "../data/habitatOverridesLoader";
import useDocumentTitle from "../hooks/useDocumentTitle";
import SpecimenCard from "../components/SpecimenCard";

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function Herbarium() {
  useDocumentTitle("The Glasshouse");
  const [roster, setRoster] = useState(null);
  const [notesMap, setNotesMap] = useState({});
  const [habitatOverrides, setHabitatOverrides] = useState({});
  const [typesMap, setTypesMap] = useState({});
  const [typesProgress, setTypesProgress] = useState(null); // {completed, total} while loading
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [onlyCurated, setOnlyCurated] = useState(false);
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
      const secondaryType = typesMap[r.name] ?? undefined; // undefined = not fetched yet
      const habitat = secondaryType !== undefined ? getHabitat(secondaryType, habitatOverrides[r.name]) : null;
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
      if (onlyCurated && !s.note.curated) return false;
      if (habitatFilter !== "all" && s.habitat?.name !== habitatFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        s.name.includes(q) ||
        s.note.binomial.toLowerCase().includes(q) ||
        s.note.plantAnalogue.toLowerCase().includes(q)
      );
    });
  }, [specimens, query, onlyCurated, habitatFilter]);

  return (
    <div className="container" style={{ padding: "40px 24px 80px" }}>
      <section style={{ marginBottom: "36px", maxWidth: "720px" }}>
        <p className="eyebrow">Under Glass &mdash; Grass-Type Order</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Glasshouse</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          Every documented Grass-type specimen, grown under glass and catalogued alongside its
          closest analogue in real plant biology. Entries marked{" "}
          <span className="mono">uncat.</span> are pulled live from the Pokédex but haven't
          received a full field write-up yet.
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
        <label className="mono" style={{ fontSize: "0.78rem", display: "flex", gap: "6px", alignItems: "center" }}>
          <input type="checkbox" checked={onlyCurated} onChange={(e) => setOnlyCurated(e.target.checked)} />
          curated entries only
        </label>
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
        temperature-sensitive processes, and moth- or bat-pollinated blooms, which is exactly why
        desert cacti like Cacnea end up here rather than in an odd spot.
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
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
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
