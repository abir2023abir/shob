import { memo, useId, type ReactNode } from "react";
import { categoryOf, type CategoryId, type Product } from "@/data/catalogue";
import { hasPhotos, photoSrc, photoSrcSet } from "./product-photos";

interface Props {
  product: Product;
  /** Gallery view: 0 packshot, 1 packshot detail, 2 second look, 3 second-look detail. */
  angle?: number;
  className?: string;
  /** Load eagerly — set on the one image that is above the fold. */
  priority?: boolean;
  /**
   * Roughly how wide this instance renders, as a `sizes` value. Getting it
   * near-right is what lets the browser fetch the 300px frame for a thumbnail
   * instead of the 760px one.
   */
  sizes?: string;
  /** Accepted by the gallery call sites; the CSS fade handles the entrance. */
  animate?: boolean;
}

/**
 * The four gallery views come out of two photographs: each frame is shown
 * whole, then punched in on the part of it worth a second look. `bleed` is how
 * far the image hangs outside the tile on each side — a layout crop rather
 * than a transform, so the browser never has to composite a scaled layer.
 */
const VIEWS = [
  { frame: 0 as const, bleed: 0, x: "50%", y: "50%" },
  { frame: 0 as const, bleed: 16, x: "44%", y: "58%" },
  { frame: 1 as const, bleed: 0, x: "50%", y: "50%" },
  { frame: 1 as const, bleed: 11, x: "56%", y: "42%" },
];

/**
 * A product with no photography — anything the admin panel has added since
 * the shoot — falls back to a drawn shape for its category, so the grid
 * stays whole instead of showing a broken image.
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

function DrawnFallback({ product, className }: { product: Product; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const { hue } = categoryOf(product.cat);

  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`${product.name} by ${product.brand}`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 70% 97%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 30) % 360} 58% 90%)`} />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#bg-${uid})`} />
      <circle cx="200" cy="196" r="132" fill="#FFFFFF" opacity="0.42" />
      {categoryFallback(product.cat, hue)}
    </svg>
  );
}

function ProductArtBase({
  product,
  angle = 0,
  className,
  priority = false,
  sizes = "(min-width: 640px) 25vw, 45vw",
}: Props) {
  if (!hasPhotos(product.id)) {
    return <DrawnFallback product={product} className={className} />;
  }

  const view = VIEWS[((angle % VIEWS.length) + VIEWS.length) % VIEWS.length];

  return (
    <div className={`relative overflow-hidden bg-canvas ${className ?? ""}`}>
      <img
        src={photoSrc(product.id, view.frame)}
        srcSet={photoSrcSet(product.id, view.frame)}
        sizes={sizes}
        alt={`${product.name} by ${product.brand}`}
        width={760}
        height={760}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute animate-fade-in object-cover"
        style={{
          objectPosition: `${view.x} ${view.y}`,
          top: `-${view.bleed}%`,
          right: `-${view.bleed}%`,
          bottom: `-${view.bleed}%`,
          left: `-${view.bleed}%`,
        }}
      />
      {/* A hairline edge, so a packshot on white paper still reads as a tile. */}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/[0.07]" />
    </div>
  );
}

export const ProductArt = memo(ProductArtBase);
