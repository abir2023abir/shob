import { money, type Currency } from "@/lib/format";

const SIZES = {
  sm: ["text-sm", "text-xs"],
  base: ["text-[17px]", "text-xs"],
  lg: ["text-[26px]", "text-base"],
} as const;

export function Price({
  price,
  old,
  currency,
  size = "base",
}: {
  price: number;
  old?: number;
  currency: Currency;
  size?: keyof typeof SIZES;
}) {
  const [big, small] = SIZES[size];
  return (
    <span className="flex items-baseline gap-2">
      <span className={`font-mono font-bold tracking-tight text-ink ${big}`}>
        {money(price, currency)}
      </span>
      {old ? (
        <span className={`font-mono text-ink-45 line-through ${small}`}>{money(old, currency)}</span>
      ) : null}
    </span>
  );
}
