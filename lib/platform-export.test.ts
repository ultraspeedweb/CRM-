import { describe, expect, it } from "vitest";
import { platformCsvCell, platformLoginRedirect } from "./platform-export";

describe("platform metadata CSV safety", () => {
  it("quotes and escapes normal CSV data", () => {
    expect(platformCsvCell('Acme, "North"')).toBe('"Acme, ""North"""');
    expect(platformCsvCell(null)).toBe('""');
    expect(platformCsvCell("2026-11-10")).toBe('"2026-11-10"');
  });

  it.each(["=1+1", "+SUM(1,2)", "-1+2", "@SUM(A1)", "  =HYPERLINK(\"https://example.com\")", "\t=1+1", "\n@SUM(A1)"])(
    "neutralizes spreadsheet formula input %j",
    (input) => {
      const encoded = platformCsvCell(input);
      expect(encoded).toBe('"' + ("'" + input).replace(/"/g, '""') + '"');
    },
  );

  it("keeps ordinary text intact", () => {
    expect(platformCsvCell("Company A")).toBe('"Company A"');
  });
});

describe("platform export unauthenticated redirect", () => {
  it("retains the current deployment origin", () => {
    expect(platformLoginRedirect("http://127.0.0.1:3000/platform/export").toString()).toBe("http://127.0.0.1:3000/login");
    expect(platformLoginRedirect("https://preview.example.test/platform/export").toString()).toBe("https://preview.example.test/login");
    expect(platformLoginRedirect("https://satisdesk.com/platform/export").toString()).toBe("https://satisdesk.com/login");
  });
});
