import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    const payload = {
      amount: Math.round(valor * 100), 
      description: `Créditos Betgram - Usuário ${uid}`,
      methods: ["PIX"],
      frequency: "ONE_TIME"
    };

    const res = await fetch("https://api.abacatepay.com/v1/billing/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATEPAY_SECRET}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    console.log("RETORNO ABACATEPAY:", result);

    if (result.error) {
      return NextResponse.json(
        { error: true, message: result.error },
        { status: 500 }
      );
    }

    // CAMPOS QUE O ABACATEPAY RETORNA
    return NextResponse.json({
      txid: result.data.id,
      qrcode: result.data.qrCodeImage,
      qrcode_text: result.data.qrCodeText,
      url: result.data.url
    });

  } catch (e) {
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
