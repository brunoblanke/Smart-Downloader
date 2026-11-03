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
  return [{
    icon: new URL("./icon.svg", window.location.href).href,
    text: "Baixar tudo",
    callback: abrirModal
  }];
}

TrelloPowerUp.initialize(
  { "card-buttons": botoesDoCard },
  { appKey: APP_KEY, appName: APP_NAME }
);
