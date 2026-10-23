"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/lib/content";
import ProjectImage from "./project-image";

interface Props {
  project: Project | null;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProjectDialog({ project, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.dataset.projectOpen = "true";

    // Move focus into the dialog so keyboard users aren't left behind it.
    dialog?.querySelector<HTMLElement>(".project-close")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      delete document.body.dataset.projectOpen;
      window.removeEventListener("keydown", onKey);
      window.dispatchEvent(new Event("portfolio:project-closed"));
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  if (!project || typeof document === "undefined") return null;

  const hasRichStory = Boolean(
    project.description ||
      project.overview ||
      project.challenge ||
      project.approach ||
      project.features?.length ||
      project.techStack?.length
  );

  return createPortal(
    <div className="project-dialog" role="dialog" aria-modal="true" ref={dialogRef}>
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
                <ProjectImage key={project.id} project={project} loading="eager" />
              </div>

              <header className="project-heading">
                <h2 data-project-title>{project.title}</h2>
                {project.discipline && (
                  <span className="project-discipline" data-project-type>
                    {project.discipline}
                  </span>
                )}
              </header>

              {project.summary &&
                project.summary !==
                  (project.overview || project.description) && (
                  <p className="project-lead" data-project-summary>
                    {project.summary}
                  </p>
                )}

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
                {hasRichStory ? (
                  <>
                    {project.overview && (
                      <section>
                        <h3>Overview</h3>
                        <p>{project.overview}</p>
                      </section>
                    )}
                    {!project.overview && project.description && (
                      <section>
                        <h3>Overview</h3>
                        <p>{project.description}</p>
                      </section>
                    )}
                    {project.challenge && (
                      <section>
                        <h3>Challenge</h3>
                        <p>{project.challenge}</p>
                      </section>
                    )}
                    {project.approach && (
                      <section>
                        <h3>Approach</h3>
                        <p>{project.approach}</p>
                      </section>
                    )}
                    {!!project.features?.length && (
                      <section>
                        <h3>Features</h3>
                        <ul className="case-list">
                          {project.features.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                    {!!project.techStack?.length && (
                      <section>
                        <h3>Tech</h3>
                        <div className="blog-tags">
                          {project.techStack.map((t) => (
                            <span key={t} className="blog-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  <section>
                    <h3>Case study</h3>
                    <p>
                      More details about {project.name} are coming soon.
                    </p>
                  </section>
                )}
              </div>

              {project.liveUrl && (
                <a
                  className="pill-button"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit public website ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  className="pill-button"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source ↗
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
