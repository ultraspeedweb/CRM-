"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isStrongEnoughPassword } from "@/lib/validation";

function destination(kind: "error" | "message", value: string) {
  return `/login?${kind}=${encodeURIComponent(value)}`;
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || password.length < 8) redirect(destination("error", "تأكد من البريد وكلمة المرور"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(destination("error", "بيانات الدخول غير صحيحة"));
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (fullName.length < 2 || !email || !isStrongEnoughPassword(password)) {
    redirect(destination("error", "اكتب اسمك وكلمة مرور من 10 أحرف تحتوي حروفًا وأرقامًا"));
  }

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/onboarding`,
      data: { full_name: fullName, preferred_locale: "ar" },
    },
  });
  if (error) redirect(destination("error", error.message.includes("registered") ? "هذا البريد مستخدم مسبقًا" : "تعذر إنشاء الحساب"));
  if (data.session) redirect("/onboarding");
  redirect(destination("message", "أرسلنا رابط التفعيل إلى بريدك"));
}
