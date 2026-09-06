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
 *
 * Four per column, because the strip is rendered twice and translated by half
 * its height: one copy has to be taller than the column at every width the
 * wall is shown at, or a gap opens at the turn. Three was enough at 1280px
 * and four pixels short at 1024.
 */
const COLUMNS: [string[], string[], string[]] = [
  ["f4", "g3", "h4", "b2"],
  ["e2", "h3", "f1", "g1"],
  ["e4", "t1", "g4", "s5"],
];

const SPEED = ["34s", "40s", "29s"];

function pick(ids: string[]): Product[] {
  return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[];
}

/**
 * True while the page is being scrolled, false once it has been still for a
 * moment. Only flips on the transition, so scrolling does not re-render on
 * every frame.
 */
function useScrolling(idleMs = 180): boolean {
  const [scrolling, setScrolling] = useState(false);
  const active = useRef(false);

  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      if (!active.current) {
        active.current = true;
        setScrolling(true);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        active.current = false;
        setScrolling(false);
      }, idleMs);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [idleMs]);

  return scrolling;
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
        sizes="(min-width: 1024px) 16vw, 30vw"
        className="block aspect-square w-full transition-transform duration-700 group-hover:scale-[1.06]"
      />
    </Link>
  );
}

export function HeroWall() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const scrolling = useScrolling();

  // Two reasons to hold still. Off-screen is obvious — nobody can see it. The
  // other is that animating two dozen photographs while the page is moving is
  // what made scrolling stutter: measured on production, it was the difference
  // between one frame in four missing its deadline and one in nine. It starts
  // again a moment after you stop, which is when you are actually looking.
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

  const running = !reduce && onScreen && !scrolling;

  return (
    <div
      ref={ref}
      className="group/wall relative h-[380px] select-none sm:h-[520px] lg:h-[580px]"
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
          const loop = [...items, ...items];

          return (
            <div key={col} className="relative overflow-hidden">
              {/*
                The spacing is padding on each tile rather than `gap` on the
                strip. A flex gap sits between tiles but not after the last
                one, so six tiles are five gaps and half the strip is half a
                gap short of one copy — the loop lands a few pixels out and
                visibly jumps once a cycle. Padding makes every tile the same
                height, so half of two copies is exactly one copy.
              */}
              <div
                className={`flex flex-col ${
                  reduce ? "" : col === 1 ? "animate-scroll-down" : "animate-scroll-up"
                } group-hover/wall:[animation-play-state:paused]`}
                style={{
                  // Its own compositor layer, so page scroll moves it rather
                  // than repainting the photographs inside it.
                  transform: "translateZ(0)",
                  willChange: "transform",
                  animationDuration: SPEED[col],
                  animationPlayState: running ? "running" : "paused",
                }}
              >
                {loop.map((p, i) => (
                  <div key={`${p.id}-${i}`} className="pb-2.5 sm:pb-3">
                    <Tile product={p} eager={i < 2} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
