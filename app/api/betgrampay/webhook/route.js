import { NextResponse } from "next/server";
import { dbServer, increment } from "../../../../lib/firebaseServer";

export async function POST(req) {
  try {
    const body = await req.json();

    if (body?.event !== "billing.paid") {
      return NextResponse.json({ ok: true, ignore: true });
    }

    const pix = body?.data?.pixQrCode;
    if (!pix) {
      return NextResponse.json({ error: true, message: "pixQrCode ausente" }, { status: 400 });
    }

    const metadata = pix.metadata || {};
    const uid = metadata.uid;
    const valorPlano = Number(metadata.valor);

    // 🔥 Busca o usuário usando Admin SDK
    const userRef = dbServer.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      console.log("❌ Usuário não existe.");
      return NextResponse.json({ error: true }, { status: 404 });
    }

    const userData = userSnap.data();
    const indicador = userData.indicador;
    const bonusRecebido = userData.bonusRecebido;

    // 🔥 Dá crédito ao comprador
    await userRef.update({
      creditos: increment(valorPlano),
      jaComprou: true
    });

    // 🔥 Paga bônus para o indicador (caso exista)
    if (indicador && !bonusRecebido) {
      await dbServer.collection("users").doc(indicador).update({
        creditos: increment(20)
      });

      await userRef.update({
        bonusRecebido: true
      });

      console.log("🎉 Bônus pago ao indicador:", indicador);
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.log("❌ Erro no webhook:", err.message);
    return NextResponse.json({ error: true, msg: err.message }, { status: 500 });
  }
}
