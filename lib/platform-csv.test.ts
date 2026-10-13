import { describe, expect, it } from "vitest";
import { csvCell } from "./platform-csv";

describe("platform metadata CSV", () => {
  it("escapes quotes, commas, and line breaks", () => {
    expect(csvCell('Acme, "Sales"')).toBe('"Acme, ""Sales"""');
    expect(csvCell("one\ntwo")).toBe('"one\ntwo"');
    expect(csvCell(null)).toBe('""');
  });
  it.each(["=1+1", "+SUM(1,2)", "-2+3", "@SUM(A1:A2)", "  =HYPERLINK(\"x\")", "\t=cmd", "\r@evil"])(
    "neutralizes formulas %s", (value) => {
      expect(csvCell(value)).toBe('"\'' + value.replace(/"/g, '""') + '"');
    },
  );
  it("does not prefix ordinary values", () => {
    expect(csvCell("Acme-Co")).toBe('"Acme-Co"');
    expect(csvCell(42)).toBe('"42"');
  });
});
