export type PostTag = "engineering" | "product" | "design" | "thoughts";

export type Post = {
  slug: string;
  title: string;
  date: string;
  tags: PostTag[];
  summary: string;
  readingTime: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "building-the-editorial-portfolio",
    title: "Building an editorial, type-first portfolio",
    date: "2026-09-20",
    tags: ["engineering", "design"],
    readingTime: "4 min read",
    summary:
      "Notes on moving away from heavy animation and towards a quieter, more readable structure with semantic tokens and a simple drawer.",
    content:
      "Portfolios often chase motion at the expense of clarity. The editorial approach favours rhythm, type, whitespace, and deliberate pacing. The drawer lets the work breathe, the signature writes when scrolled in, and tokens make light/dark feel consistent across components.",
  },
  {
    slug: "the-pen-in-clip-path",
    title: "The pen in clip-path",
    date: "2026-08-15",
    tags: ["engineering"],
    readingTime: "3 min read",
    summary:
      "A small note on making a handwriting reveal actually feel like ink — why easing, curve and intersection timing matter.",
    content:
      "Animating clip-path with a smooth in-out cubic-bezier (slowing slightly in the middle, easing out) creates the illusion of a pen pulling across a stroke. Intersection timing keeps it subtle — revealing when the reader arrives, not before.",
  },
  {
    slug: "on-reduced-motion",
    title: "On reducing motion",
    date: "2026-07-05",
    tags: ["thoughts", "product"],
    readingTime: "2 min read",
    summary:
      "Why defaults should respect system preference without stripping personality.",
    content:
      "Respecting prefers-reduced-motion doesn't mean removing all motion. It means removing unnecessary motion. Transitions stay short, reveals become instant, and the focus stays on content.",
  },
];
