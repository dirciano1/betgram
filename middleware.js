import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;

  // 🔓 LIBERAR *SOMENTE* O ENDPOINT setRole
  if (path.startsWith("/admin/setRole")) {
    console.log("🔓 setRole liberado no middleware");
    return NextResponse.next();
  }

  // 🔐 PROTEGER TODAS AS OUTRAS ROTAS ADMIN
  if (path.startsWith("/admin")) {
    const role = req.cookies.get("role")?.value;

    console.log("🔍 role detectado:", role);

    if (!role || (role !== "admin" && role !== "superadmin")) {
      console.log("⛔ Acesso negado — redirecionando...");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
