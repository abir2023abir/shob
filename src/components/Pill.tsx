import type { ReactNode } from "react";

const TONES = {
  violet: "bg-violet-soft text-violet",
  marigold: "bg-marigold-soft text-marigold-deep",
  jade: "bg-jade-soft text-jade-deep",
  rose: "bg-rose-soft text-rose",
} as const;

export function Pill({
  children,
  tone = "violet",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold tracking-wide ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
