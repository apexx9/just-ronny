// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

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

/* Signature font — Sacramento (self-hosted). Drives the intro, the
   about signature and the favicon mark. */
const signature = localFont({
  src: "../public/fonts/sacramento-regular.ttf",
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
  title: "Aaron Nartey — Software Engineer & Creative Developer",
  description:
    "I'm Aaron Nartey, a software engineer and creative developer from Accra, Ghana. I build thoughtful digital products, web applications, and tools that solve real problems.",
  url: "https://ronny.tech",
  email: "aaronnartey001@gmail.com",
  locale: "en_GH",
  keywords: [
    "Aaron Nartey",
    "Ronny",
    "Software Engineer",
    "Creative Developer",
    "Full-Stack Developer",
    "Backend Engineering",
    "Next.js",
    "NestJS",
    "TypeScript",
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
        alt: "Aaron Nartey — Software Engineer & Creative Developer",
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
      { url: "/favicon-light-v2.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark-v2.png", media: "(prefers-color-scheme: dark)" },
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
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
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
      className={`${geist.variable} ${aspekta.variable} ${signature.variable}`}
      style={{
        colorScheme: "light dark",
        backgroundColor: "var(--background)",
      }}
      suppressHydrationWarning
    >
      <body><ThemeProvider defaultTheme="system" storageKey="theme"><div className="theme-toggle-fixed"><ThemeToggle /></div>{children}</ThemeProvider></body>
    </html>
  );
}
