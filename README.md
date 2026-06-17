# althaf // angry — portfolio

Personal site of Althaf Shajahan (AnGrY) — Security Engineer, Security Researcher & Bug Bounty Hunter.

## Stack

- [Vite](https://vitejs.dev) — build & dev server
- [GSAP](https://gsap.com) + ScrollTrigger + SplitText — animation
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling
- [Three.js](https://threejs.org) — morphing particle hero (sphere → "AnGrY" → torus knot)
- Vanilla JS modules, no framework

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build   # outputs to dist/
```

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`
(repo Settings → Pages → Source must be set to **GitHub Actions**).
