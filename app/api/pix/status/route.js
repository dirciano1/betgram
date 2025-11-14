import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const txid = searchParams.get("txid");

    if (!txid) {
      return NextResponse.json({ error: "txid não informado" }, { status: 400 });
    }

    const API_KEY = process.env.ABACATEPAY_KEY_TESTE || "abc_dev_UarpsjrXmT4mwr04EkECbbZH";

    // Consulta do pagamento
    const resposta = await fetch(`https://api.abacatepay.com/v1/pix/${txid}`, {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    });

    const data = await resposta.json();

    // Validação da resposta
    if (!data || !data.status) {
      return NextResponse.json({ status: "pendente" });
    }

    // AbacatePay retorna:
    // status = "approved" (pago)
    // status = "pending" (aguardando)
    // status = "expired"

    if (data.status === "approved") {
      return NextResponse.json({ status: "pago" });
    }

    if (data.status === "pending") {
      return NextResponse.json({ status: "pendente" });
    }

    if (data.status === "expired") {
      return NextResponse.json({ status: "expirado" });
    }

    return NextResponse.json({ status: "pendente" });

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao consultar pagamento", details: error.message },
      { status: 500 }
    );
  }
}
