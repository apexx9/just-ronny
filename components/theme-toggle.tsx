"use client"

import { useTheme } from "./theme-provider"

type Theme = "light" | "dark" | "system"

const CYCLE: Theme[] = ["light", "dark", "system"]
const STATE_LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
}
const NEXT_LABEL: Record<Theme, string> = {
  light: "dark",
  dark: "system",
  system: "light",
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

export function ThemeToggle({
  onPointerEnter,
  variant = "nav",
}: {
  onPointerEnter?: () => void
  variant?: "nav" | "floating"
}) {
  const { theme, setTheme } = useTheme()

  const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length]

  return (
    <button
      type="button"
      className={`theme-toggle${
        variant === "floating" ? " theme-toggle--floating" : ""
      }`}
      onClick={() => setTheme(next)}
      onPointerEnter={onPointerEnter}
      aria-label={`Theme: ${STATE_LABEL[theme]}. Switch to ${NEXT_LABEL[theme]}.`}
      title={`Theme: ${STATE_LABEL[theme]}`}
      suppressHydrationWarning
    >
      {theme === "light" && <SunIcon />}
      {theme === "dark" && <MoonIcon />}
      {theme === "system" && <SystemIcon />}
    </button>
  )
}
