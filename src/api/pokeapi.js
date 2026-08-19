import { HIDDEN_SIZE_FORMS } from "../data/sizeForms";

const BASE = "https://pokeapi.co/api/v2";
const cache = new Map();

// Official-artwork sprite URL for a given National Dex id. Shared by every
// page/component that shows a Pokémon sprite, so there's one source of
// truth for the sprite path.
// Sprites are served from our own origin rather than hotlinked. See
// scripts/fetch-sprites.mjs: raw.githubusercontent is a source host that
// rate-limits, so a public site pulling ~300 images per visitor from it would
// start blanking glass cases as soon as it got traffic.
const SPRITE_REMOTE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export function spriteUrl(id, shiny = false) {
  return `${import.meta.env.BASE_URL}sprites/${id}${shiny ? "-shiny" : ""}.png`;
}

export function remoteSpriteUrl(id, shiny = false) {
  return `${SPRITE_REMOTE}/${shiny ? "shiny/" : ""}${id}.png`;
}

// Falls back to the upstream copy if a local sprite is missing — which happens
// on a fresh clone before `npm run sprites` has been run, and would otherwise
// look like a broken site to anyone starting the project up for the first time.
// Guarded so a genuinely dead image cannot loop between the two.
export function onSpriteError(event) {
  const img = event.currentTarget;
  if (img.dataset.spriteFallback) return;
  img.dataset.spriteFallback = "1";
  // Seasonal forms are stored as home-<slug>[-shiny].png and come from a
  // different upstream directory than the official artwork.
  const home = img.src.match(/sprites\/home-([\w-]+?)(-shiny)?\.png$/);
  if (home) {
    img.src = `${SPRITE_REMOTE.replace("official-artwork", "home")}/${home[2] ? "shiny/" : ""}${home[1]}.png`;
    return;
  }
  const art = img.src.match(/sprites\/(\d+)(-shiny)?\.png$/);
  if (art) img.src = remoteSpriteUrl(art[1], Boolean(art[2]));
}


