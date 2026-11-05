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
- `npm run typecheck` runs strict TypeScript checks (`tsc -b`).
- `npm test` runs the unit test suite across all feature modules with Vitest.

## Application Routes & Features

1. **Ecosystem & Flagship Reveal (`/`)**
   - High-contrast obsidian hero featuring the unified CPU + GPU silicon render.
   - Live architectural stat tickers (5.9 GHz clock, 88.4 TFLOPs FP32).
   - Interactive scroll-linked exploded hardware teardown with 3 clickable hotspot pins detailing the 3D V-Stack cache, 3nm compute die, and graphene vapor chamber.
   - Architectural tabbed spotlights comparing Vortex CPU and Zenith GPU engines.

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
   - Dual cart integration: *"Add as Assembled Custom Rig"* (single bundled item) vs. *"Add Components Individually"* (adds CPU, GPU, and RAM/Storage package).

6. **Shopping Cart & Checkout Simulation (`/cart`)**
   - Supports both standalone items and bundled custom rigs with nested component breakdowns.
   - *"Unbundle Rig"* action to decompose a prebuilt system into individual parts at any time.
   - Quantity adjustments, item removal, and full cart clearing.
   - Promo code validation (code `SILICON10` provides 10% discount).
   - Checkout modal simulating order confirmation, reference generation, and express dispatch.

## Feature Architecture & Structure

```
src/
├── api/
├── context/
│   ├── CartContext.tsx        # Cart state with localStorage persistence and unbundling
│   └── CompareContext.tsx     # Category-locked comparison tray with localStorage
├── features/
│   ├── cart/                  # CartPage, CartItemRow, OrderSummary, CheckoutModal
│   ├── catalog/               # CatalogPage, FilterSidebar, ProductGrid, ProductCard, SortBar
│   ├── compare/               # ComparePage, CompareTable, BenchmarkBarChart, ProductPickerModal
│   ├── configurator/          # ConfiguratorPage, RigVisualizer, ComponentSlotSelector, PowerSynergyMeter
│   ├── home/                  # HomePage, HeroShowcase, ExplodedTeardown, SiliconSpotlight
│   └── product-detail/        # ProductDetailPage, ProductGallery, ArchitectureSpecTable, MiniBenchmarkCard
├── hooks/
│   ├── useCart.ts
│   ├── useCompare.ts
│   └── useProducts.ts
├── services/
│   └── productService.ts      # Asynchronous mock API service
├── shared/
│   ├── components/            # Header, Footer, QuickCartDrawer, CompareDock
│   └── styles/                # design-tokens.css
├── test/
│   ├── app.test.tsx           # Comprehensive consolidated unit test suite
│   └── setup.ts               # Test environment setup & mocks
├── types/                     # product.ts, cart.ts, compare.ts
├── App.tsx                    # Route orchestration
└── index.css                  # Base reset & design system foundation
```

### Adding New Features (e.g., Wishlist)

The project follows a strict, modular feature-first architecture (Rule 7: *"Clear feature modules. Every file has one job, and everything is in its place."*). Any engineer adding a new capability (such as a Wishlist) can immediately locate and place files according to this pattern:

1. **Feature UI Module (`src/features/wishlist/`):**
   - `WishlistPage.tsx`: Primary page component for the `/wishlist` route.
   - `wishlist.css`: Scoped styling using tokens from `src/shared/styles/design-tokens.css`.
   - `components/`: Feature-scoped child components (e.g., `WishlistItemCard.tsx`).
2. **Global State & Context (`src/context/WishlistContext.tsx`):**
   - React context managing wishlist items with `localStorage` persistence.
3. **Custom Hook (`src/hooks/useWishlist.ts`):**
   - Clean consumer hook exposing items and action dispatchers (`toggleWishlist`, `isInWishlist`).
4. **Types (`src/types/wishlist.ts`):**
   - Strict TypeScript interfaces for wishlist item shapes and context signatures.
5. **Route & Navigation:**
   - Register the route in `src/App.tsx` (`<Route path="/wishlist" element={<WishlistPage />} />`).
   - Add navigation entry/pill or header action in `src/shared/components/Header.tsx`.
