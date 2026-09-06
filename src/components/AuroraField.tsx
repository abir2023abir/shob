import { motion, useReducedMotion } from "motion/react";

const BLOBS = [
  { color: "#5B3DF5", opacity: 0.24, size: 46, x: 14, y: 12, dx: 40, dy: -26, dur: 17 },
  { color: "#F08000", opacity: 0.22, size: 38, x: 58, y: 4, dx: -34, dy: 30, dur: 21 },
  { color: "#0E9F6E", opacity: 0.18, size: 50, x: 38, y: 52, dx: 26, dy: -34, dur: 25 },
  { color: "#E0396E", opacity: 0.16, size: 36, x: 74, y: 44, dx: -30, dy: -22, dur: 19 },
];

/**
 * Slow-drifting colour field used as page atmosphere.
 *
 * These were SVG circles behind a `feGaussianBlur` once, which looked the same
 * and cost far more: an SVG filter is re-rasterised on the CPU every frame it
 * changes, so four drifting blobs re-blurred a full-width region continuously
 * and took a bite out of every scroll. Plain divs under a CSS `blur()` are
 * composited on the GPU instead, and only `transform` is animated, so the
 * browser never has to repaint them.
 */
export function AuroraField({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size}%`,
            aspectRatio: "1",
            background: b.color,
            opacity: b.opacity,
            filter: "blur(72px)",
            willChange: reduce ? undefined : "transform",
          }}
          animate={reduce ? undefined : { x: [0, b.dx, 0], y: [0, b.dy, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
