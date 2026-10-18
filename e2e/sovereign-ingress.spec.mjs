import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test("Sovereign ingress never accepts unsigned inbound booking events", async ({ request }) => {
  const response = await request.post(`${baseURL}/api/integrations/sovereign/events`, {
    data: { event_type: "booking.confirmed" },
  });
  // A configured connector rejects unsigned events; an unconfigured connector fails closed.
  expect([401, 503]).toContain(response.status());
  const responseBody = await response.text();
  expect(responseBody).not.toContain("queued");
});
