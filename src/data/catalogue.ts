export type CategoryId =
  | "electronics"
  | "fashion"
  | "home"
  | "beauty"
  | "grocery"
  | "sports"
  | "books"
  | "kids";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  hue: number;
}

export interface Colorway {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  cat: CategoryId;
  name: string;
  brand: string;
  price: number;
  old?: number;
  rating: number;
  reviews: number;
  stock: number;
  badge?: string;
  sizes?: string[];
  colors?: Colorway[];
  blurb: string;
  specs: [string, string][];
}

export const CATEGORIES: Category[] = [
  { id: "electronics", label: "Electronics", blurb: "Machines that earn their desk space", hue: 258 },
  { id: "fashion", label: "Fashion", blurb: "Handloom, denim, and everything between", hue: 338 },
  { id: "home", label: "Home & Living", blurb: "Clay, jute, and warm light", hue: 24 },
  { id: "beauty", label: "Beauty", blurb: "Short ingredient lists only", hue: 300 },
  { id: "grocery", label: "Grocery", blurb: "Staples sourced close to home", hue: 104 },
  { id: "sports", label: "Sports", blurb: "Kit for the court, mat, and pitch", hue: 190 },
  { id: "books", label: "Books", blurb: "Paper worth keeping on the shelf", hue: 44 },
  { id: "kids", label: "Kids & Toys", blurb: "Built to survive a five-year-old", hue: 212 },
];

const SIZES = ["S", "M", "L", "XL"];
const WAYS: Colorway[] = [
  { name: "Slate", hex: "#3F4756" },
  { name: "Sand", hex: "#D9C6A8" },
  { name: "Ink", hex: "#1B1B23" },
  { name: "Moss", hex: "#5A6B4B" },
];

