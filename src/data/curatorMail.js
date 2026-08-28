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

// Papers. These are real mail, and each one is two assets:
//
//   public/mail/<id>.png      the 256x192 stationery canvas the games draw
//                             behind a letter. Committed, because it comes
//                             from the Bulbagarden archives rather than from
//                             PokéAPI and is not something to make CI fetch.
//   public/sprites/<id>.png   the 24x24 bag icon, from PokéAPI's sprite
//                             repository like all the other artwork here,
//                             fetched by scripts/fetch-sprites.mjs, which
//                             reads its download list off this array.
//
// `id` is the PokéAPI item name and doubles as both filenames. Same footing as
// the type icons and the specimen artwork: recognisable official assets in a
// non-commercial fan project, per the disclaimer in README.md.
//
// Six of the twelve Generation IV designs. Generation IV specifically, because
// its whole set is 256x192 while Generation III's is 240x160, and a chooser
// full of sheets at two different aspect ratios looks like a bug. Each of the
// six maps to a room this collection actually has.
//
// `panel` is where the artwork itself puts a writing area, read off the art and
// given as fractions of the card. It matters twice over: the letter is
// positioned there, and `veil` was measured against the pixels inside *that*
// rect. Move one without the other and the contrast guarantee is void.
//
// `veil` is how opaque the writing panel has to be over that artwork for body
// ink to clear AA. Four of the six carry text on the panel their own art draws,
// needing between nothing and a third. Bloom and Bubble draw no writing area at
// all, so the letter goes on an opaque mounted card instead — measurement said
// a light wash would clear AA on both, but rendering it showed a translucent
// rectangle reads as a sticker stuck on the art, where a solid card reads as a
// label laid on it deliberately. That one is a judgement, and it was made by
// looking; the numbers are in the per-paper comments below.
//
// `accent` is the canvas's own dominant frame colour, darkened until it clears
// 4.6:1 against the label chip it sits on. See DEVLOG §58.
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
    blurb: "the mono-Grass room, and the largest one",
    accent: "#17824a",
    // Where this artwork puts its own writing area, as fractions of the card.
    panel: [0.16, 0.15, 0.84, 0.57],
    // 0.04 is what the pixels under this rect require; the rest is headroom.
    veil: 0.1,
  },
  {
    id: "air-mail",
    name: "Air Mail",
    glyph: "✤",
    blurb: "seeds that leave on the wind",
    accent: "#29823d",
    // Where this artwork puts its own writing area, as fractions of the card.
    panel: [0.08, 0.08, 0.92, 0.66],
    // Needs nothing: the artwork draws a white panel and the ink clears 6.9:1 on it.
    veil: 0,
  },
  {
    id: "bloom-mail",
    name: "Bloom Mail",
    glyph: "✿",
    blurb: "anything in flower",
    accent: "#d42575",
    // Where this artwork puts its own writing area, as fractions of the card.
    panel: [0.12, 0.14, 0.88, 0.64],
    // No writing panel in this artwork, so the letter goes on a mounted card
    // rather than a wash. 0.46 would have cleared AA; an opaque card reads as a
    // deliberate label instead of a sticker.
    veil: 0.88,
  },
  {
    id: "bubble-mail",
    name: "Bubble Mail",
    glyph: "✽",
    blurb: "the wetland rooms",
    accent: "#1f77b2",
    // Where this artwork puts its own writing area, as fractions of the card.
    panel: [0.12, 0.14, 0.88, 0.64],
    // No writing panel in this artwork, so the letter goes on a mounted card
    // rather than a wash. 0.2 would have cleared AA; an opaque card reads as a
    // deliberate label instead of a sticker.
    veil: 0.86,
  },
  {
    id: "snow-mail",
    name: "Snow Mail",
    glyph: "✻",
    blurb: "the treeline, and everything under snow",
    accent: "#6464ce",
    // Where this artwork puts its own writing area, as fractions of the card.
    panel: [0.11, 0.15, 0.89, 0.6],
    // 0 is what the pixels under this rect require; the rest is headroom.
    veil: 0.06,
  },
  {
    id: "flame-mail",
    name: "Flame Mail",
    glyph: "❧",
    blurb: "the flora that waits for fire",
    accent: "#d73226",
    // Where this artwork puts its own writing area, as fractions of the card.
    panel: [0.14, 0.13, 0.86, 0.55],
    // 0.28 is what the pixels under this rect require; the rest is headroom.
    veil: 0.34,
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
