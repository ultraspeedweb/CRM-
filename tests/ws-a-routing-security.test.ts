import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("WS-A routing security contracts", () => {
  it("keeps Next redirect outside the login destination lookup try/catch", () => {
    const source = fs.readFileSync("app/login/actions.ts", "utf8");
    expect(source).toContain("resolvedDestination = await resolveAuthenticatedDestination");
    expect(source).toContain("redirect(resolvedDestination);");
    expect(source).not.toContain("redirect(await resolveAuthenticatedDestination");
  });

  it("makes email confirmation destination server-authoritative", () => {
    const source = fs.readFileSync("app/auth/confirm/route.ts", "utf8");
    expect(source).toContain("supabase.auth.verifyOtp");
    expect(source).toContain("supabase.auth.getUser");
    expect(source).toContain("resolveAuthenticatedDestination(supabase, user.id)");
    expect(source).not.toContain('searchParams.get("next")');
    expect(source).not.toContain("startsWith(\"/\")");
    expect(source).not.toContain('"/dashboard"');
  });

  it("does not recover 404 or platform authorization failures through the legacy dashboard", () => {
    const notFound = fs.readFileSync("app/not-found.tsx", "utf8");
    const platform = fs.readFileSync("app/platform/page.tsx", "utf8");
    expect(notFound).not.toContain('href="/dashboard"');
    expect(platform).not.toContain('redirect("/dashboard")');
    expect(platform).toContain("No fallback access was granted.");
  });
});
