import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // ROTAS QUE PRECISAM DE ADMIN
  const isAdminRoute = path.startsWith("/admin");

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // se não estiver logado → manda para home (ou login)
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // se estiver logado mas NÃO for admin → bloqueia
  if (isAdminRoute && token?.role !== "admin" && token?.role !== "superadmin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
