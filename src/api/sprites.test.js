import { describe, it, expect } from "vitest";
import { spriteUrl, thumbUrl, remoteSpriteUrl, onSpriteError } from "./pokeapi";

// The sprite fallback is the safety net for a fresh clone that has not run
// `npm run sprites` yet, and it is invisible until it is needed — by which
// point it is a page of broken images. It also gained a rung when thumbnails
// arrived, so the order of the steps is worth pinning down.

// A stand-in for the img the error fires on. React hands the handler an event
// whose currentTarget is the element; only `src` and `dataset` are read.
function fakeImg(src) {
  return { currentTarget: { src, dataset: {} } };
}

describe("sprite urls", () => {
  it("serves both sizes from our own origin, never the source host", () => {
    expect(spriteUrl(1)).not.toContain("githubusercontent");
    expect(thumbUrl(1)).not.toContain("githubusercontent");
    expect(spriteUrl(1)).toContain("sprites/1.png");
    expect(thumbUrl(1)).toContain("sprites/thumb/1.webp");
  });

  it("keeps shiny on the full artwork only — there are no shiny thumbnails", () => {
    expect(spriteUrl(1, true)).toContain("1-shiny.png");
    // thumbUrl takes no shiny argument; passing one must not invent a path.
    expect(thumbUrl(1, true)).toBe(thumbUrl(1));
  });
});

describe("onSpriteError", () => {
  it("steps a missing thumbnail down to the full local artwork, not to the network", () => {
    const e = fakeImg("http://x/sprites/thumb/470.webp");
    onSpriteError(e);
    expect(e.currentTarget.src).toContain("sprites/470.png");
    expect(e.currentTarget.src).not.toContain("githubusercontent");
    expect(e.currentTarget.dataset.thumbFallback).toBe("1");
  });

  it("then steps the full artwork upstream if that is missing too", () => {
    const e = fakeImg("http://x/sprites/470.png");
    onSpriteError(e);
    expect(e.currentTarget.src).toBe(remoteSpriteUrl("470", false));
    expect(e.currentTarget.dataset.spriteFallback).toBe("1");
  });

  it("runs the whole chain in order without either guard cancelling the other", () => {
    // The bug this guards against: one shared flag, so the thumbnail step
    // consumes the fallback and the local artwork never gets its turn.
    const e = fakeImg("http://x/sprites/thumb/470.webp");
    onSpriteError(e);
    const afterThumb = e.currentTarget.src;
    onSpriteError(e);
    const afterLocal = e.currentTarget.src;
    onSpriteError(e);

    expect(afterThumb).toContain("sprites/470.png");
    expect(afterLocal).toContain("githubusercontent");
    // Third call is the stop: nothing further to try.
    expect(e.currentTarget.src).toBe(afterLocal);
  });

  it("sends seasonal forms to the home directory, not to official-artwork", () => {
    const e = fakeImg("http://x/sprites/home-585-autumn.png");
    onSpriteError(e);
    expect(e.currentTarget.src).toContain("/home/");
    expect(e.currentTarget.src).toContain("585-autumn.png");
  });

  it("keeps shiny shiny on the way upstream", () => {
    const e = fakeImg("http://x/sprites/470-shiny.png");
    onSpriteError(e);
    expect(e.currentTarget.src).toBe(remoteSpriteUrl("470", true));
    expect(e.currentTarget.src).toContain("/shiny/");
  });

  it("leaves anything it does not recognise alone rather than guessing", () => {
    const e = fakeImg("http://x/rooms/curator-room.jpg");
    onSpriteError(e);
    expect(e.currentTarget.src).toBe("http://x/rooms/curator-room.jpg");
  });
});
