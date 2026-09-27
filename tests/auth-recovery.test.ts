import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("commercial auth recovery surface", () => {
  it("exposes password recovery and verification resend from login", () => {
    const page = fs.readFileSync("app/login/page.tsx", "utf8");
    expect(page).toContain("/forgot-password");
    expect(page).toContain("/resend-verification");
  });

  it("uses a dedicated recovery callback and non-enumerating response", () => {
    const action = fs.readFileSync("app/forgot-password/actions.ts", "utf8");
    expect(action).toContain("/auth/recovery");
    expect(action).toContain("إذا كان الحساب موجودًا");
  });

  it("requires strong matching passwords before update", () => {
    const action = fs.readFileSync("app/reset-password/actions.ts", "utf8");
    expect(action).toContain("isStrongEnoughPassword");
    expect(action).toContain("password !== confirm");
  });
});
