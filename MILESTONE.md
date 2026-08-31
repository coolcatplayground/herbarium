# CC Herbarium — Milestone

A complete picture of the project as it stands: what it is, how it is built, the
conventions it runs on, and the reasoning behind the decisions that would
otherwise be invisible in the code.

`DEVLOG.md` records *what happened, in order*. This file records *what is true
now, and why* — read this to understand the project; read the devlog to
understand how it got here.

---

## 1. What it is

A field-guide-style catalogue of every Grass-type Pokémon, framed as a botanical
herbarium. Each specimen is annotated with the real plant biology or genetics its
design echoes. Around that sit an identification key, illustrated habitat rooms,
and case files pairing specimens with published open-access research.

Non-commercial fan work. Data comes live from PokéAPI; the writing is original.

**Stack:** React 19 + Vite, React Router (`HashRouter`, so GitHub Pages needs no
rewrite rules), plain CSS with a token file, `oxlint`, Vitest. No backend, no
state library, no CSS framework.

---

## 2. Current state

| | |
|---|---|
| Specimens in the gallery | **145** |
| Field notes written | **148 blocks** — every specimen has its own, none inherited |
| Field notes at standard | **147 of 147** — all rewritten, averaging ~594 chars against the old ~240 |
| Habitat placards (`habitat_note`) | **145 — every specimen** |
| Pokédex records (`record`) | **145 — every specimen** |
| Habitat categories | 18 |
| Habitat rooms illustrated | **18 of 18** — the wing is fully illustrated |
| Painted room backdrops | **7 of 7 pages** — Gallery, specimen sheet, Reading Room, Exhibition Hall, Propagation Bench, Grafting Bench, Curator'''s Note |
| Reading Room papers | 16 |
| Grafting Bench case files | 3 |
| Propagation Bench concepts | 3 |
| Bundle | ~423 KB JS (133 KB gzip), 23 KB CSS |
| Gallery image weight | **2.4 MB across 151 specimens** — 18.7 MB before thumbnails |

### Routes

| Path | Page | Purpose |
|---|---|---|
| `/` | Herbarium.jsx | **The Gallery** — all 145 specimens as glass cases |
| `/specimen/:name` | Specimen.jsx | **Specimen face** — one species' full sheet |
| `/key` | DeterminationKey.jsx | Stepped identification key |
| `/exhibition` | ExhibitionHall.jsx | Index of habitat rooms |
| `/habitat/:slug` | HabitatExhibition.jsx | One habitat room |
| `/grafting-bench` | GraftingBench.jsx | Three research case files |
| `/manuscripts` | Manuscripts.jsx | Reading Room |
| `/future-species` | FutureSpecies.jsx | Propagation Bench |
| `/about` | About.jsx | **Curator’s Note** — the collection, and the curator |
| `/write` | WriteToCurator.jsx | **The mail desk** — compose a letter to the curator on one of six sheets |

**Vocabulary** (settled deliberately, used consistently in code and copy):
the **gallery** is the all-panels page; a **specimen face** is one species' page;
the **exhibition hall** indexes **habitat rooms**. A **Field Note** is the
botanical reading on one specimen and nothing else — the about page is the
**Curator’s Note**, renamed in §53 because the nav had the term meaning two
things at once.

---

## 3. Architecture

```
src/
  api/pokeapi.js        All PokéAPI access, caching, and derived data
  data/                 Content loaders + the habitat/size/season/case maps
  components/           Presentational pieces
  pages/                One per route
  styles/tokens.css     Design tokens + the few real CSS classes
  data/*.test.js        Vitest suites — see §8a
scripts/refresh-roster.mjs  Regenerates the roster fixture the tests use
public/*.txt            Hand-editable content — the project's core decision
public/habitats/*.jpg   Habitat illustrations (web copies)
public/glass-panel.png  The specimen case photograph
public/sprites/         Fetched at build time, gitignored — see §3a
scripts/fetch-sprites.mjs   Downloads them
```

### 3a. Sprites are served from our own origin

`spriteUrl(id, shiny)` and `seasonSpriteUrl` both return **local** paths under
`public/sprites/`. Nothing hotlinks `raw.githubusercontent.com` at runtime: it
is a source-code host, it rate-limits, and a public gallery pulling ~145 images
per pageview from it would blank every glass case under real traffic.

`npm run build` chains `npm run sprites`, so CI needs no extra step. The output
is **gitignored** — 317 files, 40 MB, reproducible in about ninety seconds.

`onSpriteError` falls back to the upstream copy if a local file is missing, so a
fresh clone works before `npm run sprites` has been run. It marks the element so
it cannot loop. Verified by deleting a sprite and watching the fallback load.

### The content system

The founding architectural choice: **written content lives in plain text files
under `public/`, not in code.** They can be edited in Notepad with no build step.
Each file documents its own format in its header.

| File | Holds |
|---|---|
| `field-notes.txt` | Per-specimen writing — the main body of the project |
| `manuscripts.txt` | Reading Room papers and their connection write-ups |
| `habitat-overrides.txt` | Manual habitat corrections |
| `future-species.txt` | Propagation Bench entries |

All four parse with the same shape: `### <name>` … fields … `### END`.

**Every parser normalises `\r\n?` → `\n` before matching. This is not optional.**
See §6.1.

### `field-notes.txt` block schema

```
### bulbasaur   [DRAFT — please review]
binomial:         invented scientific name
plant_analogue:   the real plant or group it echoes
genetic_concept:  short tag naming the biology
note:             the botanical reading — what this specimen is like
habitat_note:     optional — why it's filed under its habitat
record:           optional — the Pokédex record, consolidated and weighed
### END
```

### Inheritance rule (important, and non-obvious)

PokéAPI lists alternate forms under suffixed names (`venusaur-mega`,
`exeggutor-alola`). `specimenNote.js` walks a name back one hyphen at a time to
find a base species' block. What inherits is deliberately split:

- **Species-level → inherits:** `note`, `record`, `binomial`, `plant_analogue`.
  The games file a form's Pokédex entries under its species anyway.
- **Form-level → never inherits:** `habitat_note`. Habitat is read off the
  *form's* typing, and forms routinely sit elsewhere than their base — Sceptile
  is mono-Grass and mesophytic while Sceptile-Mega is Grass/Dragon and files
  under Ancient & Long-Lived. Inheriting would describe the wrong habitat.

Species whose real names contain a hyphen (`wo-chien`, `iron-leaves`,
`brute-bonnet`) are safe: the walk only succeeds if a block is actually keyed
under the shortened name, and none is.

As of now the fallback is **dormant** — all 145 specimens have their own `note`.

That has a consequence for `record` that is easy to miss: inheritance only runs
when a form has *no* note of its own, so a form that has one — every form in
this collection does — never reaches the inheriting branch and will show an
empty Collected Observations unless its record is written into its own block.
Zarude-Dada is the live case; it carries the same record as Zarude, written out
rather than inherited.

### Roster shaping (`fetchGrassRoster`)

Two filters, both deliberate:
- `COSMETIC_FORM_PATTERNS` drops Gigantamax, Totem and costume forms — reskins
  that would duplicate an existing specimen.
- `HIDDEN_SIZE_FORMS` (from `data/sizeForms.js`) folds the Pumpkaboo and
  Gourgeist size classes into their canonical entry, so one organism occupies
  one gallery panel. The other sizes are selectable on the specimen face, and
  their old URLs redirect there.

### Seasonal forms (`data/seasonForms.js`) — near-neighbour to sizeForms, different data

Deerling and Sawsbuck get a four-season selector on their faces. It looks like the
Pumpkaboo/Gourgeist size selector and is not built the same way, because PokéAPI
models the two things differently:

| | Pumpkaboo size | Deerling season |
|---|---|---|
| PokéAPI object | its own `pokemon` entry, own id | a `pokemon-form` only; the species has one variety |
| In the grass roster? | yes — so it must be hidden and redirected | no — nothing to hide, nothing to redirect |
| Differs by | height, mass, some stats | appearance alone |
| Official artwork | for every size | for spring only |

So there is no `HIDDEN_SEASON_FORMS`, no second fetch and no `Navigate`, and the
selection changes nothing on the sheet except the specimen standing in the case.

That last row settles the sprite source. A selector built on official artwork
would offer one painting and three pixel sprites, so these two faces use PokéAPI's
**HOME** set for all four seasons — including spring, which does have artwork —
because the point of the control is comparison, and comparison needs one style.
Shiny composes with it (`home/shiny/586-winter.png`).

### Habitat system

`habitatMap.js` keys 18 categories by **secondary type** (`dragon`, `dark`,
`none`, …). Each has `name`, `description`, and optionally `image`.

- Slugs derive from the **name**, not the key — `/habitat/ancient-and-long-lived-flora`,
  because `/habitat/none` would be meaningless.
- Membership matches on the habitat **name**, not the type — which is what puts
  Cacnea in Nocturnal-Function despite her having no secondary type at all.
- `habitat-overrides.txt` can override any specimen's habitat by hand; those
  show a `(manual)` marker.

Habitat writing is **two-level**: the category description is written from the
actual roster filed under it, and each specimen's `habitat_note` says what *it*
contributes. See §5.

---

## 4. Page anatomy — the specimen face

Left column (`.specimen-split`, collapses at 760px):
1. Catalogue number + curation status
2. **Glass case** — the sprite composited into a photographic vitrine
3. Shiny toggle; size selector for Pumpkaboo/Gourgeist, season selector for Deerling/Sawsbuck
4. Type badges, height, mass, genus
5. **Line of Descent** — vertical lineage

Right column:
1. Genetic concept, name, binomial, flavour text
2. **Field Note** — the botanical reading
3. **Collected Observations** — the Pokédex record + Citations
4. **Likely Habitat** + *Why It's Filed Here* + link to the room
5. **Case Study** link where one exists
6. Measurements (stat bars)

### The glass case (`SpecimenCase.jsx`)

Geometry was **measured off the photograph**, not eyeballed — canvas profiling
found the black base band (rows 852–1007), the nameplate (x 488–961, y 877–973,
centred at 50.03% of width) and the glass walls (x 173–1277). Stored as
percentages so it scales.

The PNG has **no alpha channel**, so the sprite can't sit behind the glass and
the near-white surround would read as a pale box on the warm paper. It's
composited with `mix-blend-mode: multiply`.

The nameplate engraving is solved from the plate's real geometry (~78×16 px on a
card) — length-scaled, wrapping to two lines past ~17 characters, using the
*longest line of the best two-line split* rather than assuming even division.

### Line of Descent (`GrowthLineage.jsx`)

Replaced two sections that showed the same chain twice. Shows the specimen's own
line — root → specimen → end of its branch — vertically.

- Branches not taken are **named, not drawn**, and filtered to specimens the
  collection actually holds. Leafeon went from eight Eeveelutions needing ~480px
  to `Eevee → Leafeon` in a 340px column.
- A non-roster **ancestor** stays but renders dimmed and unlinked (Eevee is real
  ancestry); a non-roster **sibling** is dropped entirely.
- Megas and regional forms surface here as chips, because they hang off the
  *species* (`varieties`) rather than the evolution chain and would otherwise
  never appear in a lineage at all.

### Collected Observations

The Pokédex record consolidated in the curator's words and weighed against real
research — kept separate from the field note, the way a herbarium sheet separates
collection data from determination.

**Citations** are manuscript-style, generated from live data so they can't drift:

> *Pokémon Sword & Shield* (2019). Pokédex entry.

- Releases are grouped as **publications, not versions** — Sword and Shield cite
  once. Grouping is explicit rather than derived from the year, because year
  alone gets 2022 wrong (Legends: Arceus and Scarlet & Violet share it).
- Years are **English** release dates, since the cited entries are English.
- Each citation **expands to its passage**. A release can print more than one —
  paired versions frequently disagree — so every passage shows with the versions
  carrying it, and the version label appears *only* when they differ.
- Over six citations the whole list folds behind a summary naming the span.

---

## 5. Habitat writing — the two-level method

Established with Ancient & Long-Lived and applied since. **Write the category
from the roster actually filed under it**, then give each specimen a placard on
what it contributes. The categories had originally been glosses on a type pairing
written before anyone knew who would end up in them.

Rooms completed (**18 of 18**, all of them illustrated):

- **Ancient & Long-Lived** (7) — two routes to age: lignin and structure, versus
  the orchard trick of keeping the *genotype* alive by grafting. Anchored on
  Pando and a 4,800-year bristlecone.
- **Bioelectric-Signaling** (3) — the flytrap holding a count between two
  touches; wound signalling at ~1 mm/s; floral charge a bumblebee can read. Says
  outright that this is the room whose exhibits fit their category least well.
- **Cliffside & Mineral-Poor Soil** (3) — on bare rock life doesn't *find* soil,
  it manufactures it. Closed by the fact that much limestone is crushed crinoid
  ossicles: the rock is made of what lived there first.
- **Cold-Adapted & Alpine** (3) — cold isn't the killer, ice *inside the cell*
  is; snow is insulation; treelines sit at ~6–7°C growing-season soil
  temperature, not winter minima.
- **Deadwood & Decomposer-Associated** (10) — a living tree is already mostly
  dead, and it walls decay off rather than healing it. The largest room so far,
  and the one with the most varied tissue: wood, fruit, leaf litter, drifting
  kelp, dry brush and two teas, which is why it runs on *decay has no single
  clock* rather than on rot as one process. Closes on arid ground, where
  decomposers stall and fire does their work instead.
- **Deep-Rooted & Soil-Anchored** (3) — the category name is the misconception
  the room has to correct: roots spread rather than plunge, and the exploring is
  done by fungi. The partnership predates roots themselves (Rhynie chert,
  ~400 Ma). Two of the three specimens are fungi, which the room says out loud —
  and notes it isn't an error in a herbarium, since fungi sat inside the plant
  kingdom until 1969.
- **Generalist** (5) — the phenology room. A Normal secondary type makes the
  same non-claim mono-Grass does, so the room says that once and then reads what
  the exhibits share: a seasonal deer and an olive are both defined by a
  calendar. Every other room answers *where*; this one answers *when*. Carries
  the mechanism the specimens' own notes only gesture at — degree-days,
  night length and phytochrome, vernalization as a remembered winter.
- **Insect-Associated** (6) — the sharpest version of the roster problem: not
  one specimen is a plant. They are insects using plant tissue, plus a fungus
  using an insect. The room says so and then supplies the missing half — a
  chewed leaf changes its chemistry and calls in parasitoid wasps; some plants
  build domatia and hollow thorns to house their own bodyguards. Galls, frass
  and the yucca contract are split across the placards.
- **Mesophytic & Unspecialized** (46) — the largest room and the only one whose
  honest content is an admission: a mono-Grass typing makes no claim, so the
  roster is whatever failed to be sorted. Leads on that, then defends the real
  subject — the middle of the water gradient is a design with commitments — and
  closes on the leaf economics spectrum as the one axis that organises it.
  Every placard says what its specimen actually is, since the category didn't,
  and every record lets the dex entry pick the subject.
- **Mineral-Accumulating** (3) — carried by the ground rather than the exhibits:
  serpentine soil, the 1,000 µg/g nickel threshold, ~700 hyperaccumulator
  species, and *Pycnandra acuminata* bleeding latex a quarter nickel by weight.
  Closes on the correction the specimens require — real accumulation puts the
  metal *inside* the leaf, invisibly, so you identify one by burning it.
- **Nocturnal-Function** (9) — three groups, not one: two real desert CAM
  plants, two whose darkness is shade rather than night, and the rest filed here
  for temperament. Goes past CAM (already set out in Maractus's record) to its
  cost, CAM idling and facultative switching, then moth and bat flowers, de
  Mairan's 1729 mimosa, and the overnight starch arithmetic. Zarude and Wo-Chien
  are written as a pair: darkness manufactured from the canopy and from the
  floor.
- **Ornamental & Pollinator** (6) — two cottons and two luminous fungi, so the
  room is about advertising rather than ornament: the nectar budget, ultraviolet
  nectar guides we cannot read, the third of orchids that pay nothing, and the
  plants that closed the account and went to wind.
- **Pioneer & Fast-Colonizing** (6) — five fighters and one coloniser. Takes
  *pioneer* at its technical value and runs on why light competition is
  asymmetric — the taller plant takes all of it — and on succession as a
  sequence of evictions the previous tenant made possible.
- **Psychoactive & Sensory-Signaling** (5) — keeps the original concession that
  two unlike threads share the type, and adds the part neither had: plant
  toxins fit our receptors because those receptors are ancient, and a plant's
  real senses include reading its own orientation off settling starch grains.
  The room where the contested claims are labelled as contested.
- **Pyrophyte / Fire-Adapted** (3) — two of the three are chillies, whose fire
  is a receptor trick covered on Capsakid's record, so the room names the pun
  and gives each placard one fire strategy: resist, resprout, recruit.
- **Toxic & Chemically-Defended** (16) — the one room where category and roster
  agree completely. Answers the question every scattered toxin placard leaves
  hanging: a plant carries two harmless halves in separate compartments and
  manufactures the poison in the mouth of whatever bites it.
- **Wetland & Aquatic** (4) — inverts its own premise. Water is the hard option:
  oxygen diffuses through it thousands of times slower than through air, and
  everything here descends from ancestors that had already escaped it.
- **Wind-Dispersed & Aerial** (7) — at seed scale air is thick, so the problem
  is not lift but falling slowly. Plumes, autorotating samaras and dust seeds,
  all paid for out of the seedling's provisions.

### Illustrations

Drop `habitat-<key>.png` in the repo root (gitignored via `habitat-*.png`) and
re-encode it into `public/habitats/<key>.jpg`, then wire it with `image:` in
`habitatMap.js`. All eighteen rooms now carry art, so the hall's
illustrated-first sort no longer separates anything and it reads alphabetically.
The sort and the "illustration in preparation" placeholder both stay: a new
room added later would need them, and they cost nothing while unused.

**There is no ImageMagick or ffmpeg on this machine, and the `convert` on PATH
is Windows' filesystem utility, not IM.** Encoding runs through System.Drawing
from PowerShell, which keeps the project dependency-free — load, scale to a
1600px long edge, then step JPEG quality down until the file lands under 460 KB.
The eight in place sit at 377–452 KB.

**Motif discipline matters** across 18 rooms: the first piece carried a waterfall
and mountains that belong to Wetland & Aquatic and Cliffside/Alpine, and lacked
the orchard that five of its seven specimens are built on.

---

## 5a. The painted rooms

Seven rooms are painted, one per page, plus the exhibition hall standing in
behind every habitat room. They render **as painted** — no scrim, no wash, no
mask. Getting there settled several things worth not relitigating.

**The room is never dimmed to protect text. The text is mounted instead.**
A scrim was tried first and removed. Every block that would otherwise sit on a
painted wall now sits on a surface of its own: `.placard` for a page intro or a
heading block, `.placard--quiet` for a short secondary note, `.room-tag` for a
lone link or counter, `.plate-frame` for everything that already had one. If
something new ends up printed on the wall, mount that block — do not put the
scrim back.

**The check is a sweep, not a spot-check.** Walk every text-bearing leaf, climb
its ancestors, and ask whether anything gives it an opaque ground. Doing this
found four blocks nobody had reported on the first pass and six more when the
hall went behind the habitat rooms. An early version of the sweep only counted
`.placard`/`.plate-frame` as grounds and reported a dozen false positives on the
Propagation Bench, whose projector is lit by gradients — accept any background
image except `.room` itself.

**Placards are frosted, not clear.** Plain translucency was measured and
rejected: the hall's shelving came through sharp and cost 0.5 of contrast.
Blurring the backdrop means text is read against the room's local average
rather than its darkest pixel, which is a far cheaper way to let the room
through. The whole effect is gated on `@supports (backdrop-filter)`, because
without the blur it degrades into exactly the version that failed.
`--placard-frost` is the single dial; 0.86 is roughly the floor before
`--ink-soft` slips under AA.

**Cards separate from scenery with a ring, not a border.** A border is painted
*inside* the element over its own near-white face, so at any subtle alpha it
darkens nothing. The ring is the first `box-shadow` layer, painted outside over
the scenery. The two cues cover each other: against dark scenery the bright
card face separates it and the ring vanishes; against pale scenery the ring
draws the edge and the face vanishes. Measured on the hall, whose worst point
had fallen to 1.24:1 — now 1.85:1 with nothing below 1.35.

**Presence is mostly size.** The hall's rooms are two to a row at ~549px rather
than four at ~280px. Fewer, larger cards with air around them separate on their
own terms rather than needing the painting turned down. Their illustration is a
16:9 crop rather than a fixed pixel height, so it scales with whatever width
the grid gives it.

**Two ideas were built and dropped**, recorded so they are not tried again as
if new. A hotspot map over the hall failed twice over: only eleven of the
eighteen habitats are actually painted in it, and at 375px the pins came out
21px across with 8px between the closest pair. A full-height hero on the
Exhibition Hall was dropped for consistency — one page arriving differently
from the others reads as an inconsistency rather than as emphasis.

**`See the room`** clears the page and leaves the painting. The control is
portalled to `<body>` so that hiding the page cannot hide the thing that brings
it back, and Escape exits.

## 5b. Source art and its encoders

Originals stay on the machine that drew them; `public/` holds the web copies.
Four encoders in `scripts/`, each with a different budget for a stated reason:

| | cap | budget | why |
|---|---|---|---|
| `encode-habitat.ps1` | 1600px | 460 KB | a card illustration read at a glance |
| `encode-concept.ps1` | 1500px | 620 KB, q≥82 | a sheet someone *reads*; small type goes mushy first |
| `encode-room.ps1` | 1600px | 300 KB | loads on an ordinary page view, seen through nothing |
| `encode-portrait.ps1` | 720px | 160 KB, q≥80 | one face in a 230px column, on one page |

`.gitignore` covers them by **glob** (`*-room.png`, `*-hall.png`, `*-bench.png`,
`habitat-*.png`, `*-concept.png`, `*-curator.png`), not by filename. A filename list was tried
and lagged behind new art twice, and both times the next `git add -A` committed
several megabytes of PNGs. Also: gitignore has no trailing comments — a `#`
after a pattern becomes part of the pattern and silently stops it matching.

## 5c. Field notes — the no-repeat rule, and how it is enforced

Every `note` holds one real, specific thing about its specimen that the
specimen's own `habitat_note` and `record` do not already say. All 147 were
rewritten against that brief; the old ones averaged about 240 characters of
textbook definition and now average 594.

**The constraint is not per-block, it is file-wide.** A note also must not
repeat a fact printed on any *other* specimen's placard or record — and that is
the part reading cannot catch, because the collision is usually four rooms away.
Ten turned up during the rewrite:

| | |
|---|---|
| grass meristem | Rotom-Mow vs Gogoat |
| thigmomorphogenesis | Shiftry vs Quilladin |
| the saguaro's nurse | Torterra vs Skiddo |
| ripening enzymes | Tsareena vs Gourgeist |
| silica in grasses | Ferrothorn vs Kartana |
| grazing optimisation | Virizion vs Swadloon |
| hygroscopic pappus | Jumpluff vs Cottonee |
| pitcher tree shrews | Weepinbell vs Carnivine |
| the pappus vortex ring | Hoppip vs Gossifleur |
| photoinhibition | Simisage vs Serperior |

Six of those were written, applied, and then unpicked. The remaining four cost
nothing, because by then the search was being run *before* drafting:

```bash
npm run fact -- saguaro "grazing optimisation" thigmomorph
```

`scripts/find-fact.mjs` searches every field of every block and prints the
surrounding text of each hit. There is also a coarser sweep worth re-running
after any batch of edits: pair every note against every other field and flag
any pair sharing four or more uncommon words. It reports nothing at present,
and it is what caught the last three.

**What this does not check** is whether a fact is *true*. Nothing here does.
Every claim in these notes is a reading job, as §8a says of the citations.

## 5d. The mail desk

`/write`. Choose one of six sheets of stationery, write on it, seal it, look at
the letter, and hand it over. The Curator's Note button goes here instead of
straight to a `mailto:`, which is a better invitation and also works for the
large share of visitors who have no mail client wired to their browser at all —
for them the old link did nothing visible whatsoever.

**The papers are the real stationery.** Six of the twelve Generation IV mail
designs, used as the sheet itself: Grass, Air, Bloom, Bubble, Snow and Flame.
Generation IV specifically, because that whole set is 256×192 while Generation
III's is 240×160, and a chooser holding two aspect ratios reads as a bug. Each
of the six maps to a room the collection has.

Two assets per paper, from two sources, which is why the README now states
provenance: the 256×192 canvas comes from the Bulbagarden archives and is
committed (`public/mail/`), while the 24×24 bag icon comes from PokéAPI's
sprite repository like all the other artwork and is fetched at build. The
fetcher reads its download list off `MAIL_PAPERS` so the two cannot drift.
The canvases draw at exactly 2× with `image-rendering: pixelated`.

**The letter is not written on the art.** Measured across the twelve designs,
body ink clears AA unaided on three of them; `steel`, `space`, `brick` and
`heart` are hopeless at any ink. So the writing sits on a mounted panel over
the canvas — which is this site's existing rule rather than an exception to it:
never dim the room, mount the text.

Each paper carries the rect its own artwork reserves for writing, and a `veil`
measured against the pixels *inside that rect*: Air needs nothing (6.9:1 on the
white panel it draws), Snow and Grass almost nothing, Flame a third because its
zigzags intrude. Bloom and Bubble draw no writing area at all, and there the
measurement was overruled by looking — a light wash cleared AA but rendered as
a sticker stuck on the art, where an opaque card reads as a label laid on it.
Those two use a card.

**On a phone the art's panel is too small to write in** — at 375px Grass Mail
leaves a textarea of 181×42, which is one and a half lines. Below 640px every
paper therefore abandons its drawn panel for a large opaque card inside the
frame: the art still frames the letter and still says which mail it is, it just
stops being written on. Opaque also puts the per-paper veils out of play, which
is what makes that safe.

**The letter the curator receives is the deliverable**, not a form dump. It is
drawn in text: the paper's dingbat and name, the message wrapped to 36 columns,
a rule, and the signature. Two decisions in it are not obvious.

- **It has a left edge and no right one.** A full box needs every line padded to
  an identical width, which only holds if the reader's client renders plain text
  monospaced — and Gmail does not. The rules run left to right and nothing has to
  meet a margin that may not exist.
- **The dingbats are Unicode, not emoji.** Emoji arrive as colour images in some
  clients and as tofu in others; `✿ ❦ ❧ ✤ ✽ ❈` degrade to an ordinary glyph.

**Why the clipboard is not the small print.** A `mailto:` URL has to survive
being handed to the OS, so the ceiling is about 2000 characters percent-encoded.
Measured: a 500-character letter in Latin text encodes to ~1780 and fits. The
same 500 characters in **Thai encode to 5560**, because every character costs
nine. No message limit can both guarantee the hand-off and be usable for writing
a correction in a non-Latin script, so `mailtoHref` returns `null` when it will
not fit, the mail-app button says so plainly, and copying is offered with equal
weight. The plain-text letter unfolds itself when the clipboard is refused,
because at that moment it is the only way out.

Contrast measured on all six papers against each tint's darkest gradient stop:
ink runs 6.69–7.32:1, and two accents were deepened to clear AA for the 13px
paper name — Bloom from `#a8506c` (4.33:1, failing) and Orchard from `#8a6418`
(4.60:1, thin).

Logic lives in `src/data/curatorMail.js` and is covered by 22 tests, because the
letter is the one part nobody can inspect after the fact — by the time it is
wrong it is already in somebody's inbox.

## 6. Bugs found and fixed — the ones worth remembering

### 6.0 The mail artwork was invisible in production and perfect in dev

Every sheet at `/write` rendered blank on the deployed site while working in
`npm run dev`, and every local check passed — computed styles, contrast,
geometry, the lot.

The artwork was a CSS background whose URL arrived through a custom property:
`--sheet-canvas: url(./mail/grass-mail.png)`, set inline on the sheet, consumed
by `background-image: var(--sheet-canvas)` in the stylesheet.

**A relative `url()` in CSS resolves against the stylesheet, not the document**,
and `var()` substitution happens where the property is *used*. In dev, Vite
injects styles into the document, so it resolved to `/mail/…` and worked. In a
build the stylesheet is `/assets/index-*.css`, so the identical declaration
resolved to `/assets/mail/…` — a directory that does not exist — and 404'd on
all six papers.

The paper swatches were correct the whole time, which is the tell: they use
`<img src>`, an HTML attribute, resolved against the document. The fix is to
draw the artwork the same way, as a real element rather than a backdrop.

Two things worth carrying forward:

- **Per-paper assets must be elements, not `url()` through a custom property.**
  There is a comment saying so at `.mail-sheet__art`.
- **Dev is not production for asset URLs.** Nothing measurable in the dev server
  would have caught this; `npx vite build && npx vite preview` would have caught
  it in seconds, because the built stylesheet lives under `/assets/` even when
  served from the root.

It surfaced because the curator asked whether the mail background was
transparent. It was not — the artwork is opaque RGB with no alpha — but the
sheet was showing a fallback ground added one commit earlier, which is the only
reason the failure looked like transparency rather than a blank card.


### 6.1 The whole content system was silently broken

**Every plain-text file was parsing to zero entries.** The field regex ends
`(.*)$`, and in JavaScript `.` does not match `\r` — it is a line terminator. All
five files are CRLF, so `(.*)` stopped short and `$` never matched. Every field
line of every block failed.

The files are meant to be edited in Notepad, and **Notepad writes CRLF** — the
intended authoring workflow produced exactly the files the parser couldn't read.
The forgiving parser design turned total failure into silence.

Recovery after normalising: field notes 0 → 132, manuscripts 1 → 14, propagation
0 → 2, habitat overrides 0 → 2. The Reading Room had been empty; every case-file
citation sat on "Loading citation…" forever.

**Rule:** any new parser must normalise `\r\n?` → `\n` before matching.

### 6.2 `??` swallowed a meaningful `null`

47 of 151 gallery cards showed no habitat — every mono-Grass specimen.
`typesMap[r.name] ?? undefined` was commented "undefined = not fetched yet", but
`fetchRosterTypes` returns `null` for pure Grass, which is a *real answer*, and
`??` treats null as nullish. Now keyed on `r.name in typesMap`.

### 6.3 Species names vs variety names

The collection check compared a chain node's **species** name against the roster,
which holds **variety** names. They usually match — and don't for exactly the
species whose default variety is suffixed: Pumpkaboo is held as
`pumpkaboo-average`, Wormadam as `wormadam-plant`, Shaymin as `shaymin-land`. All
were labelled "not a Grass-type" while sitting in the collection. Species are now
resolved through their varieties.

The same mismatch had a second face: those four are their species' *default*
form, so "written for the species, not this form" was false for them too.

### 6.4 A 0×0 lazy image never loads

Dropping a sprite's explicit `width`/`height` for `max-width`/`max-height` left
unloaded images measuring 0×0 — and a 0×0 `loading="lazy"` image never intersects
the viewport, so it never loads at all.

### 6.5 Flattened chains lied about branching families

Leafeon's old Growth Record read *Eevee | Germination | Vaporeon | Vegetative
growth | Jolteon | …* — presenting parallel branches as a sequence of growth
stages, and handing the same stage label to three siblings.

### 6.6 Alternate forms never highlighted

Both old lineage components matched the current node by *roster* name, but chain
nodes are keyed by **species** — `venusaur-mega` is species `venusaur`, so it
never matched. Every Mega and regional variant rendered with nothing highlighted.

### 6.7 An empty pool is not a determination

The Determination Key treated `pool.length <= 1` as "determined" then rendered
`finalPool[0].name` — an **empty** pool took the page down to a blank screen.
Split into a distinct `none` state.

---

## 7. Conventions worth keeping

**Voice.** Copy reads as the curator talking to a visitor, not as a build log.
Caveats stay — they are core — but phrased as what the exhibit can and can't
show, never as commentary on what got built or skipped. Watch for: "this
version", "built for a portfolio", "contributions welcome", counts used as
openers ("Twenty distinct entries across…").

**Say it once.** A caveat repeated on 145 pages reads as a disclaimer; said once
in the gallery intro it reads as curation. This is why the per-specimen "read off
the secondary type…" line was removed.

**Don't narrate what's visible.** "Read from" above two type badges, "only"
beside a lone badge, and "each opens to the passage cited" beside a disclosure
triangle were all cut for this reason. Where the meaning still matters for
assistive tech it moved to `aria-label`.

**Honesty is the house style, and it is load-bearing.** Rooms admit when their
specimens fit badly; the Determination Key states that it keys on classification
rather than morphology; Rotom-Mow stays on display as the point where the
heuristic stops describing anything real.

**Measure before claiming.** Prose written before measuring claimed the drought
sim ruptured "around day five" and that the elastic build survives sixty days;
neither was true. Every number in the case text now matches the running model.

**Design tokens over inline styles for anything responsive.** An inline
`gridTemplateColumns` cannot carry a media query — that was the actual reason the
consoles broke on a phone. `.console-split--figure-left/right`, `.console-pair`
and `.specimen-split` live in `tokens.css` and collapse at 760px.

---

## 8. Verification practice

Established through this work and worth continuing:

- **Sweep, don't spot-check.** The "not a Grass-type" fix was verified across all
  145 specimens, which is how we know only `burmy` and `eevee` remain (both
  correctly).
- **Measure layout in the browser**, not by eye: `scrollWidth > clientWidth` at
  375px across every route caught the nav overflowing *every* page.
- **Test the model, not the prose.** Running all nine build × schedule
  combinations of the drought sim revealed that no build survived and that
  obligate CAM strictly dominated — neither visible from reading the code.
- **Read a room's roster off the running page before writing it.** The Deadwood
  room was drafted for seven specimens and actually holds ten — Decidueye,
  Bramblin and Brambleghast are all Grass/Ghost and none of them were on the
  list assembled from memory. The habitat page prints its own membership, so
  loading it first is the cheap check, and the miss matters: a category written
  from the roster is only honest if the roster is the real one.
- **Stale HMR is a recurring false alarm.** The dev console buffer is cumulative;
  errors naming symbols that no longer exist are almost always mid-edit
  artifacts. A passing `npm run build` is the definitive check.
- **Lazy images don't load in a hidden browser pane** — nothing composites, so
  nothing intersects the viewport. Forcing `loading="eager"` on one element
  distinguishes this from a real failure.

---

## 8a. Tests

`npm test` (Vitest, ~0.5s). Three files, aimed at the failures this project has
actually had rather than at coverage.

| File | Guards |
|---|---|
| `src/data/fieldNotesLoader.test.js` | §6.1 forever — the same block parsed as LF, CRLF and lone CR must come out identical. Plus block shape: TEMPLATE skipped, habitat-note-only blocks kept, wrapped fields rejoined, `### END` respected |
| `src/data/specimenNote.test.js` | The inheritance rules: habitat notes are form-level and never borrowed, notes and records are species-level and are. Includes the §50 trap — a form with its own note never inherits, so its record must be written out |
| `src/data/content.test.js` | The real `public/field-notes.txt`. Every one of the 145 roster specimens must resolve with a note, a placard and a record; no mistyped field names; citations well-formed and in range |

The roster is a committed snapshot (`src/data/__fixtures__/roster.json`);
regenerate with `npm run roster:refresh` if PokéAPI gains new Grass-types.

**Known parser footgun the tests document rather than fix:** an unrecognised
`field:` line cannot be distinguished from a wrapped continuation line, so a
mistyped `habitat_not:` is silently absorbed into the field above it and the
placard never appears. `content.test.js` scans the real file for any prefix
outside the known six.

**What the tests do not cover.** Nothing here checks whether the writing is
good, whether a placard repeats another, or whether a citation is attributed to
the right game — both miscitations caught during this work (Phantump, Sawsbuck)
would pass. Citation checking is shape and year-range only. That remains a
reading job.

**Verified by mutation, not by going green:** removing the CRLF normalisation
from the loader turns the suite red across three files, including the assertion
that the content file parses to more than a hundred blocks, which is the exact
silent failure of §6.1.

---

## 9. Outstanding

**Content**
- **The habitat wing is finished.** All 18 rooms carry a written description,
  and all 145 specimens carry a note, a placard and a record. Verified by
  running the live roster through `getSpecimenNote` rather than through the
  parser, which is what caught the last 11 gaps
- ~~Most field notes still carry `[DRAFT — please review]`~~ — **done, all
  147 rewritten**, see §5c. Fifteen blocks still carry the tag: the Megas, the
  Hisuian forms and the Ogerpon masks, whose notes were already written to this
  standard in an earlier pass. Whether the tag means "thin first draft" or "the
  curator has not read this yet" decides whether those fifteen keep it, and
  that is the curator's call rather than a loose end
- `arceus-grass` and `silvally-grass` have written notes but aren't in the roster

**Known gaps**
- ~~No automated tests~~ — done, see §8a. The CRLF fixture test that would have
  caught §6.1 now exists and is mutation-verified.
- ~~Colour contrast never audited~~ — audited and fixed. Two tokens were failing
  WCAG AA on plain paper, site-wide, long before the room backdrops:
  `--ink-soft` at 3.99:1 where body text needs 4.5, and `--specimen-red` used
  as an eyebrow at 2.46:1 where its size needs 3. Both are deepened within their
  own hue — #8a7a68 to #726351, #d98ca3 to #b85f7b — and now measure 5.60:1 and
  4.09:1 on paper, 4.58:1 and 3.34:1 read through a frosted placard over the
  busiest room. `--ink` was always fine at 8.19:1. Nothing else has been
  measured; the tokens above are what body copy actually uses.
- ~~Consider `.gitattributes`~~ — added. Everything was already stored as LF in
  the index, so it caused no churn; it only fixes what future checkouts do.
- Roughly 23 MB of source PNGs sit in the history of the commits that predate
  the glob-based ignore rules. Harmless, and only worth rewriting if the repo
  size ever matters.
- ~~`greendesk.png` unreferenced~~ — removed in §54, along with `src/assets/`,
  `public/icons.svg`, `public/future-cultivars.txt` and the generated proof pages.

**Ideas parked**
- ~~Habitat rooms as full dioramas~~ — the exhibition hall painting is one, and
  now stands behind every habitat room
- The Cacnea drought model has no real trade-off: obligate CAM beats every
  alternative in every build, so the nine combinations collapse to one right
  answer. Giving the season weather — dry, erratic, wet — would make C3 win the
  wet year, obligate the drought, and facultative the erratic one, which is the
  actual reason facultative CAM exists. See §5a for the visual pass that was
  done instead; the balance was deliberately left alone
- Case File 01 (Roselia) is still the only slider console, with seven of them

---

## 10. Working notes for the next session

- Node is **portable**, at `%LOCALAPPDATA%\nodejs-portable\node-v22.23.2-win-x64`
  — not on PATH for fresh shells. `run-dev.bat` (gitignored) wraps it for the
  preview server.
- Content edits need a **hard reload with a cache-buster**; the loaders memoise a
  promise and the browser caches the `.txt`.
- Editing `public/*.txt` from a script: read, `replace(/\r\n?/g,'\n')`, edit,
  then write back with `replace(/\n/g,'\r\n')`. Verify `CR === LF` afterwards.
- New habitat art: drop `habitat-<key>.png` in the repo root, it gets optimised
  into `public/habitats/<key>.jpg` and wired via `image:` in `habitatMap.js`.
- Nothing in this work has been committed. The tree currently holds ~50 changed
  paths: 28 modified, 12 deleted, 10 new.
