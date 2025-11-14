import { NextResponse } from "next/server";
import {
  db,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "../../../../lib/firebase";

export async function POST(req) {
  try {
    const data = await req.json();

    // Dados enviados pelo AbacatePay
    const { txid, value, status } = data;

    if (!txid || !value) {
      return NextResponse.json({ error: "Callback inválido" }, { status: 400 });
    }

    // Processa somente quando estiver aprovado/pago
    if (status !== "approved") {
      return NextResponse.json({ status: "ignorado" });
    }

    // UID do usuário — foi enviado no txid
    const uid = txid.split("_")[0];

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Evitar duplicação de créditos
    const historicoRef = doc(db, "pagamentos", txid);
    const historicoSnap = await getDoc(historicoRef);

    if (historicoSnap.exists()) {
      return NextResponse.json({ status: "duplicado" });
    }

    // Créditos adicionados = valor pago
    const creditosAdicionados = Number(value);

    await updateDoc(userRef, {
      creditos: (userSnap.data().creditos || 0) + creditosAdicionados,
    });

    // Salvar histórico do pagamento
    await setDoc(historicoRef, {
      uid,
      txid,
      valor: value,
      status: "pago",
      criadoEm: serverTimestamp(),
    });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro ao processar callback", details: err.message },
      { status: 500 }
    );
  }
}
