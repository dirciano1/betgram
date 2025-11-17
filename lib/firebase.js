async function loginComGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Token → cookie
  const token = await user.getIdToken();
  document.cookie = `betgram_token=${token}; path=/; max-age=86400; SameSite=Lax`;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // 👉 PRIMEIRO ACESSO
    await setDoc(ref, {
      nome: user.displayName || "",
      email: user.email || "",
      foto: user.photoURL || "",
      creditos: 0,
      role: "user",
      criadoEm: Date.now(),
    });
  } else {
    // 👉 USUÁRIO EXISTENTE → ARRUMAR ROLE EM QUALQUER CASO
    const data = snap.data();
    const roleAtual =
      data.role === "admin" ? "admin" : "user"; // <<< FORÇA USER SE NÃO FOR ADMIN

    await updateDoc(ref, {
      role: roleAtual,
      creditos: data.creditos ?? 0,
      nome: data.nome || user.displayName || "",
      email: data.email || user.email || "",
      foto: data.foto || user.photoURL || "",
    });
  }

  return user;
}
