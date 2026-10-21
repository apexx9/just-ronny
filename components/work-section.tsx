"use client";

import { useEffect, useState } from "react";
import AboutSection from "./about-section";
import ActivitySection from "./activity-section";
import ProjectCard from "./project-card";
import ProjectDialog from "./project-dialog";
import { projects as fallbackProjects, type Project } from "@/lib/content";

export default function WorkSection() {
  const [open, setOpen] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then((data: { projects?: Project[] }) => {
        if (!cancelled && Array.isArray(data.projects) && data.projects.length) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="editorial-column">
      <section
        id="work"
        className="work-section"
        aria-labelledby="work-heading"
      >
        <h2 className="section-label" id="work-heading">
          Selected works
        </h2>
        <div className="project-list">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => setOpen(p)} />
          ))}
        </div>
      </section>

      <AboutSection />
      <ActivitySection />

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </div>
  );
}
