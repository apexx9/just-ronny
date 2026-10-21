/* Contact-form email templates: "the receipt".
   Monochrome, typographic, built like a printed ticket: a mono ticket ID,
   a status pill, dashed perforation lines, a delivery tracker and an
   oversized wordmark in the footer.

   Everything important is inline-styled and table-based because email clients
   are hostile. A small <style> block layers dark mode and mobile tweaks on
   top for the clients that support it (Apple Mail, iOS, Gmail web, Outlook.com);
   clients that strip it just show the light layout. Each email also ships a
   plain-text alternative.

   Tip: pass the SAME `receivedAt` to both functions so the owner and the
   visitor see the same ticket ID. */

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ronny.tech";
/* Human-facing host, derived from SITE_URL (ronny.tech, www.x.com …). */
const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "ronny.tech";
  }
})();

const OWNER_NAME = "Aaron Nartey";
const OWNER_FIRST = "Aaron";
const OWNER_EMAIL = "aaronnartey001@gmail.com";

/* ── Design tokens ───────────────────────────────────── */

const C = {
  ink: "#0a0a0a",
  muted: "#6f6f6a",
  faint: "#a1a19b",
  hair: "#e6e6e1",
  dash: "#d6d6d0",
  canvas: "#f3f3f0",
  card: "#ffffff",
  soft: "#f7f7f4",
  green: "#16a34a",
  wordmark: "#e3e3dd",
};

const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO =
  "SFMono-Regular, ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";

/* ── Helpers ─────────────────────────────────────────── */

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* Collapse whitespace and newlines: safe for subjects and single-line text. */
function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function firstName(name: string): string {
  return clean(name).split(" ")[0] || "there";
}

function excerpt(value: string, max: number): string {
  const v = clean(value);
  return v.length > max ? `${v.slice(0, max - 1).trimEnd()}…` : v;
}

function wordCount(value: string): number {
  const v = value.trim();
  return v ? v.split(/\s+/).length : 0;
}

