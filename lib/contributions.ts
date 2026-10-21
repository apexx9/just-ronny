import { cacheLife } from "next/cache";

export interface ContributionDay {
  date: string;
  count: number;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
}

const API = `https://github-contributions-api.jogruber.de/v4/${process.env.NEXT_PUBLIC_GITHUB_HANDLE ?? "apexx9"}?y=last`;

export async function getContributions(): Promise<Contributions | null> {
  "use cache";
  cacheLife("days");
  try {
    const res = await fetch(API);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      total?: { lastYear?: number };
      contributions?: Array<{ date: string; count: number }>;
    };
    const days = (data.contributions ?? [])
      .filter((d) => typeof d?.date === "string" && typeof d?.count === "number")
      .map((d) => ({ date: d.date, count: d.count }));
    if (days.length === 0) return null;
    const total = data.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
    return { total, days };
  } catch {
    return null;
  }
}
