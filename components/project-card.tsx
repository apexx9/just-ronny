"use client";

import type { Project } from "@/lib/content";
import ProjectImage from "./project-image";

interface Props {
  project: Project;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onClick: () => void;
}

function displayUrl(project: Project): string {
  const raw = project.liveUrl || (project.href === "#" ? "" : project.href);
  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function ProjectCard({
  project,
  index,
  expanded,
  onToggle,
  onClick,
}: Props) {
  const hasCaseStudy = project.href !== "#";
  const url = displayUrl(project);
  const detailId = `project-detail-${project.id}`;
  const titleId = `project-title-${project.id}`;

  return (
    <article className={`project-card${expanded ? " is-open" : ""}`}>
      <button
        type="button"
        className="project-row"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailId}
      >
        <span className="project-row-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="project-row-main">
          <span className="project-title" id={titleId} data-project-title="true">
            {project.title}
          </span>
          <span className="project-row-sub">
            {project.discipline} <span aria-hidden="true">·</span> {project.period}
          </span>
        </span>
        <span className="project-row-action" aria-hidden="true">
          {expanded ? "Close" : "Details"}
          <span className="project-row-symbol">{expanded ? "−" : "+"}</span>
        </span>
      </button>

      <div
        className="project-detail"
        id={detailId}
        hidden={!expanded}
        aria-labelledby={titleId}
      >
        <span className="project-cover">
          <ProjectImage project={project} />
        </span>
        <span className="project-card-copy">
          {project.summary ? (
            <span className="project-summary" data-project-summary="true">
              {project.summary}
            </span>
          ) : null}
          <span className="project-meta">
            <span className="project-year">{project.period}</span>
            <span className="project-discipline">{project.discipline}</span>
            {project.role ? (
              <span className="project-role">{project.role}</span>
            ) : null}
            {project.techStack?.length ? (
              <span className="project-stack">
                {project.techStack.slice(0, 3).join(" · ")}
              </span>
            ) : null}
          </span>
          {url ? <span className="project-url">{url}</span> : null}
          {!hasCaseStudy ? (
            <span className="project-soon">Case study soon</span>
          ) : null}
          {hasCaseStudy ? (
            <button type="button" className="project-open" onClick={onClick}>
              View case study <span aria-hidden="true">↗</span>
            </button>
          ) : null}
        </span>
      </div>
    </article>
  );
}
