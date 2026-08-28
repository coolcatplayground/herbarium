/**
 * The mail desk's back end. Paste this into a Google Apps Script project bound
 * to a spreadsheet, deploy it as a web app, and put the /exec URL into
 * MAIL_ENDPOINT in src/data/curatorMail.js.
 *
 * ── Deploying ────────────────────────────────────────────────────────────────
 *   1. Make a Google Sheet. Extensions → Apps Script.
 *   2. Paste this file over Code.gs. Save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone            ← required; see the warning below
 *   4. Authorise it when asked, then copy the /exec URL.
 *   5. Paste that URL into MAIL_ENDPOINT and deploy the site.
 *
 * Re-deploy as a NEW VERSION after any edit here, or the old code keeps serving.
 *
 * ── What "Anyone" means, plainly ─────────────────────────────────────────────
 * The endpoint has to be open, because the people writing to you are strangers
 * with no Google account of yours. Anyone who reads the site's JavaScript can
 * find this URL and post to it. That is not a flaw to be fixed, it is the deal:
 * a public letterbox is public. What limits the damage is below.
 *
 *   - A honeypot field. Real people never fill it; most bots fill everything.
 *     A letter arriving with it filled is dropped and answered with success, so
 *     the sender learns nothing about why it vanished.
 *   - A daily cap. Once DAILY_CAP letters have arrived in a UTC day the desk
 *     stops accepting, so a flood costs you one bad day rather than a
 *     spreadsheet with a million rows in it.
 *   - Hard length limits, matching the ones the page enforces. The client's
 *     limits are a courtesy; these are the real ones.
 *
 * Apps Script cannot see the caller's IP address, so per-sender rate limiting is
 * not possible here. The daily cap is the blunt instrument that replaces it.
 */

const SHEET_NAME = 'Letters';
const DAILY_CAP = 100;

const MESSAGE_MAX = 500;
const NAME_MAX = 32;
const EMAIL_MAX = 254;
const LETTER_MAX = 2000;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // The honeypot. Answer success so a bot cannot tell it was caught.
    if (body.hp) return ok();

    const message = str(body.message, MESSAGE_MAX);
    if (!message) return fail('empty');

    if (overCap_()) return fail('busy');

    sheet_().appendRow([
      new Date(),
      str(body.paperName, NAME_MAX),
      str(body.from, NAME_MAX),
      str(body.replyTo, EMAIL_MAX),
      message,
      str(body.letter, LETTER_MAX),
      'unread',
    ]);

    return ok();
  } catch (err) {
    // Never echo the error back: it would tell an attacker how the parsing
    // works, and it tells an honest sender nothing they can act on.
    return fail('bad');
  }
}

/**
 * A GET returns nothing useful on purpose. The endpoint exists to receive
 * letters, and anyone who finds the URL should not be able to read the ones
 * already sent — that is what the spreadsheet is for, behind your own login.
 */
function doGet() {
  return json({ ok: true, desk: 'closed to readers' });
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['received', 'paper', 'from', 'reply to', 'message', 'letter', 'status']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function overCap_() {
  const props = PropertiesService.getScriptProperties();
  const key = 'count-' + Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
  const n = Number(props.getProperty(key) || 0);
  if (n >= DAILY_CAP) return true;
  props.setProperty(key, String(n + 1));
  return false;
}

function str(value, max) {
  // Strip control and format characters (the latter is where bidi overrides
  // live), written as property escapes rather than a literal class — a class
  // of raw control bytes is invisible in an editor and impossible to review.
  return String(value == null ? '' : value)
    .replace(/[\p{Cc}\p{Cf}]/gu, '')
    .slice(0, max)
    .trim();
}

function ok() {
  return json({ ok: true });
}

function fail(reason) {
  return json({ ok: false, error: reason });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
