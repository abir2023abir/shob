import { describe, expect, it } from "vitest";
import { BRANDS, MAX_PRICE, PRODUCTS } from "@/data/catalogue";
import {
  DEFAULTS,
  applyFilters,
  countActive,
  parseFilters,
  serialiseFilters,
  type FilterState,
} from "./useCatalogueFilters";

const parse = (search: string) => parseFilters(new URLSearchParams(search));
const state = (over: Partial<FilterState> = {}): FilterState => ({ ...DEFAULTS, ...over });

describe("parseFilters", () => {
  it("falls back to the defaults on an empty query string", () => {
    expect(parse("")).toEqual(DEFAULTS);
  });

  it("reads a full query string", () => {
    expect(parse("q=honey&cat=grocery&sort=price-asc&rating=4.5&stock=1&sale=1")).toEqual(
      state({
        query: "honey",
        category: "grocery",
        sort: "price-asc",
        minRating: 4.5,
        inStockOnly: true,
        onSaleOnly: true,
      }),
    );
  });

  it("ignores a category or sort it does not recognise", () => {
    expect(parse("cat=spaceships&sort=cheapest")).toEqual(DEFAULTS);
  });

  it("ignores a rating that is not one of the offered steps", () => {
    expect(parse("rating=3.7").minRating).toBe(0);
  });

  it("clamps the price ceiling to the catalogue range", () => {
    expect(parse(`max=${MAX_PRICE * 10}`).maxPrice).toBe(MAX_PRICE);
    expect(parse("max=notanumber").maxPrice).toBe(MAX_PRICE);
  });

  it("keeps only brands that exist", () => {
    expect(parse(`brand=${BRANDS[0]},Nonexistent`).brands).toEqual([BRANDS[0]]);
  });
});

describe("serialiseFilters", () => {
  it("writes nothing for a default view", () => {
    expect(serialiseFilters(DEFAULTS).toString()).toBe("");
  });

  it("round-trips a filtered view", () => {
    const filters = state({
      query: "honey",
      category: "grocery",
      sort: "rating",
      maxPrice: 5000,
      minRating: 4.8,
      brands: [BRANDS[1], BRANDS[0]],
      onSaleOnly: true,
    });
    expect(parseFilters(serialiseFilters(filters))).toEqual({
      ...filters,
      brands: [BRANDS[0], BRANDS[1]].sort(),
    });
  });

  it("trims a padded search term", () => {
    expect(serialiseFilters(state({ query: "  honey  " })).get("q")).toBe("honey");
  });
});

describe("applyFilters", () => {
  it("returns the whole catalogue by default", () => {
    expect(applyFilters(DEFAULTS)).toHaveLength(PRODUCTS.length);
  });

  it("narrows to one category", () => {
    const results = applyFilters(state({ category: "grocery" }));
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((p) => p.cat === "grocery")).toBe(true);
  });

  it("searches names, brands, categories, and blurbs", () => {
    expect(applyFilters(state({ query: "honey" })).some((p) => p.id === "g3")).toBe(true);
    expect(applyFilters(state({ query: "HONEY" })).some((p) => p.id === "g3")).toBe(true);
    expect(applyFilters(state({ query: "zzzznothing" }))).toHaveLength(0);
  });

  it("hides sold-out items when asked", () => {
    expect(applyFilters(state({ inStockOnly: true })).every((p) => p.stock > 0)).toBe(true);
  });

  it("keeps only marked-down items when asked", () => {
    expect(applyFilters(state({ onSaleOnly: true })).every((p) => p.old !== undefined)).toBe(true);
  });

  it("respects the price ceiling", () => {
    expect(applyFilters(state({ maxPrice: 1000 })).every((p) => p.price <= 1000)).toBe(true);
  });

  it("sorts by price in both directions", () => {
    const asc = applyFilters(state({ sort: "price-asc" })).map((p) => p.price);
    expect([...asc].sort((a, b) => a - b)).toEqual(asc);

    const desc = applyFilters(state({ sort: "price-desc" })).map((p) => p.price);
    expect([...desc].sort((a, b) => b - a)).toEqual(desc);
  });

  it("does not mutate the source catalogue while sorting", () => {
    const before = PRODUCTS.map((p) => p.id);
    applyFilters(state({ sort: "price-desc" }));
    expect(PRODUCTS.map((p) => p.id)).toEqual(before);
  });
});

describe("countActive", () => {
  it("ignores the search term and the sort order", () => {
    expect(countActive(state({ query: "honey", sort: "rating" }))).toBe(0);
  });

  it("counts each applied filter, including one per brand", () => {
    const filters = state({ category: "grocery", brands: BRANDS.slice(0, 2), onSaleOnly: true });
    expect(countActive(filters)).toBe(4);
  });
});
