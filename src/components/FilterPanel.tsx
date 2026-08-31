import { motion } from "motion/react";
import { Check } from "lucide-react";
import { BRANDS, CATEGORIES, MAX_PRICE, MIN_PRICE } from "@/data/catalogue";
import { money, type Currency } from "@/lib/format";
import { spring } from "@/lib/motion";
import { RATING_STEPS, type FilterState } from "@/hooks/useCatalogueFilters";

interface Props {
  filters: FilterState;
  patch: (next: Partial<FilterState>) => void;
  toggleBrand: (brand: string) => void;
  reset: () => void;
  activeCount: number;
  currency: Currency;
}

export function FilterPanel({ filters, patch, toggleBrand, reset, activeCount, currency }: Props) {
  return (
    <div className="space-y-7">
      <Group title="Category">
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.category === "all"} onClick={() => patch({ category: "all" })}>
            Everything
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.id}
              active={filters.category === c.id}
              onClick={() => patch({ category: c.id })}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </Group>

      <Group
        title="Price ceiling"
        aside={<span className="font-mono text-[12.5px] text-ink">{money(filters.maxPrice, currency)}</span>}
      >
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => patch({ maxPrice: Number(e.target.value) })}
          aria-label="Maximum price"
          className="w-full accent-violet"
        />
      </Group>

      <Group title="Rating">
        <div className="flex flex-wrap gap-2">
          {RATING_STEPS.map((r) => (
            <Chip key={r} active={filters.minRating === r} onClick={() => patch({ minRating: r })} mono>
              {r === 0 ? "Any" : `${r}+`}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Brand">
        <div className="space-y-2">
          {BRANDS.map((b) => (
            <Checkbox
              key={b}
              checked={filters.brands.includes(b)}
              onChange={() => toggleBrand(b)}
              label={b}
            />
          ))}
        </div>
      </Group>

      <div className="space-y-2">
        <Checkbox
          checked={filters.inStockOnly}
          onChange={() => patch({ inStockOnly: !filters.inStockOnly })}
          label="In stock only"
        />
        <Checkbox
          checked={filters.onSaleOnly}
          onChange={() => patch({ onSaleOnly: !filters.onSaleOnly })}
          label="Reduced price only"
        />
      </div>

      {activeCount > 0 && (
        <motion.button
          type="button"
          onClick={reset}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="w-full rounded-xl bg-canvas py-2.5 text-[13px] font-semibold text-ink"
        >
          Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
        </motion.button>
      )}
    </div>
  );
}

function Group({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink-45">{title}</h3>
        {aside}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  mono = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
        mono ? "font-mono" : ""
      } ${active ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink-70 hover:border-ink-20"}`}
    >
      {children}
    </button>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-ink-70">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
          checked ? "border-violet bg-violet" : "border-line bg-surface"
        }`}
      >
        {checked && <Check size={11} className="text-white" strokeWidth={3} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}
