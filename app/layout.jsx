// app/layout.jsx
<meta property="og:title" content="Betgram - Analisador de Apostas Esportivas com Inteligencia Artificial" />
<meta property="og:description" content="O Betgram é um analisador de apostas esportiva que usa inteligente artificial (IA) (AI) avançada para transformar dados, estatísticas e odds em insights poderosos. Aposte com estratégia e descubra oportunidades reais de valor" />
<meta property="og:image" content="/og-image.jpg" />
<meta property="og:url" content="https://betgram.com.br" />
<meta property="og:type" content="website" />

<!-- Opcional para WhatsApp ficar perfeito -->
<meta name="twitter:card" content="summary_large_image" />

import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Script src="/betgram-estilos.js" strategy="afterInteractive" />
        {/* 🔥 carrega o script global depois que a página estiver interativa */}
        
      </body>
    </html>
  );
}
