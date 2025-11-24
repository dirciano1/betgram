export async function getMercadoCartola() {
  const res = await fetch("https://api.cartola.globo.com/atletas/mercado", {
    next: { revalidate: 60 } // cache de 1 minuto
  });

  const json = await res.json();
  return json.atletas;
}
