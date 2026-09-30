// Renders every drawn plate in plates-src/ to public/plates/<slug>.webp.
//
//   npm run plates:draw            all of them
//   npm run plates:draw bulbasaur  just the ones named
//
// Then `npm run plates` (or a build) indexes them, and the site shows each
// plate in place of that specimen's sprite.
//
// Rendered at twice the output size and scaled down, so fine ink and stipple
// keep their weight instead of breaking up; saved with alpha, because a plate
// stands in the glass case on a transparent ground.
import { readdir, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL, fileURLToPath } from "node:url";
import sharp from "sharp";
import { svgDocument } from "../plates-src/lib.mjs";

const SRC = new URL("../plates-src/", import.meta.url);
const OUT = new URL("../public/plates/", import.meta.url);
const OUTPUT_PX = 1100; // the longer side

const only = process.argv.slice(2);
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => f.endsWith(".mjs") && f !== "lib.mjs" && !f.endsWith(".test.mjs"));
for (const file of files) {
  const plate = await import(pathToFileURL(fileURLToPath(new URL(file, SRC))).href);
  if (!plate.slug || !plate.draw) continue; // a shared module, not a plate
  if (only.length && !only.includes(plate.slug)) continue;
  const doc = plate.draw();
  const svg = svgDocument(doc);
  const [, , vw, vh] = doc.view || [0, 0, doc.size, doc.size];
  const scale = OUTPUT_PX / Math.max(vw, vh);
  const density = 72 * scale * 2;
  const webp = await sharp(Buffer.from(svg), { density })
    .resize(Math.round(vw * scale), Math.round(vh * scale))
    .webp({ quality: 88, alphaQuality: 92, effort: 6 })
    .toBuffer();
  await writeFile(new URL(`${plate.slug}.webp`, OUT), webp);
  console.log(`  ${plate.slug.padEnd(16)} ${String(plate.no).padStart(4, "0")}  ${Math.round(webp.length / 1024)} KB`);
}
