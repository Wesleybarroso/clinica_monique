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

A rota serverless `/api/chat` foi adicionada para o assistente Groq. Na Vercel, cadastre `GROQ_API_KEY` em **Project Settings → Environment Variables** para Production, Preview e Development. O mapa usa fallback público em `/images/clinic-map-static.jpg`, enquanto o endpoint server-side Static Maps continua opcional.

O restante do backend Express/tRPC do projeto não é publicado como um servidor Express tradicional na Vercel por esta configuração estática; o chat usa a função `/api/chat` dedicada. O hosting integrado do projeto continua sendo a opção recomendada para manter todas as rotas tRPC sem adaptação adicional.

Nunca coloque `GROQ_API_KEY`, `BUILT_IN_FORGE_API_KEY`, `JWT_SECRET` ou qualquer outro segredo no GitHub. Se a versão Vercel for configurada, os valores devem ser cadastrados em **Project Settings → Environment Variables** e mantidos apenas no backend.
