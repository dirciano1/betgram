import { NextResponse } from "next/server";
import { db, doc, updateDoc, increment } from "../../../../lib/firebase";

export async function POST(req) {
  try {
    // 🔍 DEBUG COMPLETO — para garantir que estamos recebendo tudo certinho
    const body = await req.json();
    console.log("🔥 WEBHOOK RECEBIDO:", JSON.stringify(body, null, 2));

    // 1. Validar se é o evento correto
    if (body?.event !== "billing.paid") {
      console.log("➡️ Evento ignorado:", body?.event);
      return NextResponse.json({ ok: true, ignore: true });
    }

    // 2. Pegar dados do pagamento PIX
    const pixQrCode = body?.data?.pixQrCode;

    if (!pixQrCode) {
      console.log("❌ ERRO: pixQrCode não encontrado no webhook");
      return NextResponse.json({ error: true, message: "pixQrCode ausente" }, { status: 400 });
    }

    const metadata = pixQrCode.metadata || {};
    const uid = metadata.uid;
    const valorPago = Number(metadata.valor); // valor em reais

    console.log("📦 METADATA RECEBIDA:", metadata);

    // 3. Validar UID e valor
    if (!uid || isNaN(valorPago)) {
      console.log("❌ ERRO: UID ou valor não vieram no metadata");
      return NextResponse.json(
        { error: true, message: "UID ou valor ausente em metadata" },
        { status: 400 }
      );
    }

    // 🎯 4. TABELA DE CONVERSÃO (Plano → Créditos)
    let creditos = 0;

    const tabela = {
      10: 100,
      20: 230,
      30: 360,
      50: 650,
      100: 1400,
    };

    creditos = tabela[valorPago] || 0;

    if (creditos === 0) {
      console.log("⚠️ Valor não encontrado na tabela:", valorPago);
      return NextResponse.json(
        { error: true, message: "Valor inválido para tabela de créditos" },
        { status: 400 }
      );
    }

    console.log(`💰 Vai creditar ${creditos} créditos para UID: ${uid}`);

    // 5. Atualizar no Firestore
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      creditos: increment(creditos),
      jaComprou: true,
    });

    console.log(`✅ Créditos adicionados com sucesso para ${uid}`);

    // 6. Resposta final para o Abacatepay
    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error("❌ ERRO NO WEBHOOK:", e);
    return NextResponse.json(
      { error: true, message: e.message || "Erro interno no webhook" },
      { status: 500 }
    );
  }
}
