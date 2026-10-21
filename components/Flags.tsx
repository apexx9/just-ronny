"use client";

import { useId, type ReactElement } from "react";

export function GhanaFlag() {
  return (
    <svg
      className="instagram-flag"
      viewBox="0 0 3 2"
      style={{ height: "0.9em", width: "1.35em" }}
      role="img"
      aria-label="Ghana"
    >
      <rect width="3" height="0.6667" fill="#CE1126" />
      <rect y="0.6667" width="3" height="0.6667" fill="#FCD116" />
      <rect y="1.3333" width="3" height="0.6667" fill="#006B3F" />
      <polygon
        fill="#000"
        points="1.5,0.7 1.5674,0.9073 1.7853,0.9073 1.609,1.0354 1.6763,1.2427 1.5,1.1146 1.3237,1.2427 1.391,1.0354 1.2147,0.9073 1.4326,0.9073"
      />
    </svg>
  );
}

export function UKFlag() {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      className="instagram-flag"
      viewBox="0 0 60 30"
      style={{ height: "0.9em", width: "1.8em" }}
      role="img"
      aria-label="United Kingdom"
    >
      <defs>
        <clipPath id={`${id}s`}>
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id={`${id}t`}>
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}s)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${id}t)`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

const FLAGS: Record<string, () => ReactElement> = {
  gh: GhanaFlag,
  gb: UKFlag,
  uk: UKFlag,
};

export function renderWithFlags(text: string) {
  return text.split(/(\{(?:gh|gb|uk)\})/gi).map((part, index) => {
    const match = part.match(/^\{(gh|gb|uk)\}$/i);
    if (!match) return part;

    const Flag = FLAGS[match[1].toLowerCase()];
    return <Flag key={index} />;
  });
}
