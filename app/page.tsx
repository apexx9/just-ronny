"use client";

import { useCallback, useState } from "react";
import IntroAnimation from "@/components/intro-animation";
import Portfolio from "@/components/portfolio";
import { useIsClient } from "@/lib/hooks";

export default function HomePage() {
  const isClient = useIsClient();
  const [introDone, setIntroDone] = useState(false);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  if (!isClient) return <div className="boot" aria-hidden="true" />;

  return (
    <>
      <IntroAnimation onComplete={handleIntroDone} />
      <Portfolio introDone={introDone} />
    </>
  );
}
