import { NextResponse } from "next/server";
import { dbServer, admin } from "../../../../lib/firebaseServer";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("📩 WEBHOOK RECEBIDO:", JSON.stringify(body, null, 2));

    // Aceita apenas eventos de pagamento
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

    // Tabela de créditos
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
    // 🔥 ADICIONA CRÉDITOS AO USUÁRIO
    // ==========================================
    if (status === "PAID") {
      await dbServer.collection("users").doc(uid).update({
        creditos: admin.firestore.FieldValue.increment(creditos),
        jaComprou: true,
      });

      console.log(`🔥 Créditos adicionados: +${creditos} → UID: ${uid}`);
    }

    // ==========================================
    // 🎁 BÔNUS DE INDICAÇÃO (APENAS 1 VEZ)
    // ==========================================
    const userRef = dbServer.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const userData = userSnap.data();

      // 👉 AGORA O CAMPO CORRETO
      const indicadoPor = userData.indicadoPor;

      if (indicadoPor) {
        const indicadorRef = dbServer.collection("users").doc(indicadoPor);
        const indicadorSnap = await indicadorRef.get();

        if (indicadorSnap.exists) {
          const dadosIndicador = indicadorSnap.data();

          if (!dadosIndicador.bonusRecebido) {
            await indicadorRef.update({
              creditos: admin.firestore.FieldValue.increment(20),
              bonusRecebido: true,
            });

            console.log(
              `🎁 BÔNUS: Indicador ${indicadoPor} recebeu +20 créditos.`
            );
          } else {
            console.log("⚠️ Bônus já havia sido pago anteriormente.");
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
