import { NextResponse } from "next/server";
import { db, doc, updateDoc, increment } from "../../../lib/firebase";

export async function POST(req) {
  try {
    // 1. Pegar assinatura enviada pelo AbacatePay
    const signature = req.headers.get("x-abacatepay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: true, message: "Missing signature" },
        { status: 401 }
      );
    }

    // 2. Validar chave secreta do webhook
    const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

    if (signature !== expectedSecret) {
      return NextResponse.json(
        { error: true, message: "Invalid secret" },
        { status: 401 }
      );
    }

    // 3. Ler corpo JSON enviado pelo AbacatePay
    const body = await req.json();

    console.log("🔥 WEBHOOK RECEBIDO:", body);

    // 4. Garantir que é o evento billing.paid
    if (body?.event !== "billing.paid") {
      return NextResponse.json({ ok: true, ignore: true });
    }

    // 5. Extrair UID e valor enviados no metadata
    const uid = body?.data?.pixQrCode?.metadata?.uid;
    const valor = body?.data?.pixQrCode?.amount; // já vem em centavos

    if (!uid || !valor) {
      return NextResponse.json(
        { error: true, message: "Missing UID or amount" },
        { status: 400 }
      );
    }

    // 6. Converter centavos → créditos
    const creditos = Math.floor(valor / 100);

    // 7. Atualizar créditos no Firestore
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      creditos: increment(creditos),
    });

    console.log("✅ CREDITADO:", creditos, "créditos → UID:", uid);

    // 8. Resposta OK para o AbacatePay
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ ERRO WEBHOOK:", error);
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
