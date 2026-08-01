const FALLBACK_ANALOGUES = [
  "Understory shade plants",
  "Temperate deciduous shrubs",
  "Ruderal (disturbance-adapted) plants",
  "Epiphytic tropical foliage",
  "Hardy perennial groundcover",
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// notesMap comes from the loaded/parsed public/field-notes.txt file (see
// fieldNotesLoader.js). Species without an entry there get a deterministic,
// clearly-labeled placeholder instead.
export function getSpecimenNote(name, id, notesMap = {}) {
  const entry = notesMap[name];
  if (entry) {
    return { ...entry, curated: true };
  }
  const analogue = FALLBACK_ANALOGUES[hashString(name) % FALLBACK_ANALOGUES.length];
  return {
    binomial: `${name[0].toUpperCase()}${name.slice(1)} sp. no. ${id}`,
    plantAnalogue: analogue,
    geneticConcept: "Uncatalogued",
    note:
      "This specimen hasn't been given a field annotation yet. Add one for it in field-notes.txt.",
    curated: false,
  };
}
