# CC Herbarium — working notes

A field-guide catalogue of every Grass-type Pokémon, framed as a botanical
herbarium. Each specimen is annotated with the real plant biology its design
echoes. Non-commercial fan work; data live from PokéAPI, writing original.

**Read `MILESTONE.md` before doing anything substantial.** It records what is
true now and why — the decisions that are invisible in the code. `DEVLOG.md`
records what happened in order. This file is only the operating instructions.

---

## Setup on a new machine

```bash
npm ci
npm run sprites   # ~40 MB into public/sprites/, gitignored, takes ~90s
npm run dev
```

Node 20+ (CI uses 20, developed on 22). `npm run build` chains `npm run sprites`
automatically, so CI needs no extra step.

If sprites are missing the site still works — images fall back to the upstream
PokéAPI sprite URLs — so a fresh clone is never broken, just slower and
hotlinking.

Set a git identity if commits fail:

```bash
git config --local user.name "coolcatplayground"
git config --local user.email "chacuttayapongwiluk@gmail.com"
```

## Commands

| | |
|---|---|
| `npm run dev` | Vite dev server |
| `npm test` | Vitest, 475 tests, ~0.5s |
| `npm run build` | fetches sprites, then builds |
| `npm run lint` | oxlint |
| `npm run sprites` | refetch sprites (skips existing) |
| `npm run roster:refresh` | regenerate the test roster fixture after PokéAPI gains new Grass-types |
| `npm run artifact` | rebuild the phone triage page from the queue |
| `npm run fact -- <term>` | search every field of every block before writing a fact into a note |
| `npm run harvest` | search Europe PMC for candidate papers into `curation/queue.json` — free, no key |
| `npm run triage` | local page at :5100 to keep or discard what's queued |

Deploy is automatic: `.github/workflows/deploy.yml` fires on push to `main`.

## Acquisitions

Two commands, no account and no cost. `npm run harvest` searches Europe PMC
along sixteen themes — one per habitat room or case file — skips anything
already in `manuscripts.txt` or already discarded, and writes the rest with
abstracts to `curation/queue.json`. `npm run triage` serves those as cards on
127.0.0.1 with Keep and Discard buttons.

**Keep** appends the block to `public/manuscripts.txt` with `connection:` left
empty. Deliberate twice over: the file's own header reserves that field for the
curator's reading rather than a restatement of the abstract, and the loader
requires a non-empty `connection` — so a kept paper sits as a draft and does not
reach the Reading Room until it is written. **Discard** records the DOI in
`curation/seen.json` so it never comes back.

The queue persists between runs: fetching is quick, triage takes attention, and
the two need not happen in one sitting. It stops growing at 24 unreviewed —
there are far more matching papers than one run takes, so left alone it would
otherwise reach a hundred nobody will face.

`curation/QUEUE.md` is the same queue rendered for reading on GitHub from a
phone. Regenerated on every harvest and on every keep/discard, so it never goes
stale.

`.github/workflows/harvest.yml` runs the fetch weekly (Mondays 07:00 UTC) and
commits the queue. Fetch only — it never keeps or discards, since those need a
person. No API key: Europe PMC is free.

A paper's optional `summary` field is written by hand into `curation/queue.json`
and shown in place of the abstract, which stays one click away. Unattended
AI summaries would need a paid key; the weekly fetch deliberately does not.

Nothing in `curation/` or `scripts/triage-ui.mjs` is bundled, imported by
`src/`, or deployed. The triage server binds to 127.0.0.1 only.

Search window defaults to 120 days, which looks too wide and is not. Europe
PMC's open-access index runs about three months behind the wall clock, so a
window sized to the cadence returns nothing at all; `seen.json` and the queue
are what make results new, not the date range.

## The weekly routine (read this if the curator asks for "the desk")

The curator triages papers on a phone, and asks for it in plain words. Both
phrases below require a session **in this folder** — they touch local files, so
they cannot be done from a phone chat.

