import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    if (!uid || !valor) {
      return NextResponse.json(
        { error: true, message: "UID ou valor inválido" },
        { status: 400 }
      );
    }

    // ================================
    // NOVO PAYLOAD DA API ABACATEPAY
    // ================================
    const payload = {
      amount: Math.round(valor * 100), // R$ -> centavos
      description: `Créditos Betgram - Usuário ${uid}`,
      methods: ["PIX"],
      metadata: {
        uid
      }
    };

    // ================================
    //  NOVO ENDPOINT OFICIAL
    // ================================
    const res = await fetch("https://api.abacatepay.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATEPAY_KEY_PROD}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    console.log("📩 RESPOSTA ABACATEPAY:", result);

    if (result.error) {
      return NextResponse.json(
        { error: true, message: result.error },
        { status: 500 }
      );
    }

    // ================================
    //  RETORNO PADRÃO PARA O FRONT
    // ================================
    return NextResponse.json({
      txid: result.data.id,
      qrcode: result.data.qrCodeImage,
      qrcode_text: result.data.qrCodeText
    });

  } catch (e) {
    console.error("❌ ERRO CREATE PIX:", e);
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
