"use client";

import type { Project } from "@/lib/content";

interface Props {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: Props) {
  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (
      e.pointerType !== "mouse" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = -(e.clientY - r.top - r.height / 2) / r.height * 4;
    const y = (e.clientX - r.left - r.width / 2) / r.width * 4;
    e.currentTarget.style.setProperty("--tilt-x", `${x}deg`);
    e.currentTarget.style.setProperty("--tilt-y", `${y}deg`);
  };

  const reset = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--tilt-x", "0deg");
    e.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <button
      className="project-card"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      aria-label={`View ${project.name} project`}
      aria-haspopup="dialog"
    >
      <div className="project-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image.src}
          width={project.image.width}
          height={project.image.height}
          loading="lazy"
          alt={project.image.alt}
        />
      </div>
      <span className="project-title">
        <span data-project-title="true">{project.title}</span>
        <span className="project-discipline" data-project-type="true">
          — {project.discipline}
        </span>
      </span>
      <span className="project-summary" data-project-summary="true">
        {project.summary}
      </span>
    </button>
  );
}
