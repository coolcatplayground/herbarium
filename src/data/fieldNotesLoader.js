// Parses the human-editable public/field-notes.txt into a lookup keyed by
// Pokémon name. Deliberately forgiving: unknown fields are ignored, and a
// block needs either a `note` or a `habitat_note` to be included, so a
// half-filled-in block just won't show up rather than crashing anything.
//
// `habitat_note` is what this specimen has to say about the habitat it's
// filed under, as distinct from `note`, which is about the specimen itself.
// It's a separate field because it's keyed to the *form*, not the species:
// Sceptile is mesophytic while Sceptile-Mega is Grass/Dragon and files under
// Ancient & Long-Lived, so the two need different habitat text even though
// they share a field note.

// `record` is the curator's consolidation of what the in-game Pokédex has
// reported about this species across every generation — rephrased and weighed
// against real botany rather than quoted. Species-level like `note`, so a Mega
// or regional form inherits it; the games file those entries under the same
// species anyway.
const FIELD_PATTERN = /^(binomial|plant_analogue|genetic_concept|note|habitat_note|record)\s*:\s*(.*)$/i;

export function parseFieldNotes(text) {
  const entries = {};
  // Normalize CRLF/CR to LF before anything else. These files are meant to
  // be edited in Notepad or TextEdit, and Notepad writes CRLF — but `.` in a
  // JS regex does not match `\r` (it counts as a line terminator), so the
  // `(.*)$` in FIELD_PATTERN fails on every single field line of a CRLF
  // file. Without this, a completely valid notes file parses to zero
  // entries and every specimen silently falls back to `uncat.`
  const chunks = text.replace(/\r\n?/g, "\n").split(/\n(?=###\s)/);

  for (const chunk of chunks) {
    if (!chunk.trim().startsWith("###")) continue;

    const lines = chunk.split("\n");
    const headerLine = lines[0].replace(/^###\s*/, "").trim();
    const nameToken = headerLine.split(/\s|\[/)[0].toLowerCase();
    if (!nameToken || nameToken === "template") continue;

    const fields = {};
    let currentKey = null;
    let buffer = [];
    const flush = () => {
      if (currentKey) fields[currentKey] = buffer.join(" ").trim();
      buffer = [];
    };

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^###\s*END/i.test(line.trim())) break;
      const match = line.match(FIELD_PATTERN);
      if (match) {
        flush();
        currentKey = match[1].toLowerCase();
        buffer = [match[2]];
      } else if (currentKey) {
        buffer.push(line.trim());
      }
    }
    flush();

    const hasNote = Boolean(fields.note?.trim());
    const hasHabitatNote = Boolean(fields.habitat_note?.trim());
    const hasRecord = Boolean(fields.record?.trim());

    // A form can carry only a habitat note — Sceptile-Mega inherits its field
    // note from Sceptile but needs its own habitat text — so a block counts
    // as real if it has any of the three.
    if (hasNote || hasHabitatNote || hasRecord) {
      entries[nameToken] = {
        binomial: fields.binomial || `${nameToken} sp.`,
        plantAnalogue: fields.plant_analogue || "Uncategorized",
        geneticConcept: fields.genetic_concept || "Uncategorized",
        note: hasNote ? fields.note : "",
        habitatNote: hasHabitatNote ? fields.habitat_note : "",
        record: hasRecord ? fields.record : "",
      };
    }
  }

  return entries;
}

let cachedPromise = null;

// Fetches and parses public/field-notes.txt once per session (cached).
// Resolves to {} if the file is missing or empty, so the app still works
// with only the generated fallback notes.
export async function loadFieldNotes() {
  if (cachedPromise) return cachedPromise;
  cachedPromise = fetch(`${import.meta.env.BASE_URL}field-notes.txt`)
    .then((res) => (res.ok ? res.text() : ""))
    .then(parseFieldNotes)
    .catch(() => ({}));
  return cachedPromise;
}
