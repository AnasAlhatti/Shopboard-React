# Debug lab log

## Bug 1

- **What I saw:** React logs `Warning: Each child in a list should have a unique "key" prop` in the console. The category chips still render, but React cannot track them between renders.
- **Component:** `src/components/CategoryChips.tsx` (line 9)
- **How I found it:** Console warning, plus `npm run lint` → `react(jsx-key)`.
- **Cause:** The `.map()` returns a `<span>` with no `key`. Every sibling in an array needs a stable, unique key so React can tell which chip is which when the list changes.
- **Fix:**

  ```tsx
  {
    categories.map((category) => (
      <span key={category} className="chip">
        {category}
      </span>
    ));
  }
  ```

---

## Bug 2

- **What I saw:** Clicking the `+` button inside the cart appears to do nothing. The row quantity, the cart total, and the header cart count all stay the same. After some unrelated re-render (e.g. toggling a heart or changing sort) the quantity suddenly jumps to the new value.
- **Component:** `src/components/CartRow.tsx` (line 11), with `src/components/CartPanel.tsx` (line 23) and `src/App.tsx` (line 35)
- **How I found it:** Inspecting state/props in React DevTools (the `cart` item's `qty` changes in place but no render happens), plus `npm run lint` → `react(immutability)`.
- **Cause:** `increase()` does `item.qty = item.qty + 1`, mutating a `CartItem` object that lives inside `App`'s `cart` state. Then `onChange()` calls `setCart(cart)` with the exact same array reference, so React bails out (`Object.is` comparison) and never re-renders. Mutating props/state is also forbidden because React never sees a new value.
- **Fix:** Keep the update immutable and send the change up. `CartRow` should report the new quantity instead of writing to `item`:

  ```tsx
  // CartRow.tsx
  interface CartRowProps {
    item: CartItem;
    product: Product;
    onChange: (id: number, qty: number) => void;
  }

  export function CartRow({ item, product, onChange }: CartRowProps) {
    function increase() {
      onChange(item.id, item.qty + 1);
    }
    // ...
  }
  ```

  ```tsx
  // CartPanel.tsx
  interface CartPanelProps {
    cart: CartItem[];
    products: Product[];
    onChange: (id: number, qty: number) => void;
  }

  // ... pass the same callback down:
  <CartRow key={item.id} item={item} product={product} onChange={onChange} />;
  ```

  ```tsx
  // App.tsx
  function updateQty(id: number, qty: number) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item)),
    );
  }

  // ...
  <CartPanel cart={cart} products={PRODUCTS} onChange={updateQty} />;
  ```

---

## Bug 3

- **What I saw:** Choosing **Price: low to high** sorts the grid correctly, but switching back to **Featured** does not restore the original order - the grid stays price-sorted. The imported `PRODUCTS` array itself is now reordered.
- **Component:** `src/components/ProductList.tsx` (line 13)
- **How I found it:** Watching the `products` prop in React DevTools / the module scope in Sources while changing the sort select. The prop array is reordered in place.
- **Cause:** `Array.prototype.sort()` sorts **in place**. `products` is the same `PRODUCTS` array passed straight from `App`, so this mutates shared module-level data during render. Once mutated, "Featured" has no original order left to show. Mutating props during render is also a side effect and is unsafe in StrictMode/concurrent rendering.
- **Fix:** Sort a copy, never the prop:

  ```tsx
  const shown =
    sort === 'price-asc'
      ? [...products].sort((a, b) => a.price - b.price)
      : products;
  ```

  Or with the non-mutating method: `products.toSorted((a, b) => a.price - b.price)`.

---

## Bug 4

- **What I saw:** Save a product with the heart, then change the sort. The filled heart stays in the same grid position but is now attached to a different product. Saved state appears on the wrong card.
- **Component:** `src/components/ProductList.tsx` (line 18), affecting state in `src/components/ProductCard.tsx` (line 11)
- **How I found it:** Key/state inspection in React DevTools - toggling `saved` on one card and reordering the list moves the state to whatever product lands in that slot.
- **Cause:** `key={index}` identifies list items by their position. When the order changes, React reuses the same `ProductCard` instance - including its `saved` `useState` - for the product that moves into that index, instead of moving the component with its product.
- **Fix:** Use the stable, unique product id as the key:

  ```tsx
  {
    shown.map((product) => (
      <ProductCard key={product.id} product={product} onAdd={onAdd} />
    ));
  }
  ```

---

## Bug 5

- **What I saw:** Sold-out products (`stock: 0` -"Mini Crossbody Bag" and "Wool Scarf") show a stray `0` in the stock line instead of showing nothing.
- **Component:** `src/components/StockNote.tsx` (line 6)
- **How I found it:** Rendered output/props inspection. `stock` is `0`, yet the paragraph contains the text `0`.
- **Cause:** `stock && <span>…</span>` short-circuits to the number `0` when `stock` is `0`. React renders numbers including `0` as text. Only `null`, `undefined`, `false`, and `""` render nothing.
- **Fix:** Compare explicitly so the expression returns a boolean:

  ```tsx
  return <p className="stock">{stock > 0 && <span>Only {stock} left</span>}</p>;
  ```

  Or use a ternary: `stock > 0 ? <span>Only {stock} left</span> : null`.
