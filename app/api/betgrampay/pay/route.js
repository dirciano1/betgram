import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

// Quantas análises cada crédito vale
// (Você pode alterar aqui)
const CREDITOS_POR_REAL = 10; 
// Exemplo: R$ 10 → 100 análises

export async function POST(req) {
  try {
    // ========================
    // 1. VALIDAÇÃO DO SECRET
    // ========================
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "INVALID SECRET" },
        { status: 401 }
      );
    }

    // ========================
    // 2. LER CORPO DO WEBHOOK
    // ========================
    const data = await req.json();
    console.log("📥 Webhook recebido:", data);

    // Estrutura padrão do retorno AbacatePay:
    // data.data → cobrança
    const pagamento = data.data;

    if (!pagamento) {
      return NextResponse.json(
        { error: "INVALID PAYLOAD" },
        { status: 400 }
      );
    }

    // ========================
    // 3. SOMENTE CONTINUAR SE PAGO
    // ========================
    if (pagamento.status !== "PAID") {
      return NextResponse.json(
        { ok: true, message: "STATUS IGNORADO: " + pagamento.status }
      );
    }

    // ========================
    // 4. EXTRAIR UID DO USUÁRIO
    // ========================
    // No create, você colocou descrição "Créditos Betgram - Usuário {uid}"
    // Aqui vamos extrair o UID da descrição:

    const desc = pagamento.description || "";
    const uid = desc.replace("Créditos Betgram - Usuário ", "").trim();

    if (!uid) {
      return NextResponse.json(
        { error: "UID NOT FOUND" },
        { status: 400 }
      );
    }

    // ========================
    // 5. CALCULAR CRÉDITOS
    // ========================
    // amount vem em centavos → ex: 1000 = R$ 10,00
    const reais = pagamento.amount / 100;
    const creditos = reais * CREDITOS_POR_REAL;

    // ========================
    // 6. ATUALIZAR FIRESTORE
    // ========================
    const userRef = doc(db, "users", uid);

    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return NextResponse.json(
        { error: "USER NOT FOUND" },
        { status: 404 }
      );
    }

    await updateDoc(userRef, {
      creditos: increment(creditos)
    });

    console.log(`✔️ Créditos adicionados ao usuário ${uid}: +${creditos}`);

    // ========================
    // 7. RESPOSTA FINAL
    // ========================
    return NextResponse.json({
      ok: true,
      message: "Créditos adicionados com sucesso",
      uid,
      creditosAdicionados: creditos
    });

  } catch (e) {
    console.error("❌ ERRO WEBHOOK:", e);
    return NextResponse.json(
      { error: "SERVER ERROR", message: e.message },
      { status: 500 }
    );
  }
}
