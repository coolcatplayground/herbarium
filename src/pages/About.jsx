import useDocumentTitle from "../hooks/useDocumentTitle";
import RoomBackdrop from "../components/RoomBackdrop";

// ─────────────────────────────────────────────────────────────────────────────
// Everything inside CURATOR is plain text and safe to rewrite by hand.
// ─────────────────────────────────────────────────────────────────────────────
const CURATOR = {
  name: "The Curator",
  role: "Curator, CC Herbarium",
  // Source art is cc-curator.png in the repo root, encoded to this path by
  // scripts/encode-portrait.ps1. Set to null to go back to the empty frame.
  portrait: "portraits/cc.jpg",
  // Written out rather than assembled from the name, because the name does not
  // describe the picture and a screen reader gets nothing from "portrait of
  // The Curator".
  portraitAlt:
    "The curator: a cat's face sculpted in milk foam, ears and all, sitting on a glass of Thai iced tea.",
  // Where to reach the curator. Rendered as a mailto: link; set it back to null
  // and the section says plainly that there is no address yet.
  email: "coolcatruby128@gmail.com",
  // Each entry is one placard paragraph. `lead` (optional) renders in bold
  // ahead of the text.
  bio: [
    {
      text: "Welcome to the herbarium. I’m the curator, which means I write the labels, dust the glass cases and settle arguments about taxonomy. Please don’t tap on the glass. The Bellsprout startle easily.",
    },
    {
      lead: "On the founding of the collection.",
      text: "The first field expedition was conducted in Pokémon Red, in Japanese, a language the curator could not read at the time. Field methods were therefore primitive. To reach the seventh gym, every statue in the abandoned mansion was investigated by pressing A at it until something clicked. The archive records this as “thorough.”",
    },
    {
      lead: "Specimen No. 001: Oddish.",
      text: "Collected ahead of the fourth gym, where Erica uses Poison Powder with the unshakeable confidence of someone who has never met a Poison type. The specimen, at level 14, could not be poisoned, and Absorbed her entire team. It later matured into a Vileplume of about level 80 and completed the Elite Four on Struggle alone, having run out of PP. It remains the founding specimen of this herbarium and is not available for loan.",
    },
    {
      lead: "Curatorial qualifications.",
      text: "Field assistant on expeditions from coastline to mountain to wetland, mostly after aquatic mosses and carnivorous plants. This was followed by a doctorate in plant genome editing, a discipline in which nothing funny happens because everything follows protocol. A lasting side effect is that the curator now sees plants that look like creatures everywhere. The institution does not consider this a problem.",
    },
    {
      lead: "Construction.",
      text: "The herbarium stood unbuilt for years for lack of carpenters. It was finally raised with the help of Mr. AI Carpenter. The curator supplied the botany, the labels and the stubbornness, and Mr. AI Carpenter did the carpentry.",
    },
    {
      lead: "Staff and facilities.",
      text: "One cat, head of security, usually asleep on duty. Refreshments are Thai tea, as seen in the official portrait. After hours, the curator can be found battling on Showdown or exploring uncharted regions.",
    },
  ],
};

export default function About() {
  useDocumentTitle("Curator's Note");
  return (
    <div className="container" style={{ padding: "40px 24px 100px", maxWidth: "720px" }}>
      <RoomBackdrop image="rooms/curator-room.jpg" />
      {/* This page has no page-intro section, so the header block gets mounted
          directly. Over the curator's room its text was reading against
          shelving. */}
      <div className="placard" style={{ marginBottom: "8px" }}>
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
      </div>

      <hr className="hairline" style={{ margin: "32px 0 24px" }} />

      <section className="placard">
        <p className="eyebrow" style={{ marginBottom: "14px" }}>The Curator</p>

        <div className="console-split console-split--figure-left" style={{ alignItems: "start" }}>
          {CURATOR.portrait ? (
            <img
              src={`${import.meta.env.BASE_URL}${CURATOR.portrait}`}
              alt={CURATOR.portraitAlt}
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
              <p key={para.text.slice(0, 32)} style={{ margin: "0 0 10px", fontSize: "0.95rem" }}>
                {para.lead && <strong>{para.lead} </strong>}
                {para.text}
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
            {/* The link and the address, side by side rather than one or the
                other.

                This used to be a button through to a mail desk — six papers, a
                composer, a sealed preview — which was removed. What that desk
                solved still needs solving, though: a bare mailto: does nothing
                visible for the many visitors whose browser has no mail client
                wired to it, and they are given no clue why. So the address is
                printed as selectable text beside the link. The link is a
                convenience for people it works for, never the only way
                through. */}
            {CURATOR.email ? (
              <>
                <a
                  href={`mailto:${CURATOR.email}`}
                  className="contact-button contact-button--primary"
                >
                  Write to the curator
                </a>
                <span className="mono" style={{ fontSize: "0.8rem", color: "var(--ink)" }}>
                  {CURATOR.email}
                </span>
              </>
            ) : (
              <span
                className="contact-button"
                aria-disabled="true"
                style={{ color: "var(--ink-soft)", cursor: "default" }}
              >
                Write to the curator
              </span>
            )}
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
