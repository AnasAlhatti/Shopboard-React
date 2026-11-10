# ShopBoard

## Stack

React 19, strict TypeScript, Next.js 16 App Router, SWR, Tailwind CSS 4, Lucide,
React Context, React Hook Form, Zod, local shadcn-derived UI primitives, and Sonner.
Vitest, React Testing Library, and jsdom cover browser-independent behavior.
Vite and its React plugin are test tooling only. ESLint, Prettier, Husky, and lint-staged remain.

## Folder ownership

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

Keep route entry points thin. Feature-exclusive components, contexts, hooks, storage,
schemas, data, and utilities stay in the relevant feature. `schemas/` holds validation;
`data/` holds fixed datasets. Shared product contracts and browser loading live in
`shared/products/`; server product adapters live in `lib/products/`. Only server modules
may read files or server API environment variables. Shared infrastructure and UI primitives
must not import features or app route modules; ESLint enforces this direction.

Register routes through Next folders and link with `next/link`. Server pages fetch initial
data; client hooks use SWR with that initial cache. Use native history updates for local
URL filters, and Next navigation for collection/page changes. App Router owns route splitting.

## Naming

React components and Props interfaces use PascalCase. Next route filenames follow framework
conventions (`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`).
Hooks use `use` plus camelCase; other TypeScript modules use lower camelCase.
Assets use descriptive lowercase kebab-case. `globals.css` is the sole stylesheet.

## Commands

- `npm run dev`: Next development server, normally http://localhost:3000.
- `npm run build`: production compilation and type checks.
- `npm run start`: serve an existing production build.
- `npm run typecheck`: generate Next route types, then check TypeScript.
- `npm run lint`, `npm test`, `npm run format:check`: quality checks.

## State and data boundaries

Cart and comparison Context providers are mounted once in AppProviders. Cart items and promo
have one owner; quantities, totals, discounts, filtered products, and selected hardware are derived.
SWR owns client product data. Initial data is loaded on the server and supplied through ProductCache;
client revalidation must not duplicate the initial request. Fetch only the active collection.
Storage uses the existing `aethel-cart` and `aethel-compare` keys. `useHydrated` supplies matching
server/client snapshots; do not write browser storage before restoration. Never access browser
APIs at server module scope. Use server-only guards for server adapters.

Apply `.claude/skills/vercel-composition-patterns/` for component interfaces and
`.claude/skills/vercel-react-best-practices/` for React/Next rendering and data loading.

## UI conventions

Use Tailwind utilities and semantic tokens from `src/app/globals.css`; this is the only
application stylesheet. Colors, radii, fonts, shadows, and named animations belong in
the theme. Use the spacing scale; dynamic measured percentages may use inline styles.
Use `cn()` for conditional utilities and overrides; use `cva` for component variants.
UI primitives have typed props and stay independent of cart, comparison, and other features.
Reuse Button, Input, Card, Badge, and Modal rather than copying their base style strings.
Keep visible keyboard focus, associated labels, mobile-first breakpoints, and reduced-motion support.
Use the native-dialog Modal for modal interactions: it owns Escape handling, contained
focus, focus restoration, and scroll locking. Feature modules own its contents and actions.

## Component tree with props

