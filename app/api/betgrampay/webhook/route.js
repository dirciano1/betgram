import { db, doc, updateDoc, increment } from "../../../../lib/firebase";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("📩 WEBHOOK RECEBIDO:", JSON.stringify(body, null, 2));

    if (body.event !== "billing.paid") {
      return Response.json({ ok: true, msg: "Evento ignorado" });
    }

    const pix = body.data.pixQrCode;

    const uid = pix.metadata.uid;
    const valor = Number(pix.metadata.valor);
    const status = pix.status;

    if (!uid || !valor) {
      console.log("❌ Metadata faltando no webhook!");
      return Response.json({ ok: false, msg: "Metadata ausente" });
    }

    if (status === "PAID") {
      await updateDoc(doc(db, "users", uid), {
        creditos: increment(valor)
      });

      console.log(`🔥 Créditos adicionados ao usuário ${uid}: +${valor}`);
    }

    return Response.json({ ok: true });

  } catch (e) {
    console.error("❌ ERRO NO WEBHOOK:", e);
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
