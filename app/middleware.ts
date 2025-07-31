import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key",
    }
  );
  await supabase.auth.getSession(); // 🔐 attaches session to cookies
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/test-user"], // adjust paths as needed
};
