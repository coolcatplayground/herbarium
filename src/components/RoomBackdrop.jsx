import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// The room a page is standing in, and a way to clear the furniture out of it.
//
// Fixed rather than scrolled: the hall does not slide away when you look down
// at a specimen sheet, any more than a real room would. It sits behind
// everything and the page's own surfaces — placards, plate frames, tags —
// carry the contrast, so nothing is ever read against a bookcase.
//
// Pages opt in. Every page has a painted room today, but a backdrop that
// appeared somewhere by accident would look like a bug rather than a choice.
export default function RoomBackdrop({ image }) {
  const [bare, setBare] = useState(false);

  // The class lives on <body> rather than in React's tree because what it
  // hides — the header, the footer, the page's own content — sits outside this
  // component entirely.
  useEffect(() => {
    document.body.classList.toggle("room-only", bare);
    return () => document.body.classList.remove("room-only");
  }, [bare]);

  // Leaving has to be possible without finding the button again.
  useEffect(() => {
    if (!bare) return;
    const onKey = (e) => {
      if (e.key === "Escape") setBare(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bare]);

  if (!image) return null;

  return (
    <>
      {/* Hidden from assistive tech: it carries atmosphere, not information,
          and the page has already said which room it is by its heading. */}
      <div
        className="room"
        aria-hidden="true"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${image})` }}
      />

      {/* Portalled to <body> so that hiding the page cannot hide the control
          that brings it back. The button is the one thing that must survive
          whatever it does. */}
      {createPortal(
        <button
          type="button"
          className={`room-peek${bare ? " is-bare" : ""}`}
          aria-pressed={bare}
          onClick={() => setBare((b) => !b)}
          title={bare ? "Bring the collection back (Esc)" : "Clear the page and look at the room"}
        >
          <span className="room-peek__glyph" aria-hidden="true" />
          {/* The label says what the button will do next, not what state it is
              in — a toggle's text is only useful as a promise. Both halves are
              the curator speaking: an invitation out to the painting, and an
              invitation back to the work. */}
          <span className="room-peek__text">
            {bare ? "Back to the collection" : "Enjoy the scenery"}
          </span>
        </button>,
        document.body
      )}
    </>
  );
}
