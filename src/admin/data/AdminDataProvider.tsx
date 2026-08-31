import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { CATALOGUE_KEY, PRODUCTS, SEED_PRODUCTS, type Product } from "@/data/catalogue";
import { SETTINGS_KEY, SHIPPED_DEFAULTS } from "@/lib/format";
import { generateOrders } from "../lib/seed";
import type { Order, OrderStatus, StoreSettings } from "../lib/types";
import { AdminContext, type AdminValue } from "./admin-context";

const ORDERS_KEY = "shob.admin.orders.v1";

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Shob",
  supportPhone: "01700000000",
  deliveryFee: SHIPPED_DEFAULTS.deliveryFee,
  freeDeliveryAt: SHIPPED_DEFAULTS.freeDeliveryAt,
  promoCode: SHIPPED_DEFAULTS.promoCode,
  promoOff: SHIPPED_DEFAULTS.promoOff,
  lowStockAt: 8,
  defaultCurrency: "BDT",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — the session still works, it just will not persist */
  }
}

let toastSeq = 0;

export function AdminDataProvider({ children }: { children: ReactNode }) {
  // One clock for the whole session: charts, "x days ago" labels, and the seed
  // must not disagree because a render happened either side of midnight.
  const now = useRef(new Date()).current;

  // PRODUCTS is already the published catalogue — whatever the admin saved last.
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...read<Partial<StoreSettings>>(SETTINGS_KEY, {}),
  }));
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = read<Order[] | null>(ORDERS_KEY, null);
    if (Array.isArray(saved) && saved.length) return saved;
    const seeded = generateOrders({ products: PRODUCTS, now });
    write(ORDERS_KEY, seeded);
    return seeded;
  });
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const toast = useCallback((message: string) => {
    toastSeq += 1;
    const id = toastSeq;
    setToasts((list) => [...list, { id, message }].slice(-3));
  }, []);

  const dismissToast = useCallback(
    (id: number) => setToasts((list) => list.filter((t) => t.id !== id)),
    [],
  );

  /** Every product write goes through here, so the storefront copy never drifts. */
  const publish = useCallback((next: Product[]) => {
    setProducts(next);
    write(CATALOGUE_KEY, next);
  }, []);

  const saveProduct = useCallback(
    (product: Product) => {
      const exists = products.some((p) => p.id === product.id);
      publish(
        exists ? products.map((p) => (p.id === product.id ? product : p)) : [...products, product],
      );
      toast(exists ? `${product.name} updated` : `${product.name} added to the catalogue`);
    },
    [products, publish, toast],
  );

  const deleteProducts = useCallback(
    (ids: string[]) => {
      const remaining = products.filter((p) => !ids.includes(p.id));
      // An empty catalogue makes the storefront fall back to the seed, which
      // would look like the delete silently failed. Refuse the last one instead.
      if (!remaining.length) {
        toast("The catalogue cannot be left empty");
        return;
      }
      publish(remaining);
      toast(ids.length === 1 ? "Product deleted" : `${ids.length} products deleted`);
    },
    [products, publish, toast],
  );

  const adjustStock = useCallback(
    (id: string, delta: number) => {
      publish(
        products.map((p) =>
          p.id === id ? { ...p, stock: Math.max(0, Math.min(9999, p.stock + delta)) } : p,
        ),
      );
    },
    [products, publish],
  );

  const setOrderStatus = useCallback(
    (ref: string, status: OrderStatus) => {
      setOrders((list) => {
        const next = list.map((o) => (o.ref === ref ? { ...o, status } : o));
        write(ORDERS_KEY, next);
        return next;
      });
      toast(`${ref} marked ${status}`);
    },
    [toast],
  );

  const saveSettings = useCallback(
    (next: StoreSettings) => {
      setSettings(next);
      write(SETTINGS_KEY, next);
      toast("Settings saved — the storefront picks them up on its next load");
    },
    [toast],
  );

  const resetDemoData = useCallback(() => {
    const seeded = generateOrders({ products: SEED_PRODUCTS, now });
    publish(SEED_PRODUCTS);
    setOrders(seeded);
    setSettings(DEFAULT_SETTINGS);
    write(ORDERS_KEY, seeded);
    write(SETTINGS_KEY, DEFAULT_SETTINGS);
    toast("Demo data rebuilt from the seed");
  }, [now, publish, toast]);

  const value = useMemo<AdminValue>(
    () => ({
      products,
      orders,
      settings,
      now,
      saveProduct,
      deleteProducts,
      adjustStock,
      setOrderStatus,
      saveSettings,
      resetDemoData,
      toast,
      toasts,
      dismissToast,
    }),
    [
      products,
      orders,
      settings,
      now,
      saveProduct,
      deleteProducts,
      adjustStock,
      setOrderStatus,
      saveSettings,
      resetDemoData,
      toast,
      toasts,
      dismissToast,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
