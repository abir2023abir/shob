import { createContext, useContext } from "react";
import type { Product } from "@/data/catalogue";
import type { Order, OrderStatus, StoreSettings } from "../lib/types";

export interface AdminValue {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  /** Wall clock captured once per session, so every chart agrees on "today". */
  now: Date;
  /** Insert or update by id — the editor does not care which. */
  saveProduct: (product: Product) => void;
  deleteProducts: (ids: string[]) => void;
  adjustStock: (id: string, delta: number) => void;
  setOrderStatus: (ref: string, status: OrderStatus) => void;
  saveSettings: (next: StoreSettings) => void;
  /** Throws away every local edit and rebuilds the demo data from the seed. */
  resetDemoData: () => void;
  toast: (message: string) => void;
  toasts: { id: number; message: string }[];
  dismissToast: (id: number) => void;
}

export const AdminContext = createContext<AdminValue | null>(null);

export function useAdmin(): AdminValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminDataProvider>");
  return ctx;
}
