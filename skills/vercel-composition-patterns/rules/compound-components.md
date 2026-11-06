---
id: compound-components
category: component-architecture
priority: high
title: Compose Features with Compound Components
---

# Compose Features with Compound Components (`compound-components`)

## Problem

Passing massive configuration objects or rigid nested options forces the parent to predict every layout variation, preventing flexible styling and slot placement.

## Solution

Expose composable subcomponents that share implicit state via Context while allowing the consumer full layout control.

```tsx
// ✅ Correct: Compound component composition
<Card>
  <Card.Header>
    <Card.Title>Aethel Vortex 9950X</Card.Title>
    <Card.Badge>Flagship</Card.Badge>
  </Card.Header>
  <Card.Body>
    <Card.Specs />
  </Card.Body>
  <Card.Footer>
    <Card.Action>Add to Cart</Card.Action>
  </Card.Footer>
</Card>
```
