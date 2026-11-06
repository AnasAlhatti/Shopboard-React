---
name: vercel-composition-patterns
description: Component architecture and composition patterns for React 19 and modern component libraries, eliminating boolean prop proliferation and building scalable APIs.
---

# Vercel React Composition Patterns

A production guide for architecting composable, resilient React components using compound components, context-driven containers, and modern React 19 primitives.

## 1. Component Architecture & Compound Components

- **Eliminate Boolean Prop Proliferation:** Replace anti-pattern boolean flags (`isPrimary`, `isLarge`, `hasIcon`, `showError`, `isLoading`) with expressive compound subcomponents or explicit variant types.
- **Compound Components Pattern:** Structure complex widgets as composable families:
  ```tsx
  <Card>
    <Card.Header>
      <Card.Title>Vortex 9950X</Card.Title>
      <Card.Badge>Flagship</Card.Badge>
    </Card.Header>
    <Card.Body>...</Card.Body>
    <Card.Footer>...</Card.Footer>
  </Card>
  ```
- **Inversion of Control:** Let the consumer control slot placement and markup hierarchy rather than configuring fixed layouts via deeply nested config objects.

## 2. State Management & Context Boundaries

- **Context for Deep Trees:** Use lightweight React contexts to share state and event dispatchers among sibling compound components without prop drilling.
- **Controlled vs. Uncontrolled Flexibility:** Support both uncontrolled defaults (`defaultValue`) and controlled state (`value` + `onChange`) seamlessly.
- **Null-Check Custom Hooks:** Expose consumer hooks (`useCompoundContext()`) that throw actionable descriptive errors when components are rendered outside their provider boundary.

## 3. Modern React 19 Idioms

- **Direct Ref Passing:** In React 19, use the `ref` prop directly on standard function components without wrapping them in legacy `forwardRef`.
- **The `use()` Hook:** Leverage `use(Promise)` and `use(Context)` for conditional reads inside render functions without hook hierarchy restrictions.
- **Action Transitions:** Use `useActionState` and `useTransition` for asynchronous state transitions and optimistic UI mutations.

## 4. Scalability & Polymorphism

- **Polymorphic `asChild` / Slot Patterns:** Allow components to delegate rendering to child elements without wrapper `<div>` clutter.
- **Typed Strict Props Interfaces:** Every component must have a dedicated, exported `interface ComponentNameProps` documenting exact acceptable types—never loose `any` or untyped props.
- **Semantic HTML First:** Always root compound components in semantic HTML tags (`<article>`, `<nav>`, `<aside>`, `<dialog>`, `<figure>`).

## Rule Files (`./rules/`)

This skill includes granular architectural rules with code examples:

- `rules/eliminate-boolean-props.md`: Eliminate boolean prop proliferation in favor of explicit variants.
- `rules/compound-components.md`: Compose feature families using compound component hierarchies.
- `rules/typed-strict-props.md`: Require strict, exported typed Props interfaces for every reusable component.
