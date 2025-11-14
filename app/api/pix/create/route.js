import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    const payload = {
      amount: Math.round(valor * 100), // 10.00 => 1000 centavos
      description: `Créditos Betgram - Usuário ${uid}`,
      methods: ["PIX"],
      frequency: "ONE_TIME"
    };

    const res = await fetch("https://api.abacatepay.com/billing/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATEPAY_SECRET}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.error) {
      console.error("ERRO ABACATEPAY:", data.error);
      return NextResponse.json({ error: true, message: data.error }, { status: 500 });
    }

    return NextResponse.json({
      txid: data.data.id,
      qrcode: data.data.qrCodeImage,
      qrcode_text: data.data.qrCodeText
    });

  } catch (e) {
    console.error("ERRO NO SERVIDOR:", e);
    return NextResponse.json({ error: true, message: e.message }, { status: 500 });
  }
}
