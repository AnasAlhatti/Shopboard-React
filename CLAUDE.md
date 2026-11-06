# ShopBoard React Engineering Guide

## Stack

- React 19, strict TypeScript, Vite, React Router v7
- Lucide React icons; semantic HTML and mobile first CSS
- Vitest, React Testing Library, ESLint, Prettier, Husky, lint-staged
- Design tokens: `src/shared/styles/design-tokens.css`

## Feature ownership

Each domain keeps its page, components, hooks, context/state, types, and domain data loading together in `src/features/<feature>/`. For example, cart state and its consumer hook belong in `features/cart/`; compare owns compare state; catalog owns product loading. Cross-feature contracts and infrastructure belong in `src/shared/`: shared product types, generic API client, design tokens, and reusable shell components. A feature may consume another feature's public hook/type when needed; do not relocate its implementation into `shared/`.

`src/App.tsx` owns route composition and `src/main.tsx` mounts the application. Put feature-only components in that feature's `components/` folder.

## Naming rules

- React components, pages, contexts, and providers: PascalCase, e.g. `CartPage.tsx`, `CartContext.tsx`.
- Hooks: `use` + PascalCase name in camelCase filename, e.g. `useCart.ts`.
- Non-component TypeScript modules (services, utilities, data, and type contracts): lower camelCase, e.g. `productService.ts`, `bottleneck.ts`, `tiers.ts`, `product.ts`.
- Stylesheets: kebab-case, e.g. `product-detail.css`.
- Static asset filenames: lowercase kebab-case with a descriptive, concise name and a normal extension; avoid spaces and special punctuation.

## API requests and validation

Use `src/shared/api/apiClient.ts` for all network requests. The client owns fetch, HTTP errors, and JSON decoding; each feature supplies a type guard for its response. Type guards must validate every required field and every optional field when present before claiming a value matches a TypeScript contract. Never use `any` to bypass validation.

## Quality rules

- Use immutable state updates and stable domain IDs for React keys.
- Avoid `count && <Component />` when count can be zero; compare explicitly.
- Every input needs a label. Never stretch images, use `!important`, `any`, type assertions, or non-null assertions.
- Keep README.md current when routes, ownership, commands, or project structure change.

## Commands

- `npm run dev` starts Vite.
- `npm run build` creates the production bundle.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs strict TypeScript checks.
- `npm run format` formats supported project files.
- `npm run format:check` checks formatting without writing files.
- `npm test` runs Vitest.
