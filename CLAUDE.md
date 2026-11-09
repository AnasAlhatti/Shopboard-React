# ShopBoard

[AGENTS.md](AGENTS.md) is canonical for stack, folder ownership, naming, commands,
and data/state boundaries. This is React 19 with Next.js 16 App Router, SWR and
Tailwind 4. Vite is retained only for tests. Project skills live in `.claude/skills/`.

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
- `Card`: native div props and `as?: ElementType` for semantic surfaces.
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
