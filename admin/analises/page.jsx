"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs, deleteDoc, doc } from "../../../lib/firebase";

export default function AnalisesAdmin() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const snap = await getDocs(collection(db, "analises"));
    const arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    setLista(arr);
  }

  async function excluir(id) {
    await deleteDoc(doc(db, "analises", id));
    carregar();
  }

  return (
    <div>
      <h1 style={{ color: "#22c55e" }}>Gerenciar Análises</h1>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Confronto</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((a) => (
            <tr key={a.id}>
              <td>{a.userEmail}</td>
              <td>{a.confronto}</td>
              <td>{a.createdAt}</td>
              <td>
                <button onClick={() => excluir(a.id)} style={{ color: "red" }}>
                  Excluir análise
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
