// lib/data.ts
// Per-request memoisation. A single blog post page calls generateMetadata, the
// page itself and the OG image route; without this each one hits Notion again.
import { cache } from "react";
import { getBlogPostBySlug, getBlogPosts, getProjects } from "@/lib/notion";

export const getPost = cache(getBlogPostBySlug);
export const getPosts = cache(getBlogPosts);
export const getAllProjects = cache(getProjects);
