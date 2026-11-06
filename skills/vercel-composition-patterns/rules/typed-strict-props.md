---
id: typed-strict-props
category: typing-and-contracts
priority: critical
title: Strict Exported Props Interface per Component
---

# Strict Exported Props Interface per Component (`typed-strict-props`)

## Problem

Using inline un-exported types or loose `any` / optional objects makes components hard to test, hard to compose, and susceptible to runtime regressions.

## Solution

Every reusable component must live in its own file and export a typed `interface ComponentNameProps` that strictly models all required attributes and handlers without `any` or loose type assertions.

```tsx
// ✅ Correct: Strict exported Props contract
export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // ...
}
```
