// src/ThemeProvider.tsx
// React context + provider + hooks for theme access and switching.
// Applies CSS variables to :root on every theme change.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SemanticTokens, ThemeConfig, ThemeOverride } from "./types";
import { lightTheme } from "./presets/light";
import { darkTheme } from "./presets/dark";
import { oceanTheme } from "./presets/ocean";
import { sunsetTheme } from "./presets/sunset";
import { forestTheme } from "./presets/forest";
import { violetTheme } from "./presets/violet";
import { earthTheme } from "./presets/earth";
import { applyTheme, mergeTheme } from "./utils";

// ─── Registry ────────────────────────────────────────────────────────────────
// Themes are registered by name. Extend this map to add custom themes.

const THEME_REGISTRY: Record<string, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
  violet: violetTheme,
  earth: earthTheme,
};

/**
 * Register a custom theme at runtime.
 * Once registered, it can be activated via `setTheme(theme.name)`.
 */
export function registerTheme(theme: ThemeConfig): void {
  THEME_REGISTRY[theme.name] = theme;
}

// ─── Context ─────────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  /** The fully-resolved theme (base + overrides merged) */
  theme: ThemeConfig;
  /** Switch to a registered theme by name */
  setTheme: (name: string) => void;
  /** Toggle between light and dark color modes */
  toggleColorMode: () => void;
  /** Apply an ad-hoc override to the current theme (merges with existing overrides) */
  overrideTheme: (override: ThemeOverride) => void;
  /** Reset any ad-hoc overrides */
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme name from THEME_REGISTRY (default: "light") */
  defaultThemeName?: string;
  /**
   * Optional storage key. When provided, the chosen theme name is persisted
   * to localStorage and restored on next load.
   * - Theme name stored at `${storageKey}`
   * - Overrides stored at `${storageKey}-override`
   */
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultThemeName = "light",
  storageKey,
}: ThemeProviderProps) {
  // ── Lazy initializers for localStorage reads ──
  const [activeThemeName, setActiveThemeName] = useState<string>(() => {
    if (storageKey) {
      try {
        return localStorage.getItem(storageKey) ?? defaultThemeName;
      } catch {
        return defaultThemeName;
      }
    }
    return defaultThemeName;
  });

  const [override, setOverride] = useState<ThemeOverride | null>(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-override`);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.error("Failed to parse theme override from storage", e);
        return null;
      }
    }
    return null;
  });

  // ── Derived theme ──
  const baseTheme = THEME_REGISTRY[activeThemeName] ?? lightTheme;

  const theme = useMemo(
    () => (override ? mergeTheme(baseTheme, override) : baseTheme),
    [baseTheme, override],
  );

  // ── Apply CSS vars to DOM after render ──
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // ── Stable callbacks ──

  const setTheme = useCallback(
    (name: string) => {
      if (!THEME_REGISTRY[name]) {
        console.warn(`[ThemeProvider] Theme "${name}" is not registered.`);
        return;
      }
      setActiveThemeName(name);
      setOverride(null);
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, name);
          localStorage.removeItem(`${storageKey}-override`);
        } catch {
          // localStorage may be unavailable (SSR, privacy mode, etc.)
        }
      }
    },
    [storageKey],
  );

  const toggleColorMode = useCallback(() => {
    const next = theme.colorMode === "light" ? "dark" : "light";
    const nextTheme = Object.values(THEME_REGISTRY).find(
      (t) => t.colorMode === next,
    );
    if (nextTheme) {
      setActiveThemeName(nextTheme.name);

      // Smart migration: keep palette overrides but drop token/shape/typography
      // overrides because they are mode-specific.
      setOverride((prev) => {
        if (!prev) return null;
        const { palette: paletteOverride, neutral: neutralOverride } = prev;
        const kept: ThemeOverride = {};
        if (paletteOverride) kept.palette = paletteOverride;
        if (neutralOverride) kept.neutral = neutralOverride;
        return Object.keys(kept).length > 0 ? kept : null;
      });

      if (storageKey) {
        try {
          localStorage.setItem(storageKey, nextTheme.name);
        } catch {
          // noop
        }
      }
    }
  }, [theme.colorMode, storageKey]);

  const overrideTheme = useCallback(
    (o: ThemeOverride) => {
      setOverride((prev) => {
        const next = prev ? { ...prev, ...o } : o;
        if (storageKey) {
          try {
            localStorage.setItem(
              `${storageKey}-override`,
              JSON.stringify(next),
            );
          } catch {
            // noop
          }
        }
        return next;
      });
    },
    [storageKey],
  );

  const resetTheme = useCallback(() => {
    setOverride(null);
    if (storageKey) {
      try {
        localStorage.removeItem(`${storageKey}-override`);
      } catch {
        // noop
      }
    }
  }, [storageKey]);

  // ── Memoized context value ──
  const value = useMemo(
    () => ({ theme, setTheme, toggleColorMode, overrideTheme, resetTheme }),
    [theme, setTheme, toggleColorMode, overrideTheme, resetTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Access the full theme context: theme, setTheme, toggleColorMode, overrideTheme, resetTheme.
 * Must be used within a `<ThemeProvider>`.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}

/**
 * Convenience hook that returns just the semantic tokens.
 * Use in components that only need color values.
 */
export function useTokens(): SemanticTokens {
  return useTheme().theme.tokens;
}

// Re-export the registry so power users can inspect it
export { THEME_REGISTRY };
