// The acquisitions desk — a local page for keeping or discarding papers.
//
//   npm run triage
//
// Serves curation/queue.json as a stack of cards on 127.0.0.1 and writes your
// decisions straight to disk: Keep appends a block to public/manuscripts.txt,
// Discard records the DOI in curation/seen.json so it never comes back.
//
// Why a server and not a plain HTML file: a page opened with file:// cannot
// write anything. This is the smallest thing that can — Node's own http module,
// no dependencies, no build step, nothing hosted. It is bound to 127.0.0.1 so
// it is not reachable from the network, and it exits when you close it.
//
// It is not part of the site. Nothing here is bundled, imported by src/, or
// deployed; `vite build` never sees it.

import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import {
  loadQueue,
  saveQueue,
  saveQueueMarkdown,
  loadSeen,
  saveSeen,
  keepPaper,
  blockId,
} from "./harvest-manuscripts.mjs";

const PORT = Number(process.env.TRIAGE_PORT || 5100);

// Everything the browser renders comes from JSON fetched at load, so the only
// thing interpolated into HTML here is nothing at all — abstracts and titles
// are set with textContent on the client, which cannot execute markup. Paper
// text is third-party data and gets treated as data.
const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Acquisitions — CC Herbarium</title>
<style>
  :root {
    --paper: #f2ede0; --paper-light: #fdfbf4; --paper-shadow: #d8ead9;
    --ink: #5a4a3a; --ink-soft: #8a7a68;
    --green: #6fa97b; --green-deep: #3d6b4c;
    --red: #d98ca3; --gold: #e8b84b;
    --line: rgba(90,74,58,.14);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 20px 80px;
    font: 16px/1.6 "Nunito", "Segoe UI", system-ui, sans-serif;
    color: var(--ink);
    background:
      radial-gradient(ellipse 1200px 700px at 50% -8%, rgba(255,244,214,.85), transparent 60%),
      linear-gradient(180deg, #fffbef 0%, var(--paper) 45%, #e6f2e8 100%);
    background-attachment: fixed; min-height: 100vh;
  }
  .wrap { max-width: 760px; margin: 0 auto; }
  header { text-align: center; margin-bottom: 28px; }
  h1 { font-family: Georgia, "Iowan Old Style", serif; font-size: 1.9rem; margin: 0 0 4px; color: var(--green-deep); font-weight: 600; }
  .sub { font-family: ui-monospace, "IBM Plex Mono", monospace; font-size: .74rem; color: var(--ink-soft); letter-spacing: .04em; text-transform: uppercase; }
  .card {
    background: var(--paper-light); border: 1px solid var(--line);
    border-radius: 14px; padding: 22px 24px; margin-bottom: 18px;
    box-shadow: 0 1px 0 var(--paper-shadow), 0 6px 22px rgba(90,74,58,.06);
  }
  .eyebrow { font-family: ui-monospace, monospace; font-size: .68rem; text-transform: uppercase; letter-spacing: .08em; color: var(--green-deep); margin-bottom: 8px; }
  .title { font-family: Georgia, serif; font-size: 1.12rem; line-height: 1.35; margin: 0 0 8px; }
  .meta { font-family: ui-monospace, monospace; font-size: .72rem; color: var(--ink-soft); margin-bottom: 12px; }
  .meta a { color: var(--green-deep); }
  .summary { font-size: .97rem; margin: 0 0 12px; padding: 14px 16px; background: var(--paper); border-left: 3px solid var(--green); border-radius: 0 8px 8px 0; white-space: pre-wrap; }
  .abstract { font-size: .93rem; margin: 0; max-height: 9.2em; overflow: hidden; position: relative; transition: max-height .18s ease; }
  .abstract.open { max-height: none; }
  .abstract.collapsed { max-height: 0; }
  .abstract.collapsed .fade { display: none; }
  .fade { position: absolute; inset: auto 0 0 0; height: 2.4em; background: linear-gradient(transparent, var(--paper-light)); pointer-events: none; }
  .abstract.open .fade { display: none; }
  .more { background: none; border: 0; padding: 4px 0; margin-top: 6px; color: var(--green-deep); font: inherit; font-size: .8rem; cursor: pointer; text-decoration: underline; }
  .row { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
  button.act { border: 1px solid var(--line); border-radius: 10px; padding: 9px 18px; font: inherit; font-size: .88rem; cursor: pointer; background: var(--paper); color: var(--ink); transition: .12s; }
  button.act:hover { transform: translateY(-1px); }
  button.keep { background: var(--green); border-color: var(--green-deep); color: #fff; font-weight: 600; }
  button.keep:hover { background: var(--green-deep); }
  button.discard:hover { background: var(--red); border-color: var(--red); color: #fff; }
  .preprint { display: inline-block; background: var(--gold); color: #4a3a10; border-radius: 5px; padding: 1px 7px; font-size: .66rem; font-family: ui-monospace, monospace; margin-left: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .done { text-align: center; padding: 50px 20px; color: var(--ink-soft); }
  .done h2 { font-family: Georgia, serif; color: var(--green-deep); font-weight: 600; }
  code { background: var(--paper); padding: 2px 6px; border-radius: 4px; font-size: .85em; }
  .toast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); background: var(--green-deep); color: #fff; padding: 11px 22px; border-radius: 10px; font-size: .87rem; opacity: 0; transition: opacity .2s; pointer-events: none; box-shadow: 0 6px 20px rgba(0,0,0,.16); }
  .toast.show { opacity: 1; }
  .count { font-family: ui-monospace, monospace; font-size: .72rem; color: var(--ink-soft); text-align: center; margin-bottom: 18px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Acquisitions</h1>
    <div class="sub">Reading Room &middot; keep or discard</div>
  </header>
  <div class="count" id="count"></div>
  <div id="stack"></div>
</div>
<div class="toast" id="toast"></div>
<script>
const stack = document.getElementById("stack");
const countEl = document.getElementById("count");
const toastEl = document.getElementById("toast");
let queue = [];

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2200);
}

async function load() {
  queue = await (await fetch("/api/queue")).json();
  render();
}

function render() {
  stack.textContent = "";
  if (!queue.length) {
    const d = document.createElement("div");
    d.className = "done";
    const h = document.createElement("h2");
    h.textContent = "Queue empty";
    const p = document.createElement("p");
    p.textContent = "Run npm run harvest to look for more.";
    const p2 = document.createElement("p");
    p2.textContent = "Anything you kept is in public/manuscripts.txt, waiting for its connection.";
    d.append(h, p, p2);
    stack.append(d);
    countEl.textContent = "";
    return;
  }
  countEl.textContent = queue.length + (queue.length === 1 ? " paper waiting" : " papers waiting");

  for (const p of queue) {
    const card = document.createElement("div");
    card.className = "card";

    const eyebrow = document.createElement("div");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = p.theme.label + " · " + p.theme.room;
    card.append(eyebrow);

    const title = document.createElement("h2");
    title.className = "title";
    // textContent, not innerHTML — this is publisher-supplied text.
    title.textContent = p.title;
    if (p.isPreprint) {
      const tag = document.createElement("span");
      tag.className = "preprint";
      tag.textContent = "preprint";
      title.append(tag);
    }
    card.append(title);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = [p.authors, p.journal, p.year].filter(Boolean).join(" · ") + " · ";
    const a = document.createElement("a");
    a.href = p.url; a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = "read it";
    meta.append(a);
    card.append(meta);

    // A written summary replaces the abstract as the headline reading. The
    // abstract stays available underneath — the summary is somebody's take on
    // the paper, and the source should always be one click away from it.
    if (p.summary) {
      const sum = document.createElement("div");
      sum.className = "summary";
      sum.textContent = p.summary;
      card.append(sum);
    }

    const abs = document.createElement("p");
    abs.className = "abstract";
    if (p.summary) abs.classList.add("collapsed");
    abs.textContent = p.abstract;
    const fade = document.createElement("span");
    fade.className = "fade";
    abs.append(fade);

    const more = document.createElement("button");
    more.className = "more";
    more.textContent = p.summary ? "Show abstract" : "Show full abstract";
    more.onclick = () => {
      abs.classList.remove("collapsed");
      abs.classList.toggle("open");
      more.textContent = abs.classList.contains("open") ? "Collapse" : "Show abstract";
      if (!abs.classList.contains("open") && p.summary) abs.classList.add("collapsed");
    };
    card.append(abs, more);

    const row = document.createElement("div");
    row.className = "row";
    const keep = document.createElement("button");
    keep.className = "act keep";
    keep.textContent = "Keep";
    keep.onclick = () => decide(p.doi, "keep", keep);
    const discard = document.createElement("button");
    discard.className = "act discard";
    discard.textContent = "Discard";
    discard.onclick = () => decide(p.doi, "discard", discard);
    row.append(keep, discard);
    card.append(row);

    stack.append(card);
  }
}

async function decide(doi, action, btn) {
  btn.disabled = true;
  const res = await fetch("/api/" + action, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ doi }),
  });
  const out = await res.json();
  if (!res.ok) {
    btn.disabled = false;
    toast("Failed: " + (out.error || res.status));
    return;
  }
  queue = out.queue;
  toast(action === "keep" ? "Kept as " + out.id + " — write its connection" : "Discarded");
  render();
}

