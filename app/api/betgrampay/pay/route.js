import { NextResponse } from "next/server";
import { db, doc, updateDoc, increment } from "../../../../lib/firebase";

export async function POST(req) {
  try {
    // 👀 Só pra debug: ver tudo que está chegando
    const body = await req.json();
    console.log("WEBHOOK ABACATEPAY RECEBIDO:", JSON.stringify(body));

    // 1. Garante que é billing.paid
    if (body?.event !== "billing.paid") {
      console.log("Evento ignorado:", body?.event);
      return NextResponse.json({ ok: true, ignore: true });
    }

    // 2. Pega os dados do pixQrCode
    const pixQrCode = body?.data?.pixQrCode;
    if (!pixQrCode) {
      console.log("Sem pixQrCode em data!");
      return NextResponse.json({ error: true, message: "Sem pixQrCode" }, { status: 400 });
    }

    const metadata = pixQrCode.metadata || {};
    const uid = metadata.uid;
    const valorMeta = metadata.valor;

    console.log("METADATA:", metadata);

    if (!uid || valorMeta == null) {
      console.log("Faltando uid ou valor em metadata:", metadata);
      return NextResponse.json(
        { error: true, message: "Faltando uid ou valor em metadata" },
        { status: 400 }
      );
    }

    const creditos = Number(valorMeta);
    console.log(`Vai creditar +${creditos} para UID ${uid}`);

    // 3. Atualiza no Firestore
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      creditos: increment(creditos),
      jaComprou: true,
    });

    console.log(`Créditos atualizados com sucesso para ${uid}`);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ERRO NO WEBHOOK:", e);
    return NextResponse.json(
      { error: true, message: e.message || "Erro interno" },
      { status: 500 }
    );
  }
}
