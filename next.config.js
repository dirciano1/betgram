/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita que Vercel use versão antiga
  generateEtags: false,

  // Remove header "X-Powered-By"
  poweredByHeader: false,

  // Força páginas a rodarem sempre no modo dinâmico
  // (mantém seu comportamento atual com SWC)
  experimental: {
    forceSwcTransforms: true,
  },

  // Forçar SEM cache em todas as rotas (HTTP)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },

  // Removido: fetchCache (não é mais suportado nessas versões)
  // Desabilita modo serverless empacotando standalone (bom pro Vercel)
  output: "standalone",
};

module.exports = nextConfig;
