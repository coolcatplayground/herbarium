// Reading Room acquisitions — find candidate papers, free of charge.
//
//   npm run harvest
//
// Searches Europe PMC for recent open-access papers along the themes this
// collection runs on, drops anything already held or already discarded, and
// writes what is left to curation/queue.json with abstracts attached.
//
// Then `npm run triage` opens a local page to keep or discard each one.
//
// No API key, no account, no cost. Europe PMC is a free public service and
// returns the abstract inline, which is all a keep-or-discard call needs —
// reading the abstract IS the triage.
//
// Run it whenever; weekly is a good rhythm. There is deliberately no cron:
// keep-or-discard needs somebody at the keyboard.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

// How far back to search.
//
// Much wider than the run cadence, for a measured reason. Europe PMC's
// open-access index runs roughly three months behind the wall clock: filtering
// on either index-date field over the last fortnight returns zero rows for
// every theme, so a window sized to "the last week" would find nothing, every
// week, forever — and would look like a working tool rather than a broken one.
//
// The window is not what makes results new. `curation/seen.json` is: the query
// asks "published recently" and the ledger removes anything you have already
// answered for. First run shows a backlog, every run after it tapers.
const WINDOW_DAYS = Number(process.env.HARVEST_WINDOW_DAYS || 120);
const PER_THEME = Number(process.env.HARVEST_PER_THEME || 2);
const MAX_PAPERS = Number(process.env.HARVEST_MAX_PAPERS || 8);

// Ceiling on the whole queue, which matters once this runs weekly on its own.
// There are far more matching papers than one run takes, so every run digs
// deeper into the backlog rather than finding nothing — left alone for a couple
// of months that is a hundred-item queue nobody will ever face. Past the
// ceiling the job stops adding and waits for the queue to be worked down.
const QUEUE_CEILING = Number(process.env.HARVEST_QUEUE_CEILING || 24);

const EPMC = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";
const MANUSCRIPTS = new URL("../public/manuscripts.txt", import.meta.url);
const SEEN_PATH = new URL("../curation/seen.json", import.meta.url);
const QUEUE_PATH = new URL("../curation/queue.json", import.meta.url);
const QUEUE_MD_PATH = new URL("../curation/QUEUE.md", import.meta.url);

// ---------------------------------------------------------------------------
// Themes — one per habitat room or case file
// ---------------------------------------------------------------------------
//
// Derived from what the collection is actually about rather than from "plant
// biology" generally, which returns crop yield trials this herbarium has no
// use for. A term is one quoted phrase, or an array of phrases that must all
// appear.

