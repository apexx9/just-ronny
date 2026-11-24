import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import FaviconRotator from "@/components/FaviconRotator";
import PreloadResources from "@/components/preload-resources";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: true });
const dmMono = DM_Mono({ variable: "--font-dm-mono", weight: ["400", "500"], subsets: ["latin"], display: "swap", preload: false });
const maple = localFont({ src: [{ path: "../public/fonts/maple-mono-italic.woff2", weight: "400", style: "italic" }, { path: "../public/fonts/maple-mono-medium-italic.woff2", weight: "500", style: "italic" }], variable: "--font-maple", display: "swap", preload: false });
const signature = localFont({ src: "../public/fonts/darlington-regular.ttf", variable: "--font-signature", weight: "400", display: "swap", preload: false });

const site = {
  name: "Aaron Nartey",
  title: "Aaron Nartey — Mechatronics Engineer",
  description: "Aaron Nartey (APX) is a mechatronics engineer in Accra, Ghana, working across software, electronics, robotics and physical systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aaronirl.tech",
  email: "aaronnartey001@gmail.com",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: { default: site.title, template: "%s — Aaron Nartey" },
  description: site.description,
  keywords: ["Aaron Nartey", "APX", "Mechatronics Engineer", "Robotics", "Embedded Systems", "Control Systems", "Accra", "Ghana"],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_GH", url: site.url, siteName: site.name, title: site.title, description: site.description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.title }] },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  manifest: "/site.webmanifest",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: false, date: false, address: false, email: false },
  other: { "color-scheme": "dark", "contact:email": site.email },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
  themeColor: "#0b0c0c",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: "APX",
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: "Mechatronics Engineer",
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
  knowsAbout: ["Mechatronics", "Embedded systems", "Robotics", "Control systems", "Software engineering"],
  sameAs: ["https://github.com/apexx9", "https://www.instagram.com/__aaro.nn"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable} ${maple.variable} ${signature.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <FaviconRotator />
        <PreloadResources />
        {children}
      </body>
    </html>
  );
}