**"refresh the desk"** — regenerate the phone page from the current queue and
republish it to the SAME artifact:

```bash
npm run artifact
```

then publish `curation/acquisitions.html` with `capabilities: {artifact: {}}`,
passing the existing artifact URL as `url` so it updates in place rather than
creating a second one. Find the URL with the Artifact tool's `list` action — it
is titled **Acquisitions Desk**. Publishing without `url` from a fresh session
silently makes a duplicate, which is the failure to avoid here.

**"apply my decisions"** — read the published page (WebFetch its URL). Each card
carries `data-doi` and `data-decision` of `kept`, `discarded`, or empty, and the
decision also appears as visible stamp text so it survives plain-text reads.
Then, for each: kept → append its block via the harvester's `keepPaper`;
discarded → add its DOI to `curation/seen.json`. Remove both from
`curation/queue.json` and re-render. Leave undecided ones alone.

After applying, tell them which kept papers still need a `connection:` written —
that is the only step that is genuinely theirs, and nothing reaches the Reading
Room until it is done.

The page cannot refresh itself: artifact runtime capabilities are `artifact`,
`downloads`, `mcp` and `self`, none of which grant network access, and the CSP
blocks external hosts. The weekly workflow keeps the queue current; the page
only catches up when someone republishes it.

## Art and its encoders

Originals stay in the repo root and are gitignored; `public/` holds the web
copies. Drop the source in, run its encoder, then wire it:

```bash
powershell -ExecutionPolicy Bypass -File scripts\encode-habitat.ps1   # habitat-<key>.png  -> public/habitats/
powershell -ExecutionPolicy Bypass -File scripts\encode-concept.ps1   # <id>-concept.png   -> public/concepts/
powershell -ExecutionPolicy Bypass -File scripts\encode-room.ps1      # <page>.png         -> public/rooms/
powershell -ExecutionPolicy Bypass -File scripts\encode-portrait.ps1  # <name>-curator.png -> public/portraits/
```

Each has a different size budget for a stated reason — a habitat card is
glanced at, a concept sheet is read, a room loads on every page view, and a
portrait is never painted wider than 230px. They are separate scripts on
purpose; see the comments at the top of each.

**Name habitat art after the map key, not the type.** The mono-Grass room is
keyed `none`, so its art is `habitat-none.png`. The encoder aliases
`grass`→`none` because that is the natural mistake.

`encode-room.ps1` keeps an explicit list of page names, where being a whitelist
is the point. Add a room there when you paint one, then point a
`<RoomBackdrop image="rooms/<name>.jpg" />` at it from the page.

## The mail desk

`/write` — six sheets of stationery, a ruled writing area, and a letter drawn in
plain text for the curator to receive. Papers and letter-building live in
`src/data/curatorMail.js`.

The papers are **the real stationery**. Each is two assets keyed on the PokéAPI
item name: `public/mail/<id>.png` (the 256×192 canvas, committed, from the
Bulbagarden archives) and `public/sprites/<id>.png` (the 24×24 bag icon, fetched
by `fetch-sprites.mjs`, which reads its list off `MAIL_PAPERS`).

Adding a paper is one entry in that array — but three of its fields are
measurements, not preferences, and getting them by eye will ship unreadable mail:

- **`panel`** is the rect that artwork reserves for writing, as fractions of the
  card. Read it off the art.
- **`veil`** is the opacity that panel needs for body ink to clear AA, measured
  against the pixels *inside that rect*. Move `panel` and `veil` stops being
  true. Only three of the twelve Gen IV designs carry text unaided; four cannot
  carry it at any opacity.
- **`accent`** must clear 4.6:1 against `--paper-light`, the label chip it sits on.

