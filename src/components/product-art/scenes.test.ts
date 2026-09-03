import { describe, expect, it } from "vitest";
import { SEED_PRODUCTS } from "@/data/catalogue";
import { PRODUCT_SCENES } from "./scenes";

describe("product scenes", () => {
  it("draws every product in the catalogue", () => {
    const missing = SEED_PRODUCTS.filter((p) => !PRODUCT_SCENES[p.id]).map((p) => p.id);
    expect(missing).toEqual([]);
  });

  it("has no scene for a product that no longer exists", () => {
    const ids = new Set(SEED_PRODUCTS.map((p) => p.id));
    const orphans = Object.keys(PRODUCT_SCENES).filter((id) => !ids.has(id));
    expect(orphans).toEqual([]);
  });

  it("gives each scene its own backdrop", () => {
    for (const [id, scene] of Object.entries(PRODUCT_SCENES)) {
      expect(scene.bg, id).toHaveLength(2);
      expect(scene.bg[0], id).toMatch(/^#[0-9A-F]{6}$/i);
      expect(scene.bg[1], id).toMatch(/^#[0-9A-F]{6}$/i);
      expect(scene.art, id).toBeTruthy();
    }
  });
});
