import { NextResponse } from "next/server";
import { db, doc, getDoc, updateDoc, increment } from "../../../../lib/firebase";

export async function POST(req) {
  try {
    // 1. Pegar assinatura enviada pelo AbacatePay
    const signature = req.headers.get("x-abacatepay-signature");
    if (!signature) {
      return NextResponse.json({ error: true, message: "Missing signature" }, { status: 401 });
    }

    // 2. Validar secret
    const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
    if (signature !== expectedSecret) {
      return NextResponse.json({ error: true, message: "Invalid secret" }, { status: 401 });
    }

    // 3. Ler corpo JSON do evento
    const body = await req.json();

    // 4. Garantir que é evento de pagamento PIX
    if (body?.type !== "billing.paid") {
      return NextResponse.json({ ok: true, ignore: true });
    }

    // 5. Dados do pagamento
    const uid = body.data?.metadata?.uid;
    const valor = body.data?.amount;

    if (!uid || !valor) {
      return NextResponse.json({ error: true, message: "Missing uid or amount" }, { status: 400 });
    }

    // 6. Valor está em centavos → converter para reais
    const creditos = Math.floor(valor / 100);

    // 7. Atualizar créditos no Firestore
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      creditos: increment(creditos)
    });

    console.log("PIX CREDITADO para UID:", uid, "Valor:", creditos);

    // 8. Responder sucesso para o AbacatePay
    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error("ERRO WEBHOOK:", e);
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}