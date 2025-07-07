// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Skip middleware untuk route not-found
  if (pathname === "/not-found") {
    return NextResponse.next();
  }

  const isLogin = pathname.startsWith("/login");
  const isProtected = [
    "/dashboard",
    "/users",
    "/roles",
    "/menu",
    "/menu-roles",
    "/user-roles",
  ].some((route) => pathname.startsWith(route));

  // Tidak ada token & mencoba akses halaman terlindungi
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Sudah login tapi tetap buka halaman login
  if (token && isLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
