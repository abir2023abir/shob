import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { money, type Currency } from "@/lib/format";
import { EASE } from "@/lib/motion";
import type { DayPoint } from "../lib/orders";

/** Turns a series into an SVG path across a fixed viewBox. */
function pathFor(values: number[], width: number, height: number, pad: number) {
  const top = Math.max(...values, 1);
  const step = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = pad + i * step;
    const y = height - pad - (v / top) * (height - pad * 2);
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${points[points.length - 1][0].toFixed(1)} ${height - pad} L${points[0][0].toFixed(1)} ${height - pad} Z`;

  return { line, area, points, top };
}

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/**
 * Revenue over time. Hand-drawn rather than pulled from a charting library —
 * one path, one gradient, and a hover read-out is all this needs, and it keeps
 * the bundle where it is.
 */
export function RevenueChart({
  data,
  currency,
  height = 220,
}: {
  data: DayPoint[];
  currency: Currency;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const pad = 18;

  const { line, area, points, top } = useMemo(
    () => pathFor(data.map((d) => d.revenue), width, height, pad),
    [data, height],
  );

  const active = hover === null ? null : data[hover];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`Revenue for the last ${data.length} days`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - box.left) / box.width;
          const index = Math.round(ratio * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, index)));
        }}
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B3DF5" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#5B3DF5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((r) => (
          <line
            key={r}
            x1={pad}
            x2={width - pad}
            y1={height - pad - r * (height - pad * 2)}
            y2={height - pad - r * (height - pad * 2)}
            stroke="#E4E1EC"
            strokeDasharray="3 5"
          />
        ))}

        <motion.path
          d={area}
          fill="url(#revenue-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        <motion.path
          d={line}
          fill="none"
          stroke="#5B3DF5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />

        {hover !== null && (
          <g>
            <line
              x1={points[hover][0]}
              x2={points[hover][0]}
              y1={pad}
              y2={height - pad}
              stroke="#B6B1C2"
            />
            <circle cx={points[hover][0]} cy={points[hover][1]} r="5" fill="#5B3DF5" />
            <circle cx={points[hover][0]} cy={points[hover][1]} r="9" fill="#5B3DF5" opacity="0.2" />
          </g>
        )}
      </svg>

      <div className="mt-1 flex justify-between px-1 font-mono text-[10.5px] uppercase tracking-wide text-ink-45">
        <span>{data.length ? shortDate(data[0].date) : ""}</span>
        <span>Peak {money(top, currency)}</span>
        <span>{data.length ? shortDate(data[data.length - 1].date) : ""}</span>
      </div>

      {active && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-lg bg-ink px-3 py-1.5 text-center">
          <p className="font-mono text-[12px] font-bold text-white">
            {money(active.revenue, currency)}
          </p>
          <p className="text-[10.5px] text-white/60">
            {shortDate(active.date)} · {active.orders} order{active.orders === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </div>
  );
}

/** Ranked horizontal bars — categories, best sellers, anything with a total. */
export function BarList({
  rows,
  currency,
  empty = "Nothing to show yet.",
}: {
  rows: { key: string; label: string; value: number; meta?: string }[];
  currency: Currency;
  empty?: string;
}) {
  const top = Math.max(...rows.map((r) => r.value), 1);

  if (!rows.length) return <p className="px-5 py-8 text-center text-[13px] text-ink-45">{empty}</p>;

  return (
    <ul className="space-y-3.5 px-5 py-4">
      {rows.map((row, i) => (
        <li key={row.key}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[13px] font-medium text-ink">{row.label}</span>
            <span className="shrink-0 font-mono text-[12.5px] font-bold text-ink">
              {money(row.value, currency)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
              <motion.div
                className="h-full rounded-full bg-violet"
                initial={{ width: 0 }}
                animate={{ width: `${(row.value / top) * 100}%` }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
              />
            </div>
            {row.meta && (
              <span className="shrink-0 font-mono text-[11px] text-ink-45">{row.meta}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The small trend line inside a stat card. */
export function Sparkline({ values, tone = "#5B3DF5" }: { values: number[]; tone?: string }) {
  const { line } = useMemo(() => pathFor(values.length ? values : [0, 0], 120, 34, 3), [values]);

  return (
    <svg viewBox="0 0 120 34" className="h-8 w-[120px]" aria-hidden>
      <motion.path
        d={line}
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      />
    </svg>
  );
}
