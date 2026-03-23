# Contributing to react-theming-engine

Thank you for your interest in contributing to `react-theming-engine`! Contributions of all kinds (bug fixes, new features, documentation) are welcome.

---

## 🛠️ Development Setup

### 1. Fork the Repository
Fork this repository to your own account and then clone it locally.

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Library
We use `tsup` for bundling the library into ESM and CJS.
```bash
npm run build
```

### 4. Run Tests
We use `Vitest` for unit testing.
```bash
npm test
```

### 5. Type Checking
Ensure all your types are correct:
```bash
npm run typecheck
```

---

## 🚀 Pull Request Process

1.  **Branching**: Create a new branch for each contribution (`feature/new-feature`, `fix/issue-id`).
2.  **Standards**: Follow existing code styles and ensure tests pass.
3.  **Documentation**: Update the relevant documentation if your change introduces new features.
4.  **Submission**: Submit a pull request and provide a clear description of your changes.

---

## 🏗️ Adding New Presets

Adding a theme preset is a great way to contribute!
1.  **Create a new file**: Add your theme to `src/presets/`.
2.  **Define the config**: Ensure it follows the `ThemeConfig` interface.
3.  **Register it**: Add it to `src/ThemeProvider.tsx` and export from `src/index.ts`.
4.  **Submit**: Open a PR with your new preset.

---

## 📜 License
By contributing to this project, you agree that your contributions will be licensed under the MIT License.
