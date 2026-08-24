import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  fetchPokemon,
  fetchSpecies,
  fetchEvolutionChain,
  buildLineage,
  annotateLineage,
  getEnglishFlavorText,
  getEnglishGenus,
  getPokedexRecord,
  buildBibliography,
  shortVersion,
  extractSecondaryType,
  spriteUrl,
  onSpriteError,
} from "../api/pokeapi";
import { getSpecimenNote } from "../data/specimenNote";
import { loadFieldNotes } from "../data/fieldNotesLoader";
import { getHabitat, habitatSlug } from "../data/habitatMap";
import { loadHabitatOverrides } from "../data/habitatOverridesLoader";
import TypeBadge from "../components/TypeBadge";
import SpecimenCase from "../components/SpecimenCase";
import GrowthLineage from "../components/GrowthLineage";
import graftingCases from "../data/graftingCases";
import { getSizeGroup, SIZE_FORM_PARENT, HIDDEN_SIZE_FORMS } from "../data/sizeForms";
import { getSeasonGroup, seasonSpriteUrl } from "../data/seasonForms";
import useDocumentTitle from "../hooks/useDocumentTitle";
import RoomBackdrop from "../components/RoomBackdrop";

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
  // Size classes (Pumpkaboo/Gourgeist) live on the canonical specimen's face
  // rather than as their own gallery panels. `sizeVariants` holds each size's
  // own fetched record; `activeSize` picks which one drives the sheet.
  const sizeGroup = getSizeGroup(name);
  const [activeSize, setActiveSize] = useState(name);
  const [sizeVariants, setSizeVariants] = useState({});
  // Seasonal forms (Deerling/Sawsbuck) are appearance-only — see
  // data/seasonForms.js — so unlike size classes they need no second fetch and
  // change nothing on the sheet except the specimen standing in the case.
  const seasonGroup = getSeasonGroup(name);
  const [activeSeason, setActiveSeason] = useState(0);

  useEffect(() => {
    setActiveSize(name);
    setSizeVariants({});
    setActiveSeason(0);
  }, [name]);

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
        // Keyed on the species name, not the roster name — an alternate form
        // like `venusaur-mega` sits under species `venusaur` in the chain.
        const rawLineage = buildLineage(chain, species.name);
        const lineage = await annotateLineage(rawLineage);
        if (cancelled) return;
        setNotesMap(notes);
        setHabitatOverrides(overrides);
        setData({
          pokemon,
          species,
          lineage,
          pokedexRecord: getPokedexRecord(species),
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

  // The other sizes are fetched alongside, not on click, so switching between
  // them is instant. They're small requests and getJSON caches them.
  useEffect(() => {
    if (!sizeGroup) return;
    let cancelled = false;
    Promise.all(
      sizeGroup.variants.map((v) => fetchPokemon(v.name).then((p) => [v.name, p]).catch(() => null))
    ).then((pairs) => {
      if (!cancelled) setSizeVariants(Object.fromEntries(pairs.filter(Boolean)));
    });
    return () => {
      cancelled = true;
    };
  }, [sizeGroup, name]);

  // A non-canonical size has no face of its own any more — send it to the
  // entry that owns the group so there's exactly one page per organism and no
  // stale duplicate at the old URL.
  if (HIDDEN_SIZE_FORMS.has(name)) {
    return <Navigate to={`/specimen/${SIZE_FORM_PARENT[name]}`} replace />;
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <p style={{ color: "var(--specimen-red)" }}>Couldn't locate specimen "{name}" ({error}).</p>
        <Link to="/">&larr; Back to the gallery</Link>
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

  const { flavorText, genus, lineage, pokedexRecord } = data;
  // `canonical` is the specimen this face belongs to; `pokemon` is whichever
  // size class is currently selected. Identity (catalogue number, field note,
  // habitat, typing, evolution) stays with the canonical entry — those are
  // species-level and don't change with fruit size. Only what genuinely
  // differs follows the selection: sprite, measurements and stats.
  const canonical = data.pokemon;
  const pokemon = (sizeGroup && sizeVariants[activeSize]) || canonical;
  const note = getSpecimenNote(canonical.name, canonical.id, notesMap);
  // Some species' *default* form carries a suffix anyway — the collection's
  // Wormadam is `wormadam-plant`, its Shaymin is `shaymin-land` — so the note
  // written for the species is written for this exact specimen, and telling
  // the reader it "wasn't written for this form" is simply untrue. Only a
  // genuine alternate form gets the caveat.
  const isDefaultVariety =
    data.species.varieties?.find((v) => v.is_default)?.pokemon?.name === canonical.name;
  const borrowedFromSpecies = note.inherited && !isDefaultVariety;
  const secondaryType = extractSecondaryType(canonical);
  const habitat = getHabitat(secondaryType, habitatOverrides[canonical.name]);
  // The API response is consulted only for whether a shiny exists; the images
  // themselves are served locally so the site is not hotlinking GitHub raw for
  // every visitor. See scripts/fetch-sprites.mjs.
  const sprite = spriteUrl(pokemon.id);
  const shinySprite = pokemon.sprites.other?.["official-artwork"]?.front_shiny
    ? spriteUrl(pokemon.id, true)
    : null;
  // A seasonal specimen is drawn from the HOME set for every season, spring
  // included, so the four are actually comparable — official artwork exists
  // for the spring form alone. Everything else keeps its painted portrait.
  const seasonSlug = seasonGroup?.variants[activeSeason]?.slug;
  const displaySprite = seasonSlug
    ? seasonSpriteUrl(seasonSlug, showShiny && Boolean(shinySprite))
    : showShiny && shinySprite
      ? shinySprite
      : sprite;

  return (
    <div className="container" style={{ padding: "40px 24px 100px" }}>
      <RoomBackdrop image="rooms/specimen-room.jpg" />
      <Link to="/" className="mono room-tag" style={{ fontSize: "0.8rem", color: "var(--ink-soft)", textDecoration: "none" }}>
        &larr; Back to the gallery
      </Link>

      <div className="specimen-split">
        <div className="plate-frame" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span className="mono" style={{ fontSize: "0.72rem" }}>NO. {String(canonical.id).padStart(4, "0")}</span>
            <span className="mono" style={{ fontSize: "0.72rem", color: "var(--moss)" }}>
              {borrowedFromSpecies ? "base-species note" : note.curated ? "curated" : "uncatalogued"}
            </span>
          </div>
          <div style={{ marginBottom: "14px" }}>
            {/* No catalogue number on the plate — it already sits at the top
                of this card, and prefixing it forced every name onto two
                lines at ~6px, which is below reading size. */}
            <SpecimenCase sprite={displaySprite} name={pokemon.name} onSpriteError={onSpriteError} />
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

          {sizeGroup && (
            <div style={{ marginBottom: "14px" }}>
              <p className="eyebrow" style={{ fontSize: "0.85rem", marginBottom: "6px" }}>
                {sizeGroup.axis}
              </p>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }} role="group" aria-label={sizeGroup.axis}>
                {sizeGroup.variants.map((v) => {
                  const active = v.name === activeSize;
                  const ready = Boolean(sizeVariants[v.name]);
                  return (
                    <button
                      key={v.name}
                      onClick={() => setActiveSize(v.name)}
                      disabled={!ready}
                      aria-pressed={active}
                      className="mono"
                      style={{
                        flex: "1 1 0",
                        padding: "6px 4px",
                        fontSize: "0.66rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: ready ? "pointer" : "wait",
                        opacity: ready || active ? 1 : 0.5,
                        border: "1px solid var(--paper-shadow)",
                        borderRadius: "999px",
                        background: active ? "var(--botanical-green-deep)" : "var(--paper-light)",
                        color: active ? "var(--paper-light)" : "var(--ink-soft)",
                      }}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
              <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)", margin: "8px 0 0" }}>
                {sizeGroup.note}
              </p>
            </div>
          )}

          {seasonGroup && (
            <div style={{ marginBottom: "14px" }}>
              <p className="eyebrow" style={{ fontSize: "0.85rem", marginBottom: "6px" }}>
                {seasonGroup.axis}
              </p>
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }} role="group" aria-label={seasonGroup.axis}>
                {seasonGroup.variants.map((v, i) => {
                  const active = i === activeSeason;
                  return (
                    <button
                      key={v.slug}
                      onClick={() => setActiveSeason(i)}
                      aria-pressed={active}
                      className="mono"
                      style={{
                        flex: "1 1 0",
                        padding: "6px 4px",
                        fontSize: "0.66rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        border: "1px solid var(--paper-shadow)",
                        borderRadius: "999px",
                        background: active ? "var(--botanical-green-deep)" : "var(--paper-light)",
                        color: active ? "var(--paper-light)" : "var(--ink-soft)",
                      }}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
              <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)", margin: "8px 0 0" }}>
                {seasonGroup.note}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
            {canonical.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} size="md" />
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
          <hr className="hairline" style={{ margin: "16px 0" }} />
          <GrowthLineage lineage={lineage} currentSpecies={data.species.name} />
        </div>

        <div>
          {/* The heading block is the one part of this column printed straight
              onto the room — everything below it already sits on a plate frame.
              Over the case room the name, binomial and flavour text were
              reading against display cabinets, so they get a mount of their own. */}
          <div className="placard" style={{ marginBottom: "18px" }}>
            <p className="eyebrow" style={{ marginBottom: "4px" }}>{note.geneticConcept}</p>
            <h2 style={{ fontSize: "var(--step3)", textTransform: "capitalize", marginBottom: "0.15em" }}>
              {pokemon.name}
            </h2>
            <p className="mono" style={{ fontStyle: "italic", color: "var(--botanical-green)", margin: "0 0 10px" }}>
              {note.binomial}
            </p>
            <p style={{ color: "var(--ink-soft)", margin: 0 }}>{flavorText}</p>
          </div>

          <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "18px" }}>
            <p className="eyebrow" style={{ marginBottom: "8px" }}>Field Note &mdash; {note.plantAnalogue}</p>
            <p style={{ margin: 0 }}>{note.note}</p>
            {borrowedFromSpecies && (
              <p className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)", margin: "10px 0 0" }}>
                Written for {note.inheritedFrom} as a species, not for this form specifically &mdash;
                the botany still applies, but anything unique to this form isn&rsquo;t covered yet.
              </p>
            )}
          </div>

          {/* The observation record, kept separate from the field note above:
              one consolidates what has been reported about this species, the
              other is the curator's botanical reading of it — collection data
              and determination, the way a real herbarium sheet separates them.
              The sources are listed from the live data rather than typed by
              hand, so the citation can't drift out of date. */}
          {note.record && (
            <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "16px" }}>
              <p className="eyebrow" style={{ marginBottom: "8px" }}>
                Collected Observations
              </p>
              <p style={{ margin: 0 }}>{note.record}</p>

              {/* Cited the way the Reading Room cites a paper: one line per
                  publication, oldest first. A Pokédex entry is a primary
                  source for this collection, so it gets the same treatment as
                  any other — not a parenthetical afterthought. */}
              {pokedexRecord.length > 0 && (() => {
                const sources = buildBibliography(pokedexRecord);

                // Each citation opens to the passage it's citing. A reference
                // you can't consult isn't much of a reference — and a release
                // can print more than one, since paired versions often differ,
                // so every passage is shown with the versions carrying it
                // rather than one being picked and the other dropped.
                const list = (
                  <ol
                    style={{
                      margin: "8px 0 0",
                      paddingLeft: "1.2em",
                      fontSize: "0.68rem",
                      color: "var(--ink-soft)",
                      lineHeight: 1.7,
                    }}
                  >
                    {sources.map((s) => (
                      <li key={s.title} style={{ marginBottom: "4px" }}>
                        <details>
                          <summary className="mono" style={{ cursor: "pointer" }}>
                            <span style={{ fontStyle: "italic" }}>{s.title}</span>
                            {s.year ? ` (${s.year})` : ""}. Pokédex entry.
                          </summary>
                          {s.passages.map((passage) => (
                            <blockquote
                              key={passage.text}
                              style={{
                                margin: "6px 0 8px",
                                padding: "8px 12px",
                                borderLeft: "2px solid var(--paper-shadow)",
                                background: "var(--paper)",
                                borderRadius: "0 6px 6px 0",
                                color: "var(--ink)",
                                fontSize: "0.82rem",
                                lineHeight: 1.5,
                              }}
                            >
                              {passage.text}
                              {s.passages.length > 1 && (
                                <span
                                  className="mono"
                                  style={{ display: "block", marginTop: "5px", fontSize: "0.62rem", color: "var(--ink-soft)" }}
                                >
                                  &mdash; {passage.versions.map(shortVersion).join(", ")}
                                </span>
                              )}
                            </blockquote>
                          ))}
                        </details>
                      </li>
                    ))}
                  </ol>
                );

                return (
                  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px dashed var(--paper-shadow)" }}>
                    {/* A species catalogued since 1998 can carry eighteen
                        citations, which ran to most of a phone screen before
                        the habitat panel. The full list stays — a reference
                        section that hides its sources isn't one — but long
                        ones fold away behind their own summary. */}
                    {sources.length > 6 ? (
                      <details>
                        <summary
                          className="mono"
                          style={{ fontSize: "0.7rem", color: "var(--botanical-green-deep)", cursor: "pointer" }}
                        >
                          Citations &mdash; {sources[0].title} ({sources[0].year}) through{" "}
                          {sources[sources.length - 1].title} ({sources[sources.length - 1].year})
                        </summary>
                        {list}
                      </details>
                    ) : (
                      <>
                        <p className="eyebrow" style={{ fontSize: "0.85rem", margin: 0 }}>
                          Citations
                        </p>
                        {list}
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "16px" }}>
            <p className="eyebrow" style={{ marginBottom: "8px" }}>
              Likely Habitat &mdash; {habitat.name} {habitat.overridden && <span style={{ color: "var(--specimen-red)" }}>(manual)</span>}
            </p>
            <p style={{ margin: 0 }}>{habitat.description}</p>

            {/* What this particular specimen contributes to the category, as
                opposed to what the category is. Written per form, so a Mega or
                regional variant filed under a different habitat than its base
                species gets its own reading rather than inheriting one. */}
            {note.habitatNote && (
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px dashed var(--paper-shadow)",
                }}
              >
                <p className="eyebrow" style={{ fontSize: "0.88rem", marginBottom: "4px" }}>
                  Why It&rsquo;s Filed Here
                </p>
                <p style={{ margin: 0 }}>{note.habitatNote}</p>
              </div>
            )}

            <Link
              to={`/habitat/${habitatSlug(habitat.name)}`}
              className="mono"
              style={{
                display: "inline-block",
                marginTop: "12px",
                fontSize: "0.72rem",
                color: "var(--botanical-green-deep)",
                textDecoration: "none",
                border: "1px solid var(--botanical-green)",
                borderRadius: "999px",
                padding: "4px 12px",
              }}
            >
              &rarr; See the whole habitat
            </Link>

          </div>

          {graftingCases[canonical.name] && (
            <div className="plate-frame" style={{ padding: "18px 20px", marginTop: "16px", borderStyle: "dashed" }}>
              <p className="eyebrow" style={{ marginBottom: "8px" }}>Case Study</p>
              <p style={{ margin: "0 0 10px" }}>
                This specimen's {graftingCases[canonical.name].label.toLowerCase()} is the subject of
                a full case file on the Grafting Bench &mdash; real research, checked against a
                worked interactive model.
              </p>
              <Link
                to={`/grafting-bench?case=${graftingCases[canonical.name].caseKey}`}
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
                &rarr; Case {graftingCases[canonical.name].caseNumber}: {graftingCases[canonical.name].label}
              </Link>
            </div>
          )}

          {/* Measurements was the one section on this sheet without a frame,
              which predates the room but shows up badly against it — the stat
              labels were the last thing left printed on the wall. Framing it
              fixes that and makes the column consistent: every section here is
              now a mounted card. */}
          <div className="plate-frame" style={{ marginTop: "26px", padding: "18px 20px" }}>
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

        </div>
      </div>
    </div>
  );
}
