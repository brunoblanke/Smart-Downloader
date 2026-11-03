// baixar.js
const t = TrelloPowerUp.iframe({ appKey: APP_KEY, appName: APP_NAME });
const api = t.getRestApi();
const statusEl = document.getElementById("status");
const botao = document.getElementById("baixar");
const barra = document.getElementById("barra");
const progresso = document.getElementById("progresso");

// ================================================================================================================================================================================================================================================
// setStatus

function setStatus(msg, tipo) {
  statusEl.textContent = msg;
  statusEl.className = tipo || "";
}

// ================================================================================================================================================================================================================================================
// setProgresso

function setProgresso(fracao) {
  barra.classList.toggle("ativa", fracao !== null);
  progresso.style.width = `${Math.round((fracao || 0) * 100)}%`;
}

// ================================================================================================================================================================================================================================================
// aplicarTema

function aplicarTema() {
  const contexto = t.getContext() || {};
  if (contexto.theme === "dark" || contexto.theme === "light") {
    document.documentElement.dataset.theme = contexto.theme;
  }
}

// ================================================================================================================================================================================================================================================
// mostrarNomeCard

async function mostrarNomeCard() {
  try {
    const card = await t.card("name");
    document.getElementById("card").textContent = card.name;
  } catch (e) {
  }
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
  if (!resp.ok) throw new Error(`HTTP ${resp.status} ${(await resp.text()).slice(0, 120)}`);
  const blob = await resp.blob();
  if (!blob.size) throw new Error("arquivo vazio");
  return blob;
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
  setProgresso(0);
  try {
    const token = await obterToken();
    const card = await t.card("id", "name");
    setStatus("Listando anexos...");
    const anexos = (await listarAnexos(card.id, token)).filter(a => a.isUpload);
    if (!anexos.length) {
      setStatus("Nenhum arquivo anexado neste card.", "erro");
      setProgresso(null);
      return;
    }
    const zip = new JSZip();
    const usados = new Set();
    let falhas = 0;
    let primeiroErro = "";
    for (const [i, anexo] of anexos.entries()) {
      setStatus(`Baixando ${i + 1}/${anexos.length}: ${anexo.name}`);
      try {
        zip.file(nomeSeguro(anexo.fileName || anexo.name, usados), await baixarAnexo(card.id, anexo, token));
      } catch (e) {
        falhas++;
        primeiroErro = primeiroErro || `${anexo.name}: ${e.message}`;
        console.error("[Smart Downloader]", anexo.name, e);
      }
      setProgresso((i + 1) / anexos.length);
    }
    if (falhas === anexos.length) {
      setStatus(`Nenhum arquivo pôde ser baixado. ${primeiroErro}`, "erro");
      return;
    }
    setStatus("Gerando ZIP...");
    const blob = await zip.generateAsync({ type: "blob" });
    salvarBlob(blob, `${nomeSeguro(card.name, new Set())}.zip`);
    const ok = anexos.length - falhas;
    setStatus(falhas ? `${ok} de ${anexos.length} arquivo(s) baixados. ${falhas} falharam. ${primeiroErro}` : `Pronto! ${ok} arquivo(s) baixados.`, falhas ? "erro" : "sucesso");
  } catch (e) {
    setStatus(`Erro: ${e.message}`, "erro");
    setProgresso(null);
  } finally {
    botao.disabled = false;
  }
}

aplicarTema();
mostrarNomeCard();
botao.addEventListener("click", baixarTudo);
