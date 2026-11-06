---
id: async-cheap-condition-before-await
category: eliminating-waterfalls
priority: critical
title: Evaluate Cheap Conditions Before Awaiting
---

# Evaluate Cheap Conditions Before Awaiting (`async-cheap-condition-before-await`)

## Problem

Triggering network or database awaits before evaluating in-memory or cheap state guards wastes round-trips and compute.

```ts
// ❌ Anti-pattern: Expensive fetch before simple local check
const user = await fetchUserProfile(id);
if (!isEnabled || !id) return null;
```

## Solution

Evaluate synchronous guards, feature flags, or null checks first before initiating network calls.

```ts
// ✅ Correct: Cheap guard exits immediately
if (!isEnabled || !id) return null;
const user = await fetchUserProfile(id);
```
