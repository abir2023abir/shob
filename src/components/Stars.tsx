import { Star } from "lucide-react";

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <Star size={size} className="fill-marigold text-marigold" />
      <span className="font-mono text-ink-70" style={{ fontSize: size }}>
        {value.toFixed(1)}
      </span>
    </span>
  );
}
