"use server";

import { authRedirectOrigin } from "@/lib/auth-redirect-origin";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/forgot-password?error=" + encodeURIComponent("أدخل بريدًا إلكترونيًا صحيحًا"));
  const origin = await authRedirectOrigin();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/recovery` });
  redirect("/forgot-password?message=" + encodeURIComponent("إذا كان الحساب موجودًا، أرسلنا رابط الاستعادة إلى البريد"));
}
