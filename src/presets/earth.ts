// src/presets/earth.ts
// Earthy brown theme — warm, organic, and grounded.

import type { ThemeConfig } from "../types";
import { lightTheme } from "./light";

const palette: ThemeConfig["palette"] = {
  primary: {
    50: "#fdf8f6",
    100: "#f2e8e5",
    200: "#eaddd7",
    300: "#e0c1b3",
    400: "#d3a28a",
    500: "#c78361",
    600: "#a67c52",
    700: "#8b5e3c",
    800: "#704d32",
    900: "#5c3f2b",
  },
  success: lightTheme.palette.success,
  warning: lightTheme.palette.warning,
  error: lightTheme.palette.error,
  info: lightTheme.palette.info,
};

const neutral: ThemeConfig["neutral"] = {
  50: "#1a1614",
  100: "#241f1c",
  200: "#2d2824",
  300: "#3a332e",
  400: "#4a423b",
  500: "#736a61",
  600: "#a1988e",
  700: "#cdc5bc",
  800: "#e7e2dc",
  900: "#f4f1ee",
};

export const earthTheme: ThemeConfig = {
  name: "earth",
  colorMode: "dark",
  palette,
  neutral,

  tokens: {
    background: neutral[50],
    surface: neutral[100],
    surfaceHover: neutral[200],
    elevated: "#2a2420",

    foreground: neutral[900],
    foregroundMuted: neutral[700],
    foregroundSubtle: neutral[600],
    foregroundInverse: neutral[50],

    border: "#3d3530",
    borderSubtle: "#2d2824",
    borderStrong: "#5c5148",

    input: "#2d2824",
    inputHover: "#3a332e",
    inputFocus: "#1a1614",

    ring: palette.primary[600],
    ringOffset: "#1a1614",

    accent: palette.primary[600],
    accentForeground: "#ffffff",
    accentHover: palette.primary[500],

    successSurface: "#1b2e1b",
    successForeground: "#86efac",
    warningSurface: "#3d2b1f",
    warningForeground: "#fcd34d",
    errorSurface: "#451a1a",
    errorForeground: "#fca5a5",
    infoSurface: "#1a2a33",
    infoForeground: "#67e8f9",
  },

  shape: lightTheme.shape,
  typography: lightTheme.typography,
};
