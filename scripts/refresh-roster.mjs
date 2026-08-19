// Regenerates the roster fixture used by the content completeness test.
// Run after PokéAPI gains new Grass-types: npm run roster:refresh
//
// Deliberately mirrors fetchGrassRoster's filters rather than importing them,
// so that a change to those filters shows up as a fixture diff to review rather
// than silently redefining what the test considers complete.
import { writeFileSync } from "node:fs";

const COSMETIC = ["-gmax", "-totem", "-cap", "-cosplay", "-starter", "-battle-bond", "-ash"];
const HIDDEN_SIZES = [
  "pumpkaboo-small", "pumpkaboo-large", "pumpkaboo-super",
  "gourgeist-small", "gourgeist-large", "gourgeist-super",
];

const data = await (await fetch("https://pokeapi.co/api/v2/type/grass")).json();
const roster = data.pokemon
  .map((p) => ({ name: p.pokemon.name, id: Number(p.pokemon.url.split("/").filter(Boolean).pop()) }))
  .filter((p) => !COSMETIC.some((s) => p.name.includes(s)))
  .filter((p) => !HIDDEN_SIZES.includes(p.name))
  .sort((a, b) => a.id - b.id)
  .map((p) => p.name);

writeFileSync(
  "src/data/__fixtures__/roster.json",
  JSON.stringify({ generated: new Date().toISOString().slice(0, 10), count: roster.length, roster }, null, 2) + "\n",
  "utf8"
);
console.log(`roster fixture written: ${roster.length} specimens`);