/* Short, stable ticket ID from email + timestamp (FNV-1a). */
export function ticketId(payload: ContactPayload, date: Date): string {
  const input = `${payload.email.trim().toLowerCase()}|${date.getTime()}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `MSG-${hex.slice(0, 6)}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/* Escape a plain-text message and keep its line breaks. */
function formatMessage(message: string, fontSize: number, gap = 14): string {
  return escapeHtml(message.trim())
    .split(/\n{2,}/)
    .map((para) => para.replace(/\n/g, "<br />"))
    .map(
      (para) =>
        `<p style="margin:0 0 ${gap}px;font-size:${fontSize}px;line-height:1.7;word-break:break-word;">${para}</p>`
    )
    .join("");
}

/* ── Building blocks ─────────────────────────────────── */

function label(text: string, extra = ""): string {
  return `<p class="c-faint" style="margin:0 0 10px;font-family:${MONO};font-size:10px;line-height:1.4;letter-spacing:0.16em;text-transform:uppercase;color:${C.faint};${extra}">${text}</p>`;
}

function pill(text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="c-hair c-ink" style="border:1px solid ${C.hair};border-radius:999px;padding:7px 14px 7px 11px;font-family:${MONO};font-size:11px;line-height:1;letter-spacing:0.12em;text-transform:uppercase;color:${C.ink};white-space:nowrap;"><span style="color:${C.green};font-size:9px;vertical-align:1px;">&#9679;</span>&nbsp;&nbsp;${text}</td>
                </tr>
              </table>`;
}

/* Dashed "perforation" line. */
function divider(space = 32): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:${space}px 0;">
                <tr>
                  <td class="c-hair" style="height:0;font-size:0;line-height:0;border-top:1px dashed ${C.dash};">&nbsp;</td>
                </tr>
              </table>`;
}

function metaCell(title: string, value: string): string {
  return `<td class="stack" width="50%" valign="top" style="padding:0 12px 22px 0;">
                    ${label(title, "margin-bottom:6px;")}
                    <p class="c-ink" style="margin:0;font-family:${SANS};font-size:15px;line-height:1.4;font-weight:500;color:${C.ink};">${value}</p>
                  </td>`;
}

/* Page frame: canvas, header row, card, oversized wordmark footer. */
function shell(
  inner: string,
  opts: { preheader: string; ticket: string; footerLabel: string }
): string {
  const { preheader, ticket, footerLabel } = opts;

  /* Scale the wordmark so long hosts never overflow. */
  const wmSize = SITE_HOST.length <= 12 ? 64 : SITE_HOST.length <= 18 ? 46 : 34;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(preheader)}</title>
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      @media (max-width: 600px) {
        .outer { padding: 20px 12px !important; }
        .px { padding-left: 24px !important; padding-right: 24px !important; }
        .h1 { font-size: 32px !important; }
        .stack { display: block !important; width: 100% !important; padding-right: 0 !important; }
        .wm { font-size: 40px !important; }
      }
      @media (prefers-color-scheme: dark) {
        body, .c-canvas { background: #0a0a0a !important; }
        .c-card { background: #111111 !important; border-color: #242422 !important; }
        .c-ink { color: #f5f5f2 !important; }
        .c-muted { color: #9a9a94 !important; }
        .c-faint { color: #6f6f6a !important; }
        .c-hair { border-color: #2a2a28 !important; }
        .c-soft { background: #181816 !important; }
        .c-quote { color: #bdbdb7 !important; }
        .c-bl { border-left-color: #f5f5f2 !important; }
        .c-mono { background: #f5f5f2 !important; color: #0a0a0a !important; }
        .c-btn { background: #f5f5f2 !important; }
        .c-btn a { color: #0a0a0a !important; }
        .c-bar-on { background: #f5f5f2 !important; }
        .c-bar-off { background: #2a2a28 !important; }
        .c-wm { color: #1a1a18 !important; }
      }
    </style>
  </head>
  <body class="c-canvas" style="margin:0;padding:0;background:${C.canvas};">
    <div
      style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;"
      aria-hidden="true"
    >${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
    <table class="c-canvas" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.canvas};">
      <tr>
        <td class="outer" align="center" style="padding:40px 16px 48px;">

          <!-- header: monogram + ticket -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin:0 auto 18px;">
            <tr>
              <td align="left">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="c-mono" width="30" height="30" align="center" valign="middle" style="width:30px;height:30px;border-radius:15px;background:${C.ink};color:#ffffff;font-family:${SERIF};font-style:italic;font-size:16px;line-height:30px;">A</td>
                    <td class="c-ink" style="padding-left:10px;font-family:${SANS};font-size:14px;font-weight:600;letter-spacing:-0.01em;color:${C.ink};">${OWNER_NAME}</td>
                  </tr>
                </table>
              </td>
              <td class="c-faint" align="right" style="font-family:${MONO};font-size:11px;letter-spacing:0.1em;color:${C.faint};">${ticket}</td>
            </tr>
          </table>

          <!-- card -->
          <table
            class="c-card"
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="max-width:560px;margin:0 auto;background:${C.card};border:1px solid ${C.hair};border-radius:16px;"
          >
            <tr>
              <td class="px" style="padding:40px 40px 36px;">
                ${inner}
              </td>
            </tr>
          </table>

          <!-- footer: oversized wordmark -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin:0 auto;">
            <tr>
              <td align="left" style="padding:30px 4px 0;">
                <div class="c-wm wm" style="font-family:${SANS};font-size:${wmSize}px;line-height:1;font-weight:700;letter-spacing:-0.06em;color:${C.wordmark};">${escapeHtml(SITE_HOST)}</div>
              </td>
            </tr>
            <tr>
              <td class="c-faint" align="left" style="padding:16px 4px 0;font-family:${MONO};font-size:10px;line-height:1.6;letter-spacing:0.14em;text-transform:uppercase;color:${C.faint};">
                ${escapeHtml(footerLabel)} &middot;
                <a class="c-faint" href="${escapeHtml(SITE_URL)}" style="color:${C.faint};text-decoration:underline;">Visit site</a>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/* ── Owner notification ──────────────────────────────── */

export function ownerNotificationEmail(
  payload: ContactPayload,
  receivedAt = new Date()
): RenderedEmail {
  const name = clean(payload.name);
  const email = payload.email.trim();
  const message = payload.message.trim();
  const first = firstName(name);
  const ticket = ticketId(payload, receivedAt);
  const words = wordCount(message);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  const replySubject = `Re: your message to ${SITE_HOST}`;
  const replyHref = escapeHtml(
    `mailto:${email}?subject=${encodeURIComponent(replySubject)}`
  );
  const gmailHref = escapeHtml(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(replySubject)}`
  );

  const inner = `
                ${pill("New message")}

                <h1
                  class="c-ink h1"
                  style="margin:24px 0 8px;font-family:${SANS};font-size:38px;line-height:1.08;font-weight:600;letter-spacing:-0.035em;color:${C.ink};word-break:break-word;"
                >${safeName}</h1>
                <p style="margin:0;font-family:${MONO};font-size:13px;line-height:1.5;">
                  <a class="c-muted" href="${replyHref}" style="color:${C.muted};text-decoration:none;">${safeEmail}</a>
                </p>

                ${divider(30)}

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    ${metaCell("Received", escapeHtml(formatDate(receivedAt)))}
                    ${metaCell("Time", escapeHtml(formatTime(receivedAt)))}
                  </tr>
                  <tr>
                    ${metaCell("Source", escapeHtml(SITE_HOST))}
                    ${metaCell("Length", `${words} ${words === 1 ? "word" : "words"}`)}
                  </tr>
                </table>

                ${divider(10)}

                ${label("Message", "margin-bottom:16px;")}
                <div class="c-ink" style="font-family:${SANS};color:${C.ink};">
                  ${formatMessage(message, 16, 14)}
                </div>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0;">
                  <tr>
                    <td class="c-btn" style="background:${C.ink};border-radius:999px;">
                      <a
                        href="${replyHref}"
                        style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;white-space:nowrap;"
                      >Reply to ${escapeHtml(first)} &rarr;</a>
                    </td>
                    <td style="padding-left:18px;">
                      <a
                        class="c-ink"
                        href="${gmailHref}"
                        style="font-family:${SANS};font-size:14px;color:${C.ink};text-decoration:underline;text-underline-offset:3px;"
                      >Open in Gmail</a>
                    </td>
                  </tr>
                </table>`;

  const text = `NEW MESSAGE · ${ticket}

${name}
${email}
${formatDate(receivedAt)} · ${formatTime(receivedAt)} · ${words} ${words === 1 ? "word" : "words"}

--------------------------------

${message}

--------------------------------

Reply:  mailto:${email}
Gmail:  https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}

Sent from ${SITE_URL}`;

  return {
    subject: `New message from ${name} · ${ticket}`,
    html: shell(inner, {
      preheader: `${name}: ${excerpt(message, 110)}`,
      ticket,
      footerLabel: `Contact form · ${ticket}`,
    }),
    text,
  };
}

/* ── Visitor auto-reply ──────────────────────────────── */

/* Three-step delivery tracker: Sent (done), In review, Reply. */
function tracker(sentAt: string): string {
  const bar = (on: boolean) =>
    `<td class="${on ? "c-bar-on" : "c-bar-off"}" height="3" style="height:3px;font-size:0;line-height:0;border-radius:2px;background:${
      on ? C.ink : C.hair
    };">&nbsp;</td>`;
  const gap = `<td width="6" style="width:6px;font-size:0;line-height:0;">&nbsp;</td>`;
  const step = (title: string, sub: string, on: boolean) =>
    `<td valign="top" style="padding-top:12px;">
                      <p class="${on ? "c-ink" : "c-faint"}" style="margin:0 0 3px;font-family:${MONO};font-size:10px;line-height:1.3;letter-spacing:0.14em;text-transform:uppercase;color:${
      on ? C.ink : C.faint
    };">${title}</p>
                      <p class="c-faint" style="margin:0;font-family:${MONO};font-size:10px;line-height:1.3;letter-spacing:0.06em;color:${C.faint};">${sub}</p>
                    </td>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;">
                  <tr>
                    ${bar(true)}${gap}${bar(false)}${gap}${bar(false)}
                  </tr>
                  <tr>
                    ${step("Sent", escapeHtml(sentAt), true)}
                    <td width="6" style="width:6px;">&nbsp;</td>
                    ${step("In review", "Soon", false)}
                    <td width="6" style="width:6px;">&nbsp;</td>
                    ${step("Reply", "1&ndash;2 days", false)}
                  </tr>
                </table>`;
}

export function visitorAutoReplyEmail(
  payload: ContactPayload,
  receivedAt = new Date()
): RenderedEmail {
  const name = clean(payload.name);
  const first = firstName(name);
  const message = payload.message.trim();
  const ticket = ticketId(payload, receivedAt);

  /* Echo their message back, trimmed so a long one doesn't dominate. */
  const echoed = message.length > 700 ? `${message.slice(0, 699).trimEnd()}…` : message;

  const inner = `
                ${pill("Message received")}

                <h1
                  class="c-ink h1"
                  style="margin:24px 0 14px;font-family:${SANS};font-size:38px;line-height:1.08;font-weight:600;letter-spacing:-0.035em;color:${C.ink};word-break:break-word;"
                >Got it, ${escapeHtml(first)}.</h1>
                <p class="c-muted" style="margin:0;font-family:${SANS};font-size:16px;line-height:1.7;color:${C.muted};">
                  Your message is in my inbox. I read everything that comes through this form and I&rsquo;ll reply personally, usually within a day or two.
                </p>

                ${tracker(formatTime(receivedAt))}

                ${divider(34)}

                ${label("Your message &middot; " + escapeHtml(ticket), "margin-bottom:14px;")}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td
                      class="c-soft c-bl c-quote"
                      style="background:${C.soft};border-left:2px solid ${C.ink};border-radius:4px 10px 10px 4px;padding:20px 22px 8px;font-family:${SANS};color:#55554f;"
                    >
                      ${formatMessage(echoed, 14.5, 12)}
                    </td>
                  </tr>
                </table>

                <p class="c-muted" style="margin:28px 0 0;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.muted};">
                  Need me sooner? Write to
                  <a class="c-ink" href="mailto:${OWNER_EMAIL}" style="color:${C.ink};text-decoration:underline;text-underline-offset:3px;">${OWNER_EMAIL}</a>.
                </p>

                ${divider(30)}

                <p class="c-muted" style="margin:0 0 2px;font-family:${SANS};font-size:15px;color:${C.muted};">Talk soon,</p>
                <p
                  class="c-ink"
                  style="margin:0;font-family:${SERIF};font-style:italic;font-size:32px;line-height:1.2;letter-spacing:-0.01em;color:${C.ink};"
                >${OWNER_FIRST}</p>`;

  const text = `MESSAGE RECEIVED · ${ticket}

Got it, ${first}.

Your message is in my inbox. I read everything that comes through this form and I'll reply personally, usually within a day or two.

  [x] Sent  ${formatTime(receivedAt)}
  [ ] In review
  [ ] Reply (1-2 days)

--------------------------------
YOUR MESSAGE

${echoed}
--------------------------------

Need me sooner? Write to ${OWNER_EMAIL}.

Talk soon,
${OWNER_FIRST}

${SITE_URL} · ${formatDate(receivedAt)}`;

  return {
    subject: `Got it, ${first}. I'll be in touch`,
    html: shell(inner, {
      preheader: "Your message is in. Here's what happens next.",
      ticket,
      footerLabel: `Receipt · ${ticket}`,
    }),
    text,
  };
}