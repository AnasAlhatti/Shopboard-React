---
id: rerender-no-inline-components
category: re-render-optimization
priority: medium
title: Never Declare Components Inside Components
---

# Never Declare Components Inside Components (`rerender-no-inline-components`)

## Problem

Declaring a component function inside another component creates a new component reference on every render. React treats this as an entirely different component type, triggering complete unmount/remount cycles and losing all internal state and DOM focus.

```tsx
// ❌ Anti-pattern: Declaring nested component inside parent render
function ProductList({ products }: { products: Product[] }) {
  function Item({ item }: { item: Product }) {
    return <li>{item.name}</li>;
  }
  return (
    <ul>
      {products.map((p) => (
        <Item key={p.id} item={p} />
      ))}
    </ul>
  );
}
```

## Solution

Hoist child components to module scope or dedicate their own files.

```tsx
// ✅ Correct: Component declared outside parent
function Item({ item }: { item: Product }) {
  return <li>{item.name}</li>;
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map((p) => (
        <Item key={p.id} item={p} />
      ))}
    </ul>
  );
}
```
