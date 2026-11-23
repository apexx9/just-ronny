import { getSpotifyRedirectUri } from "@/lib/spotify";

const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
];

export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return new Response(
      "SPOTIFY_CLIENT_ID is missing. See the Spotify setup section in README.md.",
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const state = crypto.randomUUID();
  const redirectUri = getSpotifyRedirectUri(request);
  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", SCOPES.join(" "));
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("show_dialog", "true");

  const isHttps = new URL(request.url).protocol === "https:";
  const stateCookie = [
    `spotify_oauth_state=${state}`,
    "Path=/api/spotify",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=600",
    isHttps ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      "Set-Cookie": stateCookie,
      "Cache-Control": "no-store",
    },
  });
}
