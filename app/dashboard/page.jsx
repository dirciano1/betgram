"use client";

import { useEffect, useState } from "react";
import { auth, db, doc, getDoc, onSnapshot, collection, query, where } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [dados, setDados] = useState(null);
  const [historico, setHistorico] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUsuario(user);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setDados(snap.data());
        if (snap.data().admin) console.log("👑 Admin detectado");
      }

      // Carrega histórico em tempo real
      const q = query(collection(db, "analises"), where("uid", "==", user.uid));
      onSnapshot(q, (snapshot) => {
        const lista = snapshot.docs
          .map((d) => d.data())
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistorico(lista);
      });
    });
    return () => unsub();
  }, [router]);

  if (!usuario || !dados) {
    return (
      <main style={styles.container}>
        <h1 style={styles.titulo}>Carregando...</h1>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.titulo}>🎯 Painel Betgram</h1>

      <div style={styles.box}>
        <p><b>👤 Usuário:</b> {dados.nome}</p>
        <p><b>💰 Créditos:</b> {dados.creditos}</p>
        <Link href="/admin" style={styles.linkAdmin}>
          {dados.admin && "👑 Acessar Painel Admin"}
        </Link>
      </div>

      <h2 style={styles.subtitulo}>📜 Últimas Análises</h2>

      {historico.length === 0 ? (
        <p style={styles.texto}>Nenhuma análise registrada ainda.</p>
      ) : (
        <div style={styles.historico}>
          {historico.map((item, i) => (
            <div key={i} style={styles.card}>
              <p><b>🗓️</b> {new Date(item.timestamp).toLocaleString()}</p>
              <p><b>🏅 Esporte:</b> {item.esporte}</p>
              <p><b>🎮 Confronto:</b> {item.confronto}</p>
              {item.mercado && <p><b>🎯 Mercado:</b> {item.mercado}</p>}
              {item.odd && <p><b>💰 Odd:</b> {item.odd}</p>}
              <pre style={styles.resposta}>{item.resposta}</pre>
            </div>
          ))}
        </div>
      )}

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
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  titulo: {
    color: "#22c55e",
    marginBottom: "20px",
  },
  box: {
    background: "rgba(255,255,255,0.05)",
    border: "2px solid #22c55e",
    borderRadius: "16px",
    padding: "16px",
    textAlign: "left",
    width: "90%",
    maxWidth: "600px",
    marginBottom: "20px",
  },
  linkAdmin: {
    display: "block",
    color: "#22c55e",
    textDecoration: "none",
    marginTop: "10px",
    fontWeight: "bold",
  },
  subtitulo: {
    color: "#22c55e",
    marginBottom: "10px",
  },
  texto: {
    color: "#ccc",
  },
  historico: {
    width: "90%",
    maxWidth: "700px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid #22c55e",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "14px",
  },
  resposta: {
    background: "#111827",
    padding: "10px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    marginTop: "8px",
  },
  rodape: {
    marginTop: "30px",
    color: "#aaa",
    fontSize: "0.9em",
  },
};
