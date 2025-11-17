"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../lib/firebase";
import Card from "./components/Card";
import Grafico from "./components/Grafico";

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState(0);
  const [analises, setAnalises] = useState(0);
  const [creditoTotal, setCreditoTotal] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const usersSnap = await getDocs(collection(db, "users"));
    setUsuarios(usersSnap.size);

    const analisesSnap = await getDocs(collection(db, "analises"));
    setAnalises(analisesSnap.size);

    let totalCred = 0;
    usersSnap.forEach((u) => {
      totalCred += u.data().creditos || 0;
    });
    setCreditoTotal(totalCred);
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, color: "#22c55e", marginBottom: 20 }}>
        Painel Administrativo
      </h1>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Card title="Usuários" value={usuarios} />
        <Card title="Análises" value={analises} />
        <Card title="Créditos Totais" value={creditoTotal} />
      </div>

      <div style={{ marginTop: 40 }}>
        <Grafico />
      </div>
    </div>
  );
}
