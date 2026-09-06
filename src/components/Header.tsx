import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { CATEGORIES } from "@/data/catalogue";
import { useShop } from "@/store/shop-context";
import { useHotkey } from "@/hooks/useKeyboard";
import { spring } from "@/lib/motion";
import { Logo } from "./Logo";

export function Header() {
  const { count, wishlist, currency, setCurrency, openCart } = useShop();
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useHotkey("/", () => inputRef.current?.focus());

  // Keep the field in sync when the URL query changes from elsewhere.
  useEffect(() => {
    const q = new URLSearchParams(search).get("q") ?? "";
    if (pathname === "/shop") setTerm(q);
  }, [pathname, search]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Searching from the shop keeps whatever filters are already applied.
    const params = new URLSearchParams(pathname === "/shop" ? search : "");
    const q = term.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    const query = params.toString();
    navigate(query ? `/shop?${query}` : "/shop");
    inputRef.current?.blur();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <motion.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-violet"
        style={{ scaleX: progress }}
        aria-hidden
      />

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="Shob — home">
          <Logo />
        </Link>

        <form onSubmit={submit} className="mx-2 hidden min-w-0 flex-1 md:block" role="search">
          <div className="relative mx-auto max-w-lg">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-45"
            />
            <input
              ref={inputRef}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search the catalogue"
              aria-label="Search the catalogue"
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-10 text-[13.5px] transition-colors focus:border-violet"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-canvas px-1.5 py-0.5 font-mono text-[11px] text-ink-45 lg:block">
              /
            </kbd>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="hidden items-center rounded-lg border border-line bg-surface p-0.5 sm:flex">
            {(["BDT", "USD"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                aria-pressed={currency === c}
                className="relative rounded-md px-2.5 py-1 font-mono text-[11.5px] font-bold"
              >
                {currency === c && (
                  <motion.span
                    layoutId="currency-pill"
                    className="absolute inset-0 rounded-md bg-ink"
                    transition={spring}
                  />
                )}
                <span className={`relative ${currency === c ? "text-white" : "text-ink-45"}`}>
                  {c}
                </span>
              </button>
            ))}
          </div>

          <Link
            to="/saved"
            className="relative rounded-xl border border-line bg-surface p-2.5"
            aria-label={`Saved items: ${wishlist.length}`}
          >
            <Heart size={17} className="text-ink-70" />
            <AnimatePresence>
              {wishlist.length > 0 && (
                <motion.span
                  key={wishlist.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={spring}
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 font-mono text-[10px] font-bold text-white"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <motion.button
            type="button"
            onClick={openCart}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-white"
            aria-label={`Open bag, ${count} items`}
          >
            <ShoppingBag size={17} />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="hidden font-mono text-[12.5px] font-bold sm:inline"
              >
                {count}
              </motion.span>
            </AnimatePresence>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-marigold px-1 font-mono text-[10px] font-bold text-white sm:hidden">
                {count}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      <nav
        className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6"
        aria-label="Categories"
      >
        <RailLink to="/shop" label="Everything" end />
        {CATEGORIES.map((c) => (
          <RailLink key={c.id} to={`/shop?cat=${c.id}`} label={c.label} />
        ))}
      </nav>
    </header>
  );
}

function RailLink({ to, label, end = false }: { to: string; label: string; end?: boolean }) {
  const { search, pathname } = useLocation();
  const target = new URLSearchParams(to.split("?")[1] ?? "").get("cat");
  const current = new URLSearchParams(search).get("cat");
  const active = pathname === "/shop" && (end ? !current : current === target);

  return (
    <NavLink
      to={to}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-surface text-ink-70 hover:border-ink-20"
      }`}
    >
      {label}
    </NavLink>
  );
}
