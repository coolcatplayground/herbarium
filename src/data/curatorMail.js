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

// Papers. Original stationery in the collection's own idiom rather than
// reproductions of the in-game designs — the same idea, a tinted sheet with a
// motif and a themed rule, drawn from the plants this place is about.
//
// `glyph` is the paper's mark in the plain-text letter, where an SVG cannot
// go. All six are long-standing Unicode dingbats rather than emoji, because
// emoji arrive as colour images in some mail clients and as tofu in others,
// while these fall back to an ordinary glyph in any font that has them.
export const MAIL_PAPERS = [
  {
    id: "bloom",
    name: "Bloom Mail",
    glyph: "✿",
    blurb: "Dusty rose, for a flowering thought",
    tint: "linear-gradient(165deg, #fdf6f7 0%, #fbeef1 55%, #f7e6ea 100%)",
    accent: "#9e4763",
    rule: "rgba(158, 71, 99, 0.34)",
  },
  {
    id: "fern",
    name: "Fern Mail",
    glyph: "❦",
    blurb: "Sage green, for a note out of the shade",
    tint: "linear-gradient(165deg, #f6faf5 0%, #eef6ef 55%, #e6f1e8 100%)",
    accent: "#356044",
    rule: "rgba(53, 96, 68, 0.32)",
  },
  {
    id: "orchard",
    name: "Orchard Mail",
    glyph: "❧",
    blurb: "Butter gold, for something in season",
    tint: "linear-gradient(165deg, #fdfaef 0%, #fbf4e2 55%, #f7edd4 100%)",
    accent: "#805c14",
    rule: "rgba(128, 92, 20, 0.34)",
  },
  {
    id: "moss",
    name: "Moss Mail",
    glyph: "✤",
    blurb: "Deep green, for the forest floor",
    tint: "linear-gradient(165deg, #f4f8f3 0%, #e9f2ea 55%, #dfebe1 100%)",
    accent: "#2b5439",
    rule: "rgba(43, 84, 57, 0.32)",
  },
  {
    id: "tide",
    name: "Tide Mail",
    glyph: "✽",
    blurb: "Pale water, for the wetland rooms",
    tint: "linear-gradient(165deg, #f2f9fa 0%, #e8f3f5 55%, #dfedf0 100%)",
    accent: "#245863",
    rule: "rgba(36, 88, 99, 0.32)",
  },
  {
    id: "ember",
    name: "Ember Mail",
    glyph: "❈",
    blurb: "Warm amber, for a plant that waits for fire",
    tint: "linear-gradient(165deg, #fdf6f0 0%, #faece0 55%, #f5e1d0 100%)",
    accent: "#8c4a20",
    rule: "rgba(140, 74, 32, 0.34)",
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
