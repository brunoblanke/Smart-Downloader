// client.js

// ================================================================================================================================================================================================================================================
// abrirModal

function abrirModal(t) {
  return t.modal({
    url: "./baixar.html",
    title: "Baixar todos os anexos",
    height: 200
  });
}

// ================================================================================================================================================================================================================================================
// botoesDoCard

function botoesDoCard(t) {
  console.log("[Smart Downloader] card-buttons solicitado pelo Trello");
  return [{
    icon: new URL("./icon.svg", window.location.href).href,
    text: "Baixar tudo",
    callback: abrirModal,
    condition: "always"
  }];
}

console.log("[Smart Downloader] conector carregado");

TrelloPowerUp.initialize(
  { "card-buttons": botoesDoCard },
  { appKey: APP_KEY, appName: APP_NAME }
);
