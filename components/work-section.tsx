"use client";

import { useState } from "react";
import AboutSection from "./about-section";
import ProjectCard from "./project-card";
import ProjectDialog from "./project-dialog";
import { projects, type Project } from "@/lib/content";

interface Props {
  onHover?: () => void;
}

export default function WorkSection({ onHover }: Props) {
  const [open, setOpen] = useState<Project | null>(null);

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
          {projects.map((p, i) => (
            <div key={p.id}>
              <ProjectCard
                project={p}
                onClick={() => setOpen(p)}
                onHover={onHover}
              />
              {i === 1 && <AboutSection onHover={onHover} />}
            </div>
          ))}
        </div>
      </section>

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </div>
  );
}