Stay in **Generation IV** unless you are redoing all six: Gen III mail is
240×160 against Gen IV's 256×192, and mixed aspect ratios look broken. And
**render it before believing it** — the veil that measured fine on Bloom Mail
looked like a sticker, which is why that one uses an opaque card instead.

Nothing is sent from the page and nothing is collected. See MILESTONE §5d for
why the clipboard is offered with equal weight to the mail link, which is a
measurement about Thai text rather than a hedge.

## Rules that are easy to break

**A relative `url()` in CSS resolves against the stylesheet, not the page.** So
an asset path handed to CSS through a custom property — `--x: url(./mail/a.png)`
inline, `background-image: var(--x)` in the stylesheet — resolves correctly in
dev, where Vite injects styles into the document, and breaks in every build,
where the stylesheet sits under `/assets/`. Per-paper and per-specimen assets go
in as `<img src>`, which is resolved against the document. See MILESTONE §6.0;
this shipped, and every local check passed while it was broken.

**`npm run dev` is not production for asset paths.** If a change touches how an
asset URL is built, check it with `npx vite build && npx vite preview` before
believing it. The dev server resolves things the build does not.


**Never dim a room to make text readable — mount the text.** Every page stands
in a painted room at full strength. Anything that would otherwise sit on the
wall goes on a surface: `.placard` (a page intro or heading block),
`.placard--quiet` (a short secondary note), `.room-tag` (a lone link or
counter), `.plate-frame` (a content card). Adding a backdrop to a page means
sweeping it afterwards — walk every text leaf, climb its ancestors, and check
something gives it an opaque ground. That sweep has found blocks nobody
reported every single time it has been run.

**A border cannot separate a card from scenery.** It is painted inside the
element, over the card's own near-white face. The separating edge is the first
`box-shadow` layer, painted outside over the room. See MILESTONE §5a.

**Source art is gitignored by glob, never by filename.** A filename list lagged
behind new art twice and both times `git add -A` committed megabytes of PNGs.
And gitignore has no trailing comments — a `#` after a pattern becomes part of
the pattern and silently stops it matching.

**Every content parser must normalise `\r\n?` → `\n` before matching.** The
files are edited in Notepad, Notepad writes CRLF, and `.` does not match `\r` in
a JS regex. This once had every content file parsing to zero entries in
production while looking merely unwritten. There is a test for it; do not
delete it.

**Editing `public/*.txt` from a script:** read, `replace(/\r\n?/g,"\n")`, edit,
write back with `replace(/\n/g,"\r\n")`, then assert `CR === LF`.

**`habitat_note` is form-level and never inherits.** `note` and `record` are
species-level and do. A Mega routinely files under a different room than its
base, so borrowing a habitat note describes the wrong habitat.

**A form carrying its own `note` never reaches the inheriting branch**, so its
`record` must be written into its own block or Collected Observations comes out
empty. Every form in this collection has its own note, so this applies to all of
them. Give a form its base species' record verbatim — that is what the
species-level rule intends.

**Sprites are served locally.** Never reintroduce a `raw.githubusercontent.com`
URL at runtime; it is a source-code host that rate-limits and would blank every
glass case under real traffic.

---

## How the content works

Written content lives in `public/*.txt`, not in code, so it can be edited in
Notepad with no build step. All parse as `### <name>` … fields … `### END`.

`field-notes.txt` block schema — order matters:

```
### bulbasaur   [DRAFT — please review]
binomial:         invented scientific name
plant_analogue:   the real plant it echoes
genetic_concept:  short tag naming the biology
note:             the botanical reading
habitat_note:     why it is filed under its habitat
record:           the Pokédex record, consolidated and weighed
### END
```

An unrecognised `field:` line is silently absorbed into the field above it —
a typo'd `habitat_not:` vanishes rather than erroring. `content.test.js` guards
the real file against this.

### Writing a habitat room

Two-level: the room description is written **from the roster actually filed
under it**, and each specimen's placard says what *it* contributes. Read the
roster off the running page first — deriving it from memory has produced a
wrong list before.

