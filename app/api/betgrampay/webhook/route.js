import { NextResponse } from "next/server";
import {
  dbServer,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "../../../../lib/firebaseServer";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("📩 WEBHOOK RECEBIDO:", JSON.stringify(body, null, 2));

    // Aceita SOMENTE billing.paid
    if (body?.event !== "billing.paid") {
      console.log("➡️ Evento ignorado:", body?.event);
      return NextResponse.json({ ok: true, ignore: true });
    }

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

    if (!uid || isNaN(valorPlano)) {
      console.log("❌ ERRO: metadata incompleta");
      return NextResponse.json(
        { error: true, message: "UID ou valor inválidos" },
        { status: 400 }
      );
    }

    // TABELA OFICIAL DE CRÉDITOS
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

    // ==========================================
    // 🔥 ADICIONAR CRÉDITOS DO PLANO (OK)
    // ==========================================
    if (status === "PAID") {
      await updateDoc(doc(dbServer, "users", uid), {
        creditos: increment(creditos),
        jaComprou: true,
      });

      console.log(`🔥 Créditos adicionados: +${creditos} → UID: ${uid}`);
    }

    // ==========================================
    // 🎁 BÔNUS DE INDICAÇÃO (UMA ÚNICA VEZ)
    // ==========================================
    try {
      const userRef = doc(dbServer, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        // Verifica se este usuário foi indicado por alguém
        if (userData.indicador) {
          const indicadorUid = userData.indicador;
          const indicadorRef = doc(dbServer, "users", indicadorUid);
          const indicadorSnap = await getDoc(indicadorRef);

          if (indicadorSnap.exists()) {
            const indData = indicadorSnap.data();

            // 💰 Só paga se o indicador ainda NÃO recebeu
            if (!indData.bonusRecebido) {
              await updateDoc(indicadorRef, {
                creditos: increment(20),
                bonusRecebido: true,
              });

              console.log(
                `🎁 BONUS: Indicador ${indicadorUid} recebeu +20 créditos.`
              );
            }
          }
        }
      }
    } catch (err) {
      console.log("⚠️ ERRO AO PROCESSAR BÔNUS:", err.message);
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
