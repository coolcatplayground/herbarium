// A museum vitrine for the specimen sprite: the supplied glass-case photograph
// with the sprite composited into the cavity and the specimen's name engraved
// on the brass plate.
//
// Every figure below is measured off the source image (1448x1086) rather than
// eyeballed, and expressed as a percentage so the case scales freely:
//
//   cavity    x 173..1277, y 180..845   -> the glass interior, back panel
//   nameplate x 488..961,  y 877..973   -> the blank plate on the black base
//
// The plate is centred at 50.03% of the image width, i.e. dead centre, so the
// label is simply centred rather than nudged.
const CASE_ASPECT = 1448 / 1086;

const CAVITY = { left: 13.12, top: 16.57, width: 73.76, height: 61.23 };
const PLATE = { left: 33.7, top: 80.76, width: 32.73, height: 8.93 };

// The photograph has no alpha channel — it is opaque RGB on a near-white
// (#f0eeee) surround. Dropped straight onto the warm paper it reads as a pale
// grey rectangle pasted over the page, so it is composited with `multiply`,
// which lets the near-white surround fall away into whatever it sits on while
// the black base, glass edges and shadow all survive.
const BLEND = "multiply";

// Sizing the engraving is a real constraint, not a nicety: on a catalog card
// the plate measures about 78x16 CSS px, and that 16px height is the hard
// ceiling. So rather than step through arbitrary scale factors, the size is
// solved from the plate's own geometry, in container-query units so it holds
// at any case size.
//
// All figures below are fractions of the case WIDTH (1cqw = 1% of it), which
// is what `cqw` resolves against:
const PLATE_CONTENT_W = 28.7; // plate box (32.73) less its side padding
const PLATE_H = 6.7; // 8.93% of case height, and the case is 4:3
// Mono at 700 weight with the wide tracking below measures ~0.64em per
// character. Measured in-browser rather than assumed.
const CHAR_W = 0.64;

// Text wraps on word boundaries, not at the halfway character, so a two-line
// estimate of n/2 is wrong whenever the words divide unevenly. "ogerpon
// hearthflame mask" splits at best into "ogerpon" / "hearthflame mask" — 16
// characters on the longer line, not 12 — and sizing for 12 pushed it onto a
// third line and out of the plate. This returns the longest line produced by
// the most even split available.
function longestLineOfTwo(text) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 2) return text.length;
  let best = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    best = Math.min(best, Math.max(a, b));
  }
  return best;
}

function plateFit(text) {
  const n = text.length;
  if (!n) return { font: PLATE_H * 0.92, wrap: false };

  // One line: limited by width, or by the plate height, whichever bites first.
  const oneLine = Math.min(PLATE_H * 0.92, PLATE_CONTENT_W / (CHAR_W * n));
  // Two lines: halves the height budget, and the width demand only as far as
  // the word boundaries actually allow.
  const twoLine = Math.min(
    PLATE_H / (2 * 1.12),
    PLATE_CONTENT_W / (CHAR_W * longestLineOfTwo(text))
  );

  // Prefer a single line unless wrapping genuinely buys legible size — for a
  // long form name like "ogerpon wellspring mask" one line solves to ~5px
  // while two lines hold ~6.6px, so it wraps.
  return twoLine > oneLine * 1.06 ? { font: twoLine, wrap: true } : { font: oneLine, wrap: false };
}

// `engrave={false}` leaves the plate blank, which is what the catalog grid
// wants: at ~190px per card the plate is under 65px wide, so a name would
// engrave at around 5px — and the card already prints it, larger, directly
// underneath. A blank brushed plate still reads as part of the object.
export default function SpecimenCase({
  sprite,
  name,
  label,
  caseNumber,
  engrave = true,
  lazy = false,
  onSpriteError,
}) {
  const plateLabel = (label ?? name ?? "").replace(/-/g, " ");
  const engraved = !engrave ? "" : caseNumber ? `${caseNumber} · ${plateLabel}` : plateLabel;
  const { font, wrap } = plateFit(engraved);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: String(CASE_ASPECT),
        // Container query unit basis, so the engraved lettering scales with the
        // case rather than with the viewport.
        containerType: "inline-size",
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}glass-panel.png`}
        alt=""
        aria-hidden="true"
        loading={lazy ? "lazy" : undefined}
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          mixBlendMode: BLEND,
        }}
      />

      {sprite && (
        <div
          style={{
            position: "absolute",
            left: `${CAVITY.left}%`,
            top: `${CAVITY.top}%`,
            width: `${CAVITY.width}%`,
            height: `${CAVITY.height}%`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "4%",
          }}
        >
          <img
            src={sprite}
            alt={name}
            loading={lazy ? "lazy" : undefined}
            decoding="async"
            onError={onSpriteError}
            style={{
              // Sized from the cavity rather than left to the image's own
              // intrinsic size. With only max-width/max-height an unloaded
              // image measures 0x0 — and a 0x0 lazy image never intersects the
              // viewport, so it never loads at all. Explicit box + object-fit
              // keeps the layout stable and the lazy trigger working.
              width: "78%",
              height: "100%",
              objectFit: "contain",
              // Sits the specimen on the cavity floor rather than centring it
              // against the back panel.
              objectPosition: "center bottom",
              filter: "drop-shadow(0 6px 5px rgba(40, 34, 28, 0.28))",
            }}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: `${PLATE.left}%`,
          top: `${PLATE.top}%`,
          width: `${PLATE.width}%`,
          height: `${PLATE.height}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5em",
          // Percentage padding resolves against the case width, not the plate,
          // so 3% was eating 14px of a 78px plate. 2% buys back usable width.
          padding: "0 2%",
          overflow: "hidden",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: `${font}cqw`,
            lineHeight: wrap ? 1.12 : 1,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            whiteSpace: wrap ? "normal" : "nowrap",
            textAlign: "center",
            // Engraved rather than printed: dark fill with a single-pixel
            // light edge below, which is what reads as cut-into-metal against
            // the brushed plate.
            color: "#2c2620",
            textShadow: "0 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          {engraved}
        </span>
      </div>
    </div>
  );
}
