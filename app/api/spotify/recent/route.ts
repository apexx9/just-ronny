import { connection } from "next/server";
import { getListening, type ListeningMode, type RecentTrack } from "@/lib/spotify";

let cache: {
  track: RecentTrack | null;
  mode: ListeningMode;
  expiresAt: number;
} | null = null;

function json(body: unknown, status = 200, cacheable = true) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": cacheable
        ? "public, s-maxage=60, stale-while-revalidate=120"
        : "no-store",
    },
  });
}

export async function GET() {
  await connection();

  if (cache && cache.expiresAt > Date.now()) {
    return json({ track: cache.track, mode: cache.mode });
  }

  const result = await getListening();

  if (!result.configured) {
    return json({ track: null, mode: result.mode, error: "not_configured" }, 200, false);
  }

  if (result.error) {
    return json({ track: null, mode: result.mode, error: "unavailable" }, 200, false);
  }

  cache = {
    track: result.track,
    mode: result.mode,
    expiresAt: Date.now() + 60_000,
  };

  return json({ track: result.track, mode: result.mode });
}
