---
id: eliminate-boolean-props
category: component-architecture
priority: high
title: Eliminate Boolean Prop Proliferation
---

# Eliminate Boolean Prop Proliferation (`eliminate-boolean-props`)

## Problem

Accumulating boolean flags (`isPrimary`, `isSecondary`, `isLarge`, `showIcon`, `hasError`, `isLoading`) creates exponential state combinations, fragile type definitions, and bloated components with multiple mutually exclusive states.

```tsx
// ❌ Anti-pattern: Proliferation of boolean flags
<Button isPrimary isLarge isLoading showArrow isDisabled />
```

## Solution

Use explicit union variant types and compose subcomponents or slot patterns instead.

```tsx
// ✅ Correct: Explicit variant union and compound composition
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'quiet';
  size: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```
