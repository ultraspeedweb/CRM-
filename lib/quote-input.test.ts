import { describe, expect, it } from "vitest";
import { parseQuoteInput } from "./quote-input";

const deal = "11111111-1111-4111-8111-111111111111";

function form(items: unknown) {
  const f = new FormData();
  f.set("dealId", deal);
  f.set("items", JSON.stringify(items));
  return f;
}

describe("parseQuoteInput", () => {
  it("accepts a valid commercial quote", () => {
    const parsed = parseQuoteInput(
      form([
        {
          description: "Consulting",
          quantity: 2,
          unitPrice: 100,
          discountPercent: 10,
          taxPercent: 20,
        },
      ]),
    );
    expect(parsed?.items).toHaveLength(1);
  });

  it("rejects invalid deal id", () => {
    const f = form([{ description: "X", quantity: 1, unitPrice: 1 }]);
    f.set("dealId", "other");
    expect(parseQuoteInput(f)).toBeNull();
  });

  it("rejects empty and unsafe monetary items", () => {
    expect(parseQuoteInput(form([]))).toBeNull();
    expect(
      parseQuoteInput(
        form([
          { description: "X", quantity: -1, unitPrice: 10, discountPercent: 0, taxPercent: 20 },
        ]),
      ),
    ).toBeNull();
    expect(
      parseQuoteInput(
        form([
          { description: "X", quantity: 1, unitPrice: 10, discountPercent: 101, taxPercent: 20 },
        ]),
      ),
    ).toBeNull();
    expect(
      parseQuoteInput(
        form([
          { description: "X", quantity: 1, unitPrice: 1e20, discountPercent: 0, taxPercent: 20 },
        ]),
      ),
    ).toBeNull();
  });

  it("rejects precision beyond database contract", () => {
    expect(
      parseQuoteInput(
        form([
          { description: "X", quantity: 1.0009, unitPrice: 10, discountPercent: 0, taxPercent: 20 },
        ]),
      ),
    ).toBeNull();
    expect(
      parseQuoteInput(
        form([
          { description: "X", quantity: 1, unitPrice: 10.001, discountPercent: 0, taxPercent: 20 },
        ]),
      ),
    ).toBeNull();
  });

  it("rejects malformed validity date", () => {
    const f = form([
      { description: "X", quantity: 1, unitPrice: 10, discountPercent: 0, taxPercent: 20 },
    ]);
    f.set("validUntil", "tomorrow");
    expect(parseQuoteInput(f)).toBeNull();
  });
});
