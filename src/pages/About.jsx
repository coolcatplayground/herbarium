import useDocumentTitle from "../hooks/useDocumentTitle";

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER — the curator profile below is a scaffold to be replaced.
// Everything inside CURATOR is plain text and safe to edit by hand: swap the
// portrait for a real image, rewrite the paragraphs, and put a real address in
// `email` (the "address coming soon" marker disappears once you do).
// ─────────────────────────────────────────────────────────────────────────────
const CURATOR = {
  name: "The Curator",
  role: "Curator, CC Herbarium",
  // Set to an image path (e.g. "curator.jpg" in public/) to replace the frame.
  portrait: null,
  // Where to reach the curator. Set `email` to a real address (it is rendered
  // as a mailto: link) — until then the section says so plainly.
  email: null,
  bio: [
    "A placeholder, for now. This is where the person behind the collection introduces themselves — who they are, what they do when they are not writing about plants, and what brought them to a Pokédex and a plant-biology textbook at the same time.",
    "The short version of why this exists: the designs kept echoing real botany, and once that is noticed it is difficult to stop noticing. A Pokémon with a bulb on its back is a storage organ. A tumbleweed that rolls is a plant executing its last instruction. Somebody had to write it all down, and it turned out to be me.",
    "What I bring to it is a plant-genetics background and a long-standing Pokédex habit, which is a narrow enough overlap that the collection had to be built rather than found.",
  ],
};

export default function About() {
  useDocumentTitle("Curator's Note");
  return (
    <div className="container" style={{ padding: "40px 24px 100px", maxWidth: "720px" }}>
      <p className="eyebrow">About This Collection</p>
      <h2 style={{ fontSize: "var(--step3)" }}>Curator&rsquo;s Note</h2>
      <p>
        CC Herbarium catalogs every Grass-type Pokémon alongside a real plant-biology or genetics
        concept its design echoes. Roster data, sprites, stats, and evolution chains come to us
        live from{" "}
        <a href="https://pokeapi.co" target="_blank" rel="noreferrer" style={{ color: "var(--specimen-red)" }}>
          PokéAPI
        </a>
        . The botanical annotations and the Grafting Bench&rsquo;s case files are our own writing and
        research, grown out of a plant genetics background and a lifelong Pokédex habit.
      </p>
      <p>
        This is a non-commercial fan project. Pokémon and all related properties are trademarks of
        Nintendo, Game Freak, and Creatures Inc. No affiliation is implied.
      </p>

      <hr className="hairline" style={{ margin: "32px 0 24px" }} />

      <section>
        <p className="eyebrow" style={{ marginBottom: "14px" }}>The Curator</p>

        <div className="console-split console-split--figure-left" style={{ alignItems: "start" }}>
          {CURATOR.portrait ? (
            <img
              src={`${import.meta.env.BASE_URL}${CURATOR.portrait}`}
              alt={`Portrait of ${CURATOR.name}`}
              style={{
                width: "100%",
                borderRadius: "var(--radius)",
                border: "1px solid var(--paper-shadow)",
                display: "block",
              }}
            />
          ) : (
            /* Same convention as an unillustrated habitat room: an honest empty
               frame rather than a stock silhouette pretending to be someone. */
            <div
              className="mono"
              style={{
                aspectRatio: "4 / 5",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                padding: "12px",
                fontSize: "0.7rem",
                color: "var(--ink-soft)",
                borderRadius: "var(--radius)",
                border: "1px dashed var(--paper-shadow)",
                background: "var(--paper-light)",
              }}
            >
              portrait in preparation
            </div>
          )}

          <div>
            <h3 style={{ margin: "0 0 2px", fontSize: "1.05rem" }}>{CURATOR.name}</h3>
            <p
              className="mono"
              style={{
                margin: "0 0 12px",
                fontSize: "0.72rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--botanical-green-deep)",
              }}
            >
              {CURATOR.role}
            </p>
            {CURATOR.bio.map((para) => (
              <p key={para.slice(0, 32)} style={{ margin: "0 0 10px", fontSize: "0.95rem" }}>
                {para}
              </p>
            ))}
          </div>
        </div>

        <div
          className="plate-frame"
          style={{ padding: "16px 18px", marginTop: "22px", display: "grid", gap: "10px" }}
        >
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Corrections are welcome and so is argument. If a placard has the botany wrong, if a
            citation is attached to the wrong game, or if you know the paper that settles something
            this collection has left open, the curator would rather hear it than not.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <a
              href={CURATOR.email ? `mailto:${CURATOR.email}` : undefined}
              {...(CURATOR.email ? {} : { "aria-disabled": "true" })}
              className="mono"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                borderRadius: "999px",
                border: "1px solid var(--paper-shadow)",
                background: CURATOR.email ? "var(--botanical-green-deep)" : "var(--paper-light)",
                color: CURATOR.email ? "var(--paper-light)" : "var(--ink-soft)",
                cursor: CURATOR.email ? "pointer" : "default",
              }}
            >
              Write to the curator
            </a>
            {!CURATOR.email && (
              <span className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)" }}>
                address coming soon
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
