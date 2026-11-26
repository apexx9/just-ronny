export type Project = {
  id: string;
  slug?: string;
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
  role: "Software Developer & Mechatronics Engineer",
  contactHref: "mailto:aaronnartey001@gmail.com",
  heroTagline: "I build software and intelligent systems that connect code, electronics, and the real world.",
  availability: "Open to new work",
  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/apexx9" },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/",
    },
    { id: "x", label: "X", href: "https://x.com/" },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/__aaro.nn",
    },
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
  services: [
    "Software development",
    "Mechatronics systems",
    "Embedded systems",
    "Automation & IoT",
  ],
  about: {
    intro: "Hi, I'm",
    description: "a software developer and mechatronics engineer",
    experience:
      "I build practical digital products and hardware-integrated systems end to end. My work spans software, embedded electronics, automation, and the interfaces that bring connected systems together.",
  },
};
