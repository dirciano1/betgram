"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../../lib/firebase";

export default function IndicacoesAdmin() {
  const [indicacoes, setIndicacoes] = useState([]);
  const [usuarios, setUsuarios] = useState({}); // ← mapa uid → dados

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    // 1️⃣ Carregar indicações
    const snapIndic = await getDocs(collection(db, "indicacoes"));
    let lista = [];
    snapIndic.forEach((d) => lista.push({ id: d.id, ...d.data() }));
    setIndicacoes(lista);

    // 2️⃣ Carregar usuários
    const snapUsers = await getDocs(collection(db, "users"));
    let mapa = {};

    snapUsers.forEach((u) => {
      mapa[u.id] = u.data();
    });

    setUsuarios(mapa);
  }

  function formatarData(timestamp) {
    if (!timestamp) return "—";
    try {
      return new Date(timestamp.seconds * 1000).toLocaleString("pt-BR");
    } catch {
      return "—";
    }
  }

  function mostrarUsuario(uid) {
    const u = usuarios[uid];
    if (!u) return uid; // fallback caso usuário não exista

    // escolha o que mostrar:
    return u.nome || u.email || uid;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#22c55e" }}>Indicações</h1>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Indicou</th>
            <th style={{ textAlign: "left" }}>Indicado</th>
            <th style={{ textAlign: "left" }}>Data</th>
            <th style={{ textAlign: "left" }}>Bônus Pago</th>
          </tr>
        </thead>

        <tbody>
          {indicacoes.map((i) => (
            <tr key={i.id}>
              <td>{mostrarUsuario(i.indicadoPor)}</td>
              <td>{mostrarUsuario(i.indicado)}</td>
              <td>{formatarData(i.data)}</td>
              <td style={{ color: i.bonusPago ? "#22c55e" : "#f87171" }}>
                {i.bonusPago ? "Sim" : "Não"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
