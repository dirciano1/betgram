import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;

  // 🔓 LIBERA o endpoint setRole (necessário para promover usuários)
  if (path.startsWith("/admin/setRole")) {
    return NextResponse.next();
  }

  // 🔐 PROTEGER TODAS AS ROTAS ADMIN
  if (path.startsWith("/admin")) {

    const role = req.cookies.get("role")?.value;

    console.log("🛡️ Verificando role:", role);

    // 🔒 SÓ PERMITE SUPERADMIN
    if (role !== "superadmin") {
      console.log("⛔ Acesso negado. Apenas SUPERADMIN pode acessar.");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
