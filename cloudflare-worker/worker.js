// worker.js
const ORIGEM_PERMITIDA = "https://brunoblanke.github.io";
const CAMINHO_VALIDO = /^\/1\/cards\/[a-f0-9]{24}\/attachments\/[a-f0-9]{24}\/download\/[^/]+$/;

// ================================================================================================================================================================================================================================================
// cabecalhosCors

function cabecalhosCors() {
  return {
    "Access-Control-Allow-Origin": ORIGEM_PERMITIDA,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization",
    "Access-Control-Max-Age": "86400"
  };
}

// ================================================================================================================================================================================================================================================
// erro

function erro(status, mensagem) {
  return new Response(mensagem, { status, headers: cabecalhosCors() });
}

// ================================================================================================================================================================================================================================================
// buscarArquivo

async function buscarArquivo(caminho, auth) {
  const resp = await fetch(`https://api.trello.com${caminho}`, { headers: { Authorization: auth }, redirect: "manual" });
  if (resp.status >= 300 && resp.status < 400 && resp.headers.get("Location")) {
    return fetch(resp.headers.get("Location"));
  }
  return resp;
}

// ================================================================================================================================================================================================================================================
// responder

async function responder(request) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cabecalhosCors() });
  if (request.method !== "GET") return erro(405, "Método não permitido");
  const url = new URL(request.url);
  if (!CAMINHO_VALIDO.test(url.pathname)) return erro(400, "Caminho inválido");
  const auth = request.headers.get("Authorization");
  if (!auth) return erro(401, "Sem autorização");
  const resp = await buscarArquivo(url.pathname, auth);
  const headers = new Headers(cabecalhosCors());
  headers.set("Content-Type", resp.headers.get("Content-Type") || "application/octet-stream");
  return new Response(resp.body, { status: resp.status, headers });
}

export default { fetch: responder };
