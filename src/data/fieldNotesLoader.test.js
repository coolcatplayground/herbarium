import { describe, it, expect } from "vitest";
import { parseFieldNotes } from "./fieldNotesLoader";

// The single most important test in the repo. See DEVLOG §18 / MILESTONE §6.1:
// every plain-text file was parsing to zero entries because `.` in a JS regex
// does not match `\r`, and the files are CRLF because Notepad writes CRLF —
// so the intended authoring workflow produced exactly the files the parser
// could not read, and it failed silently in production for weeks.
const BLOCK_FIELDS = [
  "### bulbasaur   [DRAFT — please review]",
  "binomial: Bulbasaur bulbus-viridis",
  "plant_analogue: Corms & bulbs",
  "genetic_concept: Vegetative storage organs",
  "note: The bulb is a storage organ.",
  "habitat_note: Stored food that cannot run away is heavily defended.",
  "record: Reported since 1998 as carrying a seed on its back.",
  "### END",
];

const join = (eol) => BLOCK_FIELDS.join(eol) + eol;

describe("line endings", () => {
  it.each([
    ["LF", "\n"],
    ["CRLF", "\r\n"],
    ["lone CR", "\r"],
  ])("parses a block written with %s endings", (_label, eol) => {
    const parsed = parseFieldNotes(join(eol));
    expect(parsed.bulbasaur).toBeDefined();
    expect(parsed.bulbasaur.note).toBe("The bulb is a storage organ.");
    expect(parsed.bulbasaur.habitatNote).toBe("Stored food that cannot run away is heavily defended.");
    expect(parsed.bulbasaur.record).toBe("Reported since 1998 as carrying a seed on its back.");
    expect(parsed.bulbasaur.binomial).toBe("Bulbasaur bulbus-viridis");
  });

  it("gives identical results for LF and CRLF", () => {
    expect(parseFieldNotes(join("\n"))).toEqual(parseFieldNotes(join("\r\n")));
  });
});

describe("block shape", () => {
  it("skips the TEMPLATE block so it never appears as a specimen", () => {
    const text = "### TEMPLATE\r\nnote: fill this in\r\n### END\r\n" + join("\r\n");
    const parsed = parseFieldNotes(text);
    expect(parsed.template).toBeUndefined();
    expect(parsed.bulbasaur).toBeDefined();
  });

  it("keeps a block that has only a habitat_note, since a form may carry just one", () => {
    const parsed = parseFieldNotes("### sceptile-mega\r\nhabitat_note: Lignin is what makes wood.\r\n### END\r\n");
    expect(parsed["sceptile-mega"].habitatNote).toBe("Lignin is what makes wood.");
    expect(parsed["sceptile-mega"].note).toBe("");
  });

  it("drops a block with none of note, habitat_note or record", () => {
    const parsed = parseFieldNotes("### ghostblock\r\nbinomial: Nothing useful\r\n### END\r\n");
    expect(parsed.ghostblock).toBeUndefined();
  });

  it("does not let a missing record blank out the note beside it", () => {
    const parsed = parseFieldNotes("### oddish\r\nnote: A geophyte.\r\n### END\r\n");
    expect(parsed.oddish.note).toBe("A geophyte.");
    expect(parsed.oddish.record).toBe("");
  });

  it("joins a field wrapped across several lines back into one string", () => {
    const parsed = parseFieldNotes("### tangela\r\nnote: A vine that\r\nborrows its structure\r\nrather than building it.\r\n### END\r\n");
    expect(parsed.tangela.note).toBe("A vine that borrows its structure rather than building it.");
  });

  it("stops reading a block at ### END rather than bleeding into the next", () => {
    const parsed = parseFieldNotes(join("\r\n") + "### oddish\r\nnote: A separate specimen.\r\n### END\r\n");
    expect(parsed.bulbasaur.note).toBe("The bulb is a storage organ.");
    expect(parsed.oddish.note).toBe("A separate specimen.");
  });

  // Documents a real footgun rather than an ideal. The parser cannot tell an
  // unknown field from a wrapped continuation line, so a mistyped field name is
  // silently absorbed into whichever field precedes it — it neither errors nor
  // shows up. content.test.js guards the real file against exactly this.
  it("absorbs an unrecognised field into the preceding one", () => {
    const parsed = parseFieldNotes("### oddish\r\nnote: A geophyte.\r\nhabitat_not: typo here\r\n### END\r\n");
    expect(parsed.oddish.note).toBe("A geophyte. habitat_not: typo here");
    expect(parsed.oddish.habitatNote).toBe("");
  });

  it("returns an empty map for empty input rather than throwing", () => {
    expect(parseFieldNotes("")).toEqual({});
  });
});
