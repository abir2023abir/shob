import type { Product } from "@/data/catalogue";
import type { Order, OrderLine, OrderStatus, PaymentMethod } from "./types";

/**
 * A tiny seeded PRNG. The demo data has to be the same on every load — a client
 * clicking around should not watch the dashboard numbers change under them —
 * and `Math.random` cannot promise that.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const FIRST = [
  "Saiful", "Nusrat", "Rafiq", "Tanvir", "Mehjabin", "Arif", "Sadia", "Imran",
  "Farhana", "Jamil", "Ruma", "Shakib", "Nabila", "Hasan", "Tasnim", "Rezaul",
  "Mim", "Anwar", "Sumaiya", "Kamrul", "Ishrat", "Bappy", "Lamia", "Sohel",
];

const LAST = [
  "Islam", "Rahman", "Ahmed", "Chowdhury", "Hossain", "Karim", "Akter", "Khan",
  "Mahmud", "Siddique", "Bhuiyan", "Sarker", "Haque", "Talukder", "Mollah",
];

const PLACES: [string, string[]][] = [
  ["Dhaka", ["Dhaka", "Savar", "Gazipur", "Narayanganj", "Keraniganj"]],
  ["Chattogram", ["Chattogram", "Cox's Bazar", "Comilla", "Feni"]],
  ["Rajshahi", ["Rajshahi", "Bogura", "Pabna", "Natore"]],
  ["Khulna", ["Khulna", "Jashore", "Satkhira"]],
  ["Sylhet", ["Sylhet", "Moulvibazar", "Habiganj"]],
  ["Barishal", ["Barishal", "Patuakhali"]],
  ["Rangpur", ["Rangpur", "Dinajpur", "Kurigram"]],
  ["Mymensingh", ["Mymensingh", "Jamalpur"]],
];

const METHODS: PaymentMethod[] = ["bkash", "bkash", "nagad", "card", "cod", "cod"];

const NOTES = [
  "Call before arriving",
  "Leave with the guard",
  "Deliver after 6pm",
  "Second gate, third floor",
];

const DAY = 86_400_000;

/**
 * Where an order has got to depends on how long ago it was placed — a two-month
 * old order sitting at "pending" would make the queue view nonsense.
 */
function statusForAge(ageDays: number, roll: number): OrderStatus {
  if (roll < 0.06) return "cancelled";
  if (ageDays >= 6) return "delivered";
  if (ageDays >= 4) return roll < 0.75 ? "delivered" : "shipped";
  if (ageDays >= 2) return roll < 0.5 ? "shipped" : "packed";
  if (ageDays >= 1) return roll < 0.5 ? "packed" : "confirmed";
  return roll < 0.6 ? "pending" : "confirmed";
}

export interface SeedOptions {
  products: Product[];
  now: Date;
  count?: number;
  days?: number;
  seed?: number;
}

/**
 * Orders cluster towards the recent past (squaring a 0–1 roll biases it that
 * way), so the revenue chart slopes like a shop that is growing rather than a
 * flat band of noise.
 */
export function generateOrders({
  products,
  now,
  count = 84,
  days = 90,
  seed = 20_260_831,
}: SeedOptions): Order[] {
  if (!products.length) return [];

  const rand = mulberry32(seed);
  const pick = <T,>(list: T[]): T => list[Math.floor(rand() * list.length)];
  const between = (low: number, high: number) => low + Math.floor(rand() * (high - low + 1));

  const orders: Order[] = [];

  for (let i = 0; i < count; i += 1) {
    const ageDays = Math.floor(rand() ** 2 * days);
    const placed = new Date(
      now.getTime() - ageDays * DAY - between(0, 23) * 3_600_000 - between(0, 59) * 60_000,
    );

    const [division, cities] = pick(PLACES);
    const lineCount = between(1, 4);
    const chosen = new Map<string, OrderLine>();

    for (let l = 0; l < lineCount; l += 1) {
      const product = pick(products);
      const existing = chosen.get(product.id);
      if (existing) {
        existing.qty += 1;
        continue;
      }
      chosen.set(product.id, {
        id: product.id,
        name: product.name,
        cat: product.cat,
        qty: between(1, 3),
        price: product.price,
      });
    }

    const withNote = rand() < 0.25;

    orders.push({
      ref: `SHB-${between(100_000, 999_999)}`,
      placedAt: placed.toISOString(),
      customer: {
        name: `${pick(FIRST)} ${pick(LAST)}`,
        phone: `01${between(3, 9)}${String(between(0, 99_999_999)).padStart(8, "0")}`,
        city: pick(cities),
        division,
      },
      lines: [...chosen.values()],
      method: pick(METHODS),
      status: statusForAge(ageDays, rand()),
      promoApplied: rand() < 0.18,
      note: withNote ? pick(NOTES) : undefined,
    });
  }

  // Newest first is what an operator wants to see when the page opens.
  return orders.sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}
