import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Plus, Eye } from "lucide-react";
import type { Product } from "@/data/catalogue";
import { discountPercent, type Currency } from "@/lib/format";
import { cardIn, spring } from "@/lib/motion";
import { ProductArt } from "./ProductArt";
import { Highlight } from "./Highlight";
import { Stars } from "./Stars";
import { Price } from "./Price";
import { Pill } from "./Pill";

interface Props {
  product: Product;
  currency: Currency;
  view?: "grid" | "list";
  query?: string;
  wished: boolean;
  onWish: (id: string) => void;
  onAdd: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({
  product,
  currency,
  view = "grid",
  query = "",
  wished,
  onWish,
  onAdd,
  onQuickView,
}: Props) {
  const out = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 8;
  const off = discountPercent(product.price, product.old);
  const row = view === "list";

  return (
    <motion.article
      layout
      variants={cardIn}
      exit="exit"
      whileHover={{ y: -4 }}
      transition={spring}
      className={`group relative overflow-hidden rounded-3xl border border-line bg-surface ${
        row ? "flex gap-4 p-3" : "flex flex-col"
      }`}
    >
      <div className={`relative overflow-hidden ${row ? "w-32 shrink-0 rounded-2xl" : ""}`}>
        <Link to={`/product/${product.id}`} aria-label={`Open ${product.name}`}>
          <ProductArt
            product={product}
            className={`block aspect-square w-full transition-transform duration-500 group-hover:scale-105 ${
              row ? "" : "sm:aspect-[4/3]"
            }`}
          />
        </Link>

        {out && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-xs font-bold tracking-widest text-white">
            OUT OF STOCK
          </span>
        )}

        {!out && off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-marigold px-2 py-1 font-mono text-[11px] font-bold text-white">
            −{off}%
          </span>
        )}

        {!row && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-xl bg-surface/95 px-3 py-2 text-xs font-semibold text-ink shadow-lift backdrop-blur transition-all duration-300 hover:scale-[1.03] focus-visible:opacity-100 group-hover:opacity-100 sm:flex sm:opacity-0"
          >
            <Eye size={13} /> Quick view
          </button>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${row ? "" : "p-4"}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-45">
              {product.brand}
            </p>
            <h3 className="mt-1 truncate font-display text-[15px] font-semibold text-ink">
              <Link to={`/product/${product.id}`} className="hover:text-violet">
                <Highlight text={product.name} query={query} />
              </Link>
            </h3>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.86 }}
            onClick={() => onWish(product.id)}
            aria-pressed={wished}
            aria-label={wished ? "Remove from saved" : "Save for later"}
            className={`shrink-0 rounded-full p-2 transition-colors ${
              wished ? "bg-rose-soft" : "bg-canvas"
            }`}
          >
            <Heart
              size={15}
              className={wished ? "fill-rose text-rose" : "text-ink-45"}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <Stars value={product.rating} />
          <span className="text-[11px] text-ink-45">
            {product.reviews.toLocaleString()} reviews
          </span>
        </div>

        {product.badge ? (
          <div className="mt-3">
            <Pill tone={low ? "marigold" : "jade"}>{product.badge}</Pill>
          </div>
        ) : low ? (
          <div className="mt-3">
            <Pill tone="marigold">Only {product.stock} left</Pill>
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <Price price={product.price} old={product.old} currency={currency} />
          <motion.button
            type="button"
            disabled={out}
            whileHover={out ? undefined : { scale: 1.04 }}
            whileTap={out ? undefined : { scale: 0.95 }}
            onClick={() => onAdd(product)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold ${
              out ? "cursor-not-allowed bg-canvas text-ink-45" : "bg-ink text-white"
            }`}
          >
            <Plus size={14} /> {out ? "Notify me" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
