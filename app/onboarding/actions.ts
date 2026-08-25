"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createOrganization(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (name.length < 2 || fullName.length < 2 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    redirect("/onboarding?error=تحقق من اسم المؤسسة والرابط المختصر");
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login");

  const { error } = await supabase.from("organization_bootstrap_requests").insert({
    user_id: userId,
    organization_name: name,
    organization_slug: slug,
    member_full_name: fullName,
    locale: "ar",
  });
  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.code === "23505" ? "الرابط المختصر مستخدم، اختر غيره" : "تعذر تجهيز المؤسسة")}`);
  redirect("/dashboard");
}
