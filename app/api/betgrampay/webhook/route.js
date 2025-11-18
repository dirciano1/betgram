import { NextResponse } from "next/server";
import {
  dbServer,
  doc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from "../../../../lib/firebaseServer";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("📩 WEBHOOK RECEBIDO:", JSON.stringify(body, null, 2));

    if (body?.event !== "billing.paid") {
      console.log("➡️ Evento ignorado:", body?.event);
      return NextResponse.json({ ok: true, ignore: true });
    }

    const pix = body?.data?.pixQrCode;

    if (!pix) {
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
        { error: true, message: "Valor inválido" },
        { status: 400 }
      );
    }

    // Créditos normais
    if (status === "PAID") {
      await updateDoc(doc(dbServer, "users", uid), {
        creditos: increment(creditos),
        jaComprou: true,
      });
      console.log(`🔥 Créditos adicionados: +${creditos} → UID: ${uid}`);
    }

    // ===============================
    // 🎁 BÔNUS DE INDICAÇÃO
    // ===============================

    try {
      const indicacoesRef = collection(dbServer, "indicacoes");
      const q = query(
        indicacoesRef,
        where("indicado", "==", uid),
        where("bonusPago", "==", false)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const indicacaoDoc = snap.docs[0];
        const dadosIndic = indicacaoDoc.data();

        const indicadorUid = dadosIndic.indicador;

        // paga o bônus
        await updateDoc(doc(dbServer, "users", indicadorUid), {
          creditos: increment(20),
        });

        // marca como pago
        await updateDoc(doc(dbServer, "indicacoes", indicacaoDoc.id), {
          bonusPago: true,
        });

        console.log(
          `🎁 BONUS OK → Indicador ${indicadorUid} recebeu +20 créditos por ${uid}`
        );
      } else {
        console.log("ℹ️ Nenhum bônus pendente.");
      }
    } catch (error) {
      console.error("❌ ERRO NO BÔNUS:", error);
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
