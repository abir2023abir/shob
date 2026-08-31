import { memo, useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { categoryOf, type CategoryId, type Product } from "@/data/catalogue";

interface Props {
  product: Product;
  /** Shifts hue and geometry so one product can show several "angles". */
  angle?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Every product image in this store is drawn in code rather than loaded from a
 * CDN. Nothing can 404, the catalogue weighs nothing, and each category keeps a
 * recognisable visual signature.
 */
function ProductArtBase({ product, angle = 0, className, animate = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const { hue } = categoryOf(product.cat);
  const h = (hue + angle * 15) % 360;

  const base = `hsl(${h} 62% 55%)`;
  const deep = `hsl(${(h + 18) % 360} 55% 34%)`;
  const pale = `hsl(${h} 60% 88%)`;
  const reduce = useReducedMotion();
  const on = animate && !reduce;

  const draw = on
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { duration: 0.9, ease: [0.2, 0.7, 0.3, 1] as const },
      }
    : {};

  const art: Record<CategoryId, ReactNode> = {
    electronics: (
      <>
        <rect x="90" y="130" width="220" height="150" rx="16" fill={deep} />
        <rect x="112" y="152" width="176" height="106" rx="8" fill={pale} />
        <motion.circle cx="200" cy="205" r="26" fill="none" stroke={base} strokeWidth="9" {...draw} />
        <circle cx="200" cy="205" r="46" fill="none" stroke={base} strokeWidth="5" opacity="0.45" />
        <rect x="150" y="288" width="100" height="14" rx="7" fill={base} />
      </>
    ),
    fashion: (
      <>
        <path
          d="M150 110h100l46 44-34 30v122a20 20 0 0 1-20 20h-84a20 20 0 0 1-20-20V184l-34-30z"
          fill={base}
        />
        <motion.path d="M172 110a28 28 0 0 0 56 0" fill="none" stroke={deep} strokeWidth="10" {...draw} />
        <path d="M200 200v100" stroke={pale} strokeWidth="6" opacity="0.85" />
      </>
    ),
    home: (
      <>
        <path d="M120 300V200a80 80 0 0 1 160 0v100z" fill={base} />
        <rect x="164" y="238" width="72" height="62" rx="6" fill={pale} />
        <rect x="96" y="300" width="208" height="16" rx="8" fill={deep} />
        <motion.path d="M150 176a52 52 0 0 1 100 0" fill="none" stroke={pale} strokeWidth="7" {...draw} />
      </>
    ),
    beauty: (
      <>
        <rect x="164" y="96" width="72" height="34" rx="10" fill={deep} />
        <path
          d="M158 130h84a34 34 0 0 1 34 34v112a26 26 0 0 1-26 26H150a26 26 0 0 1-26-26V164a34 34 0 0 1 34-34z"
          fill={base}
        />
        <rect x="168" y="188" width="64" height="76" rx="10" fill={pale} opacity="0.9" />
      </>
    ),
    grocery: (
      <>
        <ellipse cx="200" cy="272" rx="88" ry="30" fill={deep} />
        <circle cx="166" cy="228" r="52" fill={base} />
        <circle cx="240" cy="240" r="40" fill={base} opacity="0.75" />
        <circle cx="206" cy="168" r="34" fill={pale} />
      </>
    ),
    sports: (
      <>
        <motion.circle cx="200" cy="200" r="86" fill="none" stroke={base} strokeWidth="20" {...draw} />
        <path d="M132 262 268 138" stroke={deep} strokeWidth="18" strokeLinecap="round" />
        <circle cx="200" cy="200" r="26" fill={pale} />
      </>
    ),
    books: (
      <>
        <rect x="112" y="240" width="180" height="26" rx="6" fill={deep} />
        <rect x="122" y="206" width="164" height="30" rx="6" fill={base} />
        <rect x="134" y="170" width="142" height="32" rx="6" fill={pale} />
        <rect x="146" y="134" width="120" height="32" rx="6" fill={base} opacity="0.7" />
      </>
    ),
    kids: (
      <>
        <circle cx="200" cy="188" r="72" fill={base} />
        <circle cx="176" cy="176" r="12" fill={pale} />
        <circle cx="226" cy="176" r="12" fill={pale} />
        <motion.path
          d="M170 214q30 26 60 0"
          stroke={pale}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          {...draw}
        />
        <rect x="150" y="262" width="100" height="44" rx="14" fill={deep} />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={`${product.name}, illustrated`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${h} 70% 97%)`} />
          <stop offset="100%" stopColor={`hsl(${(h + 30) % 360} 58% 90%)`} />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#bg-${uid})`} />
      {art[product.cat]}
    </svg>
  );
}

export const ProductArt = memo(ProductArtBase);
