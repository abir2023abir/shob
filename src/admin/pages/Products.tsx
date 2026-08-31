import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Package, Pencil, Plus, Search, Trash2, TriangleAlert } from "lucide-react";
import { CATEGORIES, categoryOf, type CategoryId, type Product } from "@/data/catalogue";
import { discountPercent, money, plural } from "@/lib/format";
import { fadeUp, stagger } from "@/lib/motion";
import { ProductArt } from "@/components/ProductArt";
import { Confirm, Empty, Panel } from "../components/ui";
import { useAdmin } from "../data/admin-context";
import { ProductEditor } from "./ProductEditor";

type StockFilter = "all" | "low" | "out";
type SortKey = "name" | "price-desc" | "price-asc" | "stock" | "rating";

export function Products() {
  const { products, settings, deleteProducts, adjustStock } = useAdmin();
  const currency = settings.defaultCurrency;

  const [term, setTerm] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [confirming, setConfirming] = useState<string[] | null>(null);

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    const matched = products.filter((p) => {
      if (cat !== "all" && p.cat !== cat) return false;
      if (stockFilter === "out" && p.stock !== 0) return false;
      if (stockFilter === "low" && (p.stock === 0 || p.stock > settings.lowStockAt)) return false;
      if (!q) return true;
      return `${p.name} ${p.brand} ${p.id}`.toLowerCase().includes(q);
    });

    const order: Record<SortKey, (a: Product, b: Product) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      "price-desc": (a, b) => b.price - a.price,
      "price-asc": (a, b) => a.price - b.price,
      stock: (a, b) => a.stock - b.stock,
      rating: (a, b) => b.rating - a.rating,
    };

    return [...matched].sort(order[sort]);
  }, [products, term, cat, stockFilter, sort, settings.lowStockAt]);

  const allShownSelected = rows.length > 0 && rows.every((p) => selected.includes(p.id));

  const toggleAll = () =>
    setSelected(allShownSelected ? [] : rows.map((p) => p.id));

  const toggle = (id: string) =>
    setSelected((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const restockSelected = () => {
    selected.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product && product.stock <= settings.lowStockAt) {
        adjustStock(id, settings.lowStockAt * 3 - product.stock);
      }
    });
    setSelected([]);
  };

  return (
    <motion.div variants={stagger(0, 0.05)} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(24px,3vw,30px)] font-extrabold text-ink">Products</h1>
          <p className="mt-1 text-[13.5px] text-ink-70">
            {plural(products.length, "product")} live on the storefront.
          </p>
        </div>
        <button type="button" onClick={() => setEditing("new")} className="btn-primary">
          <Plus size={16} />
          New product
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-45"
          />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Name, brand, or id…"
            aria-label="Search products"
            className="w-56 rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-[13px] transition-colors focus:border-violet"
          />
        </div>

        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as CategoryId | "all")}
          aria-label="Filter by category"
          className="rounded-xl border border-line bg-surface px-3 py-2.5 text-[13px] font-semibold text-ink-70"
        >
          <option value="all">Every category</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as StockFilter)}
          aria-label="Filter by stock"
          className="rounded-xl border border-line bg-surface px-3 py-2.5 text-[13px] font-semibold text-ink-70"
        >
          <option value="all">Any stock level</option>
          <option value="low">Running low</option>
          <option value="out">Out of stock</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort products"
          className="ml-auto rounded-xl border border-line bg-surface px-3 py-2.5 text-[13px] font-semibold text-ink-70"
        >
          <option value="name">A to Z</option>
          <option value="price-desc">Price: high to low</option>
          <option value="price-asc">Price: low to high</option>
          <option value="stock">Stock: low first</option>
          <option value="rating">Best rated</option>
        </select>
      </motion.div>

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-violet/30 bg-violet-soft px-4 py-3"
        >
          <p className="text-[13px] font-semibold text-violet-deep">
            {plural(selected.length, "product")} selected
          </p>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={restockSelected}
              className="rounded-lg bg-surface px-3 py-2 text-[12.5px] font-semibold text-ink"
            >
              Restock the low ones
            </button>
            <button
              type="button"
              onClick={() => setConfirming(selected)}
              className="rounded-lg bg-rose px-3 py-2 text-[12.5px] font-semibold text-white"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="rounded-lg px-3 py-2 text-[12.5px] font-semibold text-ink-70"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <Panel>
          {rows.length === 0 ? (
            <Empty
              title="No products match"
              body="Widen the filters, or add a product to the catalogue."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-ink-45">
                    <th className="w-10 px-5 py-3">
                      <input
                        type="checkbox"
                        checked={allShownSelected}
                        onChange={toggleAll}
                        aria-label="Select every product shown"
                        className="h-4 w-4 accent-violet"
                      />
                    </th>
                    <th className="px-3 py-3 font-semibold">Product</th>
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 text-right font-semibold">Price</th>
                    <th className="px-3 py-3 text-right font-semibold">Stock</th>
                    <th className="px-3 py-3 text-right font-semibold">Rating</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((p) => {
                    const off = discountPercent(p.price, p.old);
                    const low = p.stock > 0 && p.stock <= settings.lowStockAt;

                    return (
                      <tr key={p.id} className="transition-colors hover:bg-canvas/60">
                        <td className="px-5 py-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(p.id)}
                            onChange={() => toggle(p.id)}
                            aria-label={`Select ${p.name}`}
                            className="h-4 w-4 accent-violet"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <ProductArt
                              product={p}
                              className="aspect-square w-10 shrink-0 rounded-lg"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-semibold text-ink">
                                {p.name}
                              </p>
                              <p className="font-mono text-[11px] uppercase tracking-wide text-ink-45">
                                {p.brand} · {p.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-[12.5px] text-ink-70">
                          {categoryOf(p.cat).label}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <p className="font-mono text-[13px] font-bold text-ink">
                            {money(p.price, currency)}
                          </p>
                          {off > 0 && (
                            <p className="font-mono text-[11px] text-marigold-deep">−{off}%</p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-[12.5px] font-semibold ${
                              p.stock === 0
                                ? "text-rose"
                                : low
                                  ? "text-marigold-deep"
                                  : "text-ink-70"
                            }`}
                          >
                            {(p.stock === 0 || low) && <TriangleAlert size={12} />}
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-[12.5px] text-ink-70">
                          {p.rating.toFixed(1)}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditing(p)}
                              aria-label={`Edit ${p.name}`}
                              className="rounded-lg border border-line p-2 text-ink-70 transition-colors hover:border-ink-20"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirming([p.id])}
                              aria-label={`Delete ${p.name}`}
                              className="rounded-lg border border-line p-2 text-rose transition-colors hover:border-rose"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <footer className="flex items-center gap-2 border-t border-line px-5 py-3 text-[12px] text-ink-45">
            <Package size={13} />
            Showing {rows.length} of {products.length}. Edits publish to the storefront on its next
            load.
          </footer>
        </Panel>
      </motion.div>

      <ProductEditor
        product={editing === "new" ? null : editing}
        open={editing !== null}
        onClose={() => setEditing(null)}
      />

      <Confirm
        open={confirming !== null}
        title={confirming && confirming.length > 1 ? "Delete these products?" : "Delete this product?"}
        body="They disappear from the storefront on its next load. Past orders keep the name and price they were bought at."
        onCancel={() => setConfirming(null)}
        onConfirm={() => {
          if (confirming) deleteProducts(confirming);
          setSelected([]);
          setConfirming(null);
        }}
      />
    </motion.div>
  );
}
