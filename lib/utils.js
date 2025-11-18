export function capturarIndicadorURL() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const indicador = params.get("ref");

  if (indicador) {
    localStorage.setItem("indicador", indicador);
  }
}
