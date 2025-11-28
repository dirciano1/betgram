/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita que Vercel use versão antiga
  generateEtags: false,

  // Remove header "X-Powered-By"
  poweredByHeader: false,

  // Força páginas a rodarem sempre no modo dinâmico
  // Isso impede cache de API no Vercel Edge
  experimental: {
    forceSwcTransforms: true,
  },

  // Forçar SEM cache em todas as rotas
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private"
          },
          {
            key: "Pragma",
            value: "no-cache"
          },
          {
            key: "Expires",
            value: "0"
          }
        ]
      }
    ];
  },

  // Desabilita cache do Vercel
  fetchCache: "force-no-store",
  output: "standalone",
};

module.exports = nextConfig;
