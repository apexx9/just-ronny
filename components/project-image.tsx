import { useState } from "react";
import type { Project } from "@/lib/content";

interface Props {
  project: Project;
  loading?: "eager" | "lazy";
}

export default function ProjectImage({ project, loading = "lazy" }: Props) {
  const fallbackSrc =
    project.image.fallbackSrc ?? "/images/work/project-one.png";
  const [src, setSrc] = useState(project.image.src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={project.image.width}
      height={project.image.height}
      loading={loading}
      decoding="async"
      alt={project.image.alt}
      onError={() => {
        if (src !== fallbackSrc) setSrc(fallbackSrc);
      }}
    />
  );
}
