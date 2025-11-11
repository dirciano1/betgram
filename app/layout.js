export const metadata = {
  title: "Betgram - Analisador de Apostas Esportivas com Inteligencia Artificial",
  description:
    "O Betgram é um analisador de apostas esportiva que usa inteligente artificial (IA) (AI) avançada para transformar dados, estatísticas e odds em insights poderosos. Aposte com estratégia e descubra oportunidades reais de valor.",
  keywords: [
    "Betgram",
    "analisador esportivo",
    "IA esportiva",
    "apostas esportivas",
    "inteligência artificial",
    "previsões de futebol",
    "análise de jogos",
    "melhores odds",
    "estratégia de apostas",
    "analisador de apostas",
  ],
  openGraph: {
    title: "Betgram — Analisador Esportivo Inteligente",
    description:
      "Aposte com inteligência. O Betgram usa IA para gerar análises e previsões esportivas em tempo real.",
    url: "https://www.betgram.com.br",
    siteName: "Betgram",
    images: [
      {
        url: "https://www.betgram.com.br/og-image.jpg", // coloque sua imagem real aqui
        width: 1200,
        height: 630,
        alt: "Betgram — IA Esportiva Inteligente",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Betgram — Analisador Esportivo Inteligente",
    description:
      "Análises e previsões esportivas automáticas com IA. Descubra valor, maximize lucros e aposte com dados, não com sorte.",
    images: ["https://www.betgram.com.br/og-image.jpg"],
  },
  authors: [{ name: "Betgram" }],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
