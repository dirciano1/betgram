import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Só proteger rotas do admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Lê token JWT
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Se não logado → redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verifica role REAL do usuário
  const role = token.role || "user";

  // Se não for admin → bloqueia
  if (role !== "admin" && role !== "superadmin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
