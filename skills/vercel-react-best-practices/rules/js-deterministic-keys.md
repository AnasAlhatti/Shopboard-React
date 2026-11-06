---
id: js-deterministic-keys
category: javascript-performance
priority: critical
title: Use Domain-Unique Keys Instead of Array Indices
---

# Use Domain-Unique Keys Instead of Array Indices (`js-deterministic-keys`)

## Problem

Using array indices (`key={index}`) or position numbers as React list keys confuses the reconciliation engine when the list is filtered, sorted, prepended, or removed. Component state and focus remain bound to index position rather than the underlying data item.

```tsx
// ❌ Anti-pattern: Index as key
{
  items.map((item, index) => <ProductCard key={index} product={item} />);
}
```

## Solution

Always use a stable, unique domain identifier from the data item.

```tsx
// ✅ Correct: Domain ID as key
{
  items.map((item) => <ProductCard key={item.id} product={item} />);
}
```
