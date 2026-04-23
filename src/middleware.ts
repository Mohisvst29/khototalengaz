import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.includes("/admin") && !pathname.includes("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      const segments = pathname.split("/");
      const locale = segments[1] || "ar";
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
    
    // For now, just existence of cookie is enough to bypass 500/auth issues
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:locale/admin/:path*", "/admin/:path*"],
};
