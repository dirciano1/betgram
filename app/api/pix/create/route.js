import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    if (!uid || !valor) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const API_KEY = process.env.ABACATEPAY_KEY_TESTE || "abc_dev_UarpsjrXmT4mwr04EkECbbZH";

    const response = await fetch("https://api.abacatepay.com/v1/pix/create", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txid: `${uid}_${Date.now()}`,
        value: Number(valor),   // 👈 IMPORTANTE
        callbackUrl: "https://betgram.com.br/api/betgrampay/pay?secret=betgrampix_4b2fA9x7Qw",
        info: `créditos Betgram / user: ${uid}`,
      }),
    });

    const data = await response.json();

    console.log("RETORNO ABACATEPAY:", data);

    return NextResponse.json({
      txid: data.txid,
      qrcode: data.qrcode,
      qrcode_text: data.qrcode_text,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao gerar PIX", details: error.message },
      { status: 500 }
    );
  }
}
