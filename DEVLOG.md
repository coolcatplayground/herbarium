# CC Herbarium — Development Log

*(Previously "Folia Codex"; renamed in section 31. Earlier entries use the old
name where they quote copy or filenames from the time.)*

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

### 16. Cacnea's Case File rebuilt again — sliders to simulation
- **The problem:** with three cases on the bench, Case 02 read as a
  smaller copy of Case 01. Both were the same interaction grammar — N
  continuous 0–100 sliders → arithmetic → one derived readout — and the
  old file's own header comment said so outright ("the same *real
  mechanism, speculative tuning* shape as Roselia's gene-expression
  console, applied to a different pathway"). Fine as case 2 of 2, the
  thing making the bench repetitive at 3
- **The deeper issue was fit, not variety:** Roselia's sliders map to
  gene expression levels, a genuinely continuous quantity the cited
  paper measured. Cacnea's didn't — the old file admitted "neither
  slider is a literal dial on Cacnea's actual biology." A real cactus
  has no elasticity knob; it has fixed morphology meeting a variable
  environment. And nothing was at stake: both sliders could be maxed, so
  the lesson ("neither mechanism substitutes for the other") had to be
  *asserted* in the field-journal text, which literally instructed the
  reader to "try maxing out one slider while dragging the other to zero"
- **Reframe:** a drought is temporal and adversarial — it happens to you
  over time and it can beat you. Sliders are atemporal and
  consequence-free. So the specimen is now built once from discrete
  morphological types (storage architecture × photosynthetic schedule)
  and then *time* is the only thing the reader advances
- Build config locks while a run is going — a plant doesn't re-sculpt
  itself mid-drought — and unlocks on death or reset
- **CAM idling added as real content the old shape couldn't hold:**
  under severe drought the stomata stop opening at all, day or night,
  and the plant cycles its own respiratory CO2 behind them. Net carbon
  gain zero — not growing, waiting. It's a state a specimen *enters over
  time*, which is precisely why a slider couldn't express it
- **Two distinct death modes**, which is the payoff: a rigid-walled
  build ruptures on day 9 with 13% of its water still in the tank.
  Flawless stomatal timing doesn't save tissue that can't fold as it
  empties — this cashes out the Fradera-Soler elasticity citation as a
  *mechanic* rather than a paragraph
- **Tuning was driven by measurement, not taste:** ran all nine
  build × schedule combinations and found two problems. Every build died
  (the survival state was unreachable at a 60-day horizon), and obligate
  CAM strictly dominated — longest survival *and* highest carbon, so no
  trade-off existed. The second one is biologically correct: in an
  unbroken drought, commitment to CAM genuinely does beat switching. So
  rather than fake a trade-off, the season was set to 45 days, where
  exactly one configuration reaches the rains and the facultative build
  misses by three. The field journal now makes *that* the lesson —
  facultative CAM exists because most real climates aren't unbroken
  droughts
- Prose written before measuring claimed rupture "around day five" and
  that the elastic build survives sixty days. Neither was true. Every
  number in the case text now matches the running simulation

### 17. Accessibility and mobile pass
- First pass at the two items that had been sitting in "known open
  items" since the bench was built
- `SucculenceConsole` semantics: build/schedule selectors grouped with
  `role="group"` + `aria-pressed` (toggle-button group rather than
  `role="radio"`, which would promise arrow-key navigation that isn't
  implemented), reserve bar as a real `progressbar` with `aria-valuetext`,
  field log as `role="log"` so state transitions announce as they happen,
  outcome panel as `role="status"`
- **Two-column console layouts moved out of inline styles** into
  `.console-split--figure-left` / `--figure-right` / `.console-pair` in
  `tokens.css`. An inline `gridTemplateColumns` can't carry a media
  query, which is the actual reason the consoles broke on a phone. Same
  treatment for the specimen sheet (`.specimen-split`). All collapse to
  one column at 760px
- Nav header and Case File tab strip now wrap instead of overflowing
- Verified by measuring `scrollWidth > clientWidth` across all seven
  routes at 375px: previously the nav overflowed every page (447px in a
  375px viewport) and the specimen sheet overflowed to 523px. All seven
  now clean, with desktop grid values confirmed unchanged
- Note: Vileplume's figure column went 200px → 230px, unifying the two
  figure-left consoles on one value

### 18. The content system was silently broken — CRLF vs. `(.*)$`
- **Every plain-text content file was parsing to zero entries.** Not a
  styling bug or an edge case: the core architecture decision of this
  project — hand-editable content in `public/*.txt` — did not work at
  all, and had been failing silently
- Found by accident. Deleting the orphaned `botanicalNotes.js` required
  first proving its 57 notes had really been migrated to
  `field-notes.txt`; that check showed 133 notes in the text file, which
  didn't square with the Glasshouse rendering *every one* of its 151
  specimens as `uncat.`
- **Root cause:** the field regex ends `(.*)$`, and in JavaScript `.`
  does not match `\r` — it counts as a line terminator. All five content
  files have CRLF endings, so `(.*)` stopped short of the `\r` and `$`
  (no `m` flag) couldn't match before it. Every field line of every block
  failed. The parser's forgiving design — "a block only needs a `note` to
  be included, so a half-filled-in block just won't show up rather than
  crashing" — turned a total failure into silence
- Especially worth noting *why* this shipped: the files are meant to be
  edited in Notepad, and Notepad writes CRLF. The intended authoring
  workflow produced exactly the files the parser couldn't read
- Fixed by normalizing `\r\n?` → `\n` at the top of all four parsers
- Measured recovery: field notes 0 → 132, manuscripts 1 → 14,
  propagation entries 0 → 2, habitat overrides 0 → 2. The Reading Room
  had been empty, every Case File citation sat on "Loading citation…"
  forever, and all 133 hand-written field notes were invisible

### 19. Alternate forms now inherit their base species' note
- With the parser fixed, 26 specimens were still `uncat.` — and six
  written notes (`wormadam`, `shaymin`, `pumpkaboo`, `gourgeist`,
  `arceus-grass`, `silvally-grass`) matched no specimen at all. PokéAPI
  lists forms under suffixed names (`pumpkaboo-average`,
  `shaymin-land`), while notes are written once per species
- `getSpecimenNote` now walks a name back one hyphenated segment at a
  time, longest first, and uses the base species' note if one exists
- **Labeled rather than silently inherited**, matching the honesty
  pattern used everywhere else in this project: a third state
  (`inherited`) sits between "curated" and "uncatalogued", showing a
  `base note` chip in the catalog and a line on the specimen sheet
  saying the note was written for the species, not that form, so
  anything form-specific still isn't covered
- Safe for species whose real names contain a hyphen — `wo-chien`,
  `iron-leaves`, `brute-bonnet` only match if a note is actually keyed
  under the shortened name, and none is. Verified `wo-chien` still reads
  `curated`, not inherited
- `uncat.` went 151 → 26 → 0. Glasshouse intro copy rewritten, since it
  explained a label that no longer appears on any card
- `arceus-grass` and `silvally-grass` remain unmatched — those specimens
  aren't in the Grass roster PokéAPI returns, so the notes are written
  ahead of anything to attach them to

### 20. Orphaned files removed
- Cross-Pollination confirmed cut as a feature, so the whole unreachable
  subtree went: `CrossPollination.jsx` (never routed in `App.jsx`),
  plus `PunnettSquare.jsx`, `IVBreeder.jsx`, `TheorycraftingFAQ.jsx`,
  `gameMechanics.js`, `theorycrafting.js`, which nothing else imported
- Independently dead and also removed: `PathwayConsole.jsx`,
  `TypeBadge.jsx`, `dittoCandidates.js`, `usePageTitle.js`, and
  `botanicalNotes.js` — the last only after confirming all 57 of its
  notes exist in `field-notes.txt`
- Bundle stayed at 49 modules before and after, confirming these were
  repo weight rather than shipped code
- Added a `.gitignore` — there wasn't one, so `node_modules/` and
  `dist/` were one `git add .` away from being committed

### 21. Type icons replaced with traced symbol set
- Swapped the hand-drawn glyphs in `TypeIcon.jsx` for a supplied set of 18
  SVGs (`/pkmntype`) traced from a reference sheet of the standard type
  symbols
- Source files are uniform and clean: all `viewBox="0 0 100 100"`, all
  single-path, `M`/`L`/`Z` only (no curves), all white fill with
  `fill-rule="evenodd"` for interior cut-outs
- **Rendering model changed from stroke to fill.** The old glyphs were
  stroke-based (`fill="none" stroke={color} strokeWidth="1.8"`) on a 24x24
  grid; the new ones are filled shapes, so the component now sets
  `fill={color}` and `fillRule="evenodd"`. Verified the fill rule actually
  inherits from `<svg>` down to `<path>` — several symbols (water, ice,
  poison) render as solid blobs without it
- **The viewBox had to be cropped.** Measured the bounding box of all 18
  paths: the artwork occupies only a ~43x41 region of the 100x100 canvas,
  about 18% of it. Left as-is, a 12px badge icon would have drawn the glyph
  at roughly 5px. `VIEW_BOX` is now the union bounding box of all 18 plus
  padding (`26.5 27.5 47 47`), which lands the glyphs at 69–93% of the
  render box
- Cropped to the *union* rather than per-icon on purpose — per-icon
  cropping would have normalized away real differences in how the symbols
  were drawn (electric and water are genuinely narrow, ghost genuinely
  wide) and made a small symbol balloon to match a large one
- Paths are inlined into the component rather than loaded as files: the
  artwork is white, so it has to be recolored per type, which rules out
  `<img>`. Generated from the source SVGs by script rather than
  transcribed, to avoid typos in 18 paths of up to 705 characters
- Colors left untouched — still the community-convention palette
- **Provenance comment corrected.** The old header asserted these were
  "original icon glyphs, not reproductions of any official or third-party
  game asset", which is no longer true of a traced symbol set. It now says
  what they actually are and points at the project's existing
  non-commercial fan-work disclaimer
- Verified all 18 render on the Glasshouse with correct colors, non-empty
  paths, and no console errors, across all three usage sites
  (`SpecimenCard`, `Specimen`, `FutureSpeciesCard`)

### 22. Type badges rebuilt on the standard palette
- Type colors moved from the muted herbarium tones to the standard
  type-badge palette, and the badges themselves went from bare
  icon-plus-label text to filled pills, matching the reference badge sheet
- **`TypeBadge.jsx` reinstated** — the same filename was deleted as an
  orphan in section 20, but the badge markup was duplicated across three
  call sites (`SpecimenCard`, `Specimen`, `FutureSpeciesCard`) with three
  different sets of inline styles, so a shared component was the right
  shape after all. Two named sizes (`sm` for the catalog grid and concept
  cards, `md` for the specimen sheet) rather than loose numbers
- `TypeIcon` gained a `color` override so the glyph can switch to the
  contrasting ink when it sits on a type-colored fill
- **Fills are the authentic palette, unmodified — the lettering adapts
  instead.** First attempt had this backwards: it darkened the *fill* until
  white text passed WCAG AA, which quietly turned Fairy from `#d685ad` into
  `#9a607d` and Fire from `#ee8130` into `#ab5d23`. Those aren't the type
  colors any more, which defeats the entire point of adopting the palette
- The fix was to move the darkening to the ink. The mid-tone fills (fire,
  psychic, water, fairy) sit almost exactly halfway between white and the
  standard `--ink`, scoring ~4.4:1 against *both* — the reference badges
  only get away with white text there because of the heavy dark outline
  around every letter, which turns to mud at the ~10px these render at.
  Taking the dark ink a few shades deeper than `--ink` (`#2e2419`) clears
  AA on all of them with zero change to the fills
- Result: all 18 fills byte-match the palette, all 18 clear AA 4.5:1, worst
  case 4.83:1. Five types carry light lettering (dark, dragon, fighting,
  ghost, poison), thirteen carry dark
- Checked the filled pills don't break the layouts they sit in — they're
  wider than the old bare text — across catalog, specimen and concept cards
  at 375px: no page overflow, no badge clipped by its parent

### 23. Mono-Grass had no habitat — `??` swallowing a meaningful null
- 47 of 151 catalog cards (31%) showed no habitat at all, and the habitat
  filter never offered the `none` category. Every one of them was a
  pure-Grass specimen
- **The `none` habitat existed and was unreachable.** `getHabitat` already
  falls back to it correctly, and the specimen sheet was rendering it fine
  the whole time — the bug was confined to the catalog
