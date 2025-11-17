"use client";

import { useEffect, useState } from "react";
import { 
  db, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  increment 
} from "@/lib/firebase";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const snap = await getDocs(collection(db, "users"));
    const arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    setUsuarios(arr);
  }

  async function addCredito(uid, qtd) {
    await updateDoc(doc(db, "users", uid), {
      creditos: increment(qtd),
    });
    carregar();
  }

  async function removerCredito(uid, qtd) {
    await updateDoc(doc(db, "users", uid), {
      creditos: increment(-qtd),
    });
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

  async function banir(uid) {
    await updateDoc(doc(db, "users", uid), { banido: true });
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
              <td>{u.role || "user"}</td>

              <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => addCredito(u.id, 10)}>+10</button>
                <button onClick={() => removerCredito(u.id, 10)}>-10</button>

                <button onClick={() => promover(u.id)}>Promover</button>
                <button onClick={() => rebaixar(u.id)}>Rebaixar</button>
                <button onClick={() => banir(u.id)}>Banir</button>

                <button 
                  onClick={() => excluir(u.id)} 
                  style={{ color: "red", fontWeight: "bold" }}
                >
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
