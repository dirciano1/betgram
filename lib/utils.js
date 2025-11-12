export function capturarIndicadorURL() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) {
    localStorage.setItem("indicador", ref);
    console.log("🔗 Indicador salvo:", ref);
  }
}
