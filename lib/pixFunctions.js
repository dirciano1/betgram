import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Simula consulta do status PIX no seu provedor (AbacatePay, PagSeguro, etc.)
 */
export async function consultarStatusPix(txid) {
  // aqui você colocará a lógica real da API do AbacatePay, se quiser
  // por enquanto simulamos com "paid"
  return "paid";
}

/**
 * Busca transação no Firestore (ou retorna dados fake de teste)
 * Aqui precisamos saber: quem (uid) e quanto (amount)
 */
export async function buscarTransacaoPorTxid(txid) {
  const ref = doc(db, "transacoes", txid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data();
  } else {
    // fallback de teste
    return { uid: "teste123", amount: 10 };
  }
}
