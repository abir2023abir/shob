import { memo, useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { categoryOf, type CategoryId, type Product } from "@/data/catalogue";
import { PRODUCT_SCENES } from "./product-art/scenes";

interface Props {
  product: Product;
  /** Camera for the gallery thumbnails: 0 front, 1 close, 2 tilted, 3 packshot. */
  angle?: number;
  className?: string;
  animate?: boolean;
}

/** Where the camera sits for each of the four gallery angles. */
const CAMERA = [
  { s: 1, r: 0, x: 0, y: 0 },
  { s: 1.24, r: 0, x: 0, y: 14 },
  { s: 1.06, r: -9, x: 0, y: 0 },
  { s: 0.82, r: 4, x: 0, y: -6 },
];

/**
 * A product not in the scene registry — anything the admin panel has added —
 * falls back to a generic shape for its category so the grid never breaks.
 */
function categoryFallback(cat: CategoryId, hue: number): ReactNode {
  const base = `hsl(${hue} 62% 55%)`;
  const deep = `hsl(${(hue + 18) % 360} 55% 34%)`;
  const pale = `hsl(${hue} 60% 88%)`;

  const shapes: Record<CategoryId, ReactNode> = {
    electronics: (
      <>
        <rect x="90" y="130" width="220" height="150" rx="16" fill={deep} />
        <rect x="112" y="152" width="176" height="106" rx="8" fill={pale} />
        <rect x="150" y="288" width="100" height="14" rx="7" fill={base} />
      </>
    ),
    fashion: (
      <path
        d="M150 110h100l46 44-34 30v122a20 20 0 0 1-20 20h-84a20 20 0 0 1-20-20V184l-34-30z"
        fill={base}
      />
    ),
    home: (
      <>
        <path d="M120 300V200a80 80 0 0 1 160 0v100z" fill={base} />
        <rect x="164" y="238" width="72" height="62" rx="6" fill={pale} />
        <rect x="96" y="300" width="208" height="16" rx="8" fill={deep} />
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
        <circle cx="206" cy="168" r="34" fill={pale} />
      </>
    ),
    sports: (
      <>
        <circle cx="200" cy="200" r="86" fill="none" stroke={base} strokeWidth="20" />
        <path d="M132 262 268 138" stroke={deep} strokeWidth="18" strokeLinecap="round" />
        <circle cx="200" cy="200" r="26" fill={pale} />
      </>
    ),
    books: (
      <>
        <rect x="112" y="240" width="180" height="26" rx="6" fill={deep} />
        <rect x="122" y="206" width="164" height="30" rx="6" fill={base} />
        <rect x="134" y="170" width="142" height="32" rx="6" fill={pale} />
      </>
    ),
    kids: (
      <>
        <circle cx="200" cy="188" r="72" fill={base} />
        <circle cx="176" cy="176" r="12" fill={pale} />
        <circle cx="226" cy="176" r="12" fill={pale} />
        <rect x="150" y="262" width="100" height="44" rx="14" fill={deep} />
      </>
    ),
  };

  return shapes[cat];
}

/**
 * Every product image in this store is drawn in code rather than loaded from a
 * CDN. Nothing can 404, the catalogue weighs nothing, and each product gets its
 * own drawing — the ultrabook looks like an ultrabook, the saree like a saree.
 * `angle` moves the camera rather than recolouring, so the four gallery
 * thumbnails read as four views of one object.
 */
function ProductArtBase({ product, angle = 0, className, animate = false }: Props) {
  const uid = useId().replace(/:/g, "");
  const cam = CAMERA[((angle % CAMERA.length) + CAMERA.length) % CAMERA.length];
  const scene = PRODUCT_SCENES[product.id];
  const { hue } = categoryOf(product.cat);

  const bg: [string, string] = scene
    ? scene.bg
    : [`hsl(${hue} 70% 97%)`, `hsl(${(hue + 30) % 360} 58% 90%)`];

  const reduce = useReducedMotion();
  const on = animate && !reduce;

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`${product.name} by ${product.brand}, illustrated`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg[0]} />
          <stop offset="100%" stopColor={bg[1]} />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${uid})`} />
      {/* A backdrop that shifts with the camera, so the angles differ at a glance. */}
      {cam.r !== 0 ? (
        <path d="M0 268L400 156v244H0z" fill="#FFFFFF" opacity="0.35" />
      ) : (
        <circle cx="200" cy="196" r={cam.s > 1 ? 168 : 132} fill="#FFFFFF" opacity="0.42" />
      )}

      {/* Camera stays on the outer group so the animation cannot overwrite it. */}
      <g
        transform={`translate(200 200) scale(${cam.s}) rotate(${cam.r}) translate(-200 -200) translate(${cam.x} ${cam.y})`}
      >
        <motion.g
          initial={on ? { opacity: 0, scale: 0.94 } : false}
          animate={on ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          style={{ transformOrigin: '200px 200px' }}
        >
          {scene ? scene.art : categoryFallback(product.cat, hue)}
        </motion.g>
      </g>
    </svg>
  );
}

export const ProductArt = memo(ProductArtBase);
