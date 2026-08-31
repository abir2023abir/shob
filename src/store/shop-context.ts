import { createContext, useContext } from "react";
import type { Product } from "@/data/catalogue";
import type { Currency } from "@/lib/format";
import type { Totals } from "@/lib/totals";

export type { Totals };

export interface LineOptions {
  color?: string;
  size?: string;
}

export interface CartLine {
  key: string;
  id: string;
  qty: number;
  opts: LineOptions;
}

export interface Toast {
  id: number;
  message: string;
  action?: "cart";
}

export interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  currency: Currency;
  promoApplied: boolean;
  cartOpen: boolean;
  toasts: Toast[];
  lastOrder: string | null;
}

export interface ShopValue extends ShopState {
  lines: (CartLine & { product: Product })[];
  count: number;
  totals: Totals;
  add: (product: Product, qty?: number, opts?: LineOptions) => void;
  setQty: (key: string, delta: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  setCurrency: (value: Currency) => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  openCart: () => void;
  closeCart: () => void;
  notify: (message: string) => void;
  dismiss: (id: number) => void;
  placeOrder: (ref: string) => void;
}

/**
 * The context and its hook live apart from the provider component so that
 * editing the provider does not cost a full reload under Fast Refresh.
 */
export const ShopContext = createContext<ShopValue | null>(null);

export function useShop(): ShopValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
