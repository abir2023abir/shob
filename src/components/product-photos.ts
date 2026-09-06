/**
 * Every catalogue product is shot twice — a packshot and a second look — and
 * both files live in `public/products` as square 760px JPEGs. The gallery
 * builds its four views out of those two frames (see `ProductArt`), which is
 * how a real store with a two-shot budget does it.
 *
 * Products the admin panel invents at runtime have no photos, so they fall
 * back to a drawn category shape rather than a broken image.
 */

/** Catalogue ids that ship with photography. */
const SHOT: ReadonlySet<string> = new Set([
  "e1", "e2", "e3", "e4", "e5",
  "f1", "f2", "f3", "f4", "f5",
  "h1", "h2", "h3", "h4", "h5",
  "b1", "b2", "b3", "b4", "b5",
  "g1", "g2", "g3", "g4", "g5",
  "s1", "s2", "s3", "s4", "s5",
  "k1", "k2", "k3", "k4", "k5",
  "t1", "t2", "t3", "t4", "t5",
]);

export function hasPhotos(id: string): boolean {
  return SHOT.has(id);
}

/** `frame` 0 is the packshot, 1 the second look. */
export function photoSrc(id: string, frame: 0 | 1): string {
  return `/products/${id}-${frame === 0 ? "a" : "b"}.jpg`;
}
