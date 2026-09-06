import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { SEED_PRODUCTS } from "@/data/catalogue";
import { hasPhotos, photoSrc } from "./product-photos";

const files = new Set(readdirSync(resolve(__dirname, "../../public/products")));

describe("product photography", () => {
  it("covers every seeded product", () => {
    const missing = SEED_PRODUCTS.filter((p) => !hasPhotos(p.id)).map((p) => p.id);
    expect(missing).toEqual([]);
  });

  it("points at files that are actually on disk", () => {
    const broken = SEED_PRODUCTS.flatMap((p) =>
      ([0, 1] as const)
        .map((frame) => photoSrc(p.id, frame))
        .filter((src) => !files.has(src.replace("/products/", ""))),
    );
    expect(broken).toEqual([]);
  });

  it("ships no photograph without a product to hang it on", () => {
    const ids = new Set(SEED_PRODUCTS.map((p) => p.id));
    const orphans = [...files].filter((f) => !ids.has(f.replace(/-[ab]\.jpg$/, "")));
    expect(orphans).toEqual([]);
  });

  it("falls back for a product the admin panel invents later", () => {
    expect(hasPhotos("brand-new-id")).toBe(false);
  });
});
