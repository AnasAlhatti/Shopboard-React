# ShopBoard / Aethel Silicon

React hardware storefront with an editorial home, catalog, product details, comparisons, rig builder, persistent cart, and validated demo checkout. Products and benchmarks are fictional.

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

Stack: React 19, strict TypeScript, React Router 7, Vite, TanStack Query, React Context, React Hook Form, Zod, shadcn/ui primitives, Sonner, Vitest, and Testing Library. Local UI primitives adapt the shadcn Field/Controller pattern to the existing CSS tokens.

## Routes

Pages load on demand inside one shared layout.

| Route           | Page              | Behavior                                          |
| --------------- | ----------------- | ------------------------------------------------- |
| `/`             | HomePage          | Photography, catalog specifications, CPU/GPU tabs |
| `/catalog`      | CatalogPage       | Search, spec/category filters, sorting, grid/list |
| `/product/:id`  | ProductDetailPage | Requests one product by ID                        |
| `/compare`      | ComparePage       | Persistent, category-locked comparisons           |
| `/configurator` | ConfiguratorPage  | Rig selection and power estimates                 |
| `/cart`         | CartPage          | Quantities, removal, rigs, promo, checkout link   |
| `/checkout`     | CheckoutPage      | Validated delivery form and demo receipt          |
| `*`             | NotFoundPage      | 404 and return navigation                         |

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
            | + ComparePage
            | | + CompareTable, BenchmarkBarChart
            | | + data boundary -> CompareProductPicker (when opened)
            | + ConfiguratorPage -> data boundary -> ConfiguratorWorkbench
            | | + RigVisualizer, ComponentSlotSelector, PowerSynergyMeter
            | + CartPage -> CartItemRow + OrderSummary
            | + CheckoutPage -> CheckoutForm + order summary
            | + NotFoundPage
            + Footer
            + CompareDock
            + QuickCartDrawer
            + Notifications
```

## Structure and state

`src/features/<feature>/` holds each route page, CSS, and exclusive components, hooks, services, types, data, and utilities. `src/shared/` holds the API client/query cache, shared product type, layout/UI components, notifications, utilities, and tokens. `src/test/app.test.tsx` is the unified test suite. `skills/` contains the instruction skills required by Day 4; `AGENTS.md` is canonical project guidance.

Cart Context owns items and the session promo. Context fits this small app and exposes explicit actions without another client-state library. Items initialize from localStorage key `aethel-cart`; one effect synchronizes changes. Counts/totals are derived. Promo `SILICON10` gives 10% off across cart and checkout; refresh preserves items but the promo needs reapplying.

Rigs save the selected memory/storage product alongside the CPU and GPU. Unbundling keeps all three selections and merges their quantities with matching cart items; the chassis/assembly charge is removed, matching the individual-components option. Older saved rigs without package metadata remain usable in the cart, but must be rebuilt in the configurator before unbundling so their package is never silently lost. Memory/storage packages show their specifications directly in the cart because they have no standalone catalog API endpoint.

Comparison Context owns/persists selected products. TanStack Query owns server data; pages do not mirror it in state. Configurator selections store IDs and derive active objects. Form fields, quantity, dialogs, tabs, and receipt stay local.

Effects synchronize storage and quick-cart focus/keyboard integration. Listeners are removed on cleanup. Query functions forward the cache's AbortSignal; shared requests can complete for later consumers. There are no loading timers or effects for calculated values.

The comparison picker uses a native modal dialog for keyboard navigation and Escape dismissal, with focus returned to its trigger. Its effect synchronizes the dialog and background scroll lock with React's open state. Narrow-screen controls wrap instead of overflowing; touch devices receive 16px text inputs and hover effects are restricted to mouse-like pointers. Real-phone testing is still needed for software keyboards, safe areas, and touch behavior.

## API and deployment

`GET /api/products` returns the list; `GET /api/products/:id` returns one product or HTTP 404. The shared client checks HTTP status and validates unknown JSON. Missing products get an empty view; other failures reach a retry boundary.

`server/productApi.ts` supplies development and preview endpoints from `public/data/products.json`. Static `dist/` hosting alone does **not** include the API. Production hosting must serve this contract, or set `VITE_API_BASE_URL` to a compatible API base URL before building. Configure SPA fallback to `index.html` for direct route visits. Client environment variables are public; keep secrets server-side.

## Async UI and checkout

Page imports and queries use Suspense fallbacks and retryable Error Boundaries. Independent home builder content stays usable if product data is slow/broken. The shell remains outside page boundaries. Persisted comparisons work if their optional picker fails. Empty catalog, no matches, missing product, incomplete configurator inventory, empty cart, and 404 have specific views.

Checkout uses one Zod schema, Controller fields, associated labels/errors, autocomplete, first-error focus, validation on submit, and disabled pending controls. Failures preserve values. Empty carts cannot submit; successful **local demo** checkout clears the cart and shows a receipt. No payment is collected, order sent to a server, or delivery details stored.

Tests cover API failures/validation, shared state and persistence, catalog filters, details, home loading/retry, comparisons, configurator actions, form validation/focus/pending/failure/success, cross-route cart behavior, import retry, and 404.

## Personal lesson submission

Day 5 asks for `answers.md`, written without AI: where the cart lives and why; one retained effect and why; and what re-renders on Add to cart. Write these yourself after walking through the code. They are intentionally not generated here.
