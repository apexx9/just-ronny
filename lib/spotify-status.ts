"use client";

import { useSyncExternalStore } from "react";

/* A tiny external store: the Listening card reports whether its last call
   actually returned a track, and the nav subscribes so a broken or
   unconfigured Spotify integration disappears from both places. */
let available = false;
const listeners = new Set<() => void>();

export function setSpotifyAvailable(next: boolean) {
  if (available === next) return;
  available = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSpotifyAvailable() {
  return useSyncExternalStore(
    subscribe,
    () => available,
    () => false,
  );
}
