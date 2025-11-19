import { NextResponse } from "next/server";
import { dbServer, admin } from "../../../../lib/firebaseServer";

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
      return NextResponse.json(
        { error: true, message: "UID ou valor inválidos" },
        { status: 400 }
      );
    }

    // TABELA DE CRÉDITOS
    const tabela = {
      10: 100,
      20: 230,
      30: 360,
      50: 650,
      100: 1400,
    };

    const creditos = tabela[valorPlano] || 0;

    if (creditos === 0) {
      return NextResponse.json(
        { error: true, message: "Valor inválido para créditos" },
        { status: 400 }
      );
    }

    // ==========================================
    // 🔥 ADICIONA CRÉDITOS USANDO ADMIN SDK
    // ==========================================
    if (status === "PAID") {
      await dbServer.collection("users").doc(uid).update({
        creditos: admin.firestore.FieldValue.increment(creditos),
        jaComprou: true,
      });

      console.log(`🔥 Créditos adicionados: +${creditos} → UID: ${uid}`);
    }

    // ==========================================
    // 🎁 BÔNUS DE INDICAÇÃO (UMA ÚNICA VEZ)
    // ==========================================
    const userRef = dbServer.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const userData = userSnap.data();

      if (userData.indicador) {
        const indicadorUid = userData.indicador;
        const indicadorRef = dbServer.collection("users").doc(indicadorUid);
        const indicadorSnap = await indicadorRef.get();

        if (indicadorSnap.exists) {
          const indData = indicadorSnap.data();

          if (!indData.bonusRecebido) {
            await indicadorRef.update({
              creditos: admin.firestore.FieldValue.increment(20),
              bonusRecebido: true,
            });

            console.log(
              `🎁 BÔNUS: Indicador ${indicadorUid} recebeu +20 créditos.`
            );
          }
        }
      }
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
