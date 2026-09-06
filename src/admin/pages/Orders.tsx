import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  X,
} from "lucide-react";
import { money, plural } from "@/lib/format";
import { fadeUp, stagger } from "@/lib/motion";
import { ProductArt } from "@/components/ProductArt";
import { productById } from "@/data/catalogue";
import { Empty, Panel, SidePanel, StatusPill } from "../components/ui";
import { useAdmin } from "../data/admin-context";
import {
  STATUS_FLOW,
  STATUS_LABELS,
  canCancel,
  isRevenue,
  nextStatus,
  orderItems,
  orderSubtotal,
  orderTotal,
} from "../lib/orders";
import type { Order, OrderStatus } from "../lib/types";

const PER_PAGE = 12;

const TABS: (OrderStatus | "all")[] = ["all", ...STATUS_FLOW, "cancelled"];

const METHOD_LABELS: Record<Order["method"], string> = {
  bkash: "bKash",
  nagad: "Nagad",
  card: "Card",
  cod: "Cash on delivery",
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export function Orders() {
  const { orders, settings } = useAdmin();
  const [params, setParams] = useSearchParams();
  const currency = settings.defaultCurrency;

  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "highest">("newest");
  const [page, setPage] = useState(0);

  const openRef = params.get("ref");
  const open = orders.find((o) => o.ref === openRef) ?? null;

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    const rows = orders.filter((o) => {
      if (tab !== "all" && o.status !== tab) return false;
      if (!q) return true;
      return (
        o.ref.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q)
      );
    });

    return [...rows].sort((a, b) => {
      if (sort === "highest") return orderTotal(b, settings) - orderTotal(a, settings);
      const compare = a.placedAt.localeCompare(b.placedAt);
      return sort === "oldest" ? compare : -compare;
    });
  }, [orders, tab, term, sort, settings]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages - 1);
  const rows = filtered.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  const reset = (next: () => void) => {
    next();
    setPage(0);
  };

  const exportCsv = () => {
    const header = ["Reference", "Placed", "Customer", "Phone", "City", "Items", "Total", "Status"];
    const body = filtered.map((o) => [
      o.ref,
      o.placedAt,
      o.customer.name,
      o.customer.phone,
      o.customer.city,
      String(orderItems(o)),
      orderTotal(o, settings).toFixed(2),
      o.status,
    ]);

    const csv = [header, ...body]
      .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `shob-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div variants={stagger(0, 0.05)} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(24px,3vw,30px)] font-extrabold text-ink">Orders</h1>
          <p className="mt-1 text-[13.5px] text-ink-70">
            {plural(filtered.length, "order")} matching, out of {orders.length}.
          </p>
        </div>
        <button type="button" onClick={exportCsv} className="btn-quiet">
          <Download size={15} />
          Export CSV
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
        <div className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto">
          {TABS.map((value) => {
            const count =
              value === "all" ? orders.length : orders.filter((o) => o.status === value).length;
            return (
              <button
                key={value}
                type="button"
                onClick={() => reset(() => setTab(value))}
                aria-pressed={tab === value}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  tab === value
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-surface text-ink-70 hover:border-ink-20"
                }`}
              >
                {value === "all" ? "All" : STATUS_LABELS[value]}
                <span className="ml-1.5 font-mono text-[11px] opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-45"
            />
            <input
              value={term}
              onChange={(e) => reset(() => setTerm(e.target.value))}
              placeholder="Reference, name, phone…"
              aria-label="Search orders"
              className="w-52 rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-[13px] transition-colors focus:border-violet"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setSort((s) => (s === "newest" ? "oldest" : s === "oldest" ? "highest" : "newest"))
            }
            className="btn-quiet"
          >
            <ArrowUpDown size={14} />
            {sort === "newest" ? "Newest" : sort === "oldest" ? "Oldest" : "Highest value"}
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel>
          {rows.length === 0 ? (
            <Empty
              title="No orders match"
              body="Try a different status, or clear the search box."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-ink-45">
                    <th className="px-5 py-3 font-semibold">Reference</th>
                    <th className="px-3 py-3 font-semibold">Customer</th>
                    <th className="px-3 py-3 font-semibold">Placed</th>
                    <th className="px-3 py-3 text-right font-semibold">Items</th>
                    <th className="px-3 py-3 text-right font-semibold">Total</th>
                    <th className="px-3 py-3 font-semibold">Payment</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((order) => (
                    <tr
                      key={order.ref}
                      onClick={() => setParams({ ref: order.ref }, { replace: true })}
                      className="cursor-pointer transition-colors hover:bg-canvas/60"
                    >
                      <td className="px-5 py-3 font-mono text-[12.5px] font-bold text-ink">
                        {order.ref}
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-[13px] font-semibold text-ink">{order.customer.name}</p>
                        <p className="font-mono text-[11px] text-ink-45">{order.customer.city}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[12.5px] text-ink-70">
                        {when(order.placedAt)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[12.5px] text-ink-70">
                        {orderItems(order)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[13px] font-bold text-ink">
                        {money(orderTotal(order, settings), currency)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[12.5px] text-ink-70">
                        {METHOD_LABELS[order.method]}
                      </td>
                      <td className="px-5 py-3">
                        <StatusPill status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-line px-5 py-3">
              <p className="font-mono text-[12px] text-ink-45">
                Page {safePage + 1} of {pages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={safePage === 0}
                  onClick={() => setPage(safePage - 1)}
                  className="btn-quiet px-2.5 py-2 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  disabled={safePage >= pages - 1}
                  onClick={() => setPage(safePage + 1)}
                  className="btn-quiet px-2.5 py-2 disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </Panel>
      </motion.div>

      <OrderDetail order={open} onClose={() => setParams({}, { replace: true })} />
    </motion.div>
  );
}

function OrderDetail({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { settings, setOrderStatus } = useAdmin();
  const currency = settings.defaultCurrency;

  // Keep the last order around while the panel animates out.
  const [remembered, setRemembered] = useState<Order | null>(order);
  if (order && order !== remembered) setRemembered(order);
  const shown = order ?? remembered;

  const subtotal = shown ? orderSubtotal(shown) : 0;
  const discount = shown?.promoApplied ? subtotal * settings.promoOff : 0;
  const total = shown ? orderTotal(shown, settings) : 0;
  const delivery = total - (subtotal - discount);
  const advance = shown ? nextStatus(shown.status) : null;

  return (
    <SidePanel
      open={Boolean(order)}
      onClose={onClose}
      title={shown?.ref ?? "Order"}
      subtitle={shown ? when(shown.placedAt) : undefined}
      footer={
        shown && (
          <div className="flex gap-2">
            {advance && (
              <button
                type="button"
                onClick={() => setOrderStatus(shown.ref, advance)}
                className="btn-primary flex-1 py-3"
              >
                Mark {STATUS_LABELS[advance].toLowerCase()}
              </button>
            )}
            {canCancel(shown.status) && (
              <button
                type="button"
                onClick={() => setOrderStatus(shown.ref, "cancelled")}
                className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-rose"
              >
                <X size={15} />
                Cancel
              </button>
            )}
            {!advance && !canCancel(shown.status) && (
              <p className="w-full text-center text-[12.5px] text-ink-45">
                This order is closed — nothing further to do.
              </p>
            )}
          </div>
        )
      }
    >
      {shown && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <StatusPill status={shown.status} />
            <span className="font-mono text-[12px] text-ink-45">
              {METHOD_LABELS[shown.method]}
            </span>
          </div>

          <dl className="overflow-hidden rounded-2xl border border-line">
            <Row label="Customer" value={shown.customer.name} />
            <Row label="Phone" value={shown.customer.phone} alt mono />
            <Row label="City" value={`${shown.customer.city}, ${shown.customer.division}`} />
            {shown.note && <Row label="Note" value={shown.note} alt />}
          </dl>

          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink-45">
              {plural(shown.lines.length, "line")}
            </h3>
            <ul className="mt-3 space-y-3">
              {shown.lines.map((line) => {
                const product = productById(line.id);
                return (
                  <li key={line.id} className="flex items-center gap-3">
                    {product ? (
                      <ProductArt product={product} sizes="44px" className="aspect-square w-11 rounded-xl" />
                    ) : (
                      <span className="flex aspect-square w-11 items-center justify-center rounded-xl bg-canvas font-mono text-[10px] text-ink-45">
                        n/a
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-ink">{line.name}</p>
                      <p className="font-mono text-[11.5px] text-ink-45">
                        {money(line.price, currency)} × {line.qty}
                      </p>
                    </div>
                    <span className="font-mono text-[13px] font-bold text-ink">
                      {money(line.price * line.qty, currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <dl className="space-y-1.5 border-t border-line pt-4">
            <Total label="Subtotal" value={money(subtotal, currency)} />
            {shown.promoApplied && (
              <Total label={`Promo ${settings.promoCode}`} value={`−${money(discount, currency)}`} />
            )}
            <Total
              label="Delivery"
              value={delivery <= 0 ? "Free" : money(delivery, currency)}
            />
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="text-[14px] font-bold text-ink">Total</dt>
              <dd className="font-mono text-[16px] font-bold text-ink">
                {money(total, currency)}
              </dd>
            </div>
            {!isRevenue(shown) && (
              <p className="pt-1 text-[11.5px] text-rose">
                Cancelled — this order is excluded from revenue.
              </p>
            )}
          </dl>

          <AnimatePresence>
            {advance && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl bg-canvas px-3 py-2.5 text-[12px] text-ink-45"
              >
                Next step in the flow: {STATUS_LABELS[advance]}.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </SidePanel>
  );
}

function Row({
  label,
  value,
  alt = false,
  mono = false,
}: {
  label: string;
  value: string;
  alt?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-4 px-4 py-2.5 text-[13px] ${alt ? "bg-canvas/60" : ""}`}>
      <dt className="shrink-0 text-ink-45">{label}</dt>
      <dd className={`text-right font-medium text-ink ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px] text-ink-70">
      <dt>{label}</dt>
      <dd className="font-mono">{value}</dd>
    </div>
  );
}
