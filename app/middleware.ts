import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession(); // 🔐 attaches session to cookies
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/test-user"], // adjust paths as needed
};
