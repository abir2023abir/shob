/**
 * Every catalogue product is shot twice — a packshot and a second look — and
 * each frame ships at two sizes: 760px for the product page, 300px for the
 * thumbnails. The gallery builds its four views out of the two frames (see
 * `ProductArt`), which is how a real store with a two-shot budget does it.
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

function slotOf(frame: 0 | 1): "a" | "b" {
  return frame === 0 ? "a" : "b";
}

/** The full-size frame. `frame` 0 is the packshot, 1 the second look. */
export function photoSrc(id: string, frame: 0 | 1): string {
  return `/products/${id}-${slotOf(frame)}.jpg`;
}

/**
 * Both sizes, for the browser to choose between. A tile in the grid is about
 * 150px wide; without this it decodes the 760px bitmap — six times the pixels
 * it can show — for every thumbnail, and the homepage alone was decoding 35
 * megapixels before it could draw a frame.
 */
export function photoSrcSet(id: string, frame: 0 | 1): string {
  const slot = slotOf(frame);
  return `/products/${id}-${slot}-sm.jpg 300w, /products/${id}-${slot}.jpg 760w`;
}
