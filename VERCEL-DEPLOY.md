# ArcheLoot Gear Calculator — Vercel

## Objetivo
Hospedar o calculator fora do DirectAdmin e incorporá-lo no IPS por iframe.

## Opção mais simples: Vercel Drop
1. Extraia este ZIP no computador.
2. Abra https://vercel.com/drop
3. Entre na sua conta Vercel.
4. Arraste a pasta do projeto para a janela do Vercel Drop.
5. Escolha um nome para o projeto, por exemplo `archeloot-gear-calculator`.
6. Aguarde o build. O Vercel detecta Next.js automaticamente.

## Testes depois do deploy
Abra: `/`
Abra: `/embed`
Abra: `/api/health`

O health deve retornar JSON com `ok: true` e `version: v18`.

## Domínio recomendado
Depois que o deploy estiver funcionando, adicione no projeto Vercel:
`gear.mmonexus.com.br`

O Vercel mostrará o registro DNS exato para o subdomínio. Em geral, subdomínios usam CNAME; use sempre o valor mostrado no painel do seu projeto.

## Variável necessária
Em Vercel > Settings > Environment Variables:

`IPS_FRAME_ANCESTORS` = `https://mmonexus.com.br https://www.mmonexus.com.br`

Depois de alterar variável, faça redeploy.

## IPS
Quando o domínio estiver ativo, use:

```html
<iframe src="https://gear.mmonexus.com.br/embed" title="ArcheLoot Gear Calculator" loading="eager" allow="clipboard-write" style="width:100%;min-height:1100px;border:0;"></iframe>
```

No Invision Community 5, o domínio externo precisa estar permitido em **AdminCP > System > Posting & Editor > Embeds** e o grupo administrador precisa ter permissão para embeds externos/iframes.

## GitHub (opcional)
Também é possível importar o projeto por um repositório GitHub. Essa opção é melhor quando você quiser atualizações automáticas a cada alteração no código.
