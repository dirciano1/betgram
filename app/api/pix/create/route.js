import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    if (!uid || !valor)
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

    const API_KEY =
      process.env.ABACATEPAY_KEY_TESTE ||
      "abc_dev_UarpsjrXmT4mwr04EkECbbZH";

    // 🚀 NOVO ENDPOINT CORRETO
    const response = await fetch("https://api.abacatepay.com/v1/charge", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txid: `${uid}_${Date.now()}`,
        value: Number(valor),
        description: "Créditos BetGram",
        callbackUrl:
          "https://betgram.com.br/api/betgrampay/pay?secret=betgrampix_4b2fA9x7Qw",
      }),
    });

    const data = await response.json();
    console.log("RETORNO ABACATEPAY:", data);

    if (!data || data.error) {
      return NextResponse.json(
        { error: "Erro ao criar cobrança", detalhes: data },
        { status: 500 }
      );
    }

    // PEGANDO O PIX DA COBRANÇA
    return NextResponse.json({
      txid: data.txid || data.id,
      qrcode: data.pix?.qrcode || null,
      qrcode_text: data.pix?.qrcode_text || null,
    });
  } catch (err) {
    console.error("ERRO AO GERAR PIX:", err);
    return NextResponse.json(
      { error: "Erro inesperado", detalhes: err.message },
      { status: 500 }
    );
  }
}
