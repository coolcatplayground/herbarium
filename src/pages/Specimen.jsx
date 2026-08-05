import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchPokemon,
  fetchSpecies,
  fetchEvolutionChain,
  flattenEvolutionChain,
  buildEvolutionTree,
  getEnglishFlavorText,
  getEnglishGenus,
  extractSecondaryType,
} from "../api/pokeapi";
import { getSpecimenNote } from "../data/specimenNote";
import { loadFieldNotes } from "../data/fieldNotesLoader";
import { getHabitat } from "../data/habitatMap";
import { loadHabitatOverrides } from "../data/habitatOverridesLoader";
import { TypeIcon } from "../components/TypeIcon";
import PhenologyTimeline from "../components/PhenologyTimeline";
import EvolutionTree from "../components/EvolutionTree";
import graftingCases from "../data/graftingCases";
import useDocumentTitle from "../hooks/useDocumentTitle";

const STAT_LABELS = {
  hp: "Vigor (HP)",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

export default function Specimen() {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const displayName = data?.pokemon?.name || name;
  useDocumentTitle(displayName ? displayName[0].toUpperCase() + displayName.slice(1) : "Specimen");
  const [notesMap, setNotesMap] = useState({});
  const [habitatOverrides, setHabitatOverrides] = useState({});
  const [error, setError] = useState(null);
  const [showShiny, setShowShiny] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    (async () => {
      try {
        const [pokemon, notes, overrides] = await Promise.all([
          fetchPokemon(name),
          loadFieldNotes(),
          loadHabitatOverrides(),
        ]);
        const species = await fetchSpecies(pokemon.species.name);
        const chain = await fetchEvolutionChain(species.evolution_chain.url);
        if (cancelled) return;
        setNotesMap(notes);
        setHabitatOverrides(overrides);
        setData({
          pokemon,
          species,
          stages: flattenEvolutionChain(chain),
          evolutionTree: buildEvolutionTree(chain),
          flavorText: getEnglishFlavorText(species),
          genus: getEnglishGenus(species),
        });
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (error) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <p style={{ color: "var(--specimen-red)" }}>Couldn't locate specimen "{name}" ({error}).</p>
        <Link to="/">&larr; Back to the glasshouse</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <p className="mono" style={{ color: "var(--ink-soft)" }}>Retrieving specimen sheet&hellip;</p>
      </div>
    );
  }

  const { pokemon, flavorText, genus, stages, evolutionTree } = data;
  const note = getSpecimenNote(pokemon.name, pokemon.id, notesMap);
  const secondaryType = extractSecondaryType(pokemon);
  const habitat = getHabitat(secondaryType, habitatOverrides[pokemon.name]);
  const sprite =
    pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default;
  const shinySprite = pokemon.sprites.other?.["official-artwork"]?.front_shiny;
  const displaySprite = showShiny && shinySprite ? shinySprite : sprite;

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <Link to="/" className="mono" style={{ fontSize: "0.8rem", color: "var(--ink-soft)", textDecoration: "none" }}>
        &larr; Back to the glasshouse
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 340px) 1fr",
          gap: "40px",
          marginTop: "24px",
          alignItems: "start",
        }}
      >
        <div className="plate-frame" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span className="mono" style={{ fontSize: "0.72rem" }}>NO. {String(pokemon.id).padStart(4, "0")}</span>
            <span className="mono" style={{ fontSize: "0.72rem", color: "var(--moss)" }}>{note.curated ? "curated" : "uncatalogued"}</span>
          </div>
          <div
            style={{
              background: "var(--paper)",
              border: "1px solid var(--paper-line)",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              padding: "12px",
              marginBottom: "14px",
            }}
          >
            {displaySprite && <img src={displaySprite} alt={pokemon.name} width={200} height={200} />}
          </div>
          {shinySprite && (
            <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
              <button
                onClick={() => setShowShiny(false)}
                className="mono"
                style={{
                  flex: 1,
                  padding: "6px 0",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  border: "1px solid var(--paper-shadow)",
                  borderRadius: "999px",
                  background: !showShiny ? "var(--botanical-green-deep)" : "var(--paper-light)",
                  color: !showShiny ? "var(--paper-light)" : "var(--ink-soft)",
                }}
              >
                Normal
              </button>
              <button
                onClick={() => setShowShiny(true)}
                className="mono"
                style={{
                  flex: 1,
                  padding: "6px 0",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  border: "1px solid var(--paper-shadow)",
                  borderRadius: "999px",
                  background: showShiny ? "var(--specimen-red)" : "var(--paper-light)",
                  color: showShiny ? "var(--paper-light)" : "var(--ink-soft)",
                }}
              >
                Shiny
              </button>
            </div>
          )}
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  border: "1px solid var(--botanical-green)",
                  borderRadius: "999px",
                  color: "var(--botanical-green-deep)",
                  padding: "3px 10px",
                }}
              >
                <TypeIcon type={t.type.name} size={13} />
                {t.type.name}
              </span>
            ))}
          </div>
          <hr className="hairline" style={{ margin: "12px 0" }} />
          <dl className="mono" style={{ fontSize: "0.78rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px" }}>
            <dt style={{ color: "var(--ink-soft)" }}>Height</dt>
            <dd style={{ margin: 0 }}>{(pokemon.height / 10).toFixed(1)} m</dd>
            <dt style={{ color: "var(--ink-soft)" }}>Mass</dt>
            <dd style={{ margin: 0 }}>{(pokemon.weight / 10).toFixed(1)} kg</dd>
            <dt style={{ color: "var(--ink-soft)" }}>Genus</dt>
            <dd style={{ margin: 0 }}>{genus || "&mdash;"}</dd>
          </dl>
        </div>

        <div>
          <p className="eyebrow" style={{ marginBottom: "4px" }}>{note.geneticConcept}</p>
          <h2 style={{ fontSize: "var(--step3)", textTransform: "capitalize" }}>{pokemon.name}</h2>
          <p className="mono" style={{ fontStyle: "italic", color: "var(--botanical-green)", marginTop: "-6px" }}>
            {note.binomial}
          </p>
          <p style={{ color: "var(--ink-soft)" }}>{flavorText}</p>

          <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "18px" }}>
            <p className="eyebrow" style={{ marginBottom: "8px" }}>Field Note &mdash; {note.plantAnalogue}</p>
            <p style={{ margin: 0 }}>{note.note}</p>
          </div>

          <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "16px" }}>
            <p className="eyebrow" style={{ marginBottom: "8px" }}>
              Likely Habitat &mdash; {habitat.name} {habitat.overridden && <span style={{ color: "var(--specimen-red)" }}>(manual)</span>}
            </p>
            <p style={{ margin: 0 }}>{habitat.description}</p>
            {!habitat.overridden && (
              <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)", margin: "8px 0 0" }}>
                Read off the secondary type ({secondaryType || "none"}) as a pattern, not a game fact &mdash; treat it as a starting guess, not a verdict.
              </p>
            )}
          </div>

          {graftingCases[pokemon.name] && (
            <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "16px", borderStyle: "dashed" }}>
              <p className="eyebrow" style={{ marginBottom: "8px" }}>Case Study</p>
              <p style={{ margin: "0 0 10px" }}>
                This specimen's {graftingCases[pokemon.name].label.toLowerCase()} is the subject of
                a full case file on the Grafting Bench &mdash; real research, checked against a
                worked interactive model.
              </p>
              <Link
                to={`/grafting-bench?case=${graftingCases[pokemon.name].caseKey}`}
                className="mono"
                style={{
                  fontSize: "0.72rem",
                  color: "var(--specimen-red)",
                  textDecoration: "none",
                  border: "1px solid var(--specimen-red)",
                  borderRadius: "999px",
                  padding: "4px 12px",
                }}
              >
                &rarr; Case {graftingCases[pokemon.name].caseNumber}: {graftingCases[pokemon.name].label}
              </Link>
            </div>
          )}

          <div style={{ marginTop: "26px" }}>
            <p className="eyebrow" style={{ marginBottom: "10px" }}>Measurements</p>
            <div style={{ display: "grid", gap: "8px" }}>
              {pokemon.stats.map((s) => (
                <div key={s.stat.name} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", alignItems: "center", gap: "10px" }}>
                  <span className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-soft)" }}>
                    {STAT_LABELS[s.stat.name] || s.stat.name}
                  </span>
                  <div style={{ background: "var(--paper)", border: "1px solid var(--paper-line)", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${Math.min(100, (s.base_stat / 180) * 100)}%`,
                        height: "100%",
                        background: "var(--botanical-green)",
                        borderRadius: "999px",
                      }}
                    />
                  </div>
                  <span className="mono" style={{ fontSize: "0.72rem" }}>{s.base_stat}</span>
                </div>
              ))}
            </div>
          </div>

          {stages.length > 1 && (
            <div style={{ marginTop: "30px" }}>
              <PhenologyTimeline stages={stages} currentName={pokemon.name} />
            </div>
          )}
        </div>
      </div>

      {evolutionTree.children.length > 0 && (
        <div className="plate-frame" style={{ padding: "24px", marginTop: "40px" }}>
          <p className="eyebrow" style={{ marginBottom: "4px" }}>Evolution Tree</p>
          <p style={{ color: "var(--ink-soft)", fontSize: "0.85rem", marginTop: 0, marginBottom: "8px" }}>
            The real branching structure, not flattened to a line &mdash; useful for species with
            more than one evolution path.
          </p>
          <EvolutionTree tree={evolutionTree} currentName={pokemon.name} />
        </div>
      )}
    </div>
  );
}
