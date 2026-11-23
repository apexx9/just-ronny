import { getBlogPosts, type BlogPost } from "@/lib/notion";
import { posts as fallbackPosts } from "@/lib/posts";
import type { PostSummary } from "@/lib/post-summary";

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function toHtml(content: string): string {
  if (content.includes("<")) return content;
  return content
    .split("\n\n")
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function toBlogPost(post: (typeof fallbackPosts)[number]): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    summary: post.summary,
    readingTime: post.readingTime,
    coverImage: null,
    content: toHtml(post.content),
  };
}

export async function getSitePosts(): Promise<BlogPost[]> {
  const notionPosts = await getBlogPosts();
  return notionPosts.length ? notionPosts : fallbackPosts.map(toBlogPost);
}

export async function getSitePostSummaries(): Promise<PostSummary[]> {
  const posts = await getSitePosts();
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    tags: post.tags,
    summary: post.summary,
    readingTime: post.readingTime,
    coverImage: post.coverImage,
  }));
}

export async function getSitePostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getSitePosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
