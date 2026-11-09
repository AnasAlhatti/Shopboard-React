# ShopBoard / Aethel Silicon

React hardware storefront with an editorial home, catalog, product details, comparisons, rig builder, persistent cart, and validated demo checkout. Hardware and benchmarks are fictional. A separate **Unique Items** collection uses the real course API alongside the existing hardware range.

## Run and verify

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

Stack: React 19, strict TypeScript, React Router 7, Vite, TanStack Query, React Context, React Hook Form, Zod, shadcn/ui, Sonner, Vitest, and Testing Library. Checkout uses official shadcn registry components generated with its CLI, configured in `components.json`. Their Tailwind v4 utilities use a `tw:` prefix and existing design tokens, without a global Tailwind reset. Field components are split into individual files to follow project conventions.

## Routes

Pages load on demand inside one shared layout.

| Route               | Page                 | Behavior                                                    |
| ------------------- | -------------------- | ----------------------------------------------------------- |
| `/`                 | HomePage             | Photography, catalog specifications, CPU/GPU tabs           |
| `/catalog`          | CatalogPage          | Search, spec/category filters, sorting, grid/list           |
| `/product/:id`      | ProductDetailPage    | Requests one product by ID                                  |
| `/unique-items`     | UniqueItemsPage      | Real course products, category/search filters, stock status |
| `/unique-items/:id` | UniqueItemDetailPage | Requests one course product by ID                           |
| `/compare`          | ComparePage          | Persistent, category-locked comparisons                     |
| `/configurator`     | ConfiguratorPage     | Rig selection and power estimates                           |
| `/cart`             | CartPage             | Quantities, removal, rigs, promo, checkout link             |
| `/checkout`         | CheckoutPage         | Validated delivery form and demo receipt                    |
| `*`                 | NotFoundPage         | 404 and return navigation                                   |

Filters are owned by URL parameters: `category`, `search`, `sort`, `maxPrice`, `maxTdp`, `minCores`, `minVram`. Shared links and refresh restore them; grid/list display stays local.

## Component tree

```text
StrictMode
+ App
  + BrowserRouter
    + QueryClientProvider
      + CartProvider
        + CompareProvider
          + ApplicationLayout
            + Header
            + Outlet -> lazy import + retry boundary -> selected page
            | + HomePage
            | | + data boundary -> HomeProducts
            | | | + HeroShowcase, ArchitectureStory, SiliconSpotlight
            | | + Builder section
            | + CatalogPage -> data boundary -> CatalogBrowser
            | | + FilterSidebar, SortBar, ProductGrid -> ProductCard
            | + ProductDetailPage -> data boundary -> ProductDetails
            | | + ProductGallery, ArchitectureSpecTable, MiniBenchmarkCard
            | + UniqueItemsPage -> data boundary -> UniqueItemsList
            | | + UniqueItemCard -> UniqueItemSymbol
            | + UniqueItemDetailPage -> data boundary -> UniqueItemDetails
            | | + UniqueItemSymbol
            | + ComparePage
            | | + CompareTable, BenchmarkBarChart
            | | + data boundary -> CompareProductPicker (when opened)
            | + ConfiguratorPage -> data boundary -> ConfiguratorWorkbench
            | | + RigVisualizer, ComponentSlotSelector, PowerSynergyMeter
            | + CartPage -> CartItemRow (hardware/rig or CourseCartItemRow) + OrderSummary
            | + CheckoutPage -> CheckoutForm + order summary
            | + NotFoundPage
            + Footer
            + CompareDock
            + QuickCartDrawer
            + Notifications
```

## Structure and state

```text
src/app/layout/          ApplicationLayout, Header, Footer (compose features)
src/app/routing/         createLazyPage factory
src/features/           cart, catalog, checkout, compare, configurator,
                        home, not-found, product-detail, unique-items
src/shared/api/         validated HTTP client and query cache
src/shared/async/       Suspense and retryable error UI
src/shared/notifications/ Notifications host and notify facade
src/shared/products/    api/, hooks/, types/ for both product sources
src/shared/ui/          official shadcn primitives
src/shared/styles/      design tokens and isolated Tailwind theme
src/shared/utils/       class merging
src/test/               app.test.tsx, setup.ts
```

Feature-exclusive components stay in their features: CompareDock belongs to compare; QuickCartDrawer belongs to cart. Shared modules never import features or app composition; ESLint enforces this direction. `schemas/` holds validation contracts, `data/` holds fixed datasets, and `services/` is for feature-exclusive external operations. Cross-feature product requests live in `shared/products/`.

`AGENTS.md` is canonical project guidance; both agent documents include the component tree with props. Full upstream Vercel React/composition skills and the project code-simplifier skill live in `.claude/skills/`, where Claude Code discovers them. `skills-lock.json` records upstream skill sources.

