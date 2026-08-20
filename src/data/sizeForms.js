// Specimens that exist in several sizes of the same organism rather than as
// genuinely distinct variants. PokéAPI lists each size as its own entry
// (pumpkaboo-small is 10027, -large 10028, -super 10029), which put four
// near-identical gourds in the gallery competing for attention.
//
// They're collected here instead: the canonical entry keeps its place in the
// gallery, and the other sizes are selectable on its specimen face. This is
// the same reasoning as COSMETIC_FORM_PATTERNS in pokeapi.js — one specimen
// per organism — except these sizes do differ measurably (height, mass, and
// in Pumpkaboo's case HP and Speed), so they're worth showing, just not worth
// six separate gallery panels.
//
// Botanically it's the right grouping too: a cultivated squash varying several
// fold in fruit size across one species is ordinary Cucurbita behaviour, not
// evidence of separate taxa.

const sizeForms = {
  "pumpkaboo-average": {
    axis: "Gourd size",
    note: "Four sizes of one species, the way a cultivated squash runs from palm-sized to prize-winning without ever being a different plant. Mass and vigour scale with the gourd; speed runs the other way.",
    variants: [
      { name: "pumpkaboo-small", label: "Small" },
      { name: "pumpkaboo-average", label: "Average" },
      { name: "pumpkaboo-large", label: "Large" },
      { name: "pumpkaboo-super", label: "Super" },
    ],
  },
  "gourgeist-average": {
    axis: "Gourd size",
    note: "The mature form carries the same four-size range as its pre-evolution — the fruit keeps whatever size class it grew from.",
    variants: [
      { name: "gourgeist-small", label: "Small" },
      { name: "gourgeist-average", label: "Average" },
      { name: "gourgeist-large", label: "Large" },
      { name: "gourgeist-super", label: "Super" },
    ],
  },
};

// The entry that keeps the gallery panel for each group.
export const SIZE_GROUP_CANONICAL = Object.keys(sizeForms);

// Every non-canonical size, so the gallery can drop them and the specimen face
// can redirect them to the canonical entry rather than serving a duplicate.
export const HIDDEN_SIZE_FORMS = new Set(
  Object.entries(sizeForms).flatMap(([canonical, group]) =>
    group.variants.map((v) => v.name).filter((n) => n !== canonical)
  )
);

// Maps any size in a group back to the entry that owns the specimen face.
export const SIZE_FORM_PARENT = Object.fromEntries(
  Object.entries(sizeForms).flatMap(([canonical, group]) =>
    group.variants.map((v) => [v.name, canonical])
  )
);

export function getSizeGroup(name) {
  return sizeForms[name] || null;
}

export default sizeForms;
