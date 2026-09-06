import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Check, Facebook, Instagram, Mail, MapPin, Youtube } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/catalogue";
import { EASE } from "@/lib/motion";
import { Logo } from "./Logo";

const COLUMNS: [string, string[]][] = [
  ["Support", ["Track an order", "Returns and refunds", "Delivery areas", "Contact us"]],
  ["Company", ["About Shob", "Sell with us", "Careers", "Press"]],
];

const SOCIAL = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
];

/** What the checkout actually accepts, written out rather than shown as logos. */
const PAYMENTS = ["bKash", "Nagad", "Visa", "Mastercard", "Cash on delivery"];

const CITIES = ["Dhaka", "Rajshahi", "Chattogram", "Khulna", "Sylhet"];

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-ink text-white">
      {/* A soft violet bloom in the corner, so the block is not a flat slab. */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet/25 blur-3xl"
        aria-hidden
      />

      <Newsletter />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/60">
            Eight categories, one bag, one checkout. Built in Rajshahi, delivering nationwide.
          </p>

          <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {CITIES.map((city) => (
              <li
                key={city}
                className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-marigold"
              >
                <MapPin size={10} className="opacity-70" />
                {city}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-2">
            {SOCIAL.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="/"
                onClick={(e) => e.preventDefault()}
                aria-label={label}
                className="rounded-xl border border-white/12 p-2.5 text-white/60 transition-colors hover:border-white/30 hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-marigold">Shop</p>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.id}>
                <FootLink to={`/shop?cat=${c.id}`}>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: `hsl(${c.hue} 68% 58%)` }}
                  />
                  {c.label}
                </FootLink>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map(([heading, items]) => (
          <div key={heading}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-marigold">
              {heading}
            </p>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item}>
                  <FootLink to="/shop">{item}</FootLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 py-6">
          <span className="mr-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
            Pay with
          </span>
          {PAYMENTS.map((p) => (
            <span
              key={p}
              className="rounded-lg border border-white/12 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] font-semibold text-white/70"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* The name, set as large as the page allows and clipped by the fold. */}
      <div className="relative select-none px-4 sm:px-6" aria-hidden>
        <p className="mx-auto max-w-7xl translate-y-[0.16em] bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center font-display text-[clamp(80px,19vw,280px)] font-extrabold leading-[0.8] tracking-tightest text-transparent">
          shob
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} Shob. A portfolio demo — {PRODUCTS.length} products, no
            real orders are placed.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-mono">React · TypeScript · Tailwind · Motion</p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 rounded-lg border border-white/12 px-2.5 py-1.5 font-semibold text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              Top
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FootLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-[13.5px] text-white/70 transition-colors hover:text-white"
    >
      {children}
      <span className="h-px w-0 bg-marigold transition-all duration-300 group-hover:w-4" />
    </Link>
  );
}

/**
 * A demo list — nothing is sent anywhere, and the confirmation says so rather
 * than pretending an email is on its way.
 */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("That does not look like an email address.");
      return;
    }
    setError(null);
    setDone(true);
  };

  return (
    <div className="relative border-b border-white/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-[clamp(24px,3.2vw,34px)] font-extrabold leading-tight text-white">
            One email a week.
            <span className="text-white/45"> What dropped, what got cheaper.</span>
          </h2>
          <p className="mt-2 text-[13.5px] text-white/55">
            No daily blasts. Unsubscribe from the footer of any of them.
          </p>
        </div>

        <div className="w-full lg:w-[380px]">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-start gap-3 rounded-2xl border border-jade/30 bg-jade/10 px-4 py-3.5"
              >
                <Check size={16} className="mt-0.5 shrink-0 text-jade" strokeWidth={3} />
                <p className="text-[13px] leading-relaxed text-white/80">
                  <span className="font-semibold text-white">You are on the list.</span> This is a
                  portfolio demo, so no email is actually sent.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={false}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-1.5 transition-colors focus-within:border-white/35">
                  <Mail size={15} className="ml-2.5 shrink-0 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="you@example.com"
                    aria-label="Email address"
                    aria-invalid={Boolean(error)}
                    className="min-w-0 flex-1 bg-transparent py-2 text-[14px] text-white outline-none placeholder:text-white/35"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-ink transition-colors hover:bg-marigold hover:text-white"
                  >
                    Subscribe
                  </button>
                </div>
                {error && (
                  <p role="alert" className="pl-2 text-[12px] text-rose">
                    {error}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
