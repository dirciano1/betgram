import { NextResponse } from "next/server";

export function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // liberar páginas públicas
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // pegar cookies
  const uid = req.cookies.get("uid")?.value;
  const role = req.cookies.get("role")?.value;

  // se não tiver login → manda pro /login
  if (!uid || !role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // apenas admin e superadmin podem entrar
  if (role !== "admin" && role !== "superadmin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
