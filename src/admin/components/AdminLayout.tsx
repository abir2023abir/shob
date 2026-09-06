import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Receipt,
  Settings as SettingsIcon,
  Users,
  X,
} from "lucide-react";
import { overlay, spring, toastIn } from "@/lib/motion";
import { LogoMark } from "@/components/Logo";
import { useAdminAuth } from "../auth/auth-context";
import { useAdmin } from "../data/admin-context";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: Receipt, end: false },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/customers", label: "Customers", icon: Users, end: false },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon, end: false },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { session, signOut } = useAdminAuth();
  const { orders, settings } = useAdmin();
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  // Following a link on a phone should close the drawer behind you.
  useEffect(() => setNavOpen(false), [pathname]);

  const awaiting = orders.filter((o) => o.status === "pending").length;

  const rail = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Link to="/admin" className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-[21px] font-extrabold tracking-tightest text-white">
              {settings.storeName.toLowerCase()}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-marigold">
              admin
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Admin sections">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
                isActive ? "bg-white/12 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={16} />
            {label}
            {label === "Orders" && awaiting > 0 && (
              <span className="ml-auto rounded-full bg-marigold px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                {awaiting}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={15} />
          View storefront
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[236px_1fr]">
      <aside className="sticky top-0 hidden h-screen bg-ink lg:block">{rail}</aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0, transition: spring }}
              exit={{ x: "-100%", transition: { duration: 0.2 } }}
              className="fixed left-0 top-0 z-50 h-full w-64 bg-ink lg:hidden"
              aria-label="Admin sections"
            >
              {rail}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
            className="rounded-xl border border-line bg-surface p-2 lg:hidden"
          >
            <Menu size={16} className="text-ink-70" />
          </button>

          <p className="font-display text-[15px] font-bold text-ink">
            {NAV.find((n) => (n.end ? n.to === pathname : pathname.startsWith(n.to)))?.label ??
              "Admin"}
          </p>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden text-right sm:block">
              <span className="block text-[12.5px] font-semibold leading-tight text-ink">
                {session?.user}
              </span>
              <span className="block font-mono text-[10.5px] leading-tight text-ink-45">
                Store manager
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet font-display text-[14px] font-bold uppercase text-white">
              {session?.user.slice(0, 1)}
            </span>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 sm:py-7">{children}</main>
      </div>

      <AdminToasts />
    </div>
  );
}

function AdminToasts() {
  const { toasts, dismissToast } = useAdmin();

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} message={t.message} onDone={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({
  id,
  message,
  onDone,
}: {
  id: number;
  message: string;
  onDone: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDone(id), 2800);
    return () => window.clearTimeout(timer);
    // The dismiss callback is stable for the life of the provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <motion.div
      layout
      variants={toastIn}
      initial="hidden"
      animate="show"
      exit="exit"
      role="status"
      className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-ink px-4 py-3 shadow-pop"
    >
      <Check size={15} className="text-jade" strokeWidth={3} />
      <span className="text-[13px] text-white">{message}</span>
      <button
        type="button"
        onClick={() => onDone(id)}
        aria-label="Dismiss"
        className="text-white/50 hover:text-white"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}
