// The mail desk: papers to choose from, and the letter the curator receives.
//
// There is no server behind this site, so nothing here "sends" anything. The
// page composes a letter and hands it to the visitor's own mail client through
// a `mailto:` link, which is the only way a static site can post something
// without an account, a key, or a third party holding somebody's message. That
// constraint shapes everything below — see `buildLetter` for why the letter is
// drawn the way it is, and `MESSAGE_MAX` for why it is short.

export const CURATOR_ADDRESS = "coolcatruby128@gmail.com";

// Pokémon mail is short — a few lines on a small sheet — and the limit here is
// in that spirit, but it is also doing work. A `mailto:` URL has to survive
// being handed to the operating system, and the safe ceiling is around 2000
// characters once the body is percent-encoded.
//
// Measured, because the arithmetic is not intuitive: a 500-character letter in
// ordinary Latin text encodes to about 1780 characters, which fits. The same
// 500 characters in Thai encode to 5560, because every character costs nine.
// So the limit CANNOT guarantee a letter fits a mail link, and a size that
// could guarantee it — under 200 characters — would be useless for writing a
// correction in a non-Latin script.
//
// The composer therefore treats the clipboard as a first-class route rather
// than a fallback, and `mailtoHref` returns null when the hand-off will not
// fit. See the note on that function.
export const MESSAGE_MAX = 500;
export const NAME_MAX = 32;

// The width the letter is drawn to. Narrow on purpose: a mail client on a
// phone will not re-wrap a line that arrives pre-wrapped, it will let it run
// off the side, and 36 columns plus the indent fits every window it is likely
// to be read in.
const SHEET_WIDTH = 36;
const INDENT = "   ";

// Papers. These are real mail items: `id` is the PokéAPI item name, and the
// mark on each sheet is that item's own sprite, fetched into public/sprites/ by
// scripts/fetch-sprites.mjs along with everything else the site serves. Same
// footing as the type icons and the specimen artwork — recognisable official
// assets in a non-commercial fan project, per the disclaimer in README.md.
//
// Six of the thirty-six, each chosen because it maps to a room this collection
// actually has. The rest are listed by PokéAPI under the `all-mail` item
// category and cost one entry here plus one line in the fetcher to add; Flame
// Mail, for the fire-adapted flora, is the obvious next one.
//
// The colours are not eyeballed. Each sheet's tint and accent are derived from
// the dominant colour of its own sprite — desaturated for the tint, darkened
// for the accent until it clears 4.6:1 against the tint's darkest stop, which
// is what the 13px paper name needs. See DEVLOG §57.
//
// `glyph` is the paper's mark in the plain-text letter, where a sprite cannot
// go. All six are long-standing Unicode dingbats rather than emoji, because
// emoji arrive as colour images in some mail clients and as tofu in others,
// while these fall back to an ordinary glyph in any font that has them.
export const MAIL_PAPERS = [
  {
    id: "grass-mail",
    name: "Grass Mail",
    glyph: "❦",
    blurb: "the mono-Grass room, and the biggest one",
    tint: "linear-gradient(165deg, #f7fbf9 0%, #f0f7f4 55%, #e9f4f0 100%)",
    accent: "#1e7b59",
    rule: "rgba(30, 123, 89, 0.34)",
  },
  {
    id: "bloom-mail",
    name: "Bloom Mail",
    glyph: "✿",
    blurb: "anything in flower",
    tint: "linear-gradient(165deg, #fbf6fa 0%, #f8eff6 55%, #f5e7f2 100%)",
    accent: "#bd1f92",
    rule: "rgba(189, 31, 146, 0.34)",
  },
  {
    id: "tropic-mail",
    name: "Tropic Mail",
    glyph: "❧",
    blurb: "the canopy and the orchard",
    tint: "linear-gradient(165deg, #f8faf7 0%, #f2f7f0 55%, #edf3ea 100%)",
    accent: "#3f7923",
    rule: "rgba(63, 121, 35, 0.34)",
  },
  {
    id: "wave-mail",
    name: "Wave Mail",
    glyph: "✽",
    blurb: "the wetland rooms",
    tint: "linear-gradient(165deg, #f6fafb 0%, #eff6f8 55%, #e8f2f5 100%)",
    accent: "#187493",
    rule: "rgba(24, 116, 147, 0.34)",
  },
  {
    id: "snow-mail",
    name: "Snow Mail",
    glyph: "✻",
    blurb: "the treeline, and everything under snow",
    tint: "linear-gradient(165deg, #f6f6fb 0%, #efeff8 55%, #e8e8f5 100%)",
    accent: "#5454e3",
    rule: "rgba(84, 84, 227, 0.34)",
  },
  {
    id: "wood-mail",
    name: "Wood Mail",
    glyph: "✤",
    blurb: "lignin, timber and tree rings",
    tint: "linear-gradient(165deg, #faf9f7 0%, #f6f5f1 55%, #f2f1ea 100%)",
    accent: "#7d6b2c",
    rule: "rgba(125, 107, 44, 0.34)",
  },
];

