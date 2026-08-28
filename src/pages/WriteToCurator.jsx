import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import RoomBackdrop from "../components/RoomBackdrop";
import {
  CURATOR_ADDRESS,
  MAIL_ENDPOINT,
  buildSubmission,
  collectsLetters,
  DEFAULT_PAPER,
  MAIL_PAPERS,
  MESSAGE_MAX,
  NAME_MAX,
  buildLetter,
  getPaper,
  mailtoHref,
} from "../data/curatorMail";

// The mail desk. Choose a sheet, write on it, look at what you have written,
// then hand it over.
//
// It stands in the curator's room, the same one the Curator's Note stands in,
// because it is the same conversation continued rather than a form bolted to
// the side of the building.
//
// Nothing here posts anywhere. The site is static, so the letter leaves by the
// visitor's own mail client or by their clipboard, and both routes are offered
// plainly — see `curatorMail.js` for why the clipboard is not the small print.

const DRAFT_KEY = "cc-herbarium-mail-draft";

// The item's own sprite, served from our own origin like every other image
// here — never hotlinked, for the reason set out at the top of
// scripts/fetch-sprites.mjs.
//
// 24x24 pixel art drawn at an exact multiple of itself, with `pixelated` so
// the browser does not smooth it. Bilinear upscaling is what makes sprite art
// look like a mistake rather than a choice.
//
// It removes itself if the file is missing, which happens on a fresh clone
// before `npm run sprites` has been run. The sheet still reads correctly
// without it: the paper's name is written beside it, never carried by it.
function MailIcon({ id, size = 48 }) {
  const [missing, setMissing] = useState(false);
  if (missing) return null;
  return (
    <img
      className="mail-icon"
      src={`${import.meta.env.BASE_URL}sprites/${id}.png`}
      alt=""
      width={size}
      height={size}
      onError={() => setMissing(true)}
    />
  );
}

// A letter someone has spent ten minutes composing should survive a stray
// reload. Wrapped because storage throws outright in a locked-down browser
// rather than merely returning nothing, and losing the draft is a far smaller
// problem than a blank page.
function loadDraft() {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft && typeof draft === "object" ? draft : null;
  } catch {
    return null;
  }
}

function saveDraft(draft) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* A draft that cannot be kept is not worth a broken page. */
  }
}

