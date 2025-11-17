import { db, doc, updateDoc, increment } from "../../../../lib/firebase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("📩 WEBHOOK RECEBIDO:", JSON.stringify(body, null, 2));

    // 1. Verifica se é realmente o evento de pagamento
    if (body?.event !== "billing.paid") {
      console.log("➡️ Evento ignorado:", body?.event);
      return NextResponse.json({ ok: true, ignore: true });
    }

    // 2. Pega os dados do PIX
    const pix = body?.data?.pixQrCode;

    if (!pix) {
      console.log("❌ ERRO: pixQrCode ausente");
      return NextResponse.json(
        { error: true, message: "pixQrCode ausente" },
        { status: 400 }
      );
    }

    const metadata = pix.metadata || {};
    const uid = metadata.uid;
    const valorPlano = Number(metadata.valor);
    const status = pix.status;

    console.log("📦 METADATA:", metadata);

    // 3. Valida UID e valor
    if (!uid || isNaN(valorPlano)) {
      console.log("❌ ERRO: metadata incompleta");
      return NextResponse.json(
        { error: true, message: "UID ou valor inválidos" },
        { status: 400 }
      );
    }

    // 4. Tabela de conversão de planos
    const tabela = {
      10: 100,
      20: 230,
      30: 360,
      50: 650,
      100: 1400,
    };

    const creditos = tabela[valorPlano] || 0;

    if (creditos === 0) {
      console.log("⚠️ Valor não existe na tabela:", valorPlano);
      return NextResponse.json(
        { error: true, message: "Valor inválido para créditos" },
        { status: 400 }
      );
    }

    // 5. Se pagamento confirmado
    if (status === "PAID") {
      await updateDoc(doc(db, "users", uid), {
        creditos: increment(creditos),
        jaComprou: true,
      });

      console.log(`🔥 Créditos adicionados: +${creditos} → UID: ${uid}`);
    }

    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error("❌ ERRO NO WEBHOOK:", e);
    return NextResponse.json(
      { error: true, message: e.message },
      { status: 500 }
    );
  }
}
