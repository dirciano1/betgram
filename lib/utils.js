export function capturarIndicadorURL() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const indicadoPor = params.get("ref");

  if (indicadoPor) {
    localStorage.setItem("indicadoPor", indicadoPor);
  }
}