const THEMES = [
  { key: "cam-succulence", label: "CAM photosynthesis & succulence", room: "Nocturnal-Function Flora", caseFile: "Cacnea's Water Economy", specimens: ["cacnea", "cacturne", "maractus"],
    terms: ['"crassulacean acid metabolism"', '"CAM photosynthesis"', ['"succulent"', '"water storage"']] },
  { key: "anthocyanin", label: "Flower pigment & anthocyanin biosynthesis", room: "Ornamental & Pollinator Flora", caseFile: "Roselia's Flower Pigment", specimens: ["roselia", "roserade", "budew", "bellossom"],
    terms: ['"anthocyanin biosynthesis"', ['"flower colour"', '"flavonoid"'], ['"flower color"', '"pigmentation"']] },
  { key: "plant-toxins", label: "Chemical defence, toxins & sequestration", room: "Toxic & Chemically-Defended Flora", caseFile: "Vileplume's Toxic Pollen", specimens: ["vileplume", "gloom", "oddish", "victreebel", "amoonguss"],
    // Each anchored to a plant or herbivore. Bare "glucosinolate" surfaced a
    // mouse multiple-sclerosis model — a real use of the compound, and nothing
    // this collection can put on a placard.
    terms: [['"plant secondary metabolite"', '"herbivore"'], ['"cardenolide"', '"insect"'], ['"glucosinolate"', '"defence"'], ['"glucosinolate"', '"defense"'], ['"sequestration"', '"toxin"', '"insect"']] },
  { key: "mycorrhiza", label: "Mycorrhizal symbiosis & root partnerships", room: "Deep-Rooted & Soil-Anchored Flora", specimens: ["torterra", "toedscool", "toedscruel"],
    terms: ['"arbuscular mycorrhiza"', '"mycorrhizal symbiosis"', '"common mycorrhizal network"', '"ectomycorrhiza"'] },
  { key: "hyperaccumulation", label: "Metal hyperaccumulation & serpentine soils", room: "Mineral-Accumulating Flora", specimens: ["ferrothorn", "gogoat"],
    terms: ['"hyperaccumulator"', '"nickel hyperaccumulation"', ['"serpentine soil"', '"plant"'], ['"phytoremediation"', '"metal"']] },
  { key: "bioelectric", label: "Bioelectric signalling & carnivorous plants", room: "Bioelectric-Signaling Flora", specimens: ["carnivine", "victreebel", "wormadam-plant"],
    terms: ['"Venus flytrap"', '"carnivorous plant"', ['"action potential"', '"plant"'], ['"electrical signalling"', '"plant"']] },
  { key: "wood-decay", label: "Wood decay, lignin & saprotrophs", room: "Deadwood & Decomposer-Associated Flora", specimens: ["shiinotic", "morelull", "phantump", "trevenant", "sudowoodo"],
    terms: ['"wood decay fungi"', '"white rot fungus"', ['"lignin"', '"decomposition"'], ['"deadwood"', '"decomposition"'], '"saprotrophic fungi"'] },
  { key: "seed-dispersal", label: "Seed dispersal & aerial travel", room: "Wind-Dispersed & Aerial Flora", specimens: ["hoppip", "skiploom", "jumpluff", "eldegoss", "cottonee"],
    terms: [['"seed dispersal"', '"wind"'], ['"samara"', '"autorotation"'], '"pappus"', '"dust seed"', '"anemochory"'] },
  { key: "phenology", label: "Phenology, photoperiod & vernalization", room: "Generalist Flora", specimens: ["deerling", "sawsbuck", "smoliv", "dolliv", "arboliva"],
    terms: ['"vernalization"', ['"photoperiodism"', '"flowering"'], ['"phenology"', '"plant"'], ['"degree-day"', '"phenology"']] },
  { key: "plant-insect", label: "Plant-insect interaction, galls & entomopathogens", room: "Insect-Associated Flora", specimens: ["paras", "parasect", "sewaddle", "burmy", "shroomish"],
    terms: ['"entomopathogenic fungi"', ['"plant gall"', '"induction"'], '"herbivore-induced plant volatile"', ['"parasitoid"', '"plant volatile"'], '"domatia"'] },
  { key: "cold-alpine", label: "Freezing tolerance & alpine limits", room: "Cold-Adapted & Alpine Flora", specimens: ["snover", "abomasnow", "wormadam-plant"],
    terms: [['"freezing tolerance"', '"plant"'], ['"ice nucleation"', '"plant"'], ['"treeline"', '"temperature"'], ['"cold acclimation"', '"plant"']] },
  { key: "wetland", label: "Flooding tolerance & aquatic plants", room: "Wetland & Aquatic Flora", specimens: ["lotad", "lombre", "ludicolo"],
    terms: ['"aerenchyma"', ['"flooding tolerance"', '"plant"'], '"submergence tolerance"', '"aquatic macrophyte"'] },
  { key: "fire", label: "Fire adaptation & pyrophytes", room: "Pyrophyte / Fire-Adapted Flora", specimens: ["capsakid", "scovillain", "rotom-mow"],
    // The narrowest theme here — often returns nothing. That is the subject
    // being small, not the query being broken.
    terms: ['"serotiny"', ['"resprouting"', '"fire"'], ['"fire adaptation"', '"plant"'], '"lignotuber"', ['"post-fire"', '"regeneration"']] },
  { key: "pioneer", label: "Allelopathy, succession & pioneers", room: "Pioneer & Fast-Colonizing Flora", specimens: ["breloom", "shroomish", "tangela"],
    terms: ['"allelopathy"', ['"ecological succession"', '"pioneer species"'], ['"light competition"', '"canopy"'], '"ruderal"'] },
  { key: "clonal-longevity", label: "Clonal longevity, grafting & ancient trees", room: "Ancient & Long-Lived Flora", specimens: ["trevenant", "exeggutor-alola", "torterra"],
    terms: [['"clonal"', '"longevity"'], ['"tree ring"', '"age"'], ['"grafting"', '"rootstock"'], '"ancient tree"', '"dendrochronology"'] },
  { key: "plant-senses", label: "Gravitropism & plant sensory biology", room: "Psychoactive & Sensory-Signaling Flora", specimens: ["bellsprout", "oddish", "budew"],
    terms: ['"gravitropism"', ['"statolith"', '"plant"'], '"thigmomorphogenesis"', ['"mechanosensing"', '"plant"']] },
];

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

