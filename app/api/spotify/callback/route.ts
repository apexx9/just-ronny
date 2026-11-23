import { getSpotifyRedirectUri } from "@/lib/spotify";

const REQUIRED_SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
];

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return value.join("=");
  }
  return null;
}

function page(content: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Spotify setup — Aaron Nartey</title>
    <style>
      :root { color-scheme: light dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: #f4efe5;
        color: #171512;
        font: 16px/1.6 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(680px, 100%);
        padding: clamp(24px, 5vw, 40px);
        border: 1px solid #17151222;
        border-radius: 18px;
        background: #fffaf0;
        box-shadow: 0 24px 64px #17151214;
      }
      .kicker {
        margin: 0 0 10px;
        color: #e8541e;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      h1 { margin: 0 0 14px; font-size: clamp(28px, 5vw, 42px); line-height: 1.05; letter-spacing: -0.035em; }
      p { margin: 0 0 16px; }
      code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      code { font-size: 0.9em; }
      pre {
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        margin: 20px 0;
        padding: 16px;
        border: 1px solid #1715121f;
        border-radius: 10px;
        background: #1715120a;
        font-size: 13px;
        line-height: 1.5;
      }
      .warning { color: #8a3c1c; font-size: 13px; }
      a { color: #b44117; }
      @media (prefers-color-scheme: dark) {
        body { background: #1b1815; color: #f4efe5; }
        main { border-color: #f4efe524; background: #211d19; box-shadow: none; }
        pre { border-color: #f4efe524; background: #f4efe50d; }
        .warning { color: #f2a65a; }
        a { color: #f2a65a; }
      }
    </style>
  </head>
  <body>
    <main>${content}</main>
  </body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
      "Set-Cookie":
        "spotify_oauth_state=; Path=/api/spotify; HttpOnly; SameSite=Lax; Max-Age=0",
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const expectedState = getCookie(request, "spotify_oauth_state");

  if (!state || !expectedState || state !== expectedState) {
    return page(
      `<p class="kicker">Spotify setup</p>
       <h1>That link expired.</h1>
       <p>The authorization state did not match. Start again from <a href="/api/spotify/login">/api/spotify/login</a>.</p>`,
      400,
    );
  }

  const authError = url.searchParams.get("error");
  if (authError) {
    return page(
      `<p class="kicker">Spotify setup</p>
       <h1>Authorization cancelled.</h1>
       <p>Spotify returned <code>${escapeHtml(authError)}</code>. Start again from <a href="/api/spotify/login">/api/spotify/login</a> when you are ready.</p>`,
      400,
    );
  }

  const code = url.searchParams.get("code");
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!code) {
    return page(
      `<p class="kicker">Spotify setup</p>
       <h1>No authorization code.</h1>
       <p>Spotify did not return a code. Start again from <a href="/api/spotify/login">/api/spotify/login</a>.</p>`,
      400,
    );
  }

  if (!clientId || !clientSecret) {
    return page(
      `<p class="kicker">Spotify setup</p>
       <h1>Credentials missing.</h1>
       <p>Add <code>SPOTIFY_CLIENT_ID</code> and <code>SPOTIFY_CLIENT_SECRET</code> to <code>.env.local</code>, then restart the app and try again.</p>`,
      500,
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: getSpotifyRedirectUri(request),
      }),
      cache: "no-store",
    });

    const data = (await response.json().catch(() => ({}))) as TokenResponse;

    if (!response.ok) {
      const detail =
        data.error_description ||
        data.error ||
        `Spotify returned ${response.status}`;
      return page(
        `<p class="kicker">Spotify setup</p>
         <h1>Could not finish setup.</h1>
         <p>${escapeHtml(detail)}</p>
         <p>Check that the redirect URI in your Spotify app matches this site exactly, then start again from <a href="/api/spotify/login">/api/spotify/login</a>.</p>`,
        502,
      );
    }

    if (!data.refresh_token) {
      return page(
        `<p class="kicker">Spotify setup</p>
         <h1>No refresh token returned.</h1>
         <p>Remove this app from <strong>Apps with access</strong> in your Spotify account settings, then start again from <a href="/api/spotify/login">/api/spotify/login</a>.</p>`,
        502,
      );
    }

    const grantedScopes = new Set(data.scope?.split(" ") ?? []);
    const missingScopes = REQUIRED_SCOPES.filter(
      (scope) => !grantedScopes.has(scope),
    );

    if (missingScopes.length) {
      return page(
        `<p class="kicker">Spotify setup</p>
         <h1>Permission missing.</h1>
         <p>The app did not grant <code>${missingScopes.join(", ")}</code>. Start again from <a href="/api/spotify/login">/api/spotify/login</a> and accept the listening permissions.</p>`,
        400,
      );
    }

    return page(
      `<p class="kicker">Spotify setup</p>
       <h1>Connected.</h1>
       <p>Add this line to <code>.env.local</code> (and to your hosting provider's environment variables), then restart or redeploy:</p>
       <pre>SPOTIFY_REFRESH_TOKEN=${escapeHtml(data.refresh_token)}</pre>
        <p class="warning">Treat this refresh token like a password. It grants read access to your Spotify listening activity. Do not commit it or share it.</p>
       <p>Once it is saved, open <a href="/">the site</a> to see the player.</p>`,
    );
  } catch (error) {
    console.error(
      "Spotify authorization exchange failed",
      error instanceof Error ? error.message : "network error",
    );
    return page(
      `<p class="kicker">Spotify setup</p>
       <h1>Network error.</h1>
       <p>Could not reach Spotify. Try again from <a href="/api/spotify/login">/api/spotify/login</a>.</p>`,
      502,
    );
  }
}
