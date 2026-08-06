# Folia Codex — Development Log

A running record of what's been built, in order, for anyone (including future you)
picking this project back up later.

## What this is

A field-guide-style web app for Grass-type Pokémon, framed as a botanical
research station — a herbarium of specimens, a bench for genetics
experiments, a reading room of real science, and a nursery for
speculative ideas. The throughline: real plant biology and genetics
checked against Pokémon's world, honestly, including where the parallel
breaks down.

**Stack:** React + Vite, `HashRouter` (works on GitHub Pages with no
server config), plain CSS with a token file, no backend — all Pokémon
data fetched live from [PokéAPI](https://pokeapi.co) client-side.

**Deployment:** GitHub Pages via `.github/workflows/deploy.yml`, auto
building on every push to `main`.

---

## Core architecture decision: plain-text editable content

Four files in `public/` hold all the hand-written content, in a
Notepad-friendly block format (`### id`, `field: value` lines, `### END`).
This was a deliberate choice over hardcoding content in `.js` files — it
means content can be edited and the site redeployed without touching any
code, by anyone, including in a plain text editor.

| File | Purpose | Loader |
|---|---|---|
| `field-notes.txt` | Botanical annotation for each specimen (132 entries, curated as drafts) | `fieldNotesLoader.js` |
| `manuscripts.txt` | Real, verified, open-access-only research papers, cross-linked to specimens (11 entries) | `manuscriptsLoader.js` |
| `habitat-overrides.txt` | Per-specimen overrides to the automatic type-based habitat guess (Cacnea, Cacturne) | `habitatOverridesLoader.js` |
| `future-species.txt` | Speculative, not-yet-real Pokémon concepts, rendered as "?" placeholder cards | `futureSpeciesLoader.js` |

All four loaders fetch and parse their `.txt` file at runtime (not bundled
at build time), so edits only require a `git push`, not a full rebuild
workflow change.

---

## Build order (chronological)

### 1. Foundation
- Scaffolded with Vite + React, `react-router-dom` (`HashRouter`)
- Live Grass-type roster pulled from PokéAPI's `/type/grass` endpoint
- Roster filter refined to include Mega Evolutions and regional variants
  (Alolan/Galarian/Hisuian forms) while excluding cosmetic-only reskins
  (Gigantamax, Totem, costume forms)
- Specimen detail pages: stats, live Pokédex flavor text, evolution chain

### 2. Visual identity (iterated twice)
- V1: Victorian glasshouse/herbarium — kraft paper, iron ink, stencil
  labels (Big Shoulders Display)
- V2 (final): cottagecore greenhouse, per a reference image — warm cream/
  mint/honey palette, rounded shapes, soft shadows, Caveat + Nunito type

### 3. Field notes system
- `botanicalNotes.js` (hardcoded) → replaced with `field-notes.txt`
  (plain-text, user-editable) + `fieldNotesLoader.js`
- Seeded with ~57 hand-written entries, later expanded to 132 (near-full
  roster coverage), all tagged `[DRAFT — please review]`

### 4. Habitat classification
- 18 habitat categories derived from each specimen's real secondary type
  (fetched live, batched with concurrency limiting + localStorage cache
  since it's ~130 extra API calls)
- Explicitly framed as a heuristic, not fact — includes known mismatches
  (Cacnea is Grass/Dark, not Grass/Ground, despite being a desert cactus)
- Full assessment pass corrected several category names after review
  (Ground → soil/rhizosphere framing not just "arid"; Electric → real
  bioelectric signaling, not "no mapping"; Psychic → psychoactive +
  sensory-signaling, not vague "bioactive")
- `habitat-overrides.txt` added so individual specimens can override the
  automatic guess (used for Cacnea/Cacturne's "Nocturnal-Function Flora"
  reframe)

### 5. Type icons
- Original SVG icon set (18 types) — deliberately not scraped/hotlinked
  from ambiguously-licensed fan icon sets found online; simple universal
  symbols at community-standard type colors instead
- Fighting and Fairy icons redrawn after an initial pass felt weak

### 6. Evolution Tree
- `buildEvolutionTree()` preserves real branching structure from PokéAPI
  (previous `flattenEvolutionChain()` collapsed branches into a line) —
  renders actual forks like Gloom → Vileplume/Bellossom
- Classic CSS nested-list org-chart pattern; kept the old linear
  "Growth Record" timeline alongside it rather than replacing it

### 7. Reading Room (`/manuscripts`)
- Real, verified, open-access-only papers, each with a plain-language
  "connection" write-up linking it to a specimen
- Every citation fact-checked via web search before inclusion (title,
  authors, year, journal, DOI, and specifically open-access status)
- `open_access` field + visible badge on every card

### 8. Propagation Bench (`/future-species`)
- Speculative Pokémon concepts, rendered as "?" placeholder cards
- First real entries: a Tatsugiri/Dondozo-style two-species pairing
  (a Camponotus-style Bug/Ghost host + a Grass-type "zombie fungus"
  partner) modeled on real Ophiocordyceps unilateralis biology
- `types` field added so speculative typing choices render as real
  TypeIcon badges

### 9. The Grafting Bench (`/grafting-bench`) — biggest iteration
Originally "Cross-Pollination," went through several rounds of rework:

- **v1:** generic Punnett square with invented placeholder traits
  ("Petal Pigment," "Leaf Cuticle Wax") — flagged as meaningless since it
  didn't connect to anything else in the app
- **v2:** grounded in real specimens (Roselia, Cacnea) and real field
  notes instead
- **v3 — Case Files:** restructured as folder-tab case studies, each with
  a real open-access paper as "Supporting Literature," fetched live from
  `manuscripts.txt` (one source of truth, no duplicated citation text)
- **v4 — Roselia's case rebuilt entirely around a real study:**
  Lu et al. 2021 (*BMC Plant Biology*) is a gene-expression study, not an
  inheritance study — the Punnett square was actively the wrong tool for
  it (can't explain one plant with two different-colored flowers; that
  needs a same-individual, expression-level explanation). Replaced with
  `GeneExpressionConsole.jsx`: three sliders (biosynthesis, stabilization,
  vacuolar transport) driving a live color swatch, using a bottleneck
  model rather than a flat average
- **v5 — Blue-arm theory:** clearly-labeled speculation extending the
  real console — real roses lack the F3'5'H gene needed for blue
  pigment; two more hypothetical sliders (delphinidin pathway, vacuolar
  pH) model what it would take, each grounded in a real citation
  (Lee et al. 2025) even though neither studies Roselia specifically
- **v6 — Third lever (decomposition):** a real, separate mechanism
  (anthocyanin-degrading enzymes, naturally suppressed in roses by
  tannins — Luo et al. 2017) added as what real rose breeding has never
  tried, since breeders want more color, not a degradation pathway
- **v7 — Shiny form (deep purple/black):** purple needed no new theory
  (a real "Black Magic" rose cultivar has ~2x the anthocyanin
  concentration of pink — Cheng et al. 2024); black extended the theory
  one step further (true black pigment doesn't exist in nature — Wolff &
  Pucker 2025 — it's extreme anthocyanin density plus, in some species,
  suppression of a competing flavone pathway)
- **All toggles removed** per feedback — every section (real study, blue
  theory, shiny form) renders permanently, distinguished only by dashed
  borders (grounded vs. speculative), not interaction
- **Narrative rewritten** from conversational ("that's a better model
  than X") to audience-facing structured tags (Abstract/Hypothesis/Result,
  Observation/Purple/Black) — written for readers, not narrating build
  decisions
- **v8 — cleanup:** removed everything except Case Files (the old game-
  mechanics honesty table, IV Breeder, Ditto Problem, and Theorycrafting
  Corner sections) since the case-study format had made them feel out of
  frame. File renamed `CrossPollination.jsx` → `GraftingBench.jsx`, route
  `/cross-pollination` → `/grafting-bench`. Four now-dead files deleted
  (`IVBreeder.jsx`, `TheorycraftingFAQ.jsx`, `gameMechanics.js`,
  `theorycrafting.js`)

**Currently 2 cases:** Roselia (Case 01, gene-expression model) and
Cacnea (Case 02, still Punnett-square based — not yet revisited).

**In progress:** a third case for Vileplume, on pollinator toxin
resistance. Real grounding confirmed so far — Haas et al. 2023
(*Science Advances*, CYP336 detox enzymes in Hymenoptera) and
Petschenka et al. 2013 (*Evolution*, target-site insensitivity in
monarch Na+/K+-ATPase) — aiming for a roster-style interactive comparing
three real resistance strategies (enzymatic detox, target-site
insensitivity, sequestration). Not yet built.

### 10. Cross-linking pass
- Specimen pages now show a "Case Study" callout linking to their
  Grafting Bench case, deep-linking to the right tab via `?case=`
  query param (`graftingCases.js` mapping, `useSearchParams`)
- Manuscripts cross-link to specimens; specimens cross-link to cases;
  future-species entries cross-link to manuscripts — the four content
  systems now reference each other rather than sitting in isolation

### 11. Shiny sprites
- PokéAPI's official-artwork set includes real shiny sprites
  (`front_shiny`) for nearly every specimen — added a Normal/Shiny
  toggle on specimen detail pages, only rendered when shiny art exists

### 12. Housekeeping passes (two rounds)
- Dynamic page titles (`useDocumentTitle` hook), scroll-to-top on route
  change, custom favicon, dead-code removal (`TypeBadge.jsx`)
- Second pass found several *orphaned* files never actually wired into
  the app — `PathwayConsole.jsx` (unused duplicate of the gene-expression
  console), `dittoCandidates.js` (leftover from the removed Ditto Problem
  section), `usePageTitle.js` (duplicate hook), a stray empty directory,
  an unused `assets/` folder, and `future-cultivars.txt` (an earlier,
  differently-shaped draft of `future-species.txt`) — all deleted after
  confirming zero references and identical build output before/after

---

## File structure (current)

```
src/
  pages/        Herbarium, Specimen, GraftingBench, Manuscripts,
                 FutureSpecies, About
  components/    SpecimenCard, TypeIcon, EvolutionTree, PhenologyTimeline,
                 PunnettSquare, GeneExpressionConsole, FutureSpeciesCard,
                 NavHeader, ScrollToTop
  data/          habitatMap.js, graftingCases.js, and loaders for each
                 public/*.txt file
  hooks/         useDocumentTitle.js
  api/           pokeapi.js (all PokéAPI fetching, caching, roster/type
                 helpers)
  styles/        tokens.css (design tokens + global styles)

public/
  field-notes.txt, manuscripts.txt, habitat-overrides.txt,
  future-species.txt   ← all hand-editable, no code changes needed
```

---

## Known open items

- Cacnea's Grafting Bench case still uses the generic Punnett-square
  format — hasn't gotten the same real-study rebuild Roselia's case did
- Vileplume case (pollinator toxin resistance) — research confirmed,
  interactive design agreed (roster of resistance strategies), not yet
  built
- Most field notes are still tagged `[DRAFT — please review]` — ongoing
  review work, not a bug
- Mobile layout and color-contrast haven't been specifically audited