const iso = (d) => d.toISOString().slice(0, 10);

// Europe PMC italicises species names in titles and returns that markup
// HTML-ESCAPED — a title arrives as `&lt;i&gt;Morus&lt;/i&gt;`. Stripping tags
// alone misses it, because at that point there are no tags, only escaped text
// that becomes one after decoding. Unescape first, then strip. Titles are
// written verbatim into manuscripts.txt, so a miss here lands in the content file.
export function clean(s) {
  return (s || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x?[0-9a-f]+;/gi, "")
    // &amp; last, so `&amp;lt;` cannot decode into a working tag in two passes.
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// A field prefix binds to ONE phrase. `TITLE_ABS:"action potential" AND "plant"`
// looks like it constrains both and does not — the second escapes into a
// free-text search over every field, which is how a cardiac-pacemaker study
// matched a carnivorous-plant query. Measured: that form returns 186 hits, this
// one returns 38, and only these are plant electrophysiology.
function termClause(term) {
  return Array.isArray(term)
    ? `(${term.map((t) => `TITLE_ABS:${t}`).join(" AND ")})`
    : `(TITLE_ABS:${term})`;
}

export function buildQuery(theme, since, until) {
  const anyTerm = theme.terms.map(termClause).join(" OR ");
  // OPEN_ACCESS:Y is not a nicety — manuscripts.txt says outright that a
  // paywalled paper is a dead end for the non-specialists who follow a link in,
  // so a closed-access hit is not a candidate at all.
  return `(${anyTerm}) AND (OPEN_ACCESS:Y) AND (FIRST_PDATE:[${since} TO ${until}])`;
}

async function searchTheme(theme, since, until) {
  const url = new URL(EPMC);
  url.searchParams.set("query", buildQuery(theme, since, until));
  url.searchParams.set("format", "json");
  url.searchParams.set("resultType", "core"); // 'core' is what carries abstractText
  url.searchParams.set("pageSize", String(PER_THEME * 5));
  url.searchParams.set("sort", "P_PDATE_D desc");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Europe PMC ${res.status}`);
  const data = await res.json();

  return (data.resultList?.result || [])
    .filter((r) => r.doi && r.abstractText) // no DOI or no abstract: nothing to cite, nothing to read
    .map((r) => ({
      theme,
      doi: r.doi.toLowerCase(),
      title: clean(r.title).replace(/\.$/, ""),
      authors: clean(r.authorString),
      year: r.pubYear || "",
      journal: [r.journalInfo?.journal?.title, r.journalInfo?.volume].filter(Boolean).join(", "),
      date: r.firstPublicationDate || "",
      abstract: clean(r.abstractText),
      // Europe PMC's reader is the more reliable free link — a DOI can still
      // resolve to a publisher paywall even on an OA-flagged record.
      url: r.pmcid ? `https://europepmc.org/article/PMC/${r.pmcid}` : `https://doi.org/${r.doi}`,
      isPreprint: r.source === "PPR",
    }));
}

// ---------------------------------------------------------------------------
// Ledgers
// ---------------------------------------------------------------------------

