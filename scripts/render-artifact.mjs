// Renders the acquisitions queue as a self-contained page for publishing as a
// private Claude artifact — the version you read and triage on a phone.
//
//   npm run artifact        writes curation/acquisitions.html
//
// The page is a LIVE DOC: a viewer's click changes an attribute in the markup,
// and that change IS the saved document. So every card is written out as real
// HTML here rather than built by script on load — script-rendered content is
// not the document and would not persist a decision.
//
// Decisions are recorded twice on purpose: as `data-decision` on the card (for
// the CSS, and precise to parse) and as visible stamp text (which survives
// being read back as plain text). Reading the published page is how those
// decisions get applied to manuscripts.txt later.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { loadQueue } from "./harvest-manuscripts.mjs";

const OUT = new URL("../curation/acquisitions.html", import.meta.url);

// Escapes for HTML text nodes and attribute values. Titles and abstracts are
// publisher-supplied third-party text and go into markup here rather than
// through textContent, so they have to be escaped at the boundary.
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// The summary is written as plain prose with "Fits:" and "Weak:" leads. Split
// those out so they can be styled as what they are — a verdict and a caveat —
// rather than run together as one grey block.
function splitSummary(text) {
  if (!text) return { body: "", fits: "", weak: "" };
  const grab = (label, next) => {
    const m = text.match(new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${next}):|$)`));
    return m ? m[1].trim() : "";
  };
  const fits = grab("Fits", "Weak");
  const weak = grab("Weak", "$^");
  const body = text.split(/\n\s*Fits:/)[0].trim();
  return { body, fits, weak };
}

function card(p, i) {
  const { body, fits, weak } = splitSummary(p.summary);
  return `
      <article class="slip" data-doi="${esc(p.doi)}" data-decision="">
        <div class="slip__stamp" aria-hidden="true"></div>
        <p class="slip__room">${esc(p.theme.room)}</p>
        <h2 class="slip__title">${esc(p.title)}</h2>
        <p class="slip__meta">${esc(p.authors)}<br><span class="slip__journal">${esc(p.journal || "—")}</span> · ${esc(p.year)}${p.isPreprint ? ' · <span class="slip__pre">preprint</span>' : ""}</p>
        ${body ? `<p class="slip__body">${esc(body)}</p>` : ""}
        ${fits ? `<p class="slip__note slip__note--fits"><span>Fits</span>${esc(fits)}</p>` : ""}
        ${weak ? `<p class="slip__note slip__note--weak"><span>Weak</span>${esc(weak)}</p>` : ""}
        <details class="slip__abstract">
          <summary>Abstract</summary>
          <p>${esc(p.abstract)}</p>
        </details>
        <div class="slip__actions">
          <button type="button" class="btn btn--keep" onclick="decide(this,'kept')">Keep</button>
          <button type="button" class="btn btn--discard" onclick="decide(this,'discarded')">Discard</button>
          <button type="button" class="btn btn--undo" onclick="decide(this,'')">Undo</button>
          <a class="btn btn--read" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Read&nbsp;it&nbsp;&rarr;</a>
        </div>
      </article>`;
}

export function renderArtifact(queue, now = new Date()) {
  const stamp = now.toISOString().slice(0, 10);
  return `<title>Acquisitions Desk</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Nunito:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&family=Caveat:wght@600;700&display=swap">
<style>
  :root {
    --paper:        #f2ede0;
    --card:         #fdfbf4;
    --edge:         rgba(90, 74, 58, .16);
    --ink:          #5a4a3a;
    --ink-soft:     #8a7a68;
    --green:        #6fa97b;
    --green-deep:   #3d6b4c;
    --green-wash:   #eaf3ea;
    --rose:         #d98ca3;
    --rose-wash:    #f8ecef;
    --gold:         #e8b84b;
    --glow:         rgba(90, 74, 58, .07);

    --display: "Fraunces", "Iowan Old Style", Georgia, serif;
    --body:    "Nunito", "Segoe UI", system-ui, sans-serif;
    --mono:    "IBM Plex Mono", ui-monospace, monospace;
    --hand:    "Caveat", "Segoe Script", cursive;
  }

  /* A specimen cabinet after hours: warm and brown-biased, never neutral black. */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --paper:      #1b1915;
      --card:       #262218;
      --edge:       rgba(232, 224, 208, .14);
      --ink:        #ece3d2;
      --ink-soft:   #a89a84;
      --green:      #7cbb8c;
      --green-deep: #a3d4b0;
      --green-wash: #212c22;
      --rose:       #e2a2b5;
      --rose-wash:  #2e2126;
      --gold:       #f0c95f;
      --glow:       rgba(0, 0, 0, .3);
    }
  }
  :root[data-theme="dark"] {
    --paper:      #1b1915;
    --card:       #262218;
    --edge:       rgba(232, 224, 208, .14);
    --ink:        #ece3d2;
    --ink-soft:   #a89a84;
    --green:      #7cbb8c;
    --green-deep: #a3d4b0;
    --green-wash: #212c22;
    --rose:       #e2a2b5;
    --rose-wash:  #2e2126;
    --gold:       #f0c95f;
    --glow:       rgba(0, 0, 0, .3);
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    padding: 34px 18px 90px;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--body);
    font-size: 16px;
    line-height: 1.62;
    -webkit-font-smoothing: antialiased;
  }

  .sheet { max-width: 44rem; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }

  .masthead { text-align: center; display: flex; flex-direction: column; gap: 5px; margin-bottom: 4px; }
  .masthead h1 {
    font-family: var(--display);
    font-weight: 600;
    font-size: clamp(1.85rem, 1.5rem + 1.7vw, 2.5rem);
    margin: 0;
    color: var(--green-deep);
    text-wrap: balance;
    letter-spacing: -.012em;
  }
  .masthead p { margin: 0; font-family: var(--mono); font-size: .68rem; letter-spacing: .13em; text-transform: uppercase; color: var(--ink-soft); }

  .tally {
    font-family: var(--mono); font-size: .74rem; color: var(--ink-soft);
    text-align: center; padding: 9px 14px;
    border-top: 1px solid var(--edge); border-bottom: 1px solid var(--edge);
    font-variant-numeric: tabular-nums;
  }
  .tally b { color: var(--green-deep); font-weight: 600; }

  /* --- one determination slip ------------------------------------------ */
  .slip {
    position: relative;
    background: var(--card);
    border: 1px solid var(--edge);
    border-radius: 3px 3px 14px 3px;
    padding: 22px 22px 18px;
    box-shadow: 0 1px 0 var(--edge), 0 8px 26px var(--glow);
    display: flex; flex-direction: column; gap: 11px;
    transition: opacity .2s ease, border-color .2s ease;
  }
  .slip::before {
    content: ""; position: absolute; inset: 0 auto 0 0; width: 3px;
    background: var(--gold); border-radius: 3px 0 0 3px; opacity: .5;
  }
  .slip[data-decision="kept"] { border-color: var(--green); }
  .slip[data-decision="kept"]::before { background: var(--green); opacity: 1; }
  .slip[data-decision="discarded"] { opacity: .5; }
  .slip[data-decision="discarded"]::before { background: var(--rose); opacity: 1; }

  .slip__stamp {
    position: absolute; top: 14px; right: 16px;
    font-family: var(--hand); font-size: 1.5rem; font-weight: 700;
    transform: rotate(-7deg); pointer-events: none; line-height: 1;
  }
  .slip[data-decision=""] .slip__stamp::after { content: ""; }
  .slip[data-decision="kept"] .slip__stamp::after { content: "kept"; color: var(--green-deep); }
  .slip[data-decision="discarded"] .slip__stamp::after { content: "discarded"; color: var(--rose); }

  .slip__room { margin: 0; font-family: var(--mono); font-size: .63rem; letter-spacing: .1em; text-transform: uppercase; color: var(--green-deep); padding-right: 5.5rem; }
  .slip__title { margin: 0; font-family: var(--display); font-weight: 600; font-size: 1.14rem; line-height: 1.34; text-wrap: balance; letter-spacing: -.006em; }
  .slip__meta { margin: 0; font-family: var(--mono); font-size: .7rem; line-height: 1.55; color: var(--ink-soft); }
  .slip__journal { font-style: italic; }
  .slip__pre { color: var(--gold); font-weight: 500; }
  .slip__body { margin: 0; font-size: .95rem; }

  .slip__note { margin: 0; font-size: .89rem; padding: 9px 13px; border-radius: 0 8px 8px 0; }
  .slip__note span {
    display: block; font-family: var(--mono); font-size: .6rem;
    letter-spacing: .11em; text-transform: uppercase; margin-bottom: 2px; opacity: .85;
  }
  .slip__note--fits { background: var(--green-wash); border-left: 2px solid var(--green); }
  .slip__note--fits span { color: var(--green-deep); }
  .slip__note--weak { background: var(--rose-wash); border-left: 2px solid var(--rose); }
  .slip__note--weak span { color: var(--rose); }

  .slip__abstract { font-size: .88rem; color: var(--ink-soft); }
  .slip__abstract summary { cursor: pointer; font-family: var(--mono); font-size: .68rem; letter-spacing: .07em; text-transform: uppercase; color: var(--green-deep); }
  .slip__abstract p { margin: 9px 0 0; }

  .slip__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 3px; }
  .btn {
    font-family: var(--body); font-size: .85rem; font-weight: 600;
    padding: 9px 16px; border-radius: 9px; border: 1px solid var(--edge);
    background: var(--paper); color: var(--ink);
    cursor: pointer; text-decoration: none; display: inline-block;
    transition: background .14s ease, color .14s ease, border-color .14s ease;
  }
  .btn:focus-visible { outline: 2px solid var(--green-deep); outline-offset: 2px; }
  .btn--keep { background: var(--green); border-color: var(--green); color: #14261a; }
  .btn--discard:hover { background: var(--rose); border-color: var(--rose); color: #2b161c; }
  .btn--read { margin-left: auto; font-family: var(--mono); font-size: .74rem; font-weight: 400; color: var(--green-deep); }
  .btn--undo { display: none; }
  .slip:not([data-decision=""]) .btn--keep,
  .slip:not([data-decision=""]) .btn--discard { display: none; }
  .slip:not([data-decision=""]) .btn--undo { display: inline-block; }

  .colophon { font-family: var(--mono); font-size: .67rem; color: var(--ink-soft); text-align: center; line-height: 1.8; margin-top: 8px; }
  .colophon code { background: var(--card); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--edge); }

  .empty { text-align: center; padding: 46px 20px; color: var(--ink-soft); }
  .empty h2 { font-family: var(--display); color: var(--green-deep); font-weight: 600; margin: 0 0 6px; }

  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  @media (max-width: 480px) {
    body { padding: 26px 13px 70px; }
    .slip { padding: 19px 17px 16px; }
    .slip__room { padding-right: 4.5rem; }
    .btn--read { margin-left: 0; }
  }
</style>

<div class="sheet">
  <header class="masthead">
    <h1>Acquisitions Desk</h1>
    <p>CC Herbarium &middot; Reading Room</p>
  </header>

  <p class="tally" id="tally">${queue.length} waiting &middot; updated ${stamp}</p>
${queue.length === 0
  ? `  <div class="empty"><h2>Nothing waiting</h2><p>The next harvest will look again.</p></div>`
  : queue.map(card).join("\n")}

  <p class="colophon">
    Decisions save to this page and are applied to<br>
    <code>public/manuscripts.txt</code> at the desk.<br>
    A kept paper still needs its connection written.
  </p>
</div>

<script>
  // Only ever called from a click, so the attribute change counts as a viewer
  // gesture and is saved as part of the document.
  function decide(btn, state) {
    btn.closest(".slip").dataset.decision = state;
    tally();
  }

  // Derived from the cards themselves, so it is correct on a fresh load of a
  // page that already carries decisions.
  function tally() {
    var slips = document.querySelectorAll(".slip");
    if (!slips.length) return;
    var kept = 0, gone = 0;
    slips.forEach(function (s) {
      if (s.dataset.decision === "kept") kept++;
      else if (s.dataset.decision === "discarded") gone++;
    });
    var left = slips.length - kept - gone;
    var el = document.getElementById("tally");
    if (el) {
      el.innerHTML = left + " undecided &middot; <b>" + kept + " kept</b> &middot; " + gone + " discarded";
    }
  }

  tally();
</script>
`;
}

function main() {
  const queue = loadQueue();
  mkdirSync(new URL("./", OUT), { recursive: true });
  writeFileSync(OUT, renderArtifact(queue), "utf8");
  process.stdout.write(
    `Wrote curation/acquisitions.html — ${queue.length} paper${queue.length === 1 ? "" : "s"}\n`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
