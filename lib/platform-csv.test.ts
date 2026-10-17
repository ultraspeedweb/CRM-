import { describe, expect, it } from "vitest";
import { csvCell } from "./platform-csv";

describe("platform export spreadsheet injection", () => {
  it.each(["=SUM(1,1)", "+cmd", "-2+3", "@HYPERLINK(1)", "  =SUM(1,1)", "\t=1+1", "\r\n@x"])(
    "neutralizes formulas: %j",
    (value) => expect(csvCell(value)).toBe('"' + ("'" + value).replace(/"/g, '""') + '"'),
  );
  it("preserves normal text and escapes CSV quotes", () => {
    expect(csvCell('Example "North", Inc')).toBe('"Example ""North"", Inc"');
    expect(csvCell(null)).toBe('""');
    expect(csvCell(" Istanbul")).toBe('" Istanbul"');
  });
});
