"use client";

import { useIsClient } from "@/lib/hooks";
import IntroAnimation from "./intro-animation";

export default function IntroMount() {
  const isClient = useIsClient();
  return isClient ? <IntroAnimation /> : null;
}
