# Aethel Silicon

Aethel Silicon is an AMD-inspired, dark hardware storefront and architecture showcase for high-performance desktop microprocessors and graphics engines. The application features cinematic silicon storytelling, an asynchronous filterable catalog, deep product detail views, category-locked benchmark comparisons with animated performance bars, a real-time custom rig configurator, and a full shopping cart with assembly bundling.

## Tech Stack

- **Framework:** React 19, TypeScript (`strict: true`), Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons:** Lucide React (`lucide-react`)
- **Testing:** Vitest, Testing Library (`@testing-library/react`), jsdom
- **Linting & Formatting:** ESLint, Prettier, Husky, lint-staged
- **Design:** Semantic HTML, Mobile-first CSS, zero `!important`, high-contrast obsidian & crimson styling tokens

## Commands

- `npm run dev` starts the local Vite development server.
- `npm run build` creates the production bundle (`dist/`).
- `npm run lint` lints all source files with ESLint.
- `npm run format` formats project files with Prettier.
- `npm run format:check` checks formatting without changing files.
- `npm run typecheck` runs strict TypeScript checks (`tsc -b`).
- `npm test` runs the unit test suite across all feature modules with Vitest.

## Application Routes & Features

1. **Ecosystem & Flagship Reveal (`/`)**
   - Photography-led editorial home page with paired Vortex CPU / Zenith GPU studio shots and a processor package close-up.
   - Catalogue-backed specifications, pricing, and direct product-detail links; explicit unavailable states with a loading retry.
   - CPU/GPU product-family tabs with arrow-key navigation, family-filtered catalogue links, and a brief image transition.
   - Responsive images preserve their proportions; the hero image loads eagerly and supporting images load lazily. Entrance and image transitions respect reduced-motion preferences.
   - A compact closing section links to the custom rig builder. No video, WebGL, or external animation library is required.

2. **Silicon Storefront Catalog (`/catalog`)**
   - Full hardware matrix consuming asynchronous data from `/data/products.json`.
   - Faceted filtering: category pills (All, CPUs, GPUs), keyword search, price slider ($250–$1,000), TDP range slider (65W–400W), and physical cores/VRAM multi-facets.
   - Sorting by featured, price (ascending/descending), peak clock speed, compute throughput (TFLOPs), and alphabetical product name (A–Z).
   - Grid and list layout toggles.
   - URL synchronization via search parameters for shareable and bookmarkable filter states.

3. **Product Detail Architecture Sheets (`/product/:id`)**
   - High-resolution hardware viewer with preserved aspect ratios.
   - Comprehensive technical specification table (node, lithography, cache, cores, bus width, PCIe support, transistor estimates, and instruction sets).
   - Mini-benchmark performance cards (Cinebench, Blender, 4K ray tracing, efficiency per watt).
   - Quantity selector with semantic label, Add to Cart feedback, Compare tray toggle, and direct Custom Rig Builder launcher.

4. **Benchmark Comparison Dashboard (`/compare`)**
   - Head-to-head comparison table for up to 4 products with dynamic winning metric calculation and toggleable highlight mode.
   - Category-locked comparison (CPU vs. CPU or GPU vs. GPU) to preserve 1:1 metric integrity.
   - Animated AMD-style horizontal benchmark bars with leader badges and percentage delta indicators (`-% vs leader` / `+% time`).
   - Silicon picker modal to quickly add available models into empty comparison slots.

5. **Custom Rig Configurator (`/configurator`)**
   - Interactive battlestation workbench framed by the illuminated tempered glass PC chassis render.
   - 3-step slot selector: 1. Processor (Vortex) -> 2. Graphics (Zenith) -> 3. Memory & Storage package tier.
   - Live power diagnostics: estimated system TDP calculation, dynamic safety gauge, recommended 80+ Gold PSU sizing, and real-time bottleneck synergy analysis with mismatch warning advisories.
   - Dual cart integration: _"Add as Assembled Custom Rig"_ (single bundled item) vs. _"Add Components Individually"_ (adds CPU, GPU, and RAM/Storage package).

6. **Shopping Cart & Checkout Simulation (`/cart`)**
   - Supports both standalone items and bundled custom rigs with nested component breakdowns.
   - _"Unbundle Rig"_ action to decompose a prebuilt system into individual parts at any time.
   - Quantity adjustments, item removal, and full cart clearing.
   - Promo code validation (code `SILICON10` provides 10% discount).
   - Checkout modal simulating order confirmation, reference generation, and express dispatch.

