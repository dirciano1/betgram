export const metadata = {
  title: 'Betgram — Analisador Esportivo Inteligente',
  description: 'O Betgram — Analisador Esportivo Inteligente é uma plataforma alimentada por inteligência artificial que transforma dados esportivos em insights poderosos.
Analise partidas, descubra oportunidades de valor e receba recomendações automáticas baseadas em desempenho, odds e estatísticas em tempo real.
Ideal para quem quer apostar com estratégia e não apenas com sorte.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
