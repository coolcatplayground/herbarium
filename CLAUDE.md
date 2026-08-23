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

## Rules that are easy to break

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

- Most field notes still carry `[DRAFT — please review]`. They are now the
  weakest writing on every page — ~200 characters sitting between an ~800-char
  placard and a ~900-char record. Highest-value remaining content work.
- 10 of 18 rooms unillustrated. Drop `habitat-<key>.png` in the repo root and
  re-encode into `public/habitats/` (System.Drawing via PowerShell; there is no
  ImageMagick or ffmpeg here, and the `convert` on PATH is Windows' filesystem
  tool, not IM).
- Colour contrast never audited.
- `.gitattributes` with `*.txt text eol=lf` is worth adding; parsers already
  normalise, so it is belt-and-braces.
- Before any public launch: no privacy policy, and GA4 would need a consent
  banner.