Cart Context owns items and the session promo. Context fits this small app and exposes explicit actions without another client-state library. Items initialize from localStorage key `aethel-cart`; one effect synchronizes changes. Counts/totals are derived. Promo `SILICON10` gives 10% off across cart and checkout; refresh preserves items but the promo needs reapplying.

The provider delegates persistence/validation to `cart/storage/cartStorage.ts` and pure cart operations to `cart/utils/cartOperations.ts`. Hardware and course goods share one cart; their IDs are namespaced to avoid collisions. Line prices derive from `product.price` or the rig quote, with no duplicate `unitPrice`. Loading older carts drops that obsolete field. Course prices are converted from cents once at the API boundary; sold-out course goods cannot be added.

Rigs save the selected memory/storage product alongside the CPU and GPU. Unbundling keeps all three selections and merges their quantities with matching cart items; the chassis/assembly charge is removed, matching the individual-components option. Older saved rigs without package metadata remain usable in the cart, but must be rebuilt in the configurator before unbundling so their package is never silently lost. Memory/storage packages show their specifications directly in the cart because they have no standalone catalog API endpoint.

Comparison Context owns/persists selected products. TanStack Query owns server data; pages do not mirror it in state. Configurator selections store IDs and derive active objects. Form fields, quantity, dialogs, tabs, and receipt stay local.

Effects synchronize storage and quick-cart focus/keyboard integration. Listeners are removed on cleanup. Query functions forward the cache's AbortSignal; shared requests can complete for later consumers. There are no loading timers or effects for calculated values.

The comparison picker uses a native modal dialog for keyboard navigation and Escape dismissal, with focus returned to its trigger. Its effect synchronizes the dialog and background scroll lock with React's open state. Narrow-screen controls wrap instead of overflowing; touch devices receive 16px text inputs and hover effects are restricted to mouse-like pointers. Real-phone testing is still needed for software keyboards, safe areas, and touch behavior.

## API and deployment

The two product sources are intentionally separate so the class collection does not replace hardware-specific features.

**Course collection:** `https://shopboard-api.vercel.app/api/products` returns `{ items, total }`; `/api/products/:id` returns one record. The adapter validates `id`, `title`, `category_name`, `price_cents`, and `in_stock`, then maps these into the course product contract. No invented CPU/GPU specifications are attached to course goods. The API supplies no product images, so the section uses category icons.

Copy `.env.example` to `.env.local` and restart Vite for each self-check:

```dotenv
VITE_COURSE_API_URL=https://shopboard-api.vercel.app
VITE_COURSE_API_MODE=delay/3000
```

Visit `/unique-items`. Modes `delay/3000`, `fail/500`, and `empty` select the course server's real `/delay/3000/api/products`, `/fail/500/api/products`, and `/empty/api/products` endpoints. Leave the mode empty for normal browsing. Failure shows one inline retry fallback; it does not duplicate the error in a toast. The navigation and hardware pages remain usable during these checks.

**Hardware source:**

`GET /api/products` returns the list; `GET /api/products/:id` returns one product or HTTP 404. The shared client checks HTTP status and validates unknown JSON. Missing products get an empty view; other failures reach a retry boundary.

`server/productApi.ts` supplies development and preview endpoints from `public/data/products.json`. Static `dist/` hosting alone does **not** include the API. Production hosting must serve this contract, or set `VITE_API_BASE_URL` to a compatible API base URL before building. Configure SPA fallback to `index.html` for direct route visits. Client environment variables are public; keep secrets server-side.

## Async UI and checkout

Page imports and queries use Suspense fallbacks and retryable Error Boundaries. Independent home builder content stays usable if product data is slow/broken. The shell remains outside page boundaries. Persisted comparisons work if their optional picker fails. Empty catalog, no matches, missing product, incomplete configurator inventory, empty cart, and 404 have specific views.

Checkout uses one Zod schema, Controller fields, associated labels/errors, autocomplete, first-error focus, validation on submit, and disabled pending controls. Failures preserve values. Empty carts cannot submit; successful **local demo** checkout clears the cart and shows a receipt. No payment is collected, order sent to a server, or delivery details stored.

Tests cover both API contracts and product-by-ID requests, stock protection, mixed-cart persistence and legacy-price migration, course filters/empty/retry states, catalog filters, hardware details, home loading/retry, comparisons, configurator actions, form validation/focus/pending/failure/success, cross-route cart behavior, import retry, and 404.

## Personal lesson submission

Day 5 asks for `answers.md`, written without AI: where the cart lives and why; one retained effect and why; and what re-renders on Add to cart. Write these yourself after walking through the code. They are intentionally not generated here.
