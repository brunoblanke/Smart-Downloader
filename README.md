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
