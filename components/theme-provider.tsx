"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react"

type Theme = "light" | "dark" | "system"
type Resolved = "light" | "dark"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  resolved: Resolved
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  resolved: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark" || value === "system"

/* localStorage is an external store: read it with useSyncExternalStore so the
   value survives hydration without a setState-in-effect cascade. Writes ping
   the local listeners because the "storage" event only fires cross-tab. */
const themeListeners = new Set<() => void>()

function emitThemeChange() {
  themeListeners.forEach((listener) => listener())
}

function subscribeToTheme(storageKey: string, callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === storageKey) callback()
  }
  window.addEventListener("storage", onStorage)
  themeListeners.add(callback)
  return () => {
    window.removeEventListener("storage", onStorage)
    themeListeners.delete(callback)
  }
}

function readTheme(storageKey: string, fallback: Theme): Theme {
  const stored = localStorage.getItem(storageKey)
  return isTheme(stored) ? stored : fallback
}

function subscribeToSystem(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function readSystemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const theme = useSyncExternalStore(
    useCallback((cb) => subscribeToTheme(storageKey, cb), [storageKey]),
    () => readTheme(storageKey, defaultTheme),
    () => defaultTheme,
  )

  const systemPrefersDark = useSyncExternalStore(
    subscribeToSystem,
    readSystemPrefersDark,
    () => false,
  )

  const resolved: Resolved =
    theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", resolved === "dark")
    root.dataset.theme = resolved
    root.style.colorScheme = resolved
  }, [resolved])

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next)
    emitThemeChange()

    /* Cross-fade surfaces for a beat instead of snapping. */
    const root = window.document.documentElement
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("theme-switching")
      window.setTimeout(() => root.classList.remove("theme-switching"), 320)
    }
  }

  const value: ThemeProviderState = { theme, resolved, setTheme }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
