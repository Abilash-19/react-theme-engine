// src/colorUtils.ts
// ─── UI Theme Utility Functions ──────────────────────────────────────────────
// A collection of pure, framework-agnostic helpers to work with colors,
// contrast, accessibility, and dynamic shade generation.
//
// All functions are exported from the package root — import like:
//   import { hexToHsl, mixColors, withOpacity } from 'react-theming-engine';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RGB {
  r: number; // 0–255
  g: number; // 0–255
  b: number; // 0–255
}

export interface HSL {
  h: number; // 0–360
  s: number; // 0–100
  l: number; // 0–100
}



// ─── Parsing ──────────────────────────────────────────────────────────────────

/**
 * Parse a 3 or 6 digit hex string (#fff or #ffffff) into an RGB object.
 * Throws if the string is not a valid hex color.
 *
 * @example
 * hexToRgb('#2563eb') // → { r: 37, g: 99, b: 235 }
 */
export function hexToRgb(hex: string): RGB {
  const clean = hex.replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`[react-theming-engine] Invalid hex color: "${hex}"`);
  }

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/**
 * Convert an RGB object to a 6-digit hex string (with leading #).
 *
 * @example
 * rgbToHex({ r: 37, g: 99, b: 235 }) // → '#2563eb'
 */
export function rgbToHex({ r, g, b }: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Convert an RGB object to an HSL object.
 *
 * @example
 * rgbToHsl({ r: 37, g: 99, b: 235 }) // → { h: 221, s: 83, l: 53 }
 */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case rn:
        h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / delta + 2) / 6;
        break;
      default:
        h = ((rn - gn) / delta + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert an HSL object back to a 6-digit hex string.
 *
 * @example
 * hslToHex({ h: 221, s: 83, l: 53 }) // → '#2563eb'
 */
export function hslToHex({ h, s, l }: HSL): string {
  const sn = s / 100;
  const ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return rgbToHex({
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  });
}

/**
 * Convenience: hex → HSL in one call.
 *
 * @example
 * hexToHsl('#2563eb') // → { h: 221, s: 83, l: 53 }
 */
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

// ─── Opacity / Alpha ──────────────────────────────────────────────────────────

/**
 * Return a hex color with an alpha channel appended (8-digit hex).
 * `opacity` should be between 0 and 1.
 *
 * @example
 * withOpacity('#2563eb', 0.5) // → '#2563eb80'
 */
export function withOpacity(hex: string, opacity: number): string {
  const alpha = Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex.replace(/^#/, "#")}${alpha}`;
}

/**
 * Convert a hex color to `rgba(r, g, b, alpha)` CSS string.
 *
 * @example
 * hexToRgba('#2563eb', 0.5) // → 'rgba(37, 99, 235, 0.5)'
 */
export function hexToRgba(hex: string, alpha = 1): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Lightness Manipulation ───────────────────────────────────────────────────

/**
 * Lighten a hex color by a given percentage (0–100).
 *
 * @example
 * lighten('#2563eb', 20) // → a lighter blue
 */
export function lighten(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, l: Math.min(100, hsl.l + amount) });
}

/**
 * Darken a hex color by a given percentage (0–100).
 *
 * @example
 * darken('#2563eb', 20) // → a darker blue
 */
export function darken(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, l: Math.max(0, hsl.l - amount) });
}

/**
 * Saturate a hex color by a given percentage (0–100).
 */
export function saturate(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, s: Math.min(100, hsl.s + amount) });
}

/**
 * Desaturate a hex color by a given percentage (0–100).
 * At 100 it becomes greyscale.
 */
export function desaturate(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, s: Math.max(0, hsl.s - amount) });
}

// ─── Contrast & Accessibility ─────────────────────────────────────────────────

/**
 * Calculate the WCAG relative luminance of a hex color.
 * Returns a value between 0 (black) and 1 (white).
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rn, gn, bn] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
}

/**
 * Calculate the WCAG contrast ratio between two hex colors.
 * Returns a number between 1 and 21.
 * WCAG AA requires ≥ 4.5 for normal text.
 *
 * @example
 * getContrastRatio('#ffffff', '#2563eb') // → ~5.9 (passes AA)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}







// ─── Mixing ───────────────────────────────────────────────────────────────────

/**
 * Mix two hex colors together. `weight` controls how much of `hex1` to use
 * (0 = all hex2, 1 = all hex1, 0.5 = equal mix).
 *
 * @example
 * mixColors('#ff0000', '#0000ff', 0.5) // → '#7f007f' (purple)
 */
export function mixColors(hex1: string, hex2: string, weight = 0.5): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex({
    r: Math.round(c1.r * weight + c2.r * (1 - weight)),
    g: Math.round(c1.g * weight + c2.g * (1 - weight)),
    b: Math.round(c1.b * weight + c2.b * (1 - weight)),
  });
}



/**
 * Determine if the user's OS prefers dark mode.
 * Useful for setting the initial theme before the provider mounts.
 *
 * @example
 * prefersDarkMode() // → true | false
 */
export function prefersDarkMode(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
