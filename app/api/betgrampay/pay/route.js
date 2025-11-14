import { NextResponse } from "next/server";
import { db, doc, updateDoc, increment } from "../../../../../lib/firebase";

export async function POST(req) {
  try {
    // 1. Pega assinatura do AbacatePay
    const signature = req.headers.get("x-abacatepay-signature");
    if (!signature) {
      return NextResponse.json({ error: true, message: "Missing signature header" }, { status: 401 });
    }

    // 2. Verifica se a assinatura bate com o secret
    const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      return NextResponse.json({ error: true, message: "Webhook secret missing in environment" }, { status: 500 });
    }

    if (signature !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: true, message: "Invalid signature" }, { status: 401 });
    }

    // 3. Lê o corpo JSON
    const body = await req.json();

    // 4. Checa se o evento é mesmo pagamento confirmando
    if (body.event !== "billing.paid") {
      return NextResponse.json({ ok: true, message: "Ignored: not billing.paid" });
    }

    // 5. Extrai UID e valor enviados no metadata do PIX
    const uid = body.data?.pixQrCode?.metadata?.uid;
    const valor = body.data?.pixQrCode?.metadata?.valor;

    if (!uid || !valor) {
      return NextResponse.json({ error: true, message: "Missing metadata uid or valor" }, { status: 400 });
    }

    // 6. Creditar valores (valor já vem em reais, não centavos!)
    const creditos = Number(valor);

    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      creditos: increment(creditos)
    });

    console.log("🔐 WEBHOOK SEGURO CREDITADO:", uid, creditos);

    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error("❌ ERRO NO WEBHOOK:", e);
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
