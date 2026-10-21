import { getContributions } from "@/lib/contributions";

export async function GET() {
  const data = await getContributions();
  if (!data) {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
  return Response.json(data);
}
