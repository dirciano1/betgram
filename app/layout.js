export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Esta prop 'children' receberá o conteúdo do seu page.jsx */}
        {children} 
      </body>
    </html>
  );
}
