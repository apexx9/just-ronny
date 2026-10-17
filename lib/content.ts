export type Project = {
  id: string;
  name: string;
  title: string;
  discipline: string;
  summary: string;
  role: string;
  period: string;
  href: string;
  image: { src: string; width: number; height: number; alt: string };
  company?: { label: string; href: string };
};

export const site = {
  name: "Aaron Nartey",
  location: "Accra, Ghana",
  timeZone: "Africa/Accra",
  role: "Software engineer & creative developer",
  contactHref: "mailto:aaronnartey001@gmail.com",
  heroTagline: "I build thoughtful digital products and software.",
  availability: "Open to new work",
  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/" },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/",
    },
    { id: "x", label: "X", href: "https://x.com/" },
  ],
  services: [
    "Product engineering",
    "Web development",
    "Interface design",
    "Backend & APIs",
  ],
  about: {
    intro: "Hi, I'm",
    description: "a software engineer and creative developer",
    experience:
      "I design and build digital products end to end — from the first interface sketch to the systems and APIs behind it. I care about clarity, speed and the small details that make software feel considered.",
  },
};

export const projects: Project[] = [
  {
    id: "project-one",
    name: "Project One",
    title: "Project One",
    discipline: "Product engineering · design and build",
    summary:
      "A placeholder for your first case study — replace the copy and cover art when it's ready.",
    role: "Design & development",
    period: "2026",
    href: "#",
    image: {
      src: "/images/work/project-one.png",
      width: 1440,
      height: 1000,
      alt: "Project One cover",
    },
  },
  {
    id: "project-two",
    name: "Project Two",
    title: "Project Two",
    discipline: "Web application · interface design",
    summary:
      "A second placeholder slot. The layout adapts to whatever you put here.",
    role: "Product design · self-initiated",
    period: "2026",
    href: "#",
    image: {
      src: "/images/work/project-two.png",
      width: 1440,
      height: 1000,
      alt: "Project Two cover",
    },
  },
  {
    id: "project-three",
    name: "Project Three",
    title: "Project Three",
    discipline: "Backend & APIs · systems",
    summary: "A third placeholder slot for a project you're proud of.",
    role: "Engineering",
    period: "2025",
    href: "#",
    image: {
      src: "/images/work/project-three.png",
      width: 1440,
      height: 900,
      alt: "Project Three cover",
    },
  },
  {
    id: "project-four",
    name: "Project Four",
    title: "Project Four",
    discipline: "Creative development · experiment",
    summary: "A fourth placeholder slot, ready when you are.",
    role: "Design & development",
    period: "2025",
    href: "#",
    image: {
      src: "/images/work/project-four.png",
      width: 1440,
      height: 900,
      alt: "Project Four cover",
    },
  },
];
