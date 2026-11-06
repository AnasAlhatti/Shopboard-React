---
id: rendering-conditional-render
category: rendering-performance
priority: medium
title: Explicit Boolean Checks for Conditional Rendering
---

# Explicit Boolean Checks for Conditional Rendering (`rendering-conditional-render`)

## Problem

Using `&&` with numbers like `count && <Badge count={count} />` short-circuits to `0` when `count === 0`. React renders `0` as visible text into the DOM.

```tsx
// ❌ Anti-pattern: Renders literal "0" into the DOM
<div>{items.length && <CartBadge count={items.length} />}</div>
```

## Solution

Always cast to an explicit boolean or use a ternary.

```tsx
// ✅ Correct: Strict boolean guard
<div>{items.length > 0 && <CartBadge count={items.length} />}</div>
```
