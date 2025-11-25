"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function Grafico() {
  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]);
  const [totalValor, setTotalValor] = useState(0);
  const [totalCreditos, setTotalCreditos] = useState(0);
  const [totalCompradores, setTotalCompradores] = useState(0);

  useEffect(() => {
    async function carregarDados() {
      try {
        const ref = collection(db, "payments"); // sua coleção de compras (ajuste se o nome for outro)
        const q = query(ref, orderBy("timestamp", "desc"), limit(10));
        const snap = await getDocs(q);

        let lista = [];
        let valor = 0;
        let creditos = 0;
        let compradores = new Set();

        snap.forEach((doc) => {
          const dados = doc.data();
          lista.push(dados);

          valor += Number(dados.valor) || 0;
          creditos += Number(dados.creditos) || 0;
          if (dados.userEmail) compradores.add(dados.userEmail);
        });

        setCompras(lista);
        setTotalValor(valor);
        setTotalCreditos(creditos);
        setTotalCompradores(compradores.size);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-400">
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 rounded-lg border border-green-600/30 bg-[#0d1729]">
      <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
        💰 Visão Financeira do Sistema
      </h2>

      {/* === CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        <div className="p-4 rounded-lg bg-[#0f1b30] border border-green-600/20">
          <p className="text-sm text-gray-400">Total Arrecadado</p>
          <h3 className="text-3xl font-bold text-green-400">R$ {totalValor}</h3>
        </div>

        <div className="p-4 rounded-lg bg-[#0f1b30] border border-green-600/20">
          <p className="text-sm text-gray-400">Créditos Vendidos</p>
          <h3 className="text-3xl font-bold text-green-400">{totalCreditos}</h3>
        </div>

        <div className="p-4 rounded-lg bg-[#0f1b30] border border-green-600/20">
          <p className="text-sm text-gray-400">Usuários que Compraram</p>
          <h3 className="text-3xl font-bold text-green-400">{totalCompradores}</h3>
        </div>

      </div>

      {/* === TABELA DE ÚLTIMAS COMPRAS === */}
      <h3 className="text-lg font-semibold text-green-400 mb-3">📦 Últimas Compras</h3>

      {compras.length === 0 ? (
        <p className="text-gray-400">Nenhuma compra registrada ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-[#0f1b30] rounded-lg overflow-hidden border border-green-600/10">
            <thead>
              <tr className="bg-[#122038] text-gray-300 text-sm">
                <th className="p-3">Usuário</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Créditos</th>
                <th className="p-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c, index) => (
                <tr key={index} className="border-t border-green-600/10 text-gray-200">
                  <td className="p-3">{c.userEmail || "—"}</td>
                  <td className="p-3">R$ {c.valor}</td>
                  <td className="p-3">{c.creditos}</td>
                  <td className="p-3">
                    {c.timestamp?.toDate
                      ? c.timestamp.toDate().toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
