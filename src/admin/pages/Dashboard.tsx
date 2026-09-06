import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Minus, Plus, TriangleAlert } from "lucide-react";
import { money, plural } from "@/lib/format";
import { fadeUp, stagger } from "@/lib/motion";
import { ProductArt } from "@/components/ProductArt";
import { BarList, RevenueChart, Sparkline } from "../components/charts";
import { Empty, Panel, StatusPill } from "../components/ui";
import { useAdmin } from "../data/admin-context";
import {
  bestSellers,
  isRevenue,
  orderItems,
  orderTotal,
  revenueByCategory,
  revenueByDay,
  summarise,
} from "../lib/orders";

const RANGES = [
  [7, "7 days"],
  [30, "30 days"],
  [90, "90 days"],
] as const;

const DAY = 86_400_000;

export function Dashboard() {
  const { orders, products, settings, now } = useAdmin();
  const [range, setRange] = useState<number>(30);
  const currency = settings.defaultCurrency;

  const inWindow = useMemo(() => {
    const from = now.getTime() - range * DAY;
    return orders.filter((o) => new Date(o.placedAt).getTime() >= from);
  }, [orders, range, now]);

  /** The equivalent window immediately before this one, for the deltas. */
  const previous = useMemo(() => {
    const end = now.getTime() - range * DAY;
    const start = end - range * DAY;
    return orders.filter((o) => {
      const at = new Date(o.placedAt).getTime();
      return at >= start && at < end;
    });
  }, [orders, range, now]);

  const summary = summarise(inWindow, settings);
  const past = summarise(previous, settings);
  const series = useMemo(
    () => revenueByDay(inWindow, settings, range, now),
    [inWindow, settings, range, now],
  );

  const categories = useMemo(() => revenueByCategory(inWindow), [inWindow]);
  const sellers = useMemo(() => bestSellers(inWindow), [inWindow]);
  const shortOfStock = products
    .filter((p) => p.stock <= settings.lowStockAt)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const recent = orders.slice(0, 6);

  return (
    <motion.div variants={stagger(0, 0.05)} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[clamp(24px,3vw,30px)] font-extrabold text-ink">
            {summary.orders === 0 ? "No orders in this window" : "Here is how the shop is doing"}
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-70">
            {plural(summary.orders, "order")} in the last {range} days, {summary.awaiting} still
            waiting on you.
          </p>
        </div>

        <div
          className="flex items-center rounded-xl border border-line bg-surface p-0.5"
          role="group"
          aria-label="Date range"
        >
          {RANGES.map(([days, label]) => (
            <button
              key={days}
              type="button"
              onClick={() => setRange(days)}
              aria-pressed={range === days}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                range === days ? "bg-ink text-white" : "text-ink-45 hover:text-ink-70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Revenue"
          value={money(summary.revenue, currency)}
          delta={delta(summary.revenue, past.revenue)}
          spark={series.map((d) => d.revenue)}
        />
        <Stat
          label="Orders"
          value={String(summary.orders)}
          delta={delta(summary.orders, past.orders)}
          spark={series.map((d) => d.orders)}
        />
        <Stat
          label="Average order"
          value={money(summary.averageOrder, currency)}
          delta={delta(summary.averageOrder, past.averageOrder)}
        />
        <Stat
          label="Items shipped"
          value={String(summary.items)}
          delta={delta(summary.items, past.items)}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel
          title={`Revenue · last ${range} days`}
          action={
            <span className="font-mono text-[11.5px] text-ink-45">
              {summary.delivered} delivered · {summary.cancelled} cancelled
            </span>
          }
        >
          <div className="px-4 pb-3 pt-5">
            <RevenueChart data={series} currency={currency} />
          </div>
        </Panel>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp}>
          <Panel title="Revenue by category">
            <BarList
              currency={currency}
              rows={categories.map((c) => ({
                key: c.cat,
                label: c.label,
                value: c.revenue,
                meta: `${c.units}u`,
              }))}
              empty="No sales in this window."
            />
          </Panel>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Panel title="Best sellers">
            <BarList
              currency={currency}
              rows={sellers.map((s) => ({
                key: s.id,
                label: s.name,
                value: s.revenue,
                meta: `${s.units}u`,
              }))}
              empty="No sales in this window."
            />
          </Panel>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <motion.div variants={fadeUp}>
          <Panel
            title="Latest orders"
            action={
              <Link to="/admin/orders" className="text-[12.5px] font-semibold text-violet">
                See all →
              </Link>
            }
          >
            {recent.length === 0 ? (
              <Empty title="Nothing yet" body="Orders will appear here as they come in." />
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((order) => (
                  <li key={order.ref}>
                    <Link
                      to={`/admin/orders?ref=${order.ref}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-canvas/60"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-ink">
                          {order.customer.name}
                        </p>
                        <p className="font-mono text-[11.5px] text-ink-45">
                          {order.ref} · {plural(orderItems(order), "item")}
                        </p>
                      </div>
                      <StatusPill status={order.status} />
                      <span className="w-24 shrink-0 text-right font-mono text-[13px] font-bold text-ink">
                        {isRevenue(order) ? money(orderTotal(order, settings), currency) : "—"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Panel
            title="Running low"
            action={
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-marigold-deep">
                <TriangleAlert size={12} />
                at or under {settings.lowStockAt}
              </span>
            }
          >
            {shortOfStock.length === 0 ? (
              <Empty title="Everything is stocked" body="No product is under the threshold." />
            ) : (
              <ul className="divide-y divide-line">
                {shortOfStock.map((p) => (
                  <LowStockRow key={p.id} id={p.id} />
                ))}
              </ul>
            )}
          </Panel>
        </motion.div>
      </div>
    </motion.div>
  );
}

function delta(current: number, before: number): number | null {
  if (!before) return current > 0 ? 100 : null;
  return ((current - before) / before) * 100;
}

function Stat({
  label,
  value,
  delta: change,
  spark,
}: {
  label: string;
  value: string;
  delta: number | null;
  spark?: number[];
}) {
  const up = (change ?? 0) >= 0;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-45">{label}</p>
      <p className="mt-2 font-mono text-[24px] font-bold tracking-tight text-ink">{value}</p>

      <div className="mt-2 flex items-end justify-between gap-2">
        {change === null ? (
          <span className="text-[11.5px] text-ink-45">no earlier data</span>
        ) : (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${
              up ? "bg-jade-soft text-jade-deep" : "bg-rose-soft text-rose"
            }`}
          >
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change).toFixed(0)}%
          </span>
        )}
        {spark && <Sparkline values={spark} tone={up ? "#0E9F6E" : "#E0396E"} />}
      </div>
    </div>
  );
}

function LowStockRow({ id }: { id: string }) {
  const { products, adjustStock, settings } = useAdmin();
  const product = products.find((p) => p.id === id);
  if (!product) return null;

  const out = product.stock === 0;

  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <ProductArt product={product} sizes="36px" className="aspect-square w-9 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-ink">{product.name}</p>
        <p className={`font-mono text-[11px] ${out ? "text-rose" : "text-marigold-deep"}`}>
          {out ? "out of stock" : `${product.stock} left`}
        </p>
      </div>
      <div className="flex shrink-0 items-center rounded-lg border border-line">
        <button
          type="button"
          onClick={() => adjustStock(product.id, -1)}
          aria-label={`Reduce stock of ${product.name}`}
          className="px-2 py-1.5"
        >
          <Minus size={12} className="text-ink-70" />
        </button>
        <button
          type="button"
          onClick={() => adjustStock(product.id, settings.lowStockAt * 2)}
          aria-label={`Restock ${product.name}`}
          className="flex items-center gap-1 border-l border-line px-2 py-1.5 text-[11px] font-semibold text-violet"
        >
          <Plus size={12} />
          {settings.lowStockAt * 2}
        </button>
      </div>
    </li>
  );
}
