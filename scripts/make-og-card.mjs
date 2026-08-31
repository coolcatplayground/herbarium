// Rebuilds public/og-card.jpg, the image that appears when the site's link is
// pasted anywhere.
//
//   npm run og
//
// Committed rather than generated at build time, unlike the sprites: it is one
// 224 KB file that changes only when the source art does, and having it in the
// repo means a crawler can never arrive between a deploy and a generation step.
//
// No text is drawn on it. The exhibition hall already has CC-HERBARIUM painted
// into its signage, and every platform prints og:title beside the image, so an
// overlay would only say the same thing twice — in a font that would have to be
// installed on whichever machine ran this, which is its own trap.
//
// The crop is top-anchored for exactly one reason: the source is 1600x900 and
// the card is 1200x630, so about seventy pixels have to go, and taking them
// from the bottom keeps the signage that makes the image worth using.
import sharp from "sharp";
import { stat } from "node:fs/promises";

const SOURCE = new URL("../public/rooms/exhibition-hall.jpg", import.meta.url);
const OUT = new URL("../public/og-card.jpg", import.meta.url);

// 1200x630 is the size Facebook, LinkedIn, Slack, Discord and X all crop to.
const WIDTH = 1200;
const HEIGHT = 630;

const path = (url) => decodeURIComponent(url.pathname).replace(/^\//, "");

async function run() {
  await sharp(path(SOURCE))
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path(OUT));

  const { size } = await stat(OUT);
  console.log(`og-card.jpg  ${WIDTH}x${HEIGHT}  ${(size / 1024).toFixed(0)} KB`);

  // Every platform reads this over a slow mobile connection before it will show
  // the card at all, and several give up well before their documented ceiling.
  if (size > 1024 * 1024) {
    console.warn("  over 1 MB — some scrapers will skip it; lower the quality");
  }
}

run();
