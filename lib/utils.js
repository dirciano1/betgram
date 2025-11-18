export function capturarIndicadorURL() {
  const params = new URLSearchParams(window.location.search);
  const indicador = params.get("indicador");

  if (indicador) {
    localStorage.setItem("betgram_indicador", indicador);
  }
}
