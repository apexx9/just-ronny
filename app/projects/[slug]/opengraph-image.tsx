import { ImageResponse } from "next/og";
import { getProjects } from "@/lib/notion";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  const title = project?.title || "Selected project";
  const discipline = project?.discipline || "Software · Mechatronics";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#171918",
          color: "#f7f7f2",
          padding: "58px 64px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, letterSpacing: "1.5px", textTransform: "uppercase", color: "#a6aaa6" }}>
          <span>Selected work</span>
          <span>Aaron Nartey</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1000 }}>
          <div style={{ fontSize: 22, color: "#bfc3bf", letterSpacing: "0.2px" }}>{discipline}</div>
          <div style={{ fontSize: title.length > 55 ? 66 : 82, lineHeight: 1.02, fontWeight: 600, letterSpacing: "-3px" }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ffffff20", paddingTop: 20, fontSize: 15, color: "#a6aaa6" }}>
          <span>Software · Embedded systems · Automation</span>
          <span>View project ↗</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
