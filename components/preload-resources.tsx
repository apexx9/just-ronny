"use client";

import ReactDOM from "react-dom";

/**
 * Warm up the third-party origins used by the lazy-loaded Spotify player.
 * React hoists these hints into <head> on hydration, before the player
 * scrolls into view, so the iframe can connect sooner when it loads.
 */
export default function PreloadResources() {
  ReactDOM.preconnect("https://open.spotify.com");
  ReactDOM.preconnect("https://embed-cdn.spotifycdn.com");
  ReactDOM.prefetchDNS("https://image-cdn-ak.spotifycdn.com");
  ReactDOM.prefetchDNS("https://i.scdn.co");
  ReactDOM.prefetchDNS("https://p.scdn.co");

  return null;
}
