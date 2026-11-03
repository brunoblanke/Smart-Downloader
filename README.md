# Smart Downloader

Power-Up do Trello que adiciona o botão **Baixar tudo** nos cards e baixa todos os anexos em um único `.zip`.

## Hospedagem

GitHub Pages (branch `main`, pasta raiz):

```
https://brunoblanke.github.io/Smart-Downloader/
```

## Configuração no Trello

1. Em https://trello.com/power-ups/admin, crie o app com **"Meu aplicativo usará recursos de Power-up"**.
2. **URL de conector Iframe:** `https://brunoblanke.github.io/Smart-Downloader/`
3. Aba **Recursos (Capabilities):** ative **Card buttons**.
4. Aba **Chave de API:** gere a key, cole em `config.js` e adicione `https://brunoblanke.github.io` em **Origens permitidas**.
5. No board: **Power-Ups → Personalizado → Smart Downloader → Adicionar**.

## Como usar

1. Abra o card.
2. Na barra inferior, clique em **Power-ups → Baixar tudo**.
3. Clique em **Baixar tudo em .zip** (na primeira vez, autorize o app).

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` / `client.js` | Conector: registra o botão do card |
| `baixar.html` / `baixar.js` | Modal: autoriza, baixa os anexos e gera o ZIP |
| `config.js` | API Key e nome do app |
| `icon.svg` | Ícone do botão |

## Proxy (Cloudflare Worker)

O Trello não libera o download dos arquivos direto pelo navegador (CORS), então os downloads passam por um Worker gratuito da Cloudflare.

1. Em https://dash.cloudflare.com, abra **Workers & Pages → Create → Create Worker**, dê o nome `smart-downloader` e clique em **Deploy**.
2. Clique em **Edit code**, substitua tudo pelo conteúdo de `cloudflare-worker/worker.js` e clique em **Deploy**.
3. Copie a URL do Worker (ex.: `https://smart-downloader.SEU-USUARIO.workers.dev`) e coloque em `PROXY_URL` no `config.js`.

O Worker só aceita pedidos vindos de `https://brunoblanke.github.io` e só repassa caminhos de download de anexos do Trello.
