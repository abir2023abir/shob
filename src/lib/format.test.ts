import { describe, expect, it } from "vitest";
import { RATE, discountPercent, money, orderNumber, plural } from "./format";

describe("money", () => {
  it("renders taka with a group separator and no decimals", () => {
    expect(money(1234)).toBe("৳1,234");
    expect(money(999)).toBe("৳999");
  });

  it("rounds taka rather than showing paisa", () => {
    expect(money(1234.6)).toBe("৳1,235");
  });

  it("converts to dollars at the demo rate", () => {
    expect(money(RATE * 100, "USD")).toBe("$100.00");
  });
});

describe("discountPercent", () => {
  it("returns the markdown as a whole percentage", () => {
    expect(discountPercent(800, 1000)).toBe(20);
  });

  it("returns zero when there is no old price", () => {
    expect(discountPercent(800)).toBe(0);
  });

  it("returns zero when the old price is not actually higher", () => {
    expect(discountPercent(1000, 900)).toBe(0);
    expect(discountPercent(1000, 1000)).toBe(0);
  });
});

describe("plural", () => {
  it("keeps the singular at one", () => {
    expect(plural(1, "item")).toBe("1 item");
  });

  it("pluralises everything else", () => {
    expect(plural(0, "item")).toBe("0 items");
    expect(plural(3, "item")).toBe("3 items");
  });

  it("accepts an irregular plural", () => {
    expect(plural(2, "box", "boxes")).toBe("2 boxes");
  });
});

describe("orderNumber", () => {
  it("produces a six-digit reference", () => {
    expect(orderNumber()).toMatch(/^SHB-\d{6}$/);
  });
});
