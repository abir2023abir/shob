import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { SEED_PRODUCTS } from "@/data/catalogue";
import { hasPhotos, photoSrc, photoSrcSet } from "./product-photos";

const files = new Set(readdirSync(resolve(__dirname, "../../public/products")));

/** Pulls the file names out of a srcset, dropping the width descriptors. */
function filesIn(srcSet: string): string[] {
  return srcSet.split(",").map((c) => c.trim().split(/\s+/)[0].replace("/products/", ""));
}

describe("product photography", () => {
  it("covers every seeded product", () => {
    const missing = SEED_PRODUCTS.filter((p) => !hasPhotos(p.id)).map((p) => p.id);
    expect(missing).toEqual([]);
  });

  it("points at files that are actually on disk, in both sizes", () => {
    const broken = SEED_PRODUCTS.flatMap((p) =>
      ([0, 1] as const).flatMap((frame) => [
        photoSrc(p.id, frame).replace("/products/", ""),
        ...filesIn(photoSrcSet(p.id, frame)),
      ]),
    ).filter((name) => !files.has(name));
    expect(broken).toEqual([]);
  });

  it("offers the small frame first, so a thumbnail can pick it", () => {
    const set = photoSrcSet("e1", 0);
    expect(set).toBe("/products/e1-a-sm.jpg 300w, /products/e1-a.jpg 760w");
  });

  it("ships no photograph without a product to hang it on", () => {
    const ids = new Set(SEED_PRODUCTS.map((p) => p.id));
    const orphans = [...files].filter((f) => !ids.has(f.replace(/-[ab](-sm)?\.jpg$/, "")));
    expect(orphans).toEqual([]);
  });

  it("falls back for a product the admin panel invents later", () => {
    expect(hasPhotos("brand-new-id")).toBe(false);
  });
});
