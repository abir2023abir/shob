# Shob — storefront

An eight-category e-commerce front end built as a portfolio piece. Search, filter,
variant selection, a persistent bag, and a three-step checkout with Bangladeshi
payment options.

Every product image is drawn in code as an SVG, so the catalogue has no external
image dependencies, nothing can 404, and the whole site ships in one bundle. Each
of the forty products has its own drawing in `src/components/product-art/scenes.tsx`
— the ultrabook looks like an ultrabook, the saree like a saree — and the four
gallery thumbnails move the camera over that one drawing rather than recolouring it.

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

## Admin panel

Sign in at **`/admin`**:

| | |
| --- | --- |
| Username | `saiful` |
| Password | `abir12##` |

> **This is a demo gate, not authentication.** The check runs in the browser, so
> the credentials are readable in the shipped JavaScript. It exists so the panel
> can be shown to somebody. Making it real is a change to `verify()` in
> `src/admin/auth/AdminAuthProvider.tsx` alone — POST to your endpoint and store
> the returned token instead of the flag. Nothing else in the panel needs to move.

**Dashboard** — revenue, order count, average order value, and units shipped, each
against the previous equivalent window, over a 7/30/90-day toggle. A hover-readable
revenue chart, revenue split by category, best sellers, the latest orders, and a
low-stock list you can restock from without leaving the page. Every chart is
hand-drawn SVG; no charting library is installed.

**Orders** — 84 seeded orders, filterable by status, searchable by reference, name,
phone, or city, sortable, paginated, and exportable to CSV. Opening one shows the
customer, the lines at the price they were bought at, the totals, and the fulfilment
actions: advance one step along pending → confirmed → packed → shipped → delivered,
or cancel while it is still in the warehouse.

**Products** — the full catalogue with search, category and stock filters, sorting,
and bulk select for deleting or restocking. The editor validates as a shop owner
would want: a struck-through price has to be higher than the live one, stock has to
be a whole number, a rating has to fit on a five-star scale. Every catalogue
product has its own drawing, and a product added in the panel falls back to a
generic shape for its category, so adding one needs no image upload.

**Customers** — derived from the orders rather than stored separately, keyed by phone
number, with lifetime spend, order count, and a per-person history.

**Settings** — shop name, support number, delivery fee, free-delivery threshold,
promo code and percentage, and the low-stock threshold. Plus a reset that rebuilds
the demo data from the seed.

### It really drives the storefront

Product edits and settings changes are not admin-only decoration. Both are written
to `localStorage`, and `catalogue.ts` and `format.ts` read them once at module load —
so changing a price in the panel changes it on the product page, and moving the
free-delivery threshold moves it in the bag, on the storefront's next load.

Reading at load rather than through a context is a deliberate trade: an edit needs a
page load to appear, and in exchange every existing call site, and the tests that run
without a DOM, stay exactly as they were.

The demo data is generated from a seeded PRNG, so the dashboard shows the same
numbers every time — a client clicking around should not watch the figures move.

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
    product-art/ scenes.tsx — one SVG drawing per catalogue product
  pages/         Home, Shop, ProductPage, Saved, Checkout, NotFound
  store/         shop.tsx         — provider: reducer, persistence, hydration
                 shop-context.ts  — context, useShop, the value's types
  hooks/         useCatalogueFilters, useKeyboard, useDelayedFlag
  data/          catalogue.ts — typed products and categories
  lib/           format.ts (money, discounts), totals.ts (bag maths),
                 stock.ts (quantity clamping), motion.ts (variants)

  admin/         AdminApp.tsx — routes and the signed-in guard
    auth/        AdminAuthProvider + context (swap verify() for a real API)
    data/        AdminDataProvider + context — products, orders, settings
    components/  AdminLayout, charts (SVG), ui (panels, drawers, dialogs)
    pages/       Login, Dashboard, Orders, Products, ProductEditor,
                 Customers, Settings
    lib/         orders.ts (metrics), seed.ts (demo data), product-draft.ts,
                 types.ts
```

The admin panel is a lazily-loaded chunk, so a shopper browsing products never
downloads it: the storefront entry is 125 kB gzipped and the panel is a separate
20 kB fetched only at `/admin`.

`ShopProvider` owns all commerce state. Pages read it through `useShop()` and never
hold cart state locally. The context and hook sit in their own module so editing
the provider does not cost a full reload under Fast Refresh.

The money maths lives in `lib/totals.ts` rather than inside the provider, so the
bag, the drawer, and checkout cannot disagree about a number — and so it can be
tested without mounting React.

## Tests

`npm run test` runs Vitest over the pure layers — the bag totals, currency and
discount formatting, quantity clamping, the URL filter parse/serialise round trip,
and the admin's order metrics, status flow, demo-data generator, and product-form
validation. 83 assertions, no DOM required.

Things worth knowing that the tests pin down: the promo is applied *before* the
free-delivery threshold is tested, so discounting below ৳2,500 does reinstate the
fee; a quantity is always clamped to the stock the catalogue reports; and a
persisted bag is re-validated on load, so a product that has left the catalogue
disappears from the cart instead of crashing it. On the admin side: an old order
keeps the price it was bought at, cancelled orders are counted but never banked, and
the demo generator never leaves a two-month-old order sitting at "pending".

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
