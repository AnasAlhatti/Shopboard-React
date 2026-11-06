---
id: bundle-barrel-imports
category: bundle-size-optimization
priority: critical
title: Avoid Heavy Barrel File Imports
---

# Avoid Heavy Barrel File Imports (`bundle-barrel-imports`)

## Problem

Importing from top-level package index or barrel files forces the bundler to parse and evaluate dozens or hundreds of unused module exports, ballooning chunk size and initialization time.

```ts
// ❌ Anti-pattern: Barrel import
import { Check, ArrowRight } from 'lucide-react'; // Can pull in extensive icon registries if unoptimized
```

## Solution

Use specific subpath imports or configure bundler optimizePackageImports (e.g., in Vite / Next.js) so that only used symbols enter the bundle.

```ts
// ✅ Correct: Specific imports or properly tree-shaken bundler configuration
import Check from 'lucide-react/dist/esm/icons/check';
```
