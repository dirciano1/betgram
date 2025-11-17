import { NextResponse } from "next/server";
import { authAdmin } from "./lib/firebaseAdmin"; // 🔥 IMPORTANTE

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // 🔥 Apenas rotas dentro de /admin passam pelo filtro
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  // 🔥 Lê o cookie criado no loginComGoogle()
  const tokenCookie = req.cookies.get("betgram_token");

  if (!tokenCookie) {
    console.log("❌ Nenhum token encontrado → redirecionando");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // 🔥 Decodifica token do Firebase
    const decoded = await authAdmin.verifyIdToken(tokenCookie.value);

    const role = decoded.role || null;

    console.log("🔍 ROLE DETECTADA:", role);

    // 🔥 Somente superadmin pode acessar
    if (role !== "superadmin") {
      console.log("❌ Acesso negado: usuário não é superadmin");
      return NextResponse.redirect(new URL("/", req.url));
    }

    console.log("✅ Acesso autorizado ao admin");
    return NextResponse.next();

  } catch (error) {
    console.error("❌ ERRO NO TOKEN:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
