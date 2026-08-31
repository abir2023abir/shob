import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck, X } from "lucide-react";
import type { Product } from "@/data/catalogue";
import { categoryOf } from "@/data/catalogue";
import { FREE_DELIVERY_AT, money } from "@/lib/format";
import { modal, overlay } from "@/lib/motion";
import { useShop } from "@/store/shop-context";
import { useHotkey, useScrollLock } from "@/hooks/useKeyboard";
import { ProductArt } from "./ProductArt";
import { Stars } from "./Stars";
import { Price } from "./Price";

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  return (
    <AnimatePresence>{product && <Panel product={product} onClose={onClose} />}</AnimatePresence>
  );
}

function Panel({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add, currency, toggleWish, isWished } = useShop();
  const [angle, setAngle] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState(product.sizes?.[1]);
  const [qty, setQty] = useState(1);

  const out = product.stock === 0;
  const wished = isWished(product.id);

  useScrollLock(true);
  useHotkey("Escape", onClose);

  return (
    <>
      <motion.div
        variants={overlay}
        initial="hidden"
        animate="show"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-ink/50"
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <motion.div
          variants={modal}
          initial="hidden"
          animate="show"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          className="pointer-events-auto max-h-full w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-surface shadow-pop sm:rounded-3xl"
        >
          <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
            <div>
              <div className="overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={angle}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <ProductArt product={product} angle={angle} animate className="block aspect-square w-full" />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 flex gap-2">
                {[0, 1, 2, 3].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAngle(a)}
                    aria-label={`View angle ${a + 1}`}
                    aria-pressed={angle === a}
                    className={`w-16 overflow-hidden rounded-xl border-2 transition-colors ${
                      angle === a ? "border-violet" : "border-line"
                    }`}
                  >
                    <ProductArt product={product} angle={a} className="block aspect-square w-full" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-45">
                  {product.brand} · {categoryOf(product.cat).label}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full bg-canvas p-1.5"
                >
                  <X size={16} className="text-ink-70" />
                </button>
              </div>

              <h2 className="mt-2 font-display text-[27px] font-bold leading-tight text-ink">
                {product.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-70">{product.blurb}</p>

              <div className="mt-3 flex items-center gap-3">
                <Stars value={product.rating} size={14} />
                <span className="text-xs text-ink-45">
                  {product.reviews.toLocaleString()} reviews
                </span>
              </div>

              <div className="mt-4">
                <Price price={product.price} old={product.old} currency={currency} size="lg" />
              </div>

              {product.colors && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-ink-70">Colour · {color}</p>
                  <div className="mt-2 flex gap-2">
                    {product.colors.map((c) => (
                      <motion.button
                        key={c.name}
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setColor(c.name)}
                        aria-label={c.name}
                        aria-pressed={color === c.name}
                        className={`h-8 w-8 rounded-full ring-offset-2 ${
                          color === c.name ? "ring-2 ring-violet" : "ring-1 ring-line"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-ink-70">Size</p>
                  <div className="mt-2 flex gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={size === s}
                        className={`rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                          size === s ? "border-ink bg-ink text-white" : "border-line text-ink-70"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-line">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5"
                  >
                    <Minus size={14} className="text-ink-70" />
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))}
                    aria-label="Increase quantity"
                    className="p-2.5"
                  >
                    <Plus size={14} className="text-ink-70" />
                  </button>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWish(product.id)}
                  aria-label="Save for later"
                  className={`rounded-xl border border-line p-3 ${wished ? "bg-rose-soft" : ""}`}
                >
                  <Heart size={16} className={wished ? "fill-rose text-rose" : "text-ink-70"} />
                </motion.button>
              </div>

              <motion.button
                type="button"
                disabled={out}
                whileTap={out ? undefined : { scale: 0.98 }}
                onClick={() => {
                  add(product, qty, { color, size });
                  onClose();
                }}
                className="btn-primary mt-4 w-full py-3.5 text-[15px]"
              >
                <ShoppingBag size={17} />
                {out ? "Out of stock" : `Add ${qty} to bag`}
              </motion.button>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="mt-2 text-center text-[13px] font-semibold text-violet hover:underline"
              >
                See full details
              </Link>

              <ul className="mt-5 space-y-2">
                {[
                  [
                    Truck,
                    product.price >= FREE_DELIVERY_AT
                      ? "Free delivery on this item"
                      : `Free delivery over ${money(FREE_DELIVERY_AT, currency)}`,
                  ],
                  [RotateCcw, "7-day return, no questions"],
                  [ShieldCheck, "Pay on delivery, bKash, or card"],
                ].map(([Icon, text]) => {
                  const I = Icon as typeof Truck;
                  return (
                    <li key={text as string} className="flex items-center gap-2.5 text-[12.5px] text-ink-70">
                      <I size={15} className="text-jade" />
                      {text as string}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
