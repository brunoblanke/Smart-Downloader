// client.js

// ================================================================================================================================================================================================================================================
// temaEscuro

function temaEscuro(t) {
  const tema = (t.getContext() || {}).theme;
  if (tema === "dark" || tema === "light") return tema === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// ================================================================================================================================================================================================================================================
// abrirModal

function abrirModal(t) {
  return t.modal({
    url: "./baixar.html?v=6",
    height: 340,
    accentColor: temaEscuro(t) ? "#22272b" : "#ffffff"
  });
}

// ================================================================================================================================================================================================================================================
// botoesDoCard

function botoesDoCard(t) {
  return [{
    icon: new URL("./icon.svg", window.location.href).href,
    text: "Baixar tudo",
    callback: abrirModal,
    condition: "always"
  }];
}

TrelloPowerUp.initialize(
  { "card-buttons": botoesDoCard },
  { appKey: APP_KEY, appName: APP_NAME }
);
