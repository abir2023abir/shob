import { describe, expect, it } from "vitest";
import { computeTotals, type PricedLine } from "./totals";
import { DELIVERY_FEE, FREE_DELIVERY_AT, PROMO } from "./format";

const line = (price: number, qty = 1, old?: number): PricedLine => ({ qty, product: { price, old } });

describe("computeTotals", () => {
  it("charges nothing for delivery on an empty bag", () => {
    const t = computeTotals([], false);
    expect(t.subtotal).toBe(0);
    expect(t.delivery).toBe(0);
    expect(t.total).toBe(0);
  });

  it("multiplies each line by its quantity", () => {
    expect(computeTotals([line(500, 3), line(250, 2)], false).subtotal).toBe(2000);
  });

  it("adds the delivery fee below the free-delivery threshold", () => {
    const t = computeTotals([line(1000)], false);
    expect(t.delivery).toBe(DELIVERY_FEE);
    expect(t.total).toBe(1000 + DELIVERY_FEE);
    expect(t.toFreeDelivery).toBe(FREE_DELIVERY_AT - 1000);
    expect(t.freeDeliveryProgress).toBeCloseTo(40);
  });

  it("drops the delivery fee once the threshold is met exactly", () => {
    const t = computeTotals([line(FREE_DELIVERY_AT)], false);
    expect(t.delivery).toBe(0);
    expect(t.toFreeDelivery).toBe(0);
    expect(t.freeDeliveryProgress).toBe(100);
  });

  it("applies the promo before testing the threshold", () => {
    // 2600 clears the threshold, but 10% off drops it back under.
    const t = computeTotals([line(2600)], true);
    expect(t.discount).toBeCloseTo(2600 * PROMO.off);
    expect(t.delivery).toBe(DELIVERY_FEE);
    expect(t.total).toBeCloseTo(2340 + DELIVERY_FEE);
  });

  it("reports savings from struck-through prices only", () => {
    const t = computeTotals([line(800, 2, 1000), line(500)], false);
    expect(t.savings).toBe(400);
  });

  it("never reports more than full progress", () => {
    expect(computeTotals([line(FREE_DELIVERY_AT * 5)], false).freeDeliveryProgress).toBe(100);
  });
});
