// Downloads every sprite the site needs into public/sprites/, so that visitors
// load images from our own origin instead of hotlinking raw.githubusercontent.
//
// Why this exists: raw.githubusercontent is a source-code host, not a CDN. It
// rate-limits, and sustained image traffic from a public site gets throttled —
// which would blank every glass case in the gallery at exactly the moment the
// site started getting visitors. Fetching once per deploy instead of once per
// pageview moves that load off GitHub and onto the CDN in front of Pages.
//
// The output is gitignored. CI runs this before `npm run build`; locally, run
// `npm run sprites` once. Re-runs skip anything already downloaded, so it is
// cheap to repeat. If a sprite is missing at runtime the app falls back to the
// remote URL (see onSpriteError in api/pokeapi.js), so a fresh clone still
// works before this has been run.
import { mkdir, writeFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { MAIL_PAPERS } from "../src/data/curatorMail.js";

const OUT = new URL("../public/sprites/", import.meta.url);
const BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const ART = `${BASE}/other/official-artwork`;
const HOME = `${BASE}/other/home`;
const CONCURRENCY = 8;

// Seasonal forms are pokemon-form entries with no official artwork, so the two
// Deerling-line faces use the HOME set for all four seasons — see seasonForms.js.
const SEASON_SLUGS = ["585", "585-summer", "585-autumn", "585-winter", "586", "586-summer", "586-autumn", "586-winter"];

// The mail desk's stationery. Item sprites rather than pokemon ones, so they
// come from a different directory of the same repository — 24x24 pixel art, a
// few hundred bytes each. They land in the same output folder because the
// filenames cannot collide with the numeric pokemon ids.
//
// Read straight off MAIL_PAPERS rather than listed again here. A second copy
// of the list would be a copy that drifts: add a seventh paper, forget the
// fetcher, and the sheet renders with a missing icon in production while
// working locally where the file happens to be lying around. The paper id IS
// the PokéAPI item name, which is why this works at all.
//
// Importing app code into a build script is safe here specifically because
// curatorMail.js is pure — no React, no browser globals, no import.meta.env.
const ITEMS = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items";
const MAIL_SLUGS = MAIL_PAPERS.map((p) => p.id);

async function rosterIds() {
  const res = await fetch("https://pokeapi.co/api/v2/type/grass");
  if (!res.ok) throw new Error(`PokéAPI returned ${res.status}`);
  const { pokemon } = await res.json();
  const COSMETIC = ["-gmax", "-totem", "-cap", "-cosplay", "-starter", "-battle-bond", "-ash"];
  return [
    ...new Set(
      pokemon
        .filter((p) => !COSMETIC.some((s) => p.pokemon.name.includes(s)))
        .map((p) => Number(p.pokemon.url.split("/").filter(Boolean).pop()))
    ),
  ].sort((a, b) => a - b);
}

// Every image the app can ask for: official artwork normal + shiny per roster
// id, and the HOME set (normal + shiny) for the eight seasonal forms.
function targets(ids) {
  const out = [];
  for (const id of ids) {
    out.push({ url: `${ART}/${id}.png`, file: `${id}.png` });
    out.push({ url: `${ART}/shiny/${id}.png`, file: `${id}-shiny.png` });
  }
  for (const slug of SEASON_SLUGS) {
    out.push({ url: `${HOME}/${slug}.png`, file: `home-${slug}.png` });
    out.push({ url: `${HOME}/shiny/${slug}.png`, file: `home-${slug}-shiny.png` });
  }
  for (const slug of MAIL_SLUGS) {
    out.push({ url: `${ITEMS}/${slug}.png`, file: `${slug}.png` });
  }
  return out;
}

async function run() {
  await mkdir(OUT, { recursive: true });
  let ids;
  try {
    ids = await rosterIds();
  } catch (err) {
    // Never block a deploy on PokéAPI being unreachable. Without the local
    // copies the app falls back to the upstream sprite URLs, which is the
    // behaviour we are trying to move away from but is still a working site.
    console.warn(`could not reach PokéAPI (${err.message}) — skipping sprite fetch`);
    return;
  }
  const all = targets(ids);
  const todo = all.filter((t) => !existsSync(new URL(t.file, OUT)));

  console.log(`${ids.length} specimens · ${all.length} images · ${todo.length} to download`);
  if (!todo.length) return report(all.length);

  let done = 0;
  const missing = [];
  let i = 0;
  async function worker() {
    while (i < todo.length) {
      const t = todo[i++];
      try {
        const res = await fetch(t.url);
        // A 404 is expected for a handful of forms that have no shiny artwork;
        // record it rather than failing the build over it.
        if (!res.ok) { missing.push(`${t.file} (${res.status})`); continue; }
        await writeFile(new URL(t.file, OUT), Buffer.from(await res.arrayBuffer()));
      } catch (err) {
        missing.push(`${t.file} (${err.message})`);
      }
      if (++done % 50 === 0) console.log(`  ${done}/${todo.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  if (missing.length) console.log(`no artwork upstream for ${missing.length}: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? " …" : ""}`);
  await report(all.length - missing.length);
}

async function report() {
  const files = await readdir(OUT);
  let bytes = 0;
  for (const f of files) bytes += (await stat(new URL(f, OUT))).size;
  console.log(`public/sprites/: ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB`);
}

await run();
