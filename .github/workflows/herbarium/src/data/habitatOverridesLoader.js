// Parses the human-editable public/habitat-overrides.txt file. Mirrors
// fieldNotesLoader.js's block format so all three editable files
// (field-notes.txt, manuscripts.txt, habitat-overrides.txt) feel the same.

const FIELD_PATTERN = /^(habitat_name|description)\s*:\s*(.*)$/i;

export function parseHabitatOverrides(text) {
  const overrides = {};
  const chunks = text.split(/\n(?=###\s)/);

  for (const chunk of chunks) {
    if (!chunk.trim().startsWith("###")) continue;

    const lines = chunk.split("\n");
    const headerLine = lines[0].replace(/^###\s*/, "").trim();
    const name = headerLine.split(/\s|\[/)[0].toLowerCase();
    if (!name || name === "template") continue;

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

    if (fields.habitat_name?.trim() && fields.description?.trim()) {
      overrides[name] = {
        name: fields.habitat_name,
        description: fields.description,
        overridden: true,
      };
    }
  }

  return overrides;
}

let cachedPromise = null;

export async function loadHabitatOverrides() {
  if (cachedPromise) return cachedPromise;
  cachedPromise = fetch(`${import.meta.env.BASE_URL}habitat-overrides.txt`)
    .then((res) => (res.ok ? res.text() : ""))
    .then(parseHabitatOverrides)
    .catch(() => ({}));
  return cachedPromise;
}
