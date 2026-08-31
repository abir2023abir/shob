import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, RotateCcw, Search, ShieldCheck, Truck } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Product } from "@/data/catalogue";
import { useShop } from "@/store/shop-context";
import { fadeUp, lineUp, stagger } from "@/lib/motion";
import { AuroraField } from "@/components/AuroraField";
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
  const navigate = useNavigate();
  const { currency, add, toggleWish, isWished } = useShop();
  const [term, setTerm] = useState("");
  const [quick, setQuick] = useState<Product | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const wallY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const featured = PRODUCTS.filter((p) => p.badge).slice(0, 6);
  const reduced = PRODUCTS.filter((p) => p.old).slice(0, 6);
  const wall = PRODUCTS.filter((_, i) => i % 4 === 1).slice(0, 9);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(term.trim() ? `/shop?q=${encodeURIComponent(term.trim())}` : "/shop");
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden">
        <AuroraField />

        <motion.div
          style={{ y: copyY, opacity: fade }}
          className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20"
        >
          <motion.div variants={stagger(0.1, 0.09)} initial="hidden" animate="show">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-violet-soft px-3 py-1.5 text-xs font-semibold text-violet"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
              Delivering across Bangladesh
            </motion.span>

            <h1 className="mt-5 text-[clamp(40px,7vw,72px)] font-extrabold leading-[0.98] text-ink">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    variants={lineUp}
                    className={`block ${i === 2 ? "text-violet" : ""}`}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-md text-base leading-relaxed text-ink-70">
              Eight categories, one checkout. Search the whole catalogue and the grid rearranges as
              you type.
            </motion.p>

            <motion.form variants={fadeUp} onSubmit={search} className="relative mt-6 max-w-md" role="search">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-45"
              />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Try “honey”, “keyboard”, “saree”…"
                aria-label="Search the catalogue"
                className="w-full rounded-2xl border border-line bg-surface py-4 pl-11 pr-28 text-[15px] shadow-lift transition-colors focus:border-violet"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-ink px-3.5 py-2.5 text-[13px] font-semibold text-white"
              >
                Search
              </button>
            </motion.form>

            <motion.dl variants={fadeUp} className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { value: PRODUCTS.length, label: "products live" },
                { value: CATEGORIES.length, label: "categories" },
                { value: 4.6, label: "average rating", decimals: 1 },
                { value: 48, label: "hour delivery", suffix: "h" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="font-mono text-[21px] font-bold text-ink">
                    <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix ?? ""} />
                  </dt>
                  <dd className="text-xs text-ink-45">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* The catalogue itself is the hero image. */}
          <motion.div
            style={{ y: wallY }}
            variants={stagger(0.24, 0.055)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-2.5 sm:gap-3"
          >
            {wall.map((p, i) => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 26, scale: 0.9, rotate: i % 2 ? 2 : -2 },
                  show: {
                    opacity: 1, y: 0, scale: 1, rotate: 0,
                    transition: { type: "spring", stiffness: 220, damping: 26 },
                  },
                }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="overflow-hidden rounded-2xl border border-line bg-surface"
              >
                <Link to={`/product/${p.id}`} aria-label={p.name}>
                  <ProductArt product={p} angle={i} className="block aspect-square w-full" />
                </Link>
              </motion.div>
            ))}
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
