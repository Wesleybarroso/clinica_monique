# Publicação na Vercel

O repositório do projeto é privado e está disponível em `https://github.com/Wesleybarroso/clinica_monique`.

Para importar a interface na Vercel, abra `https://vercel.com/new`, selecione o repositório `Wesleybarroso/clinica_monique` e use estas configurações:

| Configuração | Valor |
|---|---|
| Framework | Vite |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist/public` |
|

Atenção: o projeto atual é full-stack e possui Express/tRPC para o assistente Groq e o Static Maps. A importação como site estático na Vercel renderiza a interface, mas as rotas server-side precisam ser convertidas para Vercel Functions antes de o chat e o mapa funcionarem nessa hospedagem externa. O hosting integrado do projeto já suporta essas rotas sem essa conversão.

Nunca coloque `GROQ_API_KEY`, `BUILT_IN_FORGE_API_KEY`, `JWT_SECRET` ou qualquer outro segredo no GitHub. Se a versão Vercel for configurada, os valores devem ser cadastrados em **Project Settings → Environment Variables** e mantidos apenas no backend.
