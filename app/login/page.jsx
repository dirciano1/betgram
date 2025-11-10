"use client";

import { useEffect, useState } from "react";
import { loginComGoogle, sair, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        router.push("/dashboard");
      }
    });
  }, [router]);

  async function handleLogin() {
    try {
      await loginComGoogle();
    } catch (err) {
      alert("Erro ao fazer login: " + err.message);
    }
  }

  async function handleLogout() {
    await sair();
    setUsuario(null);
  }

  return (
    <main style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.titulo}>🔐 Betgram - Login</h1>

        {!usuario ? (
          <>
            <p style={styles.texto}>Entre com sua conta Google para acessar o painel.</p>
            <button style={styles.botao} onClick={handleLogin}>
              Entrar com Google 🔥
            </button>
          </>
        ) : (
          <>
            <p style={styles.texto}>Você está logado como:</p>
            <p style={styles.nome}>{usuario.displayName}</p>
            <button style={styles.botao} onClick={handleLogout}>
              Sair
            </button>
          </>
        )}
      </div>
      <p style={styles.rodape}>© 2025 Betgram - Inteligência IA Esportiva</p>
    </main>
  );
}

const styles = {
  container: {
    background: "#0b1324",
    color: "#fff",
    fontFamily: "monospace",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  box: {
    background: "rgba(255,255,255,0.05)",
    border: "2px solid #22c55e",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
  },
  titulo: {
    color: "#22c55e",
    fontSize: "1.8em",
    marginBottom: "10px",
  },
  texto: {
    color: "#ccc",
    marginBottom: "20px",
  },
  nome: {
    fontWeight: "bold",
    fontSize: "1.1em",
    color: "#fff",
    marginBottom: "20px",
  },
  botao: {
    background: "#22c55e",
    color: "#0b1324",
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  rodape: {
    marginTop: "40px",
    color: "#aaa",
    fontSize: "0.9em",
  },
};
