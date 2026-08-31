import { describe, expect, it } from "vitest";
import {
  STATUS_FLOW,
  canCancel,
  customersFrom,
  nextStatus,
  orderItems,
  orderSubtotal,
  orderTotal,
  revenueByCategory,
  revenueByDay,
  summarise,
} from "./orders";
import type { Order, StoreSettings } from "./types";

const settings: StoreSettings = {
  storeName: "Shob",
  supportPhone: "01700000000",
  deliveryFee: 80,
  freeDeliveryAt: 2500,
  promoCode: "SHOB10",
  promoOff: 0.1,
  lowStockAt: 8,
  defaultCurrency: "BDT",
};

const order = (over: Partial<Order> = {}): Order => ({
  ref: "SHB-100001",
  placedAt: "2026-08-30T10:00:00.000Z",
  customer: { name: "Nusrat Rahman", phone: "01712345678", city: "Dhaka", division: "Dhaka" },
  lines: [{ id: "g3", name: "Sundarban Honey", cat: "grocery", qty: 1, price: 1000 }],
  method: "bkash",
  status: "delivered",
  promoApplied: false,
  ...over,
});

describe("status flow", () => {
  it("walks pending through to delivered", () => {
    expect(nextStatus("pending")).toBe("confirmed");
    expect(nextStatus("shipped")).toBe("delivered");
  });

  it("stops at the end of the flow", () => {
    expect(nextStatus("delivered")).toBeNull();
  });

  it("has no next step for a cancelled order", () => {
    expect(nextStatus("cancelled")).toBeNull();
  });

  it("allows cancelling only before it leaves the warehouse", () => {
    expect(STATUS_FLOW.filter(canCancel)).toEqual(["pending", "confirmed", "packed"]);
    expect(canCancel("shipped")).toBe(false);
    expect(canCancel("delivered")).toBe(false);
  });
});

describe("order maths", () => {
  it("sums the lines at the price they were bought at", () => {
    const o = order({
      lines: [
        { id: "a", name: "A", cat: "grocery", qty: 2, price: 300 },
        { id: "b", name: "B", cat: "books", qty: 1, price: 400 },
      ],
    });
    expect(orderSubtotal(o)).toBe(1000);
    expect(orderItems(o)).toBe(3);
  });

  it("adds delivery under the threshold and drops it over", () => {
    expect(orderTotal(order(), settings)).toBe(1080);
    expect(
      orderTotal(
        order({ lines: [{ id: "a", name: "A", cat: "grocery", qty: 1, price: 3000 }] }),
        settings,
      ),
    ).toBe(3000);
  });

  it("applies the promo before testing the threshold", () => {
    const o = order({
      lines: [{ id: "a", name: "A", cat: "grocery", qty: 1, price: 2600 }],
      promoApplied: true,
    });
    expect(orderTotal(o, settings)).toBeCloseTo(2340 + 80);
  });

  it("re-prices against whatever settings say", () => {
    const free = { ...settings, deliveryFee: 0 };
    expect(orderTotal(order(), free)).toBe(1000);
  });
});

describe("summarise", () => {
  const orders = [
    order({ ref: "SHB-1", status: "delivered" }),
    order({ ref: "SHB-2", status: "pending" }),
    order({ ref: "SHB-3", status: "cancelled" }),
  ];

  it("counts every order but banks only the live ones", () => {
    const s = summarise(orders, settings);
    expect(s.orders).toBe(3);
    expect(s.revenue).toBe(1080 * 2);
    expect(s.cancelled).toBe(1);
    expect(s.delivered).toBe(1);
    expect(s.awaiting).toBe(1);
  });

  it("averages over the orders that counted, not all of them", () => {
    expect(summarise(orders, settings).averageOrder).toBe(1080);
  });

  it("survives an empty window", () => {
    const s = summarise([], settings);
    expect(s.revenue).toBe(0);
    expect(s.averageOrder).toBe(0);
  });
});

describe("revenueByDay", () => {
  const now = new Date("2026-08-31T12:00:00.000Z");

  it("returns one bucket per day, including days with nothing", () => {
    const series = revenueByDay([order()], settings, 3, now);
    expect(series.map((d) => d.date)).toEqual(["2026-08-29", "2026-08-30", "2026-08-31"]);
    expect(series[1].revenue).toBe(1080);
    expect(series[0].revenue).toBe(0);
  });

  it("ignores orders outside the window", () => {
    const old = order({ placedAt: "2026-01-01T10:00:00.000Z" });
    expect(revenueByDay([old], settings, 3, now).every((d) => d.revenue === 0)).toBe(true);
  });

  it("leaves cancelled orders out of the line", () => {
    const series = revenueByDay([order({ status: "cancelled" })], settings, 3, now);
    expect(series.every((d) => d.revenue === 0)).toBe(true);
  });
});

describe("revenueByCategory", () => {
  it("groups line totals and ranks them", () => {
    const rows = revenueByCategory([
      order({
        lines: [
          { id: "a", name: "A", cat: "grocery", qty: 1, price: 500 },
          { id: "b", name: "B", cat: "books", qty: 2, price: 400 },
        ],
      }),
    ]);
    expect(rows[0].cat).toBe("books");
    expect(rows[0].revenue).toBe(800);
    expect(rows[1].revenue).toBe(500);
  });
});

describe("customersFrom", () => {
  it("keys people by phone and adds up what they spent", () => {
    const people = customersFrom(
      [
        order({ ref: "SHB-1" }),
        order({ ref: "SHB-2", placedAt: "2026-08-20T10:00:00.000Z" }),
        order({
          ref: "SHB-3",
          customer: { name: "Arif Khan", phone: "01898765432", city: "Bogura", division: "Rajshahi" },
        }),
      ],
      settings,
    );

    expect(people).toHaveLength(2);
    const [top] = people;
    expect(top.phone).toBe("01712345678");
    expect(top.orders).toBe(2);
    expect(top.spent).toBe(2160);
    expect(top.firstOrder).toBe("2026-08-20T10:00:00.000Z");
  });

  it("counts a cancelled order without banking its money", () => {
    const [person] = customersFrom(
      [order({ ref: "SHB-1" }), order({ ref: "SHB-2", status: "cancelled" })],
      settings,
    );
    expect(person.orders).toBe(2);
    expect(person.spent).toBe(1080);
  });
});
