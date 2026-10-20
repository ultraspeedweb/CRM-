import { beforeEach, expect, it, vi } from "vitest";

const { workspace, guard, admin } = vi.hoisted(() => ({ workspace: vi.fn(), guard: vi.fn(), admin: vi.fn() }));
vi.mock("@/lib/workspace", () => ({ requireWorkspace: workspace }));
vi.mock("@/lib/platform-service-guard", () => ({ isPlatformServiceEnabled: guard }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: admin }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`redirect:${url}`); } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { sendWhatsAppMessage } from "../app/(workspace)/actions";
import { resumeAiConversation } from "../app/(workspace)/automation/ai-actions";

beforeEach(() => { vi.clearAllMocks(); });
it("rejects viewer sends before control reads, credentials, database access or external delivery", async () => {
  const from = vi.fn();
  workspace.mockResolvedValue({ membership: { role: "viewer" }, organizationId: "org", userId: "viewer", supabase: { from } });
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  try {
    await expect(sendWhatsAppMessage(new FormData())).rejects.toThrow("redirect:/conversations?error=");
    expect(from).not.toHaveBeenCalled(); expect(guard).not.toHaveBeenCalled();
    expect(admin).not.toHaveBeenCalled(); expect(fetchSpy).not.toHaveBeenCalled();
  } finally { fetchSpy.mockRestore(); }
});
it("cannot resume uncertified AI even for an owner", async () => {
  const rpc = vi.fn();
  workspace.mockResolvedValue({ organizationId: "org", supabase: { rpc } });
  guard.mockResolvedValue(false);
  const form = new FormData(); form.set("conversationId", "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
  await expect(resumeAiConversation(form)).rejects.toThrow("redirect:/automation?error=");
  expect(rpc).not.toHaveBeenCalled();
});
