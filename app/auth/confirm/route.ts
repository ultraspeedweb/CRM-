import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { resolveAuthenticatedDestination } from "@/lib/workspace-routing";

function failureRedirect(origin: string, message: string) {
  const failureUrl = new URL("/login", origin);
  failureUrl.searchParams.set("error", message);
  return NextResponse.redirect(failureUrl);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  if (!tokenHash || !type) {
    return failureRedirect(url.origin, "رابط التفعيل غير صالح أو انتهت مدته");
  }

  const supabase = await createClient();
  const { error: verificationError } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (verificationError) {
    return failureRedirect(url.origin, "رابط التفعيل غير صالح أو انتهت مدته");
  }

  const { data: { user }, error: identityError } = await supabase.auth.getUser();
  if (identityError || !user) {
    return failureRedirect(url.origin, "تعذر التحقق من هوية الحساب");
  }

  let destination: string;
  try {
    destination = await resolveAuthenticatedDestination(supabase, user.id);
  } catch {
    return failureRedirect(url.origin, "تعذر تحديد مساحة العمل");
  }

  return NextResponse.redirect(new URL(destination, url.origin));
}
