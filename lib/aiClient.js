export async function gerarAnalise(prompt) {
  try {
    const response = await fetch("/api/analise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Erro HTTP ${response.status}`);
    }

    const data = await response.json();

    // 🔥 Ajuste para Gemini:
    return data.content || "❌ Nenhuma resposta recebida da IA.";
  } catch (err) {
    console.error("Erro gerarAnalise:", err);
    return "❌ Falha ao gerar análise. Verifique o console.";
  }
}
