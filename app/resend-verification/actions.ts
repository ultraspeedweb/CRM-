"use server";

import { authRedirectOrigin } from "@/lib/auth-redirect-origin";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function resendVerification(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) redirect("/resend-verification?error=" + encodeURIComponent("أدخل بريدًا إلكترونيًا صحيحًا"));
  const origin = await authRedirectOrigin();
  const supabase = await createClient();
  await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${origin}/auth/confirm?next=/onboarding` } });
  redirect("/resend-verification?message=" + encodeURIComponent("إذا كان الحساب بحاجة إلى تفعيل، أرسلنا رابطًا جديدًا إلى البريد"));
}
