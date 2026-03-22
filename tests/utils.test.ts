// tests/utils.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { kebab, themeToVars, mergeTheme, applyTheme } from "../src/utils";
import { lightTheme } from "../src/presets/light";
import { darkTheme } from "../src/presets/dark";
import type { ThemeOverride } from "../src/types";

// ─── kebab() ─────────────────────────────────────────────────────────────────

describe("kebab", () => {
  it("converts camelCase to kebab-case", () => {
    expect(kebab("foregroundMuted")).toBe("foreground-muted");
    expect(kebab("surfaceHover")).toBe("surface-hover");
    expect(kebab("accentForeground")).toBe("accent-foreground");
  });

  it("handles already-lowercase strings", () => {
    expect(kebab("background")).toBe("background");
    expect(kebab("surface")).toBe("surface");
  });

  it("handles multiple uppercase letters", () => {
    expect(kebab("successSurface")).toBe("success-surface");
    expect(kebab("errorForeground")).toBe("error-foreground");
  });
});

// ─── themeToVars() ───────────────────────────────────────────────────────────

describe("themeToVars", () => {
  it("generates semantic token CSS variables", () => {
    const vars = themeToVars(lightTheme);
    expect(vars["--color-background"]).toBe(lightTheme.tokens.background);
    expect(vars["--color-foreground"]).toBe(lightTheme.tokens.foreground);
    expect(vars["--color-foreground-muted"]).toBe(lightTheme.tokens.foregroundMuted);
    expect(vars["--color-surface-hover"]).toBe(lightTheme.tokens.surfaceHover);
    expect(vars["--color-accent"]).toBe(lightTheme.tokens.accent);
    expect(vars["--color-accent-foreground"]).toBe(lightTheme.tokens.accentForeground);
  });

  it("generates palette CSS variables", () => {
    const vars = themeToVars(lightTheme);
    expect(vars["--color-primary-500"]).toBe(lightTheme.palette.primary[500]);
    expect(vars["--color-success-200"]).toBe(lightTheme.palette.success[200]);
    expect(vars["--color-error-50"]).toBe(lightTheme.palette.error[50]);
  });

  it("generates neutral CSS variables", () => {
    const vars = themeToVars(lightTheme);
    expect(vars["--color-neutral-50"]).toBe(lightTheme.neutral[50]);
    expect(vars["--color-neutral-900"]).toBe(lightTheme.neutral[900]);
  });

  it("generates shape CSS variables", () => {
    const vars = themeToVars(lightTheme);
    expect(vars["--radius-sm"]).toBe("0.25rem");
    expect(vars["--radius-md"]).toBe("0.375rem");
    expect(vars["--radius-lg"]).toBe("0.5rem");
    expect(vars["--radius-full"]).toBe("9999px");
  });

  it("generates typography CSS variables", () => {
    const vars = themeToVars(lightTheme);
    expect(vars["--font-sans"]).toBeDefined();
    expect(vars["--font-mono"]).toBeDefined();
  });
});

// ─── mergeTheme() ────────────────────────────────────────────────────────────

describe("mergeTheme", () => {
  it("returns base theme when override is empty", () => {
    const result = mergeTheme(lightTheme, {});
    expect(result).toEqual(lightTheme);
  });

  it("overrides semantic tokens", () => {
    const override: ThemeOverride = {
      tokens: { background: "#ff0000" },
    };
    const result = mergeTheme(lightTheme, override);
    expect(result.tokens.background).toBe("#ff0000");
    // Other tokens unchanged
    expect(result.tokens.foreground).toBe(lightTheme.tokens.foreground);
  });

  it("deep-merges palette overrides", () => {
    const override: ThemeOverride = {
      palette: {
        primary: { 500: "#custom500" },
      },
    };
    const result = mergeTheme(lightTheme, override);
    expect(result.palette.primary[500]).toBe("#custom500");
    // Other steps remain
    expect(result.palette.primary[100]).toBe(lightTheme.palette.primary[100]);
    // Other scales remain
    expect(result.palette.success).toEqual(lightTheme.palette.success);
  });

  it("overrides shape partially", () => {
    const override: ThemeOverride = {
      shape: { radiusMd: "1rem" },
    };
    const result = mergeTheme(lightTheme, override);
    expect(result.shape.radiusMd).toBe("1rem");
    expect(result.shape.radiusSm).toBe(lightTheme.shape.radiusSm);
  });

  it("overrides name if provided", () => {
    const result = mergeTheme(lightTheme, { name: "custom-light" });
    expect(result.name).toBe("custom-light");
  });

  it("preserves colorMode from base theme", () => {
    const result = mergeTheme(lightTheme, { name: "whatever" });
    expect(result.colorMode).toBe("light");
  });

  it("overrides neutral partially", () => {
    const override: ThemeOverride = {
      neutral: { 50: "#fafafa" },
    };
    const result = mergeTheme(lightTheme, override);
    expect(result.neutral[50]).toBe("#fafafa");
    expect(result.neutral[900]).toBe(lightTheme.neutral[900]);
  });

  it("overrides typography partially", () => {
    const override: ThemeOverride = {
      typography: { fontFamilySans: "Arial, sans-serif" },
    };
    const result = mergeTheme(lightTheme, override);
    expect(result.typography.fontFamilySans).toBe("Arial, sans-serif");
    expect(result.typography.fontFamilyMono).toBe(
      lightTheme.typography.fontFamilyMono,
    );
  });
});

// ─── applyTheme() ────────────────────────────────────────────────────────────

describe("applyTheme", () => {
  beforeEach(() => {
    // Reset styles
    document.documentElement.removeAttribute("style");
    document.documentElement.removeAttribute("data-theme");
  });

  it("sets CSS variables on :root", () => {
    applyTheme(lightTheme);
    const style = document.documentElement.style;
    expect(style.getPropertyValue("--color-background")).toBe(
      lightTheme.tokens.background,
    );
    expect(style.getPropertyValue("--color-primary-500")).toBe(
      lightTheme.palette.primary[500],
    );
  });

  it("sets data-theme attribute", () => {
    applyTheme(lightTheme);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("sets color-scheme", () => {
    applyTheme(darkTheme);
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
});

// ─── Preset completeness ─────────────────────────────────────────────────────

describe("presets", () => {
  it("lightTheme has all required fields", () => {
    expect(lightTheme.name).toBe("light");
    expect(lightTheme.colorMode).toBe("light");
    expect(lightTheme.palette.primary[500]).toBeDefined();
    expect(lightTheme.tokens.background).toBeDefined();
    expect(lightTheme.shape.radiusMd).toBeDefined();
    expect(lightTheme.typography.fontFamilySans).toBeDefined();
  });

  it("darkTheme has all required fields", () => {
    expect(darkTheme.name).toBe("dark");
    expect(darkTheme.colorMode).toBe("dark");
    expect(darkTheme.palette.primary[500]).toBeDefined();
    expect(darkTheme.tokens.background).toBeDefined();
    expect(darkTheme.shape.radiusMd).toBeDefined();
    expect(darkTheme.typography.fontFamilySans).toBeDefined();
  });

  it("dark and light themes have different backgrounds", () => {
    expect(lightTheme.tokens.background).not.toBe(darkTheme.tokens.background);
  });
});
