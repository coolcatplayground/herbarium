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
import sharp from "sharp";

const OUT = new URL("../public/sprites/", import.meta.url);
const BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const ART = `${BASE}/other/official-artwork`;
const HOME = `${BASE}/other/home`;
const CONCURRENCY = 8;

// Thumbnails for every list view. The official artwork is 475x475 and averages
// 125 KB; the gallery paints it at about 162 CSS pixels, the determination key
// at 64-80, the case-file consoles at 48, and the Grafting Bench at 22. Every
// one of those was downloading the full render.
//
// 320px covers the largest of them on a 2x screen. In WebP that is around 8% of
// the original file — measured, not estimated: Bulbasaur's artwork is 198.6 KB
// as a 475px PNG and 16.6 KB as a 320px WebP, and WebP beats PNG two to one at
// the same dimensions. A full scroll of the gallery goes from roughly 18 MB to
// under 2 MB.
//
// Only the plain sprites get one. Shiny is used solely by the toggle on the
// specimen sheet, which shows the full artwork anyway.
const THUMBS = new URL("../public/sprites/thumb/", import.meta.url);
const THUMB_PX = 320;

// Seasonal forms are pokemon-form entries with no official artwork, so the two
// Deerling-line faces use the HOME set for all four seasons — see seasonForms.js.
const SEASON_SLUGS = ["585", "585-summer", "585-autumn", "585-winter", "586", "586-summer", "586-autumn", "586-winter"];

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
  return out;
}

// Resize whatever plain artwork is present into public/sprites/thumb/.
// Skips anything already made, like the downloader above it, so re-running is
// cheap. A sprite that failed to download simply has no thumbnail, and the app
// falls back to the full image for it.
async function makeThumbs(ids) {
  await mkdir(THUMBS, { recursive: true });

  const wanted = [
    ...ids.map((id) => ({ src: `${id}.png`, out: `${id}.webp` })),
    ...SEASON_SLUGS.map((slug) => ({ src: `home-${slug}.png`, out: `home-${slug}.webp` })),
  ].filter((t) => existsSync(new URL(t.src, OUT)) && !existsSync(new URL(t.out, THUMBS)));

  if (!wanted.length) {
    console.log("thumbnails: already made");
    return;
  }

  let made = 0;
  let failed = 0;
  for (const t of wanted) {
    try {
      await sharp(new URL(t.src, OUT).pathname.replace(/^\//, ""))
        .resize(THUMB_PX, THUMB_PX, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(new URL(t.out, THUMBS).pathname.replace(/^\//, ""));
      made += 1;
    } catch {
      // One unreadable source is not worth failing a build over; the app falls
      // back to the full artwork wherever a thumbnail is missing.
      failed += 1;
    }
  }
  console.log(`thumbnails: ${made} made${failed ? `, ${failed} skipped` : ""}`);
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
  if (!todo.length) {
    await makeThumbs(ids);
    return report(all.length);
  }

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
  await makeThumbs(ids);
  await report(all.length - missing.length);
}

async function report() {
  const files = await readdir(OUT);
  let bytes = 0;
  for (const f of files) bytes += (await stat(new URL(f, OUT))).size;
  console.log(`public/sprites/: ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB`);
}

await run();
