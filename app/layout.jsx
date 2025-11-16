// app/layout.jsx
import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        {/* 🔥 carrega o script global depois que a página estiver interativa */}
        <Script src="/betgram-estilos.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
