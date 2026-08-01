// Parses the human-editable public/field-notes.txt into a lookup keyed by
// Pokémon name. Deliberately forgiving: unknown fields are ignored, and a
// block only needs a `note` to be included, so a half-filled-in block just
// won't show up rather than crashing anything.

const FIELD_PATTERN = /^(binomial|plant_analogue|genetic_concept|note)\s*:\s*(.*)$/i;

export function parseFieldNotes(text) {
  const entries = {};
  const chunks = text.split(/\n(?=###\s)/);

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

    if (fields.note && fields.note.trim()) {
      entries[nameToken] = {
        binomial: fields.binomial || `${nameToken} sp.`,
        plantAnalogue: fields.plant_analogue || "Uncategorized",
        geneticConcept: fields.genetic_concept || "Uncategorized",
        note: fields.note,
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
