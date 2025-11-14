import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uid, valor } = await req.json();

    // Monta payload da cobrança
    const payload = {
      amount: Math.round(valor * 100),
      description: `Créditos Betgram - Usuário ${uid}`,
      methods: ["PIX"],
      frequency: "ONE_TIME"
    };

    // ================================
    //  🚀 MODO PRODUÇÃO ABACATEPAY
    //  ⚠️ ENDPOINT CORRIGIDO PARA /v1/payments
    // ================================
    const res = await fetch("https://api.abacatepay.com/v1/payments", { // <-- MUDANÇA AQUI
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATEPAY_SECRET}` // SUA CHAVE PRODUÇÃO
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    console.log("RETORNO ABACATEPAY:", result);

    // Tratamento de erro do gateway (verifica se a resposta da API indica erro)
    if (!res.ok || result.error) {
      // Se a resposta HTTP não for 2xx OU a resposta JSON tiver um campo 'error'
      return NextResponse.json(
        { 
          error: true, 
          message: result.message || result.error || "Erro desconhecido na criação do pagamento." 
        },
        { status: res.status >= 400 ? res.status : 500 }
      );
    }

    // Retorno correto para o front (ajustado para os campos mais comuns de PIX)
    return NextResponse.json({
      txid: result.data.id,
      qrcode: result.data.qrCodeImage,      // base64
      qrcode_text: result.data.qrCodeText, // copia e cola
      url: result.data.url                 // link externo
    });

  } catch (e) {
    // Tratamento de erro de rede ou de parsing do JSON
    return NextResponse.json(
      { error: true, message: e.message || "Falha na comunicação com a API." },
      { status: 500 }
    );
  }
}