async function getJSON(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

// Form-name suffixes that are purely cosmetic/duplicate reskins rather than
// biologically or typing-distinct variants, and get dropped from the catalog.
const COSMETIC_FORM_PATTERNS = [
  "-gmax",
  "-totem",
  "-cap",
  "-cosplay",
  "-starter",
  "-battle-bond",
  "-ash",
];

// Full roster of Grass-type entries (National Dex species, plus Mega
// Evolutions and regional variants, which genuinely differ in typing or
// design). Cosmetic-only reskins (Gigantamax, Totem, costume forms) are
// filtered out since they'd just duplicate an existing specimen, and the
// Pumpkaboo/Gourgeist size classes are folded into their canonical entry —
// see src/data/sizeForms.js — so one organism occupies one gallery panel.
export async function fetchGrassRoster() {
  const data = await getJSON(`${BASE}/type/grass`);
  const entries = data.pokemon
    .map((p) => ({
      name: p.pokemon.name,
      url: p.pokemon.url,
      id: Number(p.pokemon.url.split("/").filter(Boolean).pop()),
    }))
    .filter((p) => !COSMETIC_FORM_PATTERNS.some((pattern) => p.name.includes(pattern)))
    .filter((p) => !HIDDEN_SIZE_FORMS.has(p.name))
    .sort((a, b) => a.id - b.id);
  return entries;
}

export async function fetchPokemon(nameOrId) {
  return getJSON(`${BASE}/pokemon/${nameOrId}`);
}

export async function fetchSpecies(nameOrId) {
  return getJSON(`${BASE}/pokemon-species/${nameOrId}`);
}

export async function fetchEvolutionChain(url) {
  return getJSON(url);
}

export function getEnglishFlavorText(species) {
  const entry = species.flavor_text_entries?.find((e) => e.language.name === "en");
  return entry ? entry.flavor_text.replace(/[\n\f\u00ad]/g, " ") : "";
}

export function extractSecondaryType(pokemonData) {
  const types = pokemonData.types.map((t) => t.type.name);
  return types.find((t) => t !== "grass") || null;
}

const TYPES_CACHE_KEY = "folia-codex-secondary-types-v1";

function readTypesCache() {
  try {
    return JSON.parse(localStorage.getItem(TYPES_CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeTypesCache(map) {
  try {
    localStorage.setItem(TYPES_CACHE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable (private browsing, etc.) — fine, just skip caching
  }
}

// Fetches each roster entry's real secondary type (or null if pure Grass),
// used to derive a habitat guess. Persists results in localStorage since
// typing never changes and this is ~130 requests — no need to repeat it
// every visit. Runs with a small concurrency limit to stay polite to the API.
export async function fetchRosterTypes(roster, { concurrency = 8, onProgress } = {}) {
  const cached = readTypesCache();
  const results = { ...cached };
  const toFetch = roster.filter((r) => !(r.name in cached));

  let completed = 0;
  const total = toFetch.length;
  let index = 0;

  async function worker() {
    while (index < toFetch.length) {
      const entry = toFetch[index++];
      try {
        const data = await fetchPokemon(entry.name);
        results[entry.name] = extractSecondaryType(data);
      } catch {
        results[entry.name] = null;
      }
      completed++;
      onProgress?.(completed, total);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, toFetch.length) }, () => worker());
  await Promise.all(workers);

  if (toFetch.length > 0) writeTypesCache(results);
  return results;
}

// Each version mapped to the release it belongs to and the year that release
// reached English-speaking players — the entries being cited are the English
// ones, so the English date is the honest one to print.
//
// Paired versions are grouped deliberately rather than derived from the year,
// because year alone gets 2022 wrong: Legends: Arceus and Scarlet & Violet
// share it but are not the same publication.
const RELEASES = {
  red: ["Pokémon Red & Blue", 1998],
  blue: ["Pokémon Red & Blue", 1998],
  yellow: ["Pokémon Yellow", 1999],
  gold: ["Pokémon Gold & Silver", 2000],
  silver: ["Pokémon Gold & Silver", 2000],
  crystal: ["Pokémon Crystal", 2001],
  ruby: ["Pokémon Ruby & Sapphire", 2003],
  sapphire: ["Pokémon Ruby & Sapphire", 2003],
  firered: ["Pokémon FireRed & LeafGreen", 2004],
  leafgreen: ["Pokémon FireRed & LeafGreen", 2004],
  emerald: ["Pokémon Emerald", 2005],
  diamond: ["Pokémon Diamond & Pearl", 2007],
  pearl: ["Pokémon Diamond & Pearl", 2007],
  platinum: ["Pokémon Platinum", 2009],
  heartgold: ["Pokémon HeartGold & SoulSilver", 2010],
  soulsilver: ["Pokémon HeartGold & SoulSilver", 2010],
  black: ["Pokémon Black & White", 2011],
  white: ["Pokémon Black & White", 2011],
  "black-2": ["Pokémon Black 2 & White 2", 2012],
  "white-2": ["Pokémon Black 2 & White 2", 2012],
  x: ["Pokémon X & Y", 2013],
  y: ["Pokémon X & Y", 2013],
  "omega-ruby": ["Pokémon Omega Ruby & Alpha Sapphire", 2014],
  "alpha-sapphire": ["Pokémon Omega Ruby & Alpha Sapphire", 2014],
  sun: ["Pokémon Sun & Moon", 2016],
  moon: ["Pokémon Sun & Moon", 2016],
  "ultra-sun": ["Pokémon Ultra Sun & Ultra Moon", 2017],
  "ultra-moon": ["Pokémon Ultra Sun & Ultra Moon", 2017],
  "lets-go-pikachu": ["Pokémon Let's Go, Pikachu! & Let's Go, Eevee!", 2018],
  "lets-go-eevee": ["Pokémon Let's Go, Pikachu! & Let's Go, Eevee!", 2018],
  sword: ["Pokémon Sword & Shield", 2019],
  shield: ["Pokémon Sword & Shield", 2019],
  "brilliant-diamond": ["Pokémon Brilliant Diamond & Shining Pearl", 2021],
  "shining-pearl": ["Pokémon Brilliant Diamond & Shining Pearl", 2021],
  "legends-arceus": ["Pokémon Legends: Arceus", 2022],
  scarlet: ["Pokémon Scarlet & Violet", 2022],
  violet: ["Pokémon Scarlet & Violet", 2022],
};

// Short names for a single version, used to label a passage when the two
// halves of one release disagree — Sword and Shield ship different text for
// the same species more often than not.
const VERSION_SHORT = {
  "black-2": "Black 2",
  "white-2": "White 2",
  "omega-ruby": "Omega Ruby",
  "alpha-sapphire": "Alpha Sapphire",
  "ultra-sun": "Ultra Sun",
  "ultra-moon": "Ultra Moon",
  "lets-go-pikachu": "Let's Go, Pikachu!",
  "lets-go-eevee": "Let's Go, Eevee!",
  "legends-arceus": "Legends: Arceus",
  "brilliant-diamond": "Brilliant Diamond",
  "shining-pearl": "Shining Pearl",
  firered: "FireRed",
  leafgreen: "LeafGreen",
  heartgold: "HeartGold",
  soulsilver: "SoulSilver",
};

export function shortVersion(slug) {
  return VERSION_SHORT[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatVersion(slug) {
  const known = RELEASES[slug];
  if (known) return known[0];
  return shortVersion(slug);
}

// The record turned into a bibliography: one item per publication, oldest
// first, each carrying the passages it actually printed.
//
// A release can hold more than one passage — the paired versions frequently
// print different text — so each is kept with the versions that carry it,
// rather than silently showing one and dropping the other.
export function buildBibliography(record) {
  const releases = new Map();

  record.forEach(({ text, versions }) => {
    versions.forEach((slug) => {
      const [title, year] = RELEASES[slug] || [formatVersion(slug), null];
      if (!releases.has(title)) releases.set(title, { year, passages: new Map() });
      const release = releases.get(title);
      if (!release.passages.has(text)) release.passages.set(text, []);
      release.passages.get(text).push(slug);
    });
  });

  return [...releases]
    .sort((a, b) => (a[1].year ?? 9999) - (b[1].year ?? 9999))
    .map(([title, { year, passages }]) => ({
      title,
      year,
      cite: year ? `${title} (${year})` : title,
      passages: [...passages].map(([text, versions]) => ({ text, versions })),
    }));
}

// The species' Pokédex record: every distinct English entry, with the games it
// appeared in. Paired versions almost always share wording, so entries are
// de-duplicated by text — Cacnea has 18 English entries but only 8 distinct
// observations, and the count that matters is the second one.
//
// Kept in API order, which runs roughly oldest game first, so the record reads
// as a chronology of observations rather than an unordered pile.
export function getPokedexRecord(species) {
  const seen = new Map();
  (species.flavor_text_entries || [])
    .filter((e) => e.language.name === "en")
    .forEach((entry) => {
      const text = entry.flavor_text.replace(/[\n\f­]/g, " ").replace(/\s+/g, " ").trim();
      if (!text) return;
      if (!seen.has(text)) seen.set(text, []);
      seen.get(text).push(entry.version.name);
    });
  return [...seen].map(([text, versions]) => ({ text, versions }));
}

export function getEnglishGenus(species) {
  const entry = species.genera?.find((e) => e.language.name === "en");
  return entry ? entry.genus : "";
}

// --- Determination Key data -------------------------------------------
//
// Real, objectively-fetchable classification characters for the polyclave
// key — not morphology (leaf shape, growth habit), which would need a
// specimen-by-specimen visual read the same way field notes do. This is
// the honest v1 scope: taxonomic/classification characters covering the
// full roster mechanically, with morphological characters as a known,
// separate deepening pass for later (see DEVLOG).

const KEY_DATA_CACHE_KEY = "folia-codex-key-data-v1";

function readKeyDataCache() {
  try {
    return JSON.parse(localStorage.getItem(KEY_DATA_CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeKeyDataCache(map) {
  try {
    localStorage.setItem(KEY_DATA_CACHE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable — fine, just skip caching
  }
}

const GENERATION_LABELS = {
  "generation-i": "Kanto (Gen I)",
  "generation-ii": "Johto (Gen II)",
  "generation-iii": "Hoenn (Gen III)",
  "generation-iv": "Sinnoh (Gen IV)",
  "generation-v": "Unova (Gen V)",
  "generation-vi": "Kalos (Gen VI)",
  "generation-vii": "Alola (Gen VII)",
  "generation-viii": "Galar (Gen VIII)",
  "generation-ix": "Paldea (Gen IX)",
};

// Special-form category from the roster entry's own name suffix — the
// same suffixes fetchGrassRoster already recognizes as real typing/design
// variants (as opposed to the cosmetic reskins it filters out).
function formTypeFor(name) {
  if (name.includes("-mega")) return "Mega Evolution";
  if (name.includes("-alola")) return "Alolan Form";
  if (name.includes("-galar")) return "Galarian Form";
  if (name.includes("-hisui")) return "Hisuian Form";
  if (name.includes("-paldea")) return "Paldean Form";
  return "Standard Species";
}

// Finds this species' depth in its own evolution chain: 0 = base/does-not-
// evolve, 1 = middle stage, 2 = final stage. Chains are shared across
// family members and already deduped by getJSON's URL cache, so fetching
// this per roster entry doesn't refetch the same chain repeatedly.
function stageFromChain(chain, targetName) {
  let found = null;
  function walk(node, depth) {
    if (node.species.name === targetName) found = depth;
    node.evolves_to.forEach((next) => walk(next, depth + 1));
  }
  walk(chain.chain, 0);
  if (found === null) return "Unknown";
  const totalStages = (() => {
    let max = 0;
    function walkMax(node, depth) {
      max = Math.max(max, depth);
      node.evolves_to.forEach((next) => walkMax(next, depth + 1));
    }
    walkMax(chain.chain, 0);
    return max;
  })();
  if (totalStages === 0) return "Does Not Evolve";
  if (found === 0) return "Base Stage";
  if (found === totalStages) return "Final Stage";
  return "Middle Stage";
}

// Fetches the full roster's classification data for the Determination Key:
// secondary type, habitat category, generation, evolutionary stage, and
// form type. Cached in localStorage (like fetchRosterTypes) since none of
// this changes and it's a real number of requests across ~90+ entries.
export async function fetchKeyData(roster, { concurrency = 6, onProgress } = {}) {
  const cached = readKeyDataCache();
  const results = { ...cached };
  const toFetch = roster.filter((r) => !(r.name in cached));

  let completed = 0;
  const total = toFetch.length;
  let index = 0;

  async function worker() {
    while (index < toFetch.length) {
      const entry = toFetch[index++];
      try {
        const pokemonData = await fetchPokemon(entry.name);
        const secondaryType = extractSecondaryType(pokemonData);
        const species = await fetchSpecies(pokemonData.species.name);
        const chain = await fetchEvolutionChain(species.evolution_chain.url);
        results[entry.name] = {
          secondaryType,
          generation: GENERATION_LABELS[species.generation?.name] || species.generation?.name || "Unknown",
          // Species' own canonical name, not the roster entry's form-suffixed
          // name — evolution chain nodes are keyed by species name, and a
          // Mega Evolution or regional variant (e.g. "exeggutor-alola")
          // shares its species' chain with the standard form ("exeggutor").
          stage: stageFromChain(chain, species.name),
          formType: formTypeFor(entry.name),
        };
      } catch {
        results[entry.name] = {
          secondaryType: null,
          generation: "Unknown",
          stage: "Unknown",
          formType: formTypeFor(entry.name),
        };
      }
      completed++;
      onProgress?.(completed, total);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, toFetch.length) }, () => worker());
  await Promise.all(workers);

  if (toFetch.length > 0) writeKeyDataCache(results);
  return results;
}


// The single line of descent that this specimen actually belongs to: from the
// root of its chain, through the specimen, and on to the end of its own branch.
//
// This is deliberately not the whole family tree. Rendering every branch meant
// Leafeon dragged in all eight Eeveelutions side by side and needed ~480px,
// while a specimen sheet only ever needs to answer "what did this become, and
// what did it come from". Branches not taken aren't discarded silently though —
// each node records its siblings so the divergence can still be named.
//
// Note it walks by *species* name: an alternate form like `venusaur-mega` has
// species `venusaur`, and chain nodes are keyed by species, so matching on the
// roster name would never find the specimen in its own chain.
// Adds collection context to a raw lineage: which nodes are actually specimens
// in this herbarium, and which alternate forms belong to each.
//
// Two things PokéAPI's evolution chain can't tell you on its own:
//
//   1. A chain node isn't necessarily a specimen here. Leafeon's chain root is
//      Eevee, which isn't a Grass-type and so isn't in the collection. Its
//      seven siblings aren't either — a herbarium doesn't keep a Vaporeon — so
//      linking to them was offering pages for things this collection doesn't
//      hold. Non-roster siblings are dropped; a non-roster ancestor is kept,
//      because it's real ancestry, but marked and left unlinked.
//
//   2. Megas and regional forms live on the *species*, not in the chain, so
//      they never appeared anywhere in a lineage. `varieties` is where they
//      sit: venusaur's non-default varieties include venusaur-mega, and
//      exeggutor's include exeggutor-alola. Filtered against the roster so
//      cosmetic-only forms already excluded there (Gigantamax) stay excluded.
export async function annotateLineage(lineage) {
  const roster = await fetchGrassRoster();
  const inRoster = new Set(roster.map((r) => r.name));

  // An evolution chain names *species*; the roster holds *varieties*. Those
  // usually match, but not always — the collection's Pumpkaboo is
  // `pumpkaboo-average`, its Wormadam is `wormadam-plant`, its Shaymin is
  // `shaymin-land`. Comparing the species name straight against the roster
  // marked all of those as absent when they're sitting right there, so a
  // species is resolved through its varieties instead: prefer the default,
  // otherwise take whichever variety the collection actually holds (which is
  // how a Hisuian-only line like Voltorb resolves to `voltorb-hisui`).
  async function varietiesOf(speciesName) {
    const species = await fetchSpecies(speciesName);
    return species.varieties.map((v) => ({
      name: v.pokemon.name,
      // Sprites are keyed by id, and a variety's id (venusaur-mega is 10033)
      // is not the species id.
      id: Number(v.pokemon.url.split("/").filter(Boolean).pop()),
      isDefault: v.is_default,
    }));
  }

  async function resolve(speciesName) {
    try {
      const varieties = await varietiesOf(speciesName);
      const held = varieties.filter((v) => inRoster.has(v.name));
      const self = held.find((v) => v.isDefault) || held[0] || null;
      return { self, held };
    } catch {
      // A species lookup failing shouldn't blank the whole lineage.
      return { self: null, held: [] };
    }
  }

  return Promise.all(
    lineage.map(async (node) => {
      const { self, held } = await resolve(node.name);
      // Siblings are species names too, so they need the same resolution —
      // filtering them on the raw name had the identical blind spot.
      const siblings = (
        await Promise.all(
          (node.siblings || []).map(async (s) => (await resolve(s)).self)
        )
      ).filter(Boolean);

      return {
        ...node,
        // Label and link by the variety the collection holds, so a
        // Hisuian-only line reads "Voltorb Hisui" rather than pointing at a
        // Voltorb this herbarium doesn't keep.
        name: self ? self.name : node.name,
        id: self ? self.id : node.id,
        speciesName: node.name,
        inCollection: Boolean(self),
        forms: held.filter((v) => v.name !== self?.name),
        siblings,
      };
    })
  );
}

export function buildLineage(chain, targetSpeciesName) {
  function labelFor(detail) {
    if (!detail) return null;
    if (detail.min_level) return `at level ${detail.min_level}`;
    if (detail.item) return `via ${detail.item.name.replace(/-/g, " ")}`;
    if (detail.trigger?.name === "trade") return "via trade";
    if (detail.min_happiness) return "via high friendship";
    return `via ${detail.trigger?.name?.replace(/-/g, " ") || "special condition"}`;
  }
  const nodeOf = (node, trigger, siblings) => ({
    name: node.species.name,
    id: Number(node.species.url.split("/").filter(Boolean).pop()),
    trigger,
    siblings,
  });

  // Walk down from the target along its own branch. Where a node forks, follow
  // the first child and record the rest rather than splitting the display.
  function descend(node) {
    const out = [];
    let current = node;
    while (current.evolves_to.length > 0) {
      const [next, ...rest] = current.evolves_to;
      out.push(nodeOf(next, labelFor(next.evolution_details[0]), rest.map((r) => r.species.name)));
      current = next;
    }
    return out;
  }

  const path = [];
  function findPath(node, trigger, siblings) {
    path.push(nodeOf(node, trigger, siblings));
    if (node.species.name === targetSpeciesName) return node;
    for (const next of node.evolves_to) {
      const others = node.evolves_to.filter((c) => c !== next).map((c) => c.species.name);
      const hit = findPath(next, labelFor(next.evolution_details[0]), others);
      if (hit) return hit;
    }
    path.pop();
    return null;
  }

  const found = findPath(chain.chain, null, []);
  // Species that aren't in their own chain (data gaps, odd forms) still get a
  // usable line rather than an empty panel.
  if (!found) return [nodeOf(chain.chain, null, []), ...descend(chain.chain)];
  return [...path, ...descend(found)];
}
