import { getProjects } from "@/lib/notion";

export async function GET() {
  const projects = await getProjects();
  return Response.json({ projects });
}
