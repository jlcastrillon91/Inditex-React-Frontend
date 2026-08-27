# Inditex React Frontend

A client-side React application for browsing mobile devices, viewing product
details, and adding configured products to a persistent cart.

## Requirements

- Node.js 24.19.0 LTS (see `.nvmrc`)
- npm

## Getting started

```bash
nvm use
npm install
cp .env.example .env.local
npm run start
```

The development server prints its local URL when it starts.

## Available scripts

```bash
npm run start       # Development server
npm run build       # Production build
npm run test        # Run the test suite once
npm run test:watch  # Run tests in watch mode
npm run lint        # Check JavaScript and JSX
npm run preview     # Preview the production build
```

## Architecture

The project follows a scalable feature-first architecture:

- `src/app`: application composition, routing, global providers, and layouts.
- `src/pages`: thin route-level containers that compose feature hooks and UI.
- `src/features`: independently owned business capabilities such as products and cart.
- `src/shared/ui`: small native UI primitives reusable across features.
- `src/shared/api`: framework-independent HTTP infrastructure.
- `src/shared/storage`: browser persistence and cache infrastructure.
- `src/shared/config`: validated environment and application configuration.
- `src/test`: shared test configuration and API mocks.

Dependencies flow inward: `app` may use `features` and `shared`; features may
use `shared`; shared modules never import application or feature code. New
business capabilities receive their own folder under `src/features`. Feature
barrels expose the modules used across architectural boundaries, while modules
inside a feature may import their siblings directly.

The UI uses Tailwind CSS 4, semantic HTML, small project-owned components, and
individually imported Lucide icons. It intentionally does not use shadcn, Radix,
CVA, CSS-in-JS, or a full component suite. See
`specs/implementation-plan.toml` for the complete technical specification and
implementation order, and `specs/styling-guidelines.toml` for the visual system.

The application-level `ThemeProvider` accepts `font`, `primaryColor`, and
`secondaryColor` overrides. It exposes them through context and semantic CSS
custom properties, keeping feature components independent from the theme
implementation.

### Scaling state management

For a larger application, add Redux Toolkit when unrelated routes need shared,
complex state. Keep one slice per feature, local UI state in components, and use
RTK Query if server-state requirements outgrow the current hooks and cache.

## Environment

`VITE_API_BASE_URL` defines the API origin. The development example points to:

```text
https://itx-frontend-test.onrender.com
```

Do not commit local `.env` files.

## Production deployment

1. Configure `VITE_API_BASE_URL` in the hosting environment.
2. Run `npm ci`, `npm run lint`, `npm run test`, and `npm run build` in CI.
3. Publish the generated `dist/` directory to a static host.
4. Configure an `index.html` fallback for SPA routes.
5. Verify HTTPS, errors, accessibility, responsive behavior, and bundle size.

Use the pinned Node LTS version and lockfile. Never place secrets in `VITE_*`
variables because they are included in the client bundle.

## Development notes

React Strict Mode intentionally runs effect setup and cleanup twice in
development. A product-detail GET may therefore appear once as cancelled and
once as successful in browser developer tools. The cleanup validates request
cancellation; production performs a single request.

The provided cart endpoint currently returns `count: 1` for every addition, and
the specification does not define duplicate-product behavior. The UI treats
the API response as the source of truth and displays the returned count.
