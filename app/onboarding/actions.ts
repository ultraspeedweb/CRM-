"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function onboardingError(message: string) {
  return `/onboarding?error=${encodeURIComponent(message)}`;
}

export async function createOrganization(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (name.length < 2 || fullName.length < 2 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    redirect(onboardingError("تحقق من اسم المؤسسة والرابط المختصر"));
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login");

  // Onboarding is idempotent per authenticated user. A retry, double click,
  // refreshed confirmation link, or stale browser tab must never create a
  // second tenant for the same account.
  const { data: existingMembership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (membershipError) redirect(onboardingError("تعذر التحقق من عضوية المؤسسة"));
  if (existingMembership?.organization_id) redirect("/dashboard");

  const { error } = await supabase.from("organization_bootstrap_requests").insert({
    user_id: userId,
    organization_name: name,
    organization_slug: slug,
    member_full_name: fullName,
    locale: "ar",
  });
  if (error) redirect(onboardingError(error.code === "23505" ? "لديك مؤسسة بالفعل أو الرابط المختصر مستخدم" : "تعذر تجهيز المؤسسة"));
  redirect("/dashboard");
}
