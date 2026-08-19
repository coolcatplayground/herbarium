// Parses public/future-species.txt into a list of speculative concepts.
// Mirrors the block format used by field-notes.txt and manuscripts.txt.

const FIELD_PATTERN = /^(name|types|inspired_by|concept|real_basis|related_manuscript)\s*:\s*(.*)$/i;

export function parseFutureSpecies(text) {
  const entries = [];
  // Normalize CRLF/CR to LF — `.` doesn't match `\r` in a JS regex, so
  // FIELD_PATTERN's `(.*)$` fails on every field line of a Notepad-saved
  // file. See the fuller note in fieldNotesLoader.js.
  const chunks = text.replace(/\r\n?/g, "\n").split(/\n(?=###\s)/);

  for (const chunk of chunks) {
    if (!chunk.trim().startsWith("###")) continue;

    const lines = chunk.split("\n");
    const headerLine = lines[0].replace(/^###\s*/, "").trim();
    const id = headerLine.split(/\s|\[/)[0].toLowerCase();
    if (!id || id === "template") continue;

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

    if (fields.concept?.trim()) {
      entries.push({
        id,
        name: fields.name?.trim() || "???",
        types: fields.types
          ? fields.types.split("/").map((t) => t.trim().toLowerCase()).filter(Boolean)
          : [],
        inspiredBy: fields.inspired_by || "",
        concept: fields.concept,
        realBasis: fields.real_basis || "",
        relatedManuscript: fields.related_manuscript?.trim() || null,
      });
    }
  }

  return entries;
}

let cachedPromise = null;

export async function loadFutureSpecies() {
  if (cachedPromise) return cachedPromise;
  cachedPromise = fetch(`${import.meta.env.BASE_URL}future-species.txt`)
    .then((res) => (res.ok ? res.text() : ""))
    .then(parseFutureSpecies)
    .catch(() => []);
  return cachedPromise;
}
