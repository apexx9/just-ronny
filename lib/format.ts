// lib/format.ts

/**
 * Formats a post date. Pinned to UTC so server and client always agree
 * (a date-only string like "2026-11-26" otherwise shifts a day in some zones
 * and causes hydration warnings).
 */
export function formatDate(
  date: string | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  },
): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-CA", { ...options, timeZone: "UTC" });
}

export function toIso(date: string | undefined | null): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
