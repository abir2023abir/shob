import { useId } from "react";

/**
 * A shopping bag sitting in a violet squircle, with the handle carrying the
 * one warm note in the palette. Drawn once here and mirrored in
 * `public/favicon.svg`, so the tab icon and the header never drift apart.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 64 64" className={className} role="presentation" aria-hidden>
      <defs>
        <linearGradient id={`tile-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7A5CFF" />
          <stop offset="52%" stopColor="#5B3DF5" />
          <stop offset="100%" stopColor="#2E1B9C" />
        </linearGradient>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        {/* Paper, not flat white — the bag has a front face and a shaded foot. */}
        <linearGradient id={`paper-${uid}`} x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E6DEFF" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="17" fill={`url(#tile-${uid})`} />
      <rect width="64" height="64" rx="17" fill={`url(#sheen-${uid})`} />

      {/* The handle sits behind the bag, so the bag's lip overlaps its ends. */}
      <path
        d="M26 27v-6a6 6 0 0 1 12 0v6"
        fill="none"
        stroke="#F9A03F"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M19.5 24.5h25a3 3 0 0 1 2.99 3.26l-1.6 18.5A5 5 0 0 1 40.91 51H23.09a5 5 0 0 1-4.98-4.74l-1.6-18.5a3 3 0 0 1 2.99-3.26z"
        fill={`url(#paper-${uid})`}
      />
    </svg>
  );
}

interface Props {
  /** `light` for the dark footer, `dark` for the white header. */
  tone?: "dark" | "light";
  className?: string;
}

/** Mark plus wordmark, locked up. */
export function Logo({ tone = "dark", className = "" }: Props) {
  const word = tone === "dark" ? "text-ink" : "text-white";
  const rule = tone === "dark" ? "text-ink-45" : "text-white/50";

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-[30px] w-[30px] shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[22px] font-extrabold tracking-tightest ${word}`}>
          shob
          <span className="text-marigold">.</span>
        </span>
        <span
          className={`mt-[3px] hidden font-mono text-[8.5px] font-semibold uppercase tracking-[0.28em] ${rule} sm:block`}
        >
          Everything
        </span>
      </span>
    </span>
  );
}
