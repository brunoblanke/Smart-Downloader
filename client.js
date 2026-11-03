// client.js

// ================================================================================================================================================================================================================================================
// abrirModal

function abrirModal(t) {
  return t.modal({
    url: "./baixar.html?v=4",
    height: 340
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