export const PRODUCTS: Product[] = [
  // ── Electronics ────────────────────────────────────────────────
  {
    id: "e1", cat: "electronics", name: "Aurora 14 Ultrabook", brand: "Nova",
    price: 149900, old: 168000, rating: 4.8, reviews: 412, stock: 6, badge: "Staff pick",
    blurb: "A 1.2kg aluminium body, a 14-hour battery, and a fan you will almost never hear.",
    specs: [["Display", '14" 2.8K OLED, 120Hz'], ["Memory", "16GB LPDDR5"], ["Storage", "512GB NVMe"], ["Weight", "1.24 kg"], ["Warranty", "2 years"]],
  },
  {
    id: "e2", cat: "electronics", name: "Pulse Buds Pro", brand: "Lumen",
    price: 8900, old: 11500, rating: 4.6, reviews: 2841, stock: 48,
    blurb: "Active noise cancelling that holds up on a CNG ride, with 32 hours in the case.",
    specs: [["Driver", "11mm dynamic"], ["Battery", "8h + 24h case"], ["Rating", "IPX5"], ["Codec", "AAC, LDAC"]],
  },
  {
    id: "e3", cat: "electronics", name: 'Halo 27" 4K Monitor', brand: "Orbit",
    price: 62500, rating: 4.5, reviews: 190, stock: 3,
    blurb: "Factory-calibrated colour and a stand that actually goes low enough.",
    specs: [["Panel", "27\" IPS 4K"], ["Colour", "98% DCI-P3"], ["Ports", "USB-C 90W, 2×HDMI"], ["Refresh", "60Hz"]],
  },
  {
    id: "e4", cat: "electronics", name: "Tide Mechanical Keyboard", brand: "Kestrel",
    price: 11200, old: 13400, rating: 4.7, reviews: 764, stock: 21,
    blurb: "Gasket-mounted, hot-swappable, and quiet enough for a shared room.",
    specs: [["Layout", "75%"], ["Switch", "Linear, 45g"], ["Connection", "Wired + 2.4G"], ["Keycaps", "PBT double-shot"]],
  },
  {
    id: "e5", cat: "electronics", name: "Vault 2TB Portable SSD", brand: "Orbit",
    price: 17800, rating: 4.9, reviews: 331, stock: 0,
    blurb: "1,050 MB/s over USB-C in a shell that survives a bag full of keys.",
    specs: [["Capacity", "2TB"], ["Speed", "1050 MB/s read"], ["Interface", "USB 3.2 Gen 2"], ["Rating", "IP55"]],
  },

  // ── Fashion ────────────────────────────────────────────────────
  {
    id: "f1", cat: "fashion", name: "Muslin Panjabi, Slate", brand: "Anokha",
    price: 3450, old: 4200, rating: 4.7, reviews: 902, stock: 34, badge: "Handwoven",
    sizes: SIZES, colors: WAYS,
    blurb: "Woven in Narayanganj, cut long, and light enough for a Dhaka summer.",
    specs: [["Fabric", "100% cotton muslin"], ["Fit", "Regular, long"], ["Care", "Cold hand wash"], ["Origin", "Narayanganj"]],
  },
  {
    id: "f2", cat: "fashion", name: "Rainshell Windbreaker", brand: "Kestrel",
    price: 6900, rating: 4.4, reviews: 218, stock: 12, sizes: SIZES, colors: WAYS.slice(0, 3),
    blurb: "Packs into its own pocket and shrugs off a monsoon afternoon.",
    specs: [["Shell", "20D ripstop nylon"], ["Rating", "10,000mm"], ["Seams", "Fully taped"], ["Packed", "180g"]],
  },
  {
    id: "f3", cat: "fashion", name: "Everyday Denim, Straight", brand: "Muri",
    price: 4200, old: 5100, rating: 4.3, reviews: 1140, stock: 60, sizes: SIZES,
    blurb: "Mid-rise, straight through the leg, and broken in after one wash.",
    specs: [["Fabric", "12oz cotton denim"], ["Rise", "Mid"], ["Leg", "Straight"], ["Stretch", "2%"]],
  },
  {
    id: "f4", cat: "fashion", name: "Handloom Cotton Saree", brand: "Padma",
    price: 5800, rating: 4.9, reviews: 655, stock: 9, colors: WAYS,
    blurb: "Six and a half yards from a Tangail loom, with an unstitched blouse piece.",
    specs: [["Length", "6.5 yards"], ["Fabric", "Handloom cotton"], ["Blouse", "Unstitched, included"], ["Origin", "Tangail"]],
  },
  {
    id: "f5", cat: "fashion", name: "Trail Runner Low", brand: "Terrafirm",
    price: 7450, old: 8900, rating: 4.5, reviews: 480, stock: 27, sizes: SIZES,
    blurb: "Grippy lugs, a wide toe box, and a midsole that holds up past 500km.",
    specs: [["Drop", "6mm"], ["Outsole", "4mm lugs"], ["Weight", "268g"], ["Upper", "Recycled mesh"]],
  },

  // ── Home ───────────────────────────────────────────────────────
  {
    id: "h1", cat: "home", name: "Clay Dinner Set, 16 pc", brand: "Terrafirm",
    price: 5400, old: 6800, rating: 4.6, reviews: 214, stock: 15,
    blurb: "Wheel-thrown stoneware, glazed twice, and safe in a microwave.",
    specs: [["Pieces", "16 (service for 4)"], ["Material", "Stoneware"], ["Microwave", "Yes"], ["Dishwasher", "Yes"]],
  },
  {
    id: "h2", cat: "home", name: "Jute Floor Rug, 5×7", brand: "Padma",
    price: 4900, rating: 4.4, reviews: 128, stock: 7,
    blurb: "Flat-woven from Bangladeshi jute, reversible, and it only gets softer.",
    specs: [["Size", "5ft × 7ft"], ["Material", "Natural jute"], ["Pile", "Flat weave"], ["Reversible", "Yes"]],
  },
  {
    id: "h3", cat: "home", name: "Ember Table Lamp", brand: "Lumen",
    price: 3200, old: 3900, rating: 4.7, reviews: 356, stock: 40,
    blurb: "A warm 2700K glow with a dimmer you turn, not tap.",
    specs: [["Colour", "2700K warm"], ["Dimming", "Rotary, 10–100%"], ["Shade", "Linen"], ["Bulb", "E27, included"]],
  },
  {
    id: "h4", cat: "home", name: "Nakshi Cushion Covers, 4 pc", brand: "Anokha",
    price: 1850, rating: 4.8, reviews: 512, stock: 52, badge: "Bestseller",
    blurb: "Hand-embroidered nakshi kantha motifs on heavy cotton, zipped at the back.",
    specs: [["Size", "18\" × 18\""], ["Fabric", "Cotton canvas"], ["Closure", "Hidden zip"], ["Set", "4 covers"]],
  },
  {
    id: "h5", cat: "home", name: "Ceramic Pour-Over Kit", brand: "Muri",
    price: 2950, old: 3600, rating: 4.5, reviews: 288, stock: 18,
    blurb: "A 600ml carafe, ceramic dripper, and a filter stack to start you off.",
    specs: [["Carafe", "600ml borosilicate"], ["Dripper", "Glazed ceramic"], ["Filters", "40 included"], ["Serves", "1–3 cups"]],
  },

  // ── Beauty ─────────────────────────────────────────────────────
  {
    id: "b1", cat: "beauty", name: "Neem & Clay Face Wash", brand: "Anokha",
    price: 690, old: 850, rating: 4.6, reviews: 1873, stock: 120,
    blurb: "Six ingredients, no fragrance, and it will not strip your skin.",
    specs: [["Volume", "150ml"], ["Skin", "Oily to combination"], ["pH", "5.5"], ["Fragrance", "None"]],
  },
  {
    id: "b2", cat: "beauty", name: "Cold-Pressed Almond Oil, 200ml", brand: "Padma",
    price: 1150, rating: 4.8, reviews: 940, stock: 64,
    blurb: "Single-ingredient, pressed without heat, bottled in amber glass.",
    specs: [["Volume", "200ml"], ["Process", "Cold pressed"], ["Bottle", "Amber glass"], ["Additives", "None"]],
  },
  {
    id: "b3", cat: "beauty", name: "Silk Finish Lipstick", brand: "Muri",
    price: 1350, old: 1600, rating: 4.3, reviews: 621, stock: 88,
    blurb: "A satin finish that lasts through lunch without drying out.",
    specs: [["Finish", "Satin"], ["Weight", "3.8g"], ["Wear", "6–8 hours"], ["Shades", "12"]],
  },
  {
    id: "b4", cat: "beauty", name: "Sunscreen SPF 50 PA+++", brand: "Lumen",
    price: 1490, rating: 4.7, reviews: 2210, stock: 4, badge: "Low stock",
    blurb: "No white cast, no pilling under makeup, reapplies without a mess.",
    specs: [["SPF", "50 PA+++"], ["Type", "Hybrid"], ["Volume", "50ml"], ["White cast", "None"]],
  },
  {
    id: "b5", cat: "beauty", name: "Rosewater Toner", brand: "Anokha",
    price: 540, old: 700, rating: 4.5, reviews: 1420, stock: 96,
    blurb: "Steam-distilled rose, nothing else, in a fine-mist bottle.",
    specs: [["Volume", "200ml"], ["Process", "Steam distilled"], ["Alcohol", "None"], ["Spray", "Fine mist"]],
  },

  // ── Grocery ────────────────────────────────────────────────────
  {
    id: "g1", cat: "grocery", name: "Kalijira Rice, 5kg", brand: "Padma",
    price: 780, old: 920, rating: 4.7, reviews: 3120, stock: 200, badge: "Bestseller",
    blurb: "Small-grain aromatic rice, sun-dried and hand-sorted before packing.",
    specs: [["Weight", "5kg"], ["Grain", "Short aromatic"], ["Harvest", "Aman season"], ["Sorting", "Hand"]],
  },
  {
    id: "g2", cat: "grocery", name: "Mustard Oil, Cold Pressed 1L", brand: "Terrafirm",
    price: 460, rating: 4.6, reviews: 2044, stock: 150,
    blurb: "Ghani-pressed, unfiltered, and pungent the way it should be.",
    specs: [["Volume", "1 litre"], ["Process", "Wood ghani"], ["Filtering", "Unfiltered"], ["Shelf life", "12 months"]],
  },
  {
    id: "g3", cat: "grocery", name: "Sundarban Honey, 500g", brand: "Padma",
    price: 1250, old: 1450, rating: 4.9, reviews: 1688, stock: 30,
    blurb: "Wild-harvested from the mangroves, raw, and it will crystallise — that is the point.",
    specs: [["Weight", "500g"], ["Source", "Wild mangrove"], ["Processing", "Raw, unheated"], ["Season", "April harvest"]],
  },
  {
    id: "g4", cat: "grocery", name: "Single-Origin Coffee, 250g", brand: "Muri",
    price: 950, rating: 4.5, reviews: 402, stock: 44,
    blurb: "Medium roast from Bandarban, roasted weekly, ground to order.",
    specs: [["Weight", "250g"], ["Roast", "Medium"], ["Origin", "Bandarban"], ["Notes", "Cocoa, citrus"]],
  },
  {
    id: "g5", cat: "grocery", name: "Chinigura Rice, 2kg", brand: "Padma",
    price: 420, old: 490, rating: 4.4, reviews: 1290, stock: 175,
    blurb: "The polao rice. Fragrant, tiny-grained, and it doubles in the pot.",
    specs: [["Weight", "2kg"], ["Grain", "Fine aromatic"], ["Best for", "Polao, biryani"], ["Origin", "Dinajpur"]],
  },

  // ── Sports ─────────────────────────────────────────────────────
  {
    id: "s1", cat: "sports", name: "Court Grip Badminton Racket", brand: "Kestrel",
    price: 3900, old: 4700, rating: 4.5, reviews: 366, stock: 22,
    blurb: "Head-light balance, strung at 24lbs, with a cover in the box.",
    specs: [["Weight", "4U (80–84g)"], ["Balance", "Head light"], ["Tension", "Up to 30lbs"], ["Frame", "Graphite"]],
  },
  {
    id: "s2", cat: "sports", name: "Cork Cricket Ball, 4 pc", brand: "Terrafirm",
    price: 1650, rating: 4.4, reviews: 289, stock: 38,
    blurb: "Hand-stitched leather over a cork core, seasoned and match-weight.",
    specs: [["Weight", "156g"], ["Core", "Cork"], ["Stitching", "Hand, 4-piece"], ["Pack", "4 balls"]],
  },
  {
    id: "s3", cat: "sports", name: "Foam Yoga Mat, 6mm", brand: "Muri",
    price: 1980, old: 2400, rating: 4.6, reviews: 812, stock: 55,
    blurb: "Closed-cell foam that grips when your palms are wet, with a carry strap.",
    specs: [["Thickness", "6mm"], ["Size", "183 × 61cm"], ["Material", "TPE, closed cell"], ["Strap", "Included"]],
  },
  {
    id: "s4", cat: "sports", name: "Adjustable Dumbbell, 20kg", brand: "Orbit",
    price: 8900, rating: 4.7, reviews: 174, stock: 0,
    blurb: "2kg to 20kg on a dial, in the footprint of a shoebox.",
    specs: [["Range", "2–20kg"], ["Increment", "2kg"], ["Adjust", "Dial"], ["Pair", "Sold singly"]],
  },
  {
    id: "s5", cat: "sports", name: "Hydration Bottle, 1L", brand: "Nova",
    price: 890, old: 1100, rating: 4.3, reviews: 1005, stock: 130,
    blurb: "Vacuum-insulated, cold for 24 hours, and the lid does not leak in a bag.",
    specs: [["Volume", "1 litre"], ["Insulation", "Double wall"], ["Cold", "24 hours"], ["Body", "18/8 steel"]],
  },

  // ── Books ──────────────────────────────────────────────────────
  {
    id: "k1", cat: "books", name: "The Delta Almanac", brand: "Padma",
    price: 620, rating: 4.8, reviews: 233, stock: 41,
    blurb: "A year in the life of a river system, told month by month.",
    specs: [["Pages", "288"], ["Binding", "Paperback"], ["Language", "English"], ["Published", "2024"]],
  },
  {
    id: "k2", cat: "books", name: "Systems for Small Teams", brand: "Orbit",
    price: 1150, old: 1400, rating: 4.6, reviews: 158, stock: 19,
    blurb: "How four people ship what twenty usually cannot. Short chapters, real examples.",
    specs: [["Pages", "204"], ["Binding", "Hardcover"], ["Language", "English"], ["Published", "2025"]],
  },
  {
    id: "k3", cat: "books", name: "Bangla Grammar, Revised", brand: "Anokha",
    price: 480, rating: 4.4, reviews: 640, stock: 77,
    blurb: "The standard reference, revised, with exercises at the end of each section.",
    specs: [["Pages", "412"], ["Binding", "Paperback"], ["Language", "Bangla"], ["Edition", "7th"]],
  },
  {
    id: "k4", cat: "books", name: "Field Notes on Rivers", brand: "Muri",
    price: 890, old: 1050, rating: 4.7, reviews: 121, stock: 13,
    blurb: "Illustrated essays from six months on the Jamuna, printed on uncoated stock.",
    specs: [["Pages", "176"], ["Binding", "Paperback"], ["Illustrated", "Yes"], ["Published", "2024"]],
  },
  {
    id: "k5", cat: "books", name: "Learn to Draw, Volume One", brand: "Lumen",
    price: 750, rating: 4.5, reviews: 388, stock: 58,
    blurb: "Line, shape, and shadow in forty exercises. No talent required to start.",
    specs: [["Pages", "160"], ["Binding", "Spiral"], ["Level", "Beginner"], ["Exercises", "40"]],
  },

  // ── Kids ───────────────────────────────────────────────────────
  {
    id: "t1", cat: "kids", name: "Wooden Block City, 60 pc", brand: "Muri",
    price: 2400, old: 2900, rating: 4.8, reviews: 447, stock: 26,
    blurb: "Rubberwood blocks with non-toxic paint, sanded round at every edge.",
    specs: [["Pieces", "60"], ["Wood", "Rubberwood"], ["Paint", "Water based"], ["Age", "3+"]],
  },
  {
    id: "t2", cat: "kids", name: "Rocket Night Light", brand: "Lumen",
    price: 1450, rating: 4.6, reviews: 266, stock: 62,
    blurb: "A soft amber glow on a two-hour timer, rechargeable over USB-C.",
    specs: [["Light", "Amber, dimmable"], ["Battery", "20 hours"], ["Timer", "30/60/120 min"], ["Charge", "USB-C"]],
  },
  {
    id: "t3", cat: "kids", name: "Cotton Play Mat", brand: "Padma",
    price: 3100, old: 3700, rating: 4.5, reviews: 189, stock: 11,
    blurb: "Quilted cotton, machine washable, and it folds down to sofa-cushion size.",
    specs: [["Size", "150 × 150cm"], ["Fill", "Cotton wadding"], ["Wash", "Machine, 30°"], ["Age", "0+"]],
  },
  {
    id: "t4", cat: "kids", name: "Gear Robot Build Kit", brand: "Orbit",
    price: 3850, rating: 4.7, reviews: 302, stock: 8,
    blurb: "Eighty parts, twelve builds, and a printed manual a child can follow alone.",
    specs: [["Parts", "80"], ["Builds", "12"], ["Motor", "Included"], ["Age", "8+"]],
  },
  {
    id: "t5", cat: "kids", name: "Soft Tiger, 40cm", brand: "Anokha",
    price: 1250, old: 1500, rating: 4.9, reviews: 723, stock: 49, badge: "Bestseller",
    blurb: "Recycled-fibre fill, embroidered eyes, and it survives the washing machine.",
    specs: [["Height", "40cm"], ["Fill", "Recycled fibre"], ["Eyes", "Embroidered"], ["Wash", "Machine safe"]],
  },
];

export const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();
export const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price));
export const MIN_PRICE = Math.min(...PRODUCTS.map((p) => p.price));

export const categoryOf = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];

export const productById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const relatedTo = (product: Product, count = 4): Product[] =>
  PRODUCTS.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, count);
