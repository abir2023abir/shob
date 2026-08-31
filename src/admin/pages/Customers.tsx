import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Phone, Search } from "lucide-react";
import { money, plural } from "@/lib/format";
import { fadeUp, stagger } from "@/lib/motion";
import { Empty, Panel, SidePanel, StatusPill } from "../components/ui";
import { useAdmin } from "../data/admin-context";
import { customersFrom, orderItems, orderTotal } from "../lib/orders";
import type { Customer } from "../lib/types";

type SortKey = "spent" | "orders" | "recent";

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function Customers() {
  const { orders, settings } = useAdmin();
  const currency = settings.defaultCurrency;

  const [term, setTerm] = useState("");
  const [sort, setSort] = useState<SortKey>("spent");
  const [open, setOpen] = useState<Customer | null>(null);

  const people = useMemo(() => customersFrom(orders, settings), [orders, settings]);

  const rows = useMemo(() => {
    const q = term.trim().toLowerCase();
    const matched = people.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q),
    );

    return [...matched].sort((a, b) => {
      if (sort === "orders") return b.orders - a.orders;
      if (sort === "recent") return b.lastOrder.localeCompare(a.lastOrder);
      return b.spent - a.spent;
    });
  }, [people, term, sort]);

  const repeat = people.filter((c) => c.orders > 1).length;
  const history = open ? orders.filter((o) => o.customer.phone === open.phone) : [];

  return (
    <motion.div variants={stagger(0, 0.05)} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <h1 className="text-[clamp(24px,3vw,30px)] font-extrabold text-ink">Customers</h1>
        <p className="mt-1 text-[13.5px] text-ink-70">
          {plural(people.length, "person has", "people have")} ordered, {repeat} more than once.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-45"
          />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Name, phone, or city…"
            aria-label="Search customers"
            className="w-56 rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-[13px] transition-colors focus:border-violet"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort customers"
          className="ml-auto rounded-xl border border-line bg-surface px-3 py-2.5 text-[13px] font-semibold text-ink-70"
        >
          <option value="spent">Highest spend</option>
          <option value="orders">Most orders</option>
          <option value="recent">Most recent</option>
        </select>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel>
          {rows.length === 0 ? (
            <Empty title="Nobody matches" body="Try a different name, phone, or city." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-ink-45">
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-3 py-3 font-semibold">Phone</th>
                    <th className="px-3 py-3 font-semibold">City</th>
                    <th className="px-3 py-3 text-right font-semibold">Orders</th>
                    <th className="px-3 py-3 text-right font-semibold">Spent</th>
                    <th className="px-5 py-3 font-semibold">Last order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((c) => (
                    <tr
                      key={c.phone}
                      onClick={() => setOpen(c)}
                      className="cursor-pointer transition-colors hover:bg-canvas/60"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-soft font-display text-[13px] font-bold text-violet">
                            {c.name.slice(0, 1)}
                          </span>
                          <span className="text-[13px] font-semibold text-ink">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-[12.5px] text-ink-70">{c.phone}</td>
                      <td className="px-3 py-3 text-[12.5px] text-ink-70">{c.city}</td>
                      <td className="px-3 py-3 text-right font-mono text-[12.5px] text-ink-70">
                        {c.orders}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[13px] font-bold text-ink">
                        {money(c.spent, currency)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-[12.5px] text-ink-70">
                        {day(c.lastOrder)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </motion.div>

      <SidePanel
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open?.name ?? "Customer"}
        subtitle={open ? `${open.city}, ${open.division}` : undefined}
      >
        {open && (
          <div className="space-y-6">
            <a
              href={`tel:${open.phone}`}
              className="flex items-center gap-2.5 rounded-2xl border border-line px-4 py-3 text-[13.5px] font-semibold text-ink"
            >
              <Phone size={15} className="text-violet" />
              <span className="font-mono">{open.phone}</span>
            </a>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Orders" value={String(open.orders)} />
              <Stat label="Spent" value={money(open.spent, currency)} />
              <Stat
                label="Average"
                value={money(open.orders ? open.spent / open.orders : 0, currency)}
              />
            </div>

            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink-45">
                Order history
              </h3>
              <ul className="mt-3 space-y-2">
                {history.map((order) => (
                  <li
                    key={order.ref}
                    className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[12.5px] font-bold text-ink">{order.ref}</p>
                      <p className="text-[11.5px] text-ink-45">
                        {day(order.placedAt)} · {plural(orderItems(order), "item")}
                      </p>
                    </div>
                    <StatusPill status={order.status} />
                    <span className="shrink-0 font-mono text-[12.5px] font-bold text-ink">
                      {money(orderTotal(order, settings), currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11.5px] text-ink-45">
              First ordered {day(open.firstOrder)}. There is no separate customer table — a
              customer is whoever has ordered, keyed by phone number.
            </p>
          </div>
        )}
      </SidePanel>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-canvas px-3 py-2.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-45">{label}</p>
      <p className="mt-0.5 font-mono text-[14px] font-bold text-ink">{value}</p>
    </div>
  );
}
