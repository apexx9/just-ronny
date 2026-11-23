export type Project = {
  id: string;
  name: string;
  title: string;
  discipline: string;
  summary: string;
  role: string;
  period: string;
  href: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    fallbackSrc?: string;
  };
  company?: { label: string; href: string };
  // Rich case-study fields — populated from Notion, optional for local data.
  description?: string;
  overview?: string;
  challenge?: string;
  approach?: string;
  features?: string[];
  techStack?: string[];
  liveUrl?: string;
  githubUrl?: string;
};

export const site = {
  name: "Aaron Nartey",
  location: "Accra, Ghana",
  timeZone: "Africa/Accra",
  role: "Mechatronics engineer",
  contactHref: "mailto:aaronnartey001@gmail.com",
  heroTagline:
    "I build systems where software, electronics and motion meet — from control loops and sensor integration to the interfaces that make them usable.",
  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/apexx9" },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/__aaro.nn",
    },
    /* Discord, LinkedIn and X are intentionally absent until Aaron supplies
       real profile URLs. Never ship a link to a generic social homepage. */
  ],

instagram: {
  handle: "@__aaro.nn",
  name: "Aaron 🖤",            // optional
  bio: "{gh}{gb} 黑色†",
  href: "https://instagram.com/__aaro.nn",
  avatar: null,
  followers: 1074,             // a number becomes "12.4K"; a string is shown as written
  following: 310,               // optional
  posts: 86,                    // optional
},
  github: {
    handle: "apexx9",
    href: "https://github.com/apexx9",
  },
  spotify: {
    label: "Recently played",
    eyebrow: "Straight from Spotify",
    note: "The last song that came through my headphones, pulled directly from my Spotify listening history.",
  },
  mechatronics: {
    description:
      "Two joints, one target, and a control loop that keeps reaching. A small study in the space where software meets the physical world.",
  },
  services: [
    "Mechatronics engineering",
    "Embedded systems",
    "CAD & prototyping",
    "Control systems",
    "Product engineering",
  ],
  about: {
    intro: "Hi, I'm",
    description: "a mechatronics engineer",
    experience:
      "I work where software, electronics and motion meet — designing mechanisms, integrating sensors and actuators, and writing the control loops that make them move. I take ideas from sketches and CAD to working prototypes, then build the interfaces and APIs that make the hardware legible to the people using it. I care about precise motion, clear feedback and the small details that make a machine feel considered.",
  },
};

export const projects: Project[] = [
  {
    id: "visual-socket",
    name: "Visual Socket",
    title: "Visual Socket",
    discipline: "Product / interface",
    summary: "A product surface for visual work.",
    role: "Design & development",
    period: "2026",
    href: "#",
    image: {
      src: "/images/work/visual-socket.png",
      width: 1600,
      height: 1000,
      alt: "Visual Socket cover",
    },
  },
  {
    id: "voltar-ai",
    name: "Voltar AI",
    title: "Voltar AI",
    discipline: "AI product / web",
    summary: "AI assistance for growing businesses.",
    role: "Frontend developer",
    period: "2025",
    href: "https://voltar.ai",
    image: {
      src: "/images/work/voltar-ai.png",
      width: 1600,
      height: 1000,
      alt: "Voltar AI cover",
    },
    company: { label: "Dreamosoft / Voltar AI", href: "https://voltar.ai" },
    liveUrl: "https://voltar.ai",
    githubUrl: "https://github.com/GodsonicCodes/voltarai.git",
    techStack: ["Next.js", "TypeScript"],
  },
];
