import { Link, NavLink, useLocation } from "react-router-dom";

// The section names are deliberately thematic — a Reading Room and a Grafting
// Bench, not "Papers" and "Case Studies" — which reads well once you know the
// place and tells a first-time visitor nothing. Rather than flatten them into
// plainer labels, each carries a glyph to anchor recognition and a plain
// description on hover, so the poetry stays and the wayfinding still works.
//
// Glyphs are drawn on a 24x24 grid, stroke-only in currentColor, so they
// inherit the pill's active/inactive color without needing two variants.
export const GLYPHS = {
  // stacked panels — the gallery of specimen cases
  specimens: "M4 5h7v6H4zM13 5h7v6h-7zM4 13h7v6H4zM13 13h7v6h-7z",
  // a branching fork — the shape of a dichotomous key
  key: "M12 20V13M12 13 6 8M12 13l6-5M6 8V4M18 8V4",
  // two stems joined into one — a graft union
  graft: "M12 20v-6M12 14 7 9V4M12 14l5-5V4M9 12h6",
  // an open book
  reading: "M12 6c-2-1.5-4.5-2-8-2v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2ZM12 6v13",
  // a seedling breaking soil
  propagation: "M12 21v-8M12 13c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 13c3 0 5-2 5-5-3 0-5 2-5 5ZM5 21h14",
  // a framed scene on a wall — the habitat rooms
  exhibition: "M3 5h18v12H3zM3 17l5-5 3 3 4-4 5 4M8.5 9.5h.01",
  // a pencil over a page
  notes: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h4",
};

// The Determination Key deliberately isn't here. It's a finding aid, not a
// place — you reach for it while browsing specimens, so it lives beside the
// search and habitat filters in the gallery instead. The nav holds rooms.
const ITEMS = [
  { to: "/", label: "Specimens", glyph: "specimens", hint: "Browse every Grass-type specimen in the collection" },
  { to: "/exhibition", label: "Exhibition Hall", glyph: "exhibition", hint: "Habitat rooms — the specimens shown where they grow" },
  { to: "/grafting-bench", label: "Grafting Bench", glyph: "graft", hint: "Case files pairing a specimen with real published research" },
  { to: "/manuscripts", label: "Reading Room", glyph: "reading", hint: "The open-access papers behind the annotations" },
  { to: "/future-species", label: "Propagation Bench", glyph: "propagation", hint: "Speculative specimens grown from real botany" },
  // Deliberately not "Field Notes": a Field Note is the per-specimen botanical
  // reading on a specimen face, and reusing the phrase for the about page made
  // one term mean two things in the same navigation.
  { to: "/about", label: "Curator's Note", glyph: "notes", hint: "About this collection, its curator, and how it was put together" },
];

function NavGlyph({ name }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={GLYPHS[name]} />
    </svg>
  );
}

export default function NavHeader() {
  const { pathname } = useLocation();
  // A specimen face is *inside* the Specimens section, but its own route
  // doesn't match "/", so by default nothing in the nav lit up while you were
  // reading a specimen — you lost your place the moment you clicked into one.
  const onSpecimenFace = pathname.startsWith("/specimen/");
  // Same reasoning for a habitat room: it's a room *inside* the hall, so the
  // hall should stay lit rather than the nav going blank once you walk in.
  const inHabitatRoom = pathname.startsWith("/habitat/");

  return (
    <header
      style={{
        borderBottom: "1px solid var(--ink)",
        background: "var(--paper-light)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          padding: "16px 24px",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              // The existing type scale rather than a fixed size: clamps to
              // 1.5rem on a phone and 1.8rem on a wide screen, so the wordmark
              // reads larger than the old 1.4rem without dominating the header
              // on the narrow layout, where the pills already take three rows.
              fontSize: "var(--step2)",
              margin: 0,
              lineHeight: 1.1,
              color: "var(--botanical-green-deep)",
              whiteSpace: "nowrap",
            }}
          >
            CC Herbarium
          </h1>
        </Link>

        <nav aria-label="Sections">
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  title={item.hint}
                  className="mono"
                  style={({ isActive: routeActive }) => {
                    const isActive =
                      routeActive ||
                      (item.to === "/" && onSpecimenFace) ||
                      (item.to === "/exhibition" && inHabitatRoom);
                    return {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    // 9px vertical puts the tap target near 38px — clears the
                    // 24px WCAG minimum with room to spare without inflating
                    // the header, which already wraps to three rows on a phone.
                    padding: "9px 12px",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.045em",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    // Filled when you're on it, outlined when you're not —
                    // the same active-pill language the type badges and the
                    // case-file tabs already use elsewhere.
                    background: isActive ? "var(--botanical-green-deep)" : "transparent",
                    color: isActive ? "var(--paper-light)" : "var(--ink-soft)",
                    border: `1px solid ${isActive ? "var(--botanical-green-deep)" : "var(--paper-shadow)"}`,
                    };
                  }}
                >
                  {/* NavLink sets aria-current="page" on the active item by
                      itself, so the state is already announced without a
                      visually-hidden label. */}
                  <NavGlyph name={item.glyph} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