- Root cause on `Herbarium.jsx`: `typesMap[r.name] ?? undefined`, commented
  "undefined = not fetched yet". But `fetchRosterTypes` returns `null` for a
  pure-Grass specimen, which is a *real answer*, and `??` treats null as
  nullish — so every resolved mono-Grass collapsed into the "still loading"
  sentinel and got `habitat: null` permanently. Now keyed on `r.name in
  typesMap`, so presence distinguishes resolved from loading and the value
  is free to be null
- **Renamed the category rather than just unhiding it.** It was "Temperate
  Woodland", which is a biome claim a pure-Grass typing doesn't support:
  Maractus is a mono-Grass *desert cactus*, Sceptile reads tropical. With
  the bug fixed it would have mislabelled 46 specimens at once. Now
  "Mesophytic & Unspecialized Flora", describing the plant strategy — real
  mesophytes, the broad middle adapted to no extreme — and saying outright
  that this category is a statement about missing information rather than a
  habitat claim, with the field note as the place that gets settled
- It is now the largest group in the catalog at 46 specimens (Cacnea is the
  47th mono-Grass but carries a manual override to Nocturnal-Function)
- All 151 cards now show a habitat; filter verified at 46/151

### 24. Removed the dead "curated entries only" filter
- Once the CRLF fix (section 18) and base-species inheritance (section 19)
  landed, every specimen resolved to `curated: true` — so the checkbox
  filtered nothing and always returned all 151
- Removed the control, its `onlyCurated` state, and the filter branch

### 25. Specimen sprites moved into a glass display case
- `SpecimenCase.jsx`: the supplied `glass-panel.png` vitrine with the sprite
  composited into the cavity and the specimen name engraved on the blank
  plate, replacing the plain padded sprite box on the specimen sheet
- **Geometry measured off the image, not eyeballed.** Loaded the PNG into a
  canvas and profiled it: row-darkness profiling found the black base band
  (rows 852–1007), a luminance scan inside that band isolated the nameplate
  (x 488–961, y 877–973), and column profiling found the glass walls
  (x 173–1277). All stored as percentages so the case scales freely. The
  plate turns out to be centred at 50.03% of image width — dead centre — so
  the label is simply centred rather than nudged
- Worth recording how many passes that took: naive bounding-box detection
  kept merging the dark glass edges with the base, and taking the first and
  last matching row without requiring contiguity spanned nearly the whole
  image. Finding the *longest contiguous run* of dark rows was what
  actually worked
