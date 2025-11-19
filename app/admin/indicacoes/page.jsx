"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../../lib/firebase";

export default function IndicacoesAdmin() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const snap = await getDocs(collection(db, "indicacoes"));
    let arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    setLista(arr);
  }

  return (
    <div>
      <h1 style={{ color: "#22c55e" }}>Indicações</h1>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Indicador</th>
            <th>Indicado</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((i) => (
            <tr key={i.id}>
              <td>{i.indicador}</td>
              <td>{i.indicado}</td>
              <td>{i.data || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
