import { headers } from "next/headers";

/**
 * Never use localhost in a hosted Supabase Auth email. The deployment URL is
 * supplied by Vercel; production may choose its canonical site URL.
 */
export async function authRedirectOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const deployment = process.env.VERCEL_URL?.trim();
  const candidate = configured || (deployment ? `https://${deployment}` : "");

  if (candidate) {
    const url = new URL(candidate.startsWith("http") ? candidate : `https://${candidate}`);
    if (process.env.NODE_ENV !== "development" && (url.protocol !== "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1")) {
      throw new Error("Auth redirect URL must use HTTPS");
    }
    return url.origin;
  }

  const origin = (await headers()).get("origin");
  if (process.env.NODE_ENV === "development" && origin) return new URL(origin).origin;
  throw new Error("Missing NEXT_PUBLIC_SITE_URL or VERCEL_URL for Auth redirects");
}
