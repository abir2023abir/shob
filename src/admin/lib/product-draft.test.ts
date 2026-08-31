import { describe, expect, it } from "vitest";
import { SEED_PRODUCTS } from "@/data/catalogue";
import {
  BLANK_DRAFT,
  draftToProduct,
  idFor,
  toDraft,
  validateDraft,
  type Draft,
} from "./product-draft";

const good: Draft = {
  name: "Sundarban Honey, 500g",
  brand: "Padma",
  cat: "grocery",
  price: "1250",
  old: "1450",
  stock: "30",
  rating: "4.9",
  reviews: "1688",
  badge: "",
  blurb: "Wild-harvested from the mangroves, raw, and it will crystallise.",
  sizes: "",
  specs: [["Weight", "500g"]],
};

describe("validateDraft", () => {
  it("passes a complete draft", () => {
    expect(validateDraft(good)).toEqual({});
  });

  it("rejects an empty form rather than saving junk", () => {
    const errors = validateDraft(BLANK_DRAFT);
    expect(Object.keys(errors).sort()).toEqual(["blurb", "brand", "name", "price", "specs"]);
  });

  it("will not accept a price of zero or a non-number", () => {
    expect(validateDraft({ ...good, price: "0" }).price).toBeDefined();
    expect(validateDraft({ ...good, price: "free" }).price).toBeDefined();
  });

  it("insists a struck-through price is actually higher", () => {
    expect(validateDraft({ ...good, old: "1000" }).old).toBeDefined();
    expect(validateDraft({ ...good, old: "1250" }).old).toBeDefined();
    expect(validateDraft({ ...good, old: "" }).old).toBeUndefined();
  });

  it("keeps stock a whole number", () => {
    expect(validateDraft({ ...good, stock: "2.5" }).stock).toBeDefined();
    expect(validateDraft({ ...good, stock: "-1" }).stock).toBeDefined();
    expect(validateDraft({ ...good, stock: "0" }).stock).toBeUndefined();
  });

  it("holds ratings to the five-star scale", () => {
    expect(validateDraft({ ...good, rating: "6" }).rating).toBeDefined();
    expect(validateDraft({ ...good, rating: "0" }).rating).toBeUndefined();
  });

  it("wants at least one filled-in specification row", () => {
    expect(validateDraft({ ...good, specs: [["", ""]] }).specs).toBeDefined();
    expect(validateDraft({ ...good, specs: [["Weight", ""]] }).specs).toBeDefined();
  });
});

describe("idFor", () => {
  it("slugs the name", () => {
    expect(idFor("Sundarban Honey, 500g", [])).toBe("sundarban-honey-500g");
  });

  it("suffixes rather than colliding", () => {
    expect(idFor("Honey", ["honey"])).toBe("honey-2");
    expect(idFor("Honey", ["honey", "honey-2"])).toBe("honey-3");
  });

  it("always produces something, even from punctuation", () => {
    expect(idFor("!!!", [])).toBe("product");
  });
});

describe("draftToProduct", () => {
  it("converts the strings back into numbers", () => {
    const product = draftToProduct(good, null, []);
    expect(product.price).toBe(1250);
    expect(product.old).toBe(1450);
    expect(product.stock).toBe(30);
    expect(product.id).toBe("sundarban-honey-500g");
  });

  it("drops an empty old price instead of storing zero", () => {
    expect(draftToProduct({ ...good, old: "" }, null, []).old).toBeUndefined();
  });

  it("keeps the id and colourways when editing an existing product", () => {
    const existing = SEED_PRODUCTS.find((p) => p.colors)!;
    const product = draftToProduct(good, existing, []);
    expect(product.id).toBe(existing.id);
    expect(product.colors).toBe(existing.colors);
  });

  it("splits sizes on commas and trims them", () => {
    expect(draftToProduct({ ...good, sizes: " S , M ,L " }, null, []).sizes).toEqual([
      "S",
      "M",
      "L",
    ]);
  });

  it("throws away half-written specification rows", () => {
    const product = draftToProduct(
      { ...good, specs: [["Weight", "500g"], ["", ""], ["Origin", ""]] },
      null,
      [],
    );
    expect(product.specs).toEqual([["Weight", "500g"]]);
  });

  it("round-trips a shipped product without changing it", () => {
    const original = SEED_PRODUCTS[0];
    const product = draftToProduct(toDraft(original), original, []);
    expect(product).toEqual(original);
  });
});
