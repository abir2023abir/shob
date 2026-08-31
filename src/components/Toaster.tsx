import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useShop, type Toast } from "@/store/shop-context";
import { toastIn } from "@/lib/motion";

const LIFETIME = 2600;

export function Toaster() {
  const { toasts, dismiss, openCart } = useShop();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Card key={toast.id} toast={toast} onDismiss={dismiss} onOpenCart={openCart} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Each toast owns its own timer. Holding them in the parent restarted the clock
 * on every unrelated store update, so a toast could hang around indefinitely on
 * a busy page.
 */
function Card({
  toast,
  onDismiss,
  onOpenCart,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
  onOpenCart: () => void;
}) {
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss.current(toast.id), LIFETIME);
    return () => window.clearTimeout(timer);
  }, [toast.id]);

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
      <span className="text-[13.5px] text-white">{toast.message}</span>
      {toast.action === "cart" && (
        <button
          type="button"
          onClick={() => {
            onDismiss(toast.id);
            onOpenCart();
          }}
          className="text-[13px] font-bold text-marigold"
        >
          View bag
        </button>
      )}
    </motion.div>
  );
}
