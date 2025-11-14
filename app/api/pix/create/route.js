import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    if (!uid || !valor) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // API Key (modo teste)
    const API_KEY = process.env.ABACATEPAY_KEY_TESTE || "abc_dev_UarpsjrXmT4mwr04EkECbbZH";

    const resposta = await fetch("https://api.abacatepay.com/v1/pix/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${API_KEY}`,
      },
      body: JSON.stringify({
        txid: `${uid}_${Date.now()}`,
        value: Number(valor),
        callbackUrl: "https://betgram.com.br/api/betgrampay/pay",
        info: `Créditos BetGram - user: ${uid}`,
      }),
    });

    const data = await resposta.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao gerar PIX", details: err.message },
      { status: 500 }
    );
  }
}
