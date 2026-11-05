# Aethel Silicon

Aethel Silicon is a dark, hardware-focused storefront concept for a fictional CPU and GPU lineup. The current implementation includes a responsive navigation shell, interactive flagship homepage, typed product data, and persistent cart and comparison state.

## Stack

- React 19, TypeScript, and Vite
- React Router for application routes
- Lucide React for interface icons
- ESLint and Prettier
- Vitest, Testing Library, and jsdom
- Husky and lint-staged for pre-commit checks

## Development commands

- `npm run dev` starts the local Vite development server.
- `npm run build` creates the production build.
- `npm run lint` checks the code with ESLint.
- `npm run format` formats project files with Prettier.
- `npm run typecheck` runs strict TypeScript checks.
- `npm test` runs the browser-independent unit tests.

## Current modules

- `src/types/` contains product, cart, and comparison models.
- `public/data/products.json` contains eight fictional products: four CPUs and four GPUs.
- `src/services/productService.ts` loads product data asynchronously from `/data/products.json`.
- `src/context/` owns cart and comparison state, including localStorage persistence.
- `src/hooks/` exposes product, cart, and comparison state to React components.
- `src/shared/components/` contains the responsive header, quick cart drawer, comparison dock, and footer.
- `src/features/home/` contains the flagship hero, interactive exploded teardown, and CPU/GPU architecture spotlights.
- `public/assets/` contains the supplied hardware imagery referenced by the product data.

The cart supports standalone products and assembled rigs. Comparison is locked to one product category at a time. Both contexts safely recover to empty state when browser storage contains invalid JSON.
