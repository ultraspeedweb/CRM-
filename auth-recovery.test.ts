import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("auth recovery", () => {
  it("exposes recovery links", () => {
    const page = fs.readFileSync("app/login/page.tsx", "utf8");
    expect(page).toContain("/forgot-password");
    expect(page).toContain("/resend-verification");
  });
});
