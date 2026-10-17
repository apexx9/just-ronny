"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDialog({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.dataset.projectOpen = "true";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      delete document.body.dataset.projectOpen;
      window.removeEventListener("keydown", onKey);
      window.dispatchEvent(new Event("portfolio:project-closed"));
    };
  }, [project, onClose]);

  if (!project || typeof document === "undefined") return null;

  return createPortal(
    <div className="project-dialog" role="dialog" aria-modal="true">
      <div className="project-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="project-sheet-position">
        <div className="project-sheet">
          <div className="project-controls">
            <button
              className="project-sheet-handle"
              aria-label="Close project"
              onClick={onClose}
            />
            <button
              className="project-close"
              aria-label="Close project"
              onClick={onClose}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <article className="project-scroll">
            <div className="project-details">
              <div className="project-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image.src}
                  width={project.image.width}
                  height={project.image.height}
                  alt={project.image.alt}
                />
              </div>

              <header className="project-heading">
                <h2 data-project-title>{project.title}</h2>
                <span className="project-discipline" data-project-type>
                  {project.discipline}
                </span>
              </header>

              <p className="project-lead" data-project-summary>
                {project.summary}
              </p>

              <dl className="project-facts">
                <div>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>Period</dt>
                  <dd>{project.period}</dd>
                </div>
                {project.company && (
                  <div>
                    <dt>Company</dt>
                    <dd>
                      <a
                        className="case-source-link"
                        href={project.company.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.company.label}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="case-story">
                <section>
                  <h3>Overview</h3>
                  <p>
                    This is a placeholder case study. Replace this copy with the
                    real story of {project.name} — the layout, hierarchy and
                    typography adapt to whatever you write here.
                  </p>
                </section>
                <section>
                  <h3>Decisions</h3>
                  <div className="case-decisions">
                    {[1, 2, 3].map((n) => (
                      <div className="case-decision" key={n}>
                        <span className="decision-number" aria-hidden="true">
                          0{n}
                        </span>
                        <div>
                          <h4>Decision {n}</h4>
                          <p>
                            Description of the decision that shaped the work.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {project.href && project.href !== "#" && (
                <a
                  className="pill-button"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit public website ↗
                </a>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>,
    document.body
  );
}
