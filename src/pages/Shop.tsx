import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ChevronDown, LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, type Product } from "@/data/catalogue";
import { useCatalogueFilters, type SortKey } from "@/hooks/useCatalogueFilters";
import { useDelayedFlag } from "@/hooks/useDelayedFlag";
import { useScrollLock } from "@/hooks/useKeyboard";
import { useShop } from "@/store/shop-context";
import { fadeUp, overlay, sheet, stagger } from "@/lib/motion";
import { FilterPanel } from "@/components/FilterPanel";
import { ProductCard } from "@/components/ProductCard";
import { GridSkeleton } from "@/components/Skeleton";
import { QuickView } from "@/components/QuickView";

const SORTS: [SortKey, string][] = [
  ["relevance", "Recommended"],
  ["popular", "Most reviewed"],
  ["rating", "Top rated"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
];

export function Shop() {
  const [params, setParams] = useSearchParams();
  const { currency, add, toggleWish, isWished } = useShop();

  // The URL is the single source of truth, so every filtered grid is a link
  // someone can send. Writes replace rather than push — dragging the price
  // slider should not bury the previous page under fifty history entries.
  const { filters, patch, toggleBrand, reset, results, activeCount, signature } =
    useCatalogueFilters(params, setParams);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const loading = useDelayedFlag(signature);

  useScrollLock(sheetOpen);

  const category = CATEGORIES.find((c) => c.id === filters.category);
  const heading = category?.label ?? "Everything";

  const panel = (
    <FilterPanel
      filters={filters}
      patch={patch}
      toggleBrand={toggleBrand}
      reset={reset}
      activeCount={activeCount}
      currency={currency}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <motion.div variants={stagger(0, 0.05)} initial="hidden" animate="show">
        <motion.h1 variants={fadeUp} className="text-[clamp(28px,4vw,40px)] font-extrabold text-ink">
          {heading}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-1.5 text-sm text-ink-70">
          {category?.blurb ?? "The whole catalogue, filterable eight ways."}
        </motion.p>
      </motion.div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[224px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-36 rounded-3xl border border-line bg-surface p-5">{panel}</div>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[13px] text-ink-45">
              {results.length} result{results.length === 1 ? "" : "s"}
            </span>

            {filters.query && (
              <button
                type="button"
                onClick={() => patch({ query: "" })}
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-soft px-2.5 py-1 text-xs font-semibold text-violet"
              >
                “{filters.query}” <X size={12} />
              </button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="btn-quiet lg:hidden"
              >
                <SlidersHorizontal size={15} />
                Filters {activeCount > 0 && `(${activeCount})`}
              </button>

              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => patch({ sort: e.target.value as SortKey })}
                  aria-label="Sort results"
                  className="appearance-none rounded-xl border border-line bg-surface py-2.5 pl-3 pr-8 text-[13px] font-semibold text-ink-70"
                >
                  {SORTS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-45"
                />
              </div>

              <div className="hidden items-center rounded-xl border border-line bg-surface p-0.5 sm:flex">
                {([["grid", LayoutGrid], ["list", Rows3]] as const).map(([v, Icon]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setView(v)}
                    aria-label={`${v} view`}
                    aria-pressed={view === v}
                    className={`rounded-lg p-2 transition-colors ${view === v ? "bg-ink" : ""}`}
                  >
                    <Icon size={15} className={view === v ? "text-white" : "text-ink-45"} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <GridSkeleton />
          ) : results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-surface py-20 text-center"
            >
              <Search size={26} className="text-ink-45" />
              <p className="mt-4 font-display text-[19px] font-bold text-ink">
                No products match those filters
              </p>
              <p className="mt-1 max-w-sm text-sm text-ink-45">
                Widen the price ceiling or drop a brand to see more of the catalogue.
              </p>
              <button type="button" onClick={reset} className="btn-ink mt-5">
                Reset everything
              </button>
            </motion.div>
          ) : (
            <LayoutGroup>
              <motion.div
                variants={stagger(0, 0.04)}
                initial="hidden"
                animate="show"
                className={
                  view === "grid"
                    ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-3"
                }
              >
                <AnimatePresence mode="popLayout">
                  {results.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      view={view}
                      query={filters.query}
                      currency={currency}
                      wished={isWished(p.id)}
                      onWish={toggleWish}
                      onAdd={add}
                      onQuickView={setQuick}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </section>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-ink/50 lg:hidden"
            />
            <motion.div
              variants={sheet}
              initial="hidden"
              animate="show"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface p-5 lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-[19px] font-bold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close filters"
                  className="rounded-full bg-canvas p-2"
                >
                  <X size={16} className="text-ink-70" />
                </button>
              </div>
              {panel}
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="btn-primary mt-6 w-full py-3.5 text-[15px]"
              >
                Show {results.length} result{results.length === 1 ? "" : "s"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </div>
  );
}
