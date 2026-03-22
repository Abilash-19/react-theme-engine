// tests/ThemeProvider.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  ThemeProvider,
  useTheme,
  useTokens,
  registerTheme,
  THEME_REGISTRY,
} from "../src/ThemeProvider";
import { lightTheme } from "../src/presets/light";
import { darkTheme } from "../src/presets/dark";
import type { ThemeConfig } from "../src/types";

// ─── Test wrapper ────────────────────────────────────────────────────────────

function createWrapper(props?: {
  defaultThemeName?: string;
  storageKey?: string;
}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("style");
  document.documentElement.removeAttribute("data-theme");
  // Reset registry to defaults
  for (const key of Object.keys(THEME_REGISTRY)) {
    if (key !== "light" && key !== "dark") {
      delete THEME_REGISTRY[key];
    }
  }
});

// ─── useTheme ────────────────────────────────────────────────────────────────

describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    // Suppress React error boundary logging for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a <ThemeProvider>",
    );
    consoleSpy.mockRestore();
  });

  it("returns light theme by default", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });
    expect(result.current.theme.name).toBe("light");
    expect(result.current.theme.colorMode).toBe("light");
  });

  it("returns the specified default theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ defaultThemeName: "dark" }),
    });
    expect(result.current.theme.name).toBe("dark");
    expect(result.current.theme.colorMode).toBe("dark");
  });
});

// ─── setTheme ────────────────────────────────────────────────────────────────

describe("setTheme", () => {
  it("switches to a registered theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme.name).toBe("dark");
    expect(result.current.theme.colorMode).toBe("dark");
  });

  it("warns and does nothing for unknown themes", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setTheme("nonexistent");
    });

    expect(result.current.theme.name).toBe("light"); // unchanged
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("nonexistent"),
    );
    warnSpy.mockRestore();
  });

  it("resets overrides when switching themes", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.overrideTheme({ tokens: { background: "#ff0000" } });
    });
    expect(result.current.theme.tokens.background).toBe("#ff0000");

    act(() => {
      result.current.setTheme("dark");
    });
    expect(result.current.theme.tokens.background).toBe(
      darkTheme.tokens.background,
    );
  });
});

// ─── toggleColorMode ─────────────────────────────────────────────────────────

describe("toggleColorMode", () => {
  it("toggles from light to dark", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toggleColorMode();
    });

    expect(result.current.theme.colorMode).toBe("dark");
  });

  it("toggles from dark to light", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ defaultThemeName: "dark" }),
    });

    act(() => {
      result.current.toggleColorMode();
    });

    expect(result.current.theme.colorMode).toBe("light");
  });

  it("keeps palette overrides but drops token overrides", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    // Apply both palette and token overrides
    act(() => {
      result.current.overrideTheme({
        palette: { primary: { 500: "#custom" } },
        tokens: { background: "#ff0000" },
      });
    });

    // Toggle mode
    act(() => {
      result.current.toggleColorMode();
    });

    // Palette override should persist
    expect(result.current.theme.palette.primary[500]).toBe("#custom");
    // Token override should be dropped (dark theme's background used)
    expect(result.current.theme.tokens.background).toBe(
      darkTheme.tokens.background,
    );
  });
});

// ─── overrideTheme ───────────────────────────────────────────────────────────

describe("overrideTheme", () => {
  it("applies a partial token override", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.overrideTheme({
        tokens: { background: "#123456" },
      });
    });

    expect(result.current.theme.tokens.background).toBe("#123456");
    expect(result.current.theme.tokens.foreground).toBe(
      lightTheme.tokens.foreground,
    );
  });

  it("merges multiple overrides cumulatively", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.overrideTheme({ tokens: { background: "#aaa" } });
    });
    act(() => {
      result.current.overrideTheme({ shape: { radiusMd: "2rem" } });
    });

    expect(result.current.theme.tokens.background).toBe("#aaa");
    expect(result.current.theme.shape.radiusMd).toBe("2rem");
  });
});

// ─── resetTheme ──────────────────────────────────────────────────────────────

describe("resetTheme", () => {
  it("clears all overrides", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.overrideTheme({
        tokens: { background: "#ff0000" },
        shape: { radiusMd: "99px" },
      });
    });
    expect(result.current.theme.tokens.background).toBe("#ff0000");

    act(() => {
      result.current.resetTheme();
    });

    expect(result.current.theme.tokens.background).toBe(
      lightTheme.tokens.background,
    );
    expect(result.current.theme.shape.radiusMd).toBe(lightTheme.shape.radiusMd);
  });
});

// ─── useTokens ───────────────────────────────────────────────────────────────

describe("useTokens", () => {
  it("returns semantic tokens", () => {
    const { result } = renderHook(() => useTokens(), {
      wrapper: createWrapper(),
    });

    expect(result.current.background).toBe(lightTheme.tokens.background);
    expect(result.current.accent).toBe(lightTheme.tokens.accent);
  });
});

// ─── registerTheme ───────────────────────────────────────────────────────────

describe("registerTheme", () => {
  it("registers a custom theme that can be activated", () => {
    const ocean: ThemeConfig = {
      ...lightTheme,
      name: "ocean",
      colorMode: "dark",
      tokens: {
        ...lightTheme.tokens,
        background: "#001122",
      },
    };

    registerTheme(ocean);
    expect(THEME_REGISTRY["ocean"]).toBe(ocean);

    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setTheme("ocean");
    });

    expect(result.current.theme.name).toBe("ocean");
    expect(result.current.theme.tokens.background).toBe("#001122");
  });
});

// ─── localStorage persistence ────────────────────────────────────────────────

describe("localStorage persistence", () => {
  it("persists theme name to localStorage", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ storageKey: "app-theme" }),
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(localStorage.getItem("app-theme")).toBe("dark");
  });

  it("restores theme name from localStorage", () => {
    localStorage.setItem("app-theme", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ storageKey: "app-theme" }),
    });

    expect(result.current.theme.name).toBe("dark");
  });

  it("persists overrides to localStorage", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ storageKey: "app-theme" }),
    });

    act(() => {
      result.current.overrideTheme({ tokens: { background: "#custom" } });
    });

    const stored = localStorage.getItem("app-theme-override");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual({
      tokens: { background: "#custom" },
    });
  });

  it("restores overrides from localStorage", () => {
    localStorage.setItem("app-theme", "light");
    localStorage.setItem(
      "app-theme-override",
      JSON.stringify({ tokens: { background: "#restored" } }),
    );

    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ storageKey: "app-theme" }),
    });

    expect(result.current.theme.tokens.background).toBe("#restored");
  });

  it("clears overrides from localStorage on resetTheme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ storageKey: "app-theme" }),
    });

    act(() => {
      result.current.overrideTheme({ tokens: { background: "#temp" } });
    });
    expect(localStorage.getItem("app-theme-override")).toBeTruthy();

    act(() => {
      result.current.resetTheme();
    });
    expect(localStorage.getItem("app-theme-override")).toBeNull();
  });

  it("clears overrides from localStorage on setTheme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper({ storageKey: "app-theme" }),
    });

    act(() => {
      result.current.overrideTheme({ tokens: { background: "#temp" } });
    });

    act(() => {
      result.current.setTheme("dark");
    });
    expect(localStorage.getItem("app-theme-override")).toBeNull();
    expect(localStorage.getItem("app-theme")).toBe("dark");
  });
});
