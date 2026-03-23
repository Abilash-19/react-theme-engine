# Theming Guide

`react-theming-engine` follows a **3-layer system** to ensure your styles are scalable, maintainable, and easy to override at runtime.

---

## 🏗️ The 3-Layer Architecture

### 1. Brand Palette (Primitive)
This layer contains your "raw" colors. These are static scales from 50 to 900. No logic is applied here.
- **Example**: `primary.500`, `success.600`, `neutral.100`.

### 2. Semantic Tokens (Functional)
This layer maps the raw colors to specific roles in your UI. This is where you define how a "surface" or "border" looks in both Light and Dark modes.
- **Example**: `surface` → `neutral.50` (Light) or `neutral.900` (Dark).

### 3. CSS Variables (Runtime)
The engine automatically generates CSS variables from your tokens. You consume these in your CSS or Tailwind config.
- **Example**: `--color-surface`, `--color-accent`.

---

## 🎨 Creating a Custom Theme

To create a new theme, you need to define a `ThemeConfig` object.

```typescript
import { ThemeConfig } from 'react-theming-engine';

export const myCustomTheme: ThemeConfig = {
  name: 'midnight',
  colorMode: 'dark',
  palette: {
    primary: { /* 50..900 */ },
    success: { /* 50..900 */ },
    // ...
  },
  neutral: { /* Gray scale */ },
  tokens: {
    background: '#000000',
    surface: '#111111',
    foreground: '#ffffff',
    accent: 'var(--color-primary-500)',
    // ...
  },
  shape: {
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '16px',
    radiusFull: '9999px',
  },
  typography: {
    fontFamilySans: 'Inter, sans-serif',
    fontFamilyMono: 'Fira Code, monospace',
  }
};
```

### Registering your Theme
Once created, register it so the `ThemeProvider` can find it by name.

```tsx
import { registerTheme } from 'react-theming-engine';
import { myCustomTheme } from './myCustomTheme';

registerTheme(myCustomTheme);
```

---

## 🛠️ Runtime Overrides

Sometimes you don't want to define a whole new theme, but just override a few colors (e.g., for a specific user or a "branding" section).

```tsx
const { overrideTheme } = useTheme();

// Change just the accent color and corner radius
overrideTheme({
  tokens: {
    accent: '#ff0000',
  },
  shape: {
    radiusMd: '0px',
  }
});
```

To clear all overrides and return to the base theme:
```tsx
const { resetTheme } = useTheme();
resetTheme();
```

---

## 🌓 Dark Mode Best Practices

1. **Don't hardcode colors**: Use the `BrandPalette` scales within your `SemanticTokens`.
2. **Semantic Focus**: Designers should talk in terms of `surface` and `foreground`, not "white" and "black".
3. **Smart Toggle**: Use `toggleColorMode()` from `useTheme()` to quickly switch between your system's light and dark variants.

---

## 📜 Need Help?
Check out the [GitHub Issues](https://github.com/Abilash-19/react-theming-engine/issues) for community support.
