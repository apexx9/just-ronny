import IntroMount from "@/components/intro-mount";
import Portfolio from "@/components/portfolio";
import { getSitePostSummaries } from "@/lib/site-posts";

export default async function HomePage() {
  const recentPosts = await getSitePostSummaries();

  return (
    <>
      <IntroMount />
      <Portfolio recentPosts={recentPosts} />
    </>
  );
}
