import { motion, useReducedMotion } from "motion/react";

const BLOBS = [
  { cx: 210, cy: 180, r: 190, fill: "#5B3DF5", opacity: 0.22, dx: 40, dy: -26, dur: 17 },
  { cx: 640, cy: 120, r: 160, fill: "#F08000", opacity: 0.2, dx: -34, dy: 30, dur: 21 },
  { cx: 460, cy: 380, r: 210, fill: "#0E9F6E", opacity: 0.16, dx: 26, dy: -34, dur: 25 },
  { cx: 820, cy: 340, r: 150, fill: "#E0396E", opacity: 0.14, dx: -30, dy: -22, dur: 19 },
];

/**
 * Slow-drifting colour field used as page atmosphere. It sits behind content,
 * never intercepts pointer events, and freezes when the visitor has asked for
 * reduced motion.
 */
export function AuroraField({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg viewBox="0 0 1000 520" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="aurora-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="70" />
          </filter>
        </defs>
        <g filter="url(#aurora-blur)">
          {BLOBS.map((b, i) => (
            <motion.circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill={b.fill}
              opacity={b.opacity}
              animate={
                reduce
                  ? undefined
                  : {
                      x: [0, b.dx, 0],
                      y: [0, b.dy, 0],
                      opacity: [b.opacity, b.opacity * 1.25, b.opacity],
                    }
              }
              transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
