// Searches every field of every block in field-notes.txt for a term, so a fact
// can be checked against the whole corpus BEFORE it is written into a note.
//
//   npm run fact -- saguaro "basal meristem" thigmomorph
//
// Reading only the block being rewritten is not enough: the fact that spoils a
// note is usually printed on a placard several rooms away. Rewriting all 147
// notes turned up ten such collisions, six of them only after they had been
// written and applied. Run this first and they are caught at the draft stage.
// See DEVLOG §55.
import fs from 'fs';

const raw = fs.readFileSync('public/field-notes.txt', 'utf8').replace(/\r\n?/g, '\n');
const lines = raw.split('\n');
const FIELDS = ['binomial', 'plant_analogue', 'genetic_concept', 'note', 'habitat_note', 'record'];

let block = null;
let field = null;
const rows = [];
for (const line of lines) {
  if (line.startsWith('### END')) { block = null; field = null; continue; }
  if (line.startsWith('### ')) { block = line.slice(4).split('[')[0].trim(); field = null; continue; }
  if (!block) continue;
  const colon = line.indexOf(':');
  const key = colon > 0 ? line.slice(0, colon).trim() : '';
  if (FIELDS.includes(key)) { field = key; rows.push({ block, field, text: line.slice(colon + 1) }); }
  else if (rows.length && field) { rows[rows.length - 1].text += ' ' + line; }
}

for (const term of process.argv.slice(2)) {
  const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const hits = rows.filter((r) => re.test(r.text));
  console.log(`\n"${term}" — ${hits.length} hit(s)`);
  for (const h of hits) {
    const m = re.exec(h.text);
    const at = Math.max(0, m.index - 60);
    console.log(`  ${h.block} [${h.field}] …${h.text.slice(at, m.index + 90).trim()}…`);
  }
}
