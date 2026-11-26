import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/notion";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      type: "website",
      title: project.title,
      description: project.summary,
      images: [
        {
          url: `/projects/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [`/projects/${slug}/opengraph-image`],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main className="blog-post-page">
      <div className="editorial-column">
        <header className="blog-post-header">
          <Link className="about-link blog-back" href="/#work">
            ← Back to work
          </Link>
          <h1 className="blog-post-title">{project.title}</h1>
          {project.discipline && <p className="project-discipline">{project.discipline}</p>}
          {project.summary && <p className="blog-post-summary">{project.summary}</p>}
        </header>

        {project.image.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="blog-post-cover"
            src={project.image.src}
            alt={project.image.alt}
          />
        )}

        <article className="blog-article">
          {project.overview && (
            <section>
              <h2>Overview</h2>
              <p>{project.overview}</p>
            </section>
          )}
          {project.challenge && (
            <section>
              <h2>Challenge</h2>
              <p>{project.challenge}</p>
            </section>
          )}
          {project.approach && (
            <section>
              <h2>Approach</h2>
              <p>{project.approach}</p>
            </section>
          )}
          {!!project.features?.length && (
            <section>
              <h2>Features</h2>
              <ul className="case-list">
                {project.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </section>
          )}
          {!!project.techStack?.length && (
            <section>
              <h2>Tech</h2>
              <div className="blog-tags">
                {project.techStack.map((tech) => (
                  <span className="blog-tag" key={tech}>{tech}</span>
                ))}
              </div>
            </section>
          )}
        </article>

        <footer className="blog-post-footer">
          {project.liveUrl && (
            <a className="pill-button" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Visit project ↗
            </a>
          )}
          {project.githubUrl && (
            <a className="pill-button" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              View source ↗
            </a>
          )}
        </footer>
      </div>
    </main>
  );
}
