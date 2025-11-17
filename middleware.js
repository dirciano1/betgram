import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // biblioteca compatível com EDGE runtime

const FIREBASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_KEY;

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get("betgram_token");
  if (!tokenCookie) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // 🔥 Verificação compatível com EDGE (sem firebase-admin)
    const { payload } = await jwtVerify(
      tokenCookie.value,
      new TextEncoder().encode(FIREBASE_PUBLIC_KEY)
    );

    const role = payload.role;

    if (role !== "superadmin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();

  } catch (e) {
    console.error("Erro token no middleware:", e);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
