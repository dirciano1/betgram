import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;

  // Só protege rotas do admin
  const isAdminRoute = path.startsWith("/admin");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const uid = req.cookies.get("uid")?.value || null;
  const role = req.cookies.get("role")?.value || null;

  // Se não estiver logado → volta pra home
  if (!uid) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Se não for admin → volta pra home
  if (role !== "admin" && role !== "superadmin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Tudo certo → libera o admin
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
