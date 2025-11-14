import { NextResponse } from "next/server";
import { db, doc, updateDoc, increment } from "../../../../lib/firebase";

export async function POST(req) {
  try {
    // 1. Validar SECRET vindo como querystring ?secret=...
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");
    const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: true, message: "Missing secret in query" },
        { status: 401 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: true, message: "Invalid secret" },
        { status: 401 }
      );
    }

    // 2. Ler corpo JSON do evento
    const body = await req.json();
    console.log("WEBHOOK ABACATEPAY:", JSON.stringify(body));

    // 3. Garantir que é evento de cobrança paga
    if (body?.event !== "billing.paid") {
      return NextResponse.json({ ok: true, ignore: true });
    }

    // 4. Pegar metadata que mandamos na criação do PIX
    const pixQrCode = body?.data?.pixQrCode;
    const metadata = pixQrCode?.metadata || {};

    const uid = metadata.uid;
    const valorMeta = metadata.valor; // o que mandamos no create (10, 25, 50, etc)

    if (!uid || valorMeta == null) {
      console.log("Webhook sem uid ou valor:", metadata);
      return NextResponse.json(
        { error: true, message: "Missing uid or valor in metadata" },
        { status: 400 }
      );
    }

    // Se quiser, também pode conferir o amount em centavos:
    // const creditos = Math.round((pixQrCode.amount || 0) / 100);
    // mas como já mandamos 'valor' no metadata, usamos ele direto:
    const creditos = Number(valorMeta);

    // 5. Atualizar créditos no Firestore
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      creditos: increment(creditos),
      jaComprou: true,
    });

    console.log(`PIX CREDITADO: +${creditos} créditos para UID ${uid}`);

    // 6. Responder sucesso para o AbacatePay
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ERRO WEBHOOK:", e);
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
