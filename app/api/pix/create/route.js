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

    const payload = {
      amount: Math.round(valor * 100),
      description: `Créditos Betgram - Usuário ${uid}`,
      method: "PIX",
      metadata: { uid }
    };

    // 🔥 ENDPOINT CORRETO NOVA API:
    const res = await fetch("https://api.abacatepay.com/payments", {
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

    return NextResponse.json({
      txid: result.data.id,
      qrcode: result.data.qrCodeImage,
      qrcode_text: result.data.qrCodeText
    });

  } catch (e) {
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
