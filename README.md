# Rigged Wheel of Names (React + Vite)

This is a simple wheel of names you can deploy to **GitHub Pages**.
It supports a rig mode that always picks the 4th name.

## Local dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to GitHub Pages

1. Create a repo on GitHub (e.g. `rigged-wheel`).
2. Replace `<REPO_NAME>` in `vite.config.js` with your repo name, like:
   ```js
   export default defineConfig({ base: '/rigged-wheel/' })
   ```
3. Push this project to the repo's **main** branch.
4. In GitHub: Settings → Pages → Build and deployment → Source: **GitHub Actions** (the included workflow will build & publish).
5. After the workflow completes, your site will be available at:
   `https://<your-username>.github.io/<REPO_NAME>/`

> Tailwind CSS is loaded via the official CDN in `index.html`. No extra setup required.
