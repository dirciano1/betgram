import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    const payload = {
      amount: Math.round(valor * 100),
      description: `Créditos Betgram - ${uid}`,
      expiresIn: 3600,

      // 🔥 ESSENCIAL: manda UID e valor pro webhook
      metadata: {
        uid,
        valor
      }
    };

    const res = await fetch("https://api.abacatepay.com/v1/pixQrCode/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATEPAY_SECRET}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    console.log("RETORNO ABACATEPAY:", result);

    if (!res.ok || result.error) {
      return NextResponse.json(
        { error: true, message: result.error || result.message },
        { status: res.status }
      );
    }

    return NextResponse.json({
      txid: result.data.id,
      qrcode: result.data.brCodeBase64,
      qrcode_text: result.data.brCode
    });

  } catch (e) {
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
