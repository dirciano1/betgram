// =============================================
// 🔒 CLIENTE DE IA BLINDADO — BETGRAM v3
// =============================================
export async function gerarAnalise(prompt) {
  const maxTentativas = 5;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      console.log(`⚙️ Tentativa ${tentativa}/${maxTentativas} para gerar análise…`);

      const response = await fetch("/api/analise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json().catch(() => null);

      // ⚠️ Caso a API esteja fora
      if (!response.ok) {
        const msg = data?.error || `Erro HTTP ${response.status}`;
        console.warn("⚠️ API retornou erro:", msg);

        // ⏳ Se ainda houver tentativas → tenta de novo
        if (tentativa < maxTentativas) {
          await delay(1200);
          continue;
        }

        return (
          "⚠️ Servidores estão lentos no momento.\n" +
          "Por favor, tente gerar novamente em alguns segundos.\n\n" +
          "❌ Seu crédito **NÃO FOI descontado**."
        );
      }

      // 🔥 Sucesso → retorna o texto
      if (data?.content) return data.content;

      // ⚠️ Resposta vazia → retry
      if (tentativa < maxTentativas) {
        console.warn("⚠️ Resposta vazia, tentando novamente…");
        await delay(1200);
        continue;
      }

      return (
        "⚠️ Não recebemos resposta da IA.\n" +
        "Por favor, tente novamente.\n\n" +
        "❌ Seu crédito **NÃO FOI descontado**."
      );

    } catch (err) {
      console.error("❌ Erro gerarAnalise:", err);

      if (tentativa < maxTentativas) {
        await delay(1200);
        continue;
      }

      return (
        "❌ Falha ao gerar análise.\n" +
        "Parece que os servidores estão instáveis.\n\n" +
        "⚠️ Seu crédito **NÃO FOI descontado**.\n" +
        "Tente novamente em alguns segundos."
      );
    }
  }

  // Nunca deve chegar aqui, mas caso chegue:
  return (
    "❌ Falha inesperada.\n" +
    "Seu crédito **NÃO FOI descontado**.\n" +
    "Tente novamente."
  );
}
