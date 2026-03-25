// src/index.ts
// Public API — import everything from here, not from individual files.

// ── Types ──
export type {
  ColorScale,
  BrandPalette,
  SemanticTokens,
  ThemeShape,
  ThemeTypography,
  ThemeConfig,
  ThemeOverride,
  PaletteOverride,
} from "./types";

// ── Presets ──
export { lightTheme } from "./presets/light";
export { darkTheme } from "./presets/dark";
export { oceanTheme } from "./presets/ocean";
export { sunsetTheme } from "./presets/sunset";
export { forestTheme } from "./presets/forest";
export { violetTheme } from "./presets/violet";
export { earthTheme } from "./presets/earth";

// ── Utilities ──
export {
  kebab,
  themeToVars,
  applyCSSVars,
  applyTheme,
  mergeTheme,
} from "./utils";
export type { CSSVarMap } from "./utils";

// ── Color Utilities ──
export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToHex,
  hexToHsl,
  withOpacity,
  hexToRgba,
  lighten,
  darken,
  saturate,
  desaturate,
  getLuminance,
  getContrastRatio,
  mixColors,
  prefersDarkMode,
} from "./colorUtils";
export type { RGB, HSL } from "./colorUtils";

// ── React ──
export {
  ThemeProvider,
  useTheme,
  useTokens,
  registerTheme,
  THEME_REGISTRY,
} from "./ThemeProvider";
export type { ThemeContextValue, ThemeProviderProps } from "./ThemeProvider";
