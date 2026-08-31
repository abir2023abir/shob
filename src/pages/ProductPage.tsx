import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck,
} from "lucide-react";
import { categoryOf, productById, relatedTo, type Product } from "@/data/catalogue";
import { FREE_DELIVERY_AT, discountPercent, money } from "@/lib/format";
import { fadeUp, stagger } from "@/lib/motion";
import { useShop } from "@/store/shop-context";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { Price } from "@/components/Price";
import { Pill } from "@/components/Pill";
import { QuickView } from "@/components/QuickView";
import { NotFound } from "./NotFound";

export function ProductPage() {
  const { id = "" } = useParams();
  const product = productById(id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!product) return <NotFound />;
  return <Detail key={product.id} product={product} />;
}

function Detail({ product }: { product: Product }) {
  const { add, currency, toggleWish, isWished, openCart } = useShop();
  const [angle, setAngle] = useState(0);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState(product.sizes?.[1]);
  const [qty, setQty] = useState(1);
  const [quick, setQuick] = useState<Product | null>(null);

  const out = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 8;
  const off = discountPercent(product.price, product.old);
  const category = categoryOf(product.cat);
  const related = relatedTo(product);
  const wished = isWished(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <nav className="flex items-center gap-1.5 text-[12.5px] text-ink-45" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={13} />
        <Link to={`/shop?cat=${product.cat}`} className="hover:text-ink">{category.label}</Link>
        <ChevronRight size={13} />
        <span className="truncate text-ink-70">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <motion.div variants={stagger(0, 0.06)} initial="hidden" animate="show">
          <motion.div
            variants={fadeUp}
            className="overflow-hidden rounded-3xl border border-line bg-surface"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={angle}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ProductArt product={product} angle={angle} animate className="block aspect-square w-full" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAngle(a)}
                aria-label={`View angle ${a + 1}`}
                aria-pressed={angle === a}
                className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                  angle === a ? "border-violet" : "border-line"
                }`}
              >
                <ProductArt product={product} angle={a} className="block aspect-square w-full" />
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Buy panel */}
        <motion.div variants={stagger(0.08, 0.055)} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-45">
              {product.brand}
            </p>
            {product.badge && <Pill tone={low ? "marigold" : "jade"}>{product.badge}</Pill>}
            {off > 0 && <Pill tone="marigold">−{off}% this week</Pill>}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-2 text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.05] text-ink"
          >
            {product.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-3 text-[15px] leading-relaxed text-ink-70">
            {product.blurb}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-4 flex items-center gap-3">
            <Stars value={product.rating} size={14} />
            <span className="text-xs text-ink-45">{product.reviews.toLocaleString()} reviews</span>
            <span className="text-xs text-ink-20">·</span>
            <span className={`text-xs font-semibold ${out ? "text-rose" : low ? "text-marigold-deep" : "text-jade"}`}>
              {out ? "Out of stock" : low ? `Only ${product.stock} left` : "In stock"}
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5">
            <Price price={product.price} old={product.old} currency={currency} size="lg" />
          </motion.div>

          {product.colors && (
            <motion.div variants={fadeUp} className="mt-6">
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
                    className={`h-9 w-9 rounded-full ring-offset-2 ${
                      color === c.name ? "ring-2 ring-violet" : "ring-1 ring-line"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {product.sizes && (
            <motion.div variants={fadeUp} className="mt-6">
              <p className="text-xs font-semibold text-ink-70">Size</p>
              <div className="mt-2 flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                      size === s ? "border-ink bg-ink text-white" : "border-line text-ink-70"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-line">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="p-3">
                <Minus size={15} className="text-ink-70" />
              </button>
              <span className="w-9 text-center font-mono text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))}
                aria-label="Increase quantity"
                className="p-3"
              >
                <Plus size={15} className="text-ink-70" />
              </button>
            </div>

            <motion.button
              type="button"
              disabled={out}
              whileTap={out ? undefined : { scale: 0.98 }}
              onClick={() => {
                add(product, qty, { color, size });
                openCart();
              }}
              className="btn-primary flex-1 py-3.5 text-[15px]"
            >
              <ShoppingBag size={17} /> {out ? "Out of stock" : "Add to bag"}
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWish(product.id)}
              aria-label="Save for later"
              className={`rounded-xl border border-line p-3.5 ${wished ? "bg-rose-soft" : "bg-surface"}`}
            >
              <Heart size={18} className={wished ? "fill-rose text-rose" : "text-ink-70"} />
            </motion.button>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              [Truck, product.price >= FREE_DELIVERY_AT ? "Free delivery" : `Free over ${money(FREE_DELIVERY_AT, currency)}`],
              [RotateCcw, "7-day returns"],
              [ShieldCheck, "bKash, card, or COD"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Truck;
              return (
                <li
                  key={label as string}
                  className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5 text-[12.5px] text-ink-70"
                >
                  <I size={15} className="shrink-0 text-jade" />
                  {label as string}
                </li>
              );
            })}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-8">
            <h2 className="font-display text-[17px] font-bold text-ink">Specifications</h2>
            <dl className="mt-3 overflow-hidden rounded-2xl border border-line">
              {product.specs.map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex justify-between gap-4 px-4 py-3 text-[13.5px] ${
                    i % 2 ? "bg-surface" : "bg-canvas/60"
                  }`}
                >
                  <dt className="text-ink-45">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold text-ink">
            More from {category.label}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                currency={currency}
                wished={isWished(p.id)}
                onWish={toggleWish}
                onAdd={add}
                onQuickView={setQuick}
              />
            ))}
          </div>
        </section>
      )}

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </div>
  );
}
