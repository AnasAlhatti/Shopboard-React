# ShopBoard

## Stack

- **Core:** React 19, TypeScript (`strict: true`), Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Semantic HTML, Mobile-first CSS, zero `!important`, design tokens (`src/shared/styles/design-tokens.css`)
- **Quality & Git Hooks:** ESLint, Prettier, Husky, lint-staged
- **Testing:** Vitest, React Testing Library (`@testing-library/react`), jsdom

## Folder Structure & Where a New Feature Goes

```text
src/
├── app/
│   ├── layout/                # ApplicationLayout, Header, Footer
│   └── routing/               # createLazyPage factory
├── features/
│   ├── cart/                  # components/, context/, hooks/, storage/, types/, utils/
│   ├── catalog/               # components/, utils/, CatalogPage, catalog.css
│   ├── checkout/              # components/, schemas/, CheckoutPage, checkout.css
│   ├── compare/               # components/, context/, hooks/, types/
│   ├── configurator/          # components/, data/, utils/
│   ├── home/                  # components/, data/, HomePage, home.css
│   ├── not-found/             # NotFoundPage
│   ├── product-detail/        # components/, ProductDetailPage, product-detail.css
│   └── unique-items/          # course collection/detail pages, components/, unique-items.css
├── shared/
│   ├── api/                   # apiClient, queryClient
│   ├── async/                 # AsyncBoundary, LoadError, LoadingState
│   ├── notifications/         # Notifications host, notify action facade
│   ├── products/              # api/, hooks/, types/ for hardware and course products
│   ├── styles/                # design-tokens.css, isolated shadcn.css
│   ├── ui/                    # official shadcn Button, Field, FieldLabel, FieldError, Input, Label
│   └── utils/                 # cn
├── test/                      # unified app.test.tsx and setup.ts
├── App.tsx                    # shared providers and lazy routes
├── main.tsx                   # DOM entry point
└── index.css                  # shared styles and reset
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
   - Place feature-exclusive services in `services/`, validation schemas in `schemas/`, and fixed datasets in `data/`. Cross-feature product loading belongs in `src/shared/products/`, using `getJson` from `src/shared/api/apiClient`.
2. **Shared Infrastructure (`src/shared/`):**
   - Only place code in `src/shared/` if it is genuinely shared across multiple features (e.g. `apiClient`, shared `Product` type, global shell components).
3. **Routing & Navigation:**
   - Register the route in `src/App.tsx`.
   - Add navigation links or trigger buttons in `src/app/layout/Header.tsx` or feature cards.
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

## Component Tree with Props

This describes the current implementation. Shell composition lives in app/layout;
feature-owned drawers and docks stay inside their features.
`{}` means no public props; `?` means optional. Native HTML, icon components,
and third-party implementation internals are omitted. Types refer to the
existing TypeScript contracts.

```text
StrictMode { children: ReactNode }
└── App {}
    └── BrowserRouter { children: ReactNode }
        └── QueryClientProvider { client: QueryClient; children: ReactNode }
            └── CartProvider { children: ReactNode }
                └── CompareProvider { children: ReactNode }
                    └── Routes / shared layout route
                        └── ApplicationLayout {}
                            ├── Header { onOpenCart: () => void }
                            ├── Outlet {}
                            │   └── LazyPage {} (one wrapper per route)
                            │       └── AsyncBoundary { children; onReset: retryImport }
                            │           └── PageContent {}
                            │               └── One lazy route page:
                            │                   ├── HomePage {} [/]
                            │                   │   ├── AsyncBoundary { children; fallback; errorFallback }
                            │                   │   │   └── HomeProducts {}
                            │                   │   │       ├── HeroShowcase {
                            │                   │   │       │     cpu?: Product; gpu?: Product;
                            │                   │   │       │     loading: boolean
                            │                   │   │       │   }
                            │                   │   │       ├── ArchitectureStory { cpu?: Product }
                            │                   │   │       └── SiliconSpotlight {
                            │                   │   │             cpu?: Product; gpu?: Product;
                            │                   │   │             loading?: boolean
                            │                   │   │           }
                            │                   │   └── Builder section (inline HTML and Link)
                            │                   ├── CatalogPage {} [/catalog]
                            │                   │   └── AsyncBoundary { children; fallback }
                            │                   │       └── CatalogBrowser {}
                            │                   │           ├── FilterSidebar {
                            │                   │           │     searchQuery: string;
                            │                   │           │     onSearchChange: (value: string) => void;
                            │                   │           │     selectedCategory: 'all' | 'cpu' | 'gpu';
                            │                   │           │     onCategoryChange: (category: 'all' | 'cpu' | 'gpu') => void;
                            │                   │           │     maxPrice: number;
                            │                   │           │     onMaxPriceChange: (value: number) => void;
                            │                   │           │     maxTdp: number;
                            │                   │           │     onMaxTdpChange: (value: number) => void;
                            │                   │           │     minCores: number;
                            │                   │           │     onMinCoresChange: (value: number) => void;
                            │                   │           │     minVram: number;
                            │                   │           │     onMinVramChange: (value: number) => void;
                            │                   │           │     onReset: () => void;
                            │                   │           │     totalCount: number; filteredCount: number
                            │                   │           │   }
                            │                   │           └── Available products section
                            │                   │               ├── SortBar {
                            │                   │               │     sortOption: SortOption;
                            │                   │               │     onSortChange: (sort: SortOption) => void;
                            │                   │               │     viewMode: 'grid' | 'list';
                            │                   │               │     onViewModeChange: (mode: 'grid' | 'list') => void;
                            │                   │               │     itemCount: number
                            │                   │               │   }
                            │                   │               └── ProductGrid {
                            │                   │                     products: Product[];
                            │                   │                     viewMode: 'grid' | 'list';
                            │                   │                     totalCount?: number
                            │                   │                   }
                            │                   │                   └── ProductCard { product: Product } (one per product)
                            │                   ├── ProductDetailPage {} [/product/:id]
                            │                   │   └── AsyncBoundary { children; fallback } (keyed by route id)
                            │                   │       └── ProductDetails { id: string }
                            │                   │           ├── ProductGallery { product: Product }
                            │                   │           ├── ArchitectureSpecTable { product: Product }
                            │                   │           └── MiniBenchmarkCard { product: Product }
                            │                   ├── ComparePage {} [/compare]
                            │                   │   ├── CompareTable {
                            │                   │   │     items: Product[];
                            │                   │   │     onRemove: (id: string) => void;
                            │                   │   │     onOpenPicker: () => void;
                            │                   │   │     highlightWinners?: boolean
                            │                   │   │   }
                            │                   │   ├── BenchmarkBarChart { items: Product[] }
                            │                   │   └── AsyncBoundary { children } (when picker is open)
                            │                   │       └── CompareProductPicker { onClose: () => void }
                            │                   │           └── ProductPickerModal {
                            │                   │                 isOpen: boolean; onClose: () => void;
                            │                   │                 availableProducts: Product[];
                            │                   │                 onSelect: (product: Product) => void;
                            │                   │                 category: 'cpu' | 'gpu'
                            │                   │               }
                            │                   ├── ConfiguratorPage {} [/configurator]
                            │                   │   └── AsyncBoundary { children; fallback }
                            │                   │       └── ConfiguratorWorkbench {}
                            │                   │           ├── RigVisualizer {
                            │                   │           │     selectedCpu: Product | null;
                            │                   │           │     selectedGpu: Product | null;
                            │                   │           │     selectedRamTier: string;
                            │                   │           │     totalTdp: number; totalPrice: number
                            │                   │           │   }
                            │                   │           ├── ComponentSlotSelector {
                            │                   │           │     cpus: Product[]; gpus: Product[];
                            │                   │           │     selectedCpu: Product | null;
                            │                   │           │     onSelectCpu: (cpu: Product) => void;
                            │                   │           │     selectedGpu: Product | null;
                            │                   │           │     onSelectGpu: (gpu: Product) => void;
                            │                   │           │     selectedTier: MemoryStorageTier;
                            │                   │           │     onSelectTier: (tier: MemoryStorageTier) => void
                            │                   │           │   }
                            │                   │           └── PowerSynergyMeter {
                            │                   │                 totalTdp: number; recommendedPsu: number;
                            │                   │                 diagnosis: BottleneckDiagnosis;
                            │                   │                 totalPrice: number;
                            │                   │                 onAddAssembledRig: () => void;
                            │                   │                 onAddIndividualComponents: () => void
                            │                   │               }
                            │                   ├── UniqueItemsPage {} [/unique-items]
                            │                   │   └── AsyncBoundary { children; fallback }
                            │                   │       └── UniqueItemsList {}
                            │                   │           └── UniqueItemCard { product: CourseProduct }
                            │                   │               └── UniqueItemSymbol { category: string }
                            │                   ├── UniqueItemDetailPage {} [/unique-items/:id]
                            │                   │   └── AsyncBoundary { children; fallback } (keyed by id)
                            │                   │       └── UniqueItemDetails { id: string }
                            │                   │           └── UniqueItemSymbol { category: string }
                            │                   ├── CartPage {} [/cart]
                            │                   │   ├── CartItemRow {
                            │                   │   │     item: CartItem;
                            │                   │   │     onUpdateQuantity: (id: string, qty: number) => void;
                            │                   │   │     onRemove: (id: string) => void;
                            │                   │   │     onUnbundle: (id: string) => void
                            │                   │   │   } (one per cart item)
                            │                   │   └── OrderSummary {
                            │                   │         subtotal: number; discountAmount: number;
                            │                   │         appliedPromo: string | null;
                            │                   │         onApplyPromo: (code: string) => boolean;
                            │                   │         onClearCart: () => void
                            │                   │       }
                            │                   ├── CheckoutPage {} [/checkout]
                            │                   │   ├── CheckoutForm {
                            │                   │   │     onSubmit: (values: CheckoutValues) => Promise<void>;
                            │                   │   │     disabled: boolean
                            │                   │   │   }
                            │                   │   │   ├── Controller (one per schema field)
                            │                   │   │   │   └── Field { native div props; data-invalid: boolean }
                            │                   │   │   │       ├── FieldLabel { Radix Label.Root props }
                            │                   │   │   │       ├── Input { native input props }
                            │                   │   │   │       └── FieldError { native div props } (on field error)
                            │                   │   │   ├── FieldError { native div props } (on submission error)
                            │                   │   │   └── Button { native button props; variant?: default | destructive | outline | secondary | ghost | link; size?: ButtonProps["size"]; asChild?: boolean }
                            │                   │   └── Order summary / empty state / receipt (inline HTML)
                            │                   └── NotFoundPage {} [*]
                            ├── Footer {}
                            ├── CompareDock {}
                            ├── QuickCartDrawer { isOpen: boolean; onClose: () => void }
                            └── Notifications {}
                                └── Toaster {
                                      theme: 'dark'; richColors: true;
                                      closeButton: true; position: 'bottom-right'
                                    }
