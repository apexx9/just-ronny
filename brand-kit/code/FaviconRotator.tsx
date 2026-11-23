"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { startFaviconRotator } from "@/lib/favicon-rotator";

/** Mount once in app/layout.tsx. Re-applies after route changes because Next may rewrite <head> links. */
export default function FaviconRotator() {
  const pathname = usePathname();
  useEffect(() => startFaviconRotator(), [pathname]);
  return null;
}
