import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseFieldNotes } from "./fieldNotesLoader";
import {
  CAPTIONS,
  DURATION,
  SHEETS,
  TITLE,
  TRANSCRIPT,
  appear,
  formatNo,
  ROLL_HOPS,
  rollStops,
  rollTimeAt,
  track,
} from "./introFilm";
import { PLATES, TUMBLE } from "../components/film/drawings";

// The film is the first thing on the site, so the two ways it can go wrong
// that matter most are saying something the collection doesn't, and saying it
// too fast to read. Both are checked here rather than by watching it.

const notes = parseFieldNotes(
  readFileSync(new URL("../../public/field-notes.txt", import.meta.url), "utf8"),
);

describe("the film says only what the field notes say", () => {
  for (const s of SHEETS) {
    it(`${formatNo(s.no)}'s "${s.cf}" is in ${s.slug}'s own note`, () => {
      const note = notes[s.slug];
      expect(note, `no field note for ${s.slug}`).toBeTruthy();
      const text = `${note.plantAnalogue} ${note.note}`;
      expect(text).toContain(s.genus);
    });
  }

  it("never names the creature on screen — only the part, and the number", () => {
    const onScreen = [
      ...CAPTIONS.map((c) => c.text),
      ...SHEETS.flatMap((s) => [s.line, s.organ, s.cf]),
      TITLE.name,
      TITLE.sub,
      TITLE.stamp,
    ].join(" ").toLowerCase();
    for (const s of SHEETS) expect(onScreen).not.toContain(s.slug);
  });

  it("numbers specimens the way the Gallery cards do", () => {
    expect(formatNo(1)).toBe("NO. 0001");
    expect(formatNo(946)).toBe("NO. 0946");
  });
});

describe("the film can be read at the speed it plays", () => {
  // A generous reading rate for a short caption: 0.3s a word, plus most of a
  // second to notice it has changed at all.
  // Punctuation standing alone — a dash, a middle dot — is not a word.
  const needed = (text) => 0.8 + 0.3 * text.split(/\s+/).filter((w) => /\w/.test(w)).length;

  for (const c of CAPTIONS) {
    it(`"${c.text}" stays up long enough`, () => {
      expect(c.out - c.in).toBeGreaterThanOrEqual(needed(c.text));
    });
  }

  it("gives each sheet time to be read before the next arrives", () => {
    const starts = [...SHEETS.map((s) => s.at), TITLE.at];
    SHEETS.forEach((s, i) => {
      // the label line appears ~1.9s after the sheet does
      const onScreen = starts[i + 1] - (s.at + 1.9);
      expect(onScreen).toBeGreaterThanOrEqual(needed(`${s.line} ${s.organ} ${s.cf}`) - 1.5);
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
  });

  it("keeps each label narrow enough for a phone", () => {
    // the organ line is typed out on one unbroken line
    for (const s of SHEETS) expect(s.organ.length).toBeLessThanOrEqual(40);
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

describe("the tumbleweed rolls rather than skids", () => {
  const r = 100;
  const stops = rollStops(20, r);
  // The roll is emitted in percent of the 400-unit plate; read it back in
  // plate units, so the physics below is checked in the units it is true in.
  const parse = (tf) => {
    const [, x, y, deg] = tf.match(/translate\((-?[\d.]+)%, (-?[\d.]+)%\) rotate\((-?[\d.]+)deg\)/);
    return { x: +x * 4, y: +y * 4, deg: +deg };
  };

  it("turns x/r radians for every x it travels", () => {
    for (const [, p] of stops) {
      const { x, deg } = parse(p.transform);
      expect(deg).toBeCloseTo((x / r) * (180 / Math.PI), -0.5);
    }
  });

  it("comes to rest where it was drawn", () => {
    expect(parse(stops.at(-1)[1].transform)).toEqual({ x: 0, y: 0, deg: 0 });
  });

  it("only ever hops upward, never through the ground", () => {
    for (const [, p] of stops) expect(parse(p.transform).y).toBeLessThanOrEqual(0);
  });

  it("starts wholly off the sheet, so it rolls in rather than appearing", () => {
    // ~827 units is where a desktop sheet ends; 1.1r allows for stragglers.
    expect(ROLL_HOPS[0][1] + TUMBLE.cx - TUMBLE.r * 1.1).toBeGreaterThan(827);
  });

  it("drops each seed behind the plant, never in front of it", () => {
    for (const x of [380, 322, 272]) {
      const lag = 40;
      const t = rollTimeAt(x + lag - TUMBLE.cx);
      expect(t).toBeGreaterThan(0);
      expect(t).toBeLessThan(ROLL_HOPS.at(-1)[0]);
      // later seeds, further left, fall later
      expect(rollTimeAt(x - 60 + lag - TUMBLE.cx)).toBeGreaterThan(t);
    }
  });
});

describe("the plates", () => {
  it("are generated the same on every load", async () => {
    const again = await import("../components/film/drawings.js?again");
    expect(JSON.stringify(again.PLATES)).toBe(JSON.stringify(PLATES));
  });

  it("give every drawn plate contour lines to draw", () => {
    for (const id of ["corm", "pitcher"]) {
      const ink = PLATES[id].layers.filter((l) => l.kind === "ink");
      expect(ink.length).toBeGreaterThan(8);
      for (const l of ink) expect(l.d).toMatch(/^M-?[\d.]+,-?[\d.]+/);
    }
  });
});

describe("the transcript", () => {
  it("carries every line of the film, in order", () => {
    const lines = [
      CAPTIONS[0].text,
      CAPTIONS[1].text,
      ...SHEETS.map((s) => s.line),
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
