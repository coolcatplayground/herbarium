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

**Currently 3 cases:** Roselia (Case 01, gene-expression model), Cacnea
(Case 02, water-economy console), and Vileplume (Case 03, resistance-
strategy roster) — see sections 13–15 below.

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

### 13. Vileplume's Case File (`PollinatorResistanceRoster.jsx`)
- Built the third case: not a Punnett square or an expression console,
  but a roster of three real, independently-evolved insect strategies
  for surviving a toxic plant — enzymatic detoxification, target-site
  insensitivity, and sequestration — selectable tabs, each with its own
  small SVG diagram and its own real citation
- Swapped the originally-planned Petschenka et al. 2013 (*Evolution*)
  citation for target-site insensitivity after checking it's actually
  paywalled (24-hour rental wall on the publisher site) — used
  Dobler et al. 2012 (*PNAS*) instead, genuinely open access and arguably
  a better fit (convergent evolution across six insect orders rather
  than one paper on one species)
- Added a sequestration citation not in the original plan
  (Agrawal et al. 2021, *PNAS*, monarch cardenolide sequestration) after
  confirming it's open access and explicit about the real fitness cost
  of sequestering
- **Real-world Pokémon examples added per section, each with a live
  PokéAPI sprite:** Beedrill (detox), Butterfree (insensitivity),
  Venomoth and Dustox (sequestration) — picked for real design/biology
  fit, not bound to the case's own specimen
- **In-game cohabitation, fact-checked against the actual games:**
  checked Pokémon Database's cross-generation encounter tables directly
  rather than assuming — found that Weedle, Caterpie, and Venonat (the
  real pre-evolutions of three of the four example species) all cohabit
  with Oddish on **Kanto Route 24** in the original Red/Blue/Yellow, the
  earliest generation in the series. Each cohabitat panel names the exact
  route and game and shows the sprites side by side. Checked Dustox's
  line too (Wurmple, Hoenn-native) and found no such overlap — the panel
  says so plainly instead of forcing a match
- Iterated the target-site-insensitivity explanation after feedback that
  the first draft was too jargon-heavy — rewrote around the tagline's own
  lock-and-key analogy in plain language instead of leading with
  "amino acid substitutions" and "Na+/K+-ATPase"
- Closing copy reframed twice: first pass was a dry meta-disclaimer
  ("none of these papers studies Vileplume..."); removed entirely as
  redundant with the app's whole premise, and the "From the Field
  Journal" note rewritten in-voice as an open research question instead
  ("nobody's actually run these tests on Vileplume's own pollen...")

### 14. Grafting Bench reframe
- Original intro copy described literal graft mechanics (rootstock,
  scion, fruit) left over from when the page was closer to one Punnett
  square per case — no longer matched what the page actually does across
  three very differently-shaped cases
- Rewritten around graft *compatibility testing* instead of grafting
  mechanics specifically: "take a real study, hold it up against a
  specimen already in the Herbarium, and see how far it actually
  reaches" — keeps the name and the honest-failure framing, drops the
  literal anatomy
- "Case Files" section copy rewritten twice: first pass hardcoded
  "Three open case files" (won't age well as more get added), replaced
  with an unnumbered curator's-invitation voice ("Pull up a stool...")
  that doesn't commit to a count

### 15. Cacnea's Case File rebuilt (`SucculenceConsole.jsx`)
- Replaced the placeholder incomplete-dominance Punnett square (flagged
  as an open item since Case 02 was created) with a real two-mechanism
  model: a "Parenchyma Elasticity" slider (water-storage tissue capacity,
  Fradera-Soler et al. 2022) and a "CAM Stomatal Timing" slider (nocturnal
  vs. diurnal stomata schedule, Tan & Chen 2023) — both citations already
  existed in `manuscripts.txt` from Case 02's creation but the CAM paper
  had never actually been wired into a component until now
- Combined into an illustrative "estimated days between waterings"
  readout with a bottleneck label (storage-limited vs. timing-limited vs.
  balanced) — explicitly flagged as a simplified stand-in, not a real
  physiological formula, same honesty pattern as the gene-expression
  console's bottleneck framing
- **Broadened past Cacnea specifically:** added a "Real-World Analogues"
  section with Cacturne (Cacnea's own evolution) and Maractus (a second,
  unrelated cactus Pokémon) — fact-checked that real succulence has
  evolved convergently in 80+ separate plant families before writing the
  "two unrelated cactus Pokémon converging on the same design isn't a
  coincidence" framing, so the claim underneath it is real
- `PunnettSquare.jsx` deleted as orphaned once Cacnea's case moved off
  it — confirmed zero remaining references first, same pattern as the
  housekeeping passes in section 12
- Manuscript connection text for both citations updated to point at the
  specific slider each one now grounds, since the old text described the
  incomplete-dominance framing that no longer exists

---

## File structure (current)

```
src/
  pages/        Herbarium, Specimen, GraftingBench, Manuscripts,
                 FutureSpecies, About
  components/    SpecimenCard, TypeIcon, EvolutionTree, PhenologyTimeline,
                 GeneExpressionConsole, PollinatorResistanceRoster,
                 SucculenceConsole, FutureSpeciesCard, NavHeader,
                 ScrollToTop
  data/          habitatMap.js, graftingCases.js, and loaders for each
                 public/*.txt file
  hooks/         useDocumentTitle.js
  api/           pokeapi.js (all PokéAPI fetching, caching, sprite URLs,
                 roster/type helpers)
  styles/        tokens.css (design tokens + global styles)

public/
  field-notes.txt, manuscripts.txt, habitat-overrides.txt,
  future-species.txt   ← all hand-editable, no code changes needed
```

---

## Known open items

- Most field notes are still tagged `[DRAFT — please review]` — ongoing
  review work, not a bug
- Mobile layout and color-contrast haven't been specifically audited