// DOIs already in the Reading Room, read off the real file rather than kept in
// a second list — so a kept paper stops being suggested with no extra
// bookkeeping. Lowercased because DOIs are case-insensitive and publishers are
// inconsistent about it.
export function heldDois() {
  if (!existsSync(MANUSCRIPTS)) return new Set();
  // Same CRLF normalisation every parser in this project does. See
  // fieldNotesLoader.js for why that is not optional.
  const raw = readFileSync(MANUSCRIPTS, "utf8").replace(/\r\n?/g, "\n");
  return new Set(
    [...raw.matchAll(/^doi:\s*(\S+)/gim)]
      .map((m) => m[1].toLowerCase())
      // The TEMPLATE block carries `10.xxxx/xxxxxxx` as a placeholder.
      .filter((d) => !d.includes("xxxx"))
  );
}

export function loadSeen() {
  if (!existsSync(SEEN_PATH)) return { dois: [] };
  try {
    return JSON.parse(readFileSync(SEEN_PATH, "utf8"));
  } catch {
    // A corrupt ledger should cost one session of repeats, not the whole tool.
    return { dois: [] };
  }
}

export function saveSeen(dois) {
  mkdirSync(new URL("./", SEEN_PATH), { recursive: true });
  writeFileSync(SEEN_PATH, JSON.stringify({ updated: iso(new Date()), dois }, null, 2) + "\n", "utf8");
}

// The queue holds papers fetched but not yet answered for. It persists between
// runs on purpose: fetching is quick, triage is the part that takes attention,
// and the two should not have to happen in the same sitting.
export function loadQueue() {
  if (!existsSync(QUEUE_PATH)) return [];
  try {
    const q = JSON.parse(readFileSync(QUEUE_PATH, "utf8"));
    return Array.isArray(q) ? q : [];
  } catch {
    // A corrupt queue costs one refetch, not the tool.
    return [];
  }
}

export function saveQueue(queue) {
  mkdirSync(new URL("./", QUEUE_PATH), { recursive: true });
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + "\n", "utf8");
}

// A phone-readable version of the same queue, for reading on GitHub when away
// from the machine that can actually keep or discard anything. Markdown because
// GitHub renders it natively — queue.json is the source of truth, this is a view
// of it, and it is rewritten from scratch every run rather than appended to.
//
// `summary` is optional and written by hand (see curation/README.md). A paper
// without one shows its abstract instead, so the page is useful either way and
// never has a blank space where the thinking should be.
export function renderQueueMarkdown(queue, now = new Date()) {
  const lines = [
    "# Acquisitions queue",
    "",
    `*${queue.length} paper${queue.length === 1 ? "" : "s"} waiting · updated ${iso(now)}*`,
    "",
    "Candidate open-access papers for the Reading Room. Keep or discard them with",
    "`npm run triage` on the machine that has the repo — this page is for reading.",
    "",
  ];

  if (queue.length === 0) {
    lines.push("---", "", "Nothing waiting. The next weekly run will look again.", "");
    return lines.join("\n");
  }

  queue.forEach((p, i) => {
    lines.push(
      "---",
      "",
      `### ${i + 1}. ${p.title}`,
      "",
      `**${p.theme.label}** · ${p.theme.room}${p.isPreprint ? " · ⚠️ preprint" : ""}`,
      "",
      `${p.authors} — *${p.journal || "—"}* (${p.year})`,
      "",
      `[Read it →](${p.url})`,
      ""
    );
    if (p.summary) {
      lines.push(p.summary, "");
    } else {
      lines.push("<details><summary>Abstract</summary>", "", p.abstract, "", "</details>", "");
    }
  });

  return lines.join("\n");
}

export function saveQueueMarkdown(queue) {
  mkdirSync(new URL("./", QUEUE_MD_PATH), { recursive: true });
  writeFileSync(QUEUE_MD_PATH, renderQueueMarkdown(queue), "utf8");
}

// ---------------------------------------------------------------------------
// Keeping a paper
// ---------------------------------------------------------------------------

export function blockId(paper) {
  const first = (paper.authors.split(/[ ,]/)[0] || "anon").toLowerCase().replace(/[^a-z]/g, "");
  return `${first || "anon"}-${paper.year}-${paper.theme.key}`;
}

