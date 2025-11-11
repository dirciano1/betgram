import { db } from "@/lib/firebase";
import fs from "fs";
import https from "https";

export async function POST(req) {
  try {
    const { uid, amount } = await req.json();

    if (!uid || !amount) {
      return Response.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Certificado .p12 da Efí (deve estar no diretório /app/api/certs)
    const cert = fs.readFileSync(process.env.EFI_CERT_PATH);
    const agent = new https.Agent({
      pfx: cert,
      passphrase: process.env.EFI_CERT_PASSWORD,
    });

    // Token de autenticação
    const tokenRes = await fetch("https://api.efipay.com.br/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.EFI_CLIENT_ID,
        client_secret: process.env.EFI_CLIENT_SECRET,
      }),
    });

    const { access_token } = await tokenRes.json();

    // Cria a cobrança PIX
    const body = {
      calendario: { expiracao: 3600 },
      valor: { original: amount.toFixed(2) },
      chave: process.env.EFI_PIX_KEY,
      solicitacaoPagador: "Créditos Betgram Pay",
    };

    const res = await fetch("https://api.efipay.com.br/v2/cob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
      agent,
    });

    const data = await res.json();

    if (!data.txid) {
      console.error("Erro Efí:", data);
      return Response.json({ error: "Erro ao gerar cobrança PIX" }, { status: 500 });
    }

    // Salva no Firestore
    await db.collection("transactions").doc(data.txid).set({
      uid,
      amount,
      status: "pending",
      createdAt: new Date(),
    });

    return Response.json({
      txid: data.txid,
      qr: data.pixCopiaECola,
    });
  } catch (err) {
    console.error("Erro PIX:", err);
    return Response.json({ error: "Erro ao gerar PIX" }, { status: 500 });
  }
}
