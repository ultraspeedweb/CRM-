import { describe, expect, it } from "vitest";
import { isStrongEnoughPassword, parseAppointmentInput, parseDealInput, parseFollowUpInput, parseLeadInput } from "./validation";

describe("lead input", () => {
  it("normalizes valid values and limits the source allowlist", () => {
    const data = new FormData();
    data.set("fullName", "  Ada Lovelace  ");
    data.set("email", " ADA@EXAMPLE.COM ");
    data.set("sourceChannel", "untrusted");

    expect(parseLeadInput(data)).toMatchObject({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      sourceChannel: "manual",
    });
  });

  it("rejects malformed email addresses", () => {
    const data = new FormData();
    data.set("fullName", "Valid Name");
    data.set("email", "not-an-email");
    expect(parseLeadInput(data)).toBeNull();
  });
});

describe("follow-up input", () => {
  it("requires a UUID, subject and valid date", () => {
    const data = new FormData();
    data.set("leadId", "92bde023-eb4c-4fa5-a6ac-4f479228d361");
    data.set("subject", "Review proposal");
    data.set("dueAt", "2026-09-02T12:30");
    expect(parseFollowUpInput(data)?.dueAt).toBe("2026-09-02T09:30:00.000Z");
  });
});

describe("password policy", () => {
  it("requires at least ten characters with letters and numbers", () => {
    expect(isStrongEnoughPassword("short123")).toBe(false);
    expect(isStrongEnoughPassword("long-password")).toBe(false);
    expect(isStrongEnoughPassword("StrongPass1")).toBe(true);
  });
});

describe("commercial workflow input", () => {
  it("turns an Istanbul appointment into an exact time range", () => {
    const data = new FormData();
    data.set("leadId", "92bde023-eb4c-4fa5-a6ac-4f479228d361");
    data.set("title", "Property viewing");
    data.set("startsAt", "2026-09-02T12:30");
    data.set("durationMinutes", "60");
    const appointment = parseAppointmentInput(data);
    expect(appointment?.startsAt).toBe("2026-09-02T09:30:00.000Z");
    expect(appointment?.endsAt).toBe("2026-09-02T10:30:00.000Z");
  });

  it("rejects an impossible deal probability", () => {
    const data = new FormData();
    data.set("leadId", "92bde023-eb4c-4fa5-a6ac-4f479228d361");
    data.set("title", "Pilot");
    data.set("amount", "50000");
    data.set("probability", "120");
    expect(parseDealInput(data)).toBeNull();
  });
});
