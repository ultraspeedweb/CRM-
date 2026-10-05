import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ONBOARDING_ENTRY,
  resolveAuthenticatedDestination,
} from "./workspace-routing";

type MembershipResult = {
  data: { role: string } | null;
  error: Error | null;
};

function fakeSupabase(result: MembershipResult): SupabaseClient {
  const builder = {
    select: () => builder,
    eq: () => builder,
    limit: () => builder,
    maybeSingle: async () => result,
  };

  return {
    from: () => builder,
  } as unknown as SupabaseClient;
}

describe("authenticated workspace destination resolver", () => {
  it.each([
    ["owner", "/command"],
    ["admin", "/command"],
    ["manager", "/command"],
    ["agent", "/work"],
    ["viewer", "/insights"],
    ["unknown", "/insights"],
  ])("routes active %s membership to %s", async (role, expected) => {
    await expect(
      resolveAuthenticatedDestination(
        fakeSupabase({ data: { role }, error: null }),
        "00000000-0000-4000-8000-000000000001",
      ),
    ).resolves.toBe(expected);
  });

  it("routes users without an active membership to onboarding", async () => {
    await expect(
      resolveAuthenticatedDestination(
        fakeSupabase({ data: null, error: null }),
        "00000000-0000-4000-8000-000000000002",
      ),
    ).resolves.toBe(ONBOARDING_ENTRY);
  });

  it("fails closed when membership lookup fails", async () => {
    const error = new Error("membership lookup failed");
    await expect(
      resolveAuthenticatedDestination(
        fakeSupabase({ data: null, error }),
        "00000000-0000-4000-8000-000000000003",
      ),
    ).rejects.toBe(error);
  });
});
