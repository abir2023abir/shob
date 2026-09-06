import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { PRODUCTS, type Product } from "@/data/catalogue";
import { ProductArt } from "./ProductArt";

/**
 * Three columns, hand-picked rather than sliced off the catalogue: the wall
 * needs colour in every column, and packshots photographed on white paper
 * vanish against the tile. The middle column travels the other way, which is
 * what stops the whole thing reading as one sheet sliding past.
 */
const COLUMNS: [string[], string[], string[]] = [
  ["f4", "g3", "h4", "s1", "b2"],
  ["e2", "h3", "f1", "g1", "s3"],
  ["e4", "t1", "f3", "g4", "s5"],
];

const SPEED = ["44s", "52s", "38s"];

function pick(ids: string[]): Product[] {
  return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[];
}

function Tile({ product, eager }: { product: Product; eager: boolean }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-[0_1px_2px_rgba(23,20,37,0.04)] transition-shadow duration-300 hover:shadow-lift"
      tabIndex={-1}
      aria-hidden
    >
      <ProductArt
        product={product}
        priority={eager}
        sizes="(min-width: 1024px) 15vw, 30vw"
        className="block aspect-square w-full transition-transform duration-700 group-hover:scale-[1.06]"
      />
    </Link>
  );
}

export function HeroWall() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Three columns of images animating forever is not free, and once the hero
  // has scrolled away nobody can see them. Stopping the animation off-screen
  // is most of the difference between a smooth page and a stuttering one.
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = !reduce && onScreen;

  return (
    <div
      ref={ref}
      className="group/wall relative h-[460px] select-none sm:h-[520px] lg:h-[580px]"
      // The wall is decoration: every product in it is reachable from the grid
      // below, so screen readers are better served skipping the whole thing.
      aria-hidden
      style={{
        maskImage: "linear-gradient(to bottom, transparent, #000 11%, #000 89%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 11%, #000 89%, transparent)",
      }}
    >
      <div className="grid h-full grid-cols-3 gap-2.5 sm:gap-3">
        {COLUMNS.map((ids, col) => {
          const items = pick(ids);
          // The list is rendered twice so translating by half its height lands
          // exactly where it started and the loop has no seam.
          const loop = [...items, ...items];

          return (
            <div key={col} className="relative overflow-hidden">
              <div
                className={`flex flex-col gap-2.5 sm:gap-3 ${
                  running
                    ? `${col === 1 ? "animate-scroll-down" : "animate-scroll-up"} group-hover/wall:[animation-play-state:paused]`
                    : ""
                }`}
                style={{
                  // Its own compositor layer, so scrolling the page does not
                  // repaint fifteen photographs on every frame.
                  willChange: running ? "transform" : undefined,
                  transform: "translateZ(0)",
                  animationDuration: running ? SPEED[col] : undefined,
                }}
              >
                {loop.map((p, i) => (
                  <Tile key={`${p.id}-${i}`} product={p} eager={i < 2} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
