"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SectionHead from "./section-head";
import SectionIcon from "./section-icon";
import { site } from "@/lib/content";
import type { RecentTrack } from "@/lib/spotify";
import { setSpotifyAvailable } from "@/lib/spotify-status";

type Status = "loading" | "ready" | "empty" | "unavailable";
type ListeningMode = "playing" | "last_played";

type ListeningData = {
  track?: RecentTrack | null;
  mode?: ListeningMode;
  error?: string;
};

const EQUALIZER_BARS = Array.from({ length: 7 }, (_, index) => index);

function Equalizer() {
  return (
    <span className="listening-eq" aria-hidden="true">
      {EQUALIZER_BARS.map((bar) => (
        <span
          key={bar}
          style={{
            animationDelay: `${bar * -0.11}s`,
            animationDuration: `${0.7 + (bar % 5) * 0.09}s`,
          }}
        />
      ))}
    </span>
  );
}

function playedLabel(track: RecentTrack, mode: ListeningMode): string {
  if (mode === "playing") return "Playing now";

  const elapsed = Date.now() - new Date(track.playedAt).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 0) return "Last played";

  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "Last played just now";
  if (minutes < 60) return `Last played ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Last played ${hours}h ago`;

  return `Last played ${new Date(track.playedAt).toLocaleDateString("en-CA", {
    month: "short",
    day: "2-digit",
  })}`;
}

export default function ListeningSection() {
  const [track, setTrack] = useState<RecentTrack | null>(null);
  const [mode, setMode] = useState<ListeningMode>("last_played");
  const [status, setStatus] = useState<Status>("loading");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch("/api/spotify/recent", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Spotify request failed: ${response.status}`);
        }

        const data = (await response.json()) as ListeningData;
        if (cancelled) return;

        setTrack(data.track ?? null);
        setMode(data.mode ?? "last_played");
        setStatus(data.track ? "ready" : "empty");
      } catch (error) {
        if (
          cancelled ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
        setStatus((previous) =>
          previous === "ready" ? "ready" : "unavailable",
        );
      }
    };

    void load();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 60_000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setSpotifyAvailable(status === "ready" && Boolean(track));
  }, [status, track]);

  if (status !== "ready" || !track) {
    return (
      <section
        data-analytics-section="listening"
        id="listening"
        className="listening-section is-setup"
        aria-labelledby="listening-heading"
      >
        <div className="listening-head">
          <SectionHead
            title="Listening"
            id="listening-heading"
            icon={<SectionIcon name="music" />}
          />
          <span className="listening-live">Setup</span>
        </div>

        <div className="listening-card">
          <div className="listening-track">
            <span className="listening-art-fallback" aria-hidden="true">
              <SectionIcon name="music" />
            </span>
            <div className="listening-copy">
              <span className="listening-eyebrow">Spotify</span>
              <span className="listening-title">Not connected yet</span>
              <span className="listening-meta">
                Connect once to show my current or last played track.
              </span>
            </div>
          </div>

          <a className="listening-setup-link" href="/api/spotify/login">
            Connect Spotify <span aria-hidden="true">↗</span>
          </a>
        </div>

        <p className="listening-caption">
          Needs Spotify keys in <code>.env.local</code>, then a one-time login.
        </p>
      </section>
    );
  }

  const isPlaying = mode === "playing";
  const progress =
    isPlaying && track.durationMs
      ? Math.min(100, Math.max(0, ((track.progressMs ?? 0) / track.durationMs) * 100))
      : 0;

  return (
    <section
      data-analytics-section="listening"
      id="listening"
      className="listening-section"
      aria-labelledby="listening-heading"
    >
      <div className="listening-head">
        <SectionHead
          title="Listening"
          id="listening-heading"
          icon={<SectionIcon name="music" />}
        />
        <span className={`listening-live${isPlaying ? " is-live" : ""}`}>
          {isPlaying ? <Equalizer /> : null}
          {isPlaying ? "Live" : site.spotify.label}
        </span>
      </div>

      <div className="listening-card">
        <div className="listening-track">
          {track.image ? (
            <Image
              className="listening-art"
              src={track.image}
              alt=""
              width={56}
              height={56}
              sizes="56px"
            />
          ) : (
            <span className="listening-art-fallback" aria-hidden="true">
              <SectionIcon name="music" />
            </span>
          )}

          <div className="listening-copy">
            <span className="listening-eyebrow">
              {isPlaying ? "Now playing" : "Last played"}
            </span>
            <span className="listening-title">{track.title}</span>
            <span className="listening-meta">{track.artist}</span>
          </div>

          <a
            className="listening-open"
            href={track.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${track.title} by ${track.artist} in Spotify`}
          >
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {isPlaying && track.durationMs ? (
          <div
            className="listening-progress"
            role="progressbar"
            aria-label="Track progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        ) : null}

        <div className="listening-player">
          <iframe
            key={`${track.id}-${expanded ? "wide" : "compact"}`}
            title={`Spotify player — ${track.title} by ${track.artist}`}
            src={track.embed}
            width="100%"
            height={expanded ? 152 : 80}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>

        <button
          type="button"
          className="listening-toggle"
          onClick={() => setExpanded((previous) => !previous)}
          aria-expanded={expanded}
        >
          {expanded ? "Compact player" : "Expand player"}
        </button>
      </div>

      <p className="listening-caption" aria-live="polite">
        {playedLabel(track, mode)} · {track.album}
      </p>
    </section>
  );
}
