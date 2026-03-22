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

Wrap your application with the `ThemeProvider`:

```tsx
import { ThemeProvider, lightTheme } from 'react-theming-engine';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Use Semantic Tokens in your CSS

The engine automatically injects CSS variables into the `:root` (or the provider element).

```css
.card {
  background-color: var(--color-surface);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.button-primary {
  background-color: var(--color-primary-500);
  color: var(--color-foreground-inverse);
}
```

## 🎨 Dynamic Customization

### Switching Themes

```tsx
import { useTheme, darkTheme, oceanTheme } from 'react-theming-engine';

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme(darkTheme)}>Dark Mode</button>
      <button onClick={() => setTheme(oceanTheme)}>Ocean Theme</button>
    </div>
  );
};
```

### Overriding Primary Color

You can override the primary color scale dynamically without changing the whole theme:

```tsx
const { setPrimaryColor } = useTheme();

// Set to a system scale (e.g., 'indigo') or a custom color scale object
setPrimaryColor('indigo'); 
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
