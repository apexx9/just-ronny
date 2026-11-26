import { getBlogPosts } from "@/lib/notion";

export async function GET() {
  const posts = await getBlogPosts();
  return Response.json({ posts });
}
