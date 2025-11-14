import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    if (!uid || !valor) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const API_KEY =
      process.env.ABACATEPAY_KEY_TESTE ||
      "abc_dev_UarpsjrXmT4mwr04EkECbbZH";

    // 🚀 ENDPOINT CORRETO PARA PAINEL "COBRANÇAS"
    const resposta = await fetch("https://api.abacatepay.com/v1/billing", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "Créditos BetGram",
        value: Number(valor),
        txid: `${uid}_${Date.now()}`,
        callbackUrl:
          "https://betgram.com.br/api/betgrampay/pay?secret=betgrampix_4b2fA9x7Qw",
        pix: true // 👈 obrigatório para gerar QR
      }),
    });

    const data = await resposta.json();
    console.log("RETORNO ABACATEPAY:", data);

    if (!data || data.error) {
      return NextResponse.json(
        { error: "Erro ao criar cobrança", detalhes: data },
        { status: 500 }
      );
    }

    // Estrutura do retorno do AbacatePay (painel Cobranças)
    return NextResponse.json({
      txid: data.txid,
      qrcode: data.pix?.qrcode,
      qrcode_text: data.pix?.qrcode_text,
    });
  } catch (err) {
    console.error("ERRO AO GERAR PIX:", err);
    return NextResponse.json(
      { error: "Erro inesperado", detalhes: err.message },
      { status: 500 }
    );
  }
}
