import { PRODUCTS } from "@/data/catalogue";

/**
 * Clamps a requested quantity to what the catalogue says is on the shelf, so a
 * cart cannot be talked into 500 units of a product with three in stock. An
 * unknown id — a line restored from an older schema — is capped at one rather
 * than dropped, since the caller has already decided the line belongs.
 */
export function capToStock(id: string, qty: number): number {
  const stock = PRODUCTS.find((p) => p.id === id)?.stock ?? 0;
  return Math.max(1, Math.min(qty, Math.max(stock, 1)));
}
