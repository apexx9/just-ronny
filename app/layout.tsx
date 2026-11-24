// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import FaviconRotator from "@/components/FaviconRotator";
import PreloadResources from "@/components/preload-resources";
import { ThemeProvider } from "@/components/theme-provider";

/* ------------------------------------------------------------------ */
/*  Fonts                                                             */
/* ------------------------------------------------------------------ */

/* Inter — the visible face, matching degreat.co.uk (headings, body, UI). */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const maple = localFont({
  src: [
    {
      path: "../public/fonts/maple-mono-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/maple-mono-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-maple",
  display: "swap",
  preload: false,
});

/* Signature font — Darlington (self-hosted, GlyphStyle). Drives the intro
   and the about signature. The favicon is a separate geometric monogram. */
const signature = localFont({
  src: "../public/fonts/darlington-regular.ttf",
  variable: "--font-signature",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
});

/* ------------------------------------------------------------------ */
/*  Site config                                                       */
/* ------------------------------------------------------------------ */

const siteConfig = {
  name: "Aaron Nartey",
  title: "Aaron Nartey — Mechatronics Engineer",
  description:
    "I'm Aaron Nartey (APX), a mechatronics engineer in Accra, Ghana. I build things where software, electronics and motion meet — embedded systems, controls, and the interfaces that make them usable.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aaronirl.tech",
  email: "aaronnartey001@gmail.com",
  locale: "en_GH",
  keywords: [
    "Aaron Nartey",
    "APX",
    "Ronny",
    "Mechatronics Engineer",
    "Mechatronics",
    "Embedded Systems",
    "Robotics",
    "Control Systems",
    "Hardware Engineer",
    "Software Engineer",
    "Ghana",
    "Accra",
  ],
};

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: "%s — Aaron Nartey",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,

  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Aaron Nartey — Mechatronics Engineer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /* Static icons come from the APX brand kit via app/icon.svg, app/favicon.ico
     and app/apple-icon.png — all the A tile. Next emits those tags for first
     paint, crawlers and no-JS; lib/favicon-rotator.ts then cycles A → P → X. */
  manifest: "/site.webmanifest",

  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  other: {
    "color-scheme": "dark light",
    "contact:email": siteConfig.email,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
  themeColor: "#141414",
};

/* Runs before first paint so <html> already carries the right theme class.
   Dark is the default: only an explicit stored "light" (or a system
   preference when the visitor chose "system") opts out. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;var d=t==="light"?false:t==="system"?m:true;var e=document.documentElement;e.classList.toggle("dark",d);e.dataset.theme=d?"dark":"light";e.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  alternateName: "APX",
  url: siteConfig.url,
  email: `mailto:${siteConfig.email}`,
  jobTitle: "Mechatronics Engineer",
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Accra",
    addressCountry: "GH",
  },
  knowsAbout: [
    "Mechatronics",
    "Embedded systems",
    "Robotics",
    "Control systems",
    "Software engineering",
  ],
  sameAs: [
    "https://github.com/apexx9",
    "https://www.instagram.com/__aaro.nn",
  ],
};

/* ------------------------------------------------------------------ */
/*  Root layout                                                       */
/* ------------------------------------------------------------------ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${dmMono.variable} ${maple.variable} ${signature.variable}`}
      style={{ backgroundColor: "var(--background)" }}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <FaviconRotator />
        <PreloadResources />
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
