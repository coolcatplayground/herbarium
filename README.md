# CC Herbarium — A Grass-Type Herbarium

A field-guide-style Pokédex for Grass-type Pokémon, framed as a botanical herbarium catalog.
Each specimen is annotated with a real plant biology or genetics concept its design echoes, and
a set of "Case Files" hold real, open-access research up against individual specimens to see how
far the science actually reaches.

Built as a portfolio piece connecting a plant genetics background to a Pokédex — live data from
[PokéAPI](https://pokeapi.co), original botanical write-ups and design.

## Features

- **The Glasshouse** — the full live Grass-type roster from PokéAPI, searchable by name and
  filterable by habitat. Habitats are inferred from each specimen's real secondary type (Grass/Water
  reads as wetland flora, Grass/Dark as nocturnal-function flora, and so on), with a manual
  override file for the cases where that heuristic misfires.
- **Specimen sheets** — per-Pokémon page with stats, live Pokédex flavor text, a hand-written
  botanical field note (133 written so far), a growth-stage timeline, and an evolution tree that
  preserves real branching rather than flattening it to a line. Alternate forms (Megas, regional
  variants, size forms) inherit their base species' note and say so, rather than claiming a
  write-up that doesn't exist.
- **The Determination Key** — a stepped identification key in the tradition of a printed botanical
  key: answer one character at a time (habitat affinity, evolutionary stage, generation, form) and
  the field narrows until a specimen is determined. Steps offering more than two branches make it
  polytomous rather than strictly dichotomous, and any earlier answer can be changed without
  starting over.
- **The Grafting Bench** — three Case Files, each pairing a specimen with real open-access research
  and an interactive model:
  - *Roselia's Flower Pigment* — a gene-expression console modelling anthocyanin intensity across
    three pathway stages, plus a clearly-labelled speculative arm theorizing the blue flower.
  - *Cacnea's Water Economy* — a drought simulation. Build a specimen from real morphological types,
    then advance a calendar and watch it shift through CAM, CAM idling, and tissue collapse on its
    own. Two distinct death modes; exactly one build reaches the rains.
  - *Vileplume's Toxic Pollen* — three real, independently-evolved insect strategies for surviving
    a toxic plant, each with its own citation and in-game distribution check.
- **The Reading Room** — 15 verified open-access papers, each cross-linked to the specimens and
  case files it grounds.
- **The Propagation Bench** — speculative Grass-type concepts built from real botany.

## Tech stack

- React 19 + Vite
- React Router (`HashRouter`, so it works on GitHub Pages without a rewrite rule)
- No backend — all Pokémon data is fetched client-side from PokéAPI at runtime
- Plain CSS with a token file (`src/styles/tokens.css`), no framework
- `oxlint` for linting

## Local development

```bash
npm install
```

```bash
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

## Editing the content

The written content lives in plain text files under `public/`, not in code — you can edit any of
them in Notepad or TextEdit without touching a component. Each file documents its own format at
the top.

| File | What it holds |
| --- | --- |
| `public/field-notes.txt` | Per-specimen botanical field notes |
| `public/manuscripts.txt` | Reading Room papers and their connection write-ups |
| `public/habitat-overrides.txt` | Manual habitat corrections where the type heuristic misfires |
| `public/future-species.txt` | Propagation Bench entries |

Any Grass-type without a field note falls back to a generated placeholder (see
`src/data/specimenNote.js`) and is marked `uncat.` in the UI — add a block to `field-notes.txt` to
promote it to a full note.

These files are parsed with their line endings normalized first, so it doesn't matter whether your
editor saves LF or CRLF. That's worth knowing because it wasn't always true: `.` in a JavaScript
regex doesn't match `\r`, so a Notepad-saved (CRLF) file used to parse to *zero* entries, silently.
If you add a parser for a new content file, normalize `\r\n?` → `\n` before matching.

## Project status

Development history and design reasoning are in [DEVLOG.md](DEVLOG.md), including a
"Known open items" section covering what's still outstanding — most field notes are tagged as
drafts pending review, color contrast hasn't been audited, and there are no automated tests.

## Disclaimer

Non-commercial fan project. Pokémon and all related properties are trademarks of Nintendo,
Game Freak, and Creatures Inc. No affiliation is implied.
