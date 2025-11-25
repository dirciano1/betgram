// app/layout.jsx
import "./globals.css";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://betgram.com.br"),

  // 🔥 CANONICAL CORRIGIDO
  alternates: {
    canonical: "/",
  },

  title: "Betgram - Analisador de Apostas Esportivas com Inteligência Artificial",

  description:
    "O Betgram usa inteligência artificial avançada para analisar jogos, calcular probabilidades reais e revelar apostas de valor automaticamente.",

  openGraph: {
    title: "Betgram - Analisador de Apostas Esportivas com Inteligência Artificial",
    description:
      "O Betgram transforma dados, estatísticas e odds em insights poderosos com IA avançada.",
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

  // 🔥 ÍCONES COMPLETOS + PNG LOCAL
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        {/* ⭐ SCRIPT DO CARTOLA FC */}
        <Script src="/scripts/cartola-menu.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
