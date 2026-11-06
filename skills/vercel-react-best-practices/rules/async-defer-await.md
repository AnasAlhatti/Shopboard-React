---
id: async-defer-await
category: eliminating-waterfalls
priority: critical
title: Defer Awaiting Until Value is Needed
---

# Defer Awaiting Until Value is Needed (`async-defer-await`)

## Problem

Awaiting a promise at the beginning of an asynchronous block prevents other independent synchronous operations from executing early.

```ts
// ❌ Anti-pattern: Blocking early
async function handleAction() {
  const data = await fetchData();
  validateLocalForm();
  renderSkeleton();
}
```

## Solution

Start the promise early, execute independent synchronous setup or guards, and only `await` when the result is strictly required.

```ts
// ✅ Correct: Start early, await late
async function handleAction() {
  const dataPromise = fetchData();
  validateLocalForm();
  renderSkeleton();
  const data = await dataPromise;
}
```
