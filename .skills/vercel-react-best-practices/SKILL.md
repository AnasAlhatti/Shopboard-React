---
name: vercel-react-best-practices
description: Production-grade React and Next.js performance optimization guidelines from Vercel Engineering, covering eliminating waterfalls, bundle size optimization, server-side performance, and rendering efficiency.
---

# Vercel React Best Practices

A comprehensive guide for writing, reviewing, and refactoring React components and applications for peak performance and minimal latency.

## 1. Eliminating Waterfalls (`async-`) [CRITICAL]
- **Parallelize Independent Requests:** Always use `Promise.all()` or `Promise.allSettled()` for independent async calls instead of consecutive `await` statements.
- **Eager Prefetching:** Fetch resources as early as possible (e.g., at route level or on hover/focus) before rendering dependent UI components.
- **Evaluate Cheap Guards First:** Check synchronous conditions or local state before triggering expensive async operations.
- **Strategic Suspense Boundaries:** Wrap slow-loading asynchronous sections in localized `<Suspense>` fallbacks to stream interactive UI instantly.

## 2. Bundle Size Optimization (`bundle-`) [CRITICAL]
- **Avoid Heavy Barrel Imports:** Import directly from specific subpaths or modules instead of large barrel files (`import { x } from 'package/subpath'`).
- **Dynamic Imports & Code Splitting:** Use `React.lazy()` or dynamic imports for heavy modals, charts, and non-critical interactive components.
- **Deduplicate Client Bundles:** Avoid shipping server-only logic, unused polyfills, or duplicate utility libraries to the browser bundle.

## 3. Server-Side & Data Fetching (`server-` / `client-`) [HIGH]
- **Request Memoization & Caching:** Use in-memory caching or `React.cache()` for deterministic queries to prevent redundant duplicate network requests.
- **Minimal Serialization Payloads:** Only send data fields required by the UI across network/client boundaries; never serialize large raw database objects.
- **Stale-While-Revalidate Patterns:** Cache results aggressively and revalidate in the background to provide zero-latency UI interactions.

## 4. Re-render Optimization & State Colocation (`rerender-`) [MEDIUM]
- **Colocate State with Consumers:** Push state down as close as possible to the leaves that use it, preventing re-renders in higher-level parent trees.
- **Derived State Over Synchronization:** Compute values on the fly during render using `useMemo` instead of storing redundant derived values in `useEffect` and `useState`.
- **Stable Callback References:** Use `useCallback` for event handlers passed down to memoized child components (`React.memo`).
- **Clean Functional Updates:** Use `setItems(current => ...)` updater functions to eliminate closure dependencies on mutable collections.

## 5. Rendering & JavaScript Performance (`rendering-` / `js-`) [MEDIUM]
- **Deterministic Keys:** Never use array indices as React list keys; always use stable, domain-unique entity IDs (`item.id`).
- **Avoid Layout Shifts:** Set explicit image dimensions or preserved aspect ratio wrappers (`aspect-ratio: 16 / 9`) to prevent Cumulative Layout Shift (CLS).
- **Virtualize Large Lists:** For catalogs or data tables exceeding 50 items, implement virtualization or pagination.
- **Event Delegation & Passive Listeners:** Debounce expensive resize/scroll handlers and register passive event listeners.
