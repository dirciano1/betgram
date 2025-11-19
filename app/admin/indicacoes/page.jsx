"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../../lib/firebase";

export default function IndicacoesAdmin() {
  const [indicacoes, setIndicacoes] = useState([]);
  const [usuarios, setUsuarios] = useState({});

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    // 1. Carrega indicações
    const snapIndic = await getDocs(collection(db, "indicacoes"));
    const lista = [];
    snapIndic.forEach((d) => lista.push({ id: d.id, ...d.data() }));
    setIndicacoes(lista);

    // 2. Carrega usuários
    const snapUsers = await getDocs(collection(db, "users"));
    const mapa = {};

    snapUsers.forEach((doc) => {
      const dados = doc.data();
      mapa[dados.uid] = dados; // ← AQUI ESTÁ A CORREÇÃO
    });

    setUsuarios(mapa);
  }

  function formatarData(timestamp) {
    if (!timestamp) return "—";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("pt-BR");
  }

  function mostrarUsuario(uid) {
    const u = usuarios[uid];
    if (!u) return uid; // fallback
    return u.nome || u.email || uid;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "#22c55e" }}>Indicações</h1>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Indicou</th>
            <th>Indicado</th>
            <th>Data</th>
            <th>Bônus Pago</th>
          </tr>
        </thead>

        <tbody>
          {indicacoes.map((i) => (
            <tr key={i.id}>
              <td>{mostrarUsuario(i.indicadoPor)}</td>
              <td>{mostrarUsuario(i.indicado)}</td>
              <td>{formatarData(i.data)}</td>
              <td style={{ color: i.bonusPago ? "#22c55e" : "#ef4444" }}>
                {i.bonusPago ? "Sim" : "Não"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