load();
</script>
</body>
</html>`;

function json(res, code, body) {
  const payload = JSON.stringify(body);
  res.writeHead(code, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      // A local tool still shouldn't accept an unbounded body.
      if (data.length > 1e6) reject(new Error("body too large"));
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        reject(new Error("bad JSON"));
      }
    });
    req.on("error", reject);
  });
}

export function createTriageServer() {
  return createServer(async (req, res) => {
    try {
      if (req.method === "GET" && (req.url === "/" || req.url.startsWith("/?"))) {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        return res.end(PAGE);
      }

      if (req.method === "GET" && req.url === "/api/queue") {
        return json(res, 200, loadQueue());
      }

      if (req.method === "POST" && (req.url === "/api/keep" || req.url === "/api/discard")) {
        const { doi } = await readBody(req);
        const queue = loadQueue();
        const paper = queue.find((p) => p.doi === doi);
        // Already gone — a double-click, or a second tab. Return the current
        // queue rather than erroring, so the page just resyncs.
        if (!paper) return json(res, 200, { queue, id: null });

        const rest = queue.filter((p) => p.doi !== doi);

        if (req.url === "/api/keep") {
          keepPaper(paper);
          saveQueue(rest);
          // Keep the readable page in step, so what you see on your phone
          // matches what you decided at the desk.
          saveQueueMarkdown(rest);
          return json(res, 200, { queue: rest, id: blockId(paper) });
        }

        const seen = loadSeen();
        saveSeen([...seen.dois, doi]);
        saveQueue(rest);
        saveQueueMarkdown(rest);
        return json(res, 200, { queue: rest, id: null });
      }

      json(res, 404, { error: "not found" });
    } catch (e) {
      json(res, 500, { error: e.message });
    }
  });
}

function main() {
  const queue = loadQueue();
  const server = createTriageServer();
  // 127.0.0.1, not 0.0.0.0 — this writes to your content file, and nothing on
  // the network has any business reaching it.
  server.listen(PORT, "127.0.0.1", () => {
    process.stdout.write(
      `\nAcquisitions desk — ${queue.length} paper${queue.length === 1 ? "" : "s"} waiting\n` +
        `\n  http://localhost:${PORT}\n\n` +
        `Ctrl+C when you're done.\n`
    );
  });
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      process.stderr.write(`Port ${PORT} is busy. Try: TRIAGE_PORT=5101 npm run triage\n`);
      process.exit(1);
    }
    throw e;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
