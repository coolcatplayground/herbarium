// The room a page is standing in.
//
// Fixed rather than scrolled: the hall does not slide away when you look down
// at a specimen sheet, any more than a real room would. It sits behind
// everything at low strength and is masked out before it reaches the middle of
// the screen, so body text is always reading against paper rather than against
// a bookcase.
//
// Deliberately not applied site-wide. Two rooms have been painted; the rest of
// the collection keeps the plain paper ground, and a backdrop that appeared on
// some pages and not others by accident would look like a bug. Pages opt in.
export default function RoomBackdrop({ image }) {
  if (!image) return null;
  // Hidden from assistive tech rather than labelled. It carries atmosphere, not
  // information — at a quarter opacity behind every other element there is
  // nothing in it a reader needs, and the page has already announced which room
  // it is by its heading. A described decorative layer is just noise before the
  // content someone actually came for.
  return (
    <div
      className="room"
      aria-hidden="true"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${image})` }}
    />
  );
}
