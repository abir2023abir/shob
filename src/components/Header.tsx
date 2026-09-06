import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { CATEGORIES, PRODUCTS, categoryOf, type CategoryId } from "@/data/catalogue";
import { money } from "@/lib/format";
import { useShop } from "@/store/shop-context";
import { EASE, spring } from "@/lib/motion";
import { Logo } from "./Logo";
import { HeaderSearch } from "./HeaderSearch";
import { ProductArt } from "./ProductArt";

/** Past this many pixels the header is allowed to condense. */
const CONDENSE_AT = 90;

export function Header() {
  const { count, wishlist, currency, setCurrency, openCart } = useShop();
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // The rail folds away as you read down the page and comes back the moment
  // you scroll up, so navigation is never more than a flick away.
  // Driven via data-compact attribute on the header element so React never
  // re-renders during scroll.
  const headerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const isCompact = useRef(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const down = y > lastY.current;
    lastY.current = y;
    const next = y >= CONDENSE_AT && down;
    if (next !== isCompact.current) {
      isCompact.current = next;
      if (headerRef.current) {
        headerRef.current.dataset.compact = String(next);
      }
    }
  });

  // Keep the field in sync when the URL query changes from elsewhere.
  useEffect(() => {
    const q = new URLSearchParams(search).get("q") ?? "";
    if (pathname === "/shop") setTerm(q);
  }, [pathname, search]);

  const submit = () => {
    // Searching from the shop keeps whatever filters are already applied.
    const params = new URLSearchParams(pathname === "/shop" ? search : "");
    const q = term.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    const query = params.toString();
    navigate(query ? `/shop?${query}` : "/shop");
  };

  return (
    <CategoryMenu>
      {(menu) => (
        <header
          ref={headerRef}
          data-compact="false"
          className="sticky top-0 z-40 border-b border-line/80 bg-canvas/90 backdrop-blur-md will-change-transform [transform:translateZ(0)]"
        >
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-violet via-rose to-marigold"
            style={{ scaleX: progress }}
            aria-hidden
          />

          <div
            className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 transition-[padding] duration-300 sm:px-6 [[data-compact=true]_&]:py-2"
          >
            <Link to="/" className="shrink-0" aria-label="Shob — home">
              <Logo />
            </Link>

            <div className="mx-2 hidden min-w-0 flex-1 justify-center md:flex">
              <div className="w-full max-w-lg">
                <HeaderSearch
                  term={term}
                  onTermChange={setTerm}
                  onSubmit={submit}
                  hotkey
                />
              </div>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <div className="hidden items-center rounded-xl border border-line bg-surface p-0.5 sm:flex">
                {(["BDT", "USD"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    aria-pressed={currency === c}
                    className="relative rounded-lg px-2.5 py-1 font-mono text-[11.5px] font-bold"
                  >
                    {currency === c && (
                      <motion.span
                        layoutId="currency-pill"
                        className="absolute inset-0 rounded-lg bg-ink"
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
                className="relative rounded-xl border border-line bg-surface p-2.5 transition-colors hover:border-ink-20"
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
                className="relative flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-white transition-opacity hover:opacity-90"
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

          {/* Search moves under the logo on phones, where the row has no space. */}
          <div className="px-4 pb-2.5 md:hidden">
            <HeaderSearch term={term} onTermChange={setTerm} onSubmit={submit} compact />
          </div>

          <div className="rail-wrapper overflow-hidden">
            <nav
              className="no-scrollbar mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 pb-3 sm:px-6"
              aria-label="Categories"
              onMouseLeave={menu.leave}
            >
              <RailLink to="/shop" label="Everything" end onHover={menu.close} />
              {CATEGORIES.map((c) => (
                <RailLink
                  key={c.id}
                  to={`/shop?cat=${c.id}`}
                  label={c.label}
                  hue={c.hue}
                  onHover={() => menu.enter(c.id)}
                />
              ))}
            </nav>
          </div>

          <MegaPanel open={menu.open} onClose={menu.close} onKeep={menu.hold} />
        </header>
      )}
    </CategoryMenu>
  );
}

/* ── The category rail ──────────────────────────────────────── */

function RailLink({
  to,
  label,
  hue,
  end = false,
  onHover,
}: {
  to: string;
  label: string;
  hue?: number;
  end?: boolean;
  onHover: () => void;
}) {
  const { search, pathname } = useLocation();
  const target = new URLSearchParams(to.split("?")[1] ?? "").get("cat");
  const current = new URLSearchParams(search).get("cat");
  const active = pathname === "/shop" && (end ? !current : current === target);

  return (
    <NavLink
      to={to}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`relative shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
        active ? "text-white" : "text-ink-70 hover:text-ink"
      }`}
    >
      {active && (
        <span
          className="absolute inset-0 rounded-full bg-ink"
        />
      )}
      <span className="relative flex items-center gap-1.5">
        {hue !== undefined && (
          <span
            className="h-1.5 w-1.5 rounded-full transition-opacity"
            style={{
              background: `hsl(${hue} 68% 52%)`,
              opacity: active ? 1 : 0.75,
            }}
          />
        )}
        {label}
      </span>
    </NavLink>
  );
}

/* ── The mega panel ─────────────────────────────────────────── */

interface Menu {
  open: CategoryId | null;
  enter: (id: CategoryId) => void;
  leave: () => void;
  close: () => void;
  hold: () => void;
}

/**
 * Hover intent for the rail. Opening waits a beat so that dragging the mouse
 * across the rail does not flash eight panels, and closing waits too, so you
 * can travel diagonally from a pill down into the panel without losing it.
 */
function CategoryMenu({ children }: { children: (menu: Menu) => React.ReactNode }) {
  const [open, setOpen] = useState<CategoryId | null>(null);
  const timer = useRef<number>();
  const { pathname } = useLocation();

  const clear = () => window.clearTimeout(timer.current);
  useEffect(() => () => clear(), []);

  // Navigating anywhere should not leave a panel hanging open.
  useEffect(() => {
    clear();
    setOpen(null);
  }, [pathname]);

  const menu: Menu = {
    open,
    enter: (id) => {
      clear();
      timer.current = window.setTimeout(() => setOpen(id), open ? 60 : 170);
    },
    leave: () => {
      clear();
      timer.current = window.setTimeout(() => setOpen(null), 220);
    },
    close: () => {
      clear();
      setOpen(null);
    },
    hold: clear,
  };

  return <>{children(menu)}</>;
}

function MegaPanel({
  open,
  onClose,
  onKeep,
}: {
  open: CategoryId | null;
  onClose: () => void;
  onKeep: () => void;
}) {
  const category = open ? categoryOf(open) : null;
  const picks = open
    ? [...PRODUCTS.filter((p) => p.cat === open)].sort((a, b) => b.rating - a.rating).slice(0, 4)
    : [];
  const total = open ? PRODUCTS.filter((p) => p.cat === open).length : 0;
  const { currency } = useShop();

  return (
    <AnimatePresence>
      {open && category && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: EASE }}
          onMouseEnter={onKeep}
          onMouseLeave={onClose}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-surface shadow-lift lg:block"
        >
          <div className="mx-auto flex max-w-7xl gap-8 px-6 py-6">
            <div className="w-52 shrink-0">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `hsl(${category.hue} 82% 95%)` }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: `hsl(${category.hue} 68% 52%)` }}
                />
              </span>
              <h2 className="mt-3 font-display text-[19px] font-bold text-ink">{category.label}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-70">{category.blurb}</p>
              <Link
                to={`/shop?cat=${category.id}`}
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet hover:underline"
              >
                All {total} products
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-4 gap-4">
              {picks.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  onClick={onClose}
                  className="group block"
                >
                  <ProductArt
                    product={p}
                    sizes="220px"
                    className="block aspect-[4/3] w-full rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <p className="mt-2 truncate text-[13px] font-semibold text-ink">{p.name}</p>
                  <p className="font-mono text-[12px] text-ink-45">{money(p.price, currency)}</p>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