// Appends one block to public/manuscripts.txt.
//
// The CRLF dance is the project's standing rule for editing these files from a
// script: read, normalise to \n, edit, write back as \r\n, then assert that the
// CR and LF counts match. The files are authored in Notepad, and a file that
// ends up with mixed endings is the exact silent-parse failure recorded in
// MILESTONE §6.1.
//
// `connection:` is left EMPTY on purpose. manuscripts.txt says in its own
// header not to restate the abstract there — that field is the curator's idea
// of how the science maps onto the Pokémon world, and it is not this script's
// to write.
export function appendBlock(fileText, paper) {
  const raw = fileText.replace(/\r\n?/g, "\n");
  const block = [
    "",
    `### ${blockId(paper)}`,
    `title: ${paper.title}`,
    `authors: ${paper.authors}`,
    `year: ${paper.year}`,
    `journal: ${paper.journal}`,
    `doi: ${paper.doi}`,
    `open_access: yes`,
    `related_specimen: `,
    `connection: `,
    "### END",
    "",
  ].join("\n");

  const next = raw.replace(/\n*$/, "\n") + block;
  const out = next.replace(/\n/g, "\r\n");

  const cr = (out.match(/\r/g) || []).length;
  const lf = (out.match(/\n/g) || []).length;
  if (cr !== lf) throw new Error(`refusing to write mixed line endings (CR ${cr}, LF ${lf})`);

  return out;
}

export function keepPaper(paper) {
  writeFileSync(MANUSCRIPTS, appendBlock(readFileSync(MANUSCRIPTS, "utf8"), paper), "utf8");
}

// ---------------------------------------------------------------------------
// The queue
// ---------------------------------------------------------------------------

async function main() {
  const until = new Date();
  const since = new Date(until.getTime() - WINDOW_DAYS * 86400000);

  const held = heldDois();
  const seen = loadSeen();
  // Papers still sitting unanswered in the queue are carried over, so a fetch
  // that finds nothing new does not wipe last week's unread ones.
  const queued = loadQueue();
  const skip = new Set([...held, ...seen.dois, ...queued.map((p) => p.doi)]);

  if (queued.length >= QUEUE_CEILING) {
    saveQueueMarkdown(queued);
    process.stdout.write(
      `Queue already holds ${queued.length} (ceiling ${QUEUE_CEILING}). Nothing fetched.\n` +
        `\n  Work it down first:  npm run triage\n`
    );
    return;
  }

  process.stdout.write(
    `Searching ${iso(since)} → ${iso(until)}  ·  ${held.size} held, ${seen.dois.length} discarded, ${queued.length} queued\n`
  );

  const found = [];
  for (const theme of THEMES) {
    try {
      const hits = await searchTheme(theme, iso(since), iso(until));
      hits
        .filter((h) => !skip.has(h.doi))
        .slice(0, PER_THEME)
        // Claim each DOI as we go so two themes can't both surface one paper.
        .forEach((h) => {
          skip.add(h.doi);
          found.push(h);
        });
    } catch (e) {
      process.stdout.write(`\n  ${theme.key}: ${e.message}\n`);
    }
    process.stdout.write(".");
  }
  process.stdout.write("\n");

  // Newest first, then capped — so a light week in one theme can't let a stale
  // paper crowd out a fresh one from another.
  // Capped by the per-run limit and by whatever headroom is left under the
  // ceiling, whichever is smaller.
  const room = Math.max(0, QUEUE_CEILING - queued.length);
  const fresh = found
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, Math.min(MAX_PAPERS, room));
  const queue = [...queued, ...fresh];
  saveQueue(queue);
  // Rendered every run, including the empty one, so the page on GitHub always
  // reflects the real queue rather than going stale at the last non-empty week.
  saveQueueMarkdown(queue);

  if (queue.length === 0) {
    process.stdout.write("\nNothing new. Try again next week.\n");
    return;
  }

  process.stdout.write(
    `\n${fresh.length} new · ${queue.length} waiting\n\n  Review them:  npm run triage\n`
  );
}

// Only run when invoked directly. pathToFileURL rather than string-building a
// file:// URL, because on Windows argv[1] is `C:\...` and `new URL("file://C:/…")`
// parses the drive letter as a hostname, so the check would never match.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
