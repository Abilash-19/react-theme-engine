# 🎨 react-theming-engine

A production-ready, lightweight React theming engine that bridges the gap between **Brand Palettes**, **Semantic Tokens**, and **CSS Variables**. Built for high-performance design systems.

[![npm version](https://img.shields.io/npm/v/react-theming-engine.svg?style=flat-square)](https://www.npmjs.com/package/react-theming-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-react--theme--engine.vercel.app-blueviolet?style=flat-square&logo=vercel)](https://react-theme-engine.vercel.app/)

---

## 🌐 Live Docs & Interactive Playground

> **Try it live →** [**react-theme-engine.vercel.app**](https://react-theme-engine.vercel.app/)

Explore the full interactive documentation, switch between all built-in theme presets, tweak primary colors in real time, and copy integration code — all in one place.

[![react-theming-engine live docs and playground preview](https://raw.githubusercontent.com/Abilash-19/react-theme-engine/main/assets/playground-preview.png)](https://react-theme-engine.vercel.app/)

---

```bash
npm install react-theming-engine
```

## ✨ Features

- 🏗️ **3-Layer Architecture**: Brand Palette → Semantic Tokens → CSS Variables.
- 🌓 **Dynamic Modes**: Native Light and Dark support with smart palette migration.
- 🎨 **Runtime Branding**: Change primary colors or overrides on-the-fly with `overrideTheme`.
- ⚡ **Zero-Runtime Overhead**: Styles are applied via CSS variables for maximum performance.
- 🌪️ **Tailwind Friendly**: Includes a first-class preset for utility-first workflows.
- 🔒 **Type-Safe**: Full TypeScript support with exported types for all tokens.
- 💾 **Persistence**: Built-in localStorage persistence for user preferences.

## 🛠️ Technology Stack

- **[React](https://react.dev/)** (`^18.0.0`): Core UI library.
- **[TypeScript](https://www.typescriptlang.org/)** (`^5.7.0`): Strongly typed programming.
- **[tsup](https://tsup.egoist.dev/)**: High-performance library bundler.
- **[Tailwind CSS](https://tailwindcss.com/)**: Optional integration for utility classes.

## 📦 Installation

```bash
npm install react-theming-engine
```

## 🚀 Quick Start

### 1. Initialize the Provider
The `ThemeProvider` handles state, persistence, and DOM variable injection.

```tsx
import { ThemeProvider } from 'react-theming-engine';

function App() {
  return (
    <ThemeProvider defaultThemeName="light" storageKey="app-theme">
      <MainLayout />
    </ThemeProvider>
  );
}
```

### 2. Implementation Options

#### Option A: Vanilla CSS (Recommended for Flexibility)
The engine automatically injects variables like `--color-background` and `--color-accent` into the `:root`.

```css
/* In your CSS files */
.my-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.my-text {
  color: var(--color-foreground-muted);
}
```

#### Option B: Tailwind CSS
Add the preset to your config to use tokens as utility classes.

```javascript
/* tailwind.config.js */
import { themePreset } from 'react-theming-engine/tailwind';

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [themePreset],
}
```
*Usage: `<div className="bg-surface text-foreground-muted rounded-md" />`*

---

## 🎨 Color Utilities

The engine exports a rich suite of pure, framework-agnostic utilities to help you work with colors at runtime. These are perfect for calculating hovestates, generating dynamic contrasts, or checking OS preferences.

```tsx
import { 
  lighten, 
  darken, 
  withOpacity, 
  getContrastRatio, 
  prefersDarkMode,
  hexToHsl
} from 'react-theming-engine';

// 🔄 Intelligent Manipulation
const hoverColor = lighten('#2563eb', 10);
const mutedBg = withOpacity('#2563eb', 0.1); // Returns #2563eb1a

// ♿ Accessibility & Intelligence
const ratio = getContrastRatio('#ffffff', '#2563eb'); // Result: 5.89 (Passes WCAG AA)
const isDarkMode = prefersDarkMode(); // Boolean based on OS preference

// 🔄 Advanced Conversion
const hsl = hexToHsl('#2563eb'); // Returns { h: 221, s: 83, l: 53 }
```

### 🛠️ Available Functions

| Category | Utilities |
| :--- | :--- |
| **Manipulation** | `lighten`, `darken`, `saturate`, `desaturate`, `mixColors`, `withOpacity` |
| **Conversion** | `hexToRgb`, `rgbToHex`, `rgbToHsl`, `hslToHex`, `hexToHsl`, `hexToRgba` |
| **Analysis** | `getLuminance`, `getContrastRatio`, `prefersDarkMode` |

---

## 🏗️ Dynamic Branding (Advanced)
You can apply logic-based overrides at any time. This is perfect for "Primary Color Changers" or user-specific branding.

```tsx
const { overrideTheme } = useTheme();

const updateBrandColor = (newHex: string) => {
  overrideTheme({
    tokens: {
      accent: newHex,
      accentHover: `${newHex}cc`, // 80% opacity
    }
  });
};
```

---

## 🌈 Included Presets

| Name | Style | Icon |
| :--- | :--- | :--- |
| `light`/`dark` | Multi-purpose | ☀️/🌙 |
| `ocean` | Deep Blues | 🌊 |
| `sunset` | Warm | 🌅 |
| `forest` | Organic Greens | 🌲 |
| `violet` | Modern Purple | 🔮 |
| `earth` | Neutral Browns | ☕ |

## 🏗️ Architecture Detail
We use a **3-Layer System** to ensure UI logic never touches hardcoded colors:
1. **Brand Palette**: Raw color scales (e.g. `blue-500`).
2. **Semantic Tokens**: Functional roles (e.g. `accent` → `brand.primary.600`).
3. **CSS Variables**: The final performance-focused output.

## 📖 Documentation
- [Theming Guide](./THEMING.md) - Deep dive into tokens and overrides.
- [Publishing Guide](./PUBLISHING.md) - NPM & GitHub Package instructions.
- [Contributing Guidelines](./CONTRIBUTING.md) 

## 👨‍💻 Meet the Maintainer

Built with ❤️ by **Abilash**. A UI Engineer focused on scalable design systems and developer tools.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Abilash-19)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abilash-s-84608a23a)

## 📜 License
MIT © [Abilash](https://github.com/Abilash-19)
