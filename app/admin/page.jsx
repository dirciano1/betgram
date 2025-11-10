"use client";

import { useEffect, useState } from "react";
import {
  auth,
  db,
  onSnapshot,
  collection,
  doc,
  updateDoc,
  getDoc,
} from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function PainelAdmin() {
  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [analises, setAnalises] = useState([]);
  const [filtro, setFiltro] = useState("");
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUsuario(user);
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists() || !snap.data().admin) {
        router.push("/dashboard");
        return;
      }

      // Carregar todos os usuários
      onSnapshot(collection(db, "users"), (snapshot) => {
        setUsuarios(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      });

      // Carregar todas as análises
      onSnapshot(collection(db, "analises"), (snapshot) => {
        const lista = snapshot.docs
          .map((d) => d.data())
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAnalises(lista);
      });
    });
  }, [router]);

  async function adicionarCredito(uid, atual, qtd) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { creditos: atual + qtd });
    alert(`✅ ${qtd} crédito(s) adicionado(s)!`);
  }

  const filtradas = analises.filter((a) =>
    filtro ? a.uid === filtro : true
  );

  return (
    <main style={styles.container}>
      <h1 style={styles.titulo}>👑 Painel Administrativo Betgram</h1>

      <section style={styles.box}>
        <h2 style={styles.subtitulo}>👥 Usuários</h2>
        {usuarios.length === 0 ? (
          <p style={styles.texto}>Nenhum usuário encontrado.</p>
        ) : (
          <table style={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Créditos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td style={{ textAlign: "center" }}>{u.creditos}</td>
                  <td>
                    <button
                      style={styles.botaoAdd}
                      onClick={() => adicionarCredito(u.id, u.creditos, 1)}
                    >
                      +1
                    </button>
                    <button
                      style={styles.botaoAdd}
                      onClick={() => adicionarCredito(u.id, u.creditos, 5)}
                    >
                      +5
                    </button>
                    <button
                      style={styles.botaoVer}
                      onClick={() => setFiltro(u.id)}
                    >
                      Ver análises
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={styles.box}>
        <h2 style={styles.subtitulo}>
          🧾 {filtro ? "Análises deste usuário" : "Todas as Análises"}
        </h2>
        <button
          style={styles.botaoLimpar}
          onClick={() => setFiltro("")}
        >
          Mostrar todas
        </button>

        {filtradas.length === 0 ? (
          <p style={styles.texto}>Nenhuma análise encontrada.</p>
        ) : (
          <div style={styles.historico}>
            {filtradas.map((a, i) => (
              <div key={i} style={styles.card}>
                <p><b>👤</b> {a.nome}</p>
                <p><b>🗓️</b> {new Date(a.timestamp).toLocaleString()}</p>
                <p><b>🏅 Esporte:</b> {a.esporte}</p>
                <p><b>🎮 Confronto:</b> {a.confronto}</p>
                {a.mercado && <p><b>🎯 Mercado:</b> {a.mercado}</p>}
                {a.odd && <p><b>💰 Odd:</b> {a.odd}</p>}
                <pre style={styles.resposta}>{a.resposta}</pre>
              </div>
            ))}
          </div>
        )}
      </section>
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
  },
  titulo: {
    color: "#22c55e",
    textAlign: "center",
    marginBottom: "20px",
  },
  box: {
    background: "rgba(255,255,255,0.05)",
    border: "2px solid #22c55e",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
  },
  subtitulo: {
    color: "#22c55e",
    marginBottom: "10px",
  },
  texto: {
    color: "#ccc",
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95em",
  },
  botaoAdd: {
    background: "#22c55e",
    color: "#0b1324",
    border: "none",
    borderRadius: "6px",
    padding: "4px 8px",
    marginRight: "6px",
    cursor: "pointer",
  },
  botaoVer: {
    background: "#111827",
    color: "#22c55e",
    border: "1px solid #22c55e",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer",
  },
  botaoLimpar: {
    background: "#1f2937",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "6px 10px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid #22c55e",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
  },
  resposta: {
    background: "#111827",
    padding: "10px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    marginTop: "8px",
  },
};
