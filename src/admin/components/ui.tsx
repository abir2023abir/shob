import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { modal, overlay, spring } from "@/lib/motion";
import { useScrollLock } from "@/hooks/useKeyboard";
import type { OrderStatus } from "../lib/types";
import { STATUS_LABELS } from "../lib/orders";

/* ── Surfaces ─────────────────────────────────────────────────────── */

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-surface ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="font-display text-[15px] font-bold text-ink">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-display text-[16px] font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] text-ink-45">{body}</p>
    </div>
  );
}

/* ── Status ───────────────────────────────────────────────────────── */

const STATUS_TONE: Record<OrderStatus, string> = {
  pending: "bg-marigold-soft text-marigold-deep",
  confirmed: "bg-violet-soft text-violet",
  packed: "bg-violet-soft text-violet-deep",
  shipped: "bg-jade-soft text-jade-deep",
  delivered: "bg-jade-soft text-jade-deep",
  cancelled: "bg-rose-soft text-rose",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${STATUS_TONE[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ── Fields ───────────────────────────────────────────────────────── */

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-semibold text-ink-70">{label}</span>
        {hint && <span className="text-[11px] text-ink-45">{hint}</span>}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 block text-[11.5px] text-rose"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

/* ── Overlays ─────────────────────────────────────────────────────── */

/** A right-hand editing surface — wide enough for a form, never a full page. */
export function SidePanel({
  open,
  title,
  subtitle,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}) {
  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/45"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: spring }}
            exit={{ x: "100%", transition: { duration: 0.22 } }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-surface shadow-drawer sm:w-[460px]"
          >
            <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <h2 className="truncate font-display text-[17px] font-bold text-ink">{title}</h2>
                {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-45">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="shrink-0 rounded-full bg-canvas p-2"
              >
                <X size={15} className="text-ink-70" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

            {footer && <footer className="border-t border-line px-5 py-4">{footer}</footer>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Confirm({
  open,
  title,
  body,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onCancel}
            className="fixed inset-0 z-[60] bg-ink/50"
          />
          <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-5">
            <motion.div
              variants={modal}
              initial="hidden"
              animate="show"
              exit="exit"
              role="alertdialog"
              aria-modal="true"
              aria-label={title}
              className="pointer-events-auto w-full max-w-sm rounded-2xl bg-surface p-5 shadow-pop"
            >
              <h2 className="font-display text-[17px] font-bold text-ink">{title}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-70">{body}</p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="btn-quiet">
                  Keep it
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
