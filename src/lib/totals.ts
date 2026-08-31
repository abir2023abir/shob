import { DELIVERY_FEE, FREE_DELIVERY_AT, PROMO } from "./format";

export interface Totals {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  toFreeDelivery: number;
  freeDeliveryProgress: number;
  savings: number;
}

/** The minimum a line needs for the maths — the cart passes whole products. */
export interface PricedLine {
  qty: number;
  product: { price: number; old?: number };
}

/**
 * Every money figure in the bag, the drawer, and checkout comes from here, so
 * the three can never disagree. The promo is applied before the free-delivery
 * threshold is tested — discounting below the threshold does reinstate the fee.
 */
export function computeTotals(lines: PricedLine[], promoApplied: boolean): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const savings = lines.reduce(
    (sum, l) => sum + (l.product.old ? (l.product.old - l.product.price) * l.qty : 0),
    0,
  );

  const discount = promoApplied ? subtotal * PROMO.off : 0;
  const net = subtotal - discount;
  const delivery = subtotal === 0 || net >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;

  return {
    subtotal,
    discount,
    delivery,
    total: net + delivery,
    savings,
    toFreeDelivery: Math.max(0, FREE_DELIVERY_AT - net),
    freeDeliveryProgress: Math.min(100, (net / FREE_DELIVERY_AT) * 100),
  };
}
