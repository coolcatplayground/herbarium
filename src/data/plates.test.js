import { describe, it, expect, vi } from "vitest";

// The plate layer exists so the illustrated set can arrive one drawing at a
// time without the collection ever looking half-finished. What has to hold is
// narrow and worth pinning: a specimen with a plate shows it, a specimen
// without falls back silently, and nothing is ever requested that is not in
// the manifest — that last one is why the manifest exists at all, since
// otherwise every undrawn specimen costs a failed request per gallery scroll.

vi.mock("./plates.json", () => ({
  default: {
    bulbasaur: "bulbasaur.webp",
    "venusaur-mega": "venusaur-mega.png",
  },
}));

const { hasPlate, plateUrl, plateCount } = await import("./plates");

describe("plates", () => {
  it("knows which specimens have been drawn", () => {
    expect(hasPlate("bulbasaur")).toBe(true);
    expect(hasPlate("venusaur-mega")).toBe(true);
    expect(hasPlate("oddish")).toBe(false);
  });

  it("returns null rather than a guessed path for a specimen with no plate", () => {
    // The gallery does `plateUrl(name) ?? thumbUrl(id)`, so null is the whole
    // fallback mechanism. A guessed URL here would 404 on 146 cards.
    expect(plateUrl("oddish")).toBeNull();
    expect(plateUrl(undefined)).toBeNull();
    expect(plateUrl("")).toBeNull();
  });

  it("uses the file name from the manifest, not an assumed extension", () => {
    // Plates may be webp, png or svg; the manifest records which, so a png
    // plate is not requested as a webp.
    expect(plateUrl("bulbasaur")).toContain("plates/bulbasaur.webp");
    expect(plateUrl("venusaur-mega")).toContain("plates/venusaur-mega.png");
  });

  it("matches the slug case-insensitively, since names arrive from two places", () => {
    // PokéAPI spells them lowercase and so does field-notes.txt, but the roster
    // passes names through several hands before they reach here.
    expect(hasPlate("Bulbasaur")).toBe(true);
    expect(plateUrl("VENUSAUR-MEGA")).toContain("venusaur-mega.png");
  });

  it("reports how far through the set the collection is", () => {
    expect(plateCount()).toBe(2);
  });

  it("does not confuse a hyphenated form with its base species", () => {
    // venusaur-mega is drawn here and venusaur is not; the walk that
    // specimenNote.js does for text must not happen for pictures, because a
    // Mega's plate is a different drawing.
    expect(hasPlate("venusaur")).toBe(false);
  });
});
