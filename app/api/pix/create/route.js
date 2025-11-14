import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    // Expiração obrigatória (em segundos)
    const EXPIRES_IN_SECONDS = 3600; // 1 hora

    const payload = {
      amount: Math.round(valor * 100), // valor em centavos
      description: `Créditos Betgram - Usuário ${uid}`,
      expiresIn: EXPIRES_IN_SECONDS,
    };

    const res = await fetch("https://api.abacatepay.com/v1/pixQrCode/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATEPAY_SECRET}`, 
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    console.log("RETORNO ABACATEPAY:", result);

    if (!res.ok || result.error) {
      return NextResponse.json(
        {
          error: true,
          message:
            result.message ||
            result.error ||
            "Falha ao gerar PIX. Verifique chave e payload.",
        },
        { status: res.status >= 400 ? res.status : 500 }
      );
    }

    return NextResponse.json({
      txid: result.data.id,
      qrcode: result.data.brCodeBase64, // imagem BASE64
      qrcode_text: result.data.brCode, // CÓPIA E COLA REAL
      url: null,
    });
  } catch (e) {
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
