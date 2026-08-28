import { describe, it, expect } from "vitest";
import {
  MAIL_PAPERS,
  MESSAGE_MAX,
  NAME_MAX,
  MAILTO_MAX,
  getPaper,
  wrapText,
  buildLetter,
  letterSubject,
  mailtoHref,
} from "./curatorMail";

// What is actually worth testing here is the letter that leaves the building.
// The composer can be looked at; the letter cannot, because by the time anyone
// notices it is wrong it is already in somebody's inbox.

describe("papers", () => {
  it("gives every paper the fields the sheet and the letter both need", () => {
    for (const paper of MAIL_PAPERS) {
      expect(paper.id).toMatch(/^[a-z]+$/);
      expect(paper.name).toBeTruthy();
      expect(paper.glyph).toHaveLength(1);
      expect(paper.tint).toContain("gradient");
      expect(paper.accent).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("has no duplicate ids or glyphs", () => {
    expect(new Set(MAIL_PAPERS.map((p) => p.id)).size).toBe(MAIL_PAPERS.length);
    expect(new Set(MAIL_PAPERS.map((p) => p.glyph)).size).toBe(MAIL_PAPERS.length);
  });

  it("falls back to the first paper rather than throwing on an unknown id", () => {
    expect(getPaper("no-such-paper")).toBe(MAIL_PAPERS[0]);
    expect(getPaper(undefined)).toBe(MAIL_PAPERS[0]);
  });
});

describe("wrapText", () => {
  it("keeps every line inside the sheet width", () => {
    const text = "A corm is solid stem tissue and a bulb is packed leaf bases, "
      + "which is the whole of the difference between them.";
    for (const line of wrapText(text, 40)) expect(line.length).toBeLessThanOrEqual(40);
  });

  it("keeps paragraph breaks, because a letter written in paragraphs should arrive in them", () => {
    expect(wrapText("first\n\nsecond", 40)).toEqual(["first", "", "second"]);
  });

  it("hard-breaks a word longer than the sheet instead of letting it run off", () => {
    // The realistic case is a DOI or a URL in a correction.
    const doi = "10.1111/j.1469-8137.2009.02975.x-and-then-some-more-characters";
    const lines = wrapText(`see ${doi} for it`, 20);
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(20);
    expect(lines.join("")).toContain("10.1111");
  });

  it("trims blank lines off both ends", () => {
    expect(wrapText("\n\n  hello  \n\n", 40)).toEqual(["hello"]);
  });

  it("survives an empty message", () => {
    expect(wrapText("", 40)).toEqual([]);
  });
});

describe("buildLetter", () => {
  const letter = buildLetter({
    paper: "fern",
    from: "Chacu",
    message: "The Bulbasaur note says a corm has no layers.\n\nGladiolus corms have tunics.",
  });

  it("names the paper and signs the sender", () => {
    expect(letter).toContain("FERN MAIL");
    expect(letter).toContain("❦");
    expect(letter).toContain("from — Chacu");
  });

  it("carries the message through, paragraphs intact", () => {
    // Asserted on the words rather than on whole lines, because where the wrap
    // falls is the sheet width's business and this test is not about that.
    const flat = letter.replace(/\s+/g, " ");
    expect(flat).toContain("The Bulbasaur note says a corm has no layers.");
    expect(flat).toContain("Gladiolus corms have tunics.");
    // The blank line between the two paragraphs survives the round trip.
    expect(letter).toMatch(/layers\.\n\n/);
  });

  it("draws no right-hand edge, so a proportional font cannot make it ragged", () => {
    // The rule lines are the only thing with a fixed width; nothing else is
    // padded to a margin. If a future change starts padding, this fails.
    const widths = new Set(letter.split("\n").filter(Boolean).map((l) => l.length));
    expect(widths.size).toBeGreaterThan(1);
    expect(letter).not.toMatch(/│\s*$/m);
  });

  it("says so plainly when no name was given rather than leaving a dangling dash", () => {
    const anon = buildLetter({ paper: "bloom", from: "", message: "hello" });
    expect(anon).toContain("from — a visitor who left no name");
  });

  it("strips control characters and bidi overrides but keeps the newlines", () => {
    // Built from escapes rather than typed: a literal override in a source
    // file is invisible, which is how it gets into one in the first place.
    const override = "\u202E";
    const nul = "\u0000";
    const out = buildLetter({
      paper: "bloom",
      from: `a${override}b`,
      message: `one${override}two${nul}\nthree`,
    });
    // Newlines are control characters too, and the letter is made of them —
    // so the assertion is per line, which is the actual claim being made.
    for (const line of out.split("\n")) expect(line).not.toMatch(/[\p{Cc}\p{Cf}]/u);
    expect(out).toContain("onetwo");
    expect(out).toContain("three");
    expect(out).toContain("from — ab");
  });

  it("enforces the caps the composer advertises", () => {
    const long = "x".repeat(MESSAGE_MAX + 200);
    const letterText = buildLetter({ paper: "bloom", from: "y".repeat(NAME_MAX + 20), message: long });
    expect(letterText.match(/x/g).length).toBe(MESSAGE_MAX);
    expect(letterText.match(/y/g).length).toBe(NAME_MAX);
  });

  it("does not fall over on an unknown paper", () => {
    expect(buildLetter({ paper: "nope", from: "a", message: "b" })).toContain("BLOOM MAIL");
  });
});

describe("letterSubject", () => {
  it("names the paper and the sender", () => {
    expect(letterSubject({ paper: "tide", from: "Chacu" })).toBe(
      "Tide Mail from Chacu — CC Herbarium",
    );
  });

  it("drops the sender clause rather than leaving it empty", () => {
    expect(letterSubject({ paper: "tide", from: "  " })).toBe("Tide Mail — CC Herbarium");
  });
});

describe("mailtoHref", () => {
  it("addresses the curator and encodes the letter", () => {
    const href = mailtoHref({ paper: "bloom", from: "Chacu", message: "hello" });
    expect(href.startsWith("mailto:")).toBe(true);
    expect(href).toContain("subject=");
    expect(decodeURIComponent(href.split("&body=")[1])).toContain("BLOOM MAIL");
  });

  it("encodes newlines rather than emitting a raw line break into a URL", () => {
    const href = mailtoHref({ paper: "bloom", from: "a", message: "one\ntwo" });
    expect(href).not.toContain("\n");
    expect(href).toContain("%0A");
  });

  // The reason MESSAGE_MAX is what it is: a full-length letter in Latin text,
  // with the longest name the composer will take, still has to hand off.
  it("hands off the longest Latin letter the composer will accept", () => {
    const href = mailtoHref({
      paper: "ember",
      from: "n".repeat(NAME_MAX),
      message: "word ".repeat(MESSAGE_MAX / 5),
    });
    expect(href).not.toBeNull();
    expect(href.length).toBeLessThanOrEqual(MAILTO_MAX);
  });

  // And the case that made the clipboard a first-class route rather than a
  // footnote. Every Thai character costs nine once percent-encoded, so a letter
  // of perfectly ordinary length blows the URL ceiling — which is not an error,
  // and must not be reported as one.
  it("declines the hand-off rather than truncating a letter in a non-Latin script", () => {
    const href = mailtoHref({
      paper: "bloom",
      from: "Chacu",
      message: "ก".repeat(300),
    });
    expect(href).toBeNull();
  });

  it("returns null rather than a truncated letter when anything else is over the ceiling", () => {
    const href = mailtoHref({
      address: "a".repeat(MAILTO_MAX),
      paper: "bloom",
      from: "a",
      message: "b",
    });
    expect(href).toBeNull();
  });
});
