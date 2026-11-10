# ShopBoard / Aethel Silicon

A React 19 storefront on Next.js 16 App Router. The hardware home, comparison bench,
rig configurator, persistent mixed cart, and validated demo checkout remain.
Hardware and benchmarks are fictional; Unique Items uses the real course API.

**Live site:** [Aethel Silicon](https://aethelsilicon.netlify.app/)

## Run and verify

Use Node.js 20.9 or newer.

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run format:check
npm run build
npm run start
```

Development normally uses http://localhost:3000. Stop development before starting production
on that port, or inspect the production build with `npm run start -- --port 3100`.
Vite and its React plugin are Vitest tooling, not the application framework.

## Netlify deployment

The deployed storefront runs on Netlify with the Next.js runtime. `netlify.toml`
sets `npm run build` as the build command, `.next` as the publish directory, and
enables `@netlify/plugin-nextjs`, which is declared in `devDependencies`.
This supports server-rendered product routes and the same-origin API handlers.

Server configuration such as `COURSE_API_URL`, `COURSE_API_MODE`, and optional
`HARDWARE_API_BASE_URL` belongs in Netlify environment variables; `.env.local` is
for local development. Leave `COURSE_API_MODE` unset for the normal course collection.

## Routes

| Route                         | Behavior                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| `/`                           | Hardware photography, flagship data, CPU/GPU switcher          |
| `/products`                   | Hardware tab: search, filters, sorting, grid/list              |
| `/products?collection=unique` | Course products: search, category, stock status                |
| `/products/[id]`              | Server-loaded detail: hardware slug or numeric course ID       |
| `/compare`                    | Persistent category-locked hardware comparison                 |
| `/configurator`               | CPU/GPU/package selection, diagnostics, parts or assembled rig |
| `/cart`                       | One cart for hardware, rigs, and course goods                  |
| `/checkout`                   | Validated delivery form and local demo receipt                 |
| Unknown page or product       | Next not-found view                                            |

Old `/catalog`, `/product/[id]`, `/unique-items`, and `/unique-items/[id]` URLs redirect
to canonical routes, retaining relevant query parameters. A direct Unique Items link remains.
Collection, search, category, sorting, and hardware filters live in the URL. Switching
collections preserves search and clears incompatible filters. Local filter edits use Next's
native-history integration to avoid a server request on every keystroke. Grid/list stays local.
Next Link handles links, and App Router handles route splitting.

## Structure and component tree

```text
src/
├── app/                 # Next routes, layouts, API handlers, boundaries, globals.css
├── components/
│   ├── layout/          # ApplicationLayout, Header, NavigationLink, Footer
│   ├── providers/       # AppProviders, route-scoped ProductCache
│   └── ui/              # Button, Input, Card, Badge, Modal, fields, theme/refresh controls
├── features/            # cart, catalog, checkout, compare, configurator, home,
│                        # not-found, product-detail, unique-items
├── lib/                 # apiClient.ts, utils.ts (cn), products/ server adapters
├── shared/
│   ├── async/           # client Suspense/error fallback infrastructure
│   ├── hooks/           # useHydrated, useTheme
│   ├── notifications/   # notification host and action facade
│   └── products/        # browser API adapters, SWR hooks, contracts, product utilities
└── test/                # unified behavior tests and Next navigation/SWR helpers
```

Shell composition may import features. Shared infrastructure, server helpers, and UI primitives
cannot import feature or route modules; ESLint enforces this direction. `schemas/` contains
validation, `data/` contains fixed datasets, and storage and pure cart operations stay separate.
Both agent documents contain the full component tree with props and unchanged original Rules.

```text
RootLayout (server)
└── AppProviders → SWRConfig → CartProvider → CompareProvider
    └── ApplicationLayout
        ├── Header → NavigationLink, ThemeToggle
        ├── Route content
        │   ├── Home → ProductCache → HomePage → HomeProducts
        │   │   └── HeroShowcase, ArchitectureStory, SiliconSpotlight
        │   ├── Products → CollectionTabs + ProductCache
        │   │   ├── CatalogPage → CatalogBrowser → filters, sort, ProductGrid → ProductCard
        │   │   └── UniqueItemsPage → UniqueItemsList → UniqueItemCard
        │   ├── Product detail → server adapter → ProductDetails / UniqueItemDetails
        │   ├── ComparePage → CompareTable, BenchmarkBarChart, CompareProductPicker
        │   │   └── ProductPickerModal → Modal
        │   ├── ConfiguratorPage → ConfiguratorWorkbench
        │   │   └── RigVisualizer, ComponentSlotSelector, PowerSynergyMeter
        │   ├── CartPage → CartItemRow / CourseCartItemRow, OrderSummary
        │   ├── CheckoutPage → CheckoutForm → Field, FieldLabel, Input, FieldError, Button
        │   └── NotFoundPage
        ├── Footer, CompareDock
        ├── QuickCartDrawer → Modal
        └── Notifications
```

## Server data and SWR

Server pages load the active collection and individual products before rendering; names are
present in server HTML. Numeric IDs select the course adapter, while existing hardware slugs
select hardware. Missing IDs call `notFound()`. Only the active collection is requested.

One HTTP client checks status, validates unknown JSON, forwards cancellation, and uses no-store
requests. Hardware defaults to the existing JSON inventory, imported into the server bundle so dynamic
routes work on serverless hosts where `public/` is served only from the CDN.
`HARDWARE_API_BASE_URL` optionally selects a compatible remote hardware API. Server pages never
fetch their own application endpoints.

Browser SWR uses `/api/products` and `/api/course-products`, each also exposing an ID endpoint.
Next route handlers call the same server adapters as pages. Course data maps once from `title`,
`category_name`, `price_cents`, and `in_stock` into the course contract. The API has no images,
so category icons are used; course goods receive no invented hardware specifications.

ProductCache supplies server data to SWR without an immediate duplicate request. SWR deduplicates
consumers and revalidates on focus, reconnect, or explicit refresh. Background failures retain
results with local retry feedback. Initial route failures use Next error boundaries and retry;
loading files show skeletons with navigation still usable. Independent home content and the
optional comparison picker retain scoped boundaries.

Copy `.env.example` to `.env.local`, choose a course mode, and restart the server:

```dotenv
COURSE_API_URL=https://shopboard-api.vercel.app
COURSE_API_MODE=delay/3000
```

Visit `/products?collection=unique`. Modes `delay/3000`, `fail/500`, and `empty` use the real
server's `/delay/3000/api/products`, `/fail/500/api/products`, and `/empty/api/products`.
Leave the mode empty for normal data. Hardware remains usable when the course source fails.

## State and checkout

Context owns cart and comparison state; its small action surface does not need another store.
SWR owns fetched client data. IDs, URL filters, totals, discounts, counts, and power estimates
are derived rather than mirrored in state. Quantity, form values, dialogs, tabs, and receipt
remain local to their owners.

Storage keys `aethel-cart` and `aethel-compare`, existing item shapes, and legacy price migration
are retained. `useHydrated` supplies matching server/client snapshots; persistence cannot write
the server's empty cart over saved items. The `restored` flag gates cart-dependent UI/actions.
Line prices derive from the product or rig quote; there is no duplicate `unitPrice`. Course cart
IDs are namespaced and sold-out goods cannot be added. Promo `SILICON10` is session state;
refresh preserves items but requires reapplying the promo.

Unbundling retains CPU, GPU, package selections, and quantities, merges existing lines, and
removes the assembly charge. Legacy rigs without package metadata remain usable but must be
rebuilt before unbundling.

Checkout uses one Zod schema with React Hook Form Controllers, labeled shadcn-derived controls,
clear errors, autocomplete, first-error focus, and pending protection. Failed submission retains
values. Successful local demo checkout clears the cart and shows a receipt. No payment/order
is sent to a server, and delivery details are not persisted.

## Tailwind and shared UI

`globals.css` is the only application stylesheet. Tailwind 4 uses PostCSS and semantic tokens
for colors, radii, fonts, shadows, and named animations. Components use scale utilities; measured
progress percentages remain inline values. The existing crimson aesthetic and assets remain.
Dark is the default; saved light/dark preference is applied before paint, and notifications
follow the selected theme. Motion respects reduced-motion preferences.

The local UI kit adapts actual shadcn registry source, configured in `components.json`:
Button (primary/secondary/ghost, sm/md/lg), Input, Card, Badge, Modal, and form fields.
`cva` owns Button, Badge, Card, Modal, and feature selection variants; `cn` merges
conditional utilities and overrides. Card surface/padding variants are reused across
feature panels. NativeSelect shares Input control styles, and error retries use Button. Domain features supply
content/actions rather than teaching shared primitives about carts or comparisons.

Enabled pointer-pressed buttons scale to 0.96 over 150ms; `static` opts out, and
keyboard and reduced-motion interactions do not scale. Product-family photos stay
mounted for interruptible 150ms pointer crossfades; keyboard switches are immediate.
Theme swaps suppress transitions until the new palette is painted. Editorial photos
share a subtle inset outline, and card movement respects reduced-motion preferences.
The home hero pairs copy and a naturally proportioned photograph without letterboxing.
Supporting media uses viewport-aware height limits to stay in context with its copy. Feature sections use two columns from tablet widths;
body copy uses a readable 16px size, and catalog photography has compact fixed heights.
Unique Items uses compact category symbols and clear stock/price/action groups. The
configurator pairs a sticky desktop preview with compact part selectors; its diagnostics
remain below both columns. On smaller screens, the build summary collapses behind
an accessible toggle so part choices come first. A shared vector BrandLockup supplies
the header/footer identity, with a matching favicon.

Modal review decisions:

- Native `dialog.showModal()` supplies modal semantics and background inertness. A scoped
  Tab edge guard wraps focus within the dialog instead of moving it into browser chrome.
- `useId` associates its title; an explicit close label identifies the close control.
- Escape uses cancel. Backdrop detection checks pointer position so clicking padding does not
  dismiss the dialog. Cleanup restores focus and the previous scroll setting.
- The picker and drawer share this Modal, removing duplicate trapping/listener code. Placement
  and sizes are typed variants; feature modules own contents and actions.

UI conventions are in both agent documents, outside their protected Rules sections. Next's
automatic agent-file editing is disabled to preserve those sections. Full upstream Vercel
skills remain under `.claude/skills/`.

## Verification

The unified Vitest suite covers both data contracts, stock protection, mixed-cart persistence,
legacy migration, filters/history, home retry, comparisons, configurator/unbundling, and checkout
validation/focus/pending/failure/success. Migration tests cover server cache hydration without
duplicate requests, SWR deduplication and refresh recovery, server route handlers, missing IDs,
saved-cart hydration, native Modal focus, and theme persistence. Next navigation is mocked only
at test boundaries; local browser and production-server checks verify real App Router behavior.
