# react-theming-engine

A lightweight, powerful, 3-layer React theming engine that bridges the gap between **Brand Palettes**, **Semantic Tokens**, and **CSS Variables**.

## 🌟 Features

- **3-Layer Architecture**: Brand Palette → Semantic Tokens → CSS Variables.
- **Dynamic Theming**: Change themes or primary colors at runtime without page reloads.
- **Tailwind CSS Ready**: Includes a built-in Tailwind preset that maps tokens to Tailwind utility classes.
- **Type-Safe**: Complete TypeScript support for themes and tokens.
- **Multiple Presets**: Comes with built-in presets: `light`, `dark`, `ocean`, `sunset`, `forest`, and `violet`.

## 📦 Installation

```bash
npm install react-theming-engine
# or
yarn add react-theming-engine
# or
pnpm add react-theming-engine
```

## 🚀 Quick Start

Wrap your application with the `ThemeProvider`. You can specify a `defaultThemeName` and a `storageKey` to persist the user's preference.

```tsx
import { ThemeProvider } from 'react-theming-engine';

function App() {
  return (
    <ThemeProvider defaultThemeName="light" storageKey="my-app-theme">
      <YourApp />
    </ThemeProvider>
  );
}
```

## 🎨 Dynamic Customization

### Switching Themes

```tsx
import { useTheme } from 'react-theming-engine';

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('ocean')}>Ocean Theme</button>
    </div>
  );
};
```

### Overriding Tokens & Palette

You can apply ad-hoc overrides to the current theme. This is useful for dynamic branding or user-customized colors.

```tsx
const { overrideTheme } = useTheme();

const handleBrandingChange = (brandColor: string) => {
  overrideTheme({
    tokens: {
      accent: brandColor,
      surface: '#f0f0f0',
    },
    shape: {
      radiusMd: '12px'
    }
  });
};
```

## 🏗️ Theme Structure

The engine uses a strictly typed structure to ensure consistency across your app.

### 1. Brand Palette
Raw color scales (50-900) for different colors.
```typescript
interface BrandPalette {
  primary: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}
```

### 2. Semantic Tokens
Functional roles that map to brand colors.
```typescript
interface SemanticTokens {
  background: string;
  surface: string;
  foreground: string;
  border: string;
  accent: string;
  // ... and more
}
```

### 3. Shape & Typography
Standardized radii and fonts.
```typescript
interface ThemeShape {
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
}

interface ThemeTypography {
  fontFamilySans: string;
  fontFamilyMono: string;
}
### 4. Full Theme Config
The complete object used to define a theme.
```typescript
interface ThemeConfig {
  name: string;
  colorMode: 'light' | 'dark';
  palette: BrandPalette;
  neutral: ColorScale;
  tokens: SemanticTokens;
  shape: ThemeShape;
  typography: ThemeTypography;
}
```

## 🌪️ Tailwind CSS Integration

To use your theme tokens as Tailwind utility classes, add the preset to your `tailwind.config.js`:

```javascript
// tailwind.config.js
import { themePreset } from 'react-theming-engine/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [themePreset],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Now you can use semantic tokens directly in your components:

```tsx
<div className="bg-surface text-foreground border-border rounded-md p-4">
  <h1 className="text-primary-600">Dynamic Theming!</h1>
  <p className="text-foreground-muted">This uses semantic Tailwind tokens.</p>
</div>
```

## 🏗️ Architecture

1.  **Brand Palette**: Defines raw color scales (e.g., `blue-500`, `gray-200`).
2.  **Semantic Tokens**: Maps brand colors to functional roles (e.g., `surface` → `neutral-50`, `primary` → `blue-600`).
3.  **CSS Variables**: The final output used in your styles (e.g., `--color-surface`).

## 📜 License

MIT © [Abilash](https://github.com/Abilash-19)
