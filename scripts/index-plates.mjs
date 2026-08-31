// Indexes public/plates/ into src/data/plates.json.
//
//   npm run plates
//
// The plates are the curator's own illustrations — one per specimen, drawn as
// the botanical part rather than the character, so that a picture of a corm is
// a picture of a corm. They replace the official artwork specimen by specimen:
// where a plate exists the site shows it, and where one does not it falls back
// to the sprite, so the collection is never half-broken while the set is drawn.
//
// Why a manifest rather than just trying the file: without one, every specimen
// with no plate yet costs a failed request and a console error on every gallery
// scroll — 147 of them today. The app imports this list and only ever asks for
// a plate it knows exists.
//
// Generated, never hand-edited. `npm run build` regenerates it, so a plate
// dropped into the folder is live at the next deploy with nothing else to do.
import { readdir, writeFile, mkdir } from "node:fs/promises";

const PLATES = new URL("../public/plates/", import.meta.url);
const OUT = new URL("../src/data/plates.json", import.meta.url);

// Whatever a browser will decode. WebP first because that is what these should
// be; the rest are here so a working file is never ignored for its extension.
const ALLOWED = /\.(webp|png|jpg|jpeg|avif|svg)$/i;

async function run() {
  await mkdir(PLATES, { recursive: true });

  let files = [];
  try {
    files = await readdir(PLATES);
  } catch {
    // An absent folder means no plates yet, which is a valid state.
  }

  const plates = {};
  for (const file of files.sort()) {
    if (!ALLOWED.test(file)) continue;
    // The key is the specimen slug, exactly as PokéAPI spells it and exactly as
    // field-notes.txt keys its blocks: bulbasaur, venusaur-mega, wo-chien.
    const name = file.replace(ALLOWED, "").toLowerCase();
    if (plates[name]) {
      console.warn(`  two files for "${name}" — keeping ${plates[name]}, ignoring ${file}`);
      continue;
    }
    plates[name] = file;
  }

  const names = Object.keys(plates);
  await writeFile(OUT, JSON.stringify(plates, null, 2) + "\n");
  console.log(
    names.length
      ? `plates: ${names.length} indexed — ${names.slice(0, 6).join(", ")}${names.length > 6 ? " …" : ""}`
      : "plates: none yet, the site falls back to sprites throughout",
  );
}

run();
