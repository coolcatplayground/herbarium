import { describe, it, expect } from "vitest";
import { getSpecimenNote } from "./specimenNote";

// The two non-obvious rules this module exists to enforce, plus the trap found
// in DEVLOG §50. Both are invisible in the UI until a specimen quietly shows
// the wrong habitat text or an empty Collected Observations.
const notes = {
  sceptile: {
    binomial: "Sceptile arbor-agilis",
    plantAnalogue: "Woody seed pods",
    geneticConcept: "Structural lignification",
    note: "A tropical tree specimen.",
    habitatNote: "Buttress roots hold a big tree up without going deep.",
    record: "Reported since 2003 as raising the trees of a forest.",
  },
  "sceptile-mega": {
    binomial: "Sceptile arbor-agilis",
    plantAnalogue: "Woody seed pods",
    geneticConcept: "Structural lignification",
    note: "",
    habitatNote: "Lignin is what turns a green stem into wood.",
    record: "",
  },
  zarude: {
    binomial: "Zarude ficus-stranguloides",
    plantAnalogue: "Strangler fig",
    geneticConcept: "Parasitic vs free-living growth",
    note: "A canopy vine specimen.",
    habitatNote: "A strangler fig kills by manufacturing darkness.",
    record: "One entry credits its shed vines with feeding the forest.",
  },
  "zarude-dada": {
    binomial: "Zarude ficus-stranguloides",
    plantAnalogue: "Nurse plants and provisioned seed",
    geneticConcept: "Parental investment as a life stage",
    note: "A provisioning specimen with its own write-up.",
    habitatNote: "Seed size is how a plant equips its offspring for the dark.",
    record: "One entry credits its shed vines with feeding the forest.",
  },
};

describe("habitat notes are form-level and never inherited", () => {
  it("gives a form its own habitat note rather than the base species'", () => {
    const mega = getSpecimenNote("sceptile-mega", 0, notes);
    expect(mega.habitatNote).toBe("Lignin is what turns a green stem into wood.");
    expect(mega.habitatNote).not.toBe(notes.sceptile.habitatNote);
  });

  it("leaves the habitat note empty for a form that has none, rather than borrowing one", () => {
    const map = { ...notes, "sceptile-mega": { ...notes["sceptile-mega"], habitatNote: "" } };
    // Habitat is read off the *form's* typing, and a Mega routinely files under a
    // different room than its base — borrowing would describe the wrong habitat.
    expect(getSpecimenNote("sceptile-mega", 0, map).habitatNote).toBe("");
  });
});

describe("field notes are species-level and do inherit", () => {
  it("walks a suffixed form back to its base species for the note", () => {
    const mega = getSpecimenNote("sceptile-mega", 0, notes);
    expect(mega.note).toBe("A tropical tree specimen.");
    expect(mega.inherited).toBe(true);
    expect(mega.inheritedFrom).toBe("sceptile");
  });

  it("carries the record along with an inherited note", () => {
    expect(getSpecimenNote("sceptile-mega", 0, notes).record).toBe(notes.sceptile.record);
  });

  it("does not treat a real hyphenated name as a form of something", () => {
    // wo-chien, iron-leaves and brute-bonnet contain hyphens in their actual
    // names; the walk must only succeed if a block exists under the short name.
    const map = { ...notes, "wo-chien": { ...notes.zarude, note: "A grudge in dead leaves." } };
    const woChien = getSpecimenNote("wo-chien", 0, map);
    expect(woChien.inherited).toBe(false);
    expect(woChien.note).toBe("A grudge in dead leaves.");
  });
});

describe("a form carrying its own note (DEVLOG §50)", () => {
  it("never reaches the inheriting branch, so its record must be written out", () => {
    const dada = getSpecimenNote("zarude-dada", 0, notes);
    expect(dada.inherited).toBe(false);
    expect(dada.record).toBe(notes.zarude.record);
  });

  it("shows an empty record if one was left to inherit — the trap this test exists for", () => {
    const map = { ...notes, "zarude-dada": { ...notes["zarude-dada"], record: "" } };
    expect(getSpecimenNote("zarude-dada", 0, map).record).toBe("");
  });
});

describe("specimens with no block at all", () => {
  it("returns a clearly-labelled placeholder rather than throwing", () => {
    const unknown = getSpecimenNote("not-a-specimen", 42, notes);
    expect(unknown.curated).toBe(false);
    expect(unknown.note).toMatch(/hasn't been given a field annotation/);
  });

  it("still surfaces a habitat note when only that has been written", () => {
    const map = { orphan: { habitatNote: "Filed here for one reason.", note: "", record: "" } };
    const orphan = getSpecimenNote("orphan", 1, map);
    expect(orphan.curated).toBe(false);
    expect(orphan.habitatNote).toBe("Filed here for one reason.");
  });
});
