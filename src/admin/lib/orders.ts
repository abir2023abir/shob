import { PRODUCTS, categoryOf, type CategoryId } from "@/data/catalogue";
import type { Customer, Order, OrderStatus, StoreSettings } from "./types";

/** The happy path, in order. Cancelled sits outside it. */
export const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** The next step a fulfilment person can move an order to, or null at the end. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  const at = STATUS_FLOW.indexOf(status);
  if (at < 0 || at === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[at + 1];
}

/** Once something has shipped it is out of our hands — no cancelling from here. */
export function canCancel(status: OrderStatus): boolean {
  return status === "pending" || status === "confirmed" || status === "packed";
}

export function orderSubtotal(order: Order): number {
  return order.lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

export function orderItems(order: Order): number {
  return order.lines.reduce((sum, l) => sum + l.qty, 0);
}

/**
 * Mirrors the storefront's bag maths, but reads the fee and threshold from
 * settings so the admin can change them and see historical orders re-priced
 * consistently in the table.
 */
export function orderTotal(order: Order, settings: StoreSettings): number {
  const subtotal = orderSubtotal(order);
  const discount = order.promoApplied ? subtotal * settings.promoOff : 0;
  const net = subtotal - discount;
  const delivery = subtotal === 0 || net >= settings.freeDeliveryAt ? 0 : settings.deliveryFee;
  return net + delivery;
}

/** Cancelled orders are still listed, but they never count as money taken. */
export function isRevenue(order: Order): boolean {
  return order.status !== "cancelled";
}

export interface Summary {
  revenue: number;
  orders: number;
  averageOrder: number;
  items: number;
  awaiting: number;
  delivered: number;
  cancelled: number;
}

export function summarise(orders: Order[], settings: StoreSettings): Summary {
  const counted = orders.filter(isRevenue);
  const revenue = counted.reduce((sum, o) => sum + orderTotal(o, settings), 0);

  return {
    revenue,
    orders: orders.length,
    averageOrder: counted.length ? revenue / counted.length : 0,
    items: counted.reduce((sum, o) => sum + orderItems(o), 0),
    awaiting: orders.filter((o) => o.status === "pending" || o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };
}

const DAY = 86_400_000;

const dayKey = (value: string | Date) => new Date(value).toISOString().slice(0, 10);

export interface DayPoint {
  date: string;
  revenue: number;
  orders: number;
}

/** A dense series — days with no orders still get a zero, so the chart is honest. */
export function revenueByDay(
  orders: Order[],
  settings: StoreSettings,
  days: number,
  now: Date,
): DayPoint[] {
  const buckets = new Map<string, DayPoint>();

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = dayKey(new Date(now.getTime() - i * DAY));
    buckets.set(date, { date, revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    if (!isRevenue(order)) continue;
    const bucket = buckets.get(dayKey(order.placedAt));
    if (!bucket) continue;
    bucket.revenue += orderTotal(order, settings);
    bucket.orders += 1;
  }

  return [...buckets.values()];
}

export interface CategoryPoint {
  cat: CategoryId;
  label: string;
  revenue: number;
  units: number;
}

export function revenueByCategory(orders: Order[]): CategoryPoint[] {
  const totals = new Map<CategoryId, CategoryPoint>();

  for (const order of orders) {
    if (!isRevenue(order)) continue;
    for (const line of order.lines) {
      const point = totals.get(line.cat) ?? {
        cat: line.cat,
        label: categoryOf(line.cat).label,
        revenue: 0,
        units: 0,
      };
      point.revenue += line.price * line.qty;
      point.units += line.qty;
      totals.set(line.cat, point);
    }
  }

  return [...totals.values()].sort((a, b) => b.revenue - a.revenue);
}

export interface SellerPoint {
  id: string;
  name: string;
  units: number;
  revenue: number;
}

export function bestSellers(orders: Order[], count = 5): SellerPoint[] {
  const totals = new Map<string, SellerPoint>();

  for (const order of orders) {
    if (!isRevenue(order)) continue;
    for (const line of order.lines) {
      const point = totals.get(line.id) ?? { id: line.id, name: line.name, units: 0, revenue: 0 };
      point.units += line.qty;
      point.revenue += line.price * line.qty;
      totals.set(line.id, point);
    }
  }

  return [...totals.values()].sort((a, b) => b.units - a.units).slice(0, count);
}

/**
 * There is no customer table — a customer is whoever has ordered, keyed by
 * phone number, which is what a Bangladeshi storefront actually identifies
 * people by.
 */
export function customersFrom(orders: Order[], settings: StoreSettings): Customer[] {
  const people = new Map<string, Customer>();

  for (const order of orders) {
    const existing = people.get(order.customer.phone);
    const spend = isRevenue(order) ? orderTotal(order, settings) : 0;

    if (!existing) {
      people.set(order.customer.phone, {
        phone: order.customer.phone,
        name: order.customer.name,
        city: order.customer.city,
        division: order.customer.division,
        orders: 1,
        spent: spend,
        firstOrder: order.placedAt,
        lastOrder: order.placedAt,
      });
      continue;
    }

    existing.orders += 1;
    existing.spent += spend;
    if (order.placedAt < existing.firstOrder) existing.firstOrder = order.placedAt;
    if (order.placedAt > existing.lastOrder) existing.lastOrder = order.placedAt;
  }

  return [...people.values()].sort((a, b) => b.spent - a.spent);
}

/** Products at or under the alert threshold, sold out first. */
export function lowStock(threshold: number) {
  return PRODUCTS.filter((p) => p.stock <= threshold).sort((a, b) => a.stock - b.stock);
}
