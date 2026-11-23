const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=50";
const CURRENTLY_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

type SpotifyTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
};

type SpotifyArtist = {
  name?: string;
};

type SpotifyImage = {
  url?: string;
  width?: number | null;
  height?: number | null;
};

type SpotifyAlbum = {
  name?: string;
  images?: SpotifyImage[];
};

type SpotifyTrackObject = {
  id?: string | null;
  name?: string;
  type?: string;
  duration_ms?: number;
  artists?: SpotifyArtist[];
  album?: SpotifyAlbum;
  external_urls?: { spotify?: string };
};

type SpotifyPlayHistory = {
  track?: SpotifyTrackObject | null;
  played_at?: string;
};

type SpotifyRecentlyPlayedResponse = {
  items?: SpotifyPlayHistory[];
};

type SpotifyCurrentlyPlayingResponse = {
  item?: SpotifyTrackObject | null;
  is_playing?: boolean;
  progress_ms?: number;
  currently_playing_type?: string;
};

export type ListeningMode = "playing" | "last_played";

export type RecentTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  href: string;
  embed: string;
  playedAt: string;
  mode?: ListeningMode;
  isPlaying?: boolean;
  progressMs?: number;
  durationMs?: number;
};

export type ListeningResult = {
  configured: boolean;
  track: RecentTrack | null;
  mode: ListeningMode;
  error: boolean;
};

export type RecentlyPlayedResult = Omit<ListeningResult, "mode">;

let tokenCache: { value: string; expiresAt: number } | null = null;

export function getSpotifyRedirectUri(request: Request): string {
  return (
    process.env.SPOTIFY_REDIRECT_URI ||
    new URL("/api/spotify/callback", request.url).toString()
  );
}

function getCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(forceRefresh = false): Promise<string | null> {
  if (!forceRefresh && tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.value;
  }

  const credentials = getCredentials();
  if (!credentials) return null;

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${credentials.clientId}:${credentials.clientSecret}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: credentials.refreshToken,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      tokenCache = null;
      console.error("Spotify token refresh failed", response.status);
      return null;
    }

    const data = (await response.json()) as SpotifyTokenResponse;
    if (!data.access_token || !data.expires_in) {
      tokenCache = null;
      console.error("Spotify token response was incomplete");
      return null;
    }

    tokenCache = {
      value: data.access_token,
      expiresAt: Date.now() + Math.max(30, data.expires_in - 60) * 1000,
    };
    return tokenCache.value;
  } catch (error) {
    tokenCache = null;
    console.error(
      "Spotify token request failed",
      error instanceof Error ? error.message : "network error",
    );
    return null;
  }
}

async function fetchSpotify(
  url: string,
  accessToken: string,
): Promise<Response> {
  return fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
}

async function getSpotifyResponse(url: string) {
  let accessToken = await getAccessToken();
  if (!accessToken) return null;

  let response = await fetchSpotify(url, accessToken);
  if (response.status === 401) {
    accessToken = await getAccessToken(true);
    if (!accessToken) return null;
    response = await fetchSpotify(url, accessToken);
  }

  return response;
}

function toRecentTrack(
  entry: SpotifyPlayHistory,
  state: {
    mode: ListeningMode;
    isPlaying: boolean;
    progressMs: number;
    durationMs: number;
  },
): RecentTrack | null {
  const track = entry.track;
  if (!track?.id || !track.name) return null;

  const artist =
    track.artists
      ?.map((item) => item.name)
      .filter(Boolean)
      .join(", ") || "Unknown artist";
  const album = track.album?.name || "Single";
  const image =
    track.album?.images?.find((item) => (item.width ?? 0) >= 300)?.url ||
    track.album?.images?.[0]?.url ||
    null;
  const href =
    track.external_urls?.spotify ||
    `https://open.spotify.com/track/${encodeURIComponent(track.id)}`;

  return {
    id: track.id,
    title: track.name,
    artist,
    album,
    image,
    href,
    embed: `https://open.spotify.com/embed/track/${encodeURIComponent(
      track.id,
    )}?utm_source=generator`,
    playedAt: entry.played_at || new Date().toISOString(),
    mode: state.mode,
    isPlaying: state.isPlaying,
    progressMs: state.progressMs,
    durationMs: state.durationMs,
  };
}

export async function getListening(): Promise<ListeningResult> {
  if (!getCredentials()) {
    return {
      configured: false,
      track: null,
      mode: "last_played",
      error: false,
    };
  }

  try {
    const currentResponse = await getSpotifyResponse(CURRENTLY_PLAYING_ENDPOINT);

    if (currentResponse?.ok && currentResponse.status !== 204) {
      const data =
        (await currentResponse.json()) as SpotifyCurrentlyPlayingResponse;
      const isTrack =
        data.currently_playing_type === "track" ||
        (data.item?.type === "track" && Boolean(data.item));

      if (data.item && isTrack && data.is_playing) {
        const track = toRecentTrack(
          { track: data.item, played_at: new Date().toISOString() },
          {
            mode: "playing",
            isPlaying: true,
            progressMs: data.progress_ms ?? 0,
            durationMs: data.item.duration_ms ?? 0,
          },
        );

        if (track) {
          return { configured: true, track, mode: "playing", error: false };
        }
      }
    }

    const recentResponse = await getSpotifyResponse(RECENTLY_PLAYED_ENDPOINT);
    if (!recentResponse?.ok) {
      console.error(
        "Spotify listening request failed",
        recentResponse?.status ?? "no token",
      );
      return {
        configured: true,
        track: null,
        mode: "last_played",
        error: true,
      };
    }

    const data = (await recentResponse.json()) as SpotifyRecentlyPlayedResponse;
    const entry = (data.items || []).find(
      (item) => item.track?.type === "track" && item.track.id,
    );
    const track = entry
      ? toRecentTrack(entry, {
          mode: "last_played",
          isPlaying: false,
          progressMs: 0,
          durationMs: entry.track?.duration_ms ?? 0,
        })
      : null;

    return { configured: true, track, mode: "last_played", error: false };
  } catch (error) {
    console.error(
      "Spotify listening request failed",
      error instanceof Error ? error.message : "network error",
    );
    return {
      configured: true,
      track: null,
      mode: "last_played",
      error: true,
    };
  }
}

export async function getRecentlyPlayed(): Promise<RecentlyPlayedResult> {
  const result = await getListening();
  return {
    configured: result.configured,
    track: result.track,
    error: result.error,
  };
}
