export async function GET() {
  try {
    const r = await fetch("https://api.cartola.globo.com/atletas/mercado", {
      headers: {
        "User-Agent": "Mozilla/5.0", // necessário para alguns endpoints da Globo
      }
    });

    const data = await r.json();

    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "Erro ao buscar API Cartola." }, { status: 500 });
  }
}
