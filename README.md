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
   - Faceted filtering: category pills (All, CPUs, GPUs), keyword search, price slider, and TDP range slider.
   - Sorting by featured, price (ascending/descending), and peak clock speed.
   - Grid and list layout toggles.
   - URL synchronization via search parameters for shareable and bookmarkable filter states.

3. **Product Detail Architecture Sheets (`/product/:id`)**
   - High-resolution hardware viewer with preserved aspect ratios.
   - Comprehensive technical specification table (node, lithography, cache, cores, bus width, PCIe support).
   - Mini-benchmark performance cards (Cinebench, Blender, 4K ray tracing, efficiency per watt).
   - Quantity selector with semantic label, Add to Cart feedback, and Compare tray toggle.

4. **Benchmark Comparison Dashboard (`/compare`)**
   - Head-to-head comparison table for up to 4 products with differential metric highlighting.
   - Category-locked comparison (CPU vs. CPU or GPU vs. GPU) to preserve 1:1 metric integrity.
   - Animated AMD-style horizontal benchmark bars for gaming FPS (Cyberpunk 2077, Black Myth: Wukong), synthetic compute (Cinebench R24, Blender), and efficiency per watt.
   - Silicon picker modal to quickly add available models into empty comparison slots.

5. **Custom Rig Configurator (`/configurator`)**
   - Interactive battlestation workbench framed by the illuminated tempered glass PC chassis render.
   - 3-step slot selector: 1. Processor (Vortex) -> 2. Graphics (Zenith) -> 3. Memory & Storage package tier.
   - Live power diagnostics: estimated system TDP calculation, dynamic safety gauge, recommended 80+ Gold PSU sizing, and bottleneck synergy balance rating.
   - Dual cart integration: *"Add as Assembled Custom Rig"* (single bundled item) vs. *"Add Components Individually"*.

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
├── types/                     # product.ts, cart.ts, compare.ts
├── App.tsx                    # Route orchestration
└── index.css                  # Base reset & design system foundation
```
