// Parses the human-editable public/manuscripts.txt into a list of real
// agriculture research entries, each optionally linked to a specimen page.
// Mirrors fieldNotesLoader.js's format and forgiveness rules on purpose,
// so both files feel the same to hand-edit.

const FIELD_PATTERN = /^(title|authors|year|journal|doi|url|related_specimen|connection|open_access)\s*:\s*(.*)$/i;

export function parseManuscripts(text) {
  const entries = [];
  // Normalize CRLF/CR to LF — `.` doesn't match `\r` in a JS regex, so
  // FIELD_PATTERN's `(.*)$` fails on every field line of a Notepad-saved
  // file. See the fuller note in fieldNotesLoader.js.
  const chunks = text.replace(/\r\n?/g, "\n").split(/\n(?=###\s)/);

  for (const chunk of chunks) {
    if (!chunk.trim().startsWith("###")) continue;

    const lines = chunk.split("\n");
    const headerLine = lines[0].replace(/^###\s*/, "").trim();
    const idToken = headerLine.split(/\s|\[/)[0].toLowerCase();
    if (!idToken || idToken === "template") continue;

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

    // A usable entry needs at least a title, a link, and the connection
    // write-up — everything else is optional.
    const link = fields.doi
      ? (fields.doi.startsWith("http") ? fields.doi : `https://doi.org/${fields.doi}`)
      : fields.url;

    if (fields.title && fields.title.trim() && link && fields.connection && fields.connection.trim()) {
      const oaField = (fields.open_access || "").toLowerCase().trim();
      const openAccess = oaField === "no" || oaField === "false" ? false : true;
      entries.push({
        id: idToken,
        title: fields.title,
        authors: fields.authors || "",
        year: fields.year || "",
        journal: fields.journal || "",
        link,
        relatedSpecimen: fields.related_specimen ? fields.related_specimen.toLowerCase().trim() : null,
        connection: fields.connection,
        openAccess,
      });
    }
  }

  return entries;
}

let cachedPromise = null;

// Fetches and parses public/manuscripts.txt once per session (cached).
// Resolves to [] if the file is missing or empty.
export async function loadManuscripts() {
  if (cachedPromise) return cachedPromise;
  cachedPromise = fetch(`${import.meta.env.BASE_URL}manuscripts.txt`)
    .then((res) => (res.ok ? res.text() : ""))
    .then(parseManuscripts)
    .catch(() => []);
  return cachedPromise;
}
