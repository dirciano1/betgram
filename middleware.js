import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;

  // 🚨 LIBERAR TOTALMENTE AS ROTAS ADMIN TEMPORARIAMENTE
  if (path.startsWith("/admin")) {
    console.log("⚠️ ADMIN LIBERADO TEMPORARIAMENTE NO MIDDLEWARE");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
