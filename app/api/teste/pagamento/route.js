import { db, doc, getDoc, updateDoc, increment } from "@/lib/firebase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId faltando" }), { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), { status: 404 });
    }

    const user = userSnap.data();

    // Marca compra
    await updateDoc(userRef, {
      jaComprou: true,
    });

    // Verifica bônus de indicação
    if (user.indicadoPor && user.bonusRecebido === false) {
      const indicadorRef = doc(db, "users", user.indicadoPor);

      await updateDoc(indicadorRef, {
        creditos: increment(1),
      });

      // Marca que já recebeu o bônus
      await updateDoc(userRef, {
        bonusRecebido: true,
      });
    }

    return new Response(JSON.stringify({ sucesso: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
