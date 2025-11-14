import { NextResponse } from "next/server";
import { db, doc, updateDoc, increment } from "../../../../lib/firebase";

export async function POST(req) {
  try {
    const signature = req.headers.get("x-abacatepay-signature");
    if (!signature) {
      return NextResponse.json(
        { error: true, message: "Missing signature" },
        { status: 401 }
      );
    }

    const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET;
    if (signature !== WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: true, message: "Invalid signature" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (body.event !== "billing.paid") {
      return NextResponse.json({ ok: true, ignore: true });
    }

    const uid = body.data?.pixQrCode?.metadata?.uid;
    const valor = body.data?.pixQrCode?.metadata?.valor;

    if (!uid || !valor) {
      return NextResponse.json(
        { error: true, message: "Missing uid or valor in metadata" },
        { status: 400 }
      );
    }

    const creditos = Number(valor);

    await updateDoc(doc(db, "users", uid), {
      creditos: increment(creditos)
    });

    console.log("PIX creditado para:", uid, "valor:", creditos);

    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error("WEBHOOK ERROR:", e);
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
