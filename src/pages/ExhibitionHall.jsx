import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGrassRoster, fetchRosterTypes } from "../api/pokeapi";
import { getHabitat, HABITATS } from "../data/habitatMap";
import { loadHabitatOverrides } from "../data/habitatOverridesLoader";
import TypeBadge from "../components/TypeBadge";
import useDocumentTitle from "../hooks/useDocumentTitle";
import RoomBackdrop from "../components/RoomBackdrop";

// The index of habitat rooms. Each card is a doorway into one wing; the room
// itself lives at /habitat/:slug.
//
// Rooms with an illustration sort first — a hall shows its finished exhibits
// before the ones still being hung — and the rest say plainly that the art is
// still in preparation rather than pretending to be complete.
export default function ExhibitionHall() {
  useDocumentTitle("The Exhibition Hall");

  const [roster, setRoster] = useState(null);
  const [typesMap, setTypesMap] = useState({});
  const [overrides, setOverrides] = useState({});
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchGrassRoster(), loadHabitatOverrides()]).then(([entries, ov]) => {
      if (cancelled) return;
      setRoster(entries);
      setOverrides(ov);
      setProgress({ completed: 0, total: entries.length });
      fetchRosterTypes(entries, {
        onProgress: (completed, total) => !cancelled && setProgress({ completed, total }),
      }).then((types) => {
        if (!cancelled) {
          setTypesMap(types);
          setProgress(null);
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Counted by habitat *name* so hand-overridden specimens land in the room
  // they're actually filed under.
  const counts = useMemo(() => {
    const tally = {};
    if (!roster) return tally;
    roster
      .filter((r) => r.name in typesMap)
      .forEach((r) => {
        const name = getHabitat(typesMap[r.name], overrides[r.name]).name;
        tally[name] = (tally[name] || 0) + 1;
      });
    return tally;
  }, [roster, typesMap, overrides]);

  const rooms = useMemo(() => {
    return [...HABITATS].sort((a, b) => {
      if (Boolean(a.image) !== Boolean(b.image)) return a.image ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const illustrated = rooms.filter((r) => r.image).length;

  // The rooms arrive rather than being there already.
  //
  // Armed from JS, and only after a frame, so the hidden starting state never
  // exists for anyone whose JS did not run — without this the whole grid would
  // simply be invisible rather than animated. Skipped outright for anyone who
  // has asked for less motion; they get the cards immediately, which is the
  // correct answer rather than a degraded one.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Each card lights as it comes into view, so the invitation happens where
  // the reader is looking rather than all at once above the fold.
  useEffect(() => {
    if (!armed) return;
    const cards = document.querySelectorAll(".hall-grid.is-armed .hall-room");
    if (!cards.length) return;
    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    cards.forEach((c) => io.observe(c));

    // Backstop. Arming hides the grid; the observer is what brings it back, so
    // anything that stops the observer firing would leave eighteen invisible
    // rooms on the page. This is not hypothetical — requestAnimationFrame and
    // observer callbacks both go quiet in a tab that is not compositing, which
    // is exactly where nobody is watching to notice.
    // After a second and a half the rooms simply appear, animated or not. The
    // worst case this allows is a reveal that did not play; the worst case it
    // removes is a hall with nothing in it.
    const backstop = setTimeout(() => {
      cards.forEach((c) => c.classList.add("is-in"));
    }, 1500);

    return () => {
      io.disconnect();
      clearTimeout(backstop);
    };
  }, [armed, rooms.length, counts]);

  return (
    <div className="container" style={{ padding: "40px 24px 90px" }}>
      <RoomBackdrop image="rooms/exhibition-hall.jpg" />
      <section className="page-intro placard" style={{ marginBottom: "36px" }}>
        <p className="eyebrow">Through the Far Doors</p>
        <h2 style={{ fontSize: "var(--step3)" }}>The Exhibition Hall</h2>
        <p style={{ color: "var(--ink-soft)" }}>
          The gallery keeps every specimen under glass, one case at a time. The hall does the
          opposite: it puts them back where they grow. Each room below takes one habitat, paints the
          place, and sets out the specimens that belong to it &mdash; each with a placard on what it
          contributes to that particular way of making a living.
        </p>
        <p className="mono" style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>
          {illustrated} of {rooms.length} rooms illustrated so far.
          {progress && ` Reading the collection… ${progress.completed}/${progress.total}`}
        </p>
      </section>

      <div className={`hall-grid${armed ? " is-armed" : ""}`}>
        {rooms.map((room, i) => {
          const residents = counts[room.name];
          return (
            <Link
              key={room.slug}
              to={`/habitat/${room.slug}`}
              className="plate-frame hall-room"
              style={{
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                color: "var(--ink)",
                overflow: "hidden",
                "--stagger": `${(i % 6) * 70}ms`,
              }}
            >
              {room.image ? (
                <img
                  src={`${import.meta.env.BASE_URL}${room.image}`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  style={{
                    height: "150px",
                    background:
                      "repeating-linear-gradient(135deg, var(--paper) 0 12px, var(--paper-light) 12px 24px)",
                    borderBottom: "1px solid var(--paper-shadow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="mono" style={{ fontSize: "0.68rem", color: "var(--ink-soft)" }}>
                    illustration in preparation
                  </span>
                </div>
              )}

              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "1rem" }}>{room.name}</h3>

                {/* The pairing each room is read from. Worth the space here
                    more than anywhere else: eighteen botanical names are slow
                    to scan, eighteen type pairs are instant. Unlabelled, like
                    the room pages — the badges say it without help. */}
                <div
                  style={{ display: "flex", gap: "5px", flexWrap: "wrap", alignItems: "center" }}
                  aria-label={
                    room.key === "none"
                      ? "Read from Grass typing alone, with no secondary type"
                      : `Read from the Grass and ${room.key} type pairing`
                  }
                >
                  <TypeBadge type="grass" size="sm" />
                  {room.key !== "none" && <TypeBadge type={room.key} size="sm" />}
                </div>

                <p className="mono" style={{ margin: 0, fontSize: "0.68rem", color: "var(--specimen-red)" }}>
                  {residents === undefined
                    ? "counting…"
                    : `${residents} specimen${residents === 1 ? "" : "s"}`}
                </p>
                <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--ink-soft)" }}>
                  {room.description.split(/(?<=\.)\s/)[0]}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
