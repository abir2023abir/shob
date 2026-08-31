import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/catalogue";
import { PROMO, type Currency } from "@/lib/format";
import { computeTotals } from "@/lib/totals";
import { capToStock } from "@/lib/stock";
import {
  ShopContext,
  type CartLine,
  type LineOptions,
  type ShopState,
  type ShopValue,
  type Toast,
} from "./shop-context";

type Action =
  | { type: "add"; product: Product; qty: number; opts: LineOptions }
  | { type: "qty"; key: string; delta: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "wish"; id: string }
  | { type: "currency"; value: Currency }
  | { type: "promo"; value: boolean }
  | { type: "cartOpen"; value: boolean }
  | { type: "toast"; message: string; action?: "cart" }
  | { type: "dismiss"; id: number }
  | { type: "order"; ref: string };

const STORAGE_KEY = "shob.state.v1";

const initial: ShopState = {
  cart: [],
  wishlist: [],
  currency: "BDT",
  promoApplied: false,
  cartOpen: false,
  toasts: [],
  lastOrder: null,
};

/** A colour/size pair is its own line: Slate/M is not the same item as Ink/L. */
function lineKey(id: string, opts: LineOptions) {
  return `${id}|${opts.color ?? ""}|${opts.size ?? ""}`;
}

/** At most this many toasts are kept — older ones are dropped, not queued. */
const MAX_TOASTS = 3;

/** Monotonic: two adds inside the same millisecond must not share a React key. */
let toastSeq = 0;

function pushToast(toasts: Toast[], message: string, action?: Toast["action"]): Toast[] {
  toastSeq += 1;
  return [...toasts, { id: toastSeq, message, action }].slice(-MAX_TOASTS);
}

function reducer(state: ShopState, action: Action): ShopState {
  switch (action.type) {
    case "add": {
      const key = lineKey(action.product.id, action.opts);
      const existing = state.cart.find((l) => l.key === key);
      const cart = existing
        ? state.cart.map((l) =>
            l.key === key ? { ...l, qty: capToStock(l.id, l.qty + action.qty) } : l,
          )
        : [
            ...state.cart,
            {
              key,
              id: action.product.id,
              qty: capToStock(action.product.id, action.qty),
              opts: action.opts,
            },
          ];
      return {
        ...state,
        cart,
        toasts: pushToast(state.toasts, `${action.product.name} added to your bag`, "cart"),
      };
    }
    case "qty":
      return {
        ...state,
        cart: state.cart.flatMap((l) =>
          l.key === action.key
            ? l.qty + action.delta <= 0
              ? []
              : [{ ...l, qty: capToStock(l.id, l.qty + action.delta) }]
            : [l],
        ),
      };
    case "remove":
      return { ...state, cart: state.cart.filter((l) => l.key !== action.key) };
    case "clear":
      return { ...state, cart: [], promoApplied: false };
    case "wish":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.id)
          ? state.wishlist.filter((x) => x !== action.id)
          : [...state.wishlist, action.id],
      };
    case "currency":
      return { ...state, currency: action.value };
    case "promo":
      return { ...state, promoApplied: action.value };
    case "cartOpen":
      return { ...state, cartOpen: action.value };
    case "toast":
      return { ...state, toasts: pushToast(state.toasts, action.message, action.action) };
    case "dismiss":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "order":
      return { ...state, cart: [], promoApplied: false, lastOrder: action.ref };
    default:
      return state;
  }
}

/**
 * Reads the persisted cart/wishlist so a refresh does not lose the bag. The
 * stored blob is whatever was in localStorage — a stale schema or a product
 * that has since left the catalogue must not take the app down, so every field
 * is checked rather than trusted.
 */
function hydrate(): ShopState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const saved = JSON.parse(raw) as Partial<ShopState>;
    const known = (id: string) => PRODUCTS.some((p) => p.id === id);

    const cart = (Array.isArray(saved.cart) ? saved.cart : [])
      .filter(
        (l) =>
          l &&
          typeof l.id === "string" &&
          typeof l.key === "string" &&
          Number.isFinite(l.qty) &&
          l.qty > 0 &&
          known(l.id),
      )
      .map((l) => ({ ...l, qty: capToStock(l.id, Math.floor(l.qty)), opts: l.opts ?? {} }));

    return {
      ...initial,
      cart,
      wishlist: (Array.isArray(saved.wishlist) ? saved.wishlist : []).filter(
        (id) => typeof id === "string" && known(id),
      ),
      currency: saved.currency === "USD" ? "USD" : "BDT",
      promoApplied: saved.promoApplied === true,
    };
  } catch {
    return initial;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate);

  useEffect(() => {
    const { cart, wishlist, currency, promoApplied } = state;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cart, wishlist, currency, promoApplied }),
      );
    } catch {
      /* storage unavailable — the session still works, it just will not persist */
    }
  }, [state]);

  const lines = useMemo(
    () =>
      state.cart
        .map((l) => {
          const product = PRODUCTS.find((p) => p.id === l.id);
          return product ? { ...l, product } : null;
        })
        .filter((l): l is CartLine & { product: Product } => l !== null),
    [state.cart],
  );

  const totals = useMemo(
    () => computeTotals(lines, state.promoApplied),
    [lines, state.promoApplied],
  );

  const add = useCallback(
    (product: Product, qty = 1, opts: LineOptions = {}) =>
      dispatch({ type: "add", product, qty, opts }),
    [],
  );

  const applyPromo = useCallback((code: string) => {
    const ok = code.trim().toUpperCase() === PROMO.code;
    if (ok) dispatch({ type: "promo", value: true });
    return ok;
  }, []);

  const value = useMemo<ShopValue>(
    () => ({
      ...state,
      lines,
      totals,
      count: state.cart.reduce((sum, l) => sum + l.qty, 0),
      add,
      setQty: (key, delta) => dispatch({ type: "qty", key, delta }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
      toggleWish: (id) => dispatch({ type: "wish", id }),
      isWished: (id) => state.wishlist.includes(id),
      setCurrency: (v) => dispatch({ type: "currency", value: v }),
      applyPromo,
      removePromo: () => dispatch({ type: "promo", value: false }),
      openCart: () => dispatch({ type: "cartOpen", value: true }),
      closeCart: () => dispatch({ type: "cartOpen", value: false }),
      notify: (message) => dispatch({ type: "toast", message }),
      dismiss: (id) => dispatch({ type: "dismiss", id }),
      placeOrder: (ref) => dispatch({ type: "order", ref }),
    }),
    [state, lines, totals, add, applyPromo],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