```text
RootLayout { children: ReactNode } [server]
└── AppProviders { children: ReactNode } [client]
    └── SWRConfig → CartProvider { children } → CompareProvider { children }
        └── ApplicationLayout { children: ReactNode }
            ├── Suspense → Header { onOpenCart: () => void }
            │   ├── NavigationLink { Link props; className?: string | active callback; end?: boolean }
            │   └── ThemeToggle {}
            ├── Route content (server pages, nested loading/error/not-found boundaries)
            │   ├── / → ProductCache { fallback: Record<string, unknown>; children }
            │   │   └── HomePage {} → AsyncBoundary → HomeProducts {}
            │   │       ├── HeroShowcase { cpu?: Product; gpu?: Product; loading: boolean }
            │   │       ├── ArchitectureStory { cpu?: Product }
            │   │       └── SiliconSpotlight { cpu?: Product; gpu?: Product; loading?: boolean }
            │   ├── /products → CollectionTabs {} + ProductCache → selected collection
            │   │   ├── CatalogPage {} → AsyncBoundary → CatalogBrowser {}
            │   │   │   ├── FilterSidebar { searchQuery; onSearchChange; selectedCategory;
            │   │   │   │   onCategoryChange; maxPrice; onMaxPriceChange; maxTdp;
            │   │   │   │   onMaxTdpChange; minCores; onMinCoresChange; minVram;
            │   │   │   │   onMinVramChange; onReset; totalCount; filteredCount }
            │   │   │   ├── RefreshNotice { error: unknown; onRefresh: () => Promise<unknown> }
            │   │   │   ├── SortBar { sortOption; onSortChange; viewMode; onViewModeChange; itemCount }
            │   │   │   └── ProductGrid { products: Product[]; viewMode: 'grid' | 'list'; totalCount? }
            │   │   │       └── ProductCard { product: Product; layout?: 'grid' | 'list' }
            │   │   └── UniqueItemsPage {} → AsyncBoundary → UniqueItemsList {}
            │   │       ├── RefreshNotice { error; onRefresh }
            │   │       └── UniqueItemCard { product: CourseProduct }
            │   │           └── UniqueItemSymbol { category: string }
            │   ├── /products/[id] → server fetch and notFound() if missing
            │   │   ├── ProductDetails { product: Product | null }
            │   │   │   ├── ProductGallery { product: Product }
            │   │   │   ├── ArchitectureSpecTable { product: Product }
            │   │   │   └── MiniBenchmarkCard { product: Product }
            │   │   └── UniqueItemDetails { product: CourseProduct | null }
            │   │       └── UniqueItemSymbol { category: string }
            │   ├── /compare → ComparePage {}
            │   │   ├── CompareTable { items: Product[]; onRemove; onOpenPicker; highlightWinners? }
            │   │   ├── BenchmarkBarChart { items: Product[] }
            │   │   └── AsyncBoundary → CompareProductPicker { onClose: () => void }
            │   │       └── ProductPickerModal { isOpen; onClose; availableProducts: Product[];
            │   │           onSelect: (product: Product) => void; category: 'cpu' | 'gpu'; children?: ReactNode }
            │   │           └── Modal { open; onClose; title; size: 'lg'; children }
            │   ├── /configurator → ProductCache → ConfiguratorPage {} → AsyncBoundary
            │   │   └── ConfiguratorWorkbench {}
            │   │       ├── RigVisualizer { selectedCpu; selectedGpu; selectedRamTier; totalTdp; totalPrice }
            │   │       ├── ComponentSlotSelector { cpus; gpus; selectedCpu; onSelectCpu;
            │   │       │   selectedGpu; onSelectGpu; selectedTier; onSelectTier }
            │   │       └── PowerSynergyMeter { totalTdp; recommendedPsu; diagnosis;
            │   │           totalPrice; onAddAssembledRig; onAddIndividualComponents }
            │   ├── /cart → CartPage {}
            │   │   ├── CartItemRow { item: CartItem; onUpdateQuantity; onRemove; onUnbundle }
            │   │   │   └── CourseCartItemRow { id; product: CourseProduct; quantity;
            │   │   │       onUpdateQuantity: (id: string, quantity: number) => void; onRemove }
            │   │   └── OrderSummary { subtotal; discountAmount; appliedPromo;
            │   │       onApplyPromo: (code: string) => boolean; onClearCart }
            │   ├── /checkout → CheckoutPage {}
            │   │   └── CheckoutForm { onSubmit: (values: CheckoutValues) => Promise<void>; disabled }
            │   │       └── Controller → Field → FieldLabel + Input + FieldError; Button
            │   └── not-found → NotFoundPage {}
            ├── Footer {}
            ├── CompareDock {}
            ├── QuickCartDrawer { isOpen: boolean; onClose: () => void }
            │   └── Modal { open; onClose; title; placement: 'drawer'; children }
            └── Notifications {} → Toaster { theme: 'dark' | 'light'; richColors; closeButton }
```

Callback props beginning with `on` are actions; numeric totals and filtered lists are derived.
`Product` is the hardware contract; `CourseProduct` is the course API contract;
`CartProduct = Product | CourseProduct`. Optional and native control props are defined in each typed Props interface.

Shared UI contracts:

- `Button`: native button props, `variant?: 'primary' | 'secondary' | 'ghost'`,
  `size?: 'sm' | 'md' | 'lg'`, `asChild?: boolean`.
- `Input`: native input props, including React 19 `ref`.
- `NativeSelect`: native select props; shares the Input control styles and keeps native keyboard behavior.
- `Card`: native div props, `as?: ElementType`, `variant?: 'elevated' | 'flat' | 'inset'`, and `padding?: 'none' | 'sm' | 'md' | 'lg'`.
- `Badge`: native span props and `variant?: 'neutral' | 'available' | 'unavailable'`.
- `Modal`: `open: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode`,
  optional `size: 'sm' | 'md' | 'lg'`, `placement: 'center' | 'drawer'`, `className`, `closeLabel`.
- `Field`: native div props and optional vertical/horizontal/responsive orientation.
  `FieldLabel` uses Radix label props; `FieldError` accepts native div props and optional errors.
- `AsyncBoundary`: children, optional fallback, onReset, and errorFallback.
  `LoadingState` accepts an optional label; `LoadError` consumes FallbackProps.

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
11. Don’t change *.types / *.api / *.logic / *.state
12. One component per file. A typed Props interface each.
13. Never change props. New arrays and objects only.
14. key from the data, never the index
15. Left of && is always a boolean
16. Shared data lives in App. Events go up as on…
17. Use the vercel-composition-patterns skill for the props and vercel-react-best-practices for rendering.
18. If you need to update AGENTS.md or CLAUDE.md never touch the rules update anything else as needed.
