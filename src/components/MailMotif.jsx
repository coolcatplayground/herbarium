// The mark in the corner of each sheet of stationery.
//
// Drawn here as plain shapes rather than shipped as art, for the same reason
// the type icons are inline: six small marks that need to take the paper's
// accent colour and scale to whatever size the sheet is rendered at should not
// be six image requests. They are original, in the collection's own botanical
// idiom, rather than reproductions of anything.
//
// Decorative throughout — the paper's name is always written beside it, so
// every instance is hidden from assistive technology.
export default function MailMotif({ paper, size = 26 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    focusable: "false",
    style: { display: "block", overflow: "visible" },
  };
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (paper) {
    // Five petals around an eye, the plainest way to say flower.
    case "bloom":
      return (
        <svg {...common}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="12"
              cy="6.6"
              rx="3.1"
              ry="4.6"
              transform={`rotate(${deg} 12 12)`}
              fill="currentColor"
              opacity="0.28"
            />
          ))}
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      );

    // A frond: one arching rachis with leaflets shortening toward the tip,
    // and the crozier the whole thing unrolled from still curled at the end.
    case "fern":
      return (
        <svg {...common}>
          <path d="M5 21C7 13.5 10.5 7.5 16 4.5" {...stroke} />
          {[
            [6.6, 17.6, 4.2],
            [8.6, 14.2, 3.6],
            [10.8, 11, 3],
            [13, 8.4, 2.3],
          ].map(([x, y, len]) => (
            <g key={y}>
              <path d={`M${x} ${y}l${len} ${-len * 0.55}`} {...stroke} />
              <path d={`M${x} ${y}l${-len * 0.7} ${-len * 0.4}`} {...stroke} />
            </g>
          ))}
          <path d="M16 4.5a2.1 2.1 0 1 1-1.5 2" {...stroke} />
        </svg>
      );

    // Fruit on a stalk with one leaf, the shape every orchard sign uses.
    case "orchard":
      return (
        <svg {...common}>
          <circle cx="12" cy="14.5" r="6.4" fill="currentColor" opacity="0.26" />
          <circle cx="12" cy="14.5" r="6.4" {...stroke} />
          <path d="M12 8.1V4.2" {...stroke} />
          <path d="M12.2 5.6c2-2.4 4.4-2.6 5.4-2.3.3 1.1 0 3.6-2.6 4.6-1.6.6-2.6.1-2.8-.4-.2-.6 0-1.4 0-1.9Z" fill="currentColor" opacity="0.45" />
        </svg>
      );

    // Three cushions with spore capsules on stalks, which is what makes a moss
    // recognisably a moss rather than a smudge of green.
    case "moss":
      return (
        <svg {...common}>
          <path d="M2.5 19.5c1.2-3 3-4.4 5-4.4s3.8 1.4 5 4.4" {...stroke} />
          <path d="M11.5 19.5c1-2.4 2.4-3.6 4.2-3.6s3.2 1.2 4.2 3.6" {...stroke} />
          <path d="M2.5 19.5h19" {...stroke} />
          {[
            [7.5, 15.1, 6.4],
            [15.7, 15.9, 7.6],
          ].map(([x, y, top]) => (
            <g key={x}>
              <path d={`M${x} ${y}C${x} ${y - 3} ${x + 1.2} ${top + 1.6} ${x + 1.6} ${top + 0.9}`} {...stroke} />
              <ellipse cx={x + 1.9} cy={top} rx="1.5" ry="1.1" fill="currentColor" opacity="0.5" />
            </g>
          ))}
        </svg>
      );

    // A lily pad, notch and all, on water.
    case "tide":
      return (
        <svg {...common}>
          <path
            d="M12 5.6a7.4 7.4 0 1 1-1.1 14.7l1.1-7.35Z"
            fill="currentColor"
            opacity="0.26"
          />
          <path d="M12 5.6a7.4 7.4 0 1 1-1.1 14.7l1.1-7.35Z" {...stroke} />
          <path d="M12 12.95 5.1 10.4M12 12.95l6.4-3.6M12 12.95l4.9 5.3" {...stroke} strokeWidth="0.9" />
        </svg>
      );

    // A closed pod with its seeds, the thing a fire-adapted plant is holding on
    // to. See Scovillain's placard for why it is holding on.
    case "ember":
      return (
        <svg {...common}>
          <path
            d="M12 2.6c3.4 3.4 5 7 5 10.4 0 4.2-2.4 8.4-5 8.4s-5-4.2-5-8.4c0-3.4 1.6-7 5-10.4Z"
            fill="currentColor"
            opacity="0.24"
          />
          <path
            d="M12 2.6c3.4 3.4 5 7 5 10.4 0 4.2-2.4 8.4-5 8.4s-5-4.2-5-8.4c0-3.4 1.6-7 5-10.4Z"
            {...stroke}
          />
          {[9.4, 13.2, 17].map((cy) => (
            <circle key={cy} cx="12" cy={cy} r="1.5" fill="currentColor" opacity="0.75" />
          ))}
        </svg>
      );

    default:
      return null;
  }
}
