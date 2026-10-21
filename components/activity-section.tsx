"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import type { Contributions } from "@/lib/contributions";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function level(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function dayTitle(count: number, iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const label = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  if (count === 0) return `No contributions on ${label}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${label}`;
}

function buildWeeks(days: Contributions["days"]) {
  if (days.length === 0) return [] as (Contributions["days"][number] | null)[][];
  const pad = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (Contributions["days"][number] | null)[] = [
    ...Array.from({ length: pad }, () => null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Contributions["days"][number] | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function monthSlots(weeks: ReturnType<typeof buildWeeks>) {
  const slots: (string | null)[] = weeks.map(() => null);
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      slots[i] = MONTH_LABELS[month];
      lastMonth = month;
    }
  });
  return slots;
}

export default function ActivitySection() {
  const [state, setState] = useState<"loading" | "ready" | "unavailable">(
    "loading"
  );
  const [data, setData] = useState<Contributions | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contributions")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((json: Contributions) => {
        if (cancelled || !json?.days?.length) throw new Error();
        setData(json);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = state === "ready" && data ? buildWeeks(data.days) : [];
  const months = monthSlots(weeks);

  return (
    <section
      data-analytics-section="activity"
      id="activity"
      className="activity-section"
      aria-labelledby="activity-heading"
    >
      <div className="activity-head">
        <h2 className="section-label" id="activity-heading">
          Activity
        </h2>
        {state === "ready" && data && (
          <p className="activity-summary">
            <span className="activity-total">
              {data.total.toLocaleString("en-US")}
            </span>{" "}
            contributions in the last year ·{" "}
            <a
              className="about-link"
              href={site.github.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/{site.github.handle}
            </a>
          </p>
        )}
      </div>

      {state === "loading" && (
        <div className="activity-scroll" aria-hidden="true">
          <div className="activity-grid activity-grid-skeleton">
            {Array.from({ length: 53 }, (_, w) => (
              <span key={w} className="activity-week">
                {Array.from({ length: 7 }, (_, d) => (
                  <span key={d} className="activity-cell" />
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      {state === "ready" && data && (
        <div className="activity-scroll">
          <div className="activity-calendar">
            <div className="activity-months" aria-hidden="true">
              {months.map((label, i) => (
                <span key={i} className="activity-month-slot">
                  {label}
                </span>
              ))}
            </div>
            <div className="activity-body">
              <div className="activity-weekdays" aria-hidden="true">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div
                className="activity-grid"
                role="img"
                aria-label={`${data.total.toLocaleString("en-US")} GitHub contributions in the last year`}
              >
                {weeks.map((week, wi) => (
                  <span key={wi} className="activity-week">
                    {week.map((day, di) =>
                      day ? (
                        <span
                          key={di}
                          className={`activity-cell level-${level(day.count)}`}
                          title={dayTitle(day.count, day.date)}
                        />
                      ) : (
                        <span key={di} className="activity-cell is-empty" />
                      )
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
