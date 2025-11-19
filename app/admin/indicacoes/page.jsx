"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../../lib/firebase";

export default function IndicacoesAdmin() {
  const [indicacoes, setIndicacoes] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const snap = await getDocs(collection(db, "indicacoes"));
    let arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    setIndicacoes(arr);
  }

  function formatarData(timestamp) {
    if (!timestamp) return "—";

    try {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString("pt-BR");
    } catch (err) {
      return "—";
    }
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
          {indicacoes.map((i) => (
            <tr key={i.id}>
              <td>{i.indicador}</td>
              <td>{i.indicado}</td>
              <td>{formatarData(i.data)}</td> {/* ✅ AGORA FUNCIONA */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
