import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    // Validação básica
    if (!uid || !valor) {
      return NextResponse.json(
        { error: "Parâmetros inválidos." },
        { status: 400 }
      );
    }

    // API KEY do AbacatePay (sandbox enquanto a conta está em análise)
    const API_KEY =
      process.env.ABACATEPAY_KEY_TESTE ||
      "abc_dev_UarpsjrXmT4mwr04EkECbbZH";

    // Requisição para criar o PIX
    const resposta = await fetch("https://api.abacatepay.com/v1/pix/create", {
      method: "POST",
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        txid: `${uid}_${Date.now()}`,
        value: Number(valor), // 👈 TEM QUE SER value, NÃO amount
        callbackUrl:
          "https://betgram.com.br/api/betgrampay/pay?secret=betgrampix_4b2fA9x7Qw",
        info: `Créditos BetGram - UID: ${uid}`,
      }),
    });

    const data = await resposta.json();

    // Log para debug rápido
    console.log("RETORNO ABACATEPAY:", data);

    // Se der erro no AbacatePay
    if (!data || data.error) {
      return NextResponse.json(
        { error: "Erro no AbacatePay", detalhes: data },
        { status: 500 }
      );
    }

    // Retorno EXATO que seu modal espera
    return NextResponse.json({
      txid: data.txid,
      qrcode: data.qrcode, // URL imagem do QR Code
      qrcode_text: data.qrcode_text, // Código copia e cola
    });
  } catch (err) {
    console.error("ERRO AO GERAR PIX:", err);
    return NextResponse.json(
      { error: "Erro inesperado", detalhes: err.message },
      { status: 500 }
    );
  }
}
