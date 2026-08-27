import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";

export function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale");
  const requestedNext = url.searchParams.get("next") ?? "/";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/";
  if (!isLocale(locale)) return NextResponse.redirect(new URL(next, url.origin));
  const response = NextResponse.redirect(new URL(next, url.origin));
  response.cookies.set("satisdesk_locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: url.protocol === "https:" });
  return response;
}
