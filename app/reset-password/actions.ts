"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isStrongEnoughPassword } from "@/lib/validation";

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password !== confirm || !isStrongEnoughPassword(password)) redirect("/reset-password?error=" + encodeURIComponent("كلمتا المرور غير متطابقتين أو لا تحققان متطلبات الأمان"));
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/reset-password?error=" + encodeURIComponent("تعذر تحديث كلمة المرور. اطلب رابط استعادة جديدًا."));
  await supabase.auth.signOut();
  redirect("/login?message=" + encodeURIComponent("تم تحديث كلمة المرور. سجل الدخول بكلمة المرور الجديدة."));
}
