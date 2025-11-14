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
    const { searchParams } = new URL(req.url);

    // SECRET enviado pelo AbacatePay
    const secretRecebido = searchParams.get("secret");

    // O mesmo SECRET que você colocou no painel
    const SECRET_CORRETO = "betgrampix_4b2fA9x7Qw"; // <-- troque aqui

    if (!secretRecebido || secretRecebido !== SECRET_CORRETO) {
      return NextResponse.json({ error: "Secret inválido" }, { status: 401 });
    }

    const data = await req.json();
    const { txid, value, status } = data;

    if (!txid || !value) {
      return NextResponse.json({ error: "Callback inválido" }, { status: 400 });
    }

    // Processa somente se estiver aprovado
    if (status !== "approved" && status !== "paid" && status !== "billing.paid") {
      return NextResponse.json({ status: "ignorado" });
    }

    // UID do usuário — veio dentro do txid
    const uid = txid.split("_")[0];

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Verificar duplicação
    const historicoRef = doc(db, "pagamentos", txid);
    const historicoSnap = await getDoc(historicoRef);

    if (historicoSnap.exists()) {
      return NextResponse.json({ status: "duplicado" });
    }

    const creditosAdicionados = Number(value);

    await updateDoc(userRef, {
      creditos: (userSnap.data().creditos || 0) + creditosAdicionados,
    });

    // Salvar histórico
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
      { error: "Erro no callback", details: err.message },
      { status: 500 }
    );
  }
}
