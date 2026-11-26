// app/opengraph-image.tsx
import { renderOgCard } from "@/lib/og";

export const alt =
  "Aaron Nartey — Software Developer and Mechatronics Engineer in Accra, Ghana";

// Must be literals: Next reads these statically.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return renderOgCard({
    theme: "light",
    eyebrow: "Accra, Ghana",
    kicker: "Software developer & mechatronics engineer",
    title: "Aaron Nartey.",
    summary: "Building software and intelligent physical systems.",
    footerLeft: "Software · Electronics · Automation",
  });
}
