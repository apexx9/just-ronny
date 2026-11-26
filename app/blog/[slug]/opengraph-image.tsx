import { ImageResponse } from "next/og";
import { getBlogPostBySlug } from "@/lib/notion";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogPostOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const title = post?.title || "Aaron Nartey";
  const tags = post?.tags.slice(0, 3).join("  ·  ") || "Software · Mechatronics";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f4ef",
          color: "#202020",
          padding: "58px 64px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, letterSpacing: "1.5px", textTransform: "uppercase", color: "#737773" }}>
          <span>Field notes</span>
          <span>Aaron Nartey</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 980 }}>
          <div style={{ fontSize: 22, color: "#737773", letterSpacing: "0.2px" }}>{tags}</div>
          <div style={{ fontSize: title.length > 55 ? 66 : 82, lineHeight: 1.02, fontWeight: 600, letterSpacing: "-3px" }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #20202020", paddingTop: 20, fontSize: 15, color: "#737773" }}>
          <span>Software · Electronics · Automation</span>
          <span>Read article ↗</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
