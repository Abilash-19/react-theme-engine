# Publishing Guide

This guide documents the steps for releasing new versions of `react-theming-engine` to **npm** and **GitHub Packages**.

---

## 🚀 Pre-Publishing Checklist
Before you publish, always ensure your code is built and ready for production.
```bash
npm run build
```

---

## 📦 Publishing to npm (Standard)

Standard npm publishing is the most common way to distribute your library.

### 1. Authenticate
```bash
npm login
```

### 2. Versioning
We use semantic versioning (`major.minor.patch`).
```bash
npm version patch # For bug fixes
# or
npm version minor # For new features
# or
npm version major # For breaking changes
```

### 3. Publish
Since we have a `prepublishOnly` script in `package.json`, a fresh build will automatically trigger before the upload.
```bash
npm publish --access public
```

---

## 🌳 Creating a GitHub Release

To make your version show up on the GitHub repository page, you should always create a release from your tag.

1.  **Tag the version** (usually `npm version` does this for you automatically).
2.  **Push the tag to GitHub**:
    ```bash
    git push origin main --follow-tags
    ```
3.  **Draft a Release**: Go to the GitHub "Releases" sidebar and click "Create a new release" using the new tag.

---

## ☁️ Publishing to GitHub Packages (Optional)

If you want your package to appear in the **"Packages"** sidebar section on GitHub, you must publish to the GitHub Package Registry.

### 1. Update `package.json`
The name **must** be scoped to your GitHub username.
```json
{
  "name": "@abilash-19/react-theming-engine",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 2. Setup Authentication
You **must** use a Personal Access Token (PAT) with `write:packages` and `read:packages` scopes.

```bash
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" > .npmrc
```

### 3. Publish
```bash
npm publish
```

---

## 📜 Support
For help with releases, contact the repository maintainers or check the [npm documentation](https://docs.npmjs.com/).
