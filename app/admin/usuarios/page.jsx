"use client";

import { useEffect, useState } from "react";
import {
  db,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  increment,
} from "../../../lib/firebase";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [valores, setValores] = useState({});

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const snap = await getDocs(collection(db, "users"));
    const arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    setUsuarios(arr);
  }

  function mudarValor(uid, v) {
    setValores((prev) => ({ ...prev, [uid]: v }));
  }

  async function addCredito(uid) {
    const qtd = Number(valores[uid] || 0);
    if (qtd <= 0) return alert("Digite um valor válido");

    await updateDoc(doc(db, "users", uid), {
      creditos: increment(qtd),
    });

    mudarValor(uid, "");
    carregar();
  }

  async function removerCredito(uid) {
    const qtd = Number(valores[uid] || 0);
    if (qtd <= 0) return alert("Digite um valor válido");

    await updateDoc(doc(db, "users", uid), {
      creditos: increment(-qtd),
    });

    mudarValor(uid, "");
    carregar();
  }

  async function promover(uid) {
    await updateDoc(doc(db, "users", uid), { role: "admin" });
    carregar();
  }

  async function rebaixar(uid) {
    await updateDoc(doc(db, "users", uid), { role: "user" });
    carregar();
  }

  async function excluir(uid) {
    await deleteDoc(doc(db, "users", uid));
    carregar();
  }

  return (
    <div>
      <h1 style={{ color: "#22c55e" }}>Gerenciar Usuários</h1>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Créditos</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nome || u.email}</td>
              <td>{u.creditos}</td>
              <td>{u.role}</td>

              <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {/* INPUT PERSONALIZADO */}
                <input
                  type="number"
                  value={valores[u.id] || ""}
                  onChange={(e) => mudarValor(u.id, e.target.value)}
                  placeholder="Qtd"
                  style={{
                    width: 70,
                    padding: "4px 6px",
                    borderRadius: 6,
                    border: "1px solid #94a3b8",
                    background: "#0f172a",
                    color: "#fff",
                  }}
                />

                <button onClick={() => addCredito(u.id)}>Adicionar</button>
                <button onClick={() => removerCredito(u.id)}>Remover</button>

                <button onClick={() => promover(u.id)}>Promover</button>
                <button onClick={() => rebaixar(u.id)}>Rebaixar</button>

                <button onClick={() => excluir(u.id)} style={{ color: "red" }}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
