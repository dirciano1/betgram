import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, increment, collection, query, where, getDocs } from "firebase/firestore";
import { consultarStatusPix, buscarTransacaoPorTxid } from "../../../lib/pixFunctions";

export default async function handler(req, res) {
  const { id } = req.query; // txid

  try {
    // 1️⃣ Verifica status do PIX (via AbacatePay ou simulador)
    const status = await consultarStatusPix(id);

    if (status === "paid") {
      // 2️⃣ Busca dados da transação (quem pagou e quanto)
      const { uid, amount } = await buscarTransacaoPorTxid(id);

      // 3️⃣ Marca o usuário como tendo comprado
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { jaComprou: true });

      // 4️⃣ Lê dados do usuário
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // 5️⃣ Só libera bônus se indicado e valor ≥ 10
      if (userData.indicadoPor && amount >= 10) {
        const indicadorRef = doc(db, "users", userData.indicadoPor);
        const indicadorSnap = await getDoc(indicadorRef);

        if (indicadorSnap.exists()) {
          // checa se já existe indicação não paga
          const indicacoesRef = collection(db, "indicacoes");
          const q = query(indicacoesRef, where("indicado", "==", uid));
          const indicacoes = await getDocs(q);

          if (!indicacoes.empty) {
            const indicacao = indicacoes.docs[0];
            const dadosIndicacao = indicacao.data();

            if (!dadosIndicacao.bonusPago) {
              // adiciona créditos ao indicador
              await updateDoc(indicadorRef, {
                creditos: increment(20),
              });

              // marca bônus como pago
              await updateDoc(indicacao.ref, {
                bonusPago: true,
                bonusPagoEm: new Date().toISOString(),
              });

              console.log(`🎁 Bônus liberado: ${userData.indicadoPor} recebeu por ${uid}`);
            }
          }
        }
      }

      return res.status(200).json({ status: "paid" });
    } else {
      return res.status(200).json({ status });
    }
  } catch (e) {
    console.error("Erro ao processar PIX:", e);
    return res.status(500).json({ error: e.message });
  }
}
