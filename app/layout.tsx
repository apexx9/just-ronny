// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { personId, siteConfig, websiteId } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Fonts                                                             */
/* ------------------------------------------------------------------ */

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const aspekta = localFont({
  src: [
    {
      path: "../public/fonts/aspekta-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/aspekta-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-aspekta",
  display: "swap",
  preload: true,
});

/* Signature font — Darlington (self-hosted, GlyphStyle). Drives the intro,
   the about signature and the favicon mark. */
const signature = localFont({
  src: "../public/fonts/darlington-regular.ttf",
  variable: "--font-signature",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: true,
});

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

  /* NOTE: `alternates.canonical: "/"` used to live here. Child routes inherit
     it, which told Google that /blog/* and /projects/* were all duplicates of
     the homepage. Each page now sets its own canonical instead. For the home
     page add:  export const metadata = { alternates: { canonical: "/" } }  */
  alternates: {
    types: { "application/rss+xml": "/blog/feed.xml" },
  },

  /* Google Search Console: paste the token into NEXT_PUBLIC_GSC_VERIFICATION. */
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,

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
        alt: "Aaron Nartey — Software Developer & Mechatronics Engineer",
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

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-light-v3.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark-v3.png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  manifest: "/manifest.webmanifest",

  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  other: {
    "color-scheme": "light dark",
    "contact:email": siteConfig.email,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Structured data: tells Google who you are and what this site is   */
/* ------------------------------------------------------------------ */

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
      alternateName: siteConfig.alternateName,
      url: siteConfig.url,
      email: `mailto:${siteConfig.email}`,
      jobTitle: siteConfig.jobTitle,
      description: siteConfig.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressCountry: siteConfig.countryCode,
      },
      knowsAbout: siteConfig.knowsAbout,
      mainEntityOfPage: { "@id": websiteId },
      ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteConfig.url,
      name: siteConfig.name,
      alternateName: siteConfig.alternateName,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
  ],
};

/* Runs before first paint so <html> already carries the right theme class.
   Without this the app flashes light for a frame on every dark-mode load. */
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

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
      className={`${geist.variable} ${aspekta.variable} ${signature.variable}`}
      style={{ backgroundColor: "var(--background)" }}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={siteJsonLd} />
        <ThemeProvider defaultTheme="system" storageKey="theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
