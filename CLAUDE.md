# ShopBoard React Engineering Guide

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
├── context/                   # Global state providers (CartContext, CompareContext)
├── features/                  # Independent, domain-driven feature modules
│   ├── cart/                  # CartPage, CartItemRow, OrderSummary, CheckoutModal, cart.css
│   ├── catalog/               # CatalogPage, FilterSidebar, ProductGrid, ProductCard, SortBar, catalog.css
│   ├── compare/               # ComparePage, CompareTable, BenchmarkBarChart, ProductPickerModal, compare.css
│   ├── configurator/          # ConfiguratorPage, RigVisualizer, ComponentSlotSelector, PowerSynergyMeter, configurator.css
│   ├── home/                  # HomePage, HeroShowcase, ExplodedTeardown, SiliconSpotlight, home.css
│   └── product-detail/        # ProductDetailPage, ProductGallery, ArchitectureSpecTable, MiniBenchmarkCard, product-detail.css
├── hooks/                     # Custom reusable hooks (useCart, useCompare, useProducts)
├── services/                  # API and async data services (productService)
├── shared/                    # Cross-feature reusable building blocks
│   ├── components/            # Header, Footer, QuickCartDrawer, CompareDock
│   └── styles/                # design-tokens.css
├── test/                      # Test suites (app.test.tsx, setup.ts)
├── types/                     # Shared TypeScript domain contracts (product.ts, cart.ts, compare.ts)
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
2. **State & Persistence (`src/context/<Feature>Context.tsx`):**
   - If state is shared across multiple pages or survives refresh, create a React Context provider with `localStorage` synchronization.
3. **Custom Consumer Hook (`src/hooks/use<Feature>.ts`):**
   - Encapsulate context consumption and dispatch actions cleanly.
4. **Types (`src/types/<feature>.ts`):**
   - Define strict TypeScript interfaces and data models (never use `any`).
5. **Routing & Navigation:**
   - Register the route in `src/App.tsx`.
   - Add navigation links or trigger buttons in `src/shared/components/Header.tsx` or feature cards.
6. **Testing (`src/test/app.test.tsx`):**
   - Add unit and integration tests to the unified test suite.

## Commands

- `npm run dev` starts the local Vite development server.
- `npm run build` creates the production build.
- `npm run lint` checks the code with ESLint.
- `npm run typecheck` runs strict TypeScript checks.
- `npm test` runs the browser-independent unit tests.

## React Rules (Learned from Debug Lab)

1. **Strict Immutability in State and Props:**
   - Never mutate state objects or arrays in-place (`item.qty++` or `products.sort()`). React uses referential equality (`Object.is`) to detect updates, so mutating in-place prevents re-renders. Always create new copies using spreading, `.map()`, or `.toSorted()`.
2. **Stable, Unique Keys (Never Index):**
   - Never use array index (`key={index}`) or position for dynamic or reorderable lists. Index keys cause React to preserve internal state on the wrong components when items are sorted or filtered. Always use unique, domain-level IDs (`key={product.id}`).
3. **Explicit Boolean Guards in JSX (The Zero Bug):**
   - Never write `count && <Component />` when `count` can be `0`. React renders `0` directly as text in the DOM. Always compare explicitly with `count > 0 && <Component />` or use a ternary.
4. **Zero Type Casts & Strict Non-Null Safety:**
   - No `any`, no `as`, and no `!` non-null assertion operators. Validate dynamic data at runtime with type guards (`isProductList`) rather than silencing the compiler.
5. **DOM Containment:**
   - Only `main.tsx` mounts to the DOM via `createRoot`. All other components use React's declarative JSX model and refs.