```

Shared async contracts used throughout the tree:

- `AsyncBoundary`: `children: ReactNode`, `fallback?: ReactNode`,
  `onReset?: () => void`, `errorFallback?: (props: FallbackProps) => ReactNode`.
  It renders QueryErrorResetBoundary, ErrorBoundary, and Suspense.
- `LoadingState`: `{ label?: string }`; used for page and data loading.
- `LoadError`: `FallbackProps` from react-error-boundary
  (`error` and `resetErrorBoundary` are consumed).
- Home loading/error fallbacks reuse HeroShowcase with LoadingState or LoadError.
  Other data sections use LoadingState and the default LoadError.
- `createLazyPage(load: () => Promise<{ default: ComponentType }>)` is a
  module-scope factory, not a component accepting a `load` prop. It returns
  the prop-free LazyPage wrapper shown above.

Course cart rows use CourseCartItemRow { id: string; product: CourseProduct;
quantity: number; onUpdateQuantity: (id: string, quantity: number) => void;
onRemove: (id: string) => void }. UniqueItemsList owns URL search/category;
UniqueItemDetails owns quantity. CartProduct is Product | CourseProduct.

State ownership: CartProvider owns cart items and promo; CompareProvider owns
comparison selection; QueryClient owns fetched product data. ApplicationLayout
owns quick-cart visibility; Header owns mobile-menu visibility. Catalog filters
belong to the URL, while view mode stays in CatalogBrowser. ProductDetails owns
quantity; SiliconSpotlight owns the active family; ComparePage owns picker and
highlight visibility. ConfiguratorWorkbench owns selected IDs; CheckoutForm
owns form state through React Hook Form; CheckoutPage owns the demo receipt.
Components receive context actions directly where needed. Totals, counts,
filtered products, active product objects, and diagnostics are derived.
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
