import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Package, Plus, Tag, Trash2, X } from "lucide-react";
import { useShop } from "@/store/shop-context";
import { money, PROMO } from "@/lib/format";
import { drawer, overlay, spring } from "@/lib/motion";
import { useHotkey, useScrollLock } from "@/hooks/useKeyboard";
import { ProductArt } from "./ProductArt";

export function CartDrawer() {
  const {
    cartOpen, closeCart, lines, totals, currency,
    setQty, remove, promoApplied, applyPromo, removePromo,
  } = useShop();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useScrollLock(cartOpen);
  useHotkey("Escape", closeCart, cartOpen);

  const submitPromo = () => {
    if (applyPromo(code)) {
      setError("");
      setCode("");
    } else {
      setError(`That code isn't valid. Try ${PROMO.code}.`);
    }
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-ink/45"
          />

          <motion.aside
            variants={drawer}
            initial="hidden"
            animate="show"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-surface shadow-drawer sm:w-96"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-[19px] font-bold text-ink">
                Your bag{" "}
                <span className="font-mono text-sm text-ink-45">({lines.length})</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="rounded-full bg-canvas p-2"
              >
                <X size={16} className="text-ink-70" />
              </button>
            </header>

            {lines.length > 0 && (
              <div className="px-5 pt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas">
                  <motion.div
                    className="h-full rounded-full bg-jade"
                    initial={false}
                    animate={{ width: `${totals.freeDeliveryProgress}%` }}
                    transition={spring}
                  />
                </div>
                <p
                  className={`mt-2 text-xs ${
                    totals.toFreeDelivery === 0 ? "text-jade" : "text-ink-70"
                  }`}
                >
                  {totals.toFreeDelivery === 0
                    ? "Delivery is on us."
                    : `${money(totals.toFreeDelivery, currency)} more for free delivery.`}
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-3xl bg-canvas p-5">
                    <Package size={30} className="text-ink-45" />
                  </div>
                  <p className="mt-4 font-display text-[17px] font-semibold text-ink">
                    Nothing in the bag yet
                  </p>
                  <p className="mt-1 text-[13px] text-ink-45">
                    Pick a category and start adding.
                  </p>
                  <Link to="/shop" onClick={closeCart} className="btn-ink mt-5">
                    Browse the catalogue
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                        transition={spring}
                        className="flex gap-3"
                      >
                        <ProductArt
                          product={l.product}
                          className="aspect-square w-16 shrink-0 rounded-xl"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-semibold text-ink">
                            {l.product.name}
                          </p>
                          <p className="text-[11.5px] text-ink-45">
                            {[l.opts.color, l.opts.size].filter(Boolean).join(" · ") ||
                              l.product.brand}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-lg border border-line">
                              <button
                                type="button"
                                onClick={() => setQty(l.key, -1)}
                                aria-label={`Decrease ${l.product.name}`}
                                className="px-2 py-1"
                              >
                                <Minus size={12} className="text-ink-70" />
                              </button>
                              <span className="w-6 text-center font-mono text-xs">{l.qty}</span>
                              <button
                                type="button"
                                onClick={() => setQty(l.key, 1)}
                                aria-label={`Increase ${l.product.name}`}
                                className="px-2 py-1"
                              >
                                <Plus size={12} className="text-ink-70" />
                              </button>
                            </div>
                            <span className="font-mono text-[13px] font-bold text-ink">
                              {money(l.product.price * l.qty, currency)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(l.key)}
                          aria-label={`Remove ${l.product.name}`}
                          className="self-start p-1"
                        >
                          <Trash2 size={14} className="text-ink-45" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-line px-5 py-4">
                {promoApplied ? (
                  <div className="flex items-center gap-2 rounded-lg bg-jade-soft px-3 py-2">
                    <Tag size={14} className="text-jade" />
                    <span className="text-[12.5px] font-semibold text-jade-deep">
                      {PROMO.code} applied — 10% off
                    </span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="ml-auto"
                      aria-label="Remove promo code"
                    >
                      <X size={13} className="text-jade-deep" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitPromo()}
                        placeholder="Promo code"
                        aria-label="Promo code"
                        className={`min-w-0 flex-1 rounded-lg border px-3 py-2 font-mono text-[13px] ${
                          error ? "border-rose" : "border-line"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={submitPromo}
                        className="rounded-lg bg-canvas px-3 py-2 text-[13px] font-semibold text-ink"
                      >
                        Apply
                      </button>
                    </div>
                    {error && <p className="mt-1.5 text-[11.5px] text-rose">{error}</p>}
                  </div>
                )}

                <dl className="mt-4 space-y-1.5">
                  <Row label="Subtotal" value={money(totals.subtotal, currency)} />
                  {promoApplied && (
                    <Row label="Discount" value={`−${money(totals.discount, currency)}`} />
                  )}
                  <Row
                    label="Delivery"
                    value={totals.delivery === 0 ? "Free" : money(totals.delivery, currency)}
                  />
                  <div className="flex justify-between border-t border-line pt-2">
                    <dt className="text-[15px] font-bold text-ink">Total</dt>
                    <dd className="font-mono text-[18px] font-bold text-ink">
                      {money(totals.total, currency)}
                    </dd>
                  </div>
                </dl>

                <Link to="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full py-3.5">
                  Go to checkout <ArrowRight size={16} />
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px] text-ink-70">
      <dt>{label}</dt>
      <dd className="font-mono">{value}</dd>
    </div>
  );
}
