const TAX_RATE = 0.07;
const PROMO_DISCOUNT_RATE = 0.1;

export function calculateOrderTotals(
  subtotal: number,
  promoCode: string | null,
) {
  const discountAmount =
    promoCode === 'SILICON10' ? subtotal * PROMO_DISCOUNT_RATE : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * TAX_RATE;
  return { discountAmount, tax, total: discountedSubtotal + tax };
}
