import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseFieldNotes } from "./fieldNotesLoader";
import habitatMap from "./habitatMap";
import plates from "./plates.json";
import {
  CAPTIONS,
  DURATION,
  SHEETS,
  SHEET_SLIDE,
  TITLE,
  TRANSCRIPT,
  appear,
  formatNo,
  formatRoom,
  track,
} from "./introFilm";

// The film is the first thing on the site, so the two ways it can go wrong
// that matter most are saying something the collection doesn't, and saying it
// too fast to read. Both are checked here rather than by watching it.

const notes = parseFieldNotes(
  readFileSync(new URL("../../public/field-notes.txt", import.meta.url), "utf8"),
);

describe("the film says only what the collection says", () => {
  for (const s of SHEETS) {
    it(`${formatNo(s.no)}'s "${s.cf}" rests on ${s.slug}'s own note`, () => {
      const note = notes[s.slug];
      expect(note, `no field note for ${s.slug}`).toBeTruthy();
      expect(`${note.plantAnalogue} ${note.note}`).toContain(s.genus);
      // and the line on screen is about that word, not a different plant
      expect(s.cf.toLowerCase()).toContain(s.genus.toLowerCase());
    });
  }

  it("visits every room in the Gallery exactly once", () => {
    const rooms = SHEETS.map((s) => s.habitat);
    expect(new Set(rooms).size).toBe(rooms.length);
    expect([...rooms].sort()).toEqual(Object.keys(habitatMap).sort());
  });

  it("shows each specimen by a plate the Gallery actually serves", () => {
    for (const s of SHEETS) expect(plates, s.slug).toHaveProperty(s.slug);
  });

  it("climbs through the collection in number order", () => {
    const nos = SHEETS.map((s) => s.no);
    expect([...nos].sort((a, b) => a - b)).toEqual(nos);
  });

  it("never names the creature on screen — only the part, and the number", () => {
    const onScreen = [
      ...CAPTIONS.map((c) => c.text),
      ...SHEETS.flatMap((s) => [s.room, s.part, s.cf]),
      TITLE.name,
      TITLE.sub,
      TITLE.stamp,
    ].join(" ").toLowerCase();
    for (const s of SHEETS) expect(onScreen).not.toContain(s.slug.split("-")[0]);
  });

  it("numbers specimens the way the Gallery cards do, and rooms out of the whole", () => {
    expect(formatNo(1)).toBe("NO. 0001");
    expect(formatNo(952)).toBe("NO. 0952");
    expect(formatRoom(0)).toBe(`Room 01 of ${SHEETS.length}`);
  });
});

describe("the film can be read at the speed it plays", () => {
  // A generous reading rate for a short caption: 0.3s a word, plus most of a
  // second to notice it has changed at all.
  // Punctuation standing alone — a dash, an ampersand — is not a word.
  const needed = (text) => 0.8 + 0.3 * text.split(/\s+/).filter((w) => /\w/.test(w)).length;

  for (const c of CAPTIONS) {
    it(`"${c.text}" stays up long enough`, () => {
      expect(c.out - c.in).toBeGreaterThanOrEqual(needed(c.text));
    });
  }

  it("leaves each room's name up long enough to read", () => {
    // The label arrives ~0.3s after its sheet does and is only covered once
    // the next sheet has finished sliding over it.
    const next = [...SHEETS.slice(1).map((s) => s.at), TITLE.at + 1.3 - SHEET_SLIDE];
    SHEETS.forEach((s, i) => {
      const onScreen = next[i] + SHEET_SLIDE - (s.at + 0.45);
      expect(onScreen, s.room).toBeGreaterThanOrEqual(needed(s.room));
    });
  });

  it("puts every cue inside the running time, in order", () => {
    const cues = [
      ...CAPTIONS.flatMap((c) => [c.in, c.out]),
      ...SHEETS.map((s) => s.at),
      TITLE.at,
      TITLE.placardAt,
      TITLE.stampAt,
    ];
    for (const t of cues) {
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThan(DURATION);
    }
    const sheetStarts = SHEETS.map((s) => s.at);
    expect([...sheetStarts].sort((a, b) => a - b)).toEqual(sheetStarts);
    expect(CAPTIONS[1].out).toBeLessThanOrEqual(SHEETS[0].at);
    expect(SHEETS.at(-1).at).toBeLessThan(TITLE.at);
  });

  it("keeps each label narrow enough for a phone", () => {
    // the part is set on one unbroken line
    for (const s of SHEETS) expect(`the ${s.part}`.length).toBeLessThanOrEqual(24);
  });
});

describe("the clock", () => {
  it("pins every track to both ends and carries every property in every frame", () => {
    const frames = track([
      [4, { opacity: 0 }],
      [5, { opacity: 1, transform: "scale(1.1)" }],
    ]);
    expect(frames[0].offset).toBe(0);
    expect(frames.at(-1).offset).toBe(1);
    for (const f of frames) {
      expect(f).toHaveProperty("opacity");
      expect(f).toHaveProperty("transform");
    }
    const offsets = frames.map((f) => f.offset);
    expect([...offsets].sort((a, b) => a - b)).toEqual(offsets);
  });

  it("back-fills a property that only appears later with its first value", () => {
    const frames = track([
      [2, { opacity: 0 }],
      [3, { transform: "scale(2)" }],
    ]);
    expect(frames[0].transform).toBe("scale(2)");
  });

  it("brings an appearance fully in and fully back out", () => {
    const f = appear(2, 6);
    expect(f[0].opacity).toBe(0);
    expect(Math.max(...f.map((k) => k.opacity))).toBe(1);
    expect(f.at(-1).opacity).toBe(0);
  });
});

describe("the transcript", () => {
  it("carries every line of the film, in order", () => {
    const lines = [
      CAPTIONS[0].text,
      CAPTIONS[1].text,
      ...SHEETS.flatMap((s) => [s.room, s.cf]),
      CAPTIONS[2].text,
      TITLE.name,
      TITLE.stamp,
    ];
    let from = 0;
    for (const l of lines) {
      const at = TRANSCRIPT.indexOf(l, from);
      expect(at, l).toBeGreaterThanOrEqual(0);
      from = at + l.length;
    }
  });
});
