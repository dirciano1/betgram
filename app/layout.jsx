// app/layout.jsx
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Betgram - Analisador de Apostas Esportivas com Inteligência Artificial",
  description:
    "O Betgram é um analisador de apostas esportiva que usa inteligência artificial avançada para transformar dados, estatísticas e odds em insights poderosos. Aposte com estratégia e descubra oportunidades reais de valor.",
  openGraph: {
    title: "Betgram - Analisador de Apostas Esportivas com Inteligência Artificial",
    description:
      "O Betgram é um analisador de apostas esportiva que usa inteligência artificial avançada para transformar dados, estatísticas e odds em insights poderosos. Aposte com estratégia e descubra oportunidades reais de valor.",
    url: "https://betgram.com.br",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Betgram - IA para Apostas Esportivas",
    description:
      "O Betgram transforma dados, estatísticas e odds em insights poderosos com IA avançada.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

      </body>
    </html>
  );
}
