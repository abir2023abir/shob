export type Currency = "BDT" | "USD";

export const RATE = 122; // BDT per USD — demo rate
export const FREE_DELIVERY_AT = 2500;
export const DELIVERY_FEE = 80;
export const PROMO = { code: "SHOB10", off: 0.1 };

export function money(amount: number, currency: Currency = "BDT"): string {
  if (currency === "USD") return `$${(amount / RATE).toFixed(2)}`;
  return `৳${Math.round(amount).toLocaleString("en-BD")}`;
}

export function discountPercent(price: number, old?: number): number {
  if (!old || old <= price) return 0;
  return Math.round((1 - price / old) * 100);
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function orderNumber(): string {
  return `SHB-${Math.floor(100000 + Math.random() * 899999)}`;
}
