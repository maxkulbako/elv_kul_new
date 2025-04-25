import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = new URL(req.url);

  console.log("[Cookies]", req.headers.get("cookie"));

  console.log("[🔐 Middleware] url=", pathname, " role=", token?.role);
  console.log("[🔐 Middleware] token:", token);

  if (!token) {
    // NextResponse.rewrite will leave you on /admin/*, but put the /sign-in content
    return NextResponse.rewrite(new URL("/sign-in", req.url));
  }

  // if (!token) {
  //   return NextResponse.redirect(new URL("/sign-in", req.url));
  // }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/client") && token.role !== "CLIENT") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}
