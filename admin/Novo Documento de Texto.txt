import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/admin")) return NextResponse.next();

  const token = await getToken({ req });

  if (!token) return NextResponse.redirect(new URL("/", req.url));

  // Permite só admin ou superadmin
  if (token.role === "admin" || token.role === "superadmin") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}
