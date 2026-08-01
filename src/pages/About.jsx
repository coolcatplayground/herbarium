import useDocumentTitle from "../hooks/useDocumentTitle";

export default function About() {
  useDocumentTitle("Field Notes");
  return (
    <div className="container" style={{ padding: "40px 24px 100px", maxWidth: "720px" }}>
      <p className="eyebrow">Curator's Note</p>
      <h2 style={{ fontSize: "var(--step3)" }}>Field Notes</h2>
      <p>
        Folia Codex catalogs every Grass-type Pokémon alongside a real plant-biology or genetics
        concept its design echoes. Roster data, sprites, stats, and evolution chains are pulled
        live from{" "}
        <a href="https://pokeapi.co" target="_blank" rel="noreferrer" style={{ color: "var(--specimen-red)" }}>
          PokéAPI
        </a>
        . The botanical annotations and the Cross-Pollination genetics bench are original writing
        and code, built to connect a plant genetics background to a lifelong Pokédex habit.
      </p>
      <p>
        This is a non-commercial fan project built for a portfolio. Pokémon and all related
        properties are trademarks of Nintendo, Game Freak, and Creatures Inc. No affiliation is
        implied.
      </p>
      <hr className="hairline" style={{ margin: "24px 0" }} />
      <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
        Entries marked <span className="mono">uncat.</span> in the glasshouse grid have live Pokédex
        data but no hand-written field note yet &mdash; contributions welcome via pull request.
      </p>
    </div>
  );
}