export const DEFAULT_PAPER = MAIL_PAPERS[0].id;

export function getPaper(id) {
  return MAIL_PAPERS.find((p) => p.id === id) ?? MAIL_PAPERS[0];
}

// Control characters and bidi overrides are stripped rather than escaped.
// Nothing downstream is an interpreter — this text goes into a mail body — but
// an override that reverses the reading order of a letter is never anything but
// trouble, and nobody composing a note about corms needs one.
//
// Written as Unicode property escapes (\p{Cc} is every control character,
// \p{Cf} every format character, which is where the bidi overrides live)
// rather than as a literal character class. A class of raw control bytes is
// invisible in an editor and impossible to review, and writing one here by
// accident is exactly how this line was first got wrong.
const CONTROL = /[\p{Cc}\p{Cf}]/gu;

function clean(value, max) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    // Split first so the newlines just normalised are not themselves
    // stripped as control characters, which they are.
    .split("\n")
    .map((line) => line.replace(CONTROL, ""))
    .join("\n")
    .slice(0, max)
    .trim();
}

// Word wrap, with two behaviours worth stating because they are the ones that
// break if this is ever rewritten casually:
//   - Blank lines survive as blank lines, so a letter written in paragraphs
//     arrives in paragraphs.
//   - A single "word" longer than the sheet — a DOI, a URL, a hyphenated
//     binomial — is hard-broken rather than left to run off the edge, since a
//     mail client will not wrap it on our behalf.
export function wrapText(text, width = SHEET_WIDTH) {
  const out = [];
  for (const paragraph of String(text).split("\n")) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push("");
      continue;
    }
    let line = "";
    for (let word of words) {
      while (word.length > width) {
        if (line) {
          out.push(line);
          line = "";
        }
        out.push(word.slice(0, width));
        word = word.slice(width);
      }
      if (!line) line = word;
      else if (line.length + 1 + word.length <= width) line += ` ${word}`;
      else {
        out.push(line);
        line = word;
      }
    }
    if (line) out.push(line);
  }
  // A letter that ends on three blank lines should not arrive with them.
  while (out.length && out[out.length - 1] === "") out.pop();
  while (out.length && out[0] === "") out.shift();
  return out;
}

// The sheet, drawn in text.
//
// It has a left edge and no right one, which is deliberate. A full box needs
// every line padded to an identical width, and that only holds if the reader's
// client shows plain text in a monospace font — which Gmail, among others, does
// not. A right edge would therefore be ragged for a large share of readers, so
// there is none: the rules run left to right and nothing has to line up against
// a margin that may not exist.
export function buildLetter({ paper, from, message }) {
  const sheet = getPaper(paper);
  const name = clean(from, NAME_MAX);
  const body = wrapText(clean(message, MESSAGE_MAX));
  const rule = "─".repeat(SHEET_WIDTH);

  return [
    `${sheet.glyph} ${rule}`,
    `${INDENT}${sheet.name.toUpperCase()}`,
    "",
    ...body.map((line) => (line ? INDENT + line : "")),
    "",
    rule,
    `${INDENT}from — ${name || "a visitor who left no name"}`,
    `${INDENT}written at the CC Herbarium mail desk`,
  ].join("\n");
}

export function letterSubject({ paper, from }) {
  const sheet = getPaper(paper);
  const name = clean(from, NAME_MAX);
  return name
    ? `${sheet.name} from ${name} — CC Herbarium`
    : `${sheet.name} — CC Herbarium`;
}

// The ceiling a `mailto:` has to clear. Windows in particular truncates long
// shell arguments, and a letter arriving with its last sentence missing is
// worse than a composer that declines to hand it over.
export const MAILTO_MAX = 1900;

// Returns the href, or null when the encoded letter is too long for a mail
// client to be trusted with. The page treats null as "the clipboard is the way
// out" rather than as an error — the letter is perfectly good, it simply
// cannot travel down a URL. A letter written in a non-Latin script reaches this
// case at ordinary length, which is why the copy button is never the small
// print.
export function mailtoHref({ address = CURATOR_ADDRESS, paper, from, message }) {
  const href =
    `mailto:${address}` +
    `?subject=${encodeURIComponent(letterSubject({ paper, from }))}` +
    `&body=${encodeURIComponent(buildLetter({ paper, from, message }))}`;
  return href.length > MAILTO_MAX ? null : href;
}
