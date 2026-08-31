# Shob — storefront

An eight-category e-commerce front end built as a portfolio piece. Search, filter,
variant selection, a persistent bag, and a three-step checkout with Bangladeshi
payment options.

Every product image is drawn in code as an SVG, so the catalogue has no external
image dependencies, nothing can 404, and the whole site ships in one bundle.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle into dist/
npm run preview    # serve the built bundle
npm run typecheck  # tsc, strict, no emit
npm run lint       # ESLint 9, flat config
npm run test       # Vitest, one pass
npm run check      # typecheck + lint + test — what CI would run
```

Node 18 or newer.

## Stack

| Layer | Choice |
| --- | --- |
| Build | Vite 6 |
| Language | TypeScript, strict |
| UI | React 18 |
| Styling | Tailwind CSS 3 with a custom token layer |
| Motion | `motion` (Framer Motion) |
| Routing | React Router 6 |
| Icons | lucide-react |
| Tests | Vitest |
| Linting | ESLint 9, flat config, typescript-eslint |

## What's in it

**Catalogue** — 40 products across 8 categories. Live search with matched-text
highlighting, filters for category, price ceiling, rating, brand, stock, and sale
status, five sort orders, and grid/list density.

The query string is the single source of truth for the shop view — there is no
mirrored copy in component state to drift out of sync — so every filtered grid is
a link someone can send:

| Param | Values | Example |
| --- | --- | --- |
| `q` | free text | `/shop?q=honey` |
| `cat` | one of the eight category ids | `/shop?cat=grocery` |
| `sort` | `popular`, `rating`, `price-asc`, `price-desc` | `/shop?sort=price-asc` |
| `max` | price ceiling in taka | `/shop?max=5000` |
| `rating` | `4`, `4.5`, `4.8` | `/shop?rating=4.8` |
| `brand` | comma-separated brand names | `/shop?brand=Padma,Muri` |
| `stock` | `1` for in-stock only | `/shop?stock=1` |
| `sale` | `1` for reduced only | `/shop?sale=1` |

Defaults are never written, so a plain `/shop` stays plain. Anything unrecognised
in a hand-edited URL falls back to its default rather than throwing.

**Product pages** — four generated angles, colour and size variants, quantity
stepper, spec table, stock signalling, and related items from the same category.

**Quick view** — the same buy panel in a modal, reachable from any card without
leaving the grid.

**Bag** — variant-aware line items (Slate/M is a different line from Ink/L),
free-delivery progress meter, working promo code `SHOB10`, and BDT/USD switching
across the whole site. State persists to `localStorage`, so a refresh keeps the bag.

**Checkout** — three steps with real validation (including Bangladeshi mobile
number format), bKash / Nagad / card / cash-on-delivery selection, order review, and
an animated confirmation. No gateway is wired up; in production this step hands off
to SSLCommerz or bKash Checkout and returns a transaction ID.

## Motion

All variants live in `src/lib/motion.ts` so timing and easing stay consistent. One
easing curve, `[0.2, 0.7, 0.3, 1]`, is used across the site.

- **Page load** — the hero headline assembles line by line out of a clipped mask
  while the product wall springs in on a stagger.
- **Scroll** — the hero copy and product wall move at different rates and fade out;
  a progress bar under the header tracks document scroll on a spring.
- **Sections** — `Reveal` and `RevealGroup` fire once when a block enters view.
- **Grid** — `layout` plus `AnimatePresence` with `popLayout`, so cards physically
  move to new positions when filters change instead of snapping.
- **Overlays** — cart drawer, quick view, and the mobile filter sheet all run on
  springs, with scroll locked behind them.
- **Micro** — `whileTap` on every button, count badges that roll over, and a
  `layoutId` pill that slides between the BDT and USD tabs.
- **Counters** — hero stats count up when scrolled into view.

`prefers-reduced-motion` is honoured globally in `index.css` and checked in the
components that animate continuously.

## Structure

```
src/
  components/    Header, CartDrawer, QuickView, ProductCard, FilterPanel,
                 ProductArt, AuroraField, Reveal, Toaster, Footer, Skeleton
  pages/         Home, Shop, ProductPage, Saved, Checkout, NotFound
  store/         shop.tsx         — provider: reducer, persistence, hydration
                 shop-context.ts  — context, useShop, the value's types
  hooks/         useCatalogueFilters, useKeyboard, useDelayedFlag
  data/          catalogue.ts — typed products and categories
  lib/           format.ts (money, discounts), totals.ts (bag maths),
                 stock.ts (quantity clamping), motion.ts (variants)
```

`ShopProvider` owns all commerce state. Pages read it through `useShop()` and never
hold cart state locally. The context and hook sit in their own module so editing
the provider does not cost a full reload under Fast Refresh.

The money maths lives in `lib/totals.ts` rather than inside the provider, so the
bag, the drawer, and checkout cannot disagree about a number — and so it can be
tested without mounting React.

## Tests

`npm run test` runs Vitest over the pure layers — the bag totals, currency and
discount formatting, quantity clamping, and the URL filter parse/serialise round
trip. 40 assertions, no DOM required.

Things worth knowing that the tests pin down: the promo is applied *before* the
free-delivery threshold is tested, so discounting below ৳2,500 does reinstate the
fee; a quantity is always clamped to the stock the catalogue reports; and a
persisted bag is re-validated on load, so a product that has left the catalogue
disappears from the cart instead of crashing it.

## Accessibility

Keyboard reachable throughout, visible focus rings, `aria-pressed` on every toggle,
`aria-modal` dialogs that close on Escape, a skip link, labelled form fields with
inline errors, and live-region toasts. `/` focuses search from anywhere.

## Deploying

Vercel or Netlify, no configuration needed beyond the included `vercel.json`, which
rewrites all routes to `index.html` so deep links work.

```bash
npm i -g vercel && vercel
```

## Swapping in a real backend

The data layer is deliberately isolated. Replace `src/data/catalogue.ts` with a
fetch against your API and keep the `Product` interface; nothing else needs to
change. `ShopProvider` is where you would add auth, server-side cart sync, and the
payment handoff in `Checkout.tsx`.
