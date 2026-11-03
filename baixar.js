// baixar.js
const t = TrelloPowerUp.iframe({ appKey: APP_KEY, appName: APP_NAME });
const api = t.getRestApi();
const statusEl = document.getElementById("status");
const botao = document.getElementById("baixar");

// ================================================================================================================================================================================================================================================
// setStatus

function setStatus(msg) {
  statusEl.textContent = msg;
}

// ================================================================================================================================================================================================================================================
// obterToken

async function obterToken() {
  if (!(await api.isAuthorized())) {
    await api.authorize({ scope: "read", expiration: "never" });
  }
  return api.getToken();
}

// ================================================================================================================================================================================================================================================
// listarAnexos

async function listarAnexos(idCard, token) {
  const resp = await fetch(`https://api.trello.com/1/cards/${idCard}/attachments?key=${APP_KEY}&token=${token}`);
  if (!resp.ok) throw new Error(`Falha ao listar anexos (${resp.status})`);
  return resp.json();
}

// ================================================================================================================================================================================================================================================
// baixarAnexo

async function baixarAnexo(idCard, anexo, token) {
  const nome = encodeURIComponent(anexo.fileName || anexo.name);
  const resp = await fetch(`https://api.trello.com/1/cards/${idCard}/attachments/${anexo.id}/download/${nome}`, {
    headers: { Authorization: `OAuth oauth_consumer_key="${APP_KEY}", oauth_token="${token}"` }
  });
  if (!resp.ok) throw new Error(`${resp.status}`);
  return resp.blob();
}

// ================================================================================================================================================================================================================================================
// nomeSeguro

function nomeSeguro(nome, usados) {
  const base = nome.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");
  const ponto = base.lastIndexOf(".");
  const raiz = ponto > 0 ? base.slice(0, ponto) : base;
  const ext = ponto > 0 ? base.slice(ponto) : "";
  let final = base;
  let i = 1;
  while (usados.has(final)) final = `${raiz} (${i++})${ext}`;
  usados.add(final);
  return final;
}

// ================================================================================================================================================================================================================================================
// salvarBlob

function salvarBlob(blob, nome) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

// ================================================================================================================================================================================================================================================
// baixarTudo

async function baixarTudo() {
  botao.disabled = true;
  try {
    const token = await obterToken();
    const card = await t.card("id", "name");
    setStatus("Listando anexos...");
    const anexos = (await listarAnexos(card.id, token)).filter(a => a.isUpload);
    if (!anexos.length) {
      setStatus("Nenhum arquivo anexado neste card.");
      return;
    }
    const zip = new JSZip();
    const usados = new Set();
    let falhas = 0;
    for (const [i, anexo] of anexos.entries()) {
      setStatus(`Baixando ${i + 1}/${anexos.length}: ${anexo.name}`);
      try {
        zip.file(nomeSeguro(anexo.fileName || anexo.name, usados), await baixarAnexo(card.id, anexo, token));
      } catch (e) {
        falhas++;
      }
    }
    setStatus("Gerando ZIP...");
    const blob = await zip.generateAsync({ type: "blob" });
    salvarBlob(blob, `${nomeSeguro(card.name, new Set())}.zip`);
    setStatus(falhas ? `Concluído, mas ${falhas} arquivo(s) falharam.` : "Concluído!");
  } catch (e) {
    setStatus(`Erro: ${e.message}`);
  } finally {
    botao.disabled = false;
  }
}

botao.addEventListener("click", baixarTudo);
