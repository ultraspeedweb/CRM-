"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/forgot-password?error=" + encodeURIComponent("أدخل بريدًا إلكترونيًا صحيحًا"));
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/confirm?next=/reset-password` });
  redirect("/forgot-password?message=" + encodeURIComponent("إذا كان الحساب موجودًا، أرسلنا رابط الاستعادة إلى البريد"));
}
