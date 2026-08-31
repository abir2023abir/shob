export type Currency = "BDT" | "USD";

export const RATE = 122; // BDT per USD — demo rate

/** Where the admin panel saves the numbers that drive the storefront. */
export const SETTINGS_KEY = "shob.settings.v1";

export const SHIPPED_DEFAULTS = {
  freeDeliveryAt: 2500,
  deliveryFee: 80,
  promoCode: "SHOB10",
  promoOff: 0.1,
};

/**
 * Read once at module load, exactly like the catalogue: changing the delivery
 * fee in the admin panel moves it on the storefront too, on the next load. A
 * number that has been hand-edited into nonsense falls back to the shipped one
 * rather than producing a bag that cannot be paid for.
 */
function publishedSettings(): typeof SHIPPED_DEFAULTS {
  if (typeof window === "undefined") return SHIPPED_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return SHIPPED_DEFAULTS;
    const saved = JSON.parse(raw) as Partial<typeof SHIPPED_DEFAULTS>;
    const num = (value: unknown, fallback: number, max: number) =>
      typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max
        ? value
        : fallback;

    return {
      freeDeliveryAt: num(saved.freeDeliveryAt, SHIPPED_DEFAULTS.freeDeliveryAt, 1_000_000),
      deliveryFee: num(saved.deliveryFee, SHIPPED_DEFAULTS.deliveryFee, 100_000),
      promoOff: num(saved.promoOff, SHIPPED_DEFAULTS.promoOff, 0.9),
      promoCode:
        typeof saved.promoCode === "string" && saved.promoCode.trim()
          ? saved.promoCode.trim().toUpperCase()
          : SHIPPED_DEFAULTS.promoCode,
    };
  } catch {
    return SHIPPED_DEFAULTS;
  }
}

const settings = publishedSettings();

export const FREE_DELIVERY_AT = settings.freeDeliveryAt;
export const DELIVERY_FEE = settings.deliveryFee;
export const PROMO = { code: settings.promoCode, off: settings.promoOff };

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
