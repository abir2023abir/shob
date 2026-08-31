import type { CategoryId, Product } from "@/data/catalogue";

/** The editor holds numbers as strings so half-typed input stays on screen. */
export interface Draft {
  name: string;
  brand: string;
  cat: CategoryId;
  price: string;
  old: string;
  stock: string;
  rating: string;
  reviews: string;
  badge: string;
  blurb: string;
  sizes: string;
  specs: [string, string][];
}

export type DraftErrors = Partial<Record<keyof Draft, string>>;

export const BLANK_DRAFT: Draft = {
  name: "",
  brand: "",
  cat: "electronics",
  price: "",
  old: "",
  stock: "0",
  rating: "4.5",
  reviews: "0",
  badge: "",
  blurb: "",
  sizes: "",
  specs: [["", ""]],
};

export function toDraft(product: Product): Draft {
  return {
    name: product.name,
    brand: product.brand,
    cat: product.cat,
    price: String(product.price),
    old: product.old ? String(product.old) : "",
    stock: String(product.stock),
    rating: String(product.rating),
    reviews: String(product.reviews),
    badge: product.badge ?? "",
    blurb: product.blurb,
    sizes: product.sizes?.join(", ") ?? "",
    specs: product.specs.length ? product.specs.map(([k, v]) => [k, v]) : [["", ""]],
  };
}

export function validateDraft(draft: Draft): DraftErrors {
  const errors: DraftErrors = {};
  const price = Number(draft.price);
  const old = draft.old.trim() ? Number(draft.old) : null;
  const stock = Number(draft.stock);
  const rating = Number(draft.rating);
  const reviews = Number(draft.reviews);

  if (draft.name.trim().length < 3) errors.name = "Give it a name of at least three characters.";
  if (draft.brand.trim().length < 2) errors.brand = "Which brand is this?";
  if (!draft.price.trim() || !Number.isFinite(price) || price <= 0)
    errors.price = "Price must be more than zero.";
  if (old !== null && (!Number.isFinite(old) || old <= price))
    errors.old = "The old price has to be higher than the current one.";
  if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock))
    errors.stock = "Stock must be a whole number, zero or more.";
  if (!Number.isFinite(rating) || rating < 0 || rating > 5)
    errors.rating = "Rating runs from 0 to 5.";
  if (!Number.isFinite(reviews) || reviews < 0) errors.reviews = "Reviews cannot be negative.";
  if (draft.blurb.trim().length < 15) errors.blurb = "Write a sentence a shopper would find useful.";
  if (!draft.specs.some(([k, v]) => k.trim() && v.trim()))
    errors.specs = "Add at least one specification.";

  return errors;
}

/** Ids show up in storefront URLs, so they read as words rather than uuids. */
export function idFor(name: string, taken: string[]): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 28) || "product";

  if (!taken.includes(base)) return base;
  let n = 2;
  while (taken.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Turns a validated draft into the shape the catalogue stores. */
export function draftToProduct(draft: Draft, existing: Product | null, taken: string[]): Product {
  const sizes = draft.sizes
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    id: existing?.id ?? idFor(draft.name, taken),
    cat: draft.cat,
    name: draft.name.trim(),
    brand: draft.brand.trim(),
    price: Number(draft.price),
    old: draft.old.trim() ? Number(draft.old) : undefined,
    rating: Number(draft.rating),
    reviews: Number(draft.reviews),
    stock: Number(draft.stock),
    badge: draft.badge.trim() || undefined,
    sizes: sizes.length ? sizes : existing?.sizes,
    colors: existing?.colors,
    blurb: draft.blurb.trim(),
    specs: draft.specs.filter(([k, v]) => k.trim() && v.trim()),
  };
}
