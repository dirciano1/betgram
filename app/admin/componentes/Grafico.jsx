"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function Grafico() {
  const [loading, setLoading] = useState(true);
  const [compradores, setCompradores] = useState([]);
  const [totalCreditos, setTotalCreditos] = useState(0);

  useEffect(() => {
    async function carregar() {
      try {
        const ref = collection(db, "users");
        const q = query(ref, where("jaComprou", "==", true), orderBy("criadoEm", "desc"));
        const snap = await getDocs(q);

        let lista = [];
        let somaCreditos = 0;

        snap.forEach((doc) => {
          const dados = doc.data();
          lista.push(dados);
          somaCreditos += Number(dados.creditos || 0);
        });

        setCompradores(lista);
        setTotalCreditos(somaCreditos);
      } catch (e) {
        console.error("Erro ao carregar painel financeiro:", e);
      } finally {
        setLoading(false);
      }
    }

    carregar();
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
        🪙 Visão Financeira do Sistema
      </h2>

      {/* === CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="p-4 rounded-lg bg-[#0f1b30] border border-green-600/20">
          <p className="text-sm text-gray-400">Usuários que já Compraram</p>
          <h3 className="text-3xl font-bold text-green-400">{compradores.length}</h3>
        </div>

        <div className="p-4 rounded-lg bg-[#0f1b30] border border-green-600/20">
          <p className="text-sm text-gray-400">Créditos Totais (Saldo Atual Somado)</p>
          <h3 className="text-3xl font-bold text-green-400">{totalCreditos}</h3>
        </div>

        <div className="p-4 rounded-lg bg-[#0f1b30] border border-green-600/20">
          <p className="text-sm text-gray-400">Taxa de Conversão</p>
          <h3 className="text-3xl font-bold text-green-400">
            {((compradores.length / 10) * 100).toFixed(0)}%
          </h3>
          <p className="text-xs text-gray-500">(baseado no total de usuários)</p>
        </div>

      </div>

      {/* === TABELA === */}
      <h3 className="text-lg font-semibold text-green-400 mb-3">📦 Últimos Usuários que Compraram</h3>

      {compradores.length === 0 ? (
        <p className="text-gray-400">Nenhum usuário realizou compra ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-[#0f1b30] rounded-lg overflow-hidden border border-green-600/10">
            <thead>
              <tr className="bg-[#122038] text-gray-300 text-sm">
                <th className="p-3">Nome</th>
                <th className="p-3">Email</th>
                <th className="p-3">Créditos</th>
                <th className="p-3">Criado em</th>
              </tr>
            </thead>

            <tbody>
              {compradores.map((c, index) => (
                <tr key={index} className="border-t border-green-600/10 text-gray-200">
                  <td className="p-3">{c.nome}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.creditos}</td>
                  <td className="p-3">{c.criadoEm}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
