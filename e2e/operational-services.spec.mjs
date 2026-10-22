import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const apiURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const password = "LocalOpsPass12345";

test("inbox, two-tenant isolation, disabled AI and platform owner work without billing", async ({ page, request }) => {
  // This test provisions synthetic users and a platform role only on a disposable local stack.
  expect(["localhost", "127.0.0.1"]).toContain(new URL(apiURL).hostname);
  expect(["localhost", "127.0.0.1"]).toContain(new URL(baseURL).hostname);
  const admin = createClient(apiURL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });
  const suffix = randomUUID().slice(0, 8);
  const identities = {};
  for (const key of ["owner", "viewer", "other", "platform"]) {
    const email = `ops-${key}-${suffix}@example.test`;
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    expect(error).toBeNull(); expect(data.user).toBeTruthy();
    identities[key] = { id: data.user.id, email };
  }
  const orgA = randomUUID(), orgB = randomUUID();
  expect((await admin.from("organizations").insert([
    { id: orgA, name: `Operational A ${suffix}`, slug: `ops-a-${suffix}` },
    { id: orgB, name: `Operational B ${suffix}`, slug: `ops-b-${suffix}` },
  ])).error).toBeNull();
  expect((await admin.from("organization_members").insert([
    { organization_id: orgA, user_id: identities.owner.id, role: "owner", status: "active" },
    { organization_id: orgA, user_id: identities.viewer.id, role: "viewer", status: "active" },
    { organization_id: orgB, user_id: identities.other.id, role: "owner", status: "active" },
  ])).error).toBeNull();
  expect(identities.platform.id).toMatch(/^[a-f0-9-]{36}$/);
  execFileSync(process.env.SUPABASE_CLI ?? "supabase", ["db", "query", "--local",
    `insert into private.platform_operators(user_id,role,status) values('${identities.platform.id}','platform_owner','active')`], { stdio: "pipe" });

  const textA = `Private inbox A ${suffix}`, textB = `Private inbox B ${suffix}`;
  const threads = [];
  for (const [org, text] of [[orgA, textA], [orgB, textB]]) {
    const result = await request.post(`${baseURL}/api/web-intake`, {
      headers: { "x-satisdesk-intake-secret": process.env.WEB_INTAKE_SECRET },
      data: { organizationId: org, name: text, email: `lead-${org}@example.test`, message: text, language: "en" },
    });
    expect(result.status()).toBe(201);
    threads.push((await result.json()).conversationId);
  }
  const login = async identity => {
    await page.context().clearCookies();
    await page.goto(`${baseURL}/login`);
    await page.locator('input[name="email"]').fill(identity.email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('form.stack-form button[type="submit"]').click();
    await expect(page).not.toHaveURL(/\/login/);
  };
  await login(identities.owner);
  await page.goto(`${baseURL}/conversations?conversation=${threads[0]}`);
  await expect(page.locator(".message-thread")).toContainText(textA);
  await expect(page.locator("main")).not.toContainText(textB);
  await page.locator(`form:has(input[name="conversationId"][value="${threads[0]}"]) button`).click();
  await expect.poll(async () => (await admin.from("conversations").select("unread_count").eq("id", threads[0]).single()).data?.unread_count).toBe(0);
  await page.goto(`${baseURL}/automation`);
  await expect(page.locator('form:has(input[name="conversationId"]) button')).toBeDisabled();
  expect((await page.request.get(`${baseURL}/platform/export`, { maxRedirects: 0 })).status()).toBe(403);

  await login(identities.other);
  await page.goto(`${baseURL}/conversations?conversation=${threads[0]}`);
  await expect(page.locator("main")).not.toContainText(textA);
  await page.goto(`${baseURL}/conversations?conversation=${threads[1]}`);
  await expect(page.locator(".message-thread")).toContainText(textB);

  await login(identities.viewer);
  await page.goto(`${baseURL}/conversations?conversation=${threads[0]}`);
  await expect(page.locator(".message-thread")).toContainText(textA);
  expect((await page.request.get(`${baseURL}/platform/export`, { maxRedirects: 0 })).status()).toBe(403);
  const viewer = createClient(apiURL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
  expect((await viewer.auth.signInWithPassword({ email: identities.viewer.email, password })).error).toBeNull();
  expect((await viewer.from("leads").insert({ organization_id: orgA, full_name: "Viewer may not create this", source_channel: "manual" })).error).not.toBeNull();

  await login(identities.platform);
  await page.goto(`${baseURL}/platform`);
  await expect(page.getByRole("heading", { name: "Platform Operations" })).toBeVisible();
  await expect(page.locator("main")).toContainText(`Operational A ${suffix}`);
  await expect(page.locator("main")).toContainText(`Operational B ${suffix}`);
  await expect(page.locator("main")).not.toContainText(textA);
  const exported = await page.request.get(`${baseURL}/platform/export`);
  expect(exported.status()).toBe(200);
  const csv = await exported.text();
  expect(csv).toContain(`Operational A ${suffix}`); expect(csv).not.toContain(textA); expect(csv).not.toContain(textB);
  expect((await admin.from("organization_subscriptions").select("id").in("organization_id", [orgA, orgB])).data).toEqual([]);
});
