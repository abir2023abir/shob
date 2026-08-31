import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CATEGORIES, type CategoryId, type Product } from "@/data/catalogue";
import { money } from "@/lib/format";
import { ProductArt } from "@/components/ProductArt";
import { Field, SidePanel } from "../components/ui";
import {
  BLANK_DRAFT,
  draftToProduct,
  toDraft,
  validateDraft,
  type Draft,
  type DraftErrors,
} from "../lib/product-draft";
import { useAdmin } from "../data/admin-context";

export function ProductEditor({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const { products, saveProduct, settings } = useAdmin();
  const [draft, setDraft] = useState<Draft>(BLANK_DRAFT);
  const [errors, setErrors] = useState<DraftErrors>({});

  // Seed the form each time the panel opens, so a cancelled edit leaves nothing behind.
  useEffect(() => {
    if (!open) return;
    setDraft(product ? toDraft(product) : BLANK_DRAFT);
    setErrors({});
  }, [open, product]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const preview: Product = {
    id: product?.id ?? "preview",
    cat: draft.cat,
    name: draft.name || "Untitled product",
    brand: draft.brand || "Brand",
    price: Number(draft.price) || 0,
    rating: Number(draft.rating) || 0,
    reviews: Number(draft.reviews) || 0,
    stock: Number(draft.stock) || 0,
    blurb: draft.blurb,
    specs: [],
  };

  const submit = () => {
    const found = validateDraft(draft);
    setErrors(found);
    if (Object.keys(found).length) return;

    saveProduct(draftToProduct(draft, product, products.map((p) => p.id)));
    onClose();
  };

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={product ? product.name : "New product"}
      subtitle={product ? `id ${product.id}` : "It goes live on the storefront's next load"}
      footer={
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="btn-quiet flex-1 py-3">
            Cancel
          </button>
          <button type="button" onClick={submit} className="btn-primary flex-1 py-3">
            {product ? "Save changes" : "Add product"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-canvas/50 p-3">
          <ProductArt product={preview} className="aspect-square w-20 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-bold text-ink">{preview.name}</p>
            <p className="font-mono text-[11.5px] text-ink-45">
              {money(preview.price, settings.defaultCurrency)}
            </p>
            <p className="mt-1 text-[11.5px] text-ink-45">
              Artwork is generated from the category — no upload needed.
            </p>
          </div>
        </div>

        <Field label="Name" error={errors.name}>
          <input
            className="field"
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Sundarban Honey, 500g"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand" error={errors.brand}>
            <input
              className="field"
              value={draft.brand}
              onChange={(e) => set("brand", e.target.value)}
              placeholder="Padma"
            />
          </Field>
          <Field label="Category">
            <select
              className="field"
              value={draft.cat}
              onChange={(e) => set("cat", e.target.value as CategoryId)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price" hint="৳" error={errors.price}>
            <input
              className="field font-mono"
              inputMode="numeric"
              value={draft.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="1250"
            />
          </Field>
          <Field label="Was" hint="optional" error={errors.old}>
            <input
              className="field font-mono"
              inputMode="numeric"
              value={draft.old}
              onChange={(e) => set("old", e.target.value)}
              placeholder="1450"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Stock" error={errors.stock}>
            <input
              className="field font-mono"
              inputMode="numeric"
              value={draft.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </Field>
          <Field label="Rating" error={errors.rating}>
            <input
              className="field font-mono"
              inputMode="decimal"
              value={draft.rating}
              onChange={(e) => set("rating", e.target.value)}
            />
          </Field>
          <Field label="Reviews" error={errors.reviews}>
            <input
              className="field font-mono"
              inputMode="numeric"
              value={draft.reviews}
              onChange={(e) => set("reviews", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Badge" hint="optional">
          <input
            className="field"
            value={draft.badge}
            onChange={(e) => set("badge", e.target.value)}
            placeholder="Bestseller"
          />
        </Field>

        <Field label="Sizes" hint="comma separated, optional">
          <input
            className="field"
            value={draft.sizes}
            onChange={(e) => set("sizes", e.target.value)}
            placeholder="S, M, L, XL"
          />
        </Field>

        <Field label="Description" error={errors.blurb}>
          <textarea
            className="field min-h-[92px] resize-y"
            value={draft.blurb}
            onChange={(e) => set("blurb", e.target.value)}
            placeholder="What makes it worth buying, in one or two sentences."
          />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-semibold text-ink-70">Specifications</span>
            <button
              type="button"
              onClick={() => set("specs", [...draft.specs, ["", ""]])}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-violet"
            >
              <Plus size={13} />
              Add row
            </button>
          </div>

          <div className="space-y-2">
            {draft.specs.map(([key, value], i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="field flex-1"
                  value={key}
                  aria-label={`Specification ${i + 1} name`}
                  placeholder="Weight"
                  onChange={(e) =>
                    set(
                      "specs",
                      draft.specs.map((row, r) => (r === i ? [e.target.value, row[1]] : row)),
                    )
                  }
                />
                <input
                  className="field flex-1"
                  value={value}
                  aria-label={`Specification ${i + 1} value`}
                  placeholder="500g"
                  onChange={(e) =>
                    set(
                      "specs",
                      draft.specs.map((row, r) => (r === i ? [row[0], e.target.value] : row)),
                    )
                  }
                />
                <button
                  type="button"
                  disabled={draft.specs.length === 1}
                  onClick={() =>
                    set(
                      "specs",
                      draft.specs.filter((_, r) => r !== i),
                    )
                  }
                  aria-label={`Remove specification ${i + 1}`}
                  className="shrink-0 rounded-xl border border-line px-2.5 text-ink-45 disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {errors.specs && <p className="mt-1.5 text-[11.5px] text-rose">{errors.specs}</p>}
        </div>
      </div>
    </SidePanel>
  );
}
