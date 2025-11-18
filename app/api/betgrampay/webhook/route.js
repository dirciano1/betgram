import { NextResponse } from "next/server";
import { dbServer, admin } from "../../../../lib/firebaseServer";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("📩 WEBHOOK RECEBIDO:", JSON.stringify(body, null, 2));

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

    console.log("🔧 Atualizando créditos do usuário:", uid);

    // 🔥 Atualização correta usando Admin SDK
    await dbServer
      .collection("users")
      .doc(uid)
      .update({
        creditos: admin.firestore.FieldValue.increment(valorPlano),
        jaComprou: true,
        atualizadoEm: new Date(),
      });

    console.log("✅ Créditos adicionados!");
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("❌ Erro no webhook:", err);
    return NextResponse.json({ error: true, message: err.message }, { status: 500 });
  }
}
