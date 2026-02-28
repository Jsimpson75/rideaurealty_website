# Rideau Realty – Code & Project Structure Review

## 1. Project structure

### Current layout

```
RideauReality copy/
├── index.html              # Vite entry, SEO meta tags
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── vite-env.d.ts
├── src/
│   ├── main.tsx            # React entry, HashRouter
│   ├── App.tsx             # Route definitions
│   ├── index.css           # Tailwind + global styles
│   └── pages/
│       ├── Home.tsx
│       └── Listings.tsx
├── components/             # Shared UI (12 components)
├── lib/
│   ├── api.ts              # Realtor.ca API + filterProperties
│   └── cache.ts            # localStorage cache with TTL
└── public/
    └── images/             # Logos, team photos
```

### Recommendations

- **Add `tests/` or colocate `*.test.ts(x)`** – Introduce a clear place for tests (e.g. `lib/*.test.ts`, `src/**/*.test.tsx`) and stick to one convention.
- **Remove legacy `app/` and `.next/`** if present – They belong to the old Next.js setup and can confuse tooling and new contributors.
- **Optional `src/components/`** – Moving shared components into `src/components/` would keep all app code under `src/` and simplify path aliases; current `@/components` is fine if you prefer a top-level `components/`.

---

## 2. Configuration

### Vite (`vite.config.ts`)

- Single `@` alias to project root is consistent with imports.
- No `base` set – Correct for default deployment; for GitHub Pages use `base: '/repo-name/'` when needed.

### TypeScript (`tsconfig.json`)

- `include` correctly lists `src`, `components`, `lib`, `vite-env.d.ts`.
- `strict: true` and `jsx: "react-jsx"` are appropriate.
- Consider adding `"noUnusedLocals": true` and `"noUnusedParameters": true` later to tighten quality.

### Tailwind / PostCSS

- `tailwind.config.js` uses ESM `export default`; content paths cover `index.html`, `src/**`, `components/**`.
- Theme extension (primary, brand, secondary, Inter) is consistent.

---

## 3. Code review

### 3.1 Entry and routing

- **`src/main.tsx`** – Renders into `#root` with `HashRouter`; appropriate for static/SPA hosting.
- **`src/App.tsx`** – Declares `/` and `/listings`; no 404 route. Consider a catch‑all route that redirects to `/` or shows a simple “Not found” for invalid hashes.

### 3.2 Lib layer

**`lib/api.ts`**

- **Strengths:** Clear interfaces (`PropertyListing`, `PropertyDetails`, `PropertyAgent`), single place for API config, pure `filterProperties` that is easy to unit test.
- **Concerns:**
  - API key is in source; prefer env (e.g. `import.meta.env.VITE_RAPIDAPI_KEY`) and document in README.
  - No request timeout or retry; consider `AbortController` + timeout and optional retries for robustness.
  - `transformPropertyDetailsResponse` and related code use `any` in places; tightening types would improve safety.

**`lib/cache.ts`**

- **Strengths:** Simple TTL-based cache, namespaced keys (`rideau_realty_cache_`), defensive try/catch and `localStorage`-only usage.
- **Concerns:**
  - Relies on `localStorage` without checking availability (e.g. private mode); a guard or try/catch on first use is enough for this app.
  - No tests yet; this module is an ideal candidate for unit tests.

### 3.3 Pages

- **`Home.tsx`** – Composes sections in a single column; no logic, just layout. Easy to maintain.
- **Listings.tsx** – Large file: state, effects, and UI in one component. Consider:
  - Extracting filter state (and maybe URL sync) into a custom hook (e.g. `useListingsFilters`).
  - Moving filter UI into a subcomponent to shorten the main file and improve readability.

### 3.4 Components

- **Header** – Uses `useNavigate` and `useLocation`; anchor handling (`/#buying`, etc.) with `setTimeout` for post-navigation scroll is a bit brittle but workable for HashRouter.
- **Hero, BuyingSelling, About, Team, Links, Contact, Footer** – Largely presentational; some use `next/link`-style patterns replaced with `Link` or `<a>` + scroll; no major issues.
- **FeaturedProperty, Listings, PropertyDetailsModal** – Depend on `lib/api` and `lib/cache`; good separation of data vs UI.
- **Services, FeaturedProperties** – Services is used; FeaturedProperties appears unused and could be removed or wired in if needed.

### 3.5 Styling and assets

- **index.css** – Tailwind layers + font import + scrollbar and utility overrides; `@import` is correctly placed before Tailwind directives.
- **Images** – References like `/images/...` assume assets in `public/`; ensure `public/images` is present and committed (or documented if excluded).

---

## 4. Testing and automation

### Current state (updated)

- **Vitest + React Testing Library** – Installed and configured. Tests run with `npm run test` (watch) or `npm run test:run` (single run).
- **Build runs tests** – `npm run build` runs `npm run test -- --run` before `tsc` and `vite build`, so CI/build fails if tests fail.
- **`package.json`** – `"lint": "eslint ."` but no ESLint config in repo; add a minimal config if you want lint in CI.

### Recommendations

- **Add Vitest** – Fits Vite, same config and transforms; run with `npm run test`.
- **Unit tests**
  - **`lib/cache.ts`** – Mock `localStorage`; test set/get, TTL expiry, remove, clear, getInfo.
  - **`lib/api.ts`** – Test `filterProperties` with various filters (searchTerm, type, location, priceRange) and edge cases (empty list, “Contact for Price”).
- **Component tests**
  - **App** – Render inside `HashRouter` and assert routes (e.g. home and listings) render without throwing.
  - Optional: one or two key components (e.g. Header links, Listings filter bar) for regression safety.
- **Build pipeline**
  - Run tests before build, e.g. `"build": "npm run test && tsc -b && vite build"` or a single `"ci": "npm run lint && npm run test && npm run build"`.
- **ESLint**
  - Add a minimal config (e.g. `eslint.config.js` with TypeScript + React) so `npm run lint` is defined and consistent in CI.

---

## 5. Security and environment

- **API key** – Move to `VITE_*` env and document in README; ensure `.env` is gitignored.
- **No sensitive data** in components; contact info and links are public by design.

---

## 6. Summary table

| Area              | Status   | Action |
|-------------------|----------|--------|
| Project structure | Good     | Optional: move components under `src/`; remove `app/`, `.next/` |
| Config (Vite, TS, Tailwind) | Good | Optional: GitHub Pages `base` when needed |
| Lib (api, cache)  | Good     | Add tests; externalize API key; tighten types |
| Pages/components  | Good     | Refactor Listings state/hooks if it grows |
| Tests             | Added    | Vitest: lib/cache (9), lib/api filterProperties (15), App (3). Run with `npm run test:run`. |
| Lint              | Script only | Add ESLint config and run in CI |
| Build             | Good     | Run tests (and optionally lint) as part of build/CI |

This review is a snapshot; re-run checks after adding tests and ESLint to confirm everything is wired and passing.
