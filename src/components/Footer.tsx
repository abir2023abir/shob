import { Link } from "react-router-dom";
import { CATEGORIES } from "@/data/catalogue";
import { Logo } from "./Logo";

const COLUMNS: [string, string[]][] = [
  ["Support", ["Track an order", "Returns and refunds", "Delivery areas", "Contact us"]],
  ["Company", ["About Shob", "Sell with us", "Careers", "Press"]],
];

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/60">
            Eight categories, one bag, one checkout. Built in Rajshahi, delivering nationwide.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-marigold">
            Dhaka · Rajshahi · Chattogram
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-marigold">Shop</p>
          <ul className="mt-3 space-y-2">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  to={`/shop?cat=${c.id}`}
                  className="text-[13.5px] text-white/70 transition-colors hover:text-white"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map(([heading, items]) => (
          <div key={heading}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-marigold">
              {heading}
            </p>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-[13.5px] text-white/70 transition-colors hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Shob. A portfolio demo — no real orders are placed.</p>
          <p className="font-mono">React · TypeScript · Tailwind · Motion</p>
        </div>
      </div>
    </footer>
  );
}
