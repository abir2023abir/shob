import { useId } from "react";

/**
 * The mark is a monogram and a category sign at once: a shopping bag with an
 * S cut clean out of its face, so the violet behind reads through the letter.
 * The handle is the one warm note, and it passes behind the bag rather than
 * sitting on it, which is what stops the whole thing looking like an icon
 * from a set. Drawn once here and mirrored in `public/favicon.svg`.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 64 64" className={className} role="presentation" aria-hidden>
      <defs>
        <linearGradient id={`tile-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A6BFF" />
          <stop offset="46%" stopColor="#5B3DF5" />
          <stop offset="100%" stopColor="#2A1690" />
        </linearGradient>
        <linearGradient id={`sheen-${uid}`} x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`paper-${uid}`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCD2FF" />
        </linearGradient>

        {/* White everywhere except the S, which is punched out of the bag. */}
        <mask id={`cut-${uid}`}>
          <rect width="64" height="64" fill="#FFFFFF" />
          <path
            d="M36.4 34.7a4.45 4.45 0 1 0-4.45 4.45 4.45 4.45 0 1 1-4.45 4.45"
            fill="none"
            stroke="#000000"
            strokeWidth="4.1"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      <rect width="64" height="64" rx="18" fill={`url(#tile-${uid})`} />
      <rect width="64" height="64" rx="18" fill={`url(#sheen-${uid})`} />

      {/* Handle first, so the bag's lip closes over its ends. */}
      <path
        d="M25.4 27.5v-6.2a6.6 6.6 0 0 1 13.2 0v6.2"
        fill="none"
        stroke="#FFA53D"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      <path
        d="M19.2 24.6h25.6a3.1 3.1 0 0 1 3.09 3.4l-1.72 19.1A5.2 5.2 0 0 1 41 51.8H23a5.2 5.2 0 0 1-5.17-4.7L16.11 28a3.1 3.1 0 0 1 3.09-3.4z"
        fill={`url(#paper-${uid})`}
        mask={`url(#cut-${uid})`}
      />
    </svg>
  );
}

interface Props {
  /** `light` for the dark footer, `dark` for the white header. */
  tone?: "dark" | "light";
  /** Drops the tagline and tightens the lockup for the condensed header. */
  compact?: boolean;
  className?: string;
}

/** Mark plus wordmark, locked up. */
export function Logo({ tone = "dark", compact = false, className = "" }: Props) {
  const word = tone === "dark" ? "text-ink" : "text-white";
  const rule = tone === "dark" ? "text-ink-45" : "text-white/50";

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark
        className={`shrink-0 transition-all duration-300 ${compact ? "h-7 w-7" : "h-[34px] w-[34px]"}`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-extrabold tracking-tightest transition-all duration-300 ${word} ${
            compact ? "text-[19px]" : "text-[23px]"
          }`}
        >
          shob
          <span className="text-marigold">.</span>
        </span>
        <span
          className={`hidden overflow-hidden font-mono font-semibold uppercase tracking-[0.3em] transition-all duration-300 sm:block ${rule} ${
            compact ? "mt-0 max-h-0 text-[0px] opacity-0" : "mt-[4px] max-h-3 text-[8px] opacity-100"
          }`}
        >
          Everything
        </span>
      </span>
    </span>
  );
}
