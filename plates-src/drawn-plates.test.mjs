import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { parseFieldNotes } from "../src/data/fieldNotesLoader";

// Every plate drawn in code belongs to a specimen the collection holds, draws
// the same every time, and has actually been rendered — a drawing that exists
// only as source is a drawing nobody sees.

const here = new URL("./", import.meta.url);
// shared modules (lib, organ, parts) sit beside the plates; a plate is a module named for its specimen
const SHARED = new Set(["lib.mjs", "organ.mjs", "parts.mjs", "kit.mjs"]);
const isPlate = (f) => f.endsWith(".mjs") && !SHARED.has(f) && !f.endsWith(".test.mjs");
const modules = readdirSync(here).filter(isPlate);
const notes = parseFieldNotes(readFileSync(new URL("../public/field-notes.txt", import.meta.url), "utf8"));

describe("drawn plates", () => {
  it("exist", () => {
    expect(modules.length).toBeGreaterThan(0);
  });

  for (const file of modules) {
    describe(file, async () => {
      const plate = await import(pathToFileURL(fileURLToPath(new URL(file, here))).href);

      it("names a specimen the collection holds", () => {
        expect(plate.slug).toMatch(/^[a-z0-9-]+$/);
        expect(notes[plate.slug], `no field note for ${plate.slug}`).toBeTruthy();
        expect(Number.isInteger(plate.no)).toBe(true);
      });

      it("draws the same every time", () => {
        const a = plate.draw(), b = plate.draw();
        expect(a.body).toBe(b.body);
        expect(a.defs).toBe(b.defs);
      });

      // An index past the end of a palette writes fill="undefined", which
      // renders black; a bad coordinate writes NaN and drops the shape. Both
      // pass silently, and the black one once put a pair of dark "eyes" in a
      // bush.
      it("writes no undefined or NaN into its drawing", () => {
        const { body, defs } = plate.draw();
        expect(body + defs).not.toMatch(/undefined|NaN/);
      });

      it("stays on its board, cropped to something inside it", () => {
        const { size, view = [0, 0, size, size] } = plate.draw();
        const [x, y, w, h] = view;
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(x + w).toBeLessThanOrEqual(size);
        expect(y + h).toBeLessThanOrEqual(size);
      });

      it("has been rendered to public/plates", () => {
        expect(existsSync(new URL(`../public/plates/${plate.slug}.webp`, import.meta.url)), "run npm run plates:draw").toBe(true);
      });
    });
  }
});
