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
// 🎁 BÔNUS DE INDICAÇÃO — PAGA 1 VEZ
// ==========================================
try {
  // Buscar indicação desse usuário
  const indicacoesRef = collection(dbServer, "indicacoes");
  const q = query(
    indicacoesRef,
    where("indicado", "==", uid),
    where("bonusPago", "==", false)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const indicacaoDoc = snap.docs[0];
    const dadosIndicacao = indicacaoDoc.data();

    const indicadorUid = dadosIndicacao.indicador;

    // Adiciona 20 créditos ao indicador
    await updateDoc(doc(dbServer, "users", indicadorUid), {
      creditos: increment(20),
    });

    // Marca como pago
    await updateDoc(doc(dbServer, "indicacoes", indicacaoDoc.id), {
      bonusPago: true,
    });

    console.log(
      `🎁 BONUS PAGO: Indicador ${indicadorUid} recebeu +20 créditos por ${uid}`
    );
  } else {
    console.log("ℹ️ Nenhum bônus pendente para este usuário.");
  }
} catch (error) {
  console.error("❌ ERRO NO BÔNUS DE INDICAÇÃO:", error);
}
