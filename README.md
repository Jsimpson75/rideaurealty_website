# Rideau Realty Website

A modern, professional real estate website for Rideau Realty — built with **React**, **Vite**, and **Tailwind CSS**. The app is a client-side SPA suitable for static hosting (e.g. GitHub Pages). Authored by Jamie Simpson.

## Features

- **Modern design** — Clean, responsive layout with Tailwind CSS
- **Responsive** — Works on desktop, tablet, and mobile
- **Animations** — Framer Motion for transitions and scroll effects
- **Property listings** — Live listings from Realtor.ca API with search and filters
- **Featured property** — Rotating featured listing with client-side caching
- **Team & contact** — Team profiles, contact form UI, and office info
- **Links & resources** — Curated real estate and local government links
- **SEO-friendly** — Meta tags and Open Graph in `index.html` (static)

## Tech stack

- **Vite 6** — Build tool and dev server
- **React 18** — UI with hooks and functional components
- **React Router 7** — Hash-based routing (GitHub Pages–friendly)
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **Vitest + React Testing Library** — Unit and component tests

## Prerequisites

- **Node.js** 18+
- **npm** (or yarn/pnpm)

## Getting started

1. **Clone and enter the repo**
   ```bash
   git clone <repository-url>
   cd "RideauReality copy"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open the URL shown (e.g. **http://localhost:5173** or **http://localhost:5174** if 5173 is in use).

4. **Build for production**
   ```bash
   npm run build
   ```
   Output is in `dist/`. The build runs tests first; if tests fail, the build fails.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Run tests, type-check, then production build |
| `npm run preview` | Serve the `dist/` build locally |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once (used in build) |
| `npm run lint` | Run ESLint (config optional) |

## Project structure

```
├── index.html              # Entry HTML, meta tags
├── vite.config.ts          # Vite + Vitest config
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx            # React entry, HashRouter
│   ├── App.tsx              # Routes
│   ├── index.css            # Tailwind + global styles
│   ├── setupTests.ts        # Test setup (jsdom, mocks)
│   ├── pages/
│   │   ├── Home.tsx         # Homepage
│   │   └── Listings.tsx     # Property listings + filters
│   └── *.test.tsx           # Component tests
├── components/              # Shared UI
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── FeaturedProperty.tsx
│   ├── BuyingSelling.tsx
│   ├── About.tsx
│   ├── Team.tsx
│   ├── Links.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── PropertyDetailsModal.tsx
│   └── ...
├── lib/
│   ├── api.ts               # Realtor.ca API, filterProperties
│   ├── cache.ts             # localStorage cache (TTL)
│   ├── api.test.ts          # API unit tests
│   └── cache.test.ts        # Cache unit tests
└── public/
    └── images/              # Logos, team photos
```

## Customization

- **Colors / theme** — Edit `tailwind.config.js` (e.g. `primary`, `brand`, `secondary`).
- **Content** — Update copy and data in the relevant components.
- **Images** — Replace assets in `public/images/` (logos, team photos).

### Google Maps (Contact section)

To use your own office location:

1. Open [Google Maps](https://www.google.com/maps) and find your address.
2. Use **Share** → **Embed a map** and copy the iframe `src`.
3. In `components/Contact.tsx`, replace the `iframe` `src` and the “Open in Google Maps” / “Get Directions” links with your embed and URLs.

## Deployment

The app is a **static SPA** (no server-side rendering). Use any static host.

### GitHub Pages (recommended)

A workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. In the repo on GitHub: **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Push to `main`; the workflow runs and publishes the site.

The app uses **relative paths only** (Vite `base: './'` and `lib/assets.ts` for images), so it works the same whether deployed at the **domain root** (e.g. `https://<user>.github.io/`) or a **subpath** (e.g. `https://<user>.github.io/rideaurealty_website/`). No config change is needed.

**Optional (deploy from your machine):** Run `npm run deploy` to build and push `dist/` to the `gh-pages` branch. Then set **Source** to “Deploy from a branch”, branch `gh-pages`, folder `/ (root)`.

### Other options

- **Vercel** — Connect the repo; use default Vite settings.
- **Netlify** — Build command: `npm run build`, publish directory: `dist`.
- **AWS Amplify, Cloudflare Pages, etc.** — Same idea: build, then serve `dist`.

## API (Realtor.ca)

Listings and property details come from the Realtor.ca API via RapidAPI. The app uses client-side caching to limit requests.

**Configuration:** The API key is read from the environment (never commit it).

1. **Local:** Copy `.env.example` to `.env` and set `VITE_RAPIDAPI_KEY` to your RapidAPI key. Get a key at [RapidAPI](https://rapidapi.com) (subscribe to the Realty-in-Ca API).
2. **GitHub Actions (deploy):** In the repo go to **Settings → Secrets and variables → Actions**, add a secret named `VITE_RAPIDAPI_KEY` with your key. The deploy workflow uses it when building.
3. **Rotate** any key that was ever committed to git (create a new key in RapidAPI and revoke the old one).

## Testing

- **Unit tests** — `lib/cache.ts` (cache get/set/expiry/clear) and `lib/api.ts` (`filterProperties`).
- **Component tests** — `src/App.test.tsx` (routes and basic render).

Run tests: `npm run test` (watch) or `npm run test:run` (single run). Tests run automatically before `npm run build`.

## Browser support

- Chrome, Firefox, Safari, Edge (current versions)

## License

This project is licensed under the MIT License.

## Support

- **Email:** info@rideaurealty.ca  
- **Phone:** (613) 272-5000  

---

Built for Rideau Realty.