## Feature Architecture & Structure

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
├── App.tsx                    # Route orchestration
├── main.tsx                   # Mounting entry point
└── index.css                  # Base reset & design system foundation
```

### Adding New Features (e.g., Wishlist)

The project follows a strict, modular feature-first architecture (Rule 7: _"Clear feature modules. Every file has one job, and everything is in its place."_). Any engineer adding a new capability (such as a Wishlist) can immediately locate and place files according to this pattern:

1. **Feature UI Module (`src/features/wishlist/`):**
   - `WishlistPage.tsx`: Primary page component for the `/wishlist` route.
   - `wishlist.css`: Scoped styling using tokens from `src/shared/styles/design-tokens.css`.
   - `components/`: Feature-scoped child components (e.g., `WishlistItemCard.tsx`).
2. **Global State & Context (`src/features/wishlist/context/WishlistContext.tsx`):**
   - React context managing wishlist items with `localStorage` persistence.
3. **Custom Hook (`src/features/wishlist/hooks/useWishlist.ts`):**
   - Clean consumer hook exposing items and action dispatchers (`toggleWishlist`, `isInWishlist`).
4. **Types (`src/features/wishlist/types/wishlist.ts`):**
   - Strict TypeScript interfaces for wishlist item shapes and context signatures.
5. **Route & Navigation:**
   - Register the route in `src/App.tsx` (`<Route path="/wishlist" element={<WishlistPage />} />`).
   - Add navigation entry/pill or header action in `src/shared/components/Header.tsx`.

## Component Tree & State Ownership

Matches the application hierarchy file-for-file as inspected in the **Components** tab of React DevTools:

```
App (src/App.tsx) [Props: {}] [State: none]
│
├── BrowserRouter (react-router-dom)
│   │
│   └── CartProvider (src/features/cart/context/CartContext.tsx) [Props: { children: ReactNode }]
│       │   [State Owned: items: CartItem[] (persisted in localStorage['aethel-cart'])]
│       │
│       └── CompareProvider (src/features/compare/context/CompareContext.tsx) [Props: { children: ReactNode }]
│           │   [State Owned: items: Product[] (persisted in localStorage['aethel-compare'])]
│           │
│           └── ApplicationShell (src/App.tsx) [Props: {}]
│               │   [State Owned: cartOpen: boolean]
│               │
│               ├── Header (src/shared/components/Header.tsx)
│               │   ├── Props: { onOpenCart: () => void }
│               │   ├── State Owned: isScrolled: boolean
│               │   └── Context Consumed: useCart (itemCount), useCompare (items.length)
│               │
│               ├── Routes (react-router-dom)
│               │   │
│               │   ├── Route path="/" ── HomePage (src/features/home/HomePage.tsx)
│               │   │   ├── Props: {}
│               │   │   ├── State Owned: products, loading, error, retry (via useProducts)
│               │   │   ├── HeroShowcase (src/features/home/components/HeroShowcase.tsx)
│               │   │   │   ├── Props: { cpu?: Product, gpu?: Product, loading: boolean }
│               │   │   │   └── State Owned: none
│               │   │   ├── ArchitectureStory (src/features/home/components/ArchitectureStory.tsx)
│               │   │   │   ├── Props: { cpu?: Product }
│               │   │   │   └── State Owned: none
│               │   │   └── SiliconSpotlight (src/features/home/components/SiliconSpotlight.tsx)
│               │   │       ├── Props: { cpu?: Product, gpu?: Product, loading?: boolean }
│               │   │       └── State Owned: active: 'cpu' | 'gpu' (default: 'gpu')
│               │   │
│               │   ├── Route path="/catalog" ── CatalogPage (src/features/catalog/CatalogPage.tsx)
│               │   │   ├── Props: {}
│               │   │   ├── State Owned:
│               │   │   │   • searchQuery: string (synced with ?search= URL param)
│               │   │   │   • selectedCategory: 'all' | 'cpu' | 'gpu' (synced with ?category= URL param)
│               │   │   │   • maxPrice: number (synced with ?maxPrice= URL param)
│               │   │   │   • maxTdp: number (synced with ?maxTdp= URL param)
│               │   │   │   • minCores: number (synced with ?minCores= URL param)
│               │   │   │   • minVram: number (synced with ?minVram= URL param)
│               │   │   │   • sortOption: SortOption (synced with ?sort= URL param)
│               │   │   │   • viewMode: 'grid' | 'list'
│               │   │   │   • products, loading, error, retry (via useProducts)
│               │   │   │
│               │   │   ├── FilterSidebar (src/features/catalog/components/FilterSidebar.tsx)
│               │   │   │   ├── Props: {
│               │   │   │   │     searchQuery: string, onSearchChange: (q: string) => void,
│               │   │   │   │     selectedCategory: 'all' | 'cpu' | 'gpu', onCategoryChange: (c) => void,
│               │   │   │   │     maxPrice: number, onMaxPriceChange: (p: number) => void,
│               │   │   │   │     maxTdp: number, onMaxTdpChange: (t: number) => void,
│               │   │   │   │     minCores: number, onMinCoresChange: (c: number) => void,
│               │   │   │   │     minVram: number, onMinVramChange: (v: number) => void,
│               │   │   │   │     onReset: () => void, totalCount: number, filteredCount: number
│               │   │   │   │   }
│               │   │   │   └── State Owned: none (pure controlled presentation component)
│               │   │   │
│               │   │   ├── SortBar (src/features/catalog/components/SortBar.tsx)
│               │   │   │   ├── Props: {
│               │   │   │   │     sortOption: SortOption, onSortChange: (opt: SortOption) => void,
│               │   │   │   │     viewMode: 'grid' | 'list', onViewModeChange: (m: 'grid' | 'list') => void,
│               │   │   │   │     itemCount: number
│               │   │   │   │   }
│               │   │   │   └── State Owned: none (pure controlled presentation component)
│               │   │   │
│               │   │   └── ProductGrid (src/features/catalog/components/ProductGrid.tsx)
│               │   │       ├── Props: { products: Product[], viewMode: 'grid' | 'list', totalCount?: number }
│               │   │       ├── State Owned: none
│               │   │       └── ProductCard (src/features/catalog/components/ProductCard.tsx) [repeated per item]
│               │   │           ├── Props: { product: Product }
│               │   │           ├── State Owned: none
│               │   │           └── Context Consumed: useCart (addToCart), useCompare (toggleCompare, isInCompare, category)
│               │   │
│               │   ├── Route path="/product/:id" ── ProductDetailPage (src/features/product-detail/ProductDetailPage.tsx)
│               │   │   ├── Props: {}
│               │   │   ├── State Owned:
│               │   │   │   • quantity: number (local item quantity stepper)
│               │   │   │   • justAdded: boolean (temporary addition pulse confirmation)
│               │   │   │   • products, loading, error, retry (via useProducts)
│               │   │   ├── Context Consumed: useCart (addToCart), useCompare (toggleCompare, isInCompare, category)
│               │   │   ├── ProductGallery (src/features/product-detail/components/ProductGallery.tsx)
│               │   │   │   ├── Props: { product: Product }
│               │   │   │   └── State Owned: none
│               │   │   ├── ArchitectureSpecTable (src/features/product-detail/components/ArchitectureSpecTable.tsx)
│               │   │   │   ├── Props: { product: Product }
│               │   │   │   └── State Owned: none
│               │   │   └── MiniBenchmarkCard (src/features/product-detail/components/MiniBenchmarkCard.tsx)
│               │   │       ├── Props: { product: Product }
│               │   │       └── State Owned: none
│               │   │
│               │   ├── Route path="/compare" ── ComparePage (src/features/compare/ComparePage.tsx)
│               │   │   ├── Props: {}
│               │   │   ├── State Owned: pickerOpen: boolean
│               │   │   ├── Context Consumed: useCompare (items, category, removeFromCompare, clearCompare, addToCompare)
│               │   │   ├── CompareTable (src/features/compare/components/CompareTable.tsx)
│               │   │   │   ├── Props: { items: Product[], onRemove: (id) => void, onClear: () => void, onAddSlot: () => void }
│               │   │   │   └── State Owned: highlightDifferences: boolean
│               │   │   ├── BenchmarkBarChart (src/features/compare/components/BenchmarkBarChart.tsx)
│               │   │   │   ├── Props: { items: Product[], category: 'cpu' | 'gpu' }
│               │   │   │   └── State Owned: none
│               │   │   └── ProductPickerModal (src/features/compare/components/ProductPickerModal.tsx)
│               │   │       ├── Props: { isOpen: boolean, onClose: () => void, onSelect: (p: Product) => void, category: 'cpu' | 'gpu', currentItemIds: string[] }
│               │   │       └── State Owned: none
│               │   │
│               │   ├── Route path="/configurator" ── ConfiguratorPage (src/features/configurator/ConfiguratorPage.tsx)
│               │   │   ├── Props: {}
│               │   │   ├── State Owned:
│               │   │   │   • selectedCpuId: string | null
│               │   │   │   • selectedGpuId: string | null
│               │   │   │   • selectedStorageTierId: string ('base' | 'mid' | 'extreme')
│               │   │   │   • products, loading (via useProducts)
│               │   │   ├── Context Consumed: useCart (addToCart, addRigToCart)
│               │   │   ├── RigVisualizer (src/features/configurator/components/RigVisualizer.tsx)
│               │   │   │   ├── Props: { cpu: Product | null, gpu: Product | null, tier: MemoryStorageTier }
│               │   │   │   └── State Owned: none
│               │   │   ├── ComponentSlotSelector (src/features/configurator/components/ComponentSlotSelector.tsx)
│               │   │   │   ├── Props: {
│               │   │   │   │     cpus: Product[], gpus: Product[],
│               │   │   │   │     selectedCpuId: string | null, selectedGpuId: string | null,
│               │   │   │   │     selectedStorageTierId: string,
│               │   │   │   │     onSelectCpu: (id: string) => void, onSelectGpu: (id: string) => void,
│               │   │   │   │     onSelectStorageTier: (id: string) => void
│               │   │   │   │   }
│               │   │   │   └── State Owned: none
│               │   │   └── PowerSynergyMeter (src/features/configurator/components/PowerSynergyMeter.tsx)
│               │   │       ├── Props: {
│               │   │       │     cpu: Product | null, gpu: Product | null, tier: MemoryStorageTier,
│               │   │       │     onAddRigToCart: () => void, onAddIndividualParts: () => void
│               │   │       │   }
│               │   │       └── State Owned: addedFeedback: boolean
│               │   │
│               │   └── Route path="/cart" ── CartPage (src/features/cart/CartPage.tsx)
│               │       ├── Props: {}
│               │       ├── State Owned:
│               │       │   • promoCode: string
│               │       │   • discountRate: number (0 or 0.10)
│               │       │   • promoError: string | null
│               │       │   • checkoutModalOpen: boolean
│               │       │   • isSubmittingOrder: boolean
│               │       ├── Context Consumed: useCart (items, subtotal, itemCount, updateQuantity, removeFromCart, unbundleRig, clearCart)
│               │       ├── CartItemRow (src/features/cart/components/CartItemRow.tsx) [repeated per item]
│               │       │   ├── Props: { item: CartItem, onUpdateQuantity: (id, q) => void, onRemove: (id) => void, onUnbundle: (id) => void }
│               │       │   └── State Owned: none
│               │       ├── OrderSummary (src/features/cart/components/OrderSummary.tsx)
│               │       │   ├── Props: {
│               │       │   │     subtotal: number, discount: number, promoCode: string,
│               │       │   │     onPromoCodeChange: (c: string) => void, onApplyPromo: (e) => void,
│               │       │   │     promoError: string | null, promoApplied: boolean, onCheckout: () => void
│               │       │   │   }
│               │       │   └── State Owned: none
│               │       └── CheckoutModal (src/features/cart/components/CheckoutModal.tsx)
│               │           ├── Props: { isOpen: boolean, onClose: () => void, onConfirm: () => void, total: number, isSubmitting: boolean }
│               │           └── State Owned: none
│               │
│               ├── Footer (src/shared/components/Footer.tsx)
│               │   ├── Props: {}
│               │   └── State Owned: none
│               │
│               ├── CompareDock (src/shared/components/CompareDock.tsx)
│               │   ├── Props: {}
│               │   ├── State Owned: none
│               │   └── Context Consumed: useCompare (items, clearCompare, removeFromCompare)
│               │
│               └── QuickCartDrawer (src/shared/components/QuickCartDrawer.tsx)
│                   ├── Props: { isOpen: boolean, onClose: () => void }
│                   ├── State Owned: none (active element ref management)
│                   └── Context Consumed: useCart (items, subtotal)
```

## Code ownership

Feature logic is colocated under `src/features/<feature>/`: pages, components, hooks, context/state, types, and feature data loading. Cart and compare own their persisted state; catalog owns product loading. `src/shared/` holds cross-feature contracts and infrastructure, including the shared product type, generic API client, design tokens, and shell components. All network calls use `src/shared/api/apiClient.ts` for fetch, HTTP error handling, and JSON decoding. See `CLAUDE.md` for the naming rules and detailed engineering conventions.
