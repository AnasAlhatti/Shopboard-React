---
id: async-parallel
category: eliminating-waterfalls
priority: critical
title: Parallelize Independent Asynchronous Operations
---

# Parallelize Independent Asynchronous Operations (`async-parallel`)

## Problem

Awaiting asynchronous promises sequentially causes an execution waterfall where total elapsed time is the sum of all response latencies.

```ts
// ❌ Anti-pattern: Sequential waterfall
const user = await fetchUser();
const permissions = await fetchPermissions();
const cart = await fetchCart();
```

## Solution

When operations do not depend on each other's outputs, execute them concurrently using `Promise.all()` or `Promise.allSettled()`.

```ts
// ✅ Correct: Concurrent execution
const [user, permissions, cart] = await Promise.all([
  fetchUser(),
  fetchPermissions(),
  fetchCart(),
]);
```