- **No alpha channel** (color type 2, truecolor RGB), so the sprite can't
  simply sit behind the glass, and the opaque near-white (#f0eeee) surround
  would read as a pale grey box pasted on the warm paper. Composited with
  `mix-blend-mode: multiply`, which lets the surround fall away into
  whatever it sits on while the black base, glass edges and shadow survive
- Sprite is bottom-aligned in the cavity with a drop-shadow so it stands on
  the floor rather than floating against the back panel
- **Plate lettering is length-scaled**, and past ~17 characters wraps to two
  lines instead of shrinking below reading size. First attempt computed the
  scale from the bare name while rendering name *plus* catalogue number,
  which overflowed the plate — `ogerpon-wellspring-mask` spilled to three
  lines and out of the plate entirely
- Dropped the catalogue number from the plate for the same reason: it forced
  every name onto two lines at ~6.4px, and it already appears at the top of
  the card. Names alone land at 8–14px, worst case 6.4px for the
  23-character Ogerpon form
- Verified the shiny toggle still drives the case (`/1.png` →
  `/shiny/1.png` → back), and that the plate fits at 375px on both the
  shortest and longest names

### 26. Cases in the catalog too — the hall-of-vitrines reading
- `SpecimenCard` now renders its sprite in the same case, so the Glasshouse
  grid reads as a row of display cabinets rather than a set of flat tiles
- **Plate left blank on cards** (`engrave={false}`). At card size the plate
  is under 65px wide, so a name would engrave around 5px — and the card
  already prints it, larger, immediately below. A blank brushed plate still
  reads as part of the object
- **The case costs grid density, and there's no way around it.** The case is
  4:3 and its cavity only 61% of that height, so the chrome eats vertical
  room: at the old 190px track a specimen rendered 69px against the 90px it
  had in the flat box, a 23% linear loss. Restoring 90px needs a ~238px card
- Grid widened 190px → 220px. Measured against the 1180px container that
  gives four cases per row at 271px each and a 104px specimen — larger than
  the flat layout managed. The catalog was six across before, so this is a
  real density trade; five would need tracks under ~214px, dropping the
  specimen to ~79px and cramping the vitrines. Bigger-and-fewer won
- Bug found while wiring it up: dropping the sprite's explicit `width`/
  `height` in favour of `max-width`/`max-height` left unloaded images
  measuring 0x0 — and a 0x0 `loading="lazy"` image never intersects the
  viewport, so it never loads *at all*. Sized from the cavity with
  `object-fit: contain` and `object-position: center bottom` instead, which
  keeps layout stable before load and keeps the specimen standing on the
  cavity floor
- Note for future debugging: sprites don't lazy-load in a hidden browser
  pane, because nothing composites and so nothing ever intersects the
  viewport. Forcing `loading="eager"` on one element confirmed the images
  and URLs are fine. Not a defect — an artifact of headless checking

### 27. Plate carries the name; card drops the common name
- The plate is engraved on catalog cards too, and the duplicated common name
  below it is gone — the binomial is now the card's heading, which is how a
  real herbarium sheet is actually identified. Kept as an `h3` so the catalog
  still has one heading per specimen for screen readers
- **The engraving is now solved from the plate's geometry rather than stepped
  through arbitrary scale factors.** Measured the plate at 78x16 CSS px on a
  card; that 16px height is the hard ceiling. Sizing is computed in `cqw`
  from three constants — plate content width, plate height, and a measured
  ~0.64em-per-character for the mono face — so it holds at any case size
- Result across all 151 specimens: 6.6–14.6px, nothing overflowing. The old
  step table left real headroom (short names sized to 8.5px when the plate
  had room for 14.6) while pushing 20 names under 7px, with the worst at
  5.6px
- Also found the plate's `padding: 0 3%` was resolving against the *case*
  width, not the plate's own — eating 14px of a 78px plate. Cut to 2%
- **Two-line estimates have to respect word boundaries.** Sizing a wrapped
  label as n/2 characters per line is wrong whenever the words divide
  unevenly: "ogerpon hearthflame mask" splits at best into "ogerpon" /
  "hearthflame mask", 16 characters on the longer line rather than 12. Sized
  for 12 it took a third line and overflowed the plate. `longestLineOfTwo`
  now finds the most even split available and sizes for that line
- Mobile is comfortable — single column at 375px puts the plate at 9.4–18.1px

### 28. Size classes folded onto the specimen face
- Terminology settled here: the **gallery** is the all-panels page, a
  **specimen face** is one species' own page. Used consistently from now on
- Pumpkaboo and Gourgeist each occupied four gallery panels for what is one
  organism at four sizes (10027–10032). Those six are gone from the gallery;
  the canonical entries (0710, 0711) keep their panels and carry a size
  selector on their specimen face
- `src/data/sizeForms.js` is the single source of truth — the gallery filter,
  the redirect map and the selector all derive from it, so adding another
  size group needs one edit
- Every size is fetched alongside the canonical record rather than on click,
  so switching is instant and `getJSON` caches it
- **Identity stays canonical; only what genuinely differs follows the
  selection.** Catalogue number, field note, habitat, typing and evolution
  are species-level and don't change with fruit size — sprite, height, mass
  and stats do. Verified across the range: Small 0.3 m / 3.5 kg / HP 44 /
  Speed 56 through Super 0.8 m / 15 kg / HP 59 / Speed 41, with NO. 0710
  holding steady. Vigour rising and speed falling with the gourd is exactly
  what the group note claims, so the copy is checkable against the sheet
- The six old URLs redirect to their canonical face rather than serving a
  duplicate page — `/specimen/pumpkaboo-super` lands on `pumpkaboo-average`
- Gallery is now 145 panels, down from 151

### 29. Cacnea and Cacturne merged into Nocturnal-Function Flora
- Both carried a bespoke `Nocturnal-Function Flora (Desert Cactus)` habitat,
  which read as a separate category in the filter for two specimens. Both now
  use the standard name and group with the other seven nocturnal-function
  specimens; the habitat filter is back to 19 options from 20
- Their specimen-specific descriptions are kept — the override system exists
  precisely so a specimen can sit in a shared category while explaining its
  own case, and both still show the `(manual)` marker
- **Fixed a factual error found while editing:** the file, `habitatMap.js`
  and the gallery intro all described Cacnea as Grass/Dark. It isn't —
  Cacnea is pure Grass; Cacturne is the Grass/Dark one. Checked against
  PokéAPI before rewriting. That error also explains why Cacnea needed a
  manual override at all: with no secondary type it would otherwise fall to
  Mesophytic & Unspecialized, which is the section-23 category
- Note to self on verification: this change didn't appear in the browser
  across two reloads because the page kept running a stale module graph.
  Importing the module directly proved the code was correct (roster already
  145) while the DOM still showed 151. A cache-busted URL was what actually
  forced it. Check the module, not just the render

### 30. Merged the Determination Key and voice pass from the parallel branch
- A separate working copy had a Determination Key page and a copy-voice pass
  that hadn't reached this branch. Merged both across rather than taking the
  branch wholesale — it forked before the glass cases, type badges, size forms
  and CRLF fix, so a straight copy would have reverted all of that
- Method: diffed both trees ignoring line endings, then classified every
  differing file as *theirs to take* or *mine to keep*. Of 28 differing files
  only four carried anything to merge; the rest were this branch's own work
- **`DeterminationKey.jsx` + `fetchKeyData`** brought over intact. Keys on
  four classification characters (habitat affinity, evolutionary stage,
  generation, form), narrowing a live pool one step at a time, with
  localStorage caching for the roster-wide fetch
- Two fixes were needed to make it agree with this branch:
  - It computed habitats **without** overrides, so Cacnea keyed out as
    Mesophytic while the gallery and its own specimen face both file it under
    nocturnal-function. Now loads `loadHabitatOverrides` the same way they do
  - `pool.length <= 1` was treated as "determined", then rendered
    `finalPool[0].name` — an **empty** pool took the whole page down with a
    blank screen. Split into a distinct `none` state with a real message.
    Reachable only from a stale or hand-set answer rather than normal use, but
    it's a white-screen crash either way
- **Voice pass adopted, including its standing rule:** copy reads as the
  curator talking to a visitor, not as a build log. Their `About.jsx` came
  across wholesale — it also fixed a stale "Cross-Pollination genetics bench"
  reference this branch was still carrying after that page was cut in section
  20. Audited this branch's own newer copy against the same rule and found one
  leak ("the nocturnal half of *this console*"), now rephrased
- Adapted rather than copied where this branch had moved on: their About
  paragraph on `uncat.` predates base-species inheritance, so it now explains
  the `base note` label too
- From `manuscripts.txt`: a sharper botanical term (*hydrenchyma*, the
  dedicated water-storage tissue, rather than the generic *parenchyma*) and a
  new citation, Fradera-Soler et al. 2022 on succulent-syndrome convergence.
  That one matters — it sources the "80-plus plant families" claim the Cacnea
  case file had been making unattributed. Wired the attribution into the
  console text so the claim carries its source on screen
- Not taken: their README (this branch's is already rewritten and theirs still
  advertises the removed Cross-Pollination bench), and their sections 19–20
  CSS glass case — a spotlight/sheen/brass-placard treatment superseded by the
  photographic case in sections 25–27

### 31. Masthead and section nav
- The old bar was a "Glasshouse No. II" badge, a 1.4rem wordmark, and six
  underlined links in identical uppercase mono separated only by whitespace.
  Two separate problems: the items had no visual edges, and the section names
  — Reading Room, Grafting Bench, Propagation Bench, Field Notes — are
  evocative but tell a first-time visitor nothing about what's behind them
- Badge dropped; wordmark now **CC Herbarium** at `--step2` (the existing type
  scale) rather than a fixed size, so it reads larger than before on a wide
  screen but shrinks on a phone where the pills already take three rows
- Links became outlined pills with a filled active state — the same
  active-pill language the type badges and case-file tabs already use, rather
  than a new pattern
- **Buttons alone would only have fixed half of it**, so each pill also carries
  a glyph (stacked panels, a branching fork for the key, a graft union, an open
  book, a seedling, a page and pencil) and a plain-language `title` hint. The
  thematic names stay; the wayfinding stops depending on already knowing them
- Fixed a wayfinding gap while in there: a specimen face didn't match any nav
  route, so nothing lit up once you clicked into a specimen. `/specimen/*` now
  keeps the Specimens pill active
- Measured: one row at 1180px, wordmark and nav split rows around 1009px,
  three rows of two at 375px, 38px tap targets throughout, no overflow at any
  width. Header is static so its 199px on a phone scrolls away
- **Renamed the site everywhere, not just the masthead** — the footer, the
  document-title hook, the About copy, and `index.html`'s title and meta
  description all still said Folia Codex, which would have left the tab title
  disagreeing with the header. The meta description was also still advertising
  the "Mendelian cross-pollination simulator" removed back in section 20

### 32. Growth Record and Evolution Tree merged into one vertical lineage
- The left column of the specimen face ended at Genus while the right ran on
  for three more sections, leaving an obvious hole. Measuring what could fill
  it turned up something better: **the page was showing the evolution chain
  twice** — a flattened "Growth Record" and a branch-preserving "Evolution
  Tree", same data, two sections
- **And the flattened one was wrong on branching families.** Leafeon's Growth
  Record read *Eevee | Germination | Vaporeon | Vegetative growth | Jolteon |
  Flowering/maturity | Flareon…* — presenting parallel branches as a sequence
  of growth stages, and handing the same stage label to three siblings because
  the labels assumed a line. The page was showing the broken version *above*
  the correct one
- Replaced both with `GrowthLineage`: one vertical component in the left
  column, carrying the botanical stage labels from the timeline and the real
  descent from the tree
- **Shows the specimen's own line, not the whole family.** `buildLineage`
  walks root → specimen → end of the specimen's own branch. Branches not taken
  are *named* rather than drawn ("also diverges to Bellossom"), so the
  information survives without the width. Leafeon goes from eight
  Eeveelutions side by side, needing ~480px, to Eevee → Leafeon in a 340px
  column with the other seven listed as links
- Vertical isn't just what fits — a line of descent reads top-to-bottom the way
  a taxonomic hierarchy is printed, and nothing squeezes as a chain gets longer
- Stage labels are now positional rather than index-clamped, so a mid-chain
  specimen like Ivysaur correctly reads "Vegetative growth" instead of
  inheriting whatever the index happened to land on
- **Fixed a silent pre-existing bug:** both old components highlighted the
  current node by roster name, so an alternate form never matched — chain
  nodes are keyed by *species*, and `venusaur-mega` is species `venusaur`.
  Every Mega and regional variant had been rendering with nothing highlighted.
  Now keyed on `species.name`, verified on Venusaur-Mega
- Result: two sections removed from the right column, the left column filled
  with existing content and no new writing, and the columns land at 815px and
  845px — near-balanced where there had been a hole
- Housekeeping in consequence: `PhenologyTimeline.jsx`, `EvolutionTree.jsx`,
  `flattenEvolutionChain`, `buildEvolutionTree` and the 73-line `.evo-tree`
  CSS block all became orphaned and were removed. CSS bundle dropped from
  4.45kB to 3.47kB

### 33. Lineage: collection-aware, clickable, and form-inclusive
- **Non-Grass relatives dropped from the line.** Leafeon's siblings were seven
  Eeveelutions this herbarium doesn't hold — offering links to specimens that
  aren't in the collection. `annotateLineage` now filters siblings against the
  live roster, so Leafeon shows none while Vileplume still names Bellossom,
  which genuinely is a specimen here
- A non-roster *ancestor* is treated differently from a non-roster sibling:
  Eevee stays in Leafeon's line because it's real ancestry, but renders dimmed,
  unlinked, and labelled "Not held here — not a Grass-type". Removing it
  outright would have left Leafeon with no line at all
- **Sprites are links again**, the way the old evolution tree behaved — sprite
  and name are one target per node. Verified by clicking Bulbasaur's sprite
  from Venusaur's sheet and landing on Bulbasaur
- **Megas and regional forms now appear across their whole line.** These hang
  off the *species* (`varieties`), not the evolution chain, so they had never
  surfaced in a lineage anywhere. Venusaur-Mega now shows on Bulbasaur,
  Ivysaur and Venusaur; Exeggutor-Alola on Exeggcute and Exeggutor. Filtered
  against the roster, so forms already excluded there (Gigantamax) stay out
- Form ids come off the variety's own URL rather than the species id —
  venusaur-mega is 10033, and using the species id would have drawn the wrong
  sprite on every form chip
- Nice fallout on the Hisuian lines: Voltorb-Hisui's chain is Voltorb →
  Electrode, neither of which is Grass, so both render as dimmed references
  while their Hisuian forms surface as the linked chips — the collection's
  actual specimens are the ones you can click
- Verified across linear, branching, non-Grass-ancestor, Mega, and regional
  cases; no overflow at 375px and form chips stay inside the column

### 33a. Fix: "not a Grass-type" on specimens that plainly are
- The collection check compared a chain node's **species** name against the
  roster, but the roster holds **variety** names. They usually match — and
  don't, for exactly the species whose default variety carries a suffix:
  Pumpkaboo is held as `pumpkaboo-average`, Gourgeist as `gourgeist-average`,
  Wormadam as `wormadam-plant`, Shaymin as `shaymin-land`. All four were
  labelled "Not held here — not a Grass-type" while sitting in the collection
- A species is now resolved through its varieties: prefer the default, else
  whichever variety the collection actually holds. That also gave the Hisuian
  lines a better reading — Voltorb's line resolves to `voltorb-hisui` and is
  labelled and linked as such, rather than pointing at a Voltorb not kept here
- Siblings had the identical blind spot (also species names) and go through
  the same resolution now
- Node labels became variety names, so the "current specimen" highlight had to
  move to comparing `speciesName` — otherwise a page whose species is
  `pumpkaboo` would never match a node labelled `pumpkaboo-average`
- **Swept all 145 specimens** rather than spot-checking: exactly two species
  now resolve as not held, `burmy` (Bug) and `eevee` (Normal), one lineage
  each. Both correct. Highlighting re-verified on the cases where label and
  species differ

### 34. Habitat descriptions, two levels — starting with Ancient & Long-Lived
- New approach to habitats: write the **category** description from the actual
  roster filed under it, then give each **specimen** its own line on what it
  contributes. The categories had been written as glosses on a type pairing
  before anyone knew who'd end up in them
- First pass: Ancient & Long-Lived Flora, whose seven are the whole Applin line
  plus Sceptile-Mega and Exeggutor-Alola. Five apples and a palm makes this
  category specifically about *woody* longevity, and about the orchard trick of
  outliving the tree — a grafted cultivar is one genetic individual kept going
  on fresh rootstock for centuries. The old one-liner ("slow-growing, long-lived
  species in the mold of old-growth trees") could have been written without
  looking at a single specimen
- Each specimen now says something different and true: Applin is the sexual
  route and why it's unreliable (apple seedlings don't come true to type),
  Appletun is the heirloom clone, Hydrapple is grafting made visible,
  Sceptile-Mega supplies lignin as the structural precondition, and
  Exeggutor-Alola gets old by a route none of the others use — palms are
  monocots with no secondary growth, so a palm trunk is not wood at all
- **`habitat_note` added to `field-notes.txt`**, alongside `note`. Kept in the
  same editable file rather than a new one, since it's per-specimen prose
- **Deliberately never inherited.** A field note is about the species and
  passes down to its forms; a habitat note is about the habitat, and forms
  routinely sit in a different one — Sceptile is mono-Grass and mesophytic
  while Sceptile-Mega is Grass/Dragon and files here. Inheriting would have
  described the wrong habitat. Verified: both Mega forms carry their own
  habitat note while their base species, in other habitats, carry none
- Consequences handled: a block may now exist carrying only a `habitat_note`,
  so the loader accepts `note` **or** `habitat_note`, and the base-species
  lookup requires an actual field note — otherwise a form's habitat-only block
  would have been inherited as an empty write-up marked curated
- Remaining 15 habitats still have their original descriptions

### 34a2. Curator pass back over Ancient & Long-Lived
Re-read the first room as a specialist would. Three of the corrections are
factual rather than stylistic — the writing was wrong, not merely plain.

- **Dropped an unverifiable claim.** The description had named apple varieties
  "kept alive since Roman orchards". That's orchard tradition, not record:
  'Api' and 'Decio' carry those stories without genetic confirmation. The
  documented paper trail runs a few centuries — 'Ribston Pippin' 1707, 'Cox's
  Orange Pippin' 1825 — and Appletun's placard now says exactly that, with the
  Roman lineage named as tradition rather than fact
- **A clone is not frozen.** The placard claimed a centuries-old cultivar is
  "the same organism", full stop. Clonal lineages drift: buds accumulate
  somatic mutations, a branch that fruits differently gets propagated as a new
  variety, and much of the modern apple aisle is sports of sports. Omitting
  that made the story tidier and less true
- **Wrong mechanism credited.** Dipplin's placard said wax holds an apple firm
  for months. It doesn't — wax restores gloss and slows shrivel after washing
  strips the natural bloom. What carries a crop autumn to spring is
  controlled-atmosphere storage: oxygen down to a couple of percent, near
  freezing, throttling respiration and ethylene. Corrected, and it's a better
  fact anyway
- **Named the effect.** Flapple described distance-dependent seedling survival
  without calling it the Janzen–Connell effect. Named now, which also makes it
  checkable
- **Filled the room's biggest gap.** The category's whole thesis is that a
  lineage outlives its individuals, and it never mentioned that plants do this
  without us. Added Pando — one male aspen, forty-plus hectares of trunks from
  a single root system, thousands of years old, no individual trunk old — and
  a bristlecone at 4,800-plus years for the individual route, which is the
  number a visitor in an "Ancient" room actually wants
- Exeggutor-Alola gained the consequence of having no secondary growth: a palm
  commits to its full trunk girth at ground level *before* it climbs, because
  it can never widen later

### 34b. Bioelectric-Signaling Flora (habitat 2 of 18)
- Three specimens: Voltorb-Hisui, Electrode-Hisui and Rotom-Mow. The smallest
  room, and the one whose exhibits sit least comfortably in their own category
  — two wooden spheres and a possessed lawnmower
- The category text leads on the real science, which is genuinely strong here:
  a Venus flytrap firing an action potential and holding a *count* between two
  trigger-hair touches; wound signalling travelling through Arabidopsis at
  roughly a millimetre a second, priming leaves the caterpillar hasn't reached;
  flowers carrying a weak negative charge that a positively-charged bumblebee
  can read to tell an emptied flower from a fresh one. The framing is that this
  is the register where a plant answers in seconds rather than days
- It also says outright that this is the wing held together by the biology on
  the walls more than the specimens under glass. That's true, and pretending
  otherwise would be the kind of thing this project doesn't do
- Placards, each carrying something the other two can't:
  - **Voltorb-Hisui** — the closest the room gets to real plant
    electrophysiology: charge held in plant tissue, an Apricorn-grown sphere
    whose electrical state is the message
  - **Electrode-Hisui** — corrects the room's likeliest misreading. When a real
    seed pod goes off it is *mechanical*, not electrical: elastic tension stored
    in a drying pod wall. Fast plant movement and plant electrical signalling
    are two separate tricks, and this specimen is where they sit side by side
    without being the same one
  - **Rotom-Mow** — the edge of the category, kept on display rather than
    quietly excluded. Its Grass half is lawn care, an association with plants
    rather than a property of one. Every heuristic has a point where it stops
    describing anything real, and it's easier to read habitat as a starting
    guess with the exception standing in the room

### 34c. Cliffside & Mineral-Poor Soil (habitat 3 of 18)
- Three specimens: Lileep, Cradily and Ogerpon-Cornerstone-Mask. Two of the
  three are crinoids, which turns out to be the key to the whole room
- The category runs on a two-way exchange rather than a "grows on cliffs"
  gloss. Bare rock gives anchorage and nothing else, so the flora solves two
  separate problems — how to hold on, and how to eat. Lithophytes live off
  rain, dust and their own litter; pioneer lichens and mosses attack the stone
  itself with organic acids while roots wedge fissures wider, so **on bare rock
  life doesn't find soil, it manufactures it**. Where soil exists but is poor,
  serpentine flora tolerates nickel and chromium that kills its neighbours, and
  Proteaceae on the most phosphorus-starved soils on Earth grow cluster roots
  that flood the ground with acids to prise the last phosphorus off mineral
  grains
- And the traffic runs both ways, which is the fact that made this room work:
  much of the world's limestone is made of crushed crinoid ossicles — the sea
  lilies two of these specimens are modelled on. The rock a plant is dissolving
  for minerals is frequently the compacted bodies of whatever lived there first
- Placards split three ways:
  - **Lileep** — not merely found in stone but a *constituent* of it. Crinoid
    skeletons break into disc-shaped ossicles that accumulate into whole
    limestone formations; the exhibit and the cliff it was cut from are the
    same material
  - **Cradily** — anchorage as a problem distinct from nutrition, and prior to
    it. A crinoid's holdfast takes nothing from the rock it clamps to, exactly
    as a lithophyte's roots grip stone rather than mine it
  - **Ogerpon-Cornerstone-Mask** — the only one alive on the rock rather than
    preserved in it, which puts it in the pioneer's role: the founding organism
    that makes the ground others will use
- Needed its own block, like Sceptile-Mega before it: base Ogerpon sits in
  Mesophytic, so the note can't be inherited. Verified base Ogerpon shows no
  habitat note at all

### 34d. Cold-Adapted & Alpine Flora (habitat 4 of 18)
- Three specimens, all one conifer line — Snover, Abomasnow, Abomasnow-Mega —
  which makes this the *treeline* room specifically rather than a general
  "cold places" gloss
- The category text leads on the two things most often got backwards here:
  - **Cold isn't the killer, ice inside the cell is.** A cold-acclimated
    conifer doesn't avoid freezing, it controls where freezing happens —
    letting ice form deliberately between cells, where the growing crystals
    draw water out of the living cells. The cell survives winter by drying out
    rather than bursting
  - **Snow is insulation, not assault.** Ground under a metre of snowpack sits
    near freezing while the air above plunges far lower, and a cold winter
    *without* snow does more damage than a colder one with it
  - And what actually stops a forest is subtler than either: treelines
    worldwide sit at roughly the same growing-season soil temperature, near
    6–7°C. Trees are turned back not by winter minima but by summers too brief
    to build wood
- Placards split by scale, since all three are the same organism:
  - **Snover** — small enough to be *buried*, which here is the advantage.
    Staying short means wintering in the warm sheltered layer while taller
    neighbours take the full cold
  - **Abomasnow** — the specimen standing at the boundary, and krummholz as
    what that limit looks like from the inside: the last trees give up height
    entirely, stripped into low contorted mats by wind-driven ice
  - **Abomasnow-Mega** — the only one that doesn't just endure the weather but
    makes it, which is less fanciful than it sounds. Vegetation genuinely
    modifies its own microclimate, and at the limits of growth that inverts
    competition: neighbouring plants help each other more than they compete,
    and an isolated tree fails where a huddled group survives. A conifer
    summoning its own blizzard is the exaggerated form of a real bargain

### 34a. Dropped the per-specimen habitat disclaimer
- Removed "Read off the secondary type (x) as a pattern, not a game fact —
  treat it as a starting guess, not a verdict" from the specimen sheet. It ran
  on all 145 of them
- The reasoning is worth keeping straight: the honesty framing is core to this
  site and isn't being softened. But that line was hedging *at the reader*
  every time they opened a specimen, and it cut against what the habitat panel
  is now for — a visitor should be picturing the plant, not being reminded
  mid-thought that the category is an inference
- The framing survives in the one place it belongs: the gallery still explains
  the whole habitat system up front, once, before anyone starts browsing. Said
  once as context reads as curation; repeated 145 times it reads as a
  disclaimer
- The `(manual)` marker on overridden habitats stays — that's a curatorial
  mark on a specific specimen, not a general caveat

### 35. The habitat wing — first exhibition room
- `/habitat/:slug` renders one habitat as a room rather than a filter result:
  the illustrated scene, the category write-up, then each specimen held there
  in its glass case beside its own placard. Ancient & Long-Lived Flora is the
  first, with the curator's illustration
- This is what the two-level habitat writing from section 34 was for. The
  category text says what the habitat is; each placard says why that specimen
  is standing in it. Neither reads as a filter caption
- Slugs come off the habitat *name*, not the map key — the key is a secondary
  type, so `/habitat/dragon` and `/habitat/none` would be opaque at best. It
  also means an overridden specimen, which carries a name but no key, lands in
  the right room
- Membership matched on habitat name for the same reason: Cacnea has no
  secondary type at all and is hand-filed under nocturnal-function, so a
  type-based match would have left it out of its own room
- Degrades sensibly: a habitat with no illustration yet simply omits the
  figure, a specimen with no `habitat_note` shows a note naming the field to
  fill in, and an unknown slug says so rather than rendering an empty room.
  Verified all three
- Entry point is the specimen sheet's habitat panel ("See the whole habitat").
  Not the gallery card's habitat pill — the whole card is already a link, and
  nesting anchors is invalid
- Source art optimized on the way in: 1536x1024 PNG at 3.1 MB re-encoded to
  JPEG at 440 KB, which matters when it's a full-bleed hero. Original is
  gitignored; `public/habitats/` holds the web copy
- Housekeeping: `Herbarium.jsx` had its own copy of `spriteUrl` duplicating
  the one `pokeapi.js` exports. Removed, both pages now use the shared one

### 36. Determination Key moved out of the nav, into the gallery
- The nav was holding six items with a habitat wing still to come. The key was
  the one that didn't belong there: the nav holds *places* — rooms you walk
  into — and a determination key is a *tool*, the thing you reach for while
  already looking at specimens
- Its entry point now sits in the gallery's filter row alongside search and the
  habitat dropdown, which is the honest grouping: search finds a specimen you
  can already name, the habitat filter finds one by where it lives, and the key
  finds one you can only describe
- **The page itself stayed.** Only the entry point moved. Folding the staircase
  inline would have cost the framing essay — what determination means in a real
  herbarium, why this is polytomous rather than strictly dichotomous, and the
  honest note that it keys on classification rather than morphology. That
  writing is a good part of the project's character and doesn't fit in a filter
  row. `/key` remains linkable and now carries its own way back
- Reuses the nav's glyph set rather than redrawing the key icon, so the entry
  point reads as the same object that used to sit in the header
- Measured before claiming a win: desktop nav is back to one row at 71px with
  **221px spare** against a 170px widest pill, so the habitat wing has room.
  Mobile is unchanged at three rows and 199px — five pills still wrap 2/2/1
  where six wrapped 2/2/2, so the gain there is nil. The win is desktop
  headroom, not a shorter header

### 37. The Exhibition Hall
- `/exhibition` is the index of habitat rooms and takes the nav slot the
  Determination Key vacated in section 36. Each card is a doorway; the room
  itself is still `/habitat/:slug`
- Framing the hall against the gallery rather than duplicating it: the gallery
  keeps every specimen under glass one case at a time, the hall puts them back
  where they grow. Same 145 specimens, opposite premise
- Illustrated rooms sort first — a hall shows its finished exhibits before the
  ones still being hung — and the rest carry a hatched panel reading
  "illustration in preparation" rather than an empty frame pretending to be
  done. The header says "1 of 18 rooms illustrated so far" for the same reason
- Counted by habitat name, like the room pages, so overridden specimens land in
  the right tally. Verified the counts sum to exactly 145: every specimen is in
  precisely one room, none double-counted or dropped
- Nav stays lit inside a habitat room, the same wayfinding fix specimen faces
  got — a room is inside the hall, so the hall shouldn't go dark once you walk
  in. Verified: hall lit on `/exhibition` and on `/habitat/*`, Specimens lit on
  `/specimen/*`
- Gallery's key entry relabelled "Key to specimen" — plainer than
  "Determination key" for a button, while the page keeps the proper term
- Six nav items fit one row at 1280px with 60px spare; mobile is unchanged at
  three rows and 199px

### 37a. Type pairing shown on the habitat rooms
- The botanical names say what a room is *about* but not why its specimens are
  together. Added the type pairing each room is read from — on the hall cards,
  where scanning eighteen type pairs is far quicker than reading eighteen
  botanical names, and on the room page under its heading
- **Framed as derivation, not title.** The habitat name stays the headline and
  the pairing sits under it as "read from", because stating it as fact would
  be wrong twice: Cacnea is filed under nocturnal-function by hand while
  carrying no secondary type at all, and the mesophytic room is *defined* by
  having no secondary type. That room shows Grass alone with "no secondary
  type" spelled out rather than an empty second slot
- Reuses `TypeBadge`, so the pairing carries the same authentic palette the
  specimens do rather than introducing a second colour language
- Verified across all 18 rooms: every room shows Grass, seventeen show a
  correct second type, and only Mesophytic shows one. No overflow at 375px
  with 35 badges on the hall index

### 38. Collected Observations — the Pokédex record, consolidated and sourced
- The specimen sheet had been showing one Pokédex entry, picked by taking the
  first English match from the API. That's arbitrary, and in practice it meant
  the oldest game — which is why Bulbasaur read in shouty Gen-1 caps and Cacnea
  opened "CACNEA lives in arid locations". 1998 wording by accident
- Meanwhile the rest of the record sat unused. Deduplicated by text, a species
  typically has 8–12 *distinct* English observations; Exeggutor has 20, Cacnea
  8, and recent species like Applin only 2
- New **Collected Observations** section consolidates all of them in the
  curator's own words and weighs them against real research. Kept separate from
  the field note rather than merged: one is the collection record, the other
  the determination, which is how a real herbarium sheet divides them
- Rephrasing rather than reproducing also settles the copyright question — the
  page cites a record instead of reprinting one
- **Attribution is derived from live data, not typed.** The app lists what it
  consolidated from, so the citation can't drift out of date as entries are
  added. First pass named every release, which ran Exeggutor's citation to 350
  characters over five lines — longer than some placards. Now: four or fewer
  releases are listed, more than that gives the span ("20 distinct entries
  spanning 32 releases, Red through Shield")
- **Inheritance rule now has a clean shape.** Species-level writing (`note`,
  `record`) passes down to Megas and regional forms; form-level writing
  (`habitat_note`) never does. That matches how the games file things —
  Exeggutor-Alola's entries live under the Exeggutor species — and it's why
  Sceptile-Mega inherits an 8-entry record while still needing its own habitat
  text
- Wrote the first seven, the Ancient & Long-Lived room. The value shows up
  immediately in things a single entry can't reveal:
  - **Applin** — Shield's note that the apple's flavour decides what it becomes
    is nearly the apple maggot fly exactly: a population that shifted from
    hawthorn to introduced apple began diverging genetically while living side
    by side, one of the best-documented cases of speciation in progress
  - **Appletun** — a nectarous scent described as luring prey. The mechanism is
    observed accurately and its purpose reversed; nectar and floral volatiles
    evolved to bring insects in for pollination. Cacnea's flower gets the same
    treatment in its own entries
  - **Hydrapple** — "power only when their moods align" lands on a real orchard
    problem: most apple varieties are self-incompatible, so fruit set depends on
    compatible partners flowering at the same time
  - **Exeggutor** — heads grow under strong sun, cloudy days make it sluggish,
    oversized heads drop off and continue as Exeggcute. That's light-limited
    photosynthesis and vegetative reproduction stated plainly; Kalanchoe drops
    rooted plantlets, Agave and garlic form bulbils

### 38a. Pokédex entries cited as publications
- Replaced the summary line ("Consolidated from 2 distinct Pokédex entries:
  Sword, Shield") with proper manuscript citation. A Pokédex entry is a primary
  source for this collection, so it now gets the same treatment the Reading
  Room gives a paper: *Pokémon Sword & Shield* (2019). Pokédex entry.
- The records cite inline as well, at the point each claim is made, matching
  how the case files already cite Fradera-Soler or Tan & Chen
- **Releases are grouped as publications, not versions.** Sword and Shield are
  one Pokédex with two variant entries, so they cite once — Exeggutor's
  thirty-two versions collapse to eighteen releases, Applin's two to one. The
  tally states it honestly: "2 distinct entries across 1 release"
- Grouping is explicit rather than derived from the year, because year alone
  gets 2022 wrong — Legends: Arceus and Scarlet & Violet share it and are not
  the same publication
- Years are English release dates, since the entries being cited are the
  English ones
- Long reference lists fold: eighteen citations ran to 573px on a phone, most
  of a screen before the habitat panel. Over six sources the list collapses
  behind a summary naming the span; the full list is still there, because a
  reference section that hides its sources isn't one. Native `details`, so it
  needs no JavaScript and stays keyboard-accessible

### 38b. Every citation opens to the passage it cites
- Each reference is now expandable to the actual Pokédex text for that release
  — a reference you can't consult isn't much of a reference, and it lets the
  consolidation above be checked against what it consolidated
- This does put verbatim text back on the page, which the synthesis had
  removed. Behind a click, attributed to a named publication and shown beside
  the reading it supports, is a defensible place for it — and citing a source
  while refusing to show it would be the stranger choice
- **A release can print more than one passage**, and that turned out to matter:
  paired versions frequently disagree. Applin's single Sword & Shield citation
  opens to two different entries, each labelled with the version carrying it.
  Where the pair agrees — Red & Blue for Exeggutor — one passage shows with no
  label at all, since a label would only be noise
- Rendered as `blockquote` with a rule down the side, so the source's voice is
  visibly distinct from the curator's
- Nested `details` throughout: the whole list folds for long bibliographies,
  each citation folds within it. Verified on Exeggutor-Alola with 18 citations
  and 25 passages expanded — no overflow at 375px, every quotation inside the
  column
- Renamed **Sources → Citations**, and cut the tally line ("2 distinct entries
  across 1 release. Each opens to the passage cited."). It read as build
  metadata leaking into an exhibit — the counts were there because they were
  easy to compute, not because a visitor wanted them, and "each opens to the
  passage cited" explains an affordance that a disclosure triangle already
  announces. The collapsed summary keeps only what's useful: the span from
  earliest citation to latest
- Same tic had reached the prose: Exeggutor's record opened "Twenty distinct
  entries across nearly every generation". Now "Reported in almost every
  generation since 1998" — an observation rather than a count. Worth watching
  for in the remaining 138 records

### 39. Every alternate form written as its own specimen
- Megas and regional forms had been showing the base species' note plus an
  apology for it. Inheritance was the right *fallback* and the wrong *resting
  state* — a page that borrows its text and then admits it isn't an entry, it's
  a placeholder with manners
- **Written from measured differences, not vibes.** Pulled each form's typing,
  height, mass, stat allocation and ability against its base and wrote from
  the delta. The numbers turned out to carry the arguments:
  - **Chesnaught-Mega** — height and mass *identical*, 1.6 m and 90 kg either
    side, yet +50 defence. Nothing was added; the interior was rebuilt. Real
    wood density varies ~4× between species at the same trunk size, and the
    dense end resists breakage and rot while growing slower
  - **Exeggutor-Alola** — 2 m to 10.9 m and 120 kg to 415.6 kg, which makes it
    a plumbing problem. Water is pulled up under tension in continuous threads;
    the taller the column the closer it runs to cavitation, and that limit is
    the leading explanation for why the tallest trees stop near 100 m
  - **Victreebel-Mega** — eight times the mass and 2.6× the height, which for a
    pitcher plant changes the *diet*: real Nepenthes scale from insect traps to
    multi-litre vessels that drown small vertebrates
  - **Lilligant-Hisui** — −60 special, +45 physical, stated outright. Real
    defence budgets are finite and species trade chemistry against structure
    along mapped gradients; same organism, budget spent the other way
  - **Zarude-Dada** — nothing measurable differs *at all*. That's the entry:
    parental care is a life stage rather than a form, and plants keep their own
    version in provisioned endosperm and nurse-plant shelter
  - **The three Ogerpon masks** — identical body, one component swapped, and
    tolerance changes completely. Real botany's version is symbiosis: panic
    grass survives Yellowstone's geothermal soil only with a particular fungus
    that itself carries a particular virus. Remove any partner and the plant
    cooks. What an organism can endure is often a property of its company
- Binomials use botanical infraspecific rank — `var.` for a Mega, `subsp.` for
  a regional form
- **Fixed a false disclaimer while in there.** Four species keep their *default*
  form under a suffixed roster name (`wormadam-plant`, `shaymin-land`,
  `pumpkaboo-average`, `gourgeist-average`), so "written for the species, not
  this form" was untrue for them. Blocks renamed to the roster names, and the
  page now checks `is_default` before ever showing the caveat
- Result: **145 of 145 specimens carry their own field note**, none borrowing.
  Gallery intro rewritten accordingly — it had been explaining `base note` and
  `uncat.` labels that no longer appear on any card

### 40. Three more rooms illustrated, and a clearer heading
- Habitat art added for Bioelectric-Signaling, Cold-Adapted & Alpine, and
  Cliffside & Mineral-Poor Soil. The hall now reads **4 of 18 rooms
  illustrated**, and the illustrated ones sort to the front on their own
- All three are better targeted than the first piece was. The alpine scene
  shows shrubs buried in snowpack, which is literally Snover's placard —
  staying short enough to winter in the insulated layer. The cliffside scene
  carries foliose lichens and *Cladonia*-style podetia on bare rock, which is
  the pioneer-colonisation argument the room is built on. The electric scene
  runs light through leaf veins and trunk, which is signal travelling through
  tissue rather than a lightning bolt bolted onto a forest
- Same pipeline as before: ~2.8–3.2 MB PNGs re-encoded to 368–424 KB JPEGs at
  1600px. The gitignore rule generalised from the single filename to
  `habitat-*.png`, so future art drops need no further edits
- **"This Specimen's Place In It" → "Why It's Filed Here."** The old heading
  needed the reader to hold "it" across two clauses and work out that the
  first "it" was the specimen and the second the habitat. The replacement says
  the same thing in plainer words and uses the collection's own vocabulary —
  specimens are *filed* under a habitat everywhere else in the copy

### 40a. Type badges left to speak for themselves
- Dropped the "read from" caption above the badges on every habitat room, and
  the matching "only" beside a lone badge on the hall cards. Both were
  narrating what the reader could already see: one badge reads as mono-Grass,
  two read as a pairing, and no wording was needed to establish that
- The meaning is kept where it still does work — an `aria-label` on the badge
  row, so assistive tech gets "Read from the Grass and dragon type pairing"
  rather than two colour swatches with no context. Removing a visual crutch
  shouldn't remove the information for people who can't see the badges
- Applied to the hall cards as well as the room pages, since leaving "only" on
  one and stripping the caption from the other would have been the
  inconsistent half of the change

### 41. Deadwood & Decomposer-Associated Flora (habitat 5 of 18)
- The two-level method again: the category rewritten from the specimens
  actually filed under it, then a placard on each saying what *it* contributes.
  The old one-liner ("fungi on old stumps, graveyard flora") was a gloss on the
  Ghost typing written before anyone had looked at who was in the room
- **The room was drafted for seven and holds ten.** Decidueye, Bramblin and
  Brambleghast are all Grass/Ghost and none of them appeared on the candidate
  list assembled from memory; the running habitat page prints its own
  membership and showed three "No placard written" cards. Worth recording as
  practice rather than as an anecdote — writing a category *from its roster* is
  only honest if the roster came from the app rather than from recall
- Those three turned out to be the most valuable additions rather than
  leftovers. Decidueye supplies leaf litter, which by annual weight is the
  largest thing the wing is about and was missing entirely; the two tumbleweeds
  supply the case where decomposition *doesn't* happen, because rot needs water
  and arid ground accumulates dead matter instead of clearing it. That last one
  changed the category text: the room now ends on fire doing the work fungi
  cannot, which is a better close than the one written for seven specimens
- The spine is the fact that reframes the rest — a mature tree is already mostly
  dead, heartwood being non-living tissue inside a thin living sleeve, so a
  hollowed veteran is not a corpse and the strength of a cylinder is in its
  wall. Trees don't heal wounds, they wall them off, which makes the hollow a
  settled boundary rather than an injury
- Ten placards, ten distinct contributions, deliberately no overlap: Phantump
  is the stump facing both ways (coppice stools outliving uncut trees, and the
  cut surface being the doorway root rot comes through); Trevenant is the
  hollow as tenancy; Pumpkaboo and Trevenant are the room's two hollows,
  opposite in origin — one excavated by fungi, one built in as a pepo's seed
  cavity; Gourgeist is ripening as autolysis, the fruit making the enzymes that
  unglue its own cell walls; Dhelmise is decay that travels rather than making
  soil where it fell, plus shipworms and deep-sea wood falls for the anchor;
  Poltchageist is the specimen *resisting* the room, matcha being defined by
  steaming the oxidative enzymes dead, and staling by oxidation with no
  organism involved at all; Sinistcha is the same material given over on
  purpose — pu-erh, awabancha, and koji being a domesticated *A. flavus*
- Poltchageist and Sinistcha carry the seam the room runs along: fermentation
  and spoilage are one process, separated by which organism arrived and whether
  anyone meant it. Worth being accurate that matcha is not fermented — the
  steam is there precisely to stop what this wing catalogues
- No illustration for this one yet, so the hall still reads 4 of 18 illustrated
  while the writing is now 5 of 18

### 41a. Collected Observations for all ten of the Deadwood specimens
- Records written for the whole room, taking it from 7 records in the
  collection to 17. This is the first habitat carried all the way through —
  room text, a placard on every specimen, and a record on every specimen — and
  it is the shape the remaining thirteen rooms should follow
- The entries were pulled from PokéAPI and consolidated from the actual text
  rather than from memory of it, which is the same lesson as §41 applied one
  level down. It paid immediately: the draft attributed Phantump's
  child's-voice lure to X & Y, and X & Y never printed it — that entry is Ultra
  Sun & Ultra Moon and Sword & Shield. Every other attribution checked out, but
  the citations are printed as manuscript-style references and a wrong one is a
  wrong reference, not a wrong vibe
- Each record deliberately opens ground the field note and the placard don't
  already hold, so the three sections on a specimen face say three different
  things. Phantump's dex mentions abandoned forests and a cure-all, which buys
  abandoned-coppice ecology and willow bark to salicin; Trevenant's roots
  "as a nervous system" buys natural root grafts and the stump kept alive for
  decades by its neighbours — the same plumbing as the root rot in its own
  placard, running the other way. Pumpkaboo carrying spirits to where they
  belong buys the megafaunal dispersal story and the gourds that lost their
  carriers; Gourgeist's hairlike arms buy tendril circumnutation and the helix
  perversion Darwin wrote a book about
- Two of them are gifts from the writers. Poltchageist's second entry says
  outright that it resembles Sinistea and is entirely unrelated, which is
  convergence stated in the source text — so the record is cactus and euphorbia
  arriving at the same column on two continents, and why classification stopped
  trusting appearance. Sinistcha pretending to be tea so someone will drink it
  is Vavilovian mimicry, where rye and oats began as weeds that got harvested by
  mistake often enough to be promoted to crops
- Decidueye's record needed a correction rather than an elaboration: Legends:
  Arceus calls its insulated feather shafts "firm proof that evolution can be
  influenced by environment," and environment selects among variation rather
  than directing it. Said in one line, without turning the section into a
  lecture, and then given back to the plants — one genotype really does grow
  different leaves above and below the waterline

### 42. Deep-Rooted & Soil-Anchored Flora (habitat 6 of 18)
- Written all the way through in one pass this time — room text, placard and
  record for each of Torterra, Toedscool and Toedscruel — which is the shape
  §41a arrived at and is now the default for a room
- The roster was read off the running page before a word was written, per §41.
  Three specimens, and **two of them are fungi**, which changed what the room
  is about. The old description was a fair gloss on the Ground typing —
  extensive roots, mycorrhizae, anchoring — but written as though the room were
  full of plants investing in roots, when the exhibits are one tree and two
  mushrooms
- So the room leads by correcting its own name. "Deep-Rooted" is the
  misconception: most root mass sits in the top thirty centimetres and spreads
  well past the canopy rather than plunging, and genuinely deep roots are rare
  and specific — the record is a shepherd's tree found sixty-eight metres down
  a Kalahari mine shaft. Roots are also outclassed at spreading, a hypha being
  two or three micrometres against a root hair's ten, which is the whole reason
  the partnership exists
- The strongest fact in the room is that the partnership is older than the
  organ: the Rhynie chert plants, four hundred million years old, already carry
  fungal partners threading their tissue and have no roots yet. The partnership
  came first and roots arrived to hold it
- Ends by saying plainly that two of three exhibits are not plants, and that
  this is not an error in a herbarium — fungi sat inside the plant kingdom
  until Whittaker split them out in 1969. Same instinct as the Bioelectric room
  admitting its exhibits fit badly; the difference is that here the mismatch is
  the actual subject rather than a caveat
- Placards split three ways with no overlap: Torterra gets canopy soil, where a
  tree grows adventitious roots up into the compost its own epiphytes made on
  its back; Toedscool gets why the fungus is needed at all, which is that
  phosphate moves millimetres in soil so a root strips a depletion zone and
  starves in rich ground; Toedscruel gets the dark reading of the same
  connectivity — Armillaria at ten square kilometres and two thousand years,
  killing trees as it spreads, and fairy rings whose diameter works as a clock
- Records took the third angle again. Torterra's dex is consistent for fifteen
  years that it is *inhabited*, and the "moving forests" line buys hydraulic
  redistribution: a deep root pulling water up at night and leaking it into dry
  topsoil for its neighbours. What moves is the water, not the forest — and the
  walking palm's reputation for relocating does not survive measurement.
  Toedscool's "looks like Tentacool, completely different species" buys the
  classification history, with chitin in the cell wall as the tell. Toedscruel's
  "coils around prey and sucks out nutrients" buys nematode-trapping fungi,
  which are real and not marginal, plus somatic incompatibility — the black
  lines marbling spalted wood are borders between rival fungal individuals
- Torterra spans eight publications, so its citation list folds behind the
  span summary rather than printing in full. Worth noting the two in-prose
  citations bracket exactly that span, Diamond & Pearl through Legends: Arceus,
  which is the behaviour §38a was built for working as intended

### 43. Generalist Flora (habitat 7 of 18)
- Roster read off the page first, as now standard: five specimens, the Deerling
  line and the Smoliv line. A seasonal deer and an olive tree
- This one needed a decision the previous rooms didn't. A Normal secondary type
  makes exactly the same non-claim a mono-Grass typing does, and the mesophytic
  room already handles that at length — repeating "this category is a statement
  about missing information" would have broken the house rule about saying a
  thing once. So the room disposes of it in a sentence, points at the other
  room rather than restating it, and then does what the two-level method is
  actually for: reads the exhibits
- **What the exhibits share is not a place but a calendar**, which makes this
  the phenology room. Worth stating as a structural point rather than a
  flourish: every other room in the wing answers *where* a plant lives, and
  this is the only one that answers *when* it does things — the one adaptation
  with no location attached
- The five notes already gesture at photoperiod, so the room text deliberately
  carries the mechanism they skip: plants count accumulated heat rather than
  days, which is why growers plan in degree-days; photoperiodism measures the
  *night* rather than the day, which the night-break experiment settles
  outright, with phytochrome relaxing back in darkness slowly enough to serve
  as an hourglass; and vernalization makes winter a requirement, a gene shut
  down by weeks of cold and staying shut, so a plant carries a memory of a
  winter it has already survived
- Placards run one idea each and no overlap: Deerling gets phenological
  mismatch, with snowshoe hares moulting white on day length and standing out
  against bare ground when the snow is late; Sawsbuck gets the rhythm a single
  year cannot show, which is masting and its predator-satiation logic; Smoliv
  gets oleuropein and the fact that every olive ever eaten has been cured;
  Dolliv gets juvenility as developmental incompetence rather than youth, with
  ivy's two forms from one genome; Arboliva gets alternate bearing, and says
  explicitly how it differs from Sawsbuck's masting — one is a regional
  strategy, the other a constraint inside a single tree that nobody wants
- Records again took the third angle. Deerling's dex turns out to state the
  cue hierarchy correctly — season first, temperature and humidity as
  modifiers — which is precisely why warming decouples things. Sawsbuck's
  "harbingers of spring" buys the phenological archives: Kyoto's cherry
  flowering dates from ninth-century court diaries, and the Marsham family's
  Indications of Spring from 1736, both kept for reasons that had nothing to do
  with science and both now among the longest biological records there are.
  Smoliv gets the olive as the rare *fruit* oil rather than a seed oil, pressed
  like juice; Dolliv gets six thousand years of the oil being lamp fuel, soap
  and sacrament long before it was food; Arboliva gets what "extra virgin"
  actually means and oleocanthal's peppery throat-catch inhibiting the same
  enzymes as ibuprofen — carefully hedged, since the dose is nowhere near
  therapeutic
- One citation caught in verification, the same class of error as §41a:
  "harbingers of spring" is Black 2 & White 2, not Black & White, and the draft
  had folded both entries under the earlier publication. Split. Two rooms
  running, two miscitations found — the check is earning its place

### 44. Insect-Associated Flora (habitat 8 of 18)
- Six specimens: Paras and Parasect, Wormadam-Plant, and the Sewaddle line.
  Picked as the next room in the hall's own ordering rather than by size
- **Not one of them is a plant.** Deep-Rooted had two fungi out of three and
  said so; this is the same problem at its limit — every exhibit is an insect
  using plant tissue, plus a fungus using an insect. The category is named for
  the side of the relationship the collection does not hold
- Which turned out to be the room, rather than a difficulty with it. The text
  says the inversion outright and then supplies the half the roster cannot: a
  chewed leaf changes chemistry within minutes, raising protease inhibitors,
  and shifts what it emits into the air specifically enough that parasitoid
  wasps navigate by it — the plant calling in something to lay eggs inside the
  animal eating it. Then the plants that build for insects on purpose: leaf
  domatia housing predatory mites, and bullhorn acacias growing hollow thorns
  and feeding their ants outright. Closes on the plants being the exhibits that
  never got collected, and the wall text being theirs
- Placards deliberately kept the big ideas out of the room text so it wasn't
  carrying six at once. Paras gets the genuinely three-way version — Beauveria
  and relatives live inside plants as endophytes, so an insect that eats the
  leaf picks up the fungus and dies of it, and the plant hosts an armed tenant
  it never evolved. Parasect turns its own extended-phenotype note around and
  points it at plants, which gives galls: the oak builds an organ that has no
  place in oak development, every cell of it the plant's, directed by another
  organism's genome. Wormadam gets leaves as irreversible commitments — sun and
  shade leaves on one tree, fixed at expansion, never convertible. Sewaddle
  gets leaf shelters as ecosystem engineering; Swadloon gets frass as the
  faster nutrient route; Leavanny gets the yucca contract, deliberate
  pollination with the plant aborting over-loaded flowers as enforcement
- Records: Paras's dex names *tochukaso* from Gold & Silver onward and calls it
  medicine for long life, which is Ophiocordyceps sinensis — a real Himalayan
  commodity that outpriced gold by weight and is now IUCN vulnerable, with even
  the throwaway Alolan quality line mirroring a real market in provenance.
  Parasect's quietest entry, spores left on the bug's egg, is vertical
  transmission, which is the road from parasite to organ (Buchnera in aphids).
  Wormadam's thicker cloak on a cold day is seasonal polyphenism, with the map
  butterfly's two generations once described as separate species. Sewaddle gets
  silk and the fact that Bombyx cannot fly, feed or survive without people, and
  eats only mulberry. Swadloon's forest-enrichment claim is treated honestly as
  a real hypothesis that is settled on cycling and unsettled on benefit.
  Leavanny's fermenting-leaf warmth buys thermogenic plants — skunk cabbage
  holding twenty to thirty degrees above air for a fortnight and melting up
  through snow, and arums heating a chamber overnight to pay beetles in warmth
- No miscitations this round. Every attribution was checked against the fetched
  entries before writing, rather than after — which is presumably why

### 45. Deerling and Sawsbuck get their four seasons
- Sawsbuck genuinely has seasonal forms, and the Generalist room had just been
  written on the argument that this line is one organism reading a calendar —
  so a face that could only show spring was underselling its own room
- Built to look like the Pumpkaboo/Gourgeist size selector, because that is the
  established control for "one organism, several states." Underneath it is a
  different thing, and the difference is the interesting part
- **A Pumpkaboo size is a whole PokéAPI `pokemon`; a Deerling season is only a
  `pokemon-form`.** The species has exactly one variety, so the four seasons
  share one id, one height, one mass and one stat line. Consequences worth
  recording: nothing to hide from the roster (the grass type list only ever
  returned `deerling` and `sawsbuck`), nothing to redirect, no second fetch, and
  nothing on the sheet moves with the selection but the specimen itself. The
  Deerling blurb says so outright, since anyone who has used the gourd selector
  will expect the numbers to change
- Sprite source needed deciding rather than assuming. Official artwork exists
  for the spring form alone — `official-artwork/585-summer.png` is a 404 — so a
  selector built on it would have shown one painting beside three pixel sprites.
  PokéAPI's HOME set carries all four seasons at 512px, so these two faces use
  HOME throughout, spring included. Losing the painted portrait on two pages is
  the right trade: the control exists to compare the seasons, and comparison
  needs them drawn the same way
- Shiny composes with the season rather than overriding it, which needed a
  little care — the toggle keys off whether official artwork has a shiny, then
  the season path swaps in `home/shiny/<slug>.png`
- Verified all eight sprites resolve at 512×512 before writing the module, and
  again in the page afterwards; checked Gourgeist still shows its size selector,
  its official artwork and no season control; four buttons fit one row at 375px

### 46. Mesophytic & Unspecialized Flora (habitat 9 of 18)
- The big one: 46 specimens, more than the previous four rooms put together,
  and the last of the large rosters
- The room had the weakest description in the map relative to its size, and the
  reason is structural rather than neglect. Every other category is a claim
  about a habitat; this one is the absence of a claim, since a mono-Grass typing
  carries no second signal at all. So the roster is not a community — it is
  whatever failed to be sorted: a desert cactus, a flytrap, a chilli, a
  sunflower, a kudzu-scale vine and an orchid mimic, standing together because
  none of them arrived with a label
- Rather than apologise for that, the room leads on it. "Every other room in
  this wing makes a claim. This one makes an admission." Then it defends the
  category's real subject: mesophyte is not a synonym for unremarkable, it names
  the middle of the water gradient, and the middle is a design with commitments
  — thin cheap leaves, daytime stomata, no storage, no deep roots, every one of
  them a bet that rain returns shortly. Closes on the leaf economics spectrum,
  which gives an enormous heterogeneous room one organising axis: fast leaves
  against slow ones, with no good corner where a leaf is both cheap and durable
- **46 placards, one distinct fact each, and the organising rule was that each
  says what the specimen actually is — because the category didn't.** That
  turned the room's weakness into the thing that made 46 non-repeating placards
  possible. Maractus gets to be the clearest evidence in the building that the
  filing means nothing (spines are leaves, the stem took over photosynthesis);
  Ogerpon closes the room as the heuristic's self-portrait, one organism filed
  into four different rooms depending on a worn mask
- Deliberate spread across scales so nothing blurred: cotyledons as a packed
  lunch (Chikorita), van Helmont's willow (Tangrowth), the cuticle and stomata
  as a single invention (Servine), sunflecks (Simisage), acorns being
  recalcitrant and unstorable (Seedot), puffballs as raindrop bellows
  (Shroomish), grass growing from the base (Gogoat), doubled flowers as sterile
  ABC-gene monsters (Lilligant), the American chestnut surviving as permanently
  juvenile sprouts (Quilladin), reaction wood (Thwackey), cotton fibre as one
  overgrown cell (Gossifleur), TRPV1 and the placenta (Capsakid)
- Two contested claims flagged as contested rather than smoothed: crown shyness
  (Grovyle) and Boquila's leaf mimicry (Fomantis), the latter explicitly called
  an open question
- **Tooling note worth keeping.** The first apply script split blocks on
  `/\n(?=###\s)/` and that pattern also splits before `### END`, so `note:`
  became a chunk's final line with no trailing newline and the insert regex
  matched nothing — while the script still reported "applied 46", because the
  counter incremented before the replace. Only Sceptile went in, because it
  already had a `record:` line after its note. Caught by checking the file
  rather than the script's own output, which is the lesson: the count a script
  prints is not evidence, the file is


### 47. Four more rooms illustrated — the wing is now half-lit
- Art landed for Deadwood, Deep-Rooted, Generalist and Insect-Associated, taking
  the hall from 4 of 18 illustrated to **8 of 18**. Every room written since §41
  now has a picture on it, so the writing and the illustration are level for the
  first time
- Same pipeline, one correction to how it is recorded: there is no ImageMagick
  or ffmpeg on this machine, and the `convert` on PATH is Windows' filesystem
  utility rather than IM — calling it would have done something quite different
  from resizing a picture. Encoding is done through System.Drawing from
  PowerShell instead, which adds no dependency to the project
- Sources ran 2.5–3.4 MB PNGs at 1535x1024 and 1672x941; the two wider ones were
  scaled to a 1600px long edge and the others left at native size. Quality is
  picked by stepping down until the file lands under 460 KB, which put them at
  414–452 KB — in line with the existing four at 377–451 KB
- Wired via `image:` in `habitatMap.js`, placed after `name:` as the existing
  entries do. The four illustrated rooms sort to the front of the hall
  automatically, so the ordering now reads: eight with pictures, then the ten
  still waiting
- Verified in the browser rather than on disk: all four load, `complete` is true
  and the natural dimensions match what was written, which distinguishes a wired
  image from a broken path that renders as empty frame

### 48. Mineral-Accumulating Flora (habitat 10 of 18)
- Three specimens: Ferroseed, Ferrothorn, Kartana. Small room, written all the
  way through — room text, placard and record on each
- The room is carried by the ground rather than the exhibits. Serpentine soil is
  the whole story: ultramafic rock weathering to something heavy in magnesium,
  thin on calcium and the major nutrients, and loaded with nickel and chromium
  at concentrations that kill ordinary plants. Serpentine outcrops behave as
  islands and are full of endemics, and a few hundred species went past
  tolerance into collection — the working threshold is a thousand micrograms of
  nickel per gram of dry leaf, and around seven hundred species clear it
- The best fact in the room bleeds: *Pycnandra acuminata* in New Caledonia has
  blue-green latex, and the colour is nickel at roughly a quarter of the dried
  sap by weight
- **The honest correction is the room's closing move.** Every specimen here
  wears its metal outside, as plate and spike. Real accumulation is the reverse
  — the metal is dissolved through the leaf, parked in vacuoles and cell walls
  where it cannot hurt the plant, and it is completely invisible. You cannot
  pick a hyperaccumulator out of a meadow by looking; you have to burn it and
  weigh the ash. That also explains agromining, which does exactly that on
  purpose
- Placards split cleanly. Ferroseed gets why iron is difficult despite being
  everywhere: insoluble at neutral pH, so dicots acidify and reduce it while
  grasses secrete phytosiderophores that grab ferric iron and are reabsorbed
  whole — a fishing line with a hook, and a grass invention, which suits a
  Grass/Steel seed. Ferrothorn gets the elemental defence hypothesis, the metal
  being a poison borrowed from the ground rather than synthesised. Kartana's own
  note already had silica edges, so its placard goes past them to the scale of
  it — phytoliths through the whole blade, more laid down after grazing, harder
  than mild steel on a scratch test, and the consequence written into grazer
  dentition rather than into plants
- Records took the third angle again. Ferroseed's mossy-cave entry buys mosses
  as passive samplers — no roots, no cuticle, so they take up whatever lands on
  them, which is why Europe maps heavy-metal deposition by collecting moss on a
  grid — plus dendrochemistry, where tree rings date what was in the ground.
  Ferrothorn's "absorbs the nutrients within the stone" buys the narrow band
  where an element is deficiency, nutrient and poison in turn, and the fact that
  nickel was only confirmed essential to plants in 1987. Kartana's paper-thin
  body buys the filmy ferns, whose lamina is one cell thick with no stomata and
  no cuticle at all
- Kartana is also the one specimen the collection holds that is stated outright
  to be from outside this world, and the record says so rather than working
  around it

### 49. Collected Observations for the Mesophytic 46
- The outstanding block from §46 cleared. Mesophytic is now carried all the way
  through like every other completed room, and it was the last one that wasn't
- Method changed for a roster this size. Rather than reading dex entries species
  by species while writing, everything was fetched first into one digest with
  each distinct English entry tagged by the **earliest** publication that
  printed it, so attribution became lookup rather than recall. No miscitations
  this round, against one each in §41a and §43
- Sceptile already had a record from the original seven, and it already covered
  the same entries. Left alone rather than overwritten — the apply script
  refuses outright on any block that already carries the field, which is what
  caught it. 45 written, not 46
- Records took the third angle from the note and the placard on every one, and
  the rule that made 46 possible was to let the dex pick the subject. The
  entries are frequently more specific than they look, and several are simply
  correct: Chikorita's leaf "checking humidity and temperature" is stomatal
  response to vapour pressure deficit plus evaporative cooling; Capsakid getting
  spicier in sunlight is real, since drought and heat genuinely raise
  capsaicinoid content; Servine keeping its leaves clean is the lotus effect,
  measured and commercialised
- Where a claim was wrong it got corrected rather than dodged. Turtwig's
  oxygen entry buys the correction that a mature forest is close to
  oxygen-neutral because decomposition consumes what photosynthesis makes, so
  the "lungs of the planet" line is misleading. Grotle's water-divining buys
  hydrotropism being real but weak, and the roots-break-drains story being
  backwards. Shaymin's air-purifying buys the houseplant studies being badly
  over-read indoors while roadside planting genuinely works
- Where the science is unsettled it says so. Grookey's sound-waves entry buys
  the one solid result — Arabidopsis primed by recorded caterpillar-chewing
  vibrations, and not by wind or insect song — set against music-for-plants
  never surviving a controlled trial
- Spread deliberately across scales so 46 did not blur: permanent meristems
  (Tangela), red:far-red shade detection (Grovyle), dodder hunting by smell
  (Seedot), amatoxins (Shroomish), source-sink and girdling (Cherubi), Nepenthes
  renting rooms to tree shrews and bats (Carnivine), cladoptosis (Tangrowth),
  green leaf volatiles (Leafeon), turgor (Snivy), photoinhibition (Serperior),
  root foraging (Pansage), bulbs as folded plants (Petilil), rose otto
  arithmetic (Lilligant), CAM (Maractus), sclereids (Chespin),
  thigmomorphogenesis (Quilladin), the domestication syndrome (Skiddo),
  Miocene grassland origins (Gogoat), clonal mobility (Fomantis), hydrangea pH
  (Lurantis), gut scarification (Bounsweet), persistent sepals (Steenee),
  microfibril angle (Thwackey), bamboo (Rillaboom), the dandelion vortex ring
  (Gossifleur), cotton's four independent domestications (Eldegoss), isoprene
  haze over the Blue Ridge (Sprigatito), buds as pre-packed shoots (Floragato),
  and the Laburnocytisus graft chimera to close on Ogerpon
- Maractus gets the room's sharpest joke told straight: the trait that actually
  defines a cactus is CAM, the collection has an entire room for plants that run
  their lives after dark, and this specimen was filed under "no adaptation
  signalled" instead

### 50. Nocturnal-Function Flora (habitat 11 of 18)
- Nine specimens, and they do not form one group. Two are genuine desert CAM
  plants (Cacnea by hand-override, Cacturne by typing), two are forest organisms
  whose darkness is shade rather than night, and the rest are filed here for
  temperament — a grudge, a trickster, a rogue. The room text carries the actual
  night shift and each placard says which of the three its specimen belongs to
- The description had to go past CAM rather than explain it, because §49 had
  just used Maractus's record to set out the mechanism and pointed at this room
  while doing it. So the room takes the parts that come after: the cost, since
  overnight storage capacity caps carbon gain and CAM plants are slow; CAM
  idling, where stomata stay shut around the clock and the plant recycles its
  own respiratory carbon for months at zero net gain; and facultative CAM,
  treated as a setting rather than an identity
- Then the parts of the night that are not CAM at all. Moth flowers and bat
  flowers as distinct syndromes, with agave, saguaro and durian all depending on
  the latter. De Mairan shutting a mimosa in a cupboard in 1729 and finding the
  leaves still keeping time — the founding experiment of chronobiology, done on
  a plant. And the arithmetic that closes it: a plant meters its starch reserve
  overnight so that it runs out at dawn and not before, which requires dividing
  what it has by how long the darkness will last
- Placards, one idea each and several of them about darkness rather than night.
  Nuzleaf gets skotomorphogenesis — a seedling underground grows a completely
  different body and abandons it on first light. Shiftry gets nocturnal
  transpiration, which is real, widespread, unexplained, and pure loss.
  Cacnea gets night-blooming cereus buying a single night out of a year.
  Cacturne gets CAM idling. **Zarude gets the strangler fig killing by
  manufacturing darkness**, and Wo-Chien gets deep litter doing the same thing
  from the ground — the two are written as a deliberate pair, canopy and floor.
  Zarude-Dada gets the seed size trade-off, which is provisioning measured as
  how long a seedling can afford to wait in the dark. Meowscarada gets the
  Purkinje shift, which is why night flowers are white. Brute Bonnet gets
  bioluminescent fungi and the sticky-model experiment that showed the glow
  actually recruits spore dispersers
- **A real finding in the data model.** `record` is documented as species-level
  and inheriting, but `getSpecimenNote` only reaches the inheriting branch when
  a form has no note of its own — and every form in this collection has one. So
  record inheritance is dormant in exactly the way the note fallback is, and
  Zarude-Dada would have shown an empty Collected Observations if its record had
  been left to inherit. Written into its own block instead, and recorded in
  MILESTONE §3 next to the inheritance rule so the next form does not trip on it
- Tooling note: the shell heredoc used for every previous batch failed to parse
  on this content and produced no file at all. Not worth diagnosing mid-task —
  the fields were written directly instead. Worth knowing that a silent
  non-creation is a possible failure mode of that pattern
- Records took the third angle as usual. Nuzleaf's grass flute buys the blade as
  a working double reed and the way woodland strips high frequencies out of
  sound. Shiftry's hundred-feet-per-second gusts get converted (about seventy
  miles an hour, near where shallow-rooted conifers start being thrown) and its
  fans buy leaf size limits — big leaves overheat by day and radiate below air
  temperature at night. Cacnea's thirty days buys saguaro water fractions and
  concertina pleating. Cacturne's blood-turned-to-sand buys mucilage, which is
  glue rather than sand and is used to clarify drinking water. Zarude's generous
  entry about shed vines feeding the forest is answered honestly: lianas
  suppress the trees they climb, and liana-heavy forest stores less carbon.
  Meowscarada's flower bombs buy pollen quantities and hay fever. Brute Bonnet's
  dubious-magazine entry buys Prototaxites, an eight-metre fungus that stood on
  land before trees and was misfiled for a century and a half. Wo-Chien's wooden
  tablets buy bamboo slips, palm-leaf manuscripts, papyrus and birch bark — the
  long tradition of pressing plants flat and expecting them to hold information,
  which is what this collection is

### 51. The remaining seven rooms, and the wing is finished
- Ornamental & Pollinator (6), Pioneer & Fast-Colonizing (6), Psychoactive &
  Sensory-Signaling (5), Pyrophyte (3), Toxic & Chemically-Defended (16),
  Wetland & Aquatic (4) and Wind-Dispersed & Aerial (7) — 47 specimens, all
  written through. **All 18 habitat rooms now have real descriptions, and all
  145 specimens carry a note, a placard and a record.**
- The pattern that made the earlier rooms work held: read the roster off the
  page, fetch the dex first and attribute by lookup, then give each specimen a
  fact the room text and its own field note do not already hold
- Most of these rooms needed the same honest move as their predecessors, because
  the type-based filing keeps producing rosters that do not match the label.
  Ornamental holds two cottons and two luminous fungi, so it became a room about
  advertising — the budget, the ultraviolet targeting we cannot see, the third
  of orchids that pay nothing, and the plants that closed the account and went
  to wind. Pioneer holds five fighters and one coloniser, so it took the word at
  its technical value and ran on why light competition is asymmetric: the taller
  plant takes all of it, which is what turns a crowded patch into a race.
  Pyrophyte holds two chilli peppers, whose fire is a receptor trick already
  covered on Capsakid's record, so the room names the pun and gives its three
  placards one fire strategy each — resist, resprout, recruit
- Toxic was the exception and a relief: sixteen specimens and the category
  finally fits. It takes the question every scattered toxin placard in the
  collection had left hanging — how do you carry a poison without being
  poisoned — and the answer is that most plants carry two harmless halves in
  separate compartments and manufacture the poison in the mouth of whatever
  bites. Then Ehrlich and Raven's escape-and-radiate, and monarchs turning
  milkweed's defence into their own
- Wetland needed its premise inverted. The old line listed habitats; the room
  now leads on water being the hard option, since oxygen diffuses through it
  some ten thousand times slower than through air and everything in a pond
  descends from ancestors that had already escaped it
- **The record-inheritance finding from §50 shaped the whole batch.** Every form
  that carries its own note needs its record written out, so Chesnaught-Mega,
  Venusaur-Mega, Victreebel-Mega, Scovillain-Mega, Lilligant-Hisui,
  Decidueye-Hisui, Shaymin-Sky and both remaining Ogerpon masks were given their
  base species' record verbatim — which is exactly what the documented
  species-level rule intends. Meganium-Mega had been given a *different*
  consolidation of the same entries earlier in the session and was corrected to
  match, since two divergent readings of one species' record is not a thing the
  collection should hold
- Then the audit that mattered. Running the roster through `getSpecimenNote`
  rather than through the parser turned up 11 specimens with no record at all —
  Lileep, Cradily, Snover, Abomasnow, Rotom-Mow, Voltorb-Hisui,
  Electrode-Hisui, and four Megas and forms. Every one of them belongs to
  Cliffside, Cold-Adapted, Bioelectric or Ancient: the four rooms written before
  records became part of the pattern. Backfilled, so the claim that every
  completed room is carried all the way through is now true of all of them
  rather than of most
- Rotom-Mow's record is worth noting for the house style. It has no botany to
  consolidate and the record says so outright rather than inventing some, then
  observes the one true thing available: a mower is a device for enforcing a
  permanent juvenile stage on a plant community, and it only works because cut
  grass regrows from the base
- Tooling: a small writer (`room-writer.mjs`) replaces one habitat description
  by matching a unique fragment of the old text, and `split-copy.mjs` separates
  fields to insert from `COPY:<species>` record directives. Both refuse on an
  ambiguous or already-populated target, which is what stopped the batch from
  silently half-applying the way §46 did

### 52. Automated tests — the gap MILESTONE has been naming since §19
- Vitest added as the only new dev dependency (it ships alongside Vite, so there
  is no second toolchain). `npm test` runs the suite in about half a second;
  `npm run test:watch` for iterating
- Three files, 462 tests, and they are aimed at the failures this project has
  actually had rather than at coverage for its own sake:
  - `fieldNotesLoader.test.js` — the §6.1 regression above all. The same block
    is parsed with LF, CRLF and lone-CR endings and must come out identical,
    which is the exact bug that had every content file parsing to zero entries
    in production. Plus block shape: TEMPLATE skipped, a habitat-note-only block
    kept, a fields-only block dropped, wrapped fields rejoined, `### END`
    respected
  - `specimenNote.test.js` — the two inheritance rules, which are invisible in
    the UI until a specimen quietly shows the wrong text. Habitat notes are
    form-level and must never be borrowed; field notes and records are
    species-level and must be. Includes the §50 trap directly: a form carrying
    its own note never reaches the inheriting branch, so its record has to be
    written out, and there is a test that fails if one is left to inherit
  - `content.test.js` — runs the real `public/field-notes.txt`, not a fixture,
    because the file is hand-edited in Notepad and the failure that matters is a
    real edit dropping a field. This is the §51 audit made permanent: every one
    of the 145 roster specimens must resolve with a note, a placard and a
    record. It is what found eleven missing records by hand; now it runs every
    time
- **A test failed on the first run and the test was wrong, which was worth
  more than a green suite.** I had asserted that the parser ignores unknown
  fields. It does not — it cannot distinguish an unknown field from a wrapped
  continuation line, so a mistyped `habitat_not:` is silently absorbed into the
  note above it and the placard simply never appears. The unit test now
  documents that behaviour honestly, and `content.test.js` gained a guard that
  scans the real file for any `word:` prefix outside the known six
- **Mutation-checked rather than trusted.** A passing suite proves nothing until
  it fails on the real bug, so the CRLF normalisation was removed from the
  loader and the suite re-run: it went red across three files, including the
  test that says the file must parse to more than a hundred blocks — the precise
  silent failure of §6.1. Source restored and verified byte-identical to the
  backup afterwards
- The roster is a committed snapshot at `src/data/__fixtures__/roster.json`,
  regenerated with `npm run roster:refresh`. It deliberately re-implements
  `fetchGrassRoster`'s filters rather than importing them, so that changing
  those filters shows up as a fixture diff to review instead of silently
  redefining what the test considers complete
- What the tests do not do, and should not be trusted to: nothing here checks
  whether the writing is good, whether a placard repeats another one, or whether
  a citation is attributed to the right game. Both miscitations caught this
  session — Phantump and Sawsbuck — would sail through. `content.test.js` checks
  citation *shape* and year range only, and says so
- Note for whoever runs `npm audit`: three high-severity advisories exist, all
  pre-dating this work (nanoid, reached through react-router). Left alone rather
  than bumping a runtime dependency as a side effect of adding a test runner

### 53. The about page becomes the Curator's Note, and gains a curator
- **"Field Notes" → "Curator's Note" in the nav.** Not cosmetic: a *Field Note*
  is already a specific thing in this collection — the per-specimen botanical
  reading, headed as such on every specimen face — so the navigation had one
  term meaning two things. The page title, document title and heading all move
  with it, and the eyebrow becomes "About This Collection" so it no longer
  duplicates the heading
- **Removed the closing paragraph about `base note` and `uncat.` markers.** It
  was flagged as adding nothing and thinning the fiction, which was right, but
  it turned out to be a stronger call than that: the paragraph explained two UI
  states that can no longer occur. Every one of the 145 specimens now carries
  its own field note, so `inherited` is never true and `curated` is never false
  — checked across the whole roster before deleting, and the counts are zero and
  zero. It was documenting behaviour the collection has grown out of
- Added a curator profile as a deliberate scaffold. It sits in a single
  `CURATOR` object at the top of `About.jsx` — name, role, portrait, support
  URL, and an array of bio paragraphs — so replacing it is editing plain strings
  rather than picking through JSX
- Two details worth keeping. The portrait falls back to a dashed frame reading
  *portrait in preparation*, which is the same convention the exhibition hall
  uses for an unillustrated room: an honest empty frame rather than a stock
  silhouette standing in for a person. And the support link renders with **no
  `href` at all** while `supportUrl` is null, carrying `aria-disabled` and a
  visible "link coming soon" marker — a dead button that looks live on a page
  inviting money is the one thing this section should not ship as
- The placeholder bio is written in the house voice rather than as lorem ipsum,
  so the page reads properly today and the shape of what belongs there is
  obvious when it gets rewritten
- Layout uses the existing `.console-split--figure-left` pair, so the portrait
  and text sit side by side and stack below 760px like every other split in the
  project — verified stacked at 375px with no horizontal overflow

### 54. Sprites served from our own origin; donation block becomes correspondence
- Preparing to put this on a real domain surfaced a scaling fault that is
  invisible on one machine. `spriteUrl` and the seasonal-form helper both
  hotlinked `raw.githubusercontent.com`, and Specimen.jsx used the sprite URLs
  straight out of the API response, which point at the same host. That is a
  source-code host rather than a CDN: it rate-limits, and a public gallery
  pulling ~145 images per pageview from it starts failing under exactly the
  traffic the site would be advertising for. Every glass case would blank at
  once, which is the most visible possible failure
- `scripts/fetch-sprites.mjs` now downloads everything the app can ask for into
  `public/sprites/` — official artwork normal and shiny for all 151 roster ids
  including the folded size classes, plus the sixteen HOME images the seasonal
  selector needs. 317 files, 40 MB. `npm run build` chains it, so CI picks it up
  with no workflow change, and re-runs skip what is already present
- **Gitignored rather than committed.** 40 MB of PNGs in git history is a
  permanent cost for something reproducible in ninety seconds. Fetching once per
  deploy instead of once per visitor is the whole point; fetching once per clone
  is a fair price
- A fresh clone before `npm run sprites` would otherwise look broken, so
  `onSpriteError` falls back to the upstream copy and marks the element so it
  cannot loop between the two. Wired into every sprite `<img>` in the project.
  SpecimenCard already had an `onSpriteError` prop driving its no-sprite layout,
  so that one chains: first failure swaps in the remote copy, only a second
  failure falls through to the placeholder
- Verified by removing `public/sprites/3.png` and reloading Venusaur: the image
  fell back to the upstream URL, `data-spriteFallback` was set, and it loaded at
  475×475. Restored afterwards. With sprites present the gallery reports 145
  local images and **zero** requests to githubusercontent
- One upstream 404, `10192-shiny.png`, which is Zarude-Dada — and PokéAPI itself
  reports no shiny for that form, so the toggle never renders and nothing breaks.
  The script records misses rather than failing the build over them, and a
  PokéAPI outage now warns and exits cleanly rather than blocking a deploy
- **The treat button is gone.** Donations plus paid promotion plus a branded
  domain is the combination that makes a fan project read as commercial
  exploitation, and the collection is better off without the first of those. In
  its place the profile invites correspondence — corrections, disputed botany, a
  citation attached to the wrong game — which is a better fit for a project that
  has already had two miscitations caught by reading. Same disabled-until-set
  treatment: no `href` at all until `CURATOR.email` is filled in
- Cleanup pass alongside it: removed `greendesk.png` (3 MB, unreferenced and not
  ignored, so it would have entered history permanently), `public/icons.svg` and
  `public/future-cultivars.txt` (both superseded and unreferenced), and
  `src/assets/` entirely — `hero.png` and the Vite starter logo, neither used.
  The three generated proof pages were already gitignored but were still 35 MB
  on disk, so they went too. `pkmntype/` stays: it is only referenced from a
  comment, but it is the provenance record for the traced type icons, which is
  worth keeping in a fan project and costs 38 KB

---

### 55. The curator gets a face, and every field note is rewritten

**The Curator's Note stops being a scaffold.** The portrait frame had stood
empty since §53 and the correspondence button had no address behind it. Both
are now real: cc-curator.png in the repo root encodes to public/portraits/cc.jpg
and the button writes to the curator. The alt text is written out by hand in a
portraitAlt field rather than assembled from the curator's name, because the
name does not describe the picture and a screen reader gets nothing at all out
of "portrait of The Curator".

- A fourth encoder, scripts/encode-portrait.ps1, rather than borrowing one of
  the three. A portrait sits in a 230px column on a single page, so it caps at
  720px and 160 KB where a room backdrop caps at 1600px and 300 KB. Same
  reasoning as its siblings: a different budget with a stated cause
- `*-curator.png` added to the gitignore art globs. The source PNG is 1.8 MB
  and matched no existing pattern, which is exactly the failure .gitignore
  already warns about twice in its own comments

**Every field note is rewritten, 147 of them.** The `note` field was the
weakest writing on every page — roughly 240 characters of textbook definition
sitting between an 800-character placard and a 900-character record, written to
a different brief and never revisited. All 147 now hold one real, specific
thing per specimen, and none restates what that specimen's own placard or
record already says. Average length went from about 240 characters to 594.

- **The hard part was not the writing; it was not repeating.** Reading only the
  block being rewritten is not enough, because the fact that spoils a note is
  usually printed on a placard several rooms away. Ten collisions turned up:
  Rotom-Mow and Gogoat both had the grass meristem, Shiftry and Quilladin both
  had thigmomorphogenesis, Torterra and Skiddo both had the saguaro's nurse,
  Tsareena and Gourgeist both had the ripening enzymes, Ferrothorn and Kartana
  both had the silica, Virizion repeated Swadloon on grazing optimisation,
  Jumpluff repeated Cottonee's hygroscopic pappus, Weepinbell repeated
  Carnivine's tree shrews, Hoppip repeated Gossifleur's vortex ring, and
  Simisage repeated Serperior on photoinhibition
- The first six were found by reading and unpicked afterwards. The rest were
  caught by a search across every field of every block, run before drafting
  rather than after — which changed the working rhythm entirely, since six more
  facts were then discarded at the draft stage instead of being written,
  applied and removed again
- A final automated sweep pairs every note against every other field and flags
  any pair sharing four or more uncommon words. It reports nothing. That is the
  check worth repeating if these are ever revised
- The `[DRAFT — please review]` tag comes off each block as it is rewritten.
  Fifteen still carry it — the Megas, the Hisuian forms and the Ogerpon masks,
  which were already written to the current standard in an earlier pass and are
  indistinguishable in quality from the rewritten ones. Whether the tag means
  "thin first draft" or "the curator has not read this yet" decides whether
  those fifteen should keep it, and that is the curator's call

---

## Planned

### Habitat pages — an exhibition wing
Each habitat category gets its own page with an illustration of the habitat
and the specimens that live in it, so the collection reads like a museum's
habitat dioramas rather than only a filter value. Illustrations to come from
the curator; the data side already exists — every specimen carries a habitat,
the 19 categories are defined in `habitatMap.js` with real ecological
descriptions, and the gallery already filters by them, so the page mostly
needs somewhere to put the art and a roster query per category. Worth doing
after the illustrations land rather than building an empty frame first.

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

- ~~Most field notes are still tagged `[DRAFT — please review]`~~ — all 147
  rewritten in section 55, tag removed as each was done. Fifteen blocks still
  carry it, and section 55 explains why that is a decision rather than an
  oversight
- ~~Color contrast still hasn't been specifically audited~~ — audited and
  fixed; see MILESTONE §9 (mobile layout got its first pass in section 17)
- Field notes for `arceus-grass` and `silvally-grass` are written but
  have no specimen to attach to — neither appears in the Grass roster
  PokéAPI returns
- Worth considering: a `.gitattributes` with `*.txt text eol=lf` so the
  content files stay LF regardless of editor. The parsers now normalize
  line endings themselves, so this is belt-and-braces rather than a fix
- No automated tests. Sections 18 and 19 were both caught by manual
  spot-checking, and section 18 in particular had been failing silently
  in production — a couple of parser tests against a CRLF fixture would
  have caught it immediately
