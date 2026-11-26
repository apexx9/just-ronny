// app/sitemap.ts → served at /sitemap.xml. Submit this URL in Google Search Console.
import type { MetadataRoute } from "next";
import { getAllProjects, getPosts } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

function safeDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];

  // A Notion hiccup must never take the whole sitemap down.
  try {
    posts = await getPosts();
  } catch (error) {
    console.error("sitemap: could not load posts", error);
  }
  try {
    projects = await getAllProjects();
  } catch (error) {
    console.error("sitemap: could not load projects", error);
  }

  const postDates = posts
    .map((p) => safeDate(p.date))
    .filter((d): d is Date => Boolean(d));
  const latestPost = postDates.length
    ? new Date(Math.max(...postDates.map((d) => d.getTime())))
    : undefined;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestPost ?? new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: safeDate(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
