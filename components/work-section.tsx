"use client";

import { useEffect, useState } from "react";
import ProjectCard from "./project-card";
import ProjectDialog from "./project-dialog";
import SectionHead from "./section-head";
import SectionIcon from "./section-icon";
import { projects as fallbackProjects, type Project } from "@/lib/content";

export default function WorkSection() {
  const [open, setOpen] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [expandedId, setExpandedId] = useState<string | null>(
    fallbackProjects[0]?.id ?? null,
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then((data: { projects?: Project[] }) => {
        if (!cancelled && Array.isArray(data.projects) && data.projects.length) {
          /* Notion is the source of truth for the case study, but sparse rows
             can leave role/year blank. Merge those display fields from the
             local fallback so cards never show an empty label. */
          const merged = data.projects.map((project, index) => {
            const local =
              fallbackProjects.find(
                (item) =>
                  item.name.toLowerCase() === project.name.toLowerCase(),
              ) ?? fallbackProjects[index];
            return {
              ...local,
              ...project,
              role: project.role || local?.role || "",
              period: project.period || local?.period || "",
              discipline: project.discipline || local?.discipline || "",
              summary: project.summary || local?.summary || "",
              href: project.href && project.href !== "#" ? project.href : local?.href || "#",
              techStack:
                (project.techStack?.length ?? 0) > 0
                  ? project.techStack
                  : local?.techStack,
            };
          });
          setProjects(merged);
          setExpandedId((current) =>
            current && merged.some((project) => project.id === current)
              ? current
              : (merged[0]?.id ?? null),
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section
        id="work"
        className="middle-section work-section"
        aria-labelledby="work-heading"
      >
        <SectionHead
          title="Featured"
          id="work-heading"
          icon={<SectionIcon name="book" />}
          lead={`${projects.length} selected project${projects.length === 1 ? "" : "s"}`}
        />
        <div className="project-list">
          {projects.map((p, index) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={index}
              expanded={expandedId === p.id}
              onToggle={() =>
                setExpandedId((current) => (current === p.id ? null : p.id))
              }
              onClick={() => setOpen(p)}
            />
          ))}
        </div>
      </section>

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </>
  );
}
