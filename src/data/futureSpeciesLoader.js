// Parses public/future-species.txt into a list of speculative concepts.
// Mirrors the block format used by field-notes.txt and manuscripts.txt.

// `art` is optional and holds a path under public/ — a concept sheet, if one
// has been drawn. Most concepts will never have art, so the bench has to read
// well without it; a sheet is a bonus, not a requirement.
const FIELD_PATTERN = /^(name|types|inspired_by|concept|real_basis|related_manuscript|art)\s*:\s*(.*)$/i;

// "??? (working title: the partner)" -> { name: "???", nameNote: "working title: the partner" }
// Anything without a parenthetical passes straight through with no note.
function splitName(raw) {
  const m = raw.match(/^([^(]+?)\s*\((.+)\)\s*$/);
  if (!m) return { name: raw, nameNote: "" };
  return { name: m[1].trim(), nameNote: m[2].trim() };
}

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
        // A concept's name routinely carries a working note inside it:
        // `??? (working title: a Camponotus-style carpenter-ant Bug-type)`.
        // That is exactly right in a text file the curator edits by hand, and
        // wrong as a headline — it was being set as a 1.5rem display title.
        // Split rather than demand tidier input: the file is authored in
        // Notepad and should stay forgiving.
        ...splitName(fields.name?.trim() || "???"),
        types: fields.types
          ? fields.types.split("/").map((t) => t.trim().toLowerCase()).filter(Boolean)
          : [],
        inspiredBy: fields.inspired_by || "",
        concept: fields.concept,
        realBasis: fields.real_basis || "",
        relatedManuscript: fields.related_manuscript?.trim() || null,
        art: fields.art?.trim() || null,
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
