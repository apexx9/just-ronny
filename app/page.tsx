"use client";

import { useEffect, useState } from "react";
import IntroAnimation from "@/components/intro-animation";
import Portfolio from "@/components/portfolio";

export default function HomePage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      <IntroAnimation />
      <Portfolio />
    </>
  );
}

