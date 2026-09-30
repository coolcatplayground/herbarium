import { PLATES, WASH } from "./drawings";

// One botanical plate from drawings.js, as three stacked SVG layers.
//
//   wash   colour, under everything — hand-watercolour, see below
//   fine   fibres, hatching, veins, stipple, the small italic captions
//   ink    the contour lines, on top
//
// Three separate <svg> elements rather than three groups in one, and the
// reason is how a browser redraws. Any change inside an SVG repaints the whole
// SVG. Kept as one, every frame of a contour drawing itself on would repaint
// the washes, their texture filter and a few hundred fine lines along with it.
// Split, the wash and fine layers are painted once and only ever faded — which
// the compositor does without repainting anything — and the per-frame work is
// a couple of dozen contour paths in a layer of their own.
//
// The washes are the other half of the quality. A flat fill reads as clip art;
// a watercolour wash has three things a fill doesn't, and each is here:
//   - it is lighter where the light falls and deeper in shadow (a gradient),
//   - pigment pools at the edge as the water dries (a darker edge stroke),
//   - and the edge is never a clean vector curve, and the colour is grainy
//     where it sits in the tooth of the paper (one texture filter).
// The filter would be expensive animated. It never is: the wash layer only
// fades, so it is rendered once.
//
// `drawn` marks the contour lines for drawing on: each gets pathLength="1" so
// a single dash of length 1 covers it whatever its real length, and the film
// animates the dash offset. A plate that is not drawn on — the tumbleweed,
// which rolls in finished — renders plain lines.
export default function Plate({ id, drawn = false, className = "" }) {
  const plate = PLATES[id];
  const washes = [];
  const fine = [];
  const ink = [];
  const tones = new Set();

  plate.layers.forEach((l, i) => {
    switch (l.kind) {
      case "wash":
        tones.add(l.tone);
        washes.push(
          <path
            key={i}
            d={l.d}
            fill={`url(#${id}-g-${l.tone})`}
            fillOpacity={l.alpha ?? 1}
            stroke={WASH[l.tone].edge}
            strokeOpacity={0.55 * (l.alpha ?? 1)}
            strokeWidth={2.2}
            strokeLinejoin="round"
            transform={`translate(${l.dx || 0} ${l.dy || 0})`}
          />,
        );
        break;
      case "shade":
        washes.push(<path key={i} d={l.d} className="plate__shade" />);
        break;
      case "fine":
        fine.push(<path key={i} d={l.d} className="plate__fine" />);
        break;
      case "back":
        fine.push(<path key={i} d={l.d} className="plate__back" />);
        break;
      case "dots":
        fine.push(
          <g key={i} className={`plate__dots${l.tone ? ` plate__dots--${l.tone}` : ""}`}>
            {l.dots.map(([x, y, r], k) => (
              <circle key={k} cx={x} cy={y} r={r} />
            ))}
          </g>,
        );
        break;
      case "fig":
        fine.push(
          <text key={i} x={l.x} y={l.y} className="plate__fig">
            {l.text}
          </text>,
        );
        break;
      case "ink":
        ink.push(
          <path
            key={i}
            d={l.d}
            className="plate__ink"
            style={{ strokeWidth: l.weight || 1.3 }}
            {...(drawn ? { pathLength: 1, "data-ink": ink.length } : {})}
          />,
        );
        break;
    }
  });

  const layer = (part, children, defs) => (
    <svg
      className={`plate__layer plate__layer--${part}`}
      viewBox={plate.viewBox}
      focusable="false"
      {...(drawn && part !== "ink" ? { "data-track": `${part}-${id}` } : {})}
    >
      {defs}
      {children}
    </svg>
  );

  return (
    <div className={`plate${drawn ? " plate--drawn" : ""} ${className}`.trim()} aria-hidden="true">
      {layer(
        "wash",
        <g filter={`url(#${id}-wc)`}>{washes}</g>,
        <defs>
          {[...tones].map((t) => (
            <linearGradient key={t} id={`${id}-g-${t}`} x1="0.1" y1="0" x2="0.85" y2="1">
              <stop offset="0" stopColor={WASH[t].light} />
              <stop offset="0.55" stopColor={WASH[t].base} />
              <stop offset="1" stopColor={WASH[t].deep} />
            </linearGradient>
          ))}
          <filter id={`${id}-wc`} x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
            {/* a slow wobble, to take the vector smoothness off every edge */}
            <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed={plate.seed} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" result="rough" />
            {/* and a fine grain, as if the colour had settled into the paper */}
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={plate.seed + 7} result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.42 0 0 0 0.64" result="tooth" />
            <feComposite in="rough" in2="tooth" operator="in" />
          </filter>
        </defs>,
      )}
      {layer("fine", fine)}
      {layer("ink", ink)}
    </div>
  );
}