export default function WriteToCurator() {
  useDocumentTitle("Write to the Curator");

  const draft = useMemo(loadDraft, []);
  const [paperId, setPaperId] = useState(draft?.paper ?? DEFAULT_PAPER);
  const [from, setFrom] = useState(draft?.from ?? "");
  const [message, setMessage] = useState(draft?.message ?? "");
  const [sealed, setSealed] = useState(false);
  const [copied, setCopied] = useState(null);
  // The plain-text letter is folded away by default — it is the mechanism, not
  // the point. It has to open itself when the clipboard is refused, though,
  // because at that moment it stops being a curiosity and becomes the only way
  // the letter gets out.
  const [showPlain, setShowPlain] = useState(false);
  // Optional, and only ever used to reply. Asked for because a correction you
  // cannot answer is half a conversation — but never required, because plenty
  // of people will rightly not want to hand over an address to say that a
  // placard has a date wrong.
  const [replyTo, setReplyTo] = useState(draft?.replyTo ?? "");
  // The honeypot. Never shown, never focusable, never announced. A person
  // cannot fill it in; a bot filling every field it finds will.
  const [trap, setTrap] = useState("");
  // idle · sending · delivered · failed
  const [delivery, setDelivery] = useState("idle");

  const sealedRef = useRef(null);
  const paper = getPaper(paperId);
  const written = message.trim().length > 0;

  useEffect(() => {
    saveDraft({ paper: paperId, from, replyTo, message });
  }, [paperId, from, replyTo, message]);

  // Moving focus to the sealed letter rather than leaving it at the button that
  // is no longer on screen. Without this a screen reader is told nothing
  // happened, and a keyboard user is returned to the top of the document.
  useEffect(() => {
    if (sealed) sealedRef.current?.focus();
  }, [sealed]);

  const letter = useMemo(
    () => buildLetter({ paper: paperId, from, message }),
    [paperId, from, message],
  );
  const href = useMemo(
    () => mailtoHref({ paper: paperId, from, message }),
    [paperId, from, message],
  );

  async function copy(text, what) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
    } catch {
      // Clipboard access is refused in a few settings and over plain http.
      // Saying so is more use than a button that silently does nothing.
      setCopied("failed");
      setShowPlain(true);
    }
  }

  // Posting the letter to the curator's desk, when there is a desk to post to.
  //
  // The response is read rather than fired blind: Apps Script's /exec redirects
  // to a googleusercontent URL that does send CORS headers, so a normal fetch
  // usually can read the reply — but "usually" is not "always", and a letter
  // that vanished must never be reported as delivered. So a throw is treated as
  // an unknown outcome, not a success, and the page says exactly that and keeps
  // the other two routes open.
  async function send() {
    setDelivery("sending");
    try {
      const res = await fetch(MAIL_ENDPOINT, {
        method: "POST",
        // text/plain keeps this a "simple" request, so the browser sends it
        // without a preflight — which Apps Script does not answer.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...buildSubmission({ paper: paperId, from, replyTo, message }),
          hp: trap,
        }),
      });
      const body = await res.json();
      setDelivery(body && body.ok ? "delivered" : "failed");
    } catch {
      setDelivery("failed");
    }
  }

  const paperStyle = {
    "--sheet-accent": paper.accent,
    // The measured opacity this particular artwork needs under body text. Not
    // a style choice — see MAIL_PAPERS.
    "--sheet-veil": paper.veil,
    // The artwork's own writing area, as CSS insets.
    "--panel-left": `${paper.panel[0] * 100}%`,
    "--panel-top": `${paper.panel[1] * 100}%`,
    "--panel-right": `${(1 - paper.panel[2]) * 100}%`,
    "--panel-bottom": `${(1 - paper.panel[3]) * 100}%`,
  };

  return (
    <div className="container" style={{ padding: "40px 24px 100px", maxWidth: "720px" }}>
      <RoomBackdrop image="rooms/curator-room.jpg" />

      {/* Title only. The two explanatory paragraphs were removed deliberately:
          the sheets below explain themselves, and a preamble telling someone
          they may write a letter, above an obvious letter-writing desk, was
          saying nothing they could not already see.

          What the second paragraph carried — whether letters are kept — has not
          been dropped, it has moved to the point of sending. See the note by
          the sealed sheet's actions. */}
      <div className="placard placard--title">
        <p className="eyebrow">Correspondence</p>
        <h2 style={{ fontSize: "var(--step3)", margin: 0 }}>Write to the Curator</h2>
      </div>

      {!sealed && (
        <>
          <fieldset className="plate-frame mail-papers">
            {/* Kept for assistive tech, hidden from view.

                It was visible and it was broken: a <legend> is positioned by
                the browser straddling the fieldset's top border, so it punched
                a gap in the card's edge and sat half over the painted room
                behind it — unmounted text on a painting, which is the one thing
                this site's CSS is most careful never to do.

                Deleting the element outright would have been worse than the
                bug. A radio group with no accessible name announces as six
                unlabelled buttons, and the sheets are the whole choice on this
                page. So it stays, silently. */}
            <legend className="sr-only">Choose a sheet</legend>
            <div className="mail-papers__grid">
              {MAIL_PAPERS.map((sheet) => {
                const checked = sheet.id === paperId;
                return (
                  <label
                    key={sheet.id}
                    className={`mail-swatch${checked ? " is-chosen" : ""}`}
                    style={{ "--sheet-accent": sheet.accent }}
                  >
                    <input
                      type="radio"
                      name="paper"
                      value={sheet.id}
                      checked={checked}
                      onChange={() => setPaperId(sheet.id)}
                      className="sr-only"
                    />
                    <img
                      className="mail-swatch__art"
                      src={`${import.meta.env.BASE_URL}mail/${sheet.id}.png`}
                      alt=""
                      width={256}
                      height={192}
                    />
                    <span className="mail-swatch__name">{sheet.name}</span>
                    <span className="mail-swatch__blurb">{sheet.blurb}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <figure className="mail-sheet" style={paperStyle}>
            <div className="mail-sheet__canvas">
              <img
                className="mail-sheet__art"
                src={`${import.meta.env.BASE_URL}mail/${paper.id}.png`}
                alt=""
                width={256}
                height={192}
              />
              <div className="mail-sheet__panel">
                <input
                  type="text"
                  value={from}
                  maxLength={NAME_MAX}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="a name to sign it with"
                  className="mail-sheet__from"
                  aria-label="Your name"
                />
                <textarea
                  value={message}
                  maxLength={MESSAGE_MAX}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mail-sheet__body"
                  placeholder="Write here."
                  aria-label="Your letter"
                />
                {/* Off-screen rather than display:none — some bots skip
                    anything hidden, and this one is meant to be found and
                    filled. tabIndex -1 and aria-hidden keep it away from
                    anyone using a keyboard or a screen reader. */}
                <input
                  className="sr-only"
                  type="text"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  value={trap}
                  onChange={(e) => setTrap(e.target.value)}
                />
              </div>
              {/* Sits on the stationery, bottom right, on its own mounted chip.
                  It used to hang under the sheet with nothing behind it, which
                  over a painted room made it unreadable — the same mistake as
                  the fieldset legend. Anything laid on the artwork needs a
                  ground of its own. */}
              <p
                className={`mail-sheet__count mono${
                  message.length > MESSAGE_MAX - 60 ? " is-near" : ""
                }`}
                aria-live="polite"
              >
                {message.length} of {MESSAGE_MAX}
              </p>
            </div>
            <figcaption className="mail-sheet__label">
              <MailIcon id={paper.id} size={24} />
              {paper.name}
            </figcaption>
          </figure>

          <div className="mail-meta">
            {collectsLetters() && (
              <label className="mail-reply">
                <span className="mail-reply__label mono">
                  Your address — optional, only used to reply
                </span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  placeholder="leave blank if you would rather not"
                />
              </label>
            )}
          </div>

          <div className="mail-actions">
            <button
              type="button"
              className="mail-button mail-button--primary"
              disabled={!written}
              onClick={() => {
                setCopied(null);
                setSealed(true);
              }}
            >
              Seal it and check
            </button>
            <Link to="/about" className="mail-button">
              Back to the Curator&rsquo;s Note
            </Link>
          </div>
          {!written && (
            <p className="placard placard--quiet mail-hint">
              The sheet is still blank. Write something and the desk will make the letter.
            </p>
          )}
        </>
      )}

      {sealed && (
        <>
          <figure
            className="mail-sheet mail-sheet--sealed"
            style={paperStyle}
            ref={sealedRef}
            tabIndex={-1}
            aria-label={`Your ${paper.name}, sealed and ready to send`}
          >
            <div className="mail-sheet__canvas">
              <img
                className="mail-sheet__art"
                src={`${import.meta.env.BASE_URL}mail/${paper.id}.png`}
                alt=""
                width={256}
                height={192}
              />
              <div className="mail-sheet__panel">
                <p className="mail-sheet__written">{message.trim()}</p>
                <p className="mail-sheet__sign">
                  from — {from.trim() || "a visitor who left no name"}
                </p>
              </div>
            </div>
            <figcaption className="mail-sheet__label">
              <MailIcon id={paper.id} size={24} />
              {paper.name}
            </figcaption>
          </figure>

          <div className="mail-actions">
            {collectsLetters() && (
              <button
                type="button"
                className="mail-button mail-button--primary"
                onClick={send}
                disabled={delivery === "sending" || delivery === "delivered"}
              >
                {delivery === "sending"
                  ? "Sending…"
                  : delivery === "delivered"
                    ? "Delivered"
                    : "Send it to the curator"}
              </button>
            )}
            {href ? (
              <a
                className={`mail-button${collectsLetters() ? "" : " mail-button--primary"}`}
                href={href}
              >
                Open it in your mail app
              </a>
            ) : (
              <button type="button" className="mail-button" disabled>
                Too long for a mail link
              </button>
            )}
            <button type="button" className="mail-button" onClick={() => copy(letter, "letter")}>
              Copy the letter
            </button>
            <button
              type="button"
              className="mail-button"
              onClick={() => {
                setCopied(null);
                setSealed(false);
              }}
            >
              Back to writing
            </button>
          </div>

          <div className="placard placard--quiet mail-hint" aria-live="polite">
            {delivery === "delivered" && (
              <p style={{ margin: "0 0 8px" }}>
                Delivered to the desk. It will be read — and if you left an address, answered.
              </p>
            )}
            {delivery === "failed" && (
              <p style={{ margin: "0 0 8px" }}>
                The desk did not confirm it, so treat this letter as unsent rather than
                lost — the two routes below both still work.
              </p>
            )}
            {copied === "letter" && (
              <p style={{ margin: "0 0 8px" }}>
                Copied. Paste it into a mail to{" "}
                <button type="button" className="mail-inline" onClick={() => copy(CURATOR_ADDRESS, "address")}>
                  {CURATOR_ADDRESS}
                </button>
                .
              </p>
            )}
            {copied === "address" && (
              <p style={{ margin: "0 0 8px" }}>Address copied.</p>
            )}
            {copied === "failed" && (
              <p style={{ margin: "0 0 8px" }}>
                This browser would not let the page reach the clipboard. The letter is
                written out below — select it and copy it by hand.
              </p>
            )}
            {!href && (
              <p style={{ margin: "0 0 8px" }}>
                A mail link can only carry so much, and this letter is over it — which
                happens at ordinary length in Thai and other scripts where every character
                costs several times what a Latin one does. Copy it instead; it is the same
                letter.
              </p>
            )}
            {/* The disclosure that used to sit in the page's preamble. It reads
                better here and it is fairer here: you are told what becomes of
                your letter at the moment you are deciding to send it, not in a
                paragraph above a blank sheet. Still generated from
                collectsLetters(), so it cannot outlive the behaviour. */}
            <p style={{ margin: "0 0 8px" }}>
              {collectsLetters()
                ? "Sending delivers this letter to the curator's desk, where it is kept until it has been read. An address is optional, used only to reply, and shown to nobody else."
                : "Nothing is sent from this page and nothing is kept here — the letter leaves by your own mail app or your clipboard."}
            </p>
            <p style={{ margin: 0 }}>
              The curator reads at{" "}
              <a href={`mailto:${CURATOR_ADDRESS}`} style={{ color: "var(--specimen-red)" }}>
                {CURATOR_ADDRESS}
              </a>
              . Whichever way it travels, your own mail address is how a reply gets back.
            </p>
          </div>

          <details
            className="placard placard--quiet mail-hint"
            open={showPlain}
            onToggle={(e) => setShowPlain(e.currentTarget.open)}
          >
            <summary className="mono mail-summary">See exactly what arrives</summary>
            <pre className="mail-plain">{letter}</pre>
          </details>
        </>
      )}
    </div>
  );
}
