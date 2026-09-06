import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, RotateCcw, ShieldCheck, TrendingUp, Truck } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Product } from "@/data/catalogue";
import { useShop } from "@/store/shop-context";
import { EASE, fadeUp, lineUp, stagger } from "@/lib/motion";
import { AuroraField } from "@/components/AuroraField";
import { HeroWall } from "@/components/HeroWall";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { QuickView } from "@/components/QuickView";

const HEADLINE = ["Everything you", "actually need,", "in one bag."];

const TRUST = [
  { icon: Truck, title: "48-hour delivery", body: "Dhaka and Rajshahi next day, everywhere else within two." },
  { icon: RotateCcw, title: "7-day returns", body: "Send it back unopened and the refund clears in three days." },
  { icon: ShieldCheck, title: "Pay how you like", body: "bKash, Nagad, card, or cash when the rider hands it over." },
];

export function Home() {
  const { currency, add, toggleWish, isWished } = useShop();
  const [quick, setQuick] = useState<Product | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const wallY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const featured = PRODUCTS.filter((p) => p.badge).slice(0, 6);
  const reduced = PRODUCTS.filter((p) => p.old).slice(0, 6);


  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden">
        <AuroraField />
        {/* A fine rule grid, so the colour field has something to sit against. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(23,20,37,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(23,20,37,0.045) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(120% 90% at 30% 0%, #000 25%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(120% 90% at 30% 0%, #000 25%, transparent 78%)",
          }}
        />

        <motion.div
          style={{ y: copyY, opacity: fade }}
          className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20"
        >
          <motion.div variants={stagger(0.1, 0.09)} initial="hidden" animate="show">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 py-1.5 pl-2 pr-3.5 text-xs font-semibold text-ink-70 shadow-[0_1px_2px_rgba(23,20,37,0.04)] backdrop-blur"
            >
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-jade/30" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-jade" />
              </span>
              Delivering across Bangladesh
              <span className="h-3 w-px bg-line" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-45">
                48h
              </span>
            </motion.span>

            <h1 className="mt-5 text-[clamp(40px,7vw,72px)] font-extrabold leading-[0.98] text-ink">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    variants={lineUp}
                    // The last line hugs its text so the drawn stroke under it
                    // is the width of the words, not of the whole column.
                    className={`relative ${i === 2 ? "inline-block text-violet" : "block"}`}
                  >
                    {line}
                    {i === 2 && <Underline />}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-md text-base leading-relaxed text-ink-70">
              Eight categories, one checkout. Search the whole catalogue and the grid rearranges as
              you type.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-ink px-6 py-4 text-[14.5px] font-semibold text-white shadow-pop"
              >
                {/* A violet wash that wipes across on hover. */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet to-violet-deep transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.3,1)] group-hover:translate-x-0" />
                <span className="relative">Get started</span>
                <ArrowRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/shop?sort=rating"
                className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface/80 px-6 py-4 text-[14.5px] font-semibold text-ink backdrop-blur transition-colors hover:border-ink-20"
              >
                Browse best rated
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Trending />
            </motion.div>

            <motion.dl
              variants={fadeUp}
              className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 sm:grid-cols-4"
            >
              {[
                { value: PRODUCTS.length, label: "products live" },
                { value: CATEGORIES.length, label: "categories" },
                { value: 4.6, label: "average rating", decimals: 1 },
                { value: 48, label: "hour delivery", suffix: "h" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="font-mono text-[23px] font-bold leading-none text-ink">
                    <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix ?? ""} />
                  </dt>
                  <dd className="mt-1.5 text-[11.5px] leading-tight text-ink-45">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* The catalogue itself is the hero image, and it never stops moving. */}
          <motion.div
            style={{ y: wallY }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <HeroWall />
          </motion.div>
        </motion.div>

        {/* Category marquee */}
        <div className="relative border-y border-line bg-surface/70 py-3 backdrop-blur">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
            {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
              <span
                key={`${c.id}-${i}`}
                className="flex items-center gap-8 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-45"
              >
                {c.label}
                <span className="h-1 w-1 rounded-full bg-marigold" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[clamp(26px,3.4vw,38px)] font-bold text-ink">Start somewhere</h2>
            <Link to="/shop" className="text-[13.5px] font-semibold text-violet hover:underline">
              See all {PRODUCTS.length} products →
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const sample = PRODUCTS.find((p) => p.cat === c.id)!;
            const count = PRODUCTS.filter((p) => p.cat === c.id).length;
            return (
              <motion.div key={c.id} variants={fadeUp} whileHover={{ y: -5 }}>
                <Link
                  to={`/shop?cat=${c.id}`}
                  className="group block overflow-hidden rounded-3xl border border-line bg-surface"
                >
                  <ProductArt
                    product={sample}
                    className="block aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-[16px] font-bold text-ink">{c.label}</h3>
                      <ArrowRight
                        size={15}
                        className="text-ink-45 transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <p className="mt-1 text-[12.5px] text-ink-45">{c.blurb}</p>
                    <p className="mt-2 font-mono text-[11px] text-ink-45">{count} products</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </RevealGroup>
      </section>

      {/* ── Featured rails ───────────────────────────────────── */}
      <Rail
        title="What people keep buying"
        subtitle="Ranked by reviews, not by who paid us."
        products={featured}
        currency={currency}
        onAdd={add}
        onWish={toggleWish}
        isWished={isWished}
        onQuickView={setQuick}
      />

      <Rail
        title="Reduced this week"
        subtitle="Real markdowns — the old price is what it actually sold for."
        products={reduced}
        currency={currency}
        onAdd={add}
        onWish={toggleWish}
        isWished={isWished}
        onQuickView={setQuick}
      />

      {/* ── Trust band ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <RevealGroup className="grid gap-4 sm:grid-cols-3">
          {TRUST.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-3xl border border-line bg-surface p-6"
            >
              <span className="inline-flex rounded-2xl bg-jade-soft p-3">
                <Icon size={18} className="text-jade" />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-70">{body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}

/* ── Hero details ───────────────────────────────────────────── */

/**
 * A drawn stroke under the last line of the headline, rather than a border:
 * it overshoots the text on both ends and thins at the tail, which is what
 * makes it read as a mark someone made instead of a rule the browser drew.
 */
function Underline() {
  return (
    <svg
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-1 left-0 h-[0.22em] w-full overflow-visible"
      aria-hidden
    >
      <motion.path
        d="M3 11.5C58 5 132 3.2 205 5.6c31 1 62 3.2 92 6.4"
        fill="none"
        stroke="#F08000"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Cycles the best-reviewed products so the hero has a pulse of its own. */
function Trending() {
  const picks = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setAt((i) => (i + 1) % picks.length), 3200);
    return () => window.clearInterval(id);
  }, [picks.length]);

  const product = picks[at];

  return (
    <p className="mt-5 flex items-center gap-2.5 text-[13px] text-ink-45">
      <TrendingUp size={14} className="shrink-0 text-marigold-deep" />
      <span className="shrink-0">Trending now</span>
      <span className="relative block h-5 min-w-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={product.id}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="absolute inset-0 flex items-center"
          >
            <Link
              to={`/product/${product.id}`}
              className="truncate font-semibold text-ink hover:text-violet"
            >
              {product.name}
            </Link>
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

function Rail({
  title,
  subtitle,
  products,
  currency,
  onAdd,
  onWish,
  isWished,
  onQuickView,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  currency: ReturnType<typeof useShop>["currency"];
  onAdd: (p: Product) => void;
  onWish: (id: string) => void;
  isWished: (id: string) => boolean;
  onQuickView: (p: Product) => void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
      <Reveal>
        <h2 className="text-[clamp(24px,3vw,32px)] font-bold text-ink">{title}</h2>
        <p className="mt-1.5 text-sm text-ink-70">{subtitle}</p>
      </Reveal>

      <RevealGroup className="no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {products.map((p) => (
          <motion.div key={p.id} variants={fadeUp} className="w-[260px] shrink-0 sm:w-[300px]">
            <ProductCard
              product={p}
              currency={currency}
              wished={isWished(p.id)}
              onWish={onWish}
              onAdd={onAdd}
              onQuickView={onQuickView}
            />
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
