// Specimens that exist in four seasonal forms of one organism: Deerling and
// Sawsbuck. Adjacent to sizeForms.js in intent — one specimen per organism,
// its variants selectable on its own face — but the data underneath is a
// different shape, and the difference is worth stating plainly.
//
// A Pumpkaboo size is its own PokéAPI *pokemon* entry, with its own id, its
// own official artwork, and genuinely different height, mass and stats. A
// Deerling season is only a *pokemon-form*: the species has exactly one
// variety, and every season shares one set of measurements and one stat line.
// So there is nothing to hide from the gallery here and nothing to redirect —
// the roster only ever contained `deerling` and `sawsbuck` — and nothing on
// the sheet changes with the selection except the specimen's appearance.
//
// That also settles which sprites to use. Official artwork exists for the
// spring form alone, so a selector built on it would offer one painting and
// three pixel sprites. PokéAPI's HOME set carries all four seasons at
// comparable quality, so these two faces use HOME art throughout rather than
// mixing sources — the point of the selector is to compare the seasons, which
// requires that they be drawn the same way.
//
// Botanically this is the right grouping: the whole Deerling line is one
// organism reading a calendar, which is the argument the Generalist room is
// built on. Four seasons are four states of one specimen, not four specimens.

// Served from our own origin like every other sprite — see
// scripts/fetch-sprites.mjs, which stores these as home-<slug>[-shiny].png.
//
// `slug` is the National Dex id for the default (spring) form and an id-suffix
// pair for the rest, matching PokéAPI's own filenames.
export function seasonSpriteUrl(slug, shiny = false) {
  return `${import.meta.env.BASE_URL}sprites/home-${slug}${shiny ? "-shiny" : ""}.png`;
}

const seasonForms = {
  deerling: {
    axis: "Seasonal form",
    note: "One animal in four states rather than four animals, which is the argument the room outside is built on. Unlike a gourd size, nothing else on this sheet moves with the selection: all four seasons share one height, one mass and one stat line.",
    variants: [
      { slug: "585", label: "Spring" },
      { slug: "585-summer", label: "Summer" },
      { slug: "585-autumn", label: "Autumn" },
      { slug: "585-winter", label: "Winter" },
    ],
  },
  sawsbuck: {
    axis: "Seasonal form",
    note: "The antlers carry the change rather than the coat: budding in spring, in full leaf through summer, turned in autumn, bare in winter. A deciduous year worn on the head.",
    variants: [
      { slug: "586", label: "Spring" },
      { slug: "586-summer", label: "Summer" },
      { slug: "586-autumn", label: "Autumn" },
      { slug: "586-winter", label: "Winter" },
    ],
  },
};

export function getSeasonGroup(name) {
  return seasonForms[name] || null;
}

export default seasonForms;
