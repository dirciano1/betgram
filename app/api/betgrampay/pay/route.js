import { NextResponse } from "next/server";
import { db, doc, updateDoc, increment } from "../../../../../lib/firebase";

export async function POST(req) {
  try {
    // 1. Verificar assinatura do webhook
    const signature = req.headers.get("x-abacatepay-signature");
    const secret = process.env.ABACATEPAY_WEBHOOK_SECRET;

    if (!signature || signature !== secret) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 2. Ler JSON recebido
    const body = await req.json();
    console.log("📩 WEBHOOK RECEBIDO:", body);

    // 3. Verificar tipo do evento
    if (body.event !== "billing.paid") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // 4. Extrair metadata correta
    const meta = body.data?.pixQrCode?.metadata;

    if (!meta?.uid || !meta?.valor) {
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    const uid = meta.uid;
    const creditos = Number(meta.valor);

    // 5. Atualizar créditos no Firestore
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      creditos: increment(creditos),
      jaComprou: true
    });

    console.log(`🎉 Créditos adicionados: +${creditos} para UID ${uid}`);

    // 6. Enviar OK para AbacatePay
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("🔥 ERRO NO WEBHOOK:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
