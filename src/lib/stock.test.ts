import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/data/catalogue";
import { capToStock } from "./stock";

const stocked = PRODUCTS.find((p) => p.stock > 5)!;
const scarce = PRODUCTS.find((p) => p.stock > 0 && p.stock <= 8)!;
const soldOut = PRODUCTS.find((p) => p.stock === 0)!;

describe("capToStock", () => {
  it("leaves a quantity within stock alone", () => {
    expect(capToStock(stocked.id, 3)).toBe(3);
  });

  it("clamps a quantity above stock down to what is left", () => {
    expect(capToStock(scarce.id, scarce.stock + 40)).toBe(scarce.stock);
  });

  it("never returns less than one", () => {
    expect(capToStock(stocked.id, 0)).toBe(1);
    expect(capToStock(stocked.id, -5)).toBe(1);
    expect(capToStock(soldOut.id, 9)).toBe(1);
  });

  it("falls back to one for a product that is no longer listed", () => {
    expect(capToStock("gone-from-the-catalogue", 12)).toBe(1);
  });
});
