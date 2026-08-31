import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center sm:px-6">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-[13px] uppercase tracking-[0.2em] text-violet"
      >
        404
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="mt-3 text-[clamp(30px,5vw,44px)] font-extrabold text-ink"
      >
        That page is not in stock
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="mt-3 text-[15px] text-ink-70"
      >
        The link may be old, or the product may have been removed. The catalogue is still here.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mt-7 flex gap-3"
      >
        <Link to="/shop" className="btn-ink">Browse the catalogue</Link>
        <Link to="/" className="btn-quiet py-3">Back home</Link>
      </motion.div>
    </div>
  );
}
