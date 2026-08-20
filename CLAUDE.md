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
| `npm test` | Vitest, 462 tests, ~0.5s |
| `npm run build` | fetches sprites, then builds |
| `npm run lint` | oxlint |
| `npm run sprites` | refetch sprites (skips existing) |
| `npm run roster:refresh` | regenerate the test roster fixture after PokéAPI gains new Grass-types |

Deploy is automatic: `.github/workflows/deploy.yml` fires on push to `main`.

---

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
