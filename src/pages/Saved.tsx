import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { PRODUCTS, type Product } from "@/data/catalogue";
import { useShop } from "@/store/shop-context";
import { stagger } from "@/lib/motion";
import { ProductCard } from "@/components/ProductCard";
import { QuickView } from "@/components/QuickView";

export function Saved() {
  const { wishlist, currency, add, toggleWish, isWished } = useShop();
  const [quick, setQuick] = useState<Product | null>(null);
  const saved = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-[clamp(28px,4vw,40px)] font-extrabold text-ink">Saved for later</h1>
      <p className="mt-1.5 text-sm text-ink-70">
        {saved.length === 0
          ? "Nothing saved yet."
          : `${saved.length} item${saved.length === 1 ? "" : "s"} waiting on you.`}
      </p>

      {saved.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface py-20 text-center">
          <Heart size={26} className="text-ink-45" />
          <p className="mt-4 font-display text-[19px] font-bold text-ink">Your list is empty</p>
          <p className="mt-1 max-w-sm text-sm text-ink-45">
            Tap the heart on any product and it will wait here.
          </p>
          <Link to="/shop" className="btn-ink mt-5">Browse the catalogue</Link>
        </div>
      ) : (
        <motion.div
          variants={stagger(0, 0.05)}
          initial="hidden"
          animate="show"
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {saved.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              currency={currency}
              wished={isWished(p.id)}
              onWish={toggleWish}
              onAdd={add}
              onQuickView={setQuick}
            />
          ))}
        </motion.div>
      )}

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </div>
  );
}
