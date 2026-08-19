import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseFieldNotes } from "./fieldNotesLoader";
import { getSpecimenNote } from "./specimenNote";
import roster from "./__fixtures__/roster.json";

// Runs the real public/field-notes.txt rather than a fixture, because the file
// is hand-edited in Notepad and the failure mode that matters is a real edit
// quietly dropping a field. This is the audit from DEVLOG §51 made permanent:
// it is what found eleven specimens with no record at all.
//
// The roster is a committed snapshot — regenerate with `npm run roster:refresh`
// if PokéAPI gains new Grass-types.
const raw = readFileSync(new URL("../../public/field-notes.txt", import.meta.url), "utf8");
const notes = parseFieldNotes(raw);
const specimen = (name) => getSpecimenNote(name, 0, notes);

describe("the content file itself", () => {
  it("is CRLF, as Notepad writes it", () => {
    const cr = (raw.match(/\r/g) || []).length;
    const lf = (raw.match(/\n/g) || []).length;
    expect(cr).toBe(lf);
  });

  it("parses to a substantial number of blocks, not zero", () => {
    // §6.1 shipped a file that parsed to {} and looked merely unwritten.
    expect(Object.keys(notes).length).toBeGreaterThan(100);
  });

  it("contains no mistyped field names", () => {
    // The parser absorbs an unrecognised `word:` line into the field above it
    // instead of reporting it, so `habitat_not:` would vanish into the note and
    // the placard would simply never appear. Nothing catches that but this.
    const KNOWN = ["binomial", "plant_analogue", "genetic_concept", "note", "habitat_note", "record"];
    const unknown = new Set();
    for (const line of raw.replace(/\r\n?/g, "\n").split("\n")) {
      const m = line.match(/^([a-z_]+):/);
      if (m && !KNOWN.includes(m[1])) unknown.add(m[1]);
    }
    expect([...unknown]).toEqual([]);
  });

  it("has no block whose fields all came out empty", () => {
    const empty = Object.entries(notes)
      .filter(([, v]) => !v.note && !v.habitatNote && !v.record)
      .map(([k]) => k);
    expect(empty).toEqual([]);
  });
});

describe("every specimen in the roster", () => {
  it.each(roster.roster)("%s has a field note", (name) => {
    const s = specimen(name);
    expect(s.curated).toBe(true);
    expect(s.note.length).toBeGreaterThan(0);
  });

  it.each(roster.roster)("%s has a habitat placard", (name) => {
    expect(specimen(name).habitatNote.length).toBeGreaterThan(0);
  });

  it.each(roster.roster)("%s has a Pokédex record", (name) => {
    expect(specimen(name).record.length).toBeGreaterThan(0);
  });
});

describe("citations inside records", () => {
  // Records cite manuscript-style and the Citations list beside them is
  // generated from live data, so a malformed citation is a wrong reference
  // sitting next to correct ones. This checks shape, not attribution —
  // whether a claim belongs to the game it names is still a reading job.
  const CITATION = /\(Pokémon [^()]+, (\d{4})\)/g;

  it("uses the same citation form everywhere it cites", () => {
    const malformed = [];
    for (const name of roster.roster) {
      const record = specimen(name).record;
      for (const m of record.matchAll(/\(Pok[ée]mon[^)]*\)/g)) {
        if (!/^\(Pokémon .+, \d{4}\)$/.test(m[0])) malformed.push(`${name}: ${m[0]}`);
      }
    }
    expect(malformed).toEqual([]);
  });

  it("never cites a year outside the range of released games", () => {
    const bad = [];
    for (const name of roster.roster) {
      for (const m of specimen(name).record.matchAll(CITATION)) {
        const year = Number(m[1]);
        if (year < 1996 || year > new Date().getFullYear()) bad.push(`${name}: ${m[0]}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
