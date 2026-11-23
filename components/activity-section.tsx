"use client";

import { useEffect, useState } from "react";
import SectionHead from "./section-head";
import SectionIcon from "./section-icon";
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
  const slots: { label: string; index: number }[] = [];
  let lastMonth = -1;
  let lastIndex = -99;
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      if (i - lastIndex >= 3) {
        slots.push({ label: MONTH_LABELS[month], index: i });
        lastIndex = i;
      }
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
  const firstDate = weeks.flat().find(Boolean)?.date ?? null;
  const [focusDate, setFocusDate] = useState<string | null>(null);

  /* Roving tabindex: the heatmap is one tab stop; arrows walk the days. */
  const onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const deltas: Record<string, number> = {
      ArrowRight: 7,
      ArrowLeft: -7,
      ArrowDown: 1,
      ArrowUp: -1,
    };
    const delta = deltas[e.key];
    if (!delta) return;
    const cells = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("[data-date]"),
    );
    const index = cells.indexOf(document.activeElement as HTMLElement);
    const next = cells[index + delta];
    if (!next) return;
    e.preventDefault();
    next.focus();
  };

  return (
    <section
      data-analytics-section="activity"
      id="activity"
      className="middle-section activity-section"
      aria-labelledby="activity-heading"
    >
      <SectionHead
        title="Activity"
        id="activity-heading"
        icon={<SectionIcon name="activity" />}
        lead={
          state === "ready" && data ? (
            <>
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
            </>
          ) : undefined
        }
      />

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
              {months.map(({ label, index }) => (
                <span
                  key={index}
                  className="activity-month-slot"
                  style={{ gridColumn: index + 1 }}
                >
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
                role="grid"
                aria-label={`${data.total.toLocaleString("en-US")} GitHub contributions in the last year. Use arrow keys to move between days.`}
                aria-rowcount={7}
                aria-colcount={weeks.length}
                onKeyDown={onGridKeyDown}
              >
                {weeks.map((week, wi) => (
                  <span key={wi} className="activity-week" role="row">
                    {week.map((day, di) =>
                      day ? (
                        <span
                          key={di}
                          role="gridcell"
                          data-date={day.date}
                          tabIndex={day.date === (focusDate ?? firstDate) ? 0 : -1}
                          className={`activity-cell level-${level(day.count)}`}
                          title={dayTitle(day.count, day.date)}
                          aria-label={dayTitle(day.count, day.date)}
                          onFocus={() => setFocusDate(day.date)}
                        />
                      ) : (
                        <span
                          key={di}
                          className="activity-cell is-empty"
                          role="presentation"
                        />
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
