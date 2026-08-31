import { useCallback, useMemo } from "react";
import {
  BRANDS,
  CATEGORIES,
  MAX_PRICE,
  MIN_PRICE,
  PRODUCTS,
  categoryOf,
  type CategoryId,
  type Product,
} from "@/data/catalogue";

export type SortKey = "relevance" | "popular" | "rating" | "price-asc" | "price-desc";

export interface FilterState {
  query: string;
  category: CategoryId | "all";
  sort: SortKey;
  maxPrice: number;
  minRating: number;
  brands: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

/** The rating thresholds the panel offers — also the values the URL accepts. */
export const RATING_STEPS = [0, 4, 4.5, 4.8];

export const SORT_KEYS: SortKey[] = ["relevance", "popular", "rating", "price-asc", "price-desc"];

export const DEFAULTS: FilterState = {
  query: "",
  category: "all",
  sort: "relevance",
  maxPrice: MAX_PRICE,
  minRating: 0,
  brands: [],
  inStockOnly: false,
  onSaleOnly: false,
};

const COMPARATORS: Record<SortKey, (a: Product, b: Product) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  popular: (a, b) => b.reviews - a.reviews,
  relevance: (a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.rating - a.rating,
};

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));

/**
 * The query string is the single source of truth for the catalogue view, so any
 * filtered grid is a link someone can send. Unknown or out-of-range values fall
 * back to the default rather than throwing — a hand-edited URL still renders.
 */
export function parseFilters(params: URLSearchParams): FilterState {
  const cat = params.get("cat");
  const sort = params.get("sort");
  const max = Number(params.get("max"));
  const rating = Number(params.get("rating"));

  return {
    query: params.get("q") ?? DEFAULTS.query,
    category: cat && CATEGORY_IDS.has(cat) ? (cat as CategoryId) : DEFAULTS.category,
    sort: SORT_KEYS.includes(sort as SortKey) ? (sort as SortKey) : DEFAULTS.sort,
    maxPrice: Number.isFinite(max) && max > 0 ? clamp(max, MIN_PRICE, MAX_PRICE) : DEFAULTS.maxPrice,
    minRating: RATING_STEPS.includes(rating) ? rating : DEFAULTS.minRating,
    brands: (params.get("brand") ?? "")
      .split(",")
      .map((b) => b.trim())
      .filter((b) => BRANDS.includes(b)),
    inStockOnly: params.get("stock") === "1",
    onSaleOnly: params.get("sale") === "1",
  };
}

/** Only non-default values reach the URL, so a plain `/shop` stays plain. */
export function serialiseFilters(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  const query = filters.query.trim();

  if (query) params.set("q", query);
  if (filters.category !== "all") params.set("cat", filters.category);
  if (filters.sort !== DEFAULTS.sort) params.set("sort", filters.sort);
  if (filters.maxPrice < MAX_PRICE) params.set("max", String(Math.round(filters.maxPrice)));
  if (filters.minRating > 0) params.set("rating", String(filters.minRating));
  if (filters.brands.length) params.set("brand", [...filters.brands].sort().join(","));
  if (filters.inStockOnly) params.set("stock", "1");
  if (filters.onSaleOnly) params.set("sale", "1");

  return params;
}

export function applyFilters(filters: FilterState, products: Product[] = PRODUCTS): Product[] {
  const q = filters.query.trim().toLowerCase();

  const matched = products.filter((p) => {
    if (filters.category !== "all" && p.cat !== filters.category) return false;
    if (p.price > filters.maxPrice) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (filters.inStockOnly && p.stock === 0) return false;
    if (filters.onSaleOnly && !p.old) return false;
    if (q) {
      const haystack = `${p.name} ${p.brand} ${categoryOf(p.cat).label} ${p.blurb}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return matched.sort(COMPARATORS[filters.sort]);
}

/** How many filters the visitor has actually set — search and sort do not count. */
export function countActive(filters: FilterState): number {
  return (
    (filters.category !== "all" ? 1 : 0) +
    (filters.maxPrice < MAX_PRICE ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.brands.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0)
  );
}

type SetParams = (next: URLSearchParams, options?: { replace?: boolean }) => void;

/**
 * Reads the catalogue view out of the URL and writes every change back to it.
 * Nothing is mirrored into local state, so the two can never drift apart and
 * any filtered grid is a link. Writes replace the current entry rather than
 * pushing, so Back leaves the shop instead of unwinding one filter at a time.
 */
export function useCatalogueFilters(params: URLSearchParams, setParams: SetParams) {
  const filters = useMemo(() => parseFilters(params), [params]);

  const write = useCallback(
    (next: FilterState) => setParams(serialiseFilters(next), { replace: true }),
    [setParams],
  );

  const patch = useCallback(
    (next: Partial<FilterState>) => write({ ...filters, ...next }),
    [filters, write],
  );

  const toggleBrand = useCallback(
    (brand: string) =>
      write({
        ...filters,
        brands: filters.brands.includes(brand)
          ? filters.brands.filter((b) => b !== brand)
          : [...filters.brands, brand],
      }),
    [filters, write],
  );

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams]);

  const results = useMemo(() => applyFilters(filters), [filters]);

  return {
    filters,
    patch,
    toggleBrand,
    reset,
    results,
    activeCount: countActive(filters),
    /** Changing any of these should retrigger the grid's entrance sequence. */
    signature: params.toString(),
  };
}
