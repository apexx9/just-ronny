import RemakePortfolio from "@/components/remake-portfolio";
import { getSitePostSummaries } from "@/lib/site-posts";

export default async function HomePage() {
  const recentPosts = await getSitePostSummaries();
  return <RemakePortfolio recentPosts={recentPosts} />;
}
