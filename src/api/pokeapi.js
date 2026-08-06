const BASE = "https://pokeapi.co/api/v2";
const cache = new Map();

// Official-artwork sprite URL for a given National Dex id. Shared by every
// page/component that shows a Pokémon sprite, so there's one source of
// truth for the sprite path.
export function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
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
// filtered out since they'd just duplicate an existing specimen.
export async function fetchGrassRoster() {
  const data = await getJSON(`${BASE}/type/grass`);
  const entries = data.pokemon
    .map((p) => ({
      name: p.pokemon.name,
      url: p.pokemon.url,
      id: Number(p.pokemon.url.split("/").filter(Boolean).pop()),
    }))
    .filter((p) => !COSMETIC_FORM_PATTERNS.some((pattern) => p.name.includes(pattern)))
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

export function getEnglishGenus(species) {
  const entry = species.genera?.find((e) => e.language.name === "en");
  return entry ? entry.genus : "";
}

// Flattens an evolution chain into an ordered array of { name, trigger },
// used by the linear growth-stage timeline. See buildEvolutionTree below
// for the branch-preserving version used by the new Evolution Tree.
export function flattenEvolutionChain(chain) {
  const result = [];
  function walk(node, fromTrigger) {
    result.push({
      name: node.species.name,
      trigger: fromTrigger,
    });
    node.evolves_to.forEach((next) => {
      const detail = next.evolution_details[0];
      let triggerLabel = "unlocks via";
      if (detail) {
        if (detail.min_level) triggerLabel = `at level ${detail.min_level}`;
        else if (detail.item) triggerLabel = `via ${detail.item.name.replace(/-/g, " ")}`;
        else if (detail.trigger?.name === "trade") triggerLabel = "via trade";
        else if (detail.min_happiness) triggerLabel = "via high friendship";
        else triggerLabel = `via ${detail.trigger?.name?.replace(/-/g, " ") || "special condition"}`;
      }
      walk(next, triggerLabel);
    });
  }
  walk(chain.chain, null);
  return result;
}

// Same trigger-label logic as flattenEvolutionChain, but builds a real
// nested tree instead of collapsing branches into one line — used by
// EvolutionTree to show actual branch points (e.g. Gloom splitting into
// Vileplume via Leaf Stone or Bellossom via Sun Stone).
export function buildEvolutionTree(chain) {
  function triggerLabelFor(detail) {
    if (!detail) return null;
    if (detail.min_level) return `Lv. ${detail.min_level}`;
    if (detail.item) return detail.item.name.replace(/-/g, " ");
    if (detail.trigger?.name === "trade") return "Trade";
    if (detail.min_happiness) return "Friendship";
    return detail.trigger?.name?.replace(/-/g, " ") || "Special";
  }

  function walk(node, incomingTrigger) {
    const id = Number(node.species.url.split("/").filter(Boolean).pop());
    return {
      name: node.species.name,
      id,
      trigger: incomingTrigger,
      children: node.evolves_to.map((next) =>
        walk(next, triggerLabelFor(next.evolution_details[0]))
      ),
    };
  }

  return walk(chain.chain, null);
}
