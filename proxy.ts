import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Routing convenience only. All platform authorization remains enforced by
 * the page, export handler and database RPC, never by the hostname.
 */
export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  // Trust the parsed request URL host supplied by the deployment runtime;
  // do not use caller-controlled forwarded-host headers as an access policy.
  if (request.nextUrl.hostname.toLowerCase() === "admin.satisdesk.com" &&
      request.nextUrl.pathname === "/") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/platform";
    return NextResponse.redirect(destination, { headers: response.headers });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
