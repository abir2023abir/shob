import type { CategoryId } from "@/data/catalogue";
import type { Currency } from "@/lib/format";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "bkash" | "nagad" | "card" | "cod";

export interface OrderLine {
  id: string;
  name: string;
  cat: CategoryId;
  qty: number;
  /** Price at the time of the order — editing the catalogue must not rewrite history. */
  price: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  city: string;
  division: string;
}

export interface Order {
  ref: string;
  placedAt: string;
  customer: OrderCustomer;
  lines: OrderLine[];
  method: PaymentMethod;
  status: OrderStatus;
  promoApplied: boolean;
  note?: string;
}

export interface StoreSettings {
  storeName: string;
  supportPhone: string;
  deliveryFee: number;
  freeDeliveryAt: number;
  promoCode: string;
  /** Fraction, not a percentage: 0.1 is ten percent off. */
  promoOff: number;
  lowStockAt: number;
  defaultCurrency: Currency;
}

export interface Customer {
  phone: string;
  name: string;
  city: string;
  division: string;
  orders: number;
  spent: number;
  firstOrder: string;
  lastOrder: string;
}