Then, per specimen, one distinct real fact that the room text and its own field
note do not already hold. Across 18 rooms nothing repeats; check before adding.

### Writing a field note

One real, specific thing per specimen — the thing its own placard and record do
not already say. All 147 hold to that now, and keeping it means checking the
**whole file** before drafting, not the block being edited:

```bash
npm run fact -- saguaro "grazing optimisation" thigmomorph
```

The fact that spoils a note is almost always printed on a placard several rooms
away. Rewriting the set turned up ten collisions; the six found by reading had
already been written and had to be unpicked, and the four found by searching
first cost nothing. Search first. See MILESTONE §5c.

### Writing a record

Fetch the dex entries first and attribute each citation to the **earliest**
publication that printed it. Do not cite from memory — two miscitations were
caught this way and both looked plausible. Format: `(Pokémon Sword & Shield, 2019)`.

Where an entry is right, say so. Where it is wrong, correct it. Where the
science is unsettled, label it unsettled.

---

## Voice

The curator talking to a visitor, not a build log. Caveats stay — they are core
— but phrased as what the exhibit can and cannot show, never as commentary on
what got built or skipped.

- **Say it once.** A caveat repeated on 145 pages reads as a disclaimer.
- **Don't narrate what's visible.** No "read from" above two type badges.
- **Honesty is load-bearing.** Rooms admit when their specimens fit badly;
  Rotom-Mow stays on display as the point where the heuristic stops describing
  anything real.
- **Measure before claiming.** Every number in the case text matches the model.

Vocabulary, used consistently: the **gallery** is the all-panels page; a
**specimen face** is one species' page; the **exhibition hall** indexes
**habitat rooms**; a **Field Note** is the botanical reading on one specimen and
nothing else.

---

## Verification practice

- **Sweep, don't spot-check.** Fixes get verified across all 145.
- **Check the file, not the script's own output.** An apply script once reported
  "applied 46" having written one.
- **Read rosters off the running page**, not from memory.
- **Measure layout in the browser** at 375px, not by eye.
- **Stale HMR is a recurring false alarm** — a passing `npm run build` is the
  definitive check. Content edits need a hard reload with a cache-buster,
  because the loaders memoise and the browser caches the `.txt`.

---

## Outstanding

- ~~Most field notes still carry `[DRAFT — please review]`~~ — done. All 147
  rewritten to the standard of the placards around them, averaging ~594
  characters against the old ~240. Fifteen blocks still carry the tag: the
  Megas, Hisuian forms and Ogerpon masks, whose notes were already written to
  this standard earlier. Whether the tag means "thin first draft" or "the
  curator has not read this yet" decides whether those fifteen keep it.
- ~~Rooms unillustrated~~ — done, all 18 carry art. To add one for a room
  created later: drop `habitat-<key>.png` in the repo root, run
  `powershell -ExecutionPolicy Bypass -File scripts\encode-habitat.ps1`, then
  wire it with `image:` in `habitatMap.js`. The script caps the long edge at
  1600px without upscaling and steps JPEG quality down until the file is under
  460 KB, matching the eighteen in place (368-454 KB, 7.4 MB total).
  System.Drawing rather than a tool: there is no ImageMagick or ffmpeg here,
  and the `convert` on PATH is Windows' filesystem utility, not IM.
  **Name the file after the map key, not the type** - the mono-Grass room is
  keyed `none`, so its art is `habitat-none.png`. The script aliases
  `grass` to `none`, because that is the natural mistake to make.
- ~~Colour contrast never audited~~ — done, see MILESTONE §9. Both failing
  tokens deepened; the site clears AA on paper and through a frosted placard.
- `.gitattributes` with `*.txt text eol=lf` is worth adding; parsers already
  normalise, so it is belt-and-braces.
- Before any public launch: no privacy policy, and GA4 would need a consent
  banner.
