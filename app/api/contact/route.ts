import { ownerNotificationEmail, visitorAutoReplyEmail } from "@/lib/email";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/* Reuse an in-memory cooldown per IP so a single visitor can't hammer the
   inbox. Reset on cold start — good enough for a portfolio contact form. */
const lastSent = new Map<string, number>();
const COOLDOWN_MS = 30_000;

/* Very small guard: reject obvious bots that fill a hidden field, and let
   humans through. No CAPTCHA, no friction. */
function isHoneypotTripped(body: Record<string, unknown>): boolean {
  return Boolean(body.company || body.website || body.url);
}

async function sendBrevo(message: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo?: { email: string; name?: string };
}): Promise<{ ok: boolean; status: number; detail?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, status: 500, detail: "BREVO_API_KEY missing" };

  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME || "Aaron";
  if (!fromEmail) return { ok: false, status: 500, detail: "BREVO_FROM_EMAIL missing" };

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: message.to,
        ...(message.replyTo ? { replyTo: message.replyTo } : {}),
        subject: message.subject,
        htmlContent: message.htmlContent,
        textContent: message.textContent,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        detail: data?.message || `Brevo ${res.status}`,
      };
    }
    return { ok: true, status: res.status };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      detail: error instanceof Error ? error.message : "network error",
    };
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return Response.json(
      { ok: false, error: "Please fill in name, email and message." },
      { status: 400 }
    );
  }
  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return Response.json(
      { ok: false, error: "One of the fields is too long." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  /* Pretend success for bots so they don't learn anything. */
  if (isHoneypotTripped(body)) {
    return Response.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const previous = lastSent.get(ip);
  if (previous && now - previous < COOLDOWN_MS) {
    return Response.json(
      { ok: false, error: "You just sent a message — give it a moment." },
      { status: 429 }
    );
  }

  const toEmail = process.env.BREVO_TO_EMAIL;
  if (!toEmail) {
    return Response.json(
      { ok: false, error: "Server misconfiguration." },
      { status: 500 }
    );
  }

  const payload = { name, email, message };
  const notification = ownerNotificationEmail(payload);
  const autoReply = visitorAutoReplyEmail(payload);

  const [notifyResult, replyResult] = await Promise.all([
    sendBrevo({
      to: [{ email: toEmail, name: "Aaron Nartey" }],
      subject: notification.subject,
      htmlContent: notification.html,
      textContent: notification.text,
      replyTo: { email, name },
    }),
    sendBrevo({
      to: [{ email, name }],
      subject: autoReply.subject,
      htmlContent: autoReply.html,
      textContent: autoReply.text,
    }),
  ]);

  /* Only record the cooldown once the owner notification actually went out —
     a visitor should be able to retry if the first attempt failed. */
  if (notifyResult.ok) lastSent.set(ip, now);

  if (!notifyResult.ok) {
    console.error("Contact: owner notification failed", notifyResult.detail);
    return Response.json(
      { ok: false, error: "Couldn't send your message. Please email me directly." },
      { status: 502 }
    );
  }

  if (!replyResult.ok) {
    /* Non-fatal: the message reached the inbox, so report success. */
    console.error("Contact: auto-reply failed", replyResult.detail);
  }

  return Response.json({ ok: true });
}
