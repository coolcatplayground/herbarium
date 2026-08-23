import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { buildQuery, clean, appendBlock } from "./harvest-manuscripts.mjs";
import { parseManuscripts } from "../src/data/manuscriptsLoader.js";

// Aimed at the parts of the harvester that can fail *quietly* — the ones that
// produce a plausible-looking wrong result rather than an error. Same instinct
// as the rest of this project's tests: guard the failures that actually happen.

describe("buildQuery", () => {
  const theme = { key: "t", terms: ['"allelopathy"', ['"action potential"', '"plant"']] };

  it("repeats the field prefix on every phrase of a compound term", () => {
    // The bug this exists for: a prefix binds to one phrase, so
    // `TITLE_ABS:"action potential" AND "plant"` lets the second phrase escape
    // into a free-text search over every field. That matched a cardiac
    // pacemaker study against a carnivorous-plant query.
    const q = buildQuery(theme, "2026-01-01", "2026-02-01");
    expect(q).toContain('(TITLE_ABS:"action potential" AND TITLE_ABS:"plant")');
    expect(q).not.toMatch(/TITLE_ABS:"action potential" AND "plant"/);
  });

  it("ORs the theme's terms and ANDs the filters", () => {
    const q = buildQuery(theme, "2026-01-01", "2026-02-01");
    expect(q).toContain('(TITLE_ABS:"allelopathy") OR');
    expect(q).toContain("AND (FIRST_PDATE:[2026-01-01 TO 2026-02-01])");
  });

  it("always constrains to open access", () => {
    // manuscripts.txt calls a paywalled paper a dead end for the
    // non-specialists who follow a link in. Losing this filter would quietly
    // fill the queue with papers that can never be used.
    expect(buildQuery(theme, "2026-01-01", "2026-02-01")).toContain("OPEN_ACCESS:Y");
  });
});

describe("clean", () => {
  // Europe PMC italicises species names and returns the markup escaped, so a
  // title arrives as `&lt;i&gt;Morus&lt;/i&gt;`. Titles go verbatim into
  // manuscripts.txt, so anything left here lands in the content file.
  it("decodes escaped markup and then removes it", () => {
    expect(clean("MYB Family in &lt;i&gt;Morus atropurpurea&lt;/i&gt;")).toBe(
      "MYB Family in Morus atropurpurea"
    );
  });

  it("does not let a double-escaped entity resurrect a tag", () => {
    expect(clean("a &amp;lt;i&amp;gt; b")).toBe("a &lt;i&gt; b");
  });

  it("strips literal tags too", () => {
    expect(clean("<i>Dionaea</i> traps")).toBe("Dionaea traps");
  });
});

describe("appendBlock", () => {
  const paper = {
    theme: { key: "mycorrhiza" },
    doi: "10.1234/abcd",
    title: "A paper about roots",
    authors: "Chen X, Liang Y",
    year: "2026",
    journal: "Genes, 17",
  };
  const existing = "### old-entry\r\ndoi: 10.1/x\r\n### END\r\n";

  it("writes pure CRLF, never mixed endings", () => {
    // The standing rule for editing these files from a script. A file with
    // mixed endings is the exact silent-parse failure of MILESTONE §6.1.
    const out = appendBlock(existing, paper);
    expect((out.match(/\r/g) || []).length).toBe((out.match(/\n/g) || []).length);
    expect(out).not.toMatch(/[^\r]\n/);
  });

  it("normalises an LF-saved file rather than mixing into it", () => {
    const out = appendBlock("### old\ndoi: 10.1/x\n### END\n", paper);
    expect((out.match(/\r/g) || []).length).toBe((out.match(/\n/g) || []).length);
  });

  it("leaves connection blank for the curator", () => {
    // manuscripts.txt reserves this field for the curator's own reading and
    // says outright not to restate the abstract in it. Pre-filling it would
    // put words in their mouth on a published page.
    expect(appendBlock(existing, paper)).toMatch(/connection: *\r\n/);
    expect(appendBlock(existing, paper)).toMatch(/related_specimen: *\r\n/);
  });

  it("keeps the existing content intact", () => {
    const out = appendBlock(existing, paper);
    expect(out).toContain("### old-entry");
    expect(out).toContain("doi: 10.1234/abcd");
    expect(out.trimEnd()).toMatch(/### END$/);
  });
});

// End-to-end against the real content file and the real Reading Room parser.
// This is the check that matters: a kept block is worthless if the app can't
// read it, and malformed blocks fail silently here rather than loudly.
describe("a kept paper, through the real loader", () => {
  const real = readFileSync(new URL("../public/manuscripts.txt", import.meta.url), "utf8");
  const paper = {
    theme: { key: "mycorrhiza" },
    doi: "10.1234/newpaper",
    title: "Ontogenetic shifts in mycorrhiza-mediated neighbourhood effects",
    authors: "Chen X, Liang Y",
    year: "2026",
    journal: "Ecology and evolution, 16",
  };

  it("does not disturb the entries already there", () => {
    const before = parseManuscripts(real).length;
    expect(parseManuscripts(appendBlock(real, paper)).length).toBe(before);
  });

  it("stays out of the Reading Room until the connection is written", () => {
    // Kept is not published. The loader requires a non-empty `connection`, so
    // a harvested paper sits in the file as a draft until the curator writes
    // their own reading of it — which is the whole point of leaving it blank.
    const parsed = parseManuscripts(appendBlock(real, paper));
    expect(parsed.find((e) => e.link.includes("10.1234/newpaper"))).toBeUndefined();
  });

  it("appears once the connection is filled in", () => {
    const withConnection = appendBlock(real, paper).replace(
      /connection: \r\n### END\r\n$/,
      "connection: My reading of it.\r\n### END\r\n"
    );
    const entry = parseManuscripts(withConnection).find((e) => e.link.includes("10.1234/newpaper"));
    expect(entry).toBeDefined();
    expect(entry.title).toBe(paper.title);
    expect(entry.openAccess).toBe(true);
  });
});
