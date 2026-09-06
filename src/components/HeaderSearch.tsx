import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CornerDownLeft, Search } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Product } from "@/data/catalogue";
import { money } from "@/lib/format";
import { useShop } from "@/store/shop-context";
import { useHotkey } from "@/hooks/useKeyboard";
import { EASE } from "@/lib/motion";
import { ProductArt } from "./ProductArt";
import { Highlight } from "./Highlight";

const MAX = 6;

/** Name, brand, or category — the three things people actually type. */
function search(term: string): Product[] {
  const q = term.trim().toLowerCase();
  if (!q) return [];

  const label = (p: Product) => CATEGORIES.find((c) => c.id === p.cat)?.label ?? "";
  const scored = PRODUCTS.map((p) => {
    const name = p.name.toLowerCase();
    // A name that starts with the query beats one that merely contains it.
    if (name.startsWith(q)) return { p, rank: 0 };
    if (name.includes(q)) return { p, rank: 1 };
    if (p.brand.toLowerCase().includes(q)) return { p, rank: 2 };
    if (label(p).toLowerCase().includes(q)) return { p, rank: 3 };
    return { p, rank: 99 };
  }).filter((r) => r.rank < 99);

  scored.sort((a, b) => a.rank - b.rank || b.p.reviews - a.p.reviews);
  return scored.slice(0, MAX).map((r) => r.p);
}

interface Props {
  /** Current `q` from the URL, so the field agrees with the page. */
  term: string;
  onTermChange: (next: string) => void;
  onSubmit: () => void;
  compact?: boolean;
  /** Only the visible instance should answer the `/` shortcut. */
  hotkey?: boolean;
}

/**
 * The header field answers while you type rather than making you land on the
 * shop first: matches appear under the input with their photograph, arrow keys
 * walk them, Enter opens the highlighted one, and Enter on nothing runs the
 * full search. `/` focuses the field from anywhere on the page.
 */
export function HeaderSearch({
  term,
  onTermChange,
  onSubmit,
  compact = false,
  hotkey = false,
}: Props) {
  const listId = `search-results-${useId().replace(/:/g, "")}`;
  const { currency } = useShop();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);

  const results = useMemo(() => search(term), [term]);
  const showing = open && term.trim().length > 0;

  useHotkey("/", () => inputRef.current?.focus(), hotkey);

  // A new query invalidates whatever row was highlighted.
  useEffect(() => setCursor(-1), [term]);

  // Clicking anywhere else closes the panel.
  useEffect(() => {
    if (!showing) return;
    const away = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [showing]);

  const go = (p: Product) => {
    setOpen(false);
    inputRef.current?.blur();
    navigate(`/product/${p.id}`);
  };

  const keys = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!showing || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c <= 0 ? results.length - 1 : c - 1));
    } else if (e.key === "Enter" && cursor >= 0) {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
          inputRef.current?.blur();
          onSubmit();
        }}
      >
        <div
          className={`group relative flex items-center rounded-2xl border bg-surface/90 shadow-[0_1px_0_rgba(23,20,37,0.03)] backdrop-blur transition-all duration-300 ${
            showing ? "border-violet ring-4 ring-violet/10" : "border-line hover:border-ink-20"
          } ${compact ? "h-10" : "h-11"}`}
        >
          <Search
            size={16}
            className={`pointer-events-none absolute left-3.5 transition-colors ${
              showing ? "text-violet" : "text-ink-45"
            }`}
          />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => {
              onTermChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={keys}
            placeholder="Search 40 products"
            aria-label="Search the catalogue"
            aria-expanded={showing}
            aria-autocomplete="list"
            role="combobox"
            aria-controls={listId}
            className="h-full w-full rounded-2xl bg-transparent pl-10 pr-14 text-[13.5px] outline-none placeholder:text-ink-45"
          />
          <kbd className="pointer-events-none absolute right-3 hidden rounded-md border border-line bg-canvas px-1.5 py-0.5 font-mono text-[10.5px] text-ink-45 lg:block">
            /
          </kbd>
        </div>
      </form>

      <AnimatePresence>
        {showing && (
          <motion.div
            id={listId}
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.16, ease: EASE }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-line bg-surface shadow-pop"
          >
            {results.length === 0 ? (
              <p className="px-4 py-5 text-center text-[13px] text-ink-45">
                Nothing matches “{term.trim()}”.
              </p>
            ) : (
              <>
                <ul role="listbox" aria-label="Search results">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={cursor === i}
                        onMouseEnter={() => setCursor(i)}
                        onClick={() => go(p)}
                        className={`flex w-full items-center gap-3 px-2.5 py-2 text-left transition-colors ${
                          cursor === i ? "bg-violet-soft" : "bg-transparent"
                        }`}
                      >
                        <ProductArt
                          product={p}
                          className="aspect-square w-10 shrink-0 rounded-xl"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold text-ink">
                            <Highlight text={p.name} query={term} />
                          </span>
                          <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-45">
                            {p.brand}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[12.5px] font-bold text-ink">
                          {money(p.price, currency)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onSubmit();
                  }}
                  className="flex w-full items-center justify-between border-t border-line px-4 py-2.5 text-[12.5px] font-semibold text-violet transition-colors hover:bg-violet-soft"
                >
                  See every match for “{term.trim()}”
                  <CornerDownLeft size={13} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
