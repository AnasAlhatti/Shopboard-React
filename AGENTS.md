# ShopBoard

## Stack

- **Core:** React 19, TypeScript (`strict: true`), Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Semantic HTML, Mobile-first CSS, zero `!important`, design tokens (`src/shared/styles/design-tokens.css`)
- **Quality & Git Hooks:** ESLint, Prettier, Husky, lint-staged
- **Testing:** Vitest, React Testing Library (`@testing-library/react`), jsdom

## Folder Structure & Where a New Feature Goes

```
src/
├── features/                  # Independent, domain-driven feature modules
│   ├── cart/                  # CartPage, components/, context/, hooks/, types/, cart.css
│   ├── catalog/               # CatalogPage, components/, hooks/, services/, catalog.css
│   ├── compare/               # ComparePage, components/, context/, hooks/, types/, compare.css
│   ├── configurator/          # ConfiguratorPage, components/, data/, utils/, configurator.css
│   ├── home/                  # HomePage, components/, home.css
│   └── product-detail/        # ProductDetailPage, components/, product-detail.css
├── shared/                    # Cross-feature reusable building blocks & infrastructure
│   ├── api/                   # apiClient.ts (general network client used by all features)
│   ├── components/            # Header, Footer, QuickCartDrawer, CompareDock
│   ├── styles/                # design-tokens.css
│   └── types/                 # product.ts (shared domain entity across features)
├── test/                      # Unified test suite (app.test.tsx, setup.ts)
├── App.tsx                    # Top-level shell and route orchestration
├── main.tsx                   # Application DOM mounting entry point
└── index.css                  # CSS reset and root design token foundations
```

### Where a New Feature Goes

When adding a new capability (e.g., `wishlist`, `reviews`, `account`):

1. **Feature Module (`src/features/<feature-name>/`):**
   - Create `<Feature>Page.tsx` as the main route view.
   - Create `<feature-name>.css` for feature-scoped styles (mobile-first, min-width, using tokens).
   - Place feature-exclusive components inside `src/features/<feature-name>/components/`.
   - Place feature state in `src/features/<feature-name>/context/<Feature>Context.tsx` with `localStorage` synchronization if needed.
   - Place custom consumer hooks in `src/features/<feature-name>/hooks/use<Feature>.ts`.
   - Place feature-specific types in `src/features/<feature-name>/types/<feature>.ts`.
   - Place data fetching/services in `src/features/<feature-name>/services/<feature>Service.ts` using `getJson` from `src/shared/api/apiClient`.
2. **Shared Infrastructure (`src/shared/`):**
   - Only place code in `src/shared/` if it is genuinely shared across multiple features (e.g. `apiClient`, shared `Product` type, global shell components).
3. **Routing & Navigation:**
   - Register the route in `src/App.tsx`.
   - Add navigation links or trigger buttons in `src/shared/components/Header.tsx` or feature cards.
4. **Testing (`src/test/app.test.tsx`):**
   - Add unit and integration tests to the unified test suite.

## Naming Rules

- **React components, pages, contexts, and providers:** PascalCase, e.g. `CartPage.tsx`, `CartContext.tsx`.
- **Hooks:** `use` + PascalCase name in camelCase filename, e.g. `useCart.ts`, `useProducts.ts`.
- **Non-component TypeScript modules (services, utilities, data, and type contracts):** lower camelCase, e.g. `productService.ts`, `apiClient.ts`, `bottleneck.ts`, `tiers.ts`, `product.ts`.
- **Stylesheets:** kebab-case, e.g. `product-detail.css`, `design-tokens.css`.
- **Static asset filenames:** lowercase kebab-case with descriptive names and normal extensions (e.g. `minimalist-gpu-design-f3b58b35.jpg`); avoid spaces, ellipses, and special punctuation.

## Commands

- `npm run dev` starts the local Vite development server.
- `npm run build` creates the production build.
- `npm run lint` checks the code with ESLint.
- `npm run typecheck` runs strict TypeScript checks.
- `npm test` runs the browser-independent unit tests.

## Rules

1. Semantic HTML first
2. Every input has a label
3. Mobile-first, min-width
4. No !important
5. Explain every change
6. Only push to master when I ask.
7. Clear feature modules. Every file has one job, and everything is in its place.
8. Never stretch an image.
9. Only project files. No leftover templates, kits, backups, old versions, screenshots, prompts or AI planning docs. any extra files put them in gitignore
10. Regularly make sure README.md is up to date
