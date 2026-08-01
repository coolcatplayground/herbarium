# Folia Codex — A Grass-Type Herbarium

A field-guide-style Pokédex for Grass-type Pokémon, framed as a botanical herbarium catalog.
Each specimen is annotated with a real plant biology or genetics concept its design echoes,
and a genetics simulator ("Cross-Pollination Bench") lets you run Mendelian crosses on
simplified plant traits.

Built as a portfolio piece connecting a plant genetics background to a Pokédex — live data
from [PokéAPI](https://pokeapi.co), original botanical write-ups and design.

## Features

- **The Herbarium** — the full live Grass-type roster from PokéAPI, searchable by name,
  binomial, or plant analogue.
- **Specimen sheets** — per-Pokémon page with stats, live Pokédex flavor text, a hand-written
  botanical field note (curated for ~50 notable species, with a clear fallback label for the
  rest), and a growth-stage timeline built from the real evolution chain.
- **Cross-Pollination Bench** — an interactive Punnett square covering both complete dominance
  and incomplete dominance monohybrid crosses.

## Tech stack

- React 19 + Vite
- React Router (`HashRouter`, so it works on GitHub Pages without a rewrite rule)
- No backend — all Pokémon data is fetched client-side from PokéAPI at runtime
- Plain CSS with a token file (`src/styles/tokens.css`), no framework

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and
deploys automatically on every push to `main`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

No further config is needed — `vite.config.js` uses a relative `base: './'` and the app uses
`HashRouter`, so it works regardless of the repo name or subpath.

### Manual deploy (alternative)

```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

## Extending the botanical notes

Curated annotations live in `src/data/botanicalNotes.js`, keyed by the PokéAPI species name.
Any Grass-type without an entry there automatically falls back to a generated placeholder
(see `src/data/specimenNote.js`) and is marked `uncat.` in the UI — add an entry to promote it
to a full field note.

## Disclaimer

Non-commercial fan project. Pokémon and all related properties are trademarks of Nintendo,
Game Freak, and Creatures Inc. No affiliation is implied.
