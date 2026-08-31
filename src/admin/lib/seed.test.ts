import { describe, expect, it } from "vitest";
import { SEED_PRODUCTS } from "@/data/catalogue";
import { generateOrders, mulberry32 } from "./seed";
import { STATUS_FLOW } from "./orders";

const now = new Date("2026-08-31T12:00:00.000Z");
const build = (over = {}) => generateOrders({ products: SEED_PRODUCTS, now, ...over });

describe("mulberry32", () => {
  it("returns the same stream for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays inside the unit interval", () => {
    const rand = mulberry32(7);
    for (let i = 0; i < 200; i += 1) {
      const value = rand();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("generateOrders", () => {
  it("is deterministic, so the demo does not shift under the client", () => {
    expect(build().map((o) => o.ref)).toEqual(build().map((o) => o.ref));
  });

  it("produces the number of orders asked for", () => {
    expect(build({ count: 20 })).toHaveLength(20);
  });

  it("returns nothing when there is nothing to sell", () => {
    expect(generateOrders({ products: [], now })).toEqual([]);
  });

  it("sorts newest first", () => {
    const dates = build({ count: 30 }).map((o) => o.placedAt);
    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });

  it("keeps every order inside the requested window", () => {
    const days = 30;
    const floor = now.getTime() - (days + 1) * 86_400_000;
    for (const order of build({ count: 40, days })) {
      const at = new Date(order.placedAt).getTime();
      expect(at).toBeGreaterThanOrEqual(floor);
      expect(at).toBeLessThanOrEqual(now.getTime());
    }
  });

  it("gives every order a valid status, at least one line, and a real product", () => {
    const ids = new Set(SEED_PRODUCTS.map((p) => p.id));
    const allowed = new Set([...STATUS_FLOW, "cancelled"]);

    for (const order of build({ count: 40 })) {
      expect(allowed.has(order.status)).toBe(true);
      expect(order.lines.length).toBeGreaterThan(0);
      expect(order.lines.every((l) => ids.has(l.id))).toBe(true);
      expect(order.lines.every((l) => l.qty > 0)).toBe(true);
      expect(order.customer.phone).toMatch(/^01[3-9]\d{8}$/);
    }
  });

  it("never repeats a product within one order", () => {
    for (const order of build({ count: 40 })) {
      const ids = order.lines.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("leaves nothing old still sitting at pending", () => {
    const stale = build({ count: 60 }).filter(
      (o) =>
        o.status === "pending" &&
        new Date(o.placedAt).getTime() < now.getTime() - 2 * 86_400_000,
    );
    expect(stale).toEqual([]);
  });
});
