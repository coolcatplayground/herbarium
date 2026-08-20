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

// PokéAPI lists most alternate forms under a suffixed name — `pumpkaboo-average`,
// `shaymin-land`, `venusaur-mega`, `ogerpon-wellspring-mask` — while a field note
// is usually written once for the species as a whole. Walk the name back one
// hyphenated segment at a time (longest first, so `ogerpon-wellspring` gets a
// chance before plain `ogerpon`) and use the base species' note if one exists.
//
// Species whose real name simply contains a hyphen (wo-chien, iron-leaves,
// brute-bonnet) are safe here: the walk only succeeds if a note is actually
// keyed under the shortened name, and none are.
function findBaseEntry(name, notesMap) {
  const parts = name.split("-");
  for (let i = parts.length - 1; i >= 1; i--) {
    const candidate = parts.slice(0, i).join("-");
    // Requires an actual field note, not merely a block: a form's block may
    // exist carrying only a habitat note, and inheriting that would hand the
    // specimen an empty write-up while marking it curated.
    if (notesMap[candidate]?.note) return { entry: notesMap[candidate], from: candidate };
  }
  return null;
}

// notesMap comes from the loaded/parsed public/field-notes.txt file (see
// fieldNotesLoader.js). Species without an entry there get a deterministic,
// clearly-labeled placeholder instead.
//
// Three possible states, deliberately distinguished rather than collapsed into
// a yes/no: a note written for this exact specimen, a note inherited from the
// base species (real writing, but not about this form specifically — so it says
// so), and no note at all.
export function getSpecimenNote(name, id, notesMap = {}) {
  // A habitat note is never inherited. Habitat is read off the *form's* own
  // typing, and forms routinely differ from their base species — Sceptile is
  // mono-Grass and files under Mesophytic while Sceptile-Mega is Grass/Dragon
  // and files under Ancient & Long-Lived — so borrowing the base species'
  // habitat text would describe the wrong habitat entirely.
  const habitatNote = notesMap[name]?.habitatNote || "";

  const entry = notesMap[name];
  if (entry?.note) {
    return { ...entry, habitatNote, curated: true, inherited: false, inheritedFrom: null };
  }

  const base = findBaseEntry(name, notesMap);
  if (base) {
    // The record rides along with the field note: both are species-level, and
    // the games file a form's Pokédex entries under its species anyway. Only
    // the habitat note is held back, since habitat is read off the form.
    return { ...base.entry, habitatNote, curated: true, inherited: true, inheritedFrom: base.from };
  }

  const analogue = FALLBACK_ANALOGUES[hashString(name) % FALLBACK_ANALOGUES.length];
  return {
    binomial: `${name[0].toUpperCase()}${name.slice(1)} sp. no. ${id}`,
    plantAnalogue: analogue,
    geneticConcept: "Uncatalogued",
    note:
      "This specimen hasn't been given a field annotation yet. Add one for it in field-notes.txt.",
    // Carried even here: a specimen can have something to say about its
    // habitat before anyone has written its field note.
    habitatNote,
    record: "",
    curated: false,
    inherited: false,
    inheritedFrom: null,
  };
}
